from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    generate_token,
    get_password_hash,
    hash_token,
    verify_password,
)
from app.models import ActivityLog, OrgUser, Organization, User, UserRole
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    OrgSummary,
    PasswordResetConfirm,
    PasswordResetRequest,
    RegisterRequest,
    RegisterResponse,
    UserSummary,
    VerifyEmailRequest,
)
from app.utils.email import send_email

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_email_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Email not verified")
    memberships = (
        db.query(OrgUser, Organization)
        .join(Organization, OrgUser.org_id == Organization.id)
        .filter(OrgUser.user_id == user.id)
        .all()
    )
    orgs = [OrgSummary(id=org.id, name=org.name) for _, org in memberships]
    token = create_access_token({"sub": user.id})
    if orgs:
        db.add(
            ActivityLog(
                org_id=orgs[0].id,
                actor_id=user.id,
                entity_type="user",
                entity_id=user.id,
                action="login",
            )
        )
        db.commit()
    return LoginResponse(
        access_token=token,
        user=UserSummary(id=user.id, email=user.email, name=user.name, orgs=orgs),
    )


@router.post("/register", response_model=RegisterResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if bool(payload.org_name) == bool(payload.join_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide either org_name or join_code",
        )
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already in use")

    if payload.org_name:
        org = Organization(name=payload.org_name)
        db.add(org)
        db.flush()
        role = UserRole.admin
    else:
        org = db.query(Organization).filter(Organization.join_code == payload.join_code).first()
        if not org:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Join code not found")
        role = UserRole.viewer

    user = User(
        email=payload.email,
        name=payload.name,
        hashed_password=get_password_hash(payload.password),
        is_active=True,
        is_email_verified=False,
    )
    db.add(user)
    db.flush()
    membership = OrgUser(org_id=org.id, user_id=user.id, role=role)
    db.add(membership)

    token = generate_token()
    user.email_verification_token = hash_token(token)
    user.email_verification_sent_at = datetime.utcnow()

    send_email(
        to_email=user.email,
        subject="Verify your Acuvera account",
        body=(
            "Use the following token to verify your email:\n\n"
            f"{token}\n\n"
            f"Or visit: {settings.FRONTEND_URL}/verify?email={user.email}&token={token}"
        ),
    )

    db.add(
        ActivityLog(
            org_id=org.id,
            actor_id=user.id,
            entity_type="user",
            entity_id=user.id,
            action="register",
        )
    )
    db.commit()

    return RegisterResponse(
        user=UserSummary(id=user.id, email=user.email, name=user.name, orgs=[OrgSummary(id=org.id, name=org.name)]),
        org=OrgSummary(id=org.id, name=org.name),
        email_verification_sent_at=user.email_verification_sent_at,
    )


@router.post("/verify")
def verify_email(payload: VerifyEmailRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.email_verification_token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Verification token not found")
    if user.email_verification_token != hash_token(payload.token):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
    user.is_email_verified = True
    user.email_verification_token = None
    user.email_verification_sent_at = None
    db.add(user)
    db.commit()
    return {"success": True}


@router.post("/password-reset/request")
def request_password_reset(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        return {"success": True}
    token = generate_token()
    user.password_reset_token = hash_token(token)
    user.password_reset_sent_at = datetime.utcnow()
    db.add(user)
    db.commit()
    send_email(
        to_email=user.email,
        subject="Reset your Acuvera password",
        body=(
            "Use the following token to reset your password:\n\n"
            f"{token}\n\n"
            f"Or visit: {settings.FRONTEND_URL}/reset-password?email={user.email}&token={token}"
        ),
    )
    return {"success": True}


@router.post("/password-reset/confirm")
def confirm_password_reset(payload: PasswordResetConfirm, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.password_reset_token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reset token not found")
    if user.password_reset_token != hash_token(payload.token):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
    if user.password_reset_sent_at:
        expires_at = user.password_reset_sent_at + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_MINUTES)
        if datetime.utcnow() > expires_at:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token expired")
    user.hashed_password = get_password_hash(payload.new_password)
    user.password_reset_token = None
    user.password_reset_sent_at = None
    db.add(user)
    db.commit()
    return {"success": True}


@router.get("/me", response_model=UserSummary)
def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    memberships = (
        db.query(OrgUser, Organization)
        .join(Organization, OrgUser.org_id == Organization.id)
        .filter(OrgUser.user_id == current_user.id)
        .all()
    )
    orgs = [OrgSummary(id=org.id, name=org.name) for _, org in memberships]
    return UserSummary(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        orgs=orgs,
    )


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    membership = db.query(OrgUser).filter(OrgUser.user_id == current_user.id).first()
    if membership:
        db.add(
            ActivityLog(
                org_id=membership.org_id,
                actor_id=current_user.id,
                entity_type="user",
                entity_id=current_user.id,
                action="logout",
            )
        )
        db.commit()
    return {"success": True}
