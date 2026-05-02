#!/bin/bash
set -e

# Acuvera Enterprise - Production Deployment Script
# This script prepares and deploys the application for production

echo "=========================================="
echo "Acuvera Enterprise - Production Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${RED}IMPORTANT: Edit .env and set all required values before continuing!${NC}"
    echo ""
    read -p "Press Enter after you've updated .env with production values..."
fi

# Check for required environment variables
echo "Checking required environment variables..."
source .env 2>/dev/null || true

REQUIRED_VARS=(
    "SECRET_KEY"
    "NEXTAUTH_SECRET"
    "DATABASE_URL"
    "REDIS_URL"
    "FRONTEND_URL"
    "NEXTAUTH_URL"
    "NEXT_PUBLIC_API_BASE_URL"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "CHANGE_ME\|^${var}=$" .env 2>/dev/null || ! grep -q "^${var}=" .env 2>/dev/null; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}Error: Missing or not configured environment variables:${NC}"
    printf '%s\n' "${MISSING_VARS[@]}"
    echo ""
    echo "Run: python scripts/generate-secrets.py to generate secrets"
    echo "Then update .env with all required values"
    exit 1
fi

# Check if DEBUG is set to false in production
if grep -q "^ENVIRONMENT=production" .env && grep -q "^DEBUG=true" .env; then
    echo -e "${YELLOW}Warning: DEBUG=true in production environment${NC}"
    echo "Set DEBUG=false in .env for production"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ Environment variables configured${NC}"
echo ""

# Generate secrets if needed
if command -v python3 &> /dev/null; then
    echo "Checking if secrets need to be generated..."
    if grep -q "CHANGE_ME_GENERATE_SECURE_SECRET" .env; then
        echo "Generating secure secrets..."
        python3 scripts/generate-secrets.py
        echo ""
        echo -e "${YELLOW}Copy the generated secrets above to your .env file${NC}"
        read -p "Press Enter after updating .env..."
    fi
fi

# Build Docker images
echo "Building Docker images..."
docker-compose build

# Run database migrations
echo ""
echo "Running database migrations..."
docker-compose run --rm api alembic upgrade head || {
    echo -e "${YELLOW}Note: If migrations fail, ensure database is running${NC}"
    echo "Start services first: docker-compose up -d db redis"
}

# Start services
echo ""
echo "Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo ""
echo "Waiting for services to be healthy..."
sleep 5

# Check service status
echo ""
echo "Service status:"
docker-compose ps

echo ""
echo -e "${GREEN}=========================================="
echo "Deployment complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Check logs: docker-compose logs -f"
echo "2. Test API: curl http://localhost:8000/health"
echo "3. Set up reverse proxy (Nginx/Caddy) for SSL"
echo "4. Configure DNS to point to your server"
echo ""
echo "For frontend deployment:"
echo "1. cd apps/web"
echo "2. npm install"
echo "3. Set environment variables (see .env.example)"
echo "4. npm run build"
echo "5. Deploy to Vercel/Netlify or serve with: npm start"
