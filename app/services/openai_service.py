import json
from typing import Dict, Any, List
from openai import OpenAI
from app.core.config import settings


# ── Acuvera Medical Billing Error Detection System Prompt ────────────────

SYSTEM_PROMPT = """You are Acuvera's Medical Billing Error Detection AI.
Your task is to analyze healthcare billing documents (medical bills, EOBs, claims, or itemized statements) and identify ALL potential financial, coding, compliance, and data-integrity errors.

You must operate conservatively, prioritize accuracy over speculation, and flag uncertainties rather than guessing.

---

## INPUTS YOU MAY RECEIVE

* OCR or structured text extracted from a bill or EOB
* Patient demographic data (optional)
* Provider/facility information
* CPT/HCPCS/ICD codes
* Line-item charges
* Allowed/paid/denied amounts
* Insurance plan metadata
* Historical billing context (optional)

---

## PRIMARY OBJECTIVE

Detect and clearly report:

1. Financial Errors

* Overcharges relative to norms or plan allowances
* Duplicate line items or services
* Incorrect totals or arithmetic inconsistencies
* Balance billing inconsistencies
* Unexpected out-of-network charges
* Charges for canceled or denied services

2. Coding Errors

* Invalid, expired, or mismatched CPT/HCPCS/ICD codes
* Gender/age incompatible procedures
* Diagnosis/procedure mismatch
* Upcoding or unbundling patterns
* Missing modifiers where required
* Mutually exclusive code combinations

3. Administrative/Data Errors

* Incorrect patient/provider identifiers
* Date inconsistencies
* Missing required fields
* Mismatched NPI/provider data
* Coverage eligibility conflicts

4. Insurance Adjudication Issues

* Improper denials
* Misapplied deductibles/copays
* Coordination of benefits issues
* Non-covered service misclassification
* Network status inconsistencies

5. Compliance / Risk Indicators

* Suspicious billing patterns
* Unusual frequency patterns
* Services inconsistent with visit context
* Documentation gaps

---

## ANALYSIS PROCESS (MANDATORY)

Step 1 — Parse
Extract structured entities:

* Codes
* Charges
* Dates
* Providers
* Totals
* Adjustments

Step 2 — Validate
Cross-check:

* Internal consistency
* Coding logic relationships
* Financial arithmetic
* Eligibility assumptions

Step 3 — Compare
Evaluate against:

* Known billing rules
* Logical medical relationships
* Expected billing structure

Step 4 — Flag
List EVERY issue found.
Do NOT suppress minor or uncertain issues.

---

## CRITICAL BEHAVIOR RULES

* Never fabricate medical or payer rules
* Never assume coverage without evidence
* Clearly mark uncertainty
* Prefer flagging over omission
* Explain reasoning concisely
* Do NOT output conversational text
* Output ONLY structured JSON"""


# ── Output schema for GPT (merged: Acuvera detection + line-item extraction) ──

OUTPUT_SCHEMA = """{
  "summary": "Concise overview of what this bill is for and key findings",
  "risk_score": 0,
  "total_amount": 0.0,
  "line_items": [
    {
      "description": "Service or procedure name exactly as shown on the bill",
      "code": "CPT/HCPCS code if visible, otherwise empty string",
      "quantity": 1,
      "unit_price": 0.0,
      "total_price": 0.0
    }
  ],
  "detected_issues": [
    {
      "category": "Financial | Coding | Administrative | Insurance | Compliance",
      "severity": "Low | Medium | High",
      "description": "Clear explanation of the issue found",
      "confidence": 0.0,
      "affected_items": ["line numbers or codes affected"],
      "recommended_action": "What the patient/provider should do",
      "estimated_savings": 0.0
    }
  ],
  "clean_items": [
    "Line items verified as correct"
  ],
  "missing_information": [
    "Data that would be needed for deeper validation"
  ]
}"""


class OpenAIService:
    """Service for interacting with OpenAI API using Acuvera's detection prompt."""

    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not set.")
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL  # e.g. "gpt-4o-mini"

    # ── Text-based analysis ───────────────────────────────────────

    def analyze_bill_text(self, text: str) -> Dict[str, Any]:
        """Analyze medical bill text and return structured JSON."""
        prompt = (
            "Analyze the following medical bill text. "
            "Extract all line items, amounts, and codes. "
            "Then perform the full error-detection analysis as instructed.\n\n"
            f"Return a JSON object matching this exact structure:\n{OUTPUT_SCHEMA}\n\n"
            f"Bill text:\n{text}\n\n"
            "Return ONLY valid JSON."
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
                max_tokens=4096,
            )
            return self._parse_response(response)
        except Exception as e:
            raise Exception(f"OpenAI text analysis error: {str(e)}")

    # ── Vision-based analysis (scanned PDFs, images) ──────────────

    def analyze_bill_images(self, image_data_uris: List[str]) -> Dict[str, Any]:
        """
        Analyze medical bill images using GPT-4o vision capability.

        Args:
            image_data_uris: List of base64 data-URI strings
                e.g. ["data:image/png;base64,iVBOR..."]
        """
        content: list = [
            {
                "type": "text",
                "text": (
                    "Analyze this medical bill image(s). "
                    "Extract all line items, amounts, codes, dates, and provider information. "
                    "Then perform the full error-detection analysis as instructed.\n\n"
                    f"Return a JSON object matching this exact structure:\n{OUTPUT_SCHEMA}\n\n"
                    "Return ONLY valid JSON."
                ),
            }
        ]

        for uri in image_data_uris:
            content.append(
                {
                    "type": "image_url",
                    "image_url": {"url": uri, "detail": "high"},
                }
            )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": content},
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
                max_tokens=4096,
            )
            return self._parse_response(response)
        except Exception as e:
            raise Exception(f"OpenAI vision analysis error: {str(e)}")

    # ── Response parsing ──────────────────────────────────────────

    def _parse_response(self, response) -> Dict[str, Any]:
        """Parse OpenAI response into a dictionary with guaranteed fields."""
        content = response.choices[0].message.content
        try:
            result = json.loads(content)
            if not isinstance(result, dict):
                return {"raw": content}

            # Ensure all required fields exist with defaults
            result.setdefault("summary", "")
            result.setdefault("risk_score", 0)
            result.setdefault("total_amount", 0.0)
            result.setdefault("line_items", [])
            result.setdefault("detected_issues", [])
            result.setdefault("clean_items", [])
            result.setdefault("missing_information", [])

            # Legacy compat: if the model returned "issues" instead of "detected_issues"
            if "issues" in result and not result["detected_issues"]:
                result["detected_issues"] = result.pop("issues")

            # Ensure confidence and estimated_savings on each issue
            for issue in result["detected_issues"]:
                issue.setdefault("confidence", 0.8)
                issue.setdefault("estimated_savings", 0.0)
                issue.setdefault("category", "Financial")
                issue.setdefault("severity", "Medium")
                issue.setdefault("recommended_action", "Review this item with your billing department.")
                issue.setdefault("affected_items", [])

            return result
        except json.JSONDecodeError:
            return {"raw": content}
