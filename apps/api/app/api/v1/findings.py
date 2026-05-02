from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_org_role
from app.core.database import get_db
from app.models import AuditFinding, Document, UserRole
from app.schemas.finding import FindingOut

router = APIRouter()


@router.get("/orgs/{org_id}/findings", response_model=list[FindingOut])
def list_findings(org_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    require_org_role(org_id, UserRole.viewer, db, current_user)
    findings = (
        db.query(AuditFinding)
        .join(Document, Document.id == AuditFinding.document_id)
        .filter(Document.org_id == org_id)
        .all()
    )
    return findings
