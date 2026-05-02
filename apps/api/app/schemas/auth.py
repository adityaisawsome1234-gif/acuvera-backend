from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    name: str
    password: str
    org_name: Optional[str] = None
    join_code: Optional[str] = None


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    token: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    email: EmailStr
    token: str
    new_password: str


class OrgSummary(BaseModel):
    id: str
    name: str


class UserSummary(BaseModel):
    id: str
    email: EmailStr
    name: str
    orgs: List[OrgSummary]


class RegisterResponse(BaseModel):
    user: UserSummary
    org: OrgSummary
    email_verification_sent_at: datetime


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserSummary
