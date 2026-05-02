from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import CasePriority, CaseStatus


class CaseCreate(BaseModel):
    title: str
    priority: CasePriority = CasePriority.medium


class CaseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    title: str
    status: CaseStatus
    priority: CasePriority
    assignee_id: Optional[str]
    created_at: datetime
