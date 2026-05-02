from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class CaseItem(Base):
    __tablename__ = "case_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    finding_id = Column(String, ForeignKey("audit_findings.id"), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    case = relationship("Case", back_populates="items")
    finding = relationship("AuditFinding", back_populates="case_items")
