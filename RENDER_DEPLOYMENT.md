# Render Deployment Guide - Quick Fixes

## Issue 1: "No Open Ports Available"

**Problem:** Render can't detect which port your app is listening on.

**Solution:** The Dockerfile and render.yaml have been updated to use Render's `$PORT` environment variable. 

**What to do:**
1. Make sure you're deploying the **root repository** (not a subdirectory)
2. Render will automatically set the `PORT` environment variable
3. The updated Dockerfile now uses `${PORT:-8000}` which will use Render's PORT

**Repository to deploy:** 
- **GitHub Repository Name:** `acuvera-backend` (or whatever your root repo is called)
- **Root Directory:** Leave blank (deploy from root)
- **Dockerfile Path:** `./Dockerfile` (in root)

## Issue 2: Email Validator Not Working

**Problem:** Email verification emails aren't being sent.

**Solution:** SMTP settings must be configured in Render dashboard.

**Steps to fix:**

1. **Get SMTP credentials** from your email provider:
   - **SendGrid** (recommended): [sendgrid.com](https://sendgrid.com)
     - SMTP Host: `smtp.sendgrid.net`
     - SMTP Port: `587`
     - SMTP User: `apikey`
     - SMTP Password: Your SendGrid API key
   - **AWS SES**: Use AWS credentials
   - **Gmail** (not recommended for production): Use app password

2. **Set in Render Dashboard:**
   - Go to **"acuvera-api"** service → **"Environment"** tab
   - Add these variables:
     ```
     SMTP_HOST=smtp.sendgrid.net
     SMTP_PORT=587
     SMTP_USER=apikey
     SMTP_PASSWORD=<your-sendgrid-api-key>
     SMTP_FROM_EMAIL=noreply@acuvera.co
     ```
   - Click **"Save Changes"**
   - **Redeploy** the service

3. **Test email sending:**
   - Check Render logs: **"acuvera-api"** → **"Logs"** tab
   - Look for email-related errors
   - Try registering a new user
   - Check logs for "Email sent successfully" or error messages

## Which GitHub Repository to Deploy?

**Answer:** Deploy the **root repository** that contains:
- `/Dockerfile` (in root)
- `/render.yaml` (in root)
- `/apps/api/` (backend code)
- `/apps/web/` (frontend code - not needed for Render backend)

**Example repository structure:**
```
acuvera-backend/          ← Deploy THIS repository
├── Dockerfile
├── render.yaml
├── requirements.txt
├── apps/
│   ├── api/              ← Backend code
│   └── web/              ← Frontend (deploy separately to Vercel)
└── ...
```

**In Render:**
1. Click **"New +"** → **"Blueprint"**
2. Connect GitHub
3. Select repository: **`acuvera-backend`** (or your repo name)
4. Render will detect `render.yaml` automatically
5. Click **"Apply"**

## Quick Checklist

### Before Deploying:
- [ ] Repository is pushed to GitHub
- [ ] `render.yaml` is in root directory
- [ ] `Dockerfile` is in root directory
- [ ] SMTP credentials ready (SendGrid/AWS SES)

### During Deployment:
- [ ] Deploy from root repository (not subdirectory)
- [ ] Let Render create PostgreSQL database
- [ ] Create Redis service manually
- [ ] Set `REDIS_URL` in both API and Worker services
- [ ] Set all required environment variables (see below)

### Required Environment Variables:

**For API Service:**
```
SECRET_KEY=<generate-random-64-chars>
OPENAI_API_KEY=<your-openai-key>
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<sendgrid-api-key>
SMTP_FROM_EMAIL=noreply@acuvera.co
REDIS_URL=<redis-url-from-render>
```

**For Worker Service:**
```
OPENAI_API_KEY=<same-as-api>
REDIS_URL=<same-as-api>
```

## Testing Email After Deployment

1. **Check logs for email errors:**
   ```bash
   # In Render dashboard → acuvera-api → Logs
   # Look for: "Email sent successfully" or error messages
   ```

2. **Test registration:**
   - Go to your frontend: `https://acuvera.co/register`
   - Register a new account
   - Check Render logs for email sending status
   - Check your email inbox (and spam folder)

3. **If emails still not working:**
   - Verify SMTP credentials are correct
   - Check SMTP provider dashboard for blocked emails
   - Check Render logs for specific error messages
   - Try using a different SMTP provider (SendGrid is most reliable)

## Common Issues

**"No open ports available":**
- ✅ Fixed: Dockerfile now uses `$PORT` env var
- Make sure you're deploying from root directory
- Render will auto-set PORT variable

**"Email not sending":**
- ✅ Fixed: Better error logging added
- Check SMTP credentials in Render dashboard
- Verify SMTP provider allows sending from your domain
- Check Render logs for specific errors

**"Can't connect to database":**
- Verify `DATABASE_URL` is auto-set by Render PostgreSQL attachment
- Check database is running in Render dashboard

**"Can't connect to Redis":**
- Create Redis service manually in Render
- Copy Redis URL from Redis service dashboard
- Set `REDIS_URL` in both API and Worker services
