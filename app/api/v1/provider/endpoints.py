from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.middleware.auth import get_current_active_user, require_provider_or_admin
from app.models.user import User
from app.schemas.provider import ProviderDashboardResponse
from app.schemas.common import StandardResponse
from app.services.provider_service import ProviderService

router = APIRouter(prefix="/orgs", tags=["provider"])


@router.get("/dashboard", response_model=StandardResponse[ProviderDashboardResponse])
async def get_provider_dashboard(
    current_user: User = Depends(require_provider_or_admin),
    db: Session = Depends(get_db)
):
    """Get provider dashboard with stats and analytics"""
    try:
        service = ProviderService(db)
        dashboard_data = service.get_dashboard(current_user)
        
        return StandardResponse(
            success=True,
            data=dashboard_data
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/stats", response_model=StandardResponse[dict])
async def get_provider_stats(
    current_user: User = Depends(require_provider_or_admin),
    db: Session = Depends(get_db)
):
    """Get provider organization statistics"""
    try:
        service = ProviderService(db)
        dashboard_data = service.get_dashboard(current_user)
        
        return StandardResponse(
            success=True,
            data=dashboard_data["stats"]
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

