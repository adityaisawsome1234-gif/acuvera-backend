from sqlalchemy.orm import Session
from datetime import datetime
from app.repositories.user_repository import UserRepository
from app.repositories.organization_repository import OrganizationRepository
from app.repositories.bill_repository import BillRepository
from app.repositories.analysis_job_repository import AnalysisJobRepository
from app.core.security import get_password_hash
from app.models.user import UserRole
from app.models.bill import BillStatus
from app.models.finding import Finding, FindingType, FindingSeverity
from app.models.line_item import LineItem
from app.models.analysis_job import JobStatus
from app.services.analysis_service import AnalysisService


class SeedService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.org_repo = OrganizationRepository(db)
        self.bill_repo = BillRepository(db)
        self.job_repo = AnalysisJobRepository(db)

    def seed_demo_data(self) -> dict:
        """Seed demo data for testing"""
        users_created = 0
        bills_created = 0
        
        # Create demo organization
        demo_org = self.org_repo.get_by_id(1)
        if not demo_org:
            demo_org = self.org_repo.create(name="Demo Medical Center")
        
        # Create demo patient
        patient = self.user_repo.get_by_email("patient@demo.com")
        if not patient:
            patient = self.user_repo.create(
                email="patient@demo.com",
                hashed_password=get_password_hash("demo123"),
                full_name="Demo Patient",
                role=UserRole.PATIENT
            )
            users_created += 1
        
        # Create demo provider
        provider = self.user_repo.get_by_email("provider@demo.com")
        if not provider:
            provider = self.user_repo.create(
                email="provider@demo.com",
                hashed_password=get_password_hash("demo123"),
                full_name="Demo Provider",
                role=UserRole.PROVIDER,
                organization_id=demo_org.id
            )
            users_created += 1
        
        # Create demo admin
        admin = self.user_repo.get_by_email("admin@demo.com")
        if not admin:
            admin = self.user_repo.create(
                email="admin@demo.com",
                hashed_password=get_password_hash("demo123"),
                full_name="Demo Admin",
                role=UserRole.ADMIN
            )
            users_created += 1
        
        # Create a pre-analyzed demo bill
        existing_bill = self.bill_repo.get_by_id(1)
        if not existing_bill:
            bill = self.bill_repo.create(
                patient_id=patient.id,
                organization_id=demo_org.id,
                file_path="demo_bill.pdf",
                file_name="demo_medical_bill.pdf",
                file_type="pdf"
            )
            bill.status = BillStatus.COMPLETED
            bill.analyzed_at = datetime.utcnow()
            bill.total_amount = 1250.00
            self.bill_repo.update(bill)
            
            # Create analysis job
            job = self.job_repo.create(bill_id=bill.id)
            job.status = JobStatus.COMPLETED
            job.started_at = datetime.utcnow()
            job.completed_at = datetime.utcnow()
            self.job_repo.update(job)
            
            # Create line items
            line_items_data = [
                {"description": "Office Visit - Level 3", "code": "99213", "quantity": 1.0, "unit_price": 150.00, "total_price": 150.00},
                {"description": "Laboratory - Complete Blood Count", "code": "85027", "quantity": 1.0, "unit_price": 45.00, "total_price": 45.00},
                {"description": "X-Ray - Chest 2 Views", "code": "71020", "quantity": 1.0, "unit_price": 200.00, "total_price": 200.00},
                {"description": "EKG - 12 Lead", "code": "93000", "quantity": 1.0, "unit_price": 85.00, "total_price": 85.00},
                {"description": "Medication - Prescription", "code": "J3490", "quantity": 1.0, "unit_price": 120.00, "total_price": 120.00},
            ]
            
            for item_data in line_items_data:
                line_item = LineItem(
                    bill_id=bill.id,
                    description=item_data["description"],
                    code=item_data["code"],
                    quantity=item_data["quantity"],
                    unit_price=item_data["unit_price"],
                    total_price=item_data["total_price"]
                )
                self.db.add(line_item)
            
            self.db.commit()
            
            # Create findings
            findings_data = [
                {
                    "type": FindingType.DUPLICATE_CHARGE,
                    "severity": FindingSeverity.HIGH,
                    "confidence": 0.92,
                    "estimated_savings": 150.00,
                    "explanation": "Office visit charge appears to be duplicated from a previous billing cycle.",
                    "recommended_action": "Contact the billing department to verify and remove duplicate charge.",
                    "line_item_id": None
                },
                {
                    "type": FindingType.INCORRECT_CODING,
                    "severity": FindingSeverity.MEDIUM,
                    "confidence": 0.85,
                    "estimated_savings": 45.00,
                    "explanation": "The procedure code may not match the service description provided.",
                    "recommended_action": "Review the procedure code and update if necessary before resubmission.",
                    "line_item_id": None
                },
                {
                    "type": FindingType.OVERCHARGE,
                    "severity": FindingSeverity.CRITICAL,
                    "confidence": 0.88,
                    "estimated_savings": 200.00,
                    "explanation": "The billed amount for X-Ray exceeds the typical range for this service.",
                    "recommended_action": "Verify the charge amount against the service agreement or fee schedule.",
                    "line_item_id": None
                },
            ]
            
            for finding_data in findings_data:
                finding = Finding(
                    bill_id=bill.id,
                    type=finding_data["type"],
                    severity=finding_data["severity"],
                    confidence=finding_data["confidence"],
                    estimated_savings=finding_data["estimated_savings"],
                    explanation=finding_data["explanation"],
                    recommended_action=finding_data["recommended_action"],
                    line_item_id=finding_data["line_item_id"]
                )
                self.db.add(finding)
            
            self.db.commit()
            bills_created += 1
        
        return {
            "users_created": users_created,
            "bills_created": bills_created
        }

