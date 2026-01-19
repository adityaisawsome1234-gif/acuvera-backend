from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import UserLogin, UserRegister, Token
from app.schemas.common import StandardResponse, ErrorResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.api.middleware.auth import get_current_active_user
from app.models.user import User

router = APIRouter()


@router.post("/register", response_model=StandardResponse[dict])
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        service = AuthService(db)
        result = service.register_user(user_data)
        return StandardResponse(
            success=True,
            data={
                "access_token": result["access_token"],
                "token_type": result["token_type"],
                "user": UserResponse.model_validate(result["user"]).model_dump()
            }
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=StandardResponse[dict])
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token"""
    service = AuthService(db)
    result = service.authenticate_user(credentials.email, credentials.password)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    return StandardResponse(
        success=True,
        data={
            "access_token": result["access_token"],
            "token_type": result["token_type"],
            "user": UserResponse.model_validate(result["user"]).model_dump()
        }
    )


@router.get("/me", response_model=StandardResponse[UserResponse])
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user info"""
    return StandardResponse(
        success=True,
        data=UserResponse.model_validate(current_user).model_dump()
    )

