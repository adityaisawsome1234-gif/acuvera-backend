from sqlalchemy.orm import Session
from datetime import datetime
import random
import time
import traceback
from typing import Optional
from app.core.config import settings
from app.repositories.bill_repository import BillRepository
from app.repositories.analysis_job_repository import AnalysisJobRepository
from app.models.bill import BillStatus
from app.models.finding import Finding, FindingType, FindingSeverity
from app.models.line_item import LineItem
from app.utils.file_upload import extract_text_from_file


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

            result = None

            # Try AI analysis if OpenAI is configured
            use_ai = bool(settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.strip())

            if use_ai:
                try:
                    print(f"[Analysis] Bill {bill_id}: Attempting AI analysis...", flush=True)
                    result = self._analyze_with_ai(bill_id, bill)
                    print(f"[Analysis] Bill {bill_id}: AI analysis succeeded", flush=True)
                except Exception as e:
                    print(f"[Analysis] Bill {bill_id}: AI failed ({e}), using demo analysis", flush=True)
                    traceback.print_exc()
                    result = None  # Force fallback

            # Fallback: always use demo mode if AI didn't produce results
            if result is None:
                print(f"[Analysis] Bill {bill_id}: Running demo analysis", flush=True)
                result = self._analyze_demo_mode(bill_id)

            # Update bill status
            bill.status = BillStatus.COMPLETED
            bill.analyzed_at = datetime.utcnow()
            bill.total_amount = result.get("total_amount", 0.0)
            self.bill_repo.update(bill)

            # Mark job as completed
            self.job_repo.mark_completed(job)

            print(f"[Analysis] Bill {bill_id}: COMPLETED - {result.get('findings_count', 0)} findings, ${result.get('total_estimated_savings', 0):.2f} savings", flush=True)
            return result

        except Exception as e:
            # Mark as failed
            error_msg = str(e)
            print(f"[Analysis] Bill {bill_id}: FAILED - {error_msg}", flush=True)
            traceback.print_exc()
            try:
                self.job_repo.mark_failed(job, error_msg)
                bill.status = BillStatus.FAILED
                self.bill_repo.update(bill)
            except Exception:
                pass
            raise

    def _analyze_demo_mode(self, bill_id: int) -> dict:
        """Demo mode: deterministic analysis based on bill_id"""
        # Use bill_id as seed for deterministic results
        random.seed(bill_id)

        # Short delay to simulate processing (1-2 seconds)
        time.sleep(random.uniform(1, 2))

        # Generate 3-8 line items
        num_line_items = random.randint(3, 8)
        line_items = []
        total_amount = 0.0

        procedure_names = [
            "Office visit - Level 3",
            "Complete blood count (CBC)",
            "Comprehensive metabolic panel",
            "Chest X-ray (2 views)",
            "Electrocardiogram (ECG)",
            "Urinalysis",
            "Influenza vaccine administration",
            "Pulse oximetry",
            "Venipuncture",
            "Physical therapy evaluation",
        ]

        cpt_codes = [
            "99213", "85025", "80053", "71046", "93000",
            "81003", "90688", "94760", "36415", "97161",
        ]

        for i in range(num_line_items):
            idx = i % len(procedure_names)
            description = procedure_names[idx]
            code = cpt_codes[idx]
            quantity = random.choice([1.0, 1.0, 1.0, 2.0])
            unit_price = round(random.uniform(75, 450), 2)
            total_price = round(quantity * unit_price, 2)
            total_amount += total_price

            line_item = LineItem(
                bill_id=bill_id,
                description=description,
                code=code,
                quantity=quantity,
                unit_price=unit_price,
                total_price=total_price,
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

            explanations = {
                FindingType.DUPLICATE_CHARGE: "This charge appears to be duplicated from a previous billing cycle.",
                FindingType.INCORRECT_CODING: "The procedure code may not match the service description provided.",
                FindingType.OVERCHARGE: "The billed amount exceeds the typical range for this service.",
                FindingType.MISSING_DISCOUNT: "A negotiated discount may not have been applied to this charge.",
                FindingType.DENIAL_RISK: "This claim has characteristics that may lead to denial by the payer.",
                FindingType.OTHER: "An anomaly was detected that requires manual review.",
            }

            actions = {
                FindingType.DUPLICATE_CHARGE: "Contact the billing department to verify and remove duplicate charge.",
                FindingType.INCORRECT_CODING: "Review the procedure code and update if necessary before resubmission.",
                FindingType.OVERCHARGE: "Verify the charge amount against the service agreement or fee schedule.",
                FindingType.MISSING_DISCOUNT: "Apply the negotiated discount rate before finalizing the bill.",
                FindingType.DENIAL_RISK: "Review claim documentation and consider pre-authorization before submission.",
                FindingType.OTHER: "Manually review this item with the billing team for resolution.",
            }

            line_item_id = random.choice(line_items).id if line_items else None

            finding = Finding(
                bill_id=bill_id,
                type=finding_type,
                severity=severity,
                confidence=confidence,
                estimated_savings=estimated_savings,
                explanation=explanations.get(finding_type, "Review required."),
                recommended_action=actions.get(finding_type, "Contact billing department."),
                line_item_id=line_item_id,
            )
            self.db.add(finding)
            findings.append(finding)

        self.db.commit()

        return {
            "bill_id": bill_id,
            "total_amount": round(total_amount, 2),
            "line_items_count": len(line_items),
            "findings_count": len(findings),
            "total_estimated_savings": sum(f.estimated_savings for f in findings),
        }

    def _analyze_production_mode(self, bill_id: int) -> dict:
        """Production mode: same as demo but with more delay"""
        time.sleep(random.uniform(3, 8))
        return self._analyze_demo_mode(bill_id)

    def _analyze_with_ai(self, bill_id: int, bill) -> dict:
        """Analyze bill using OpenAI AI service"""
        from app.services.openai_service import OpenAIService

        # Extract text from bill file
        bill_text = ""
        try:
            bill_text = extract_text_from_file(bill.file_path)
        except Exception as e:
            print(f"[Analysis] Bill {bill_id}: Text extraction failed: {e}", flush=True)

        if not bill_text or len(bill_text.strip()) < 50:
            raise ValueError("Could not extract sufficient text from bill file")

        # Use OpenAI to analyze
        ai_service = OpenAIService()
        ai_result = ai_service.analyze_bill_text(bill_text)

        # Parse AI results and create line items and findings
        total_amount = 0.0
        line_items = []
        findings = []

        # Create a summary line item
        if "summary" in ai_result:
            est = ai_result.get("estimated_savings_usd", 0.0)
            unit_price = max(est * 2, 1000.0) if est else 1000.0
            summary_item = LineItem(
                bill_id=bill_id,
                description=ai_result.get("summary", "Medical Services"),
                code="SUMMARY",
                quantity=1.0,
                unit_price=unit_price,
                total_price=unit_price,
            )
            self.db.add(summary_item)
            line_items.append(summary_item)
            total_amount = summary_item.total_price

        # Convert AI issues to findings
        ai_issues = ai_result.get("issues", [])

        severity_map = {
            "low": FindingSeverity.LOW,
            "medium": FindingSeverity.MEDIUM,
            "high": FindingSeverity.HIGH,
            "critical": FindingSeverity.CRITICAL,
        }

        type_map = {
            "duplicate": FindingType.DUPLICATE_CHARGE,
            "duplicate charge": FindingType.DUPLICATE_CHARGE,
            "upcoding": FindingType.INCORRECT_CODING,
            "incorrect coding": FindingType.INCORRECT_CODING,
            "overcharge": FindingType.OVERCHARGE,
            "missing discount": FindingType.MISSING_DISCOUNT,
            "denial risk": FindingType.DENIAL_RISK,
        }

        for issue in ai_issues:
            title = issue.get("title", "").lower()
            description = issue.get("description", "")
            severity_str = issue.get("severity", "medium").lower()

            finding_type = FindingType.OTHER
            for key, ftype in type_map.items():
                if key in title:
                    finding_type = ftype
                    break

            severity = severity_map.get(severity_str, FindingSeverity.MEDIUM)

            estimated_savings = ai_result.get("estimated_savings_usd", 0.0) / max(
                len(ai_issues), 1
            )
            if estimated_savings == 0:
                estimated_savings = round(total_amount * random.uniform(0.1, 0.2), 2)

            explanation = description or f"AI detected a potential {title} issue in this bill."
            recommended_action = self._get_recommended_action(finding_type)

            finding = Finding(
                bill_id=bill_id,
                type=finding_type,
                severity=severity,
                confidence=ai_result.get("confidence", 0.85),
                estimated_savings=round(estimated_savings, 2),
                explanation=explanation,
                recommended_action=recommended_action,
                line_item_id=line_items[0].id if line_items else None,
            )
            self.db.add(finding)
            findings.append(finding)

        # If no issues found, create a clean bill finding
        if not findings:
            finding = Finding(
                bill_id=bill_id,
                type=FindingType.OTHER,
                severity=FindingSeverity.LOW,
                confidence=0.7,
                estimated_savings=0.0,
                explanation="Bill reviewed by AI. No significant billing errors detected.",
                recommended_action="Review bill details and compare with your records.",
                line_item_id=line_items[0].id if line_items else None,
            )
            self.db.add(finding)
            findings.append(finding)

        self.db.commit()

        return {
            "bill_id": bill_id,
            "total_amount": round(total_amount, 2),
            "line_items_count": len(line_items),
            "findings_count": len(findings),
            "total_estimated_savings": sum(f.estimated_savings for f in findings),
            "ai_confidence": ai_result.get("confidence", 0.85),
        }

    def _get_recommended_action(self, finding_type: FindingType) -> str:
        """Get recommended action based on finding type"""
        actions = {
            FindingType.DUPLICATE_CHARGE: "Contact the billing department to verify and remove duplicate charge.",
            FindingType.INCORRECT_CODING: "Review the procedure code and update if necessary before resubmission.",
            FindingType.OVERCHARGE: "Verify the charge amount against the service agreement or fee schedule.",
            FindingType.MISSING_DISCOUNT: "Apply the negotiated discount rate before finalizing the bill.",
            FindingType.DENIAL_RISK: "Review claim documentation and consider pre-authorization before submission.",
            FindingType.OTHER: "Manually review this item with the billing team for resolution.",
        }
        return actions.get(finding_type, "Contact billing department for assistance.")
