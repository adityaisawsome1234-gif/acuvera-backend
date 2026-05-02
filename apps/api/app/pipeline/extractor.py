from app.services.ai_provider import extract_structured, extract_text


def extract(file_path: str) -> dict:
    text = extract_text(file_path)
    extraction = extract_structured(text)
    extraction["source_path"] = file_path
    return extraction
