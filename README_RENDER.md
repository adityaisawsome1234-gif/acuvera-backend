# Render Deployment - Quick Answers

## Which GitHub Repository to Deploy?

**Answer:** Deploy the **ROOT repository** named `acuvera-backend` (or your repository name).

**Repository structure should be:**
```
acuvera-backend/          ← Deploy THIS (root)
├── Dockerfile           ← Must be in root
├── render.yaml          ← Must be in root
├── requirements.txt     ← Must be in root
├── apps/
│   ├── api/            ← Backend code
│   └── web/            ← Frontend (deploy separately to Vercel)
└── ...
```

**In Render Dashboard:**
1. Click **"New +"** → **"Blueprint"**
2. Connect GitHub account
3. **Select repository:** `acuvera-backend` (the root repo)
4. **Root Directory:** Leave blank (deploy from root)
5. Render will auto-detect `render.yaml`
6. Click **"Apply"**

## Fixed: "No Open Ports Available"

✅ **FIXED** - Updated Dockerfile and render.yaml to use Render's `$PORT` variable.

**What changed:**
- Dockerfile CMD now uses `${PORT:-8000}`
- render.yaml uses `startCommand` with `$PORT`
- Render automatically sets `PORT` for web services

**What to do:**
- Just redeploy! Port detection should work now.

## Fixed: Email Validator Not Working

✅ **FIXED** - Added better error logging and SMTP configuration.

**What changed:**
- Better error messages in logs
- SMTP timeout handling
- Production error reporting

**What you need to do:**

1. **Get SMTP credentials** (recommended: SendGrid):
   - Sign up at [sendgrid.com](https://sendgrid.com)
   - Create API key
   - Note: SMTP Host = `smtp.sendgrid.net`, User = `apikey`

2. **Set in Render Dashboard:**
   - Go to **"acuvera-api"** service
   - Click **"Environment"** tab
   - Add these variables:
     ```
     SMTP_HOST=smtp.sendgrid.net
     SMTP_PORT=587
     SMTP_USER=apikey
     SMTP_PASSWORD=<your-sendgrid-api-key>
     SMTP_FROM_EMAIL=noreply@acuvera.co
     ```
   - Click **"Save Changes"**
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

3. **Test:**
   - Register a new user
   - Check Render logs: **"acuvera-api"** → **"Logs"** tab
   - Look for: "Email sent successfully" or error details
   - Check your email inbox

## Quick Deployment Steps

1. **Deploy Repository:**
   - Repository: `acuvera-backend` (root)
   - Render will create services from `render.yaml`

2. **Create Database:**
   - Render auto-creates PostgreSQL from `render.yaml`
   - Or create manually: **"New +"** → **"PostgreSQL"**

3. **Create Redis:**
   - **"New +"** → **"Redis"**
   - Name: `acuvera-redis`
   - Copy the Redis URL

4. **Set Environment Variables:**
   - **API Service:**
     ```
     SECRET_KEY=<random-64-chars>
     OPENAI_API_KEY=<your-key>
     SMTP_HOST=smtp.sendgrid.net
     SMTP_PORT=587
     SMTP_USER=apikey
     SMTP_PASSWORD=<sendgrid-key>
     SMTP_FROM_EMAIL=noreply@acuvera.co
     REDIS_URL=<redis-url>
     ```
   - **Worker Service:**
     ```
     OPENAI_API_KEY=<same-as-api>
     REDIS_URL=<same-as-api>
     ```

5. **Deploy:**
   - Click **"Manual Deploy"** → **"Deploy latest commit"**
   - Wait for build to complete
   - Check logs for errors

## Troubleshooting

**Port still not working?**
- Verify `render.yaml` has `startCommand` with `$PORT`
- Check Render logs for port binding errors
- Make sure you're deploying from root directory

**Email still not working?**
- Check SMTP credentials are correct
- Verify SendGrid API key is active
- Check Render logs for SMTP errors
- Try a test email from SendGrid dashboard

**Need more help?**
- See `RENDER_DEPLOYMENT.md` for detailed guide
- See `RENDER_FIXES.md` for specific fixes
- Check Render logs: **"acuvera-api"** → **"Logs"** tab
