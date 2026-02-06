import json
from typing import Dict, Any
from openai import OpenAI
from app.core.config import settings


class OpenAIService:
    """Service for interacting with OpenAI API"""
    
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError(
                "OPENAI_API_KEY is not set. Please set it in your .env file."
            )
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
    
    def analyze_bill_text(self, text: str) -> Dict[str, Any]:
        """
        Analyze medical bill text using OpenAI and return structured JSON.
        
        Args:
            text: The bill text to analyze
            
        Returns:
            Dictionary with:
            - summary: string
            - issues: list of {title, description, severity}
            - estimated_savings_usd: number
            - confidence: number (0 to 1)
            
        Raises:
            ValueError: If OPENAI_API_KEY is not set
            Exception: If OpenAI API call fails
        """
        prompt = f"""Analyze the following medical bill text and return a JSON object with the following structure:
{{
  "summary": "A brief summary of the bill",
  "issues": [
    {{
      "title": "Issue title",
      "description": "Detailed description of the issue",
      "severity": "low|medium|high"
    }}
  ],
  "estimated_savings_usd": 0.0,
  "confidence": 0.0
}}

Bill text:
{text}

Return ONLY valid JSON, no additional text or markdown formatting."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a medical billing expert. Analyze bills and return structured JSON data only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            # Extract the JSON content
            content = response.choices[0].message.content
            
            # Try to parse as JSON
            try:
                result = json.loads(content)
                
                # Validate structure
                if not isinstance(result, dict):
                    return {"raw": content}
                
                # Ensure required fields exist
                if "summary" not in result:
                    result["summary"] = ""
                if "issues" not in result:
                    result["issues"] = []
                if "estimated_savings_usd" not in result:
                    result["estimated_savings_usd"] = 0.0
                if "confidence" not in result:
                    result["confidence"] = 0.0
                
                return result
                
            except json.JSONDecodeError:
                # If parsing fails, return raw content
                return {"raw": content}
                
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
