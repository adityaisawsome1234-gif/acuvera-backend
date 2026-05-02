from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/acuvera_db"

    # Redis / RQ
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # File storage
    UPLOAD_DIR: str = "./uploads"
    STORAGE_TYPE: str = "local"  # local or s3
    MAX_FILE_SIZE_MB: int = 25

    # AWS S3 (optional)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: Optional[str] = None
    S3_PREFIX: str = "uploads"

    # App
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "*"  # Comma-separated list, or "*" for all
    FRONTEND_URL: str = "http://localhost:3000"

    # Email (optional)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None

    # Security tokens
    PASSWORD_RESET_TOKEN_MINUTES: int = 30

    # AI providers
    AI_PROVIDER: str = "bedrock"  # bedrock or openai
    BEDROCK_REGION: str = "us-east-1"
    BEDROCK_MODEL_ID: Optional[str] = None
    TEXTRACT_ENABLED: bool = False
    AI_ALLOW_STUB: bool = False
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Analytics / monitoring
    POSTHOG_API_KEY: Optional[str] = None
    POSTHOG_HOST: str = "https://app.posthog.com"
    SENTRY_DSN: Optional[str] = None

    # Seed defaults
    DEFAULT_ORG_NAME: str = "Default Org"
    DEFAULT_ADMIN_EMAIL: str = "admin@acuvera.dev"
    DEFAULT_ADMIN_PASSWORD: str = "ChangeMe123!"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
