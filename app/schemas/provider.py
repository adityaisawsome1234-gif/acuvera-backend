from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime


class ErrorBreakdown(BaseModel):
    type: str
    count: int
    total_savings: float


class MonthlySavings(BaseModel):
    month: str  # YYYY-MM
    savings: float
    claims_count: int


class ProviderStatsResponse(BaseModel):
    claims_reviewed: int
    errors_caught: int
    estimated_savings_total: float
    error_breakdown: List[ErrorBreakdown]
    savings_over_time: List[MonthlySavings]


class ProviderDashboardResponse(BaseModel):
    organization_id: int
    organization_name: str
    stats: ProviderStatsResponse
    recent_bills: List[dict]  # Simplified bill info

