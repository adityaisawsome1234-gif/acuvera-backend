"""
Deterministic CPT/ICD code validation using PyCTAKES + rule-based checks.

This is the accuracy backbone of the pipeline — no hallucination risk
because all checks are rule-based lookups and pattern matching.
"""

import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from app.services.biobert_service import ExtractionResult


@dataclass
class CodeIssue:
    code: str
    issue_type: str       # INVALID_CODE, EXPIRED_CODE, DESCRIPTION_MISMATCH,
                          # MUTUALLY_EXCLUSIVE, MISSING_MODIFIER, UNBUNDLING
    severity: str         # Low, Medium, High
    description: str
    confidence: float     # Always high for rule-based (0.85-0.95)
    estimated_savings: float = 0.0
    recommended_action: str = ""
    source: str = "PyCTAKES"


@dataclass
class ValidationResult:
    issues: List[CodeIssue] = field(default_factory=list)
    validated_codes: List[str] = field(default_factory=list)
    invalid_codes: List[str] = field(default_factory=list)


# ── Known CPT code ranges and descriptions ─────────────────────────

CPT_RANGES = {
    (99201, 99215): "Office/Outpatient E/M Visit",
    (99221, 99223): "Initial Hospital Care",
    (99231, 99233): "Subsequent Hospital Care",
    (99281, 99285): "Emergency Department Visit",
    (99381, 99397): "Preventive Medicine Visit",
    (70000, 79999): "Radiology",
    (80000, 89999): "Pathology/Laboratory",
    (90000, 99199): "Medicine",
    (10000, 69999): "Surgery",
    (100, 1999): "Anesthesia",
}

# E/M level descriptions for mismatch detection
EM_LEVELS = {
    "99211": ("Level 1", "minimal"),
    "99212": ("Level 2", "straightforward"),
    "99213": ("Level 3", "low complexity"),
    "99214": ("Level 4", "moderate complexity"),
    "99215": ("Level 5", "high complexity"),
}

# Known mutually exclusive code pairs (simplified set)
MUTUALLY_EXCLUSIVE = [
    ("99213", "99214"),  # Can't bill two E/M levels same visit
    ("99213", "99215"),
    ("99214", "99215"),
    ("99212", "99213"),
    ("99221", "99222"),
    ("99221", "99223"),
    ("99222", "99223"),
]

# Codes that commonly require modifiers
MODIFIER_REQUIRED_PATTERNS = {
    # If E/M code on same day as procedure, needs modifier 25
    "em_with_procedure": {
        "em_range": range(99201, 99216),
        "modifier": "25",
        "description": "E/M service billed same day as procedure without modifier 25",
    },
}


