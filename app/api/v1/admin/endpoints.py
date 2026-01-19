from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.middleware.auth import require_role
from app.models.user import UserRole
from app.schemas.common import StandardResponse
from app.services.seed_service import SeedService

router = APIRouter(tags=["admin"])


@router.post("/seed-demo", response_model=StandardResponse[dict])
async def seed_demo_data(
    current_user = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Seed demo data (ADMIN only)"""
    try:
        service = SeedService(db)
        result = service.seed_demo_data()
        
        return StandardResponse(
            success=True,
            data={
                "message": "Demo data seeded successfully",
                "users_created": result["users_created"],
                "bills_created": result["bills_created"]
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

