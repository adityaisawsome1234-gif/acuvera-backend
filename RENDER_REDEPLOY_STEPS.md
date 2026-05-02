# Step-by-Step: Redeploy to Render

## ✅ Step 1: Verify Push to GitHub

The changes have been pushed to GitHub. Verify at:
`https://github.com/adityaisawsome1234-gif/acuvera-backend`

Latest commits:
- `a5e203d` - Fix module path and port binding for Render
- `4da23c3` - Ensure all files are copied and email-validator installs correctly
- `9ee5a63` - Fix email-validator installation and use correct app structure

---

## 📋 Step 2: Go to Render Dashboard

1. Open your browser
2. Go to: **https://dashboard.render.com**
3. Log in to your Render account

---

## 🔍 Step 3: Find Your Service

1. In the Render dashboard, look for the service named:
   - **`acuvera-backend-2`** (or whatever name you see)
   - OR **`acuvera-api`** (if it was created from render.yaml)

2. Click on the service name to open it

---

## 🚀 Step 4: Manual Deploy

1. In the service page, look for the **"Manual Deploy"** section
   - Usually at the top right or in a dropdown menu
   - May be labeled as **"Deploy"** or **"Deploy latest commit"**

2. Click **"Manual Deploy"** → **"Deploy latest commit"**
   - This tells Render to pull the latest code from GitHub
   - Render will automatically detect the new commits

3. **Wait for deployment to start**
   - You'll see a new deployment appear in the "Deployments" section
   - Status will show "Building" or "Deploying"

---

## 👀 Step 5: Monitor Build Logs

1. Click on the **"Logs"** tab (or the deployment entry)
2. Watch for these success indicators:

   **✅ Good signs:**
   ```
   email-validator installed: 2.1.0
   email-validator OK
   INFO:     Started server process
   INFO:     Uvicorn running on http://0.0.0.0:XXXX
   INFO:     Application startup complete.
   ```

   **❌ If you see errors:**
   - `ModuleNotFoundError: No module named 'app'` → Check logs, may need to verify PYTHONPATH
   - `No open ports detected` → Check that PORT env var is being used
   - Email validator errors → Check build logs for installation

---

## ⚙️ Step 6: Verify Environment Variables

While deployment is running, check your environment variables:

1. Go to **"Environment"** tab in your Render service
2. Verify these are set:

   **Required:**
   - `SECRET_KEY` - Random 64+ character string
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `SMTP_HOST` - e.g., `smtp.sendgrid.net`
   - `SMTP_PORT` - `587`
   - `SMTP_USER` - e.g., `apikey` (for SendGrid)
   - `SMTP_PASSWORD` - Your SMTP password/API key
   - `SMTP_FROM_EMAIL` - e.g., `noreply@acuvera.co`
   - `REDIS_URL` - From your Redis service
   - `DATABASE_URL` - Should auto-populate from PostgreSQL

   **Auto-set by render.yaml:**
   - `ENVIRONMENT=production`
   - `CORS_ORIGINS=https://acuvera.co,https://www.acuvera.co`
   - `FRONTEND_URL=https://acuvera.co`
   - `PORT` - Automatically set by Render (don't set manually)

3. If any are missing, add them and **save**
4. After saving, Render will automatically redeploy

---

## ✅ Step 7: Verify Deployment Success

1. **Check service status:**
   - Should show **"Live"** or **"Running"** (green)
   - Not "Failed" or "Stopped"

2. **Test health endpoint:**
   ```bash
   curl https://acuvera-backend-2.onrender.com/health
   ```
   OR if you set a custom domain:
   ```bash
   curl https://api.acuvera.co/health
   ```
   
   Should return:
   ```json
   {"success":true,"data":{"status":"healthy"}}
   ```

3. **Check logs for errors:**
   - Go to **"Logs"** tab
   - Look for any red error messages
   - Should see "Application startup complete"

---

## 🔧 Step 8: If Deployment Fails

### Issue: Still seeing "No open ports detected"

**Fix:**
1. Go to **"Settings"** tab
2. Scroll to **"Start Command"**
3. Verify it's set to:
   ```
   sh -c "python -c 'import email_validator; print(\"email-validator OK\")' && uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4"
   ```
4. If different, update it and save
5. Redeploy

### Issue: ModuleNotFoundError

**Fix:**
1. Check **"Settings"** → **"Working Directory"**
2. Should be: `/app/apps/api`
3. If different, update and save
4. Redeploy

### Issue: Email validator errors

**Fix:**
1. Check build logs for installation errors
2. Verify `email-validator==2.1.0` is in `requirements.txt`
3. Check that build completed successfully

---

## 🎯 Step 9: Set Custom Domain (Optional)

If you want `api.acuvera.co`:

1. Go to **"Settings"** tab
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter: `api.acuvera.co`
5. Click **"Save"**
6. Render will show DNS records to add in GoDaddy
7. Add the CNAME record in GoDaddy DNS settings
8. Wait for DNS propagation (5-60 minutes)

---

## 📊 Step 10: Monitor After Deployment

1. **Check logs regularly** for the first few minutes
2. **Test API endpoints:**
   - Health: `/health`
   - API docs: `/docs` (if enabled)
3. **Monitor for errors** in the Logs tab
4. **Set up alerts** (optional) in Render dashboard

---

## ✅ Success Checklist

After redeployment, verify:

- [ ] Service status is "Live" (green)
- [ ] Health endpoint returns `{"success":true,"data":{"status":"healthy"}}`
- [ ] Logs show "Uvicorn running on http://0.0.0.0:XXXX"
- [ ] No "ModuleNotFoundError" errors
- [ ] No "No open ports detected" errors
- [ ] Email validator installs successfully
- [ ] Application startup completes

---

## 🆘 Need Help?

If deployment still fails:

1. **Check build logs** - Look for errors during Docker build
2. **Check runtime logs** - Look for errors when starting the app
3. **Verify environment variables** - All required vars are set
4. **Check Render status page** - https://status.render.com
5. **Review EXACT_FIX.md** - For detailed technical information

---

**That's it!** Your app should now be deployed and running on Render. 🚀
