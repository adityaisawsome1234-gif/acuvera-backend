"""
Consensus engine for the multi-stage medical billing analysis pipeline.

Merges three sources:
  1. GPT findings (initial analysis)
  2. PyCTAKES code validation issues (deterministic, rule-based)
  3. MedGemma clinical validation (agrees/disagrees + new findings)

Adjusts confidence scores based on cross-model agreement and tags each
finding with model_agreement / validated_by metadata.
"""

from typing import Any, Dict, List, Optional

from app.services.code_validation_service import CodeIssue, ValidationResult


def _safe_list(d: Optional[Dict], key: str) -> List[Dict]:
    if d is None:
        return []
    val = d.get(key)
    return val if isinstance(val, list) else []


def merge_results(
    gpt_result: Dict[str, Any],
    code_validation: Optional[ValidationResult],
    medgemma_out: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Merge GPT + PyCTAKES + MedGemma outputs into a single enriched result.

    Mutates and returns ``gpt_result`` with enriched issues.
    """
    detected_issues: List[Dict] = gpt_result.get("detected_issues", [])

    # ── Index MedGemma validation by original_index ────────────
    gemma_by_idx: Dict[int, Dict] = {
        v.get("original_index", -1): v
        for v in _safe_list(medgemma_out, "validated_issues")
    }

    # ── Enrich each GPT issue ─────────────────────────────────

    for idx, issue in enumerate(detected_issues):
        validated_by: List[str] = ["GPT"]
        agreeing: List[str] = ["GPT"]

        # MedGemma validation
        gemma = gemma_by_idx.get(idx)
        if gemma is not None:
            validated_by.append("MedGemma")
            if gemma.get("agrees", False):
                agreeing.append("MedGemma")
            note = gemma.get("clinical_note")
            if note:
                issue["clinical_note"] = note

        # Check if PyCTAKES found a matching code issue
        if code_validation:
            issue_code = _extract_code_from_issue(issue)
            ctakes_match = _find_ctakes_match(issue_code, issue, code_validation)
            if ctakes_match:
                validated_by.append("PyCTAKES")
                agreeing.append("PyCTAKES")

        # Confidence adjustment
        total_v = len(validated_by)
        total_a = len(agreeing)
        original_conf = float(issue.get("confidence", 0.8))

        if total_a >= 3:
            issue["confidence"] = min(1.0, round(original_conf + 0.15, 2))
        elif total_v >= 2 and total_a >= 2:
            issue["confidence"] = min(1.0, round(original_conf + 0.05, 2))
        elif total_v >= 2 and total_a == 1:
            issue["confidence"] = max(0.0, round(original_conf - 0.15, 2))
            issue.setdefault("needs_human_review", True)

        issue["model_agreement"] = f"{total_a}/{total_v} models agree"
        issue["validated_by"] = ", ".join(validated_by)

    # ── Append PyCTAKES-only issues (GPT missed) ──────────────

    if code_validation:
        for ci in code_validation.issues:
            if not _is_duplicate_of_gpt(ci, detected_issues):
                detected_issues.append({
                    "category": "Coding",
                    "severity": ci.severity,
                    "description": ci.description,
                    "confidence": ci.confidence,
                    "estimated_savings": ci.estimated_savings,
                    "recommended_action": ci.recommended_action,
                    "affected_items": [ci.code],
                    "model_agreement": "1/1 models agree",
                    "validated_by": "PyCTAKES",
                })

    # ── Append MedGemma-only new issues ───────────────────────

    for ni in _safe_list(medgemma_out, "new_issues"):
        ni.setdefault("confidence", 0.75)
        ni.setdefault("estimated_savings", 0.0)
        ni["model_agreement"] = "1/1 models agree"
        ni["validated_by"] = "MedGemma"
        detected_issues.append(ni)

    gpt_result["detected_issues"] = detected_issues
    return gpt_result


def _extract_code_from_issue(issue: Dict) -> str:
    """Try to pull a CPT/HCPCS code from a GPT issue."""
    affected = issue.get("affected_items", [])
    if affected:
        return str(affected[0])
    desc = issue.get("description", "")
    import re
    match = re.search(r"\b(\d{5})\b", desc)
    return match.group(1) if match else ""


def _find_ctakes_match(code: str, issue: Dict, validation: ValidationResult) -> bool:
    """Check if any PyCTAKES issue matches this GPT finding."""
    issue_desc = issue.get("description", "").lower()
    for ci in validation.issues:
        if code and code in ci.code:
            return True
        if ci.issue_type == "UNBUNDLING" and "duplicate" in issue_desc:
            return True
        if ci.issue_type == "DESCRIPTION_MISMATCH" and "upcod" in issue_desc:
            return True
    return False


def _is_duplicate_of_gpt(ci: CodeIssue, gpt_issues: List[Dict]) -> bool:
    """Check if a PyCTAKES issue already exists in GPT findings."""
    for issue in gpt_issues:
        desc = issue.get("description", "").lower()
        if ci.code in desc:
            if ci.issue_type == "UNBUNDLING" and "duplicate" in desc:
                return True
            if ci.issue_type == "MUTUALLY_EXCLUSIVE" and "mutually exclusive" in desc:
                return True
            if ci.issue_type == "MISSING_MODIFIER" and "modifier" in desc:
                return True
            if ci.issue_type == "DESCRIPTION_MISMATCH" and ("upcode" in desc or "mismatch" in desc):
                return True
    return False
