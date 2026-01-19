# Deployment Guide

This guide covers multiple deployment options for the Acuvera backend.

## Prerequisites

- Python 3.11+
- PostgreSQL database
- Redis (for background jobs)
- Environment variables configured

## Quick Start: Docker Compose (Easiest)

The fastest way to get started is using Docker Compose:

```bash
# 1. Copy environment file
cp .env.example .env
# Edit .env with your settings

# 2. Start all services
docker-compose up -d

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f web
```

Your API will be available at `http://localhost:8000`

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

Create `/etc/nginx/sites-available/acuvera-backend`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/acuvera-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL/TLS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

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