class CodeValidationService:
    """Deterministic CPT/ICD code validation."""

    def __init__(self):
        self._ctakes_available = False
        try:
            import pyctakes  # noqa: F401
            self._ctakes_available = True
        except ImportError:
            print("[CodeValidation] pyctakes not installed, using built-in rules only", flush=True)

    def validate(
        self,
        gpt_result: Dict[str, Any],
        entities: ExtractionResult,
    ) -> ValidationResult:
        """
        Validate codes found by GPT and BioBERT against known rules.

        Returns deterministic, high-confidence issues.
        """
        result = ValidationResult()

        # Collect all codes from GPT line items and BioBERT extraction
        gpt_codes = self._extract_gpt_codes(gpt_result)
        all_codes = sorted(set(gpt_codes + entities.cpt_codes + entities.hcpcs_codes))

        # Run each validation check
        self._check_code_validity(all_codes, result)
        self._check_description_mismatches(gpt_result, result)
        self._check_mutually_exclusive(all_codes, result)
        self._check_modifier_requirements(all_codes, gpt_result, result)
        self._check_duplicate_codes(gpt_result, result)
        self._check_icd_validity(entities.icd_codes, result)

        if self._ctakes_available:
            self._run_ctakes_validation(gpt_result, entities, result)

        return result

    def _extract_gpt_codes(self, gpt_result: Dict[str, Any]) -> List[str]:
        """Pull CPT/HCPCS codes from GPT's line items."""
        codes = []
        for item in gpt_result.get("line_items", []):
            code = str(item.get("code", "")).strip()
            if code and code != "SUMMARY" and re.match(r"^\d{5}$", code):
                codes.append(code)
        return codes

    def _check_code_validity(self, codes: List[str], result: ValidationResult):
        """Check if CPT codes fall within valid ranges."""
        for code in codes:
            if not re.match(r"^\d{5}$", code):
                continue
            num = int(code)
            valid = False
            for (lo, hi) in CPT_RANGES:
                if lo <= num <= hi:
                    valid = True
                    break
            if valid:
                result.validated_codes.append(code)
            else:
                result.invalid_codes.append(code)
                result.issues.append(CodeIssue(
                    code=code,
                    issue_type="INVALID_CODE",
                    severity="High",
                    description=f"CPT code {code} does not fall within any recognized code range. "
                                f"This may be an invalid or retired code.",
                    confidence=0.92,
                    recommended_action=f"Verify CPT code {code} against the current AMA CPT codebook. "
                                       f"If invalid, request a corrected bill with the proper code.",
                ))

    def _check_description_mismatches(self, gpt_result: Dict[str, Any], result: ValidationResult):
        """Check if E/M code levels match their descriptions."""
        for item in gpt_result.get("line_items", []):
            code = str(item.get("code", "")).strip()
            desc = str(item.get("description", "")).lower()

            if code not in EM_LEVELS:
                continue

            level_name, complexity = EM_LEVELS[code]

            # Check if description mentions a DIFFERENT level
            for other_code, (other_level, _) in EM_LEVELS.items():
                if other_code == code:
                    continue
                if other_level.lower() in desc and level_name.lower() not in desc:
                    result.issues.append(CodeIssue(
                        code=code,
                        issue_type="DESCRIPTION_MISMATCH",
                        severity="High",
                        description=f"CPT {code} ({level_name}, {complexity}) was billed, but the "
                                    f"description mentions '{other_level}'. This suggests possible "
                                    f"upcoding or a coding error.",
                        confidence=0.88,
                        estimated_savings=50.0,
                        recommended_action=f"Compare the documentation to determine whether {code} "
                                           f"or {other_code} is the correct level of service.",
                    ))
                    break

    def _check_mutually_exclusive(self, codes: List[str], result: ValidationResult):
        """Check for mutually exclusive code pairs."""
        code_set = set(codes)
        checked = set()
        for a, b in MUTUALLY_EXCLUSIVE:
            pair = (min(a, b), max(a, b))
            if pair in checked:
                continue
            if a in code_set and b in code_set:
                checked.add(pair)
                result.issues.append(CodeIssue(
                    code=f"{a}, {b}",
                    issue_type="MUTUALLY_EXCLUSIVE",
                    severity="High",
                    description=f"CPT codes {a} and {b} are mutually exclusive and should not "
                                f"both appear on the same claim. Only one level of E/M service "
                                f"can be billed per provider per date of service.",
                    confidence=0.95,
                    estimated_savings=100.0,
                    recommended_action=f"Remove one of the codes ({a} or {b}). The provider should "
                                       f"bill only the code that matches the documented level of service.",
                ))

    def _check_modifier_requirements(
        self, codes: List[str], gpt_result: Dict[str, Any], result: ValidationResult,
    ):
        """Check if procedures billed same-day as E/M are missing modifier 25."""
        code_set = set(codes)
        em_codes = [c for c in code_set if c.isdigit() and 99201 <= int(c) <= 99215]
        proc_codes = [c for c in code_set if c.isdigit() and 10000 <= int(c) <= 69999]

        if em_codes and proc_codes:
            # Check if any line item description mentions modifier 25
            descriptions = " ".join(
                str(item.get("description", ""))
                for item in gpt_result.get("line_items", [])
            ).lower()

            if "modifier 25" not in descriptions and "-25" not in descriptions:
                result.issues.append(CodeIssue(
                    code=em_codes[0],
                    issue_type="MISSING_MODIFIER",
                    severity="Medium",
                    description=f"E/M code {em_codes[0]} was billed on the same claim as procedure "
                                f"code(s) {', '.join(proc_codes[:3])} without modifier 25. This is "
                                f"a common denial trigger.",
                    confidence=0.87,
                    estimated_savings=75.0,
                    recommended_action="Add modifier 25 to the E/M code to indicate a separately "
                                       "identifiable evaluation and management service.",
                ))

    def _check_duplicate_codes(self, gpt_result: Dict[str, Any], result: ValidationResult):
        """Check for duplicate CPT codes across line items."""
        seen: Dict[str, int] = {}
        for item in gpt_result.get("line_items", []):
            code = str(item.get("code", "")).strip()
            if not code or code == "SUMMARY":
                continue
            seen[code] = seen.get(code, 0) + 1

        for code, count in seen.items():
            if count > 1:
                result.issues.append(CodeIssue(
                    code=code,
                    issue_type="UNBUNDLING",
                    severity="High",
                    description=f"CPT code {code} appears {count} times on this bill. "
                                f"Unless each instance represents a distinct service with "
                                f"proper documentation, this may be a duplicate charge.",
                    confidence=0.90,
                    estimated_savings=100.0,
                    recommended_action=f"Verify whether {code} was legitimately performed "
                                       f"{count} times. If duplicate, request removal.",
                ))

    def _check_icd_validity(self, icd_codes: List[str], result: ValidationResult):
        """Basic ICD-10 format validation."""
        for code in icd_codes:
            if not re.match(r"^[A-TV-Z]\d{2}(\.\d{1,4})?$", code):
                result.issues.append(CodeIssue(
                    code=code,
                    issue_type="INVALID_CODE",
                    severity="Medium",
                    description=f"ICD-10 code '{code}' does not match the expected format. "
                                f"Valid ICD-10 codes start with a letter (A-T, V-Z) followed by digits.",
                    confidence=0.93,
                    recommended_action=f"Verify the diagnosis code '{code}' is correct and properly formatted.",
                ))

    def _run_ctakes_validation(
        self,
        gpt_result: Dict[str, Any],
        entities: ExtractionResult,
        result: ValidationResult,
    ):
        """Run PyCTAKES clinical NLP pipeline for additional UMLS-based validation."""
        try:
            from pyctakes import ClinicalPipeline
            pipeline = ClinicalPipeline()

            bill_text_parts = []
            for item in gpt_result.get("line_items", []):
                desc = item.get("description", "")
                code = item.get("code", "")
                if desc:
                    bill_text_parts.append(f"{desc} ({code})" if code else desc)

            if not bill_text_parts:
                return

            clinical_text = ". ".join(bill_text_parts)
            ctakes_result = pipeline.process(clinical_text)

            for annotation in getattr(ctakes_result, "annotations", []):
                cui = getattr(annotation, "cui", None)
                preferred = getattr(annotation, "preferred_text", "")
                if cui and preferred:
                    result.validated_codes.append(f"UMLS:{cui}")

        except Exception as exc:
            print(f"[CodeValidation] PyCTAKES processing failed: {exc}", flush=True)
