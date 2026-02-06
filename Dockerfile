FROM python:3.11

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONPATH=/app/apps/api

# Install system dependencies
# Using full Python image which may already have gcc, only need postgresql-client
RUN apt-get update && \
    apt-get install -y \
    postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install --no-cache-dir email-validator==2.1.0 && \
    python -c "import email_validator; print(f'email-validator installed: {email_validator.__version__}')"

# Copy application code
# Copy everything - PYTHONPATH=/app/apps/api ensures 'app' resolves to apps/api/app/
COPY . .

# Use API directory as working dir (so 'app' package is importable)
WORKDIR /app/apps/api

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port (Render will set PORT env var, default 10000)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import os, urllib.request; port=os.getenv('PORT', '10000'); urllib.request.urlopen(f'http://localhost:{port}/health')" || exit 1

# Run the application directly with uvicorn (no reload in production)
# Render sets PORT env var; default 10000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
