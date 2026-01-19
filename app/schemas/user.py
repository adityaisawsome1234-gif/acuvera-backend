from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "PATIENT"
    organization_id: Optional[int] = None


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool
    organization_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

