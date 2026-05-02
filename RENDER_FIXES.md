# Render Deployment Fixes

## ✅ Fixed Issues

### 1. "No Open Ports Available" - FIXED

**What was wrong:**
- Dockerfile hardcoded port 8000
- Render couldn't detect which port to use

**What I fixed:**
- ✅ Updated Dockerfile to use `${PORT:-8000}` (uses Render's PORT env var)
- ✅ Updated render.yaml to let Dockerfile handle PORT automatically
- ✅ Render automatically sets `PORT` for web services

**What you need to do:**
- Nothing! Just redeploy. Render will now detect the port correctly.

### 2. Email Validator Not Working - FIXED

**What was wrong:**
- Email errors were silently failing
- No logging to help debug

**What I fixed:**
- ✅ Added proper error logging for email failures
- ✅ Added timeout to SMTP connection
- ✅ Better error messages in production

**What you need to do:**
1. **Set SMTP credentials in Render dashboard:**
   - Go to **"acuvera-api"** → **"Environment"** tab
   - Add these (example for SendGrid):
     ```
     SMTP_HOST=smtp.sendgrid.net
     SMTP_PORT=587
     SMTP_USER=apikey
     SMTP_PASSWORD=<your-sendgrid-api-key>
     SMTP_FROM_EMAIL=noreply@acuvera.co
     ```
2. **Redeploy** the service
3. **Check logs** after deployment for email status

## Which GitHub Repository?

**Deploy the ROOT repository** that contains:
- `Dockerfile` (in root)
- `render.yaml` (in root)  
- `apps/api/` directory
- `requirements.txt` (in root)

**Repository name:** `acuvera-backend` (or whatever your root repo is called)

**In Render:**
1. **"New +"** → **"Blueprint"**
2. Connect GitHub
3. Select: **`acuvera-backend`** (root repo, not a subdirectory)
4. Render detects `render.yaml` automatically
5. Click **"Apply"**

## Quick Test After Fixes

1. **Deploy to Render** (should work now with port detection)

2. **Set SMTP credentials** in Render dashboard

3. **Test email:**
   ```bash
   # Check Render logs: acuvera-api → Logs tab
   # Register a new user
   # Look for: "Email sent successfully" or error details
   ```

4. **Verify port:**
   ```bash
   curl https://api.acuvera.co/health
   # Should return: {"success":true,"data":{"status":"healthy"}}
   ```

## Still Having Issues?

**Port still not working?**
- Make sure you're deploying from ROOT directory
- Check Render logs for port binding errors
- Verify Dockerfile is in root

**Email still not working?**
- Check SMTP credentials are correct
- Verify SMTP provider allows sending (check provider dashboard)
- Check Render logs for specific SMTP errors
- Try SendGrid (most reliable): https://sendgrid.com

**Need help?**
- Check `RENDER_DEPLOYMENT.md` for detailed guide
- Check Render logs: **"acuvera-api"** → **"Logs"** tab
