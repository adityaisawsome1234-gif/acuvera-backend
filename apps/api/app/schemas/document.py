from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

from app.models.enums import DocumentStatus


class DocumentCreate(BaseModel):
    name: str
    storage_path: str
    facility_id: Optional[str] = None
    case_id: Optional[str] = None


class DocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    case_id: Optional[str]
    name: str
    status: DocumentStatus
    storage_path: str
    uploaded_at: datetime
    processed_at: Optional[datetime]


class DocumentUploadResponse(BaseModel):
    document: DocumentOut
    case_id: Optional[str]
