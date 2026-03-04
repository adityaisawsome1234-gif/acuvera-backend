"""
BioBERT-based medical Named Entity Recognition.

Runs locally on the server (no API keys). Extracts medical entities,
procedure codes, drug names, conditions, and provider info from bill text.
Uses a singleton to load the model once and reuse across requests.
"""

import re
import threading
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from app.core.config import settings


@dataclass
class MedicalEntity:
    text: str
    label: str          # PROCEDURE, DRUG, CONDITION, CODE, PROVIDER, DATE
    start: int = 0
    end: int = 0
    score: float = 1.0


@dataclass
class ExtractionResult:
    entities: List[MedicalEntity] = field(default_factory=list)
    cpt_codes: List[str] = field(default_factory=list)
    icd_codes: List[str] = field(default_factory=list)
    hcpcs_codes: List[str] = field(default_factory=list)
    npi_numbers: List[str] = field(default_factory=list)


# ── Regex patterns for deterministic code extraction ───────────────

CPT_PATTERN = re.compile(r"\b(\d{5})\b")
ICD10_PATTERN = re.compile(r"\b([A-TV-Z]\d{2}(?:\.\d{1,4})?)\b")
HCPCS_PATTERN = re.compile(r"\b([A-V]\d{4})\b")
NPI_PATTERN = re.compile(r"\b(\d{10})\b")
MODIFIER_PATTERN = re.compile(r"\b(\d{2}|[A-Z]{2})\b")


class _BioBERTSingleton:
    """Lazy-loaded singleton for the BioBERT NER pipeline."""

    _instance: Optional["_BioBERTSingleton"] = None
    _lock = threading.Lock()

    def __init__(self):
        self.pipeline = None
        self._loaded = False

    @classmethod
    def get(cls) -> "_BioBERTSingleton":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def load(self):
        if self._loaded:
            return
        with self._lock:
            if self._loaded:
                return
            try:
                from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline as hf_pipeline
                print(f"[BioBERT] Loading model {settings.BIOBERT_MODEL}...", flush=True)
                tokenizer = AutoTokenizer.from_pretrained(settings.BIOBERT_MODEL)
                model = AutoModelForTokenClassification.from_pretrained(settings.BIOBERT_MODEL)
                self.pipeline = hf_pipeline(
                    "ner",
                    model=model,
                    tokenizer=tokenizer,
                    aggregation_strategy="simple",
                )
                self._loaded = True
                print("[BioBERT] Model loaded successfully", flush=True)
            except Exception as exc:
                print(f"[BioBERT] Model load failed (falling back to regex-only): {exc}", flush=True)
                self._loaded = True  # Don't retry on every request


# ── Public service ─────────────────────────────────────────────────

class BioBERTService:
    """Extract medical entities from bill text using BioBERT + regex."""

    def extract_entities(self, text: str) -> ExtractionResult:
        result = ExtractionResult()

        # Always run deterministic regex extraction
        self._extract_codes(text, result)

        # Run BioBERT NER if available
        singleton = _BioBERTSingleton.get()
        singleton.load()

        if singleton.pipeline is not None:
            self._extract_with_biobert(text, result, singleton.pipeline)

        return result

    def _extract_codes(self, text: str, result: ExtractionResult):
        """Deterministic regex extraction of medical codes."""
        for match in CPT_PATTERN.finditer(text):
            code = match.group(1)
            # CPT codes: 5-digit, range 00100-99499
            num = int(code)
            if 100 <= num <= 99499:
                result.cpt_codes.append(code)
                result.entities.append(MedicalEntity(
                    text=code, label="CODE",
                    start=match.start(), end=match.end(),
                ))

        for match in ICD10_PATTERN.finditer(text):
            code = match.group(1)
            result.icd_codes.append(code)
            result.entities.append(MedicalEntity(
                text=code, label="CODE",
                start=match.start(), end=match.end(),
            ))

        for match in HCPCS_PATTERN.finditer(text):
            code = match.group(1)
            result.hcpcs_codes.append(code)
            result.entities.append(MedicalEntity(
                text=code, label="CODE",
                start=match.start(), end=match.end(),
            ))

        for match in NPI_PATTERN.finditer(text):
            npi = match.group(1)
            if self._validate_npi(npi):
                result.npi_numbers.append(npi)
                result.entities.append(MedicalEntity(
                    text=npi, label="PROVIDER",
                    start=match.start(), end=match.end(),
                ))

        # De-duplicate
        result.cpt_codes = sorted(set(result.cpt_codes))
        result.icd_codes = sorted(set(result.icd_codes))
        result.hcpcs_codes = sorted(set(result.hcpcs_codes))
        result.npi_numbers = sorted(set(result.npi_numbers))

    def _extract_with_biobert(self, text: str, result: ExtractionResult, pipeline):
        """Run BioBERT NER pipeline for medical entity extraction."""
        try:
            # Truncate to avoid OOM on very long bills
            truncated = text[:4096]
            ner_results = pipeline(truncated)
            for ent in ner_results:
                label = ent.get("entity_group", "MISC")
                word = ent.get("word", "").strip()
                score = float(ent.get("score", 0))
                if score < 0.5 or len(word) < 2:
                    continue
                mapped_label = self._map_biobert_label(label)
                result.entities.append(MedicalEntity(
                    text=word, label=mapped_label,
                    start=ent.get("start", 0), end=ent.get("end", 0),
                    score=score,
                ))
        except Exception as exc:
            print(f"[BioBERT] NER inference failed: {exc}", flush=True)

    @staticmethod
    def _map_biobert_label(label: str) -> str:
        label_upper = label.upper()
        if any(k in label_upper for k in ["DISEASE", "CONDITION", "PROBLEM"]):
            return "CONDITION"
        if any(k in label_upper for k in ["DRUG", "CHEMICAL", "MEDICATION"]):
            return "DRUG"
        if any(k in label_upper for k in ["PROCEDURE", "TREATMENT", "SURGERY"]):
            return "PROCEDURE"
        return "MISC"

    @staticmethod
    def _validate_npi(npi: str) -> bool:
        """Luhn check for NPI numbers."""
        if len(npi) != 10 or not npi.isdigit():
            return False
        digits = [int(d) for d in "80840" + npi]
        total = 0
        for i, d in enumerate(reversed(digits)):
            if i % 2 == 1:
                d *= 2
                if d > 9:
                    d -= 9
            total += d
        return total % 10 == 0
