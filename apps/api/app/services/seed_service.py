from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models import OrgUser, Organization, User, UserRole


def seed_default_org_admin() -> None:
    db = SessionLocal()
    try:
        org = db.query(Organization).filter(Organization.name == settings.DEFAULT_ORG_NAME).first()
        if not org:
            org = Organization(name=settings.DEFAULT_ORG_NAME)
            db.add(org)
            db.flush()

        user = db.query(User).filter(User.email == settings.DEFAULT_ADMIN_EMAIL).first()
        if not user:
            user = User(
                email=settings.DEFAULT_ADMIN_EMAIL,
                name="Admin",
                hashed_password=get_password_hash(settings.DEFAULT_ADMIN_PASSWORD),
                is_email_verified=True,
            )
            db.add(user)
            db.flush()

        membership = (
            db.query(OrgUser)
            .filter(OrgUser.org_id == org.id, OrgUser.user_id == user.id)
            .first()
        )
        if not membership:
            membership = OrgUser(org_id=org.id, user_id=user.id, role=UserRole.admin)
            db.add(membership)
        db.commit()
    finally:
        db.close()
