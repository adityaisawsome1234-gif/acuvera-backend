from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class FindingType(str, enum.Enum):
    DUPLICATE_CHARGE = "DUPLICATE_CHARGE"
    INCORRECT_CODING = "INCORRECT_CODING"
    OVERCHARGE = "OVERCHARGE"
    MISSING_DISCOUNT = "MISSING_DISCOUNT"
    DENIAL_RISK = "DENIAL_RISK"
    OTHER = "OTHER"


class FindingSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    bill_id = Column(Integer, ForeignKey("bills.id"), nullable=False)
    type = Column(Enum(FindingType), nullable=False)
    severity = Column(Enum(FindingSeverity), nullable=False)
    confidence = Column(Float, nullable=False)  # 0.0 to 1.0
    estimated_savings = Column(Float, nullable=False)
    explanation = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    line_item_id = Column(Integer, ForeignKey("line_items.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    bill = relationship("Bill", back_populates="findings")
    line_item = relationship("LineItem", back_populates="findings")

