import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import settings
from app.core.database import Base, engine
import sentry_sdk

Base.metadata.create_all(bind=engine)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

if settings.SENTRY_DSN:
    sentry_sdk.init(dsn=settings.SENTRY_DSN, traces_sample_rate=0.1)

app = FastAPI(title="Acuvera Enterprise API", version="1.0.0")

# CORS configuration: production-safe
# In production, only allow specific domains
if settings.ENVIRONMENT == "production":
    # Production: Only allow acuvera.co domains
    allowed_origins = [
        "https://acuvera.co",
        "https://www.acuvera.co",
    ]
    # If CORS_ORIGINS is set, use it (for flexibility), but validate it's not "*"
    if settings.CORS_ORIGINS != "*":
        # Merge with configured origins, ensuring no wildcards
        configured = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip() and origin.strip() != "*"]
        allowed_origins = list(set(allowed_origins + configured))
    cors_origins = allowed_origins
else:
    # Development: Allow configured origins or "*"
    if settings.CORS_ORIGINS == "*":
        cors_origins = ["*"]
    else:
        cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"success": True, "data": {"status": "healthy"}}
