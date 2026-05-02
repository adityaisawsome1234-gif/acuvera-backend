from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import FindingCategory, FindingSeverity


class FindingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str
    category: FindingCategory
    severity: FindingSeverity
    summary: str
    detail: Optional[str]
    created_at: datetime
