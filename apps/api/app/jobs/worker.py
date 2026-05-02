from datetime import datetime

from app.core.database import SessionLocal
from app.models import ActivityLog, AuditFinding, Document, DocumentStatus, ExtractionResult
from app.pipeline import audit, extract
from app.storage import get_storage_adapter


def process_document_job(document_id: str) -> None:
    db = SessionLocal()
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            return

        storage = get_storage_adapter()
        local_path = storage.get_local_path(document.storage_path)
        extraction_payload = extract(local_path)

        extraction = ExtractionResult(
            document_id=document.id,
            extractor_version="stub-v1",
            result_json=extraction_payload,
            confidence=extraction_payload.get("confidence", 0.0),
        )
        db.add(extraction)
        db.flush()

        findings_payload = audit(extraction_payload)
        for finding in findings_payload:
            db.add(
                AuditFinding(
                    document_id=document.id,
                    extraction_id=extraction.id,
                    category=finding["category"],
                    severity=finding["severity"],
                    summary=finding["summary"],
                    detail=finding.get("detail"),
                )
            )

        document.status = DocumentStatus.completed
        document.processed_at = datetime.utcnow()
        db.add(
            ActivityLog(
                org_id=document.org_id,
                actor_id=document.uploaded_by,
                entity_type="document",
                entity_id=document.id,
                action="processed",
            )
        )
        db.commit()
    except Exception as exc:
        db.rollback()
        document = db.query(Document).filter(Document.id == document_id).first()
        if document:
            document.status = DocumentStatus.failed
            db.add(
                ActivityLog(
                    org_id=document.org_id,
                    actor_id=document.uploaded_by,
                    entity_type="document",
                    entity_id=document.id,
                    action="failed",
                    detail=str(exc),
                )
            )
            db.commit()
    finally:
        db.close()
