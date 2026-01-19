#!/usr/bin/env python3
"""Run the Acuvera backend server"""
import uvicorn
import os
from app.core.config import settings

if __name__ == "__main__":
    # Production: use workers, Development: use reload
    if settings.ENVIRONMENT == "production":
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=int(os.getenv("PORT", 8000)),
            workers=4,
            log_level="info"
        )
    else:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=int(os.getenv("PORT", 8000)),
            reload=True,
            log_level="debug"
        )

