# Render: Fix "Connection to localhost:5432 refused"

If your Acuvera API fails on Render with:

```
connection to server at "localhost" (::1), port 5432 failed: Connection refused
```

**Cause:** The app is using the default `DATABASE_URL` (localhost) instead of your Render PostgreSQL connection string.

---

## Fix: Set DATABASE_URL in Render

### Option 1 — If you use Blueprint (render.yaml)

1. Ensure your **PostgreSQL database** is created from the same Blueprint.
2. The database name in `render.yaml` must match: `acuvera-db`.
3. In Render Dashboard → **Blueprint** → **Sync** to apply the `fromDatabase` link.
4. If the database has a different name, either:
   - Update `render.yaml` so `fromDatabase.name` matches your actual database name, or
   - Manually add `DATABASE_URL` (Option 2).

### Option 2 — Manual setup (recommended if Blueprint link fails)

1. Go to [Render Dashboard](https://dashboard.render.com) → your **Web Service** (e.g. `acuvera-api`).
2. Open **Environment**.
3. Click **Add Environment Variable**.
4. Key: `DATABASE_URL`
5. Value: go to your **PostgreSQL** service → **Connect** → copy **Internal Database URL**.
   - It looks like: `postgresql://user:pass@dpg-xxxxx-a.oregon-postgres.render.com/dbname`
6. Save. Render will redeploy.

### Option 3 — Create and attach PostgreSQL

If you don’t have a database yet:

1. Create a **PostgreSQL** service (Render Dashboard → **New** → **PostgreSQL**).
2. Create a **Web Service** from your repo (Docker).
3. In the Web Service → **Environment** → add `DATABASE_URL` with the PostgreSQL **Internal Database URL** from step 1.

---

## Verify

After redeploy, check the logs. You should see a successful startup instead of:

```
connection to server at "localhost" ... failed: Connection refused
```
