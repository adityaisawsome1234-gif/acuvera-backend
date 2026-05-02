from datetime import datetime
import os
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from redis import Redis
from rq import Queue
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_org_role
from app.core.config import settings
from app.core.database import get_db
from app.jobs.worker import process_document_job
from app.models import ActivityLog, Case, CasePriority, CaseStatus, Document, DocumentStatus, UserRole
from app.schemas.document import DocumentCreate, DocumentOut, DocumentUploadResponse
from app.storage import get_storage_adapter

router = APIRouter()


@router.get("/orgs/{org_id}/documents", response_model=list[DocumentOut])
def list_documents(org_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    require_org_role(org_id, UserRole.viewer, db, current_user)
    documents = db.query(Document).filter(Document.org_id == org_id).all()
    return documents


@router.post("/orgs/{org_id}/documents", response_model=DocumentOut)
def create_document(
    org_id: str, payload: DocumentCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    require_org_role(org_id, UserRole.analyst, db, current_user)
    document = Document(
        org_id=org_id,
        name=payload.name,
        storage_path=payload.storage_path,
        facility_id=payload.facility_id,
        case_id=payload.case_id,
        uploaded_by=current_user.id,
    )
    db.add(document)
    db.flush()
    db.add(
        ActivityLog(
            org_id=org_id,
            actor_id=current_user.id,
            entity_type="document",
            entity_id=document.id,
            action="created",
        )
    )
    db.commit()
    db.refresh(document)
    return document


@router.get("/orgs/{org_id}/documents/{document_id}", response_model=DocumentOut)
def get_document(
    org_id: str, document_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    require_org_role(org_id, UserRole.viewer, db, current_user)
    document = db.query(Document).filter(Document.org_id == org_id, Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    db.add(
        ActivityLog(
            org_id=org_id,
            actor_id=current_user.id,
            entity_type="document",
            entity_id=document.id,
            action="viewed",
        )
    )
    db.commit()
    return document


@router.post("/orgs/{org_id}/documents/upload", response_model=DocumentUploadResponse)
def upload_document(
    org_id: str,
    file: UploadFile = File(...),
    case_id: Optional[str] = Form(None),
    case_title: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_org_role(org_id, UserRole.analyst, db, current_user)

    allowed_types = {"application/pdf", "image/jpeg", "image/png"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

    file.file.seek(0, os.SEEK_END)
    size_bytes = file.file.tell()
    file.file.seek(0)
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if size_bytes > max_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large")

    if case_id:
        case = db.query(Case).filter(Case.id == case_id, Case.org_id == org_id).first()
        if not case:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    else:
        title = case_title or f"Case for {file.filename}"
        case = Case(org_id=org_id, title=title, status=CaseStatus.open, priority=CasePriority.medium)
        db.add(case)
        db.flush()

    storage = get_storage_adapter()
    ext = os.path.splitext(file.filename or "")[1].lower().strip(".") or "dat"
    storage_key = f"{org_id}/{uuid4()}.{ext}"
    storage_path = storage.store_fileobj(file.file, storage_key)

    document = Document(
        org_id=org_id,
        case_id=case.id,
        name=file.filename or "upload",
        storage_path=storage_path,
        uploaded_by=current_user.id,
    )
    db.add(document)
    db.flush()
    db.add(
        ActivityLog(
            org_id=org_id,
            actor_id=current_user.id,
            entity_type="document",
            entity_id=document.id,
            action="uploaded",
        )
    )
    db.commit()
    db.refresh(document)
    return DocumentUploadResponse(document=document, case_id=case.id)


@router.post("/orgs/{org_id}/documents/{document_id}/process")
def enqueue_processing(
    org_id: str, document_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    require_org_role(org_id, UserRole.analyst, db, current_user)
    document = db.query(Document).filter(Document.org_id == org_id, Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    if document.status == DocumentStatus.processing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Document already processing")
    document.status = DocumentStatus.processing
    db.add(
        ActivityLog(
            org_id=org_id,
            actor_id=current_user.id,
            entity_type="document",
            entity_id=document.id,
            action="queued",
        )
    )
    db.commit()

    redis_conn = Redis.from_url(settings.REDIS_URL)
    queue = Queue("default", connection=redis_conn)
    queue.enqueue(process_document_job, document_id)
    return {"success": True, "data": {"status": "queued"}}
