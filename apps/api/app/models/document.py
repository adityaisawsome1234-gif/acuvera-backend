from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.enums import DocumentStatus


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    facility_id = Column(String, ForeignKey("facilities.id"), nullable=True)
    case_id = Column(String, ForeignKey("cases.id"), nullable=True)
    name = Column(String, nullable=False)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.uploaded, nullable=False)
    storage_path = Column(Text, nullable=False)
    uploaded_by = Column(String, ForeignKey("users.id"), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    processed_at = Column(DateTime, nullable=True)

    organization = relationship("Organization", back_populates="documents")
    facility = relationship("Facility", back_populates="documents")
    case = relationship("Case", back_populates="documents")
    uploaded_by_user = relationship("User", back_populates="documents")
    pages = relationship("DocumentPage", back_populates="document", cascade="all,delete")
    extraction = relationship("ExtractionResult", back_populates="document", uselist=False)
    findings = relationship("AuditFinding", back_populates="document", cascade="all,delete")
