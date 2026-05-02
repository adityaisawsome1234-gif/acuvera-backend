# Production Deployment Checklist

Use this checklist to ensure your Acuvera Enterprise deployment is production-ready.

## Pre-Deployment

### Environment Configuration

- [ ] **Secrets Generated**
  ```bash
  python3 scripts/generate-secrets.py
  ```
  Copy generated secrets to `.env`

- [ ] **Environment File Configured**
  - [ ] `SECRET_KEY` set (64+ character random string)
  - [ ] `NEXTAUTH_SECRET` set (64+ character random string)
  - [ ] `POSTGRES_PASSWORD` set (strong password)
  - [ ] `DEBUG=false`
  - [ ] `ENVIRONMENT=production`
  - [ ] `CORS_ORIGINS` set to production domain(s)
  - [ ] `FRONTEND_URL` set to production URL
  - [ ] `NEXTAUTH_URL` set to production URL
  - [ ] `NEXT_PUBLIC_API_BASE_URL` set to production API URL

### Email Configuration

- [ ] **SMTP Settings**
  - [ ] `SMTP_HOST` configured
  - [ ] `SMTP_PORT` set (587 for TLS)
  - [ ] `SMTP_USER` set
  - [ ] `SMTP_PASSWORD` set
  - [ ] `SMTP_FROM_EMAIL` set to your domain

### AI Provider

- [ ] **OpenAI** (if using)
  - [ ] `OPENAI_API_KEY` set
  - [ ] `AI_PROVIDER=openai`
  - [ ] `AI_ALLOW_STUB=false`

- [ ] **AWS Bedrock** (if using)
  - [ ] AWS credentials configured
  - [ ] `AI_PROVIDER=bedrock`
  - [ ] `BEDROCK_REGION` set
  - [ ] `BEDROCK_MODEL_ID` set

### Storage

- [ ] **Local Storage** (development/testing)
  - [ ] `STORAGE_TYPE=local`
  - [ ] `UPLOAD_DIR` path exists and is writable

- [ ] **S3 Storage** (production recommended)
  - [ ] `STORAGE_TYPE=s3`
  - [ ] `AWS_ACCESS_KEY_ID` set
  - [ ] `AWS_SECRET_ACCESS_KEY` set
  - [ ] `AWS_REGION` set
  - [ ] `S3_BUCKET_NAME` set
  - [ ] S3 bucket exists and is accessible

### Monitoring (Optional but Recommended)

- [ ] **PostHog Analytics**
  - [ ] `NEXT_PUBLIC_POSTHOG_KEY` set
  - [ ] `NEXT_PUBLIC_POSTHOG_HOST` set

- [ ] **Sentry Error Monitoring**
  - [ ] `SENTRY_DSN` set (backend)
  - [ ] `NEXT_PUBLIC_SENTRY_DSN` set (frontend)

## Deployment Steps

### 1. Database Setup

- [ ] Database server accessible
- [ ] Database created
- [ ] User permissions configured
- [ ] Connection string tested

### 2. Docker Deployment

- [ ] Docker and Docker Compose installed
- [ ] `.env` file configured
- [ ] Images built: `docker-compose build`
- [ ] Migrations run: `docker-compose run --rm api alembic upgrade head`
- [ ] Services started: `docker-compose up -d`
- [ ] Health checks passing: `curl http://localhost:8000/health`

### 3. Frontend Deployment

- [ ] Environment variables set in deployment platform
- [ ] Build successful: `npm run build --workspace apps/web`
- [ ] Deployed to hosting (Vercel/Netlify/etc.)
- [ ] Domain configured
- [ ] SSL certificate active

### 4. Reverse Proxy (Nginx/Caddy)

- [ ] Reverse proxy configured
- [ ] SSL certificate installed
- [ ] Domain pointing to server
- [ ] API accessible via HTTPS
- [ ] Frontend accessible via HTTPS

### 5. Security Hardening

- [ ] Firewall configured (only 80, 443 open)
- [ ] SSH key-only access (no passwords)
- [ ] Database not exposed publicly
- [ ] Redis not exposed publicly
- [ ] Regular security updates enabled
- [ ] Backup strategy implemented

## Post-Deployment Verification

### Functional Tests

- [ ] API health check: `curl https://api.your-domain.com/health`
- [ ] User registration works
- [ ] Email verification works
- [ ] Login works
- [ ] Password reset works
- [ ] Document upload works
- [ ] AI processing works
- [ ] Dashboard loads correctly

### Performance

- [ ] API response times < 200ms (non-AI endpoints)
- [ ] Frontend loads < 3 seconds
- [ ] Database queries optimized
- [ ] Redis caching working

### Monitoring

- [ ] Error monitoring active (Sentry)
- [ ] Analytics tracking (PostHog)
- [ ] Log aggregation configured
- [ ] Uptime monitoring set up

## Maintenance

### Regular Tasks

- [ ] Weekly database backups
- [ ] Monthly security updates
- [ ] Quarterly dependency updates
- [ ] Monitor disk space
- [ ] Review error logs
- [ ] Check analytics metrics

### Backup Strategy

- [ ] Database backups automated
- [ ] File uploads backed up (or using S3)
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

## Troubleshooting

### Common Issues

**Database connection errors**
- Check `DATABASE_URL` format
- Verify database is running
- Check firewall rules

**CORS errors**
- Verify `CORS_ORIGINS` includes frontend domain
- Check for trailing slashes
- Ensure HTTPS matches in both URLs

**Email not sending**
- Verify SMTP credentials
- Check SMTP port (587 for TLS)
- Test SMTP connection

**AI processing fails**
- Verify API key is valid
- Check API quota/limits
- Review error logs

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Review error monitoring (Sentry)
3. Check API docs: `https://api.your-domain.com/docs`
