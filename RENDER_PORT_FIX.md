# Render Port Detection Fix

## Issue: "No open ports detected"

Render couldn't detect which port your app is listening on.

## ✅ Fixed

**Changes made:**

1. **Updated `render.yaml`:**
   - Changed `startCommand` to explicitly use `$PORT` and ensure correct working directory
   - Command: `cd /app/apps/api && uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4`

2. **Updated `Dockerfile`:**
   - Changed CMD to use exec form with shell for better compatibility
   - Render's `startCommand` will override this anyway

## What to do:

1. **Commit and push these changes:**
   ```bash
   git add render.yaml Dockerfile requirements.txt
   git commit -m "Fix Render port detection and email validator"
   git push
   ```

2. **Redeploy in Render:**
   - Go to Render dashboard
   - Click on **"acuvera-api"** service
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

3. **Verify:**
   - Check logs for: "Uvicorn running on http://0.0.0.0:XXXX" (where XXXX is Render's PORT)
   - Should see: "Application startup complete"
   - No more "No open ports detected" error

## Email Validator Fix

The `email-validator` package is already in `requirements.txt`. The error might be due to:
- Package not installing during build
- Version conflict

**Fixed by:**
- Ensuring `email-validator==2.1.0` is in requirements.txt
- Docker build will install it automatically

If you still see email validator errors after redeploy:
- Check Render build logs for installation errors
- Verify `email-validator` appears in build output
