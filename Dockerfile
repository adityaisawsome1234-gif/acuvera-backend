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

# Use API app directory as working dir
WORKDIR /app/apps/api/app

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port (Render will set PORT env var)
EXPOSE 8000

# Health check (use PORT env var)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import os, requests; port=os.getenv('PORT', '8000'); requests.get(f'http://localhost:{port}/health')" || exit 1

# Run the application
# Default CMD for Docker runtime
CMD ["sh", "-c", "uvicorn main:app --app-dir /app/apps/api/app --host 0.0.0.0 --port ${PORT:-10000}"]
