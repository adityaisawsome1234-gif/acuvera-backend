from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_org_role
from app.core.database import get_db
from app.models import Case, UserRole
from app.schemas.case import CaseCreate, CaseOut

router = APIRouter()


@router.get("/orgs/{org_id}/cases", response_model=list[CaseOut])
def list_cases(org_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    require_org_role(org_id, UserRole.viewer, db, current_user)
    return db.query(Case).filter(Case.org_id == org_id).all()


@router.post("/orgs/{org_id}/cases", response_model=CaseOut)
def create_case(
    org_id: str, payload: CaseCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    require_org_role(org_id, UserRole.manager, db, current_user)
    case = Case(org_id=org_id, title=payload.title, priority=payload.priority)
    db.add(case)
    db.commit()
    db.refresh(case)
    return case
