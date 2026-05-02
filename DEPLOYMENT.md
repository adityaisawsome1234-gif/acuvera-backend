# Deployment Guide

This guide covers multiple deployment options for the Acuvera Enterprise platform.

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database (or use Docker Compose)
- Redis (or use Docker Compose)
- Domain name (for production)
- SSL certificate (Let's Encrypt recommended)

## Quick Start: Automated Production Deployment

The fastest way to deploy to production:

```bash
# 1. Generate secure secrets
python3 scripts/generate-secrets.py

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your production values (use generated secrets)

# 3. Run automated deployment script
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

The script will:
- ✅ Validate all required environment variables
- ✅ Build Docker images
- ✅ Run database migrations
- ✅ Start all services
- ✅ Verify health checks

## Production Deployment Checklist

Before deploying, ensure you've completed all items:

### 🔐 Security Configuration

- [ ] Generated secure `SECRET_KEY` (run `python3 scripts/generate-secrets.py`)
- [ ] Generated secure `NEXTAUTH_SECRET` (run `python3 scripts/generate-secrets.py`)
- [ ] Set strong `POSTGRES_PASSWORD` in `.env`
- [ ] Set `DEBUG=false` in `.env`
- [ ] Set `ENVIRONMENT=production` in `.env`
- [ ] Configured `CORS_ORIGINS` with your production domain(s)
- [ ] Updated `FRONTEND_URL` to production URL
- [ ] Updated `NEXTAUTH_URL` to production URL
- [ ] Updated `NEXT_PUBLIC_API_BASE_URL` to production API URL

### 📧 Email Configuration (Required)

- [ ] Configured SMTP settings for email verification
- [ ] Set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`
- [ ] Set `SMTP_FROM_EMAIL` to your domain

### 🤖 AI Provider Configuration

- [ ] Set `OPENAI_API_KEY` (if using OpenAI)
- [ ] Or configured AWS Bedrock credentials (if using Bedrock)
- [ ] Set `AI_ALLOW_STUB=false` for production

### 📊 Monitoring & Analytics (Optional but Recommended)

- [ ] Configured PostHog (`NEXT_PUBLIC_POSTHOG_KEY`)
- [ ] Configured Sentry (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`)

### 🗄️ Database & Storage

- [ ] Database migrations ready (Alembic)
- [ ] Storage configured (local or S3)
- [ ] If using S3: AWS credentials configured

### 🌐 Infrastructure

- [ ] Domain DNS configured
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] Reverse proxy configured (Nginx/Caddy)
- [ ] Firewall rules configured
- [ ] Backup strategy in place

## Option 1: Docker Compose (Recommended for VPS/Self-Hosting)

This is the easiest way to deploy everything together.

### Steps

1. **Create a `.env` file** in the project root:

```bash
# Database
POSTGRES_USER=acuvera_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=acuvera_db
DATABASE_URL=postgresql://acuvera_user:your_secure_password_here@db:5432/acuvera_db

# JWT
SECRET_KEY=your-very-secure-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App Settings
DEBUG=False
ENVIRONMENT=production
DEMO_MODE=False

# File Upload
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=./uploads
STORAGE_TYPE=local  # or s3 for AWS S3

# Redis
REDIS_URL=redis://redis:6379/0

# AWS S3 (if using S3 storage)
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# AWS_REGION=us-east-1
# S3_BUCKET_NAME=your_bucket_name
```

2. **Build and start services**:

```bash
docker-compose up -d
```

3. **Run database migrations** (if using Alembic):

```bash
docker-compose exec web alembic upgrade head
```

4. **Check logs**:

```bash
docker-compose logs -f web
```

5. **Access your API**:

- API: http://localhost:8000
- Health check: http://localhost:8000/health
- API docs: http://localhost:8000/docs

### Production Considerations

- Change `allow_origins=["*"]` in `app/main.py` to specific domains
- Use a reverse proxy (nginx) for SSL/TLS
- Set up proper backup strategy for PostgreSQL
- Use environment-specific `.env` files
- Consider using Docker secrets for sensitive data

## Option 2: Cloud Platform Deployment

### Railway

1. **Install Railway CLI**:
```bash
npm i -g @railway/cli
railway login
```

2. **Initialize and deploy**:
```bash
railway init
railway up
```

3. **Add services** (PostgreSQL, Redis):
```bash
railway add postgresql
railway add redis
```

4. **Set environment variables** in Railway dashboard

### Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Build settings**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Add PostgreSQL and Redis** services
5. **Set environment variables**

### Fly.io

1. **Install Fly CLI**:
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Create `fly.toml`** (see below)
3. **Deploy**:
```bash
fly launch
fly deploy
```

### AWS (EC2/ECS/Elastic Beanstalk)

#### EC2 with Docker

1. **Launch EC2 instance** (Ubuntu 22.04)
2. **Install Docker**:
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
```

3. **Clone and deploy**:
```bash
git clone <your-repo>
cd acuvera-backend
# Set up .env file
docker-compose up -d
```

4. **Set up nginx reverse proxy** (see nginx config below)

#### Elastic Beanstalk

1. **Install EB CLI**:
```bash
pip install awsebcli
```

2. **Initialize**:
```bash
eb init -p python-3.11 acuvera-backend
eb create acuvera-env
```

3. **Configure environment variables** in EB console

### Google Cloud Platform (Cloud Run)

1. **Build and push Docker image**:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/acuvera-backend
```

2. **Deploy to Cloud Run**:
```bash
gcloud run deploy acuvera-backend \
  --image gcr.io/PROJECT_ID/acuvera-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

3. **Set up Cloud SQL** (PostgreSQL) and Memorystore (Redis)

## Option 3: Traditional VPS Deployment

### Setup on Ubuntu/Debian

1. **Install dependencies**:
```bash
sudo apt update
sudo apt install python3.11 python3-pip postgresql redis-server nginx -y
```

2. **Set up PostgreSQL**:
```bash
sudo -u postgres psql
CREATE DATABASE acuvera_db;
CREATE USER acuvera_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE acuvera_db TO acuvera_user;
\q
```

3. **Clone and set up application**:
```bash
cd /opt
sudo git clone <your-repo> acuvera-backend
cd acuvera-backend
sudo python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

4. **Create systemd service** (`/etc/systemd/system/acuvera-backend.service`):
```ini
[Unit]
Description=Acuvera Backend API
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/acuvera-backend
Environment="PATH=/opt/acuvera-backend/venv/bin"
ExecStart=/opt/acuvera-backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

5. **Start service**:
```bash
sudo systemctl daemon-reload
sudo systemctl enable acuvera-backend
sudo systemctl start acuvera-backend
```

6. **Set up Nginx reverse proxy** (see config below)

## Nginx Configuration

A complete Nginx configuration example is provided in `nginx.conf.example`.

**Quick Setup:**

1. **Copy the example config:**
   ```bash
   sudo cp nginx.conf.example /etc/nginx/sites-available/acuvera
   sudo nano /etc/nginx/sites-available/acuvera
   # Update "your-domain.com" with your actual domain
   ```

2. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/acuvera /etc/nginx/sites-enabled/
   sudo nginx -t  # Test configuration
   sudo systemctl reload nginx
   ```

3. **Set up SSL (see below)**

## SSL/TLS with Let's Encrypt

**Automated Setup:**

```bash
chmod +x scripts/setup-ssl.sh
sudo ./scripts/setup-ssl.sh
```

**Manual Setup:**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.your-domain.com

# Set up auto-renewal (usually automatic)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

The Nginx config example includes:
- ✅ HTTP to HTTPS redirect
- ✅ SSL security headers
- ✅ File upload size limits
- ✅ Proper proxy headers
- ✅ Health check endpoint

## Environment Variables Checklist

Before deploying, ensure these are set:

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SECRET_KEY` - Strong random secret for JWT
- [ ] `REDIS_URL` - Redis connection string
- [ ] `DEBUG=False` - Disable debug mode
- [ ] `ENVIRONMENT=production`
- [ ] `DEMO_MODE=False` (unless you want demo mode)
- [ ] CORS origins updated in `app/main.py`
- [ ] AWS credentials (if using S3 storage)

## Database Migrations

If using Alembic:

```bash
# Local
alembic upgrade head

# Docker
docker-compose exec web alembic upgrade head

# Production (SSH)
ssh user@server
cd /opt/acuvera-backend
source venv/bin/activate
alembic upgrade head
```

## Monitoring & Health Checks

- Health endpoint: `GET /health`
- API docs: `GET /docs`
- Monitor logs regularly
- Set up uptime monitoring (UptimeRobot, Pingdom, etc.)

## Backup Strategy

1. **Database backups**:
```bash
# Daily backup script
pg_dump -U acuvera_user acuvera_db > backup_$(date +%Y%m%d).sql
```

2. **File uploads**: Backup `uploads/` directory or sync with S3

3. **Automate with cron**:
```bash
0 2 * * * /path/to/backup-script.sh
```

## Security Checklist

- [ ] Change default passwords
- [ ] Use strong `SECRET_KEY`
- [ ] Enable HTTPS/SSL
- [ ] Restrict CORS origins
- [ ] Set up firewall rules
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable database SSL connections
- [ ] Set up rate limiting (consider adding)
- [ ] Regular security audits

## Troubleshooting

### Database connection issues
- Check `DATABASE_URL` format
- Verify PostgreSQL is running
- Check firewall rules

### Redis connection issues
- Verify Redis is running: `redis-cli ping`
- Check `REDIS_URL` format

### File upload issues
- Check `uploads/` directory permissions
- Verify `MAX_FILE_SIZE_MB` setting
- Check disk space

### Port already in use
- Change port in `run.py` or docker-compose.yml
- Kill existing process: `lsof -ti:8000 | xargs kill`

## Quick Start Commands

```bash
# Docker Compose
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f web    # View logs
docker-compose restart web    # Restart

# Systemd
sudo systemctl start acuvera-backend
sudo systemctl status acuvera-backend
sudo journalctl -u acuvera-backend -f
```
