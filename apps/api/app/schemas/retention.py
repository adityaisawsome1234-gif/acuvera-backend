from datetime import datetime
from pydantic import BaseModel, ConfigDict


class RetentionPolicyUpdate(BaseModel):
    document_retention_days: int


class RetentionPolicyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    document_retention_days: int
    created_at: datetime
    updated_at: datetime
