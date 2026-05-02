from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_org_role
from app.core.database import get_db
from app.models import ActivityLog, UserRole
from app.schemas.audit_log import AuditLogOut

router = APIRouter()


@router.get("/orgs/{org_id}/audit-log", response_model=list[AuditLogOut])
def list_audit_log(org_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    require_org_role(org_id, UserRole.viewer, db, current_user)
    return (
        db.query(ActivityLog)
        .filter(ActivityLog.org_id == org_id)
        .order_by(ActivityLog.created_at.desc())
        .all()
    )
