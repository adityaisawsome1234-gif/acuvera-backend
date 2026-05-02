from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String, nullable=False)
    join_code = Column(String, unique=True, nullable=False, default=lambda: str(uuid4())[:8])
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    facilities = relationship("Facility", back_populates="organization", cascade="all,delete")
    members = relationship("OrgUser", back_populates="organization", cascade="all,delete")
    documents = relationship("Document", back_populates="organization", cascade="all,delete")
    cases = relationship("Case", back_populates="organization", cascade="all,delete")
    retention_policy = relationship(
        "RetentionPolicy", back_populates="organization", uselist=False, cascade="all,delete"
    )
