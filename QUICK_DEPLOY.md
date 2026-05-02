# Quick Production Deployment Guide
## Acuvera Enterprise → Vercel (Frontend) + Render (Backend)

**Domain:** `acuvera.co`  
**Frontend:** `https://acuvera.co` (Vercel)  
**Backend API:** `https://api.acuvera.co` (Render)

---

## Prerequisites

- [ ] GitHub repository with your code pushed
- [ ] GoDaddy account with `acuvera.co` domain
- [ ] Vercel account (free tier works)
- [ ] Render account (free tier works)
- [ ] OpenAI API key (or AWS Bedrock credentials)
- [ ] SMTP credentials (SendGrid, AWS SES, or similar)

---

## Part 1: Deploy Backend to Render

### Step 1.1: Create Render Account & Connect Repository

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Blueprint"** (or **"New"** → **"Blueprint"**)
3. Connect your GitHub repository
4. **Select your repository:** `acuvera-backend` (or your root repository name)
   - **Important:** Deploy the ROOT repository, not a subdirectory
   - The root should contain: `Dockerfile`, `render.yaml`, `apps/api/`, etc.
5. Render will detect `render.yaml` automatically
6. Click **"Apply"**

### Step 1.2: Configure Database

1. In Render dashboard, go to **"Databases"** tab
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name:** `acuvera-db`
   - **Database:** `acuvera_db`
   - **User:** `acuvera_user`
   - **Plan:** `Starter` (free) or `Standard` ($7/month) for production
