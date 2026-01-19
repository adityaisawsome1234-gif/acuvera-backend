from sqlalchemy.orm import Session
from datetime import datetime
import random
import time
from app.core.config import settings
from app.repositories.bill_repository import BillRepository
from app.repositories.analysis_job_repository import AnalysisJobRepository
from app.models.bill import BillStatus
from app.models.finding import Finding, FindingType, FindingSeverity
from app.models.line_item import LineItem


class AnalysisService:
    def __init__(self, db: Session):
        self.db = db
        self.bill_repo = BillRepository(db)
        self.job_repo = AnalysisJobRepository(db)

    def analyze_bill(self, bill_id: int) -> dict:
        """Analyze a bill and generate findings"""
        bill = self.bill_repo.get_by_id(bill_id)
        if not bill:
            raise ValueError(f"Bill {bill_id} not found")
        
        job = self.job_repo.get_by_bill_id(bill_id)
        if not job:
            raise ValueError(f"Analysis job for bill {bill_id} not found")
        
        try:
            # Mark as processing
            self.job_repo.mark_processing(job)
            bill.status = BillStatus.PROCESSING
            self.bill_repo.update(bill)
            
            if settings.DEMO_MODE:
                # Demo mode: deterministic, fast analysis
                result = self._analyze_demo_mode(bill_id)
            else:
                # Production mode: simulate longer analysis
                result = self._analyze_production_mode(bill_id)
            
            # Update bill status
            bill.status = BillStatus.COMPLETED
            bill.analyzed_at = datetime.utcnow()
            bill.total_amount = result.get("total_amount", 0.0)
            self.bill_repo.update(bill)
            
            # Mark job as completed
            self.job_repo.mark_completed(job)
            
            return result
            
        except Exception as e:
            # Mark as failed
            error_msg = str(e)
            self.job_repo.mark_failed(job, error_msg)
            bill.status = BillStatus.FAILED
            self.bill_repo.update(bill)
            raise

    def _analyze_demo_mode(self, bill_id: int) -> dict:
        """Demo mode: deterministic analysis based on bill_id"""
        # Use bill_id as seed for deterministic results
        random.seed(bill_id)
        
        # Simulate processing time (3-5 seconds)
        time.sleep(random.uniform(3, 5))
        
        # Generate 3-8 line items
        num_line_items = random.randint(3, 8)
        line_items = []
        total_amount = 0.0
        
        for i in range(num_line_items):
            description = f"Medical service {i+1}"
            code = f"CPT{random.randint(10000, 99999)}"
            quantity = random.choice([1.0, 2.0, 3.0])
            unit_price = round(random.uniform(50, 500), 2)
            total_price = round(quantity * unit_price, 2)
            total_amount += total_price
            
            line_item = LineItem(
                bill_id=bill_id,
                description=description,
                code=code,
                quantity=quantity,
                unit_price=unit_price,
                total_price=total_price
            )
            self.db.add(line_item)
            line_items.append(line_item)
        
        self.db.commit()
        
        # Generate 2-5 findings
        num_findings = random.randint(2, 5)
        findings = []
        finding_types = list(FindingType)
        severities = list(FindingSeverity)
        
        for i in range(num_findings):
            finding_type = random.choice(finding_types)
            severity = random.choice(severities)
            confidence = round(random.uniform(0.7, 0.95), 2)
            estimated_savings = round(random.uniform(50, 500), 2)
            
            # Generate explanations based on type
            explanations = {
                FindingType.DUPLICATE_CHARGE: "This charge appears to be duplicated from a previous billing cycle.",
                FindingType.INCORRECT_CODING: "The procedure code may not match the service description provided.",
                FindingType.OVERCHARGE: "The billed amount exceeds the typical range for this service.",
                FindingType.MISSING_DISCOUNT: "A negotiated discount may not have been applied to this charge.",
                FindingType.DENIAL_RISK: "This claim has characteristics that may lead to denial by the payer.",
                FindingType.OTHER: "An anomaly was detected that requires manual review."
            }
            
            actions = {
                FindingType.DUPLICATE_CHARGE: "Contact the billing department to verify and remove duplicate charge.",
                FindingType.INCORRECT_CODING: "Review the procedure code and update if necessary before resubmission.",
                FindingType.OVERCHARGE: "Verify the charge amount against the service agreement or fee schedule.",
                FindingType.MISSING_DISCOUNT: "Apply the negotiated discount rate before finalizing the bill.",
                FindingType.DENIAL_RISK: "Review claim documentation and consider pre-authorization before submission.",
                FindingType.OTHER: "Manually review this item with the billing team for resolution."
            }
            
            # Link to a random line item
            line_item_id = random.choice(line_items).id if line_items else None
            
            finding = Finding(
                bill_id=bill_id,
                type=finding_type,
                severity=severity,
                confidence=confidence,
                estimated_savings=estimated_savings,
                explanation=explanations.get(finding_type, "Review required."),
                recommended_action=actions.get(finding_type, "Contact billing department."),
                line_item_id=line_item_id
            )
            self.db.add(finding)
            findings.append(finding)
        
        self.db.commit()
        
        return {
            "bill_id": bill_id,
            "total_amount": round(total_amount, 2),
            "line_items_count": len(line_items),
            "findings_count": len(findings),
            "total_estimated_savings": sum(f.estimated_savings for f in findings)
        }

    def _analyze_production_mode(self, bill_id: int) -> dict:
        """Production mode: simulate longer, more complex analysis"""
        # Simulate longer processing (10-30 seconds)
        time.sleep(random.uniform(10, 30))
        
        # Similar structure but with more variability
        return self._analyze_demo_mode(bill_id)

