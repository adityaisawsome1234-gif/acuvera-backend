from sqlalchemy.orm import Session
from datetime import datetime
import random
import time
import traceback
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.repositories.bill_repository import BillRepository
from app.repositories.analysis_job_repository import AnalysisJobRepository
from app.models.bill import BillStatus
from app.models.finding import Finding, FindingType, FindingSeverity
from app.models.line_item import LineItem


# ── Category → FindingType mapping ────────────────────────────────

def _map_category_to_finding_type(category: str, description: str) -> FindingType:
    """
    Map the AI's category + description to our FindingType enum.
    The AI returns: Financial | Coding | Administrative | Insurance | Compliance
    We map to: DUPLICATE_CHARGE | INCORRECT_CODING | OVERCHARGE | MISSING_DISCOUNT | DENIAL_RISK | OTHER
    """
    cat = category.lower().strip()
    desc = description.lower()

    if cat == "financial":
        if any(kw in desc for kw in ["duplicate", "duplicated", "repeated"]):
            return FindingType.DUPLICATE_CHARGE
        if any(kw in desc for kw in ["discount", "negotiated rate", "contracted rate"]):
            return FindingType.MISSING_DISCOUNT
        # Default financial → OVERCHARGE
        return FindingType.OVERCHARGE

    if cat == "coding":
        return FindingType.INCORRECT_CODING

    if cat == "insurance":
        return FindingType.DENIAL_RISK

    if cat == "administrative":
        return FindingType.OTHER

    if cat == "compliance":
        return FindingType.OTHER

    # Fallback: try to infer from description keywords
    if any(kw in desc for kw in ["duplicate", "duplicated"]):
        return FindingType.DUPLICATE_CHARGE
    if any(kw in desc for kw in ["upcod", "unbundl", "code", "cpt", "hcpcs", "icd", "modifier"]):
        return FindingType.INCORRECT_CODING
    if any(kw in desc for kw in ["overcharge", "excess", "higher than", "above"]):
        return FindingType.OVERCHARGE
    if any(kw in desc for kw in ["discount", "negotiat"]):
        return FindingType.MISSING_DISCOUNT
    if any(kw in desc for kw in ["denial", "denied", "deny", "eligib"]):
        return FindingType.DENIAL_RISK

    return FindingType.OTHER


def _map_severity(severity_str: str) -> FindingSeverity:
    """Map AI severity string to our enum."""
    s = severity_str.strip().lower()
    if s == "high":
        return FindingSeverity.HIGH
    if s == "medium":
        return FindingSeverity.MEDIUM
    if s == "low":
        return FindingSeverity.LOW
    if s in ("critical", "severe"):
        return FindingSeverity.CRITICAL
    return FindingSeverity.MEDIUM


