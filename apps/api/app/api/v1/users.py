from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_org_role
from app.core.database import get_db
from datetime import datetime

from app.core.security import generate_token, get_password_hash, hash_token
from app.models import ActivityLog, OrgUser, User, UserRole
from app.utils.email import send_email
from app.schemas.user import UserCreate, UserOut

router = APIRouter()


@router.get("/orgs/{org_id}/users", response_model=list[UserOut])
def list_users(org_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    require_org_role(org_id, UserRole.viewer, db, current_user)
    users = (
        db.query(User)
        .join(OrgUser, OrgUser.user_id == User.id)
        .filter(OrgUser.org_id == org_id)
        .all()
    )
    return users


@router.post("/orgs/{org_id}/users", response_model=UserOut)
def create_user(
    org_id: str, payload: UserCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    require_org_role(org_id, UserRole.admin, db, current_user)
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
    user = User(
        email=payload.email,
        name=payload.name,
        hashed_password=get_password_hash(payload.password),
        is_email_verified=False,
    )
    db.add(user)
    db.flush()
    membership = OrgUser(org_id=org_id, user_id=user.id, role=UserRole.viewer)
    db.add(membership)
    token = generate_token()
    user.email_verification_token = hash_token(token)
    user.email_verification_sent_at = datetime.utcnow()
    send_email(
        to_email=user.email,
        subject="Verify your Acuvera account",
        body=f"Use this token to verify your email: {token}",
    )
    db.add(
        ActivityLog(
            org_id=org_id,
            actor_id=current_user.id,
            entity_type="user",
            entity_id=user.id,
            action="invited",
        )
    )
    db.commit()
    db.refresh(user)
    return user
