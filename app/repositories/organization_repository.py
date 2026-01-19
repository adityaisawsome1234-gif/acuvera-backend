from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.organization import Organization


class OrganizationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, org_id: int) -> Optional[Organization]:
        return self.db.query(Organization).filter(Organization.id == org_id).first()

    def get_all(self) -> List[Organization]:
        return self.db.query(Organization).all()

    def create(self, name: str) -> Organization:
        org = Organization(name=name)
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        return org

    def update(self, org: Organization) -> Organization:
        self.db.commit()
        self.db.refresh(org)
        return org

