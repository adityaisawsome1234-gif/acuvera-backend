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
import asyncio
import httpx

app = FastAPI(
    title="Acuvera API",
    description="AI-powered medical billing intelligence platform",
    version="1.0.0"
)


async def _keep_alive():
    """Self-ping every 10 minutes to prevent Render free-tier cold starts."""
    port = os.environ.get("PORT", "8000")
    url = f"http://localhost:{port}/health"
    async with httpx.AsyncClient() as client:
        while True:
            await asyncio.sleep(600)
            try:
                await client.get(url, timeout=5)
            except Exception:
                pass

@app.on_event("startup")
async def on_startup():
    """Create database tables, uploads directory, and start keep-alive task.

    DB schema setup is non-fatal: if the database is unreachable (e.g. Render
    DNS can't resolve the internal hostname because the DB is in a different
    region or has been deleted/expired), we log loudly and let the API boot
    so /health stays green. DB-dependent endpoints will surface the failure.
    """
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(
            f"[Startup] DB schema init FAILED — API will start but DB-dependent "
            f"endpoints will fail. Error: {e!r}",
            flush=True,
        )
        print(
            "[Startup] Check on Render: (1) acuvera-db exists, (2) it's in the "
            "same region as acuvera-api, (3) DATABASE_URL env var is linked from "
            "the database service.",
            flush=True,
        )
    else:
        try:
            from app.core.migrate import migrate_findings_review_columns
            migrate_findings_review_columns()
        except Exception as e:
            print(f"[Startup] Migration skipped: {e}", flush=True)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    if settings.ENVIRONMENT == "production":
        asyncio.create_task(_keep_alive())

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


@app.get("/api/v1/pipeline-status")
async def pipeline_status():
    """Report which analysis pipeline stages are active (for debugging)."""
    from app.core.config import settings
    stage2_ready = settings.CODE_VALIDATION_ENABLED
    stage3_ready = bool(
        settings.MEDICAL_PIPELINE_ENABLED
        and settings.GCP_PROJECT_ID
        and settings.MEDGEMMA_ENDPOINT_ID
    )
    return {
        "success": True,
        "data": {
            "stage1_claude": "always",
            "stage2_biobert_pyctakes": "enabled" if stage2_ready else "disabled",
            "stage3_medgemma": "enabled" if stage3_ready else "disabled",
            "consensus": "enabled" if (stage2_ready or stage3_ready) else "disabled",
            "flags": {
                "CODE_VALIDATION_ENABLED": settings.CODE_VALIDATION_ENABLED,
                "MEDICAL_PIPELINE_ENABLED": settings.MEDICAL_PIPELINE_ENABLED,
                "GCP_PROJECT_ID_set": bool(settings.GCP_PROJECT_ID),
                "MEDGEMMA_ENDPOINT_ID_set": bool(settings.MEDGEMMA_ENDPOINT_ID),
            },
        },
    }

