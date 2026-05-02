from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.enums import CasePriority, CaseStatus


class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    title = Column(String, nullable=False)
    status = Column(Enum(CaseStatus), default=CaseStatus.open, nullable=False)
    priority = Column(Enum(CasePriority), default=CasePriority.medium, nullable=False)
    assignee_id = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    organization = relationship("Organization", back_populates="cases")
    assignee = relationship("User", back_populates="assigned_cases")
    items = relationship("CaseItem", back_populates="case", cascade="all,delete")
    documents = relationship("Document", back_populates="case")
