from pydantic import BaseModel
from datetime import datetime


class LineItemResponse(BaseModel):
    id: int
    bill_id: int
    description: str
    code: Optional[str]
    quantity: float
    unit_price: float
    total_price: float
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

