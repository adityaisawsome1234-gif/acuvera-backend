from app.services.ai_provider import audit_findings


def audit(extraction: dict) -> list[dict]:
    return audit_findings(extraction)
