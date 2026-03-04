import json
import re
from typing import Dict, Any, List
import anthropic
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
* Write in PLAIN LANGUAGE — patients and billing staff must understand every finding
* Do NOT output conversational text
* Output ONLY structured JSON

---

## OUTPUT REQUIREMENTS: BE SPECIFIC AND DETAILED

For each issue you find:
1. State exactly WHAT was billed (procedure name, code, amount)
2. State WHAT the problem is (e.g., "Billed $450; typical range for this service is $120–180")
3. Explain WHY it matters (e.g., "You may be overcharged by ~$270")
4. Give a clear, step-by-step RECOMMENDED ACTION
5. Include line numbers or codes from the bill when referring to specific charges"""


# ── Output schema for Claude (detailed, patient-friendly) ──

OUTPUT_SCHEMA = """{
  "summary": "2–3 sentence plain-language overview: what this bill is for, total amount, and the main issues or that it looks clean",
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
      "description": "DETAILED plain-language explanation. Include: (1) What was billed — specific procedure, code, and amount. (2) What the problem is — e.g. 'This charge appears twice' or 'Billed $X; typical range is $Y–Z'. (3) Why it matters — impact on the patient. Be specific with numbers and line references.",
      "confidence": 0.0,
      "affected_items": ["specific line numbers, codes, or procedure names from the bill"],
      "recommended_action": "Clear step-by-step action. Example: '1. Call your provider's billing department. 2. Ask them to verify if [procedure] was performed twice. 3. Request a corrected bill if it was a duplicate.'",
      "estimated_savings": 0.0,
      "billed_amount": 0.0,
      "expected_amount": 0.0
    }
  ],
  "clean_items": [
    "Line items verified as correct, with brief reason if helpful"
  ],
  "missing_information": [
    "Data that would be needed for deeper validation"
  ]
}"""


class AnthropicService:
    """Service for interacting with Anthropic Claude API using Acuvera's detection prompt."""

    def __init__(self):
        if not settings.ANTHROPIC_API_KEY:
            raise ValueError("ANTHROPIC_API_KEY is not set.")
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = settings.ANTHROPIC_MODEL  # e.g. "claude-3-5-sonnet-20241022"

    # ── Text-based analysis ───────────────────────────────────────

    def analyze_bill_text(self, text: str) -> Dict[str, Any]:
        """Analyze medical bill text and return structured JSON."""
        prompt = (
            "Analyze the following medical bill text. "
            "Extract all line items, amounts, and codes. "
            "Then perform the full error-detection analysis as instructed.\n\n"
            "Write each finding in DETAIL so a patient can understand exactly what was billed, "
            "what the issue is, and what to do next. Include specific amounts and line references.\n\n"
            f"Return ONLY a JSON object matching this exact structure (do not include markdown formatting or backticks):\n{OUTPUT_SCHEMA}\n\n"
            f"Bill text:\n{text}"
        )

        try:
            response = self.client.messages.create(
                model=self.model,
                system=SYSTEM_PROMPT,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.15,
                max_tokens=8192,
            )
            return self._parse_response(response.content[0].text)
        except Exception as e:
            raise Exception(f"Anthropic text analysis error: {str(e)}")

    # ── Vision-based analysis (scanned PDFs, images) ──────────────

    def analyze_bill_images(self, image_data_uris: List[str]) -> Dict[str, Any]:
        """
        Analyze medical bill images using Claude 3.5 Sonnet vision capability.

        Args:
            image_data_uris: List of base64 data-URI strings
                e.g. ["data:image/jpeg;base64,iVBOR..."]
        """
        content: list = []

        for uri in image_data_uris:
            # Parse the data URI to get media type and base64 data
            # Format: data:image/jpeg;base64,...
            match = re.match(r"data:(image/[^;]+);base64,(.+)", uri)
            if match:
                media_type = match.group(1)
                base64_data = match.group(2)
                content.append({
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": base64_data,
                    }
                })

        content.append({
            "type": "text",
            "text": (
                "Analyze this medical bill image(s). "
                "Extract all line items, amounts, codes, dates, and provider information. "
                "Then perform the full error-detection analysis as instructed.\n\n"
                "Write each finding in DETAIL so a patient can understand exactly what was billed, "
                "what the issue is, and what to do next. Include specific amounts and line references.\n\n"
                f"Return ONLY a JSON object matching this exact structure (do not include markdown formatting or backticks):\n{OUTPUT_SCHEMA}"
            )
        })

        try:
            response = self.client.messages.create(
                model=self.model,
                system=SYSTEM_PROMPT,
                messages=[
                    {"role": "user", "content": content}
                ],
                temperature=0.15,
                max_tokens=8192,
            )
            return self._parse_response(response.content[0].text)
        except Exception as e:
            raise Exception(f"Anthropic vision analysis error: {str(e)}")

    # ── Response parsing ──────────────────────────────────────────

    def _parse_response(self, text: str) -> Dict[str, Any]:
        """Parse Claude response into a dictionary with guaranteed fields."""
        # Strip potential markdown json formatting that Claude sometimes adds
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        # Find the first { and last } to extract JSON if there's conversational wrapper
        start_idx = text.find("{")
        end_idx = text.rfind("}")
        
        if start_idx != -1 and end_idx != -1 and end_idx >= start_idx:
            text = text[start_idx:end_idx+1]

        try:
            result = json.loads(text)
            if not isinstance(result, dict):
                return {"raw": text}

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
            return {"raw": text}
