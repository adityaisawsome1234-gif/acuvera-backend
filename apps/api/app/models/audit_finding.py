from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.enums import FindingCategory, FindingSeverity


class AuditFinding(Base):
    __tablename__ = "audit_findings"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    extraction_id = Column(String, ForeignKey("extraction_results.id"), nullable=True)
    category = Column(Enum(FindingCategory), nullable=False)
    severity = Column(Enum(FindingSeverity), nullable=False)
    summary = Column(String, nullable=False)
    detail = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    document = relationship("Document", back_populates="findings")
    extraction = relationship("ExtractionResult", back_populates="findings")
    case_items = relationship("CaseItem", back_populates="finding")
