import os

from app.core.security import get_password_hash
from app.core.config import settings
from app.jobs.worker import process_document_job
from app.models import (
    ActivityLog,
    AuditFinding,
    Document,
    DocumentStatus,
    Organization,
    OrgUser,
    User,
    UserRole,
)


def test_worker_processes_document(db_session):
    org = Organization(name="Org Worker")
    user = User(
        email="worker@acuvera.dev", name="worker", hashed_password=get_password_hash("pw")
    )
    db_session.add_all([org, user])
    db_session.flush()
    db_session.add(OrgUser(org_id=org.id, user_id=user.id, role=UserRole.analyst))

    storage_path = "test/document.pdf"
    full_path = os.path.join(settings.UPLOAD_DIR, storage_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as handle:
        handle.write("stub")

    document = Document(
        org_id=org.id,
        name="document.pdf",
        storage_path=storage_path,
        uploaded_by=user.id,
        status=DocumentStatus.processing,
    )
    db_session.add(document)
    db_session.commit()

    process_document_job(document.id)

    db_session.expire_all()
    refreshed = db_session.query(Document).filter(Document.id == document.id).first()
    assert refreshed.status == DocumentStatus.completed
    assert refreshed.processed_at is not None

    findings = db_session.query(AuditFinding).filter(AuditFinding.document_id == document.id).all()
    assert len(findings) >= 1

    activity = (
        db_session.query(ActivityLog)
        .filter(ActivityLog.entity_id == document.id, ActivityLog.action == "processed")
        .first()
    )
    assert activity is not None
