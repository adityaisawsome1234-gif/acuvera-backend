"""
MedGemma clinical validation via Google Cloud Vertex AI.

Replaces the previous Together AI multi-model approach with a single
MedGemma endpoint on Vertex AI for clinical reasoning validation.
"""

import json
import traceback
from typing import Any, Dict, List, Optional

from app.core.config import settings
from app.services.biobert_service import ExtractionResult
from app.services.code_validation_service import ValidationResult


CLINICAL_VALIDATION_PROMPT = """\
You are a clinical reasoning validator for a medical billing auditor.

You will receive:
1. Bill text (excerpt).
2. A JSON analysis produced by GPT containing detected_issues.
3. Entities extracted by a local NER model (BioBERT).
4. Code validation issues found by a deterministic rule engine (PyCTAKES).

Your task:
- For EACH detected issue from GPT, evaluate whether the clinical reasoning \
  is medically sound. Consider diagnosis-procedure relationships, standard of \
  care, and coding accuracy.
- For EACH code validation issue from PyCTAKES, confirm or dispute the finding \
  from a clinical perspective.
- If you spot a clinically relevant billing error that was MISSED by both GPT \
  and PyCTAKES, add it.

Return ONLY a JSON object:
{
  "validated_issues": [
    {
      "original_index": 0,
      "agrees": true,
      "clinical_note": "short clinical assessment"
    }
  ],
  "code_validations": [
    {
      "code": "99213",
      "agrees": true,
      "clinical_note": "code is appropriate for documented complexity"
    }
  ],
  "new_issues": [
    {
      "category": "Financial | Coding | Administrative | Insurance | Compliance",
      "severity": "Low | Medium | High",
      "description": "detailed plain-language explanation",
      "confidence": 0.0,
      "estimated_savings": 0.0,
      "recommended_action": "what to do"
    }
  ]
}"""


class MedicalModelService:
    """Runs GPT analysis + local NLP results through MedGemma for clinical validation."""

    def __init__(self):
        self._endpoint = None

    def _get_endpoint(self):
        if self._endpoint is not None:
            return self._endpoint
        try:
            from google.cloud import aiplatform
            aiplatform.init(
                project=settings.GCP_PROJECT_ID,
                location=settings.GCP_LOCATION,
            )
            self._endpoint = aiplatform.Endpoint(settings.MEDGEMMA_ENDPOINT_ID)
            print(f"[MedGemma] Connected to endpoint {settings.MEDGEMMA_ENDPOINT_ID}", flush=True)
            return self._endpoint
        except Exception as exc:
            print(f"[MedGemma] Failed to connect to Vertex AI: {exc}", flush=True)
            return None

    def validate_clinical(
        self,
        gpt_result: Dict[str, Any],
        bill_text: str,
        entities: ExtractionResult,
        code_issues: ValidationResult,
    ) -> Optional[Dict[str, Any]]:
        """
        Send all prior-stage outputs to MedGemma for clinical review.
        Returns the MedGemma response dict or None on failure.
        """
        endpoint = self._get_endpoint()
        if endpoint is None:
            return None

        user_payload = json.dumps({
            "bill_text_excerpt": bill_text[:4000],
            "gpt_analysis": {
                "summary": gpt_result.get("summary", ""),
                "risk_score": gpt_result.get("risk_score", 0),
                "detected_issues": gpt_result.get("detected_issues", []),
            },
            "biobert_entities": {
                "cpt_codes": entities.cpt_codes,
                "icd_codes": entities.icd_codes,
                "hcpcs_codes": entities.hcpcs_codes,
                "entity_count": len(entities.entities),
            },
            "code_validation_issues": [
                {
                    "code": ci.code,
                    "issue_type": ci.issue_type,
                    "severity": ci.severity,
                    "description": ci.description,
                }
                for ci in code_issues.issues
            ],
        }, indent=2)

        try:
            instances = [{
                "inputs": f"<start_of_turn>system\n{CLINICAL_VALIDATION_PROMPT}\n"
                          f"<start_of_turn>user\n{user_payload}\n"
                          f"<start_of_turn>model\n",
                "parameters": {
                    "temperature": 0.1,
                    "max_output_tokens": 4096,
                },
            }]

            response = endpoint.predict(instances=instances, timeout=settings.MEDICAL_MODEL_TIMEOUT)

            raw = ""
            if hasattr(response, "predictions") and response.predictions:
                raw = str(response.predictions[0])
            elif isinstance(response, list) and response:
                raw = str(response[0])

            return self._parse_response(raw)

        except Exception as exc:
            print(f"[MedGemma] Prediction failed: {exc}", flush=True)
            traceback.print_exc()
            return None

    def _parse_response(self, raw: str) -> Optional[Dict[str, Any]]:
        """Parse MedGemma's response, extracting JSON from potential markdown fences."""
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
            if raw.endswith("```"):
                raw = raw[:-3]
            raw = raw.strip()

        # Try to find JSON object in the response
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start >= 0 and end > start:
            raw = raw[start:end]

        try:
            result = json.loads(raw)
            if isinstance(result, dict):
                return result
        except json.JSONDecodeError:
            print(f"[MedGemma] Failed to parse JSON response", flush=True)

        return None
