import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    manager = "manager"
    analyst = "analyst"
    viewer = "viewer"


class DocumentStatus(str, enum.Enum):
    uploaded = "uploaded"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class FindingSeverity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class FindingCategory(str, enum.Enum):
    coding = "coding"
    coverage = "coverage"
    billing = "billing"
    policy = "policy"
    clinical = "clinical"
    duplicate = "duplicate"
    compliance = "compliance"
    other = "other"


class CaseStatus(str, enum.Enum):
    open = "open"
    in_review = "in_review"
    closed = "closed"


class CasePriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
