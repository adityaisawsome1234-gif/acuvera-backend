# Acuvera Backend - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd acuvera-backend
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database URL
# Set DEMO_MODE=true for fast demo results
```

### 3. Set Up Database
The app will create tables automatically on first run. For production, use Alembic:
```bash
alembic init migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 4. Run the Server
```bash
python run.py
# Or: uvicorn app.main:app --reload
```

Server will start at `http://localhost:8000`

### 5. Seed Demo Data
```bash
# First, create an admin user manually or via register endpoint
# Then call:
curl -X POST http://localhost:8000/api/v1/admin/seed-demo \
  -H "Authorization: Bearer <admin_token>"
```

## 📝 Demo Users (After Seeding)

- **Patient**: `patient@demo.com` / `demo123`
- **Provider**: `provider@demo.com` / `demo123`
- **Admin**: `admin@demo.com` / `demo123`

## 🧪 Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "PATIENT"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `access_token` from the response.

### 3. Upload a Bill
```bash
curl -X POST http://localhost:8000/api/v1/bills/upload \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@/path/to/bill.pdf"
```

### 4. Get Bill Details
```bash
curl http://localhost:8000/api/v1/bills/1 \
  -H "Authorization: Bearer <access_token>"
```

Wait 3-5 seconds after upload for analysis to complete (in DEMO_MODE).

### 5. Get Provider Dashboard
```bash
curl http://localhost:8000/api/v1/provider/orgs/dashboard \
  -H "Authorization: Bearer <provider_token>"
```

## 📚 API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔧 Configuration

Key environment variables in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key (change in production!)
- `DEMO_MODE` - Set to `true` for fast, deterministic results
- `MAX_FILE_SIZE_MB` - Max upload size (default: 10MB)
- `UPLOAD_DIR` - Directory for file uploads (default: `./uploads`)

## 🎯 Demo Flow

1. **Patient uploads bill** → Status: PENDING
2. **Background job processes** → Status: PROCESSING (3-5 seconds in DEMO_MODE)
3. **Analysis completes** → Status: COMPLETED
4. **Patient views results** → See line items and findings
5. **Provider views dashboard** → See aggregated stats

## ⚠️ Important Notes

- DEMO_MODE ensures fast, repeatable results for demos
- All responses follow standardized format (see ENDPOINTS.md)
- RBAC ensures users only see their own data
- File uploads are validated (PDF, JPG, PNG only)
- Background jobs run in threads (upgrade to Celery for production)

## 🐛 Troubleshooting

**Database connection errors:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env

**Import errors:**
- Ensure you're in the project root
- Check Python path includes the project directory

**File upload errors:**
- Check file size (MAX_FILE_SIZE_MB)
- Ensure file type is PDF, JPG, or PNG
- Check uploads directory permissions

