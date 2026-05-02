from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_email_verified = Column(Boolean, default=False, nullable=False)
    email_verification_token = Column(String, nullable=True)
    email_verification_sent_at = Column(DateTime, nullable=True)
    password_reset_token = Column(String, nullable=True)
    password_reset_sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    org_memberships = relationship("OrgUser", back_populates="user", cascade="all,delete")
    documents = relationship("Document", back_populates="uploaded_by_user")
    assigned_cases = relationship("Case", back_populates="assignee")
    activity = relationship("ActivityLog", back_populates="actor")
