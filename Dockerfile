FROM python:3.11

# Set working directory (repo root inside container)
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONPATH=/app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install --no-cache-dir email-validator==2.1.0 && \
    python -c "import email_validator; print(f'email-validator installed: {email_validator.__version__}')"

# Copy application code
COPY . .

# Verify the app module is importable (fail fast during build if not)
RUN python -c "from app.main import app; print('SUCCESS: app.main imported correctly')"

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port (Render sets PORT=10000 by default)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import os, urllib.request; port=os.getenv('PORT', '10000'); urllib.request.urlopen(f'http://localhost:{port}/health')" || exit 1

# Run the application
# PYTHONPATH=/app ensures 'import app' finds /app/app/
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
