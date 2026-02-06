from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.auth import auth_router
from app.api.v1.bills import bills_router
from app.api.v1.provider import provider_router
from app.api.v1.admin import admin_router
from app.api.v1.ai import ai_router
from app.api.v1.mobile import router as mobile_router
from app.schemas.common import ErrorResponse
import os

app = FastAPI(
    title="Acuvera API",
    description="AI-powered medical billing intelligence platform",
    version="1.0.0"
)


@app.on_event("startup")
def on_startup():
    """Create database tables and uploads directory on server start (not at import time)."""
    Base.metadata.create_all(bind=engine)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# CORS middleware
cors_origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/files", StaticFiles(directory=settings.UPLOAD_DIR), name="files")

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(bills_router, prefix="/api/v1/bills", tags=["bills"])
app.include_router(provider_router, prefix="/api/v1/provider", tags=["provider"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(mobile_router, prefix="/api/v1/mobile", tags=["mobile"])


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Standardize error responses"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            success=False,
            error={
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail
            }
        ).dict()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            success=False,
            error={
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred" if not settings.DEBUG else str(exc)
            }
        ).dict()
    )


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "success": True,
        "data": {
            "message": "Acuvera API",
            "version": "1.0.0",
            "demo_mode": settings.DEMO_MODE
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "success": True,
        "data": {
            "status": "healthy"
        }
    }

