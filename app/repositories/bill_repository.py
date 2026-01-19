from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import Optional, List
from datetime import datetime
from app.models.bill import Bill, BillStatus
from app.models.user import UserRole


class BillRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, bill_id: int) -> Optional[Bill]:
        return self.db.query(Bill).filter(Bill.id == bill_id).first()

    def get_by_patient_id(self, patient_id: int) -> List[Bill]:
        return self.db.query(Bill).filter(Bill.patient_id == patient_id).order_by(Bill.created_at.desc()).all()

    def get_by_organization_id(self, organization_id: int) -> List[Bill]:
        return self.db.query(Bill).filter(Bill.organization_id == organization_id).order_by(Bill.created_at.desc()).all()

    def create(
        self,
        patient_id: int,
        file_path: str,
        file_name: str,
        file_type: str,
        organization_id: Optional[int] = None
    ) -> Bill:
        bill = Bill(
            patient_id=patient_id,
            organization_id=organization_id,
            file_path=file_path,
            file_name=file_name,
            file_type=file_type,
            status=BillStatus.PENDING
        )
        self.db.add(bill)
        self.db.commit()
        self.db.refresh(bill)
        return bill

    def update(self, bill: Bill) -> Bill:
        self.db.commit()
        self.db.refresh(bill)
        return bill

    def can_access(self, bill: Bill, user_id: int, user_role: UserRole, user_org_id: Optional[int]) -> bool:
        """Check if user can access this bill based on RBAC"""
        if user_role == UserRole.ADMIN:
            return True
        if user_role == UserRole.PATIENT:
            return bill.patient_id == user_id
        if user_role == UserRole.PROVIDER:
            return bill.organization_id == user_org_id
        return False

    def get_stats_for_organization(self, organization_id: int) -> dict:
        """Get aggregated stats for provider dashboard"""
        bills = self.get_by_organization_id(organization_id)
        completed_bills = [b for b in bills if b.status == BillStatus.COMPLETED]
        
        total_savings = sum(
            sum(f.estimated_savings for f in bill.findings)
            for bill in completed_bills
        )
        
        total_findings = sum(len(bill.findings) for bill in completed_bills)
        
        # Error breakdown by type
        error_breakdown = {}
        for bill in completed_bills:
            for finding in bill.findings:
                error_type = finding.type.value
                if error_type not in error_breakdown:
                    error_breakdown[error_type] = {"count": 0, "savings": 0.0}
                error_breakdown[error_type]["count"] += 1
                error_breakdown[error_type]["savings"] += finding.estimated_savings
        
        # Monthly savings
        monthly_savings = {}
        for bill in completed_bills:
            if bill.analyzed_at:
                month_key = bill.analyzed_at.strftime("%Y-%m")
                if month_key not in monthly_savings:
                    monthly_savings[month_key] = {"savings": 0.0, "count": 0}
                monthly_savings[month_key]["savings"] += sum(f.estimated_savings for f in bill.findings)
                monthly_savings[month_key]["count"] += 1
        
        return {
            "claims_reviewed": len(completed_bills),
            "errors_caught": total_findings,
            "estimated_savings_total": total_savings,
            "error_breakdown": error_breakdown,
            "monthly_savings": monthly_savings
        }

