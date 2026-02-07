import traceback
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import UploadFile
from app.repositories.bill_repository import BillRepository
from app.repositories.analysis_job_repository import AnalysisJobRepository
from app.models.bill import BillStatus
from app.models.user import User, UserRole
from app.utils.file_upload import validate_file, save_uploaded_file
from app.services.analysis_service import AnalysisService


class BillService:
    def __init__(self, db: Session):
        self.db = db
        self.bill_repo = BillRepository(db)
        self.job_repo = AnalysisJobRepository(db)

    async def upload_and_analyze(
        self,
        file: UploadFile,
        patient_id: int,
        organization_id: Optional[int] = None,
    ) -> dict:
        """Upload a bill AND run analysis in the same request."""
        # 1. Validate and save file
        file_type, file_ext = validate_file(file)
        file_path, file_name = await save_uploaded_file(file, file_type)

        # 2. Create bill record
        bill = self.bill_repo.create(
            patient_id=patient_id,
            file_path=file_path,
            file_name=file_name,
            file_type=file_type,
            organization_id=organization_id,
        )

        # 3. Create analysis job record
        job = self.job_repo.create(bill_id=bill.id)

        # 4. Run analysis synchronously (same DB session, same thread)
        print(f"[BillService] Running analysis for bill {bill.id}...", flush=True)
        try:
            analysis_service = AnalysisService(self.db)
            analysis_service.analyze_bill(bill.id)
            print(f"[BillService] Analysis completed for bill {bill.id}", flush=True)
        except Exception as e:
            print(f"[BillService] Analysis failed for bill {bill.id}: {e}", flush=True)
            traceback.print_exc()
            # analyze_bill already marks bill as FAILED internally

        # 5. Refresh to get latest state
        self.db.refresh(bill)
        return {"bill": bill, "job_id": job.id}

    async def upload_bill(
        self,
        file: UploadFile,
        patient_id: int,
        organization_id: Optional[int] = None,
    ) -> dict:
        """Upload a bill (calls upload_and_analyze)."""
        return await self.upload_and_analyze(file, patient_id, organization_id)

    def get_bill(self, bill_id: int, user: User) -> Optional[dict]:
        """Get bill with access control"""
        bill = self.bill_repo.get_by_id(bill_id)
        if not bill:
            return None
        if not self.bill_repo.can_access(
            bill, user.id, user.role, user.organization_id
        ):
            raise PermissionError("Access denied to this bill")
        return {"bill": bill}

    def list_bills(self, user: User) -> List[dict]:
        """List bills based on user role"""
        if user.role == UserRole.ADMIN:
            from app.models.bill import Bill
            bills = (
                self.db.query(Bill).order_by(Bill.created_at.desc()).limit(100).all()
            )
        elif user.role == UserRole.PATIENT:
            bills = self.bill_repo.get_by_patient_id(user.id)
        elif user.role == UserRole.PROVIDER:
            if not user.organization_id:
                return []
            bills = self.bill_repo.get_by_organization_id(user.organization_id)
        else:
            return []
        return [{"bill": bill} for bill in bills]
