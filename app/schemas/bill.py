from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.finding import FindingResponse
from app.schemas.line_item import LineItemResponse


class BillCreate(BaseModel):
    patient_id: int
    organization_id: Optional[int] = None


class BillUpload(BaseModel):
    file_name: str
    file_type: str


class BillResponse(BaseModel):
    id: int
    patient_id: int
    organization_id: Optional[int]
    file_name: str
    file_type: str
    total_amount: Optional[float]
    status: str
    uploaded_at: datetime
    analyzed_at: Optional[datetime]
    created_at: datetime
    line_items: List[LineItemResponse] = []
    findings: List[FindingResponse] = []

    class Config:
        from_attributes = True
        populate_by_name = True


class BillListResponse(BaseModel):
    id: int
    patient_id: int
    organization_id: Optional[int]
    file_name: str
    file_type: str
    total_amount: Optional[float]
    status: str
    uploaded_at: datetime
    analyzed_at: Optional[datetime]
    findings_count: int = 0
    estimated_savings: float = 0.0

    class Config:
        from_attributes = True
        populate_by_name = True

