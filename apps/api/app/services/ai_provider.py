import json
import os
from typing import Any

import boto3
from PyPDF2 import PdfReader

from app.core.config import settings


def _bedrock_runtime():
    return boto3.client("bedrock-runtime", region_name=settings.BEDROCK_REGION)


def _bedrock_invoke(prompt: str) -> dict:
    if not settings.BEDROCK_MODEL_ID:
        raise RuntimeError("BEDROCK_MODEL_ID not configured")
    runtime = _bedrock_runtime()
    body = json.dumps(
        {
            "prompt": prompt,
            "max_gen_len": 1024,
            "temperature": 0.2,
        }
    )
    response = runtime.invoke_model(modelId=settings.BEDROCK_MODEL_ID, body=body)
    payload = json.loads(response["body"].read())
    return payload


def _openai_invoke(prompt: str) -> dict:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY not configured")
    from openai import OpenAI

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    content = response.choices[0].message.content if response.choices else ""
    return {"output_text": content or ""}


def _extract_json_object(text: str) -> dict[str, Any]:
    try:
        parsed = json.loads(text)
        return parsed if isinstance(parsed, dict) else {}
    except json.JSONDecodeError:
        pass
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            return {}
    return {}


def _extract_json_list(text: str) -> list[dict[str, Any]]:
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict) and isinstance(parsed.get("findings"), list):
            return parsed["findings"]
    except json.JSONDecodeError:
        pass
    start = text.find("[")
    end = text.rfind("]")
    if start != -1 and end != -1 and end > start:
        try:
            parsed = json.loads(text[start : end + 1])
            return parsed if isinstance(parsed, list) else []
        except json.JSONDecodeError:
            return []
    return []


def extract_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        try:
            reader = PdfReader(file_path)
            return "\n".join(page.extract_text() or "" for page in reader.pages).strip()
        except Exception:
            if settings.AI_ALLOW_STUB:
                return ""
            raise
    if ext in {".png", ".jpg", ".jpeg"} and settings.TEXTRACT_ENABLED:
        client = boto3.client("textract", region_name=settings.BEDROCK_REGION)
        with open(file_path, "rb") as handle:
            image_bytes = handle.read()
        response = client.detect_document_text(Document={"Bytes": image_bytes})
        lines = [
            block["Text"]
            for block in response.get("Blocks", [])
            if block.get("BlockType") == "LINE"
        ]
        return "\n".join(lines).strip()
    raise RuntimeError("Image OCR requires Textract (set TEXTRACT_ENABLED=true)")


def extract_structured(text: str) -> dict[str, Any]:
    prompt = (
        "Extract structured fields from this medical document text. "
        "Return JSON with keys: document_type, patient_name, total_amount, "
        "line_items (array of {code, description, amount}), confidence.\n\n"
        f"Text:\n{text[:6000]}"
    )
    try:
        if settings.AI_PROVIDER == "openai":
            result = _openai_invoke(prompt)
        else:
            result = _bedrock_invoke(prompt)
    except Exception:
        if settings.AI_ALLOW_STUB:
            return {
                "document_type": "medical_bill",
                "patient_name": "Unknown",
                "total_amount": 0.0,
                "line_items": [],
                "confidence": 0.3,
            }
        raise
    output = result.get("output_text") or result.get("generation") or ""
    parsed = _extract_json_object(output)
    if parsed:
        return parsed
    return {
        "document_type": "medical_bill",
        "patient_name": "Unknown",
        "total_amount": 0.0,
        "line_items": [],
        "confidence": 0.4,
    }


def audit_findings(extraction: dict[str, Any]) -> list[dict[str, Any]]:
    prompt = (
        "You are an audit assistant. Generate 8-15 audit findings as JSON list. "
        "Each finding has category (coding, coverage, billing, policy, clinical, duplicate, compliance, other), "
        "severity (low, medium, high, critical), summary, detail.\n\n"
        f"Extraction:\n{json.dumps(extraction)[:4000]}"
    )
    try:
        if settings.AI_PROVIDER == "openai":
            result = _openai_invoke(prompt)
        else:
            result = _bedrock_invoke(prompt)
    except Exception:
        if settings.AI_ALLOW_STUB:
            return [
                {
                    "category": "billing",
                    "severity": "low",
                    "summary": "Stubbed finding",
                    "detail": "AI provider not configured in test.",
                }
            ]
        raise
    output = result.get("output_text") or result.get("generation") or ""
    findings = _extract_json_list(output)
    return findings
