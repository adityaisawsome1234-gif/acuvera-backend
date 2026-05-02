# Acuvera Enterprise

Enterprise audit platform with a FastAPI backend and Next.js web app.

## 🚀 Quick Production Deployment

**Ready to deploy?** See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for the fastest path to production.

**Need a detailed checklist?** See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)

**Full deployment guide?** See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Monorepo Layout

- `apps/api` – FastAPI service + RQ worker
- `apps/web` – Next.js App Router web app
- `packages/shared` – shared TypeScript types

## Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Start infrastructure:
```bash
docker compose up
```

4. Run the API:
```bash
uvicorn --app-dir apps/api app.main:app --reload
```

5. Run the worker:
```bash
rq worker --url redis://localhost:6379/0
```

6. Run the web app:
```bash
npm run dev --workspace apps/web
```

## macOS Wrapper (Optional)

If you want an installed desktop app on Mac, use the Tauri wrapper:
```bash
cd apps/desktop
npm install
npm run tauri dev
```

## Seed Data

Create a default org + admin user:
```bash
python apps/api/scripts/seed.py
```

Defaults can be changed in `.env`.

## API Notes

- Auth endpoints: `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
- Org-scoped endpoints: `/api/v1/orgs/{org_id}/documents`, `/findings`, `/cases`, `/reports`, `/audit-log`
- Document processing: `POST /api/v1/orgs/{org_id}/documents/{document_id}/process`
- Document upload: `POST /api/v1/orgs/{org_id}/documents/upload` (multipart)
- Auth: `POST /api/v1/auth/register`, `POST /api/v1/auth/verify`, `POST /api/v1/auth/password-reset/*`

## Tests

```bash
pytest apps/api/tests
```
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
# IMPORTANT: Set OPENAI_API_KEY for AI analysis features
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

### AI Analysis
- `POST /api/v1/ai/analyze` - Analyze bill text using OpenAI

## OpenAI Integration

The AI analysis endpoint uses OpenAI's ChatGPT API to analyze medical bill text.

### Setup

1. Get an OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

2. Add to your `.env` file:
```bash
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini
```

3. The endpoint will be available at `POST /api/v1/ai/analyze`

### Usage

**Request:**
```json
{
  "text": "Your medical bill text here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": {
      "summary": "Brief summary of the bill",
      "issues": [
        {
          "title": "Issue title",
          "description": "Detailed description",
          "severity": "low|medium|high"
        }
      ],
      "estimated_savings_usd": 150.50,
      "confidence": 0.85
    }
  }
}
```

### Testing in Swagger UI

1. Start the server: `uvicorn app.main:app --reload`
2. Navigate to [http://localhost:8000/docs](http://localhost:8000/docs)
3. Find the `POST /api/v1/ai/analyze` endpoint under the "ai" tag
4. Click "Try it out"
5. Enter your bill text in the request body
6. Click "Execute"

**Note:** If `OPENAI_API_KEY` is not set, the endpoint will return a 400 error with a clear message.

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

