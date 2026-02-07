import json
from typing import Dict, Any, List
from openai import OpenAI
from app.core.config import settings


SYSTEM_PROMPT = (
    "You are a medical billing expert AI. Analyze bills and return structured JSON data only. "
    "Look for billing errors, overcharges, duplicate charges, incorrect codes, missing discounts, "
    "and denial risks. Be specific and actionable."
)

ANALYSIS_SCHEMA = """{
  "summary": "A brief 1-2 sentence summary of what this bill is for",
  "total_amount": 0.0,
  "line_items": [
    {
      "description": "Service or procedure name",
      "code": "CPT/HCPCS code if visible",
      "quantity": 1,
      "unit_price": 0.0,
      "total_price": 0.0
    }
  ],
  "issues": [
    {
      "title": "Short issue title (e.g. Duplicate Charge, Overcharge, Incorrect Coding)",
      "description": "Detailed explanation of the issue found",
      "severity": "low|medium|high",
      "estimated_savings": 0.0
    }
  ],
  "estimated_savings_usd": 0.0,
  "confidence": 0.0
}"""


class OpenAIService:
    """Service for interacting with OpenAI API"""

    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not set.")
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL  # e.g. "gpt-4o-mini"

    def analyze_bill_text(self, text: str) -> Dict[str, Any]:
        """Analyze medical bill text and return structured JSON."""
        prompt = f"""Analyze the following medical bill text and return a JSON object with this structure:
{ANALYSIS_SCHEMA}

Bill text:
{text}

Return ONLY valid JSON, no additional text or markdown formatting."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
            )
            return self._parse_response(response)
        except Exception as e:
            raise Exception(f"OpenAI text analysis error: {str(e)}")

    def analyze_bill_images(self, image_data_uris: List[str]) -> Dict[str, Any]:
        """
        Analyze medical bill images using GPT-4o vision capability.

        Args:
            image_data_uris: List of base64 data-URI strings
                e.g. ["data:image/png;base64,iVBOR..."]
        """
        # Build the content array with text + images
        content: list = [
            {
                "type": "text",
                "text": (
                    f"Analyze this medical bill image(s) and return a JSON object with this structure:\n"
                    f"{ANALYSIS_SCHEMA}\n\n"
                    f"Extract all line items, amounts, codes, and identify any billing issues. "
                    f"Return ONLY valid JSON."
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
            # Use gpt-4o-mini which supports vision
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": content},
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=4096,
            )
            return self._parse_response(response)
        except Exception as e:
            raise Exception(f"OpenAI vision analysis error: {str(e)}")

    def _parse_response(self, response) -> Dict[str, Any]:
        """Parse OpenAI response into a dictionary."""
        content = response.choices[0].message.content
        try:
            result = json.loads(content)
            if not isinstance(result, dict):
                return {"raw": content}

            # Ensure required fields
            result.setdefault("summary", "")
            result.setdefault("issues", [])
            result.setdefault("estimated_savings_usd", 0.0)
            result.setdefault("confidence", 0.0)
            result.setdefault("line_items", [])
            result.setdefault("total_amount", 0.0)
            return result
        except json.JSONDecodeError:
            return {"raw": content}
