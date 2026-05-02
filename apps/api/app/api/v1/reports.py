from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_org_role
from app.core.database import get_db
from app.models import UserRole
from app.schemas.report import ReportOut

router = APIRouter()


@router.get("/orgs/{org_id}/reports", response_model=list[ReportOut])
def list_reports(org_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    require_org_role(org_id, UserRole.viewer, db, current_user)
    return []
