from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_org_role
from app.core.database import get_db
from app.models import (
    AuditFinding,
    Case,
    Document,
    DocumentStatus,
    OrgUser,
    Organization,
    RetentionPolicy,
    UserRole,
)
from app.schemas.org import OrgCreate, OrgOut
from app.schemas.retention import RetentionPolicyOut, RetentionPolicyUpdate
from app.schemas.stats import OrgStatsOut

router = APIRouter()


@router.get("/", response_model=list[OrgOut])
def list_orgs(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    orgs = (
        db.query(Organization)
        .join(OrgUser, OrgUser.org_id == Organization.id)
        .filter(OrgUser.user_id == current_user.id)
        .all()
    )
    return orgs


@router.post("/", response_model=OrgOut)
def create_org(payload: OrgCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    org = Organization(name=payload.name)
    db.add(org)
    db.flush()
    membership = OrgUser(org_id=org.id, user_id=current_user.id, role=UserRole.admin)
    db.add(membership)
    db.commit()
    db.refresh(org)
    return org


@router.get("/orgs/{org_id}/stats", response_model=OrgStatsOut)
def org_stats(org_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    require_org_role(org_id, UserRole.viewer, db, current_user)
    documents_total = db.query(Document).filter(Document.org_id == org_id).count()
    documents_processing = (
        db.query(Document)
        .filter(Document.org_id == org_id, Document.status == DocumentStatus.processing)
        .count()
    )
    findings_total = (
        db.query(AuditFinding)
        .join(Document, Document.id == AuditFinding.document_id)
        .filter(Document.org_id == org_id)
        .count()
    )
    cases_total = db.query(Case).filter(Case.org_id == org_id).count()
    return OrgStatsOut(
        documents_total=documents_total,
        documents_processing=documents_processing,
        findings_total=findings_total,
        cases_total=cases_total,
    )


@router.get("/orgs/{org_id}/retention", response_model=RetentionPolicyOut)
def get_retention(org_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    require_org_role(org_id, UserRole.manager, db, current_user)
    policy = db.query(RetentionPolicy).filter(RetentionPolicy.org_id == org_id).first()
    if not policy:
        policy = RetentionPolicy(org_id=org_id)
        db.add(policy)
        db.commit()
        db.refresh(policy)
    return policy


@router.put("/orgs/{org_id}/retention", response_model=RetentionPolicyOut)
def update_retention(
    org_id: str,
    payload: RetentionPolicyUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_org_role(org_id, UserRole.manager, db, current_user)
    policy = db.query(RetentionPolicy).filter(RetentionPolicy.org_id == org_id).first()
    if not policy:
        policy = RetentionPolicy(org_id=org_id)
        db.add(policy)
    policy.document_retention_days = payload.document_retention_days
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy
