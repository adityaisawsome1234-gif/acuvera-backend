from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import UploadFile
from app.repositories.bill_repository import BillRepository
from app.repositories.analysis_job_repository import AnalysisJobRepository
from app.models.bill import BillStatus
from app.models.user import User, UserRole
from app.utils.file_upload import validate_file, save_uploaded_file
from app.jobs.analysis_job import queue_analysis_job


class BillService:
    def __init__(self, db: Session):
        self.db = db
        self.bill_repo = BillRepository(db)
        self.job_repo = AnalysisJobRepository(db)

    async def upload_bill(
        self,
        file: UploadFile,
        patient_id: int,
        organization_id: Optional[int] = None
    ) -> dict:
        """Upload and create a new bill"""
        # Validate file
        file_type, file_ext = validate_file(file)
        
        # Save file
        file_path, file_name = await save_uploaded_file(file, file_type)
        
        # Create bill record
        bill = self.bill_repo.create(
            patient_id=patient_id,
            file_path=file_path,
            file_name=file_name,
            file_type=file_type,
            organization_id=organization_id
        )
        
        # Create analysis job
        job = self.job_repo.create(bill_id=bill.id)
        
        # Queue analysis (async)
        queue_analysis_job(bill.id)
        
        return {
            "bill": bill,
            "job_id": job.id
        }

    def get_bill(self, bill_id: int, user: User) -> Optional[dict]:
        """Get bill with access control"""
        bill = self.bill_repo.get_by_id(bill_id)
        if not bill:
            return None
        
        # Check access
        if not self.bill_repo.can_access(bill, user.id, user.role, user.organization_id):
            raise PermissionError("Access denied to this bill")
        
        return {"bill": bill}

    def list_bills(self, user: User) -> List[dict]:
        """List bills based on user role"""
        if user.role == UserRole.ADMIN:
            # Admin can see all bills (simplified - in production, add pagination)
            from app.models.bill import Bill
            bills = self.db.query(Bill).order_by(Bill.created_at.desc()).limit(100).all()
        elif user.role == UserRole.PATIENT:
            bills = self.bill_repo.get_by_patient_id(user.id)
        elif user.role == UserRole.PROVIDER:
            if not user.organization_id:
                return []
            bills = self.bill_repo.get_by_organization_id(user.organization_id)
        else:
            return []
        
        return [{"bill": bill} for bill in bills]

    def can_access_bill(self, bill_id: int, user: User) -> bool:
        """Check if user can access bill"""
        bill = self.bill_repo.get_by_id(bill_id)
        if not bill:
            return False
        return self.bill_repo.can_access(bill, user.id, user.role, user.organization_id)

