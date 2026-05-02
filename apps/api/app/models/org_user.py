from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.enums import UserRole


class OrgUser(Base):
    __tablename__ = "org_users"
    __table_args__ = (UniqueConstraint("org_id", "user_id", name="uq_org_user"),)

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.viewer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="org_memberships")
