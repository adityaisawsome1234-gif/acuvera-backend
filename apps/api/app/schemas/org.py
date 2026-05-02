from datetime import datetime
from pydantic import BaseModel, ConfigDict


class OrgCreate(BaseModel):
    name: str


class OrgOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    join_code: str
    created_at: datetime