4. Click **"Create Database"**
5. **Copy the Internal Database URL** (you'll need it)

### Step 1.3: Configure Redis

1. In Render dashboard, go to **"Redis"** tab
2. Click **"New +"** → **"Redis"**
3. Configure:
   - **Name:** `acuvera-redis`
   - **Plan:** `Starter` (free) or `Standard` ($10/month) for production
4. Click **"Create Redis"**
5. **Copy the Internal Redis URL** (format: `redis://red-xxxxx:6379` or similar)
6. **Important:** You'll need to manually set `REDIS_URL` in both API and Worker services

### Step 1.4: Deploy API Service

1. In Render dashboard, go to **"Services"** tab
2. You should see **"acuvera-api"** service (created from `render.yaml`)
3. Click on **"acuvera-api"**
4. Go to **"Environment"** tab
5. **Set these environment variables:**

   ```
   SECRET_KEY=<generate-secure-random-string-64-chars>
   OPENAI_API_KEY=<your-openai-api-key>
   SMTP_HOST=smtp.sendgrid.net  # or your SMTP host
   SMTP_PORT=587
   SMTP_USER=apikey  # for SendGrid, use "apikey"
   SMTP_PASSWORD=<your-smtp-api-key>  # SendGrid API key or SMTP password
   SMTP_FROM_EMAIL=noreply@acuvera.co
   REDIS_URL=<redis-url-from-step-1.3>
   SENTRY_DSN=<optional-sentry-dsn>
   ```
   
   **Important for Email:**
   - For SendGrid: `SMTP_USER=apikey`, `SMTP_PASSWORD=<your-sendgrid-api-key>`
   - For AWS SES: Use AWS SMTP credentials
   - For Gmail: Use app password (not recommended for production)

6. **Set these required variables:**
   ```
   REDIS_URL=<redis-url-from-step-1.3>
   ```
   
7. **Verify these are auto-set from `render.yaml`:**
   - `DATABASE_URL` (from PostgreSQL attachment)
   - `ENVIRONMENT=production`
   - `CORS_ORIGINS=https://acuvera.co,https://www.acuvera.co`
   - `FRONTEND_URL=https://acuvera.co`

7. Click **"Save Changes"**
8. Go to **"Settings"** tab
9. Under **"Custom Domain"**, add: `api.acuvera.co`
10. Click **"Save"**
11. Go back to **"Manual Deploy"** tab → Click **"Deploy latest commit"**

### Step 1.5: Deploy Worker Service

1. In Render dashboard, go to **"Services"** tab
2. You should see **"acuvera-worker"** service
3. Click on **"acuvera-worker"**
4. Go to **"Environment"** tab
5. **Set these environment variables:**

   ```
   OPENAI_API_KEY=<same-as-api-service>
   SENTRY_DSN=<optional-sentry-dsn>
   ```

6. **Set these required variables:**
   ```
   REDIS_URL=<same-redis-url-as-api-service>
   ```
   
7. **Verify these are auto-set:**
   - `DATABASE_URL` (from PostgreSQL attachment)

7. Click **"Save Changes"**
8. Go to **"Manual Deploy"** tab → Click **"Deploy latest commit"**

### Step 1.6: Run Database Migrations

1. In Render dashboard, go to **"acuvera-api"** service
2. Go to **"Shell"** tab (or use **"Logs"** to find the container)
3. Run:
   ```bash
   alembic upgrade head
   ```
   (Or use Render's one-off shell command if available)

**Alternative:** SSH into the service and run migrations manually

### Step 1.7: Verify Backend is Running

1. Wait for deployment to complete (green status)
2. Test health endpoint:
   ```bash
   curl https://api.acuvera.co/health
   ```
   Should return: `{"success":true,"data":{"status":"healthy"}}`

---

## Part 2: Deploy Frontend to Vercel

### Step 2.1: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository: `acuvera-backend`
5. Click **"Import"**

### Step 2.2: Configure Project Settings

1. **Project Name:** `acuvera-frontend` (or your choice)
2. **Root Directory:** Click **"Edit"** → Set to: `apps/web`
3. **Framework Preset:** Next.js (auto-detected)
4. **Build Command:** Leave default (`npm run build`)
5. **Output Directory:** Leave default (`.next`)
6. **Install Command:** Leave default (`npm install`)

### Step 2.3: Set Environment Variables

1. Click **"Environment Variables"** section
2. **Add these variables:**

   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.acuvera.co
   NEXTAUTH_SECRET=<generate-secure-random-string-64-chars>
   NEXTAUTH_URL=https://acuvera.co
   NEXT_PUBLIC_POSTHOG_KEY=<optional-posthog-key>
   NEXT_PUBLIC_SENTRY_DSN=<optional-sentry-dsn>
   ```

3. **Important:** Make sure `NEXT_PUBLIC_API_BASE_URL` has **no trailing slash**
4. Click **"Add"** for each variable
5. Select **"Production"**, **"Preview"**, and **"Development"** environments

### Step 2.4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Vercel will show you a preview URL (e.g., `acuvera-frontend.vercel.app`)

### Step 2.5: Configure Custom Domain

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter: `acuvera.co`
5. Click **"Add"**
6. Enter: `www.acuvera.co`
7. Click **"Add"**
8. Vercel will show DNS records needed (you'll configure these in GoDaddy next)

---

## Part 3: Configure DNS in GoDaddy

### Step 3.1: Get DNS Records from Vercel

1. In Vercel dashboard → **"Settings"** → **"Domains"**
2. For `acuvera.co`, you'll see DNS records like:
   - **Type:** `A` or `CNAME`
   - **Name:** `@` or blank
   - **Value:** Vercel's IP or CNAME

3. For `www.acuvera.co`:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Value:** `cname.vercel-dns.com` (or similar)

### Step 3.2: Get DNS Record from Render

1. In Render dashboard → **"acuvera-api"** service → **"Settings"** → **"Custom Domain"**
2. For `api.acuvera.co`, Render will show:
   - **Type:** `CNAME`
   - **Name:** `api`
   - **Value:** Render's CNAME (e.g., `acuvera-api.onrender.com`)

### Step 3.3: Configure DNS in GoDaddy

1. Log in to [GoDaddy.com](https://godaddy.com)
2. Go to **"My Products"** → **"Domains"**
3. Find `acuvera.co` → Click **"DNS"** or **"Manage DNS"**
4. **Add/Edit these records:**

   **For Root Domain (acuvera.co):**
   - **Type:** `A` (or `CNAME` if Vercel says so)
   - **Name:** `@` (or leave blank)
   - **Value:** Vercel's IP address (from Step 3.1)
   - **TTL:** `600` (or default)

   **For www Subdomain:**
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Value:** `cname.vercel-dns.com` (or what Vercel shows)
   - **TTL:** `600`

   **For api Subdomain:**
   - **Type:** `CNAME`
   - **Name:** `api`
   - **Value:** Render's CNAME (from Step 3.2, e.g., `acuvera-api.onrender.com`)
   - **TTL:** `600`

5. **Remove any conflicting records** (old A records, etc.)
6. Click **"Save"** after each addition

### Step 3.4: Wait for DNS Propagation

- DNS changes take **5-60 minutes** to propagate
- Check propagation: [whatsmydns.net](https://www.whatsmydns.net)
- Search for: `acuvera.co`, `www.acuvera.co`, `api.acuvera.co`

---

## Part 4: Verify Deployment

### Step 4.1: Test Backend

```bash
# Health check
curl https://api.acuvera.co/health

# Should return:
# {"success":true,"data":{"status":"healthy"}}
```

### Step 4.2: Test Frontend

1. Open browser: `https://acuvera.co`
2. Should see Acuvera Enterprise login page
3. Try registering a new account
4. Check email for verification link
5. Login and test document upload

### Step 4.3: Test CORS

1. Open browser console on `https://acuvera.co`
2. Try logging in
3. Should **not** see CORS errors
4. API calls should work from frontend

---

## Troubleshooting

### Backend Issues

**API not responding:**
- Check Render logs: **"acuvera-api"** → **"Logs"** tab
- Verify environment variables are set
- Check database connection: `DATABASE_URL` format
- Check Redis connection: `REDIS_URL` format

**Worker not processing jobs:**
- Check Render logs: **"acuvera-worker"** → **"Logs"** tab
- Verify `REDIS_URL` is set correctly
- Check Redis is running in Render dashboard

**CORS errors:**
- Verify `CORS_ORIGINS` in Render includes `https://acuvera.co,https://www.acuvera.co`
- Check no trailing slashes in URLs
- Ensure HTTPS (not HTTP)

### Frontend Issues

**Build fails:**
- Check Vercel build logs
- Verify `NEXT_PUBLIC_API_BASE_URL` is set (no trailing slash)
- Check `NEXTAUTH_SECRET` is set

**API calls fail:**
- Verify `NEXT_PUBLIC_API_BASE_URL=https://api.acuvera.co` (no trailing slash)
- Check browser console for errors
- Verify backend is running: `curl https://api.acuvera.co/health`

**Domain not working:**
- Wait 30-60 minutes for DNS propagation
- Check DNS records in GoDaddy match Vercel/Render instructions
- Use [whatsmydns.net](https://www.whatsmydns.net) to check propagation

### DNS Issues

**Domain not resolving:**
- Verify DNS records in GoDaddy are correct
- Check TTL is not too high (600 seconds recommended)
- Wait for propagation (can take up to 48 hours, usually < 1 hour)

**SSL certificate issues:**
- Vercel automatically provisions SSL (wait 5-10 minutes)
- Render automatically provisions SSL (wait 5-10 minutes)
- If issues persist, check domain DNS records are correct

---

## Environment Variables Summary

### Render (Backend API)

**Required:**
- `SECRET_KEY` - JWT secret (64+ chars)
- `OPENAI_API_KEY` - OpenAI API key
- `SMTP_HOST` - SMTP server hostname
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `SMTP_FROM_EMAIL` - Email sender address

**Auto-set by Render:**
- `DATABASE_URL` - From PostgreSQL attachment
- `REDIS_URL` - From Redis attachment
- `ENVIRONMENT=production`
- `CORS_ORIGINS=https://acuvera.co,https://www.acuvera.co`
- `FRONTEND_URL=https://acuvera.co`

**Optional:**
- `SENTRY_DSN` - Error monitoring

### Render (Worker)

**Required:**
- `OPENAI_API_KEY` - Same as API service

**Auto-set by Render:**
- `DATABASE_URL` - From PostgreSQL attachment
- `REDIS_URL` - From Redis attachment

**Optional:**
- `SENTRY_DSN` - Error monitoring

### Vercel (Frontend)

**Required:**
- `NEXT_PUBLIC_API_BASE_URL=https://api.acuvera.co` (no trailing slash!)
- `NEXTAUTH_SECRET` - NextAuth secret (64+ chars)
- `NEXTAUTH_URL=https://acuvera.co`

**Optional:**
- `NEXT_PUBLIC_POSTHOG_KEY` - Analytics
- `NEXT_PUBLIC_SENTRY_DSN` - Error monitoring

---

## Post-Deployment Checklist

- [ ] Backend health check works: `curl https://api.acuvera.co/health`
- [ ] Frontend loads: `https://acuvera.co`
- [ ] User registration works
- [ ] Email verification email received
- [ ] Login works
- [ ] Document upload works
- [ ] AI processing works (check worker logs)
- [ ] No CORS errors in browser console
- [ ] SSL certificates active (green lock in browser)
- [ ] Database migrations applied
- [ ] Worker processing jobs (check Render logs)

---

## Support

- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **GoDaddy DNS Help:** [godaddy.com/help](https://www.godaddy.com/help)

For application-specific issues, check:
- Render logs: **"acuvera-api"** → **"Logs"** tab
- Vercel logs: Project → **"Deployments"** → Click deployment → **"Build Logs"**