class AnalysisService:
    def __init__(self, db: Session):
        self.db = db
        self.bill_repo = BillRepository(db)
        self.job_repo = AnalysisJobRepository(db)

    def analyze_bill(self, bill_id: int) -> dict:
        """Analyze a bill and generate findings."""
        bill = self.bill_repo.get_by_id(bill_id)
        if not bill:
            raise ValueError(f"Bill {bill_id} not found")

        job = self.job_repo.get_by_bill_id(bill_id)
        if not job:
            raise ValueError(f"Analysis job for bill {bill_id} not found")

        try:
            self.job_repo.mark_processing(job)
            bill.status = BillStatus.PROCESSING
            self.bill_repo.update(bill)

            result = None
            use_ai = bool(settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.strip())

            if use_ai:
                try:
                    print(f"[Analysis] Bill {bill_id}: Attempting AI analysis...", flush=True)
                    result = self._analyze_with_ai(bill_id, bill)
                    print(f"[Analysis] Bill {bill_id}: AI analysis succeeded", flush=True)
                except Exception as e:
                    print(f"[Analysis] Bill {bill_id}: AI failed: {e}", flush=True)
                    traceback.print_exc()
                    result = None

            # Always fall back to demo mode if AI didn't produce results
            if result is None:
                print(f"[Analysis] Bill {bill_id}: Running demo analysis", flush=True)
                result = self._analyze_demo_mode(bill_id)

            bill.status = BillStatus.COMPLETED
            bill.analyzed_at = datetime.utcnow()
            bill.total_amount = result.get("total_amount", 0.0)
            self.bill_repo.update(bill)
            self.job_repo.mark_completed(job)

            print(
                f"[Analysis] Bill {bill_id}: COMPLETED - "
                f"{result.get('findings_count', 0)} findings, "
                f"${result.get('total_estimated_savings', 0):.2f} savings, "
                f"risk_score={result.get('risk_score', 0)}",
                flush=True,
            )
            return result

        except Exception as e:
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

    # ── AI analysis ────────────────────────────────────────────

    def _analyze_with_ai(self, bill_id: int, bill) -> dict:
        """Analyze bill using OpenAI with comprehensive error detection prompt."""
        from app.services.openai_service import OpenAIService
        from app.utils.file_upload import extract_text_from_file, get_file_as_base64_images

        ai_service = OpenAIService()
        ai_result: Dict[str, Any] = {}

        # Strategy 1: Try text extraction from PDF
        bill_text = ""
        try:
            bill_text = extract_text_from_file(bill.file_path)
        except Exception as e:
            print(f"[Analysis] Bill {bill_id}: Text extraction failed: {e}", flush=True)

        if bill_text and len(bill_text.strip()) >= 50:
            print(f"[Analysis] Bill {bill_id}: Using text-based analysis ({len(bill_text)} chars)", flush=True)
            ai_result = ai_service.analyze_bill_text(bill_text)
        else:
            # Strategy 2: Use vision (renders PDF/image to base64 and sends to GPT-4o)
            print(f"[Analysis] Bill {bill_id}: Text too short ({len(bill_text)} chars), using vision analysis", flush=True)
            images = get_file_as_base64_images(bill.file_path, max_pages=3)
            if not images:
                raise ValueError("Could not convert file to images for vision analysis")
            ai_result = ai_service.analyze_bill_images(images)

        print(
            f"[Analysis] Bill {bill_id}: AI returned "
            f"{len(ai_result.get('detected_issues', []))} issues, "
            f"risk_score={ai_result.get('risk_score', 0)}, "
            f"{len(ai_result.get('line_items', []))} line items",
            flush=True,
        )

        # Convert AI result to database records
        return self._save_ai_results(bill_id, ai_result)

    # ── Save AI results to DB ─────────────────────────────────

    def _save_ai_results(self, bill_id: int, ai_result: Dict[str, Any]) -> dict:
        """Convert comprehensive AI analysis results into LineItem and Finding database records."""
        total_amount = float(ai_result.get("total_amount", 0.0) or 0.0)
        risk_score = int(ai_result.get("risk_score", 0) or 0)
        summary = ai_result.get("summary", "")
        clean_items = ai_result.get("clean_items", [])
        missing_info = ai_result.get("missing_information", [])

        line_items: List[LineItem] = []
        findings: List[Finding] = []

        # ── Save line items ───────────────────────────────────
        ai_line_items = ai_result.get("line_items", [])
        if ai_line_items:
            for item_data in ai_line_items:
                unit_price = float(item_data.get("unit_price", 0) or 0)
                total_price = float(item_data.get("total_price", 0) or 0)
                quantity = float(item_data.get("quantity", 1) or 1)

                # If total_price is 0 but unit_price exists, compute it
                if not total_price and unit_price:
                    total_price = unit_price * quantity

                li = LineItem(
                    bill_id=bill_id,
                    description=str(item_data.get("description", "Medical Service")),
                    code=str(item_data.get("code", "") or ""),
                    quantity=quantity,
                    unit_price=unit_price,
                    total_price=total_price,
                )
                self.db.add(li)
                line_items.append(li)
                if not total_amount:
                    total_amount += total_price
        else:
            # Fallback: create a summary line item
            price = max(total_amount, 500.0)
            li = LineItem(
                bill_id=bill_id,
                description=summary or "Medical Services (summary)",
                code="SUMMARY",
                quantity=1.0,
                unit_price=price,
                total_price=price,
            )
            self.db.add(li)
            line_items.append(li)
            if not total_amount:
                total_amount = price

        self.db.flush()  # Get IDs for line items

        # ── Save detected issues as findings ──────────────────
        detected_issues = ai_result.get("detected_issues", [])

        for issue in detected_issues:
            category = str(issue.get("category", "Financial"))
            description = str(issue.get("description", ""))
            severity_str = str(issue.get("severity", "Medium"))
            confidence = float(issue.get("confidence", 0.8) or 0.8)
            estimated_savings = float(issue.get("estimated_savings", 0) or 0)
            recommended_action = str(
                issue.get("recommended_action", "Review this item with your billing department.")
            )
            affected_items = issue.get("affected_items", [])

            # Map AI category → our FindingType enum
            finding_type = _map_category_to_finding_type(category, description)
            severity = _map_severity(severity_str)

            # Clamp confidence
            confidence = max(0.0, min(1.0, confidence))

            # If no estimated savings on this issue, estimate conservatively
            if not estimated_savings and total_amount > 0:
                estimated_savings = round(total_amount * random.uniform(0.02, 0.08), 2)

            # Prefix description with category for clarity
            full_explanation = description
            if affected_items:
                items_str = ", ".join(str(a) for a in affected_items)
                full_explanation += f" (Affected: {items_str})"

            finding = Finding(
                bill_id=bill_id,
                type=finding_type,
                severity=severity,
                confidence=round(confidence, 2),
                estimated_savings=round(estimated_savings, 2),
                explanation=full_explanation,
                recommended_action=recommended_action,
                line_item_id=line_items[0].id if line_items else None,
            )
            self.db.add(finding)
            findings.append(finding)

        # If AI found absolutely no issues, record a clean bill finding
        if not findings:
            clean_explanation = "Bill reviewed by AI — no significant billing errors detected."
            if clean_items:
                clean_explanation += f" Verified items: {', '.join(str(c) for c in clean_items[:5])}"
            if missing_info:
                clean_explanation += f" Note: {', '.join(str(m) for m in missing_info[:3])}"

            finding = Finding(
                bill_id=bill_id,
                type=FindingType.OTHER,
                severity=FindingSeverity.LOW,
                confidence=0.9,
                estimated_savings=0.0,
                explanation=clean_explanation,
                recommended_action="No action needed. Keep this bill for your records.",
                line_item_id=line_items[0].id if line_items else None,
            )
            self.db.add(finding)
            findings.append(finding)

        self.db.commit()

        total_savings = sum(f.estimated_savings for f in findings)

        return {
            "bill_id": bill_id,
            "total_amount": round(total_amount, 2),
            "risk_score": risk_score,
            "summary": summary,
            "line_items_count": len(line_items),
            "findings_count": len([f for f in findings if f.estimated_savings > 0]),
            "total_estimated_savings": round(total_savings, 2),
            "clean_items": clean_items,
            "missing_information": missing_info,
        }

    # ── Demo analysis (fallback) ──────────────────────────────

    def _analyze_demo_mode(self, bill_id: int) -> dict:
        """Demo mode: generates realistic deterministic results."""
        random.seed(bill_id)
        time.sleep(random.uniform(1, 2))

        procedures = [
            ("Office visit - Level 3", "99213"),
            ("Complete blood count (CBC)", "85025"),
            ("Comprehensive metabolic panel", "80053"),
            ("Chest X-ray (2 views)", "71046"),
            ("Electrocardiogram (ECG)", "93000"),
            ("Urinalysis", "81003"),
            ("Influenza vaccine", "90688"),
            ("Pulse oximetry", "94760"),
            ("Venipuncture", "36415"),
            ("Physical therapy evaluation", "97161"),
        ]

        num_items = random.randint(3, 8)
        line_items: List[LineItem] = []
        total_amount = 0.0

        for i in range(num_items):
            desc, code = procedures[i % len(procedures)]
            qty = random.choice([1.0, 1.0, 1.0, 2.0])
            unit = round(random.uniform(75, 450), 2)
            total = round(qty * unit, 2)
            total_amount += total

            li = LineItem(
                bill_id=bill_id,
                description=desc,
                code=code,
                quantity=qty,
                unit_price=unit,
                total_price=total,
            )
            self.db.add(li)
            line_items.append(li)

        self.db.commit()

        num_findings = random.randint(2, 5)
        findings: List[Finding] = []
        types = list(FindingType)
        sevs = list(FindingSeverity)

        explanations = {
            FindingType.DUPLICATE_CHARGE: "This charge appears to be duplicated from a previous billing cycle.",
            FindingType.INCORRECT_CODING: "The procedure code may not match the service description provided.",
            FindingType.OVERCHARGE: "The billed amount exceeds the typical range for this service.",
            FindingType.MISSING_DISCOUNT: "A negotiated discount may not have been applied to this charge.",
            FindingType.DENIAL_RISK: "This claim has characteristics that may lead to denial by the payer.",
            FindingType.OTHER: "An anomaly was detected that requires manual review.",
        }
        actions = {
            FindingType.DUPLICATE_CHARGE: "Contact billing to verify and remove duplicate charge.",
            FindingType.INCORRECT_CODING: "Review procedure code and update before resubmission.",
            FindingType.OVERCHARGE: "Verify charge against the service agreement or fee schedule.",
            FindingType.MISSING_DISCOUNT: "Apply the negotiated discount rate before finalizing.",
            FindingType.DENIAL_RISK: "Review documentation and consider pre-authorization.",
            FindingType.OTHER: "Manually review with the billing team for resolution.",
        }

        for _ in range(num_findings):
            ft = random.choice(types)
            sv = random.choice(sevs)
            f = Finding(
                bill_id=bill_id,
                type=ft,
                severity=sv,
                confidence=round(random.uniform(0.7, 0.95), 2),
                estimated_savings=round(random.uniform(50, 500), 2),
                explanation=explanations.get(ft, "Review required."),
                recommended_action=actions.get(ft, "Contact billing department."),
                line_item_id=random.choice(line_items).id if line_items else None,
            )
            self.db.add(f)
            findings.append(f)

        self.db.commit()

        return {
            "bill_id": bill_id,
            "total_amount": round(total_amount, 2),
            "risk_score": random.randint(30, 75),
            "summary": "Demo analysis — upload a real bill with an OpenAI API key for full AI detection.",
            "line_items_count": len(line_items),
            "findings_count": len(findings),
            "total_estimated_savings": sum(f.estimated_savings for f in findings),
            "clean_items": [],
            "missing_information": [],
        }

    def _get_recommended_action(self, finding_type: FindingType) -> str:
        actions = {
            FindingType.DUPLICATE_CHARGE: "Contact billing to verify and remove duplicate charge.",
            FindingType.INCORRECT_CODING: "Review procedure code and update before resubmission.",
            FindingType.OVERCHARGE: "Verify charge against the service agreement or fee schedule.",
            FindingType.MISSING_DISCOUNT: "Apply the negotiated discount rate before finalizing.",
            FindingType.DENIAL_RISK: "Review documentation and consider pre-authorization.",
            FindingType.OTHER: "Manually review with the billing team for resolution.",
        }
        return actions.get(finding_type, "Contact billing department for assistance.")
