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
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

