from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FindingResponse(BaseModel):
    id: int
    bill_id: int
    type: str
    severity: str
    confidence: float
    estimated_savings: float
    explanation: str
    recommended_action: str
    line_item_id: Optional[int]
    model_agreement: Optional[str] = None
    validated_by: Optional[str] = None
    review_status: Optional[str] = None
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    review_note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True


class FindingReviewRequest(BaseModel):
    status: str   # ACCEPTED | REJECTED | ESCALATED
    note: Optional[str] = None

