from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, ForeignKey, JSON, Numeric, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class ExtractionResult(Base):
    __tablename__ = "extraction_results"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    extractor_version = Column(String, nullable=False)
    result_json = Column(JSON, nullable=False)
    confidence = Column(Numeric(5, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    document = relationship("Document", back_populates="extraction")
    findings = relationship("AuditFinding", back_populates="extraction")
