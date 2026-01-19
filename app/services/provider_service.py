from sqlalchemy.orm import Session
from typing import List
from app.repositories.bill_repository import BillRepository
from app.repositories.organization_repository import OrganizationRepository
from app.models.user import User


class ProviderService:
    def __init__(self, db: Session):
        self.db = db
        self.bill_repo = BillRepository(db)
        self.org_repo = OrganizationRepository(db)

    def get_dashboard(self, user: User) -> dict:
        """Get provider dashboard data"""
        if not user.organization_id:
            raise ValueError("User is not associated with an organization")
        
        org = self.org_repo.get_by_id(user.organization_id)
        if not org:
            raise ValueError("Organization not found")
        
        # Get stats
        stats = self.bill_repo.get_stats_for_organization(user.organization_id)
        
        # Get recent bills (last 10)
        bills = self.bill_repo.get_by_organization_id(user.organization_id)[:10]
        
        recent_bills = []
        for bill in bills:
            findings_count = len(bill.findings)
            estimated_savings = sum(f.estimated_savings for f in bill.findings)
            recent_bills.append({
                "id": bill.id,
                "file_name": bill.file_name,
                "status": bill.status.value,
                "total_amount": bill.total_amount,
                "findings_count": findings_count,
                "estimated_savings": estimated_savings,
                "analyzed_at": bill.analyzed_at.isoformat() if bill.analyzed_at else None
            })
        
        # Format error breakdown
        error_breakdown = [
            {
                "type": k,
                "count": v["count"],
                "total_savings": round(v["savings"], 2)
            }
            for k, v in stats["error_breakdown"].items()
        ]
        
        # Format monthly savings
        savings_over_time = [
            {
                "month": month,
                "savings": round(data["savings"], 2),
                "claims_count": data["count"]
            }
            for month, data in sorted(stats["monthly_savings"].items())
        ]
        
        return {
            "organization_id": org.id,
            "organization_name": org.name,
            "stats": {
                "claims_reviewed": stats["claims_reviewed"],
                "errors_caught": stats["errors_caught"],
                "estimated_savings_total": round(stats["estimated_savings_total"], 2),
                "error_breakdown": error_breakdown,
                "savings_over_time": savings_over_time
            },
            "recent_bills": recent_bills
        }

