from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    actor_id: Optional[str]
    entity_type: str
    entity_id: str
    action: str
    detail: Optional[str]
    created_at: datetime
