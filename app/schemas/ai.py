from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict


class AnalyzeRequest(BaseModel):
    """Request schema for bill text analysis"""
    text: str = Field(..., description="The bill text to analyze", min_length=1)


class Issue(BaseModel):
    """Issue found in bill analysis"""
    title: str
    description: str
    severity: str = Field(..., pattern="^(low|medium|high)$")


class AnalyzeResponse(BaseModel):
    """Response schema for bill analysis"""
    summary: str
    issues: List[Issue]
    estimated_savings_usd: float = Field(..., ge=0.0)
    confidence: float = Field(..., ge=0.0, le=1.0)


class AnalyzeResult(BaseModel):
    """Wrapper for analysis result (handles both structured and raw responses)"""
    result: Dict[str, Any]
