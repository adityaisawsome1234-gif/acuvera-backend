from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.middleware.auth import get_current_active_user, require_patient_or_admin
from app.models.user import User
from app.schemas.bill import BillResponse, BillListResponse
from app.schemas.common import StandardResponse
from app.services.bill_service import BillService

router = APIRouter()


@router.post("/upload", response_model=StandardResponse[BillResponse])
async def upload_bill(
    file: UploadFile = File(...),
    current_user: User = Depends(require_patient_or_admin),
    db: Session = Depends(get_db)
):
    """Upload a new medical bill"""
    try:
        service = BillService(db)
        result = await service.upload_bill(
            file=file,
            patient_id=current_user.id,
            organization_id=current_user.organization_id
        )
        
        bill_data = BillResponse.model_validate(result["bill"]).model_dump()
        bill_data["line_items"] = []
        bill_data["findings"] = []
        return StandardResponse(
            success=True,
            data=bill_data
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/", response_model=StandardResponse[List[BillListResponse]])
async def list_bills(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List bills (filtered by user role)"""
    try:
        service = BillService(db)
        results = service.list_bills(current_user)
        
        bills_data = []
        for result in results:
            bill = result["bill"]
            findings_count = len(bill.findings)
            estimated_savings = sum(f.estimated_savings for f in bill.findings)
            
            bills_data.append({
                "id": bill.id,
                "patient_id": bill.patient_id,
                "organization_id": bill.organization_id,
                "file_name": bill.file_name,
                "file_type": bill.file_type,
                "total_amount": bill.total_amount,
                "status": bill.status.value,
                "uploaded_at": bill.uploaded_at,
                "analyzed_at": bill.analyzed_at,
                "findings_count": findings_count,
                "estimated_savings": round(estimated_savings, 2)
            })
        
        return StandardResponse(
            success=True,
            data=bills_data
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{bill_id}", response_model=StandardResponse[BillResponse])
async def get_bill(
    bill_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get bill details with findings and line items"""
    try:
        service = BillService(db)
        result = service.get_bill(bill_id, current_user)
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bill not found"
            )
        
        bill = result["bill"]
        
        # Build response with relationships
        bill_data = BillResponse.model_validate(bill).model_dump()
        bill_data["line_items"] = [
            {
                "id": item.id,
                "bill_id": item.bill_id,
                "description": item.description,
                "code": item.code,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "total_price": item.total_price,
                "created_at": item.created_at.isoformat()
            }
            for item in bill.line_items
        ]
        bill_data["findings"] = [
            {
                "id": f.id,
                "bill_id": f.bill_id,
                "type": f.type.value,
                "severity": f.severity.value,
                "confidence": f.confidence,
                "estimated_savings": f.estimated_savings,
                "explanation": f.explanation,
                "recommended_action": f.recommended_action,
                "line_item_id": f.line_item_id,
                "created_at": f.created_at.isoformat()
            }
            for f in bill.findings
        ]
        bill_data["status"] = bill.status.value
        
        return StandardResponse(
            success=True,
            data=bill_data
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

