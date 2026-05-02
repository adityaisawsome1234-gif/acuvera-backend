from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class RetentionPolicy(Base):
    __tablename__ = "retention_policies"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False, unique=True)
    document_retention_days = Column(Integer, default=365, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    organization = relationship("Organization", back_populates="retention_policy")
