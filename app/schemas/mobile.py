"""
Mobile app-specific schemas matching the mobile app's TypeScript types
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class FlaggedItemResponse(BaseModel):
    """Matches FlaggedItem interface from mobile app"""
    id: str
    serviceName: str
    serviceCode: str
    chargedAmount: float
    expectedAmount: float
    savings: float
    severity: str  # 'high' | 'medium' | 'low'
    errorType: str  # 'duplicate' | 'upcoding' | 'out-of-network' | 'unbundling' | 'coverage-mismatch'
    explanation: str
    whyMatters: str
    nextSteps: str
    successProbability: float
    estimatedResolution: str


class BillAnalysisResponse(BaseModel):
    """Matches BillAnalysis interface from mobile app"""
    id: str
    providerName: str
    date: str  # ISO date string
    totalAmount: float
    potentialSavings: float
    confidenceScore: float  # 0-100
    status: str  # 'analyzed' | 'pending' | 'resolved'
    flaggedItems: List[FlaggedItemResponse] = []


class UserStatsResponse(BaseModel):
    """Matches UserStats interface from mobile app"""
    monthlySavings: float
    monthlyTrend: float  # percentage
    totalSavedThisYear: float
    billsAnalyzed: int
    issuesFound: int


class ActionItemResponse(BaseModel):
    """Matches ActionItem interface from mobile app"""
    id: str
    title: str
    icon: str
    description: str
    badge: Optional[str] = None
    type: str  # 'email' | 'request' | 'call' | 'save'
    phoneNumber: Optional[str] = None


class BillUploadResponse(BaseModel):
    """Response after bill upload"""
    success: bool
    billId: str
    message: str


class AnalysisStatusResponse(BaseModel):
    """Analysis progress status"""
    billId: str
    status: str  # 'pending' | 'processing' | 'completed' | 'failed'
    progress: float  # 0-100
    currentStep: Optional[str] = None
    estimatedTimeRemaining: Optional[int] = None  # seconds
