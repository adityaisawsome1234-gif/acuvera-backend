"""
Mobile app API endpoints
These endpoints are designed to match the mobile app's data structure exactly
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from typing import List, Optional
from app.core.database import get_db
from app.api.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.bill import Bill, BillStatus
from app.models.finding import Finding, FindingType, FindingSeverity
from app.models.line_item import LineItem
from app.schemas.mobile import (
    BillAnalysisResponse,
    FlaggedItemResponse,
    UserStatsResponse,
    ActionItemResponse,
    BillUploadResponse,
    AnalysisStatusResponse
)
from app.schemas.common import StandardResponse
from app.services.bill_service import BillService
import uuid

router = APIRouter()


def map_finding_to_flagged_item(finding: Finding, line_item: Optional[LineItem] = None) -> FlaggedItemResponse:
    """Convert Finding model to FlaggedItemResponse matching mobile app structure"""
    
    # Map FindingType to mobile app errorType
    error_type_map = {
        FindingType.DUPLICATE_CHARGE: "duplicate",
        FindingType.INCORRECT_CODING: "upcoding",
        FindingType.OVERCHARGE: "upcoding",
        FindingType.MISSING_DISCOUNT: "coverage-mismatch",
        FindingType.DENIAL_RISK: "out-of-network",
        FindingType.OTHER: "coverage-mismatch"
    }
    
    # Map FindingSeverity to mobile app severity
    severity_map = {
        FindingSeverity.LOW: "low",
        FindingSeverity.MEDIUM: "medium",
        FindingSeverity.HIGH: "high",
        FindingSeverity.CRITICAL: "high"
    }
    
    service_name = line_item.description if line_item else "Unknown Service"
    service_code = line_item.code if line_item else "N/A"
    charged_amount = line_item.total_price if line_item else finding.estimated_savings * 2
    expected_amount = charged_amount - finding.estimated_savings if line_item else finding.estimated_savings
    
    # Generate additional explanation fields
    why_matters = f"This {error_type_map.get(finding.type, 'issue')} can significantly impact your out-of-pocket costs."
    next_steps = finding.recommended_action or "Contact your billing department to resolve this issue."
    
    # Calculate success probability based on severity and confidence
    success_probability = (finding.confidence * 100) - (10 if finding.severity == FindingSeverity.HIGH else 5)
    success_probability = max(60, min(95, success_probability))
    
    # Estimate resolution time based on severity
    resolution_map = {
        FindingSeverity.LOW: "3-5 business days",
        FindingSeverity.MEDIUM: "5-7 business days",
        FindingSeverity.HIGH: "2-3 business days",
        FindingSeverity.CRITICAL: "1-2 business days"
    }
    
    return FlaggedItemResponse(
        id=str(finding.id),
        serviceName=service_name,
        serviceCode=service_code,
        chargedAmount=round(charged_amount, 2),
        expectedAmount=round(expected_amount, 2),
        savings=round(finding.estimated_savings, 2),
        severity=severity_map.get(finding.severity, "medium"),
        errorType=error_type_map.get(finding.type, "coverage-mismatch"),
        explanation=finding.explanation,
        whyMatters=why_matters,
        nextSteps=next_steps,
        successProbability=round(success_probability, 0),
        estimatedResolution=resolution_map.get(finding.severity, "3-5 business days")
    )


def map_bill_to_analysis(bill: Bill) -> BillAnalysisResponse:
    """Convert Bill model to BillAnalysisResponse matching mobile app structure"""
    
    # Extract provider name from filename or use default
    provider_name = bill.file_name.replace(".pdf", "").replace("_", " ").title()
    if not provider_name or len(provider_name) < 3:
        provider_name = "Medical Provider"
    
    # Calculate total savings from findings
    potential_savings = sum(f.estimated_savings for f in bill.findings)
    
    # Calculate confidence score (average of finding confidences, or 85% default)
    if bill.findings:
        confidence_score = sum(f.confidence for f in bill.findings) / len(bill.findings) * 100
    else:
        confidence_score = 85.0
    
    # Map status
    status_map = {
        BillStatus.COMPLETED: "analyzed",
        BillStatus.PENDING: "pending",
        BillStatus.PROCESSING: "pending",
        BillStatus.FAILED: "pending"
    }
    
    # Convert findings to flagged items
    flagged_items = []
    for finding in bill.findings:
        line_item = next((li for li in bill.line_items if li.id == finding.line_item_id), None)
        flagged_items.append(map_finding_to_flagged_item(finding, line_item))
    
    return BillAnalysisResponse(
        id=str(bill.id),
        providerName=provider_name,
        date=bill.uploaded_at.isoformat() if bill.uploaded_at else datetime.now().isoformat(),
        totalAmount=round(bill.total_amount or 0.0, 2),
        potentialSavings=round(potential_savings, 2),
        confidenceScore=round(confidence_score, 1),
        status=status_map.get(bill.status, "pending"),
        flaggedItems=flagged_items
    )


@router.post("/bills/upload", response_model=StandardResponse[BillUploadResponse])
async def upload_bill_mobile(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload a medical bill (mobile app endpoint)"""
    try:
        service = BillService(db)
        result = await service.upload_bill(
            file=file,
            patient_id=current_user.id,
            organization_id=current_user.organization_id
        )
        
        return StandardResponse(
            success=True,
            data=BillUploadResponse(
                success=True,
                billId=str(result["bill"].id),
                message="Bill uploaded successfully. Analysis will begin shortly."
            )
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/bills", response_model=StandardResponse[List[BillAnalysisResponse]])
async def list_bills_mobile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all bills for the current user (mobile app format)"""
    try:
        # Get all bills for the user
        bills = db.query(Bill).filter(Bill.patient_id == current_user.id).order_by(Bill.uploaded_at.desc()).all()
        
        bill_responses = [map_bill_to_analysis(bill) for bill in bills]
        
        return StandardResponse(
            success=True,
            data=bill_responses
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/bills/{bill_id}", response_model=StandardResponse[BillAnalysisResponse])
async def get_bill_mobile(
    bill_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific bill with analysis (mobile app format)"""
    try:
        bill = db.query(Bill).filter(
            Bill.id == int(bill_id),
            Bill.patient_id == current_user.id
        ).first()
        
        if not bill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bill not found"
            )
        
        return StandardResponse(
            success=True,
            data=map_bill_to_analysis(bill)
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid bill ID"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/bills/{bill_id}/analysis-status", response_model=StandardResponse[AnalysisStatusResponse])
async def get_analysis_status(
    bill_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get analysis status for a bill"""
    try:
        bill = db.query(Bill).filter(
            Bill.id == int(bill_id),
            Bill.patient_id == current_user.id
        ).first()
        
        if not bill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bill not found"
            )
        
        status_map = {
            BillStatus.PENDING: "pending",
            BillStatus.PROCESSING: "processing",
            BillStatus.COMPLETED: "completed",
            BillStatus.FAILED: "failed"
        }
        
        # Calculate progress
        if bill.status == BillStatus.COMPLETED:
            progress = 100.0
            current_step = "Analysis complete"
        elif bill.status == BillStatus.PROCESSING:
            progress = 50.0
            current_step = "Analyzing billing codes..."
        else:
            progress = 0.0
            current_step = "Waiting to start..."
        
        return StandardResponse(
            success=True,
            data=AnalysisStatusResponse(
                billId=str(bill.id),
                status=status_map.get(bill.status, "pending"),
                progress=progress,
                currentStep=current_step,
                estimatedTimeRemaining=15 if bill.status == BillStatus.PROCESSING else None
            )
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid bill ID"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/bills/{bill_id}/flagged-items/{issue_id}", response_model=StandardResponse[FlaggedItemResponse])
async def get_flagged_item(
    bill_id: str,
    issue_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific flagged item (for explanation screen)"""
    try:
        bill = db.query(Bill).filter(
            Bill.id == int(bill_id),
            Bill.patient_id == current_user.id
        ).first()
        
        if not bill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bill not found"
            )
        
        finding = db.query(Finding).filter(
            Finding.id == int(issue_id),
            Finding.bill_id == bill.id
        ).first()
        
        if not finding:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Flagged item not found"
            )
        
        line_item = next((li for li in bill.line_items if li.id == finding.line_item_id), None)
        
        return StandardResponse(
            success=True,
            data=map_finding_to_flagged_item(finding, line_item)
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/stats", response_model=StandardResponse[UserStatsResponse])
async def get_user_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user statistics for home screen"""
    try:
        # Get all bills for the user
        bills = db.query(Bill).filter(Bill.patient_id == current_user.id).all()
        
        # Calculate monthly savings (current month)
        now = datetime.now()
        current_month_start = datetime(now.year, now.month, 1)
        
        current_month_bills = [
            b for b in bills 
            if b.uploaded_at and b.uploaded_at >= current_month_start
        ]
        
        monthly_savings = sum(
            sum(f.estimated_savings for f in bill.findings)
            for bill in current_month_bills
        )
        
        # Calculate last month savings for trend
        if now.month == 1:
            last_month_start = datetime(now.year - 1, 12, 1)
            last_month_end = datetime(now.year, 1, 1)
        else:
            last_month_start = datetime(now.year, now.month - 1, 1)
            last_month_end = datetime(now.year, now.month, 1)
        
        last_month_bills = [
            b for b in bills
            if b.uploaded_at and last_month_start <= b.uploaded_at < last_month_end
        ]
        
        last_month_savings = sum(
            sum(f.estimated_savings for f in bill.findings)
            for bill in last_month_bills
        )
        
        # Calculate trend percentage
        if last_month_savings > 0:
            monthly_trend = ((monthly_savings - last_month_savings) / last_month_savings) * 100
        else:
            monthly_trend = 100.0 if monthly_savings > 0 else 0.0
        
        # Calculate year-to-date savings
        year_start = datetime(now.year, 1, 1)
        year_bills = [
            b for b in bills
            if b.uploaded_at and b.uploaded_at >= year_start
        ]
        
        total_saved_this_year = sum(
            sum(f.estimated_savings for f in bill.findings)
            for bill in year_bills
        )
        
        # Count total issues found
        total_issues = sum(len(bill.findings) for bill in bills)
        
        return StandardResponse(
            success=True,
            data=UserStatsResponse(
                monthlySavings=round(monthly_savings, 2),
                monthlyTrend=round(monthly_trend, 1),
                totalSavedThisYear=round(total_saved_this_year, 2),
                billsAnalyzed=len(bills),
                issuesFound=total_issues
            )
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/bills/{bill_id}/flagged-items/{issue_id}/actions", response_model=StandardResponse[List[ActionItemResponse]])
async def get_recommended_actions(
    bill_id: str,
    issue_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get recommended actions for a flagged item"""
    try:
        bill = db.query(Bill).filter(
            Bill.id == int(bill_id),
            Bill.patient_id == current_user.id
        ).first()
        
        if not bill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bill not found"
            )
        
        finding = db.query(Finding).filter(
            Finding.id == int(issue_id),
            Finding.bill_id == bill.id
        ).first()
        
        if not finding:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Flagged item not found"
            )
        
        # Generate action items based on finding type and severity
        actions = []
        
        # Primary action: Generate appeal email
        actions.append(ActionItemResponse(
            id=f"action-{issue_id}-1",
            title="Generate Appeal Email",
            icon="mail",
            description="AI-drafted email to billing department",
            badge="Most effective",
            type="email"
        ))
        
        # Secondary actions based on finding type
        if finding.type in [FindingType.DUPLICATE_CHARGE, FindingType.OVERCHARGE]:
            actions.append(ActionItemResponse(
                id=f"action-{issue_id}-2",
                title="Request Itemized Bill",
                icon="file-text",
                description="Get detailed breakdown of charges",
                type="request"
            ))
        
        actions.append(ActionItemResponse(
            id=f"action-{issue_id}-3",
            title="Call Billing Department",
            icon="phone",
            description="Speak with a representative",
            phoneNumber="(555) 123-4567",  # This should come from bill/provider data
            type="call"
        ))
        
        actions.append(ActionItemResponse(
            id=f"action-{issue_id}-4",
            title="Save for Later",
            icon="bookmark",
            description="Add to your saved items",
            type="save"
        ))
        
        return StandardResponse(
            success=True,
            data=actions
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
