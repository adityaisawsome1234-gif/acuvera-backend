# Acuvera Backend

AI-powered medical billing intelligence platform backend API.

## Features

- REST API with FastAPI
- JWT Authentication
- Role-based access control (PATIENT, PROVIDER, ADMIN)
- Medical bill upload and analysis
- Background job processing
- Provider dashboard with analytics
- Demo mode for fast, deterministic results

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database and configuration
```

3. Initialize database:
```bash
# The app will create tables automatically on startup
# Or use Alembic for migrations:
alembic init migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

4. Run the server:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get token
- `GET /api/v1/auth/me` - Get current user info

### Bills
- `POST /api/v1/bills/upload` - Upload medical bill
- `GET /api/v1/bills/` - List bills (filtered by role)
- `GET /api/v1/bills/{bill_id}` - Get bill details with findings

### Provider
- `GET /api/v1/provider/orgs/dashboard` - Provider dashboard
- `GET /api/v1/provider/orgs/stats` - Provider statistics

### Admin
- `POST /api/v1/admin/seed-demo` - Seed demo data (ADMIN only)

## Demo Mode

Set `DEMO_MODE=true` in `.env` for:
- Fast analysis (3-5 seconds)
- Deterministic results per bill_id
- 3-8 line items per bill
- 2-5 findings per bill

## Demo Users

After seeding:
- Patient: `patient@demo.com` / `demo123`
- Provider: `provider@demo.com` / `demo123`
- Admin: `admin@demo.com` / `demo123`

## Response Format

All endpoints return standardized responses:

Success:
```json
{
  "success": true,
  "data": {...},
  "meta": {...}
}
```

Error:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Architecture

- **Models**: SQLAlchemy database models
- **Schemas**: Pydantic DTOs for request/response validation
- **Repositories**: Data access layer
- **Services**: Business logic
- **Routers**: API endpoints
- **Middleware**: Authentication and authorization

