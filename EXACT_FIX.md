# Exact Fix for ModuleNotFoundError and Port Detection

## 1. FastAPI Instance Location

**File:** `apps/api/app/main.py`  
**Line 17:** `app = FastAPI(title="Acuvera Enterprise API", version="1.0.0")`

## 2. Module Path Analysis

**Structure:**
```
/app/apps/api/          (WORKDIR, PYTHONPATH includes this)
  └── app/              (Python package)
      ├── __init__.py   ✅ EXISTS
      └── main.py       ✅ Contains `app = FastAPI()`
```

**With PYTHONPATH=/app/apps/api:**
- Module `app` resolves to `/app/apps/api/app/`
- Module `app.main` resolves to `/app/apps/api/app/main.py`
- **Correct uvicorn command:** `uvicorn app.main:app`

## 3. Exact Changes

### Dockerfile Changes

```diff
--- a/Dockerfile
+++ b/Dockerfile
@@ -44,6 +44,7 @@ HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
 # Run the application
-# Render will override this with startCommand from render.yaml
-# Default CMD for local development
-CMD ["sh", "-c", "cd /app/apps/api && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 4"]
+# PYTHONPATH=/app/apps/api means 'app' package is at /app/apps/api/app/
+# So 'app.main:app' resolves to /app/apps/api/app/main.py
+CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 4"]
```

### render.yaml Changes

```diff
--- a/render.yaml
+++ b/render.yaml
@@ -11,7 +11,7 @@ services:
     dockerContext: .
     # Render automatically sets PORT env var - must listen on 0.0.0.0:$PORT
     # Use startCommand to override Dockerfile CMD and ensure PORT is used
-    startCommand: sh -c "cd /app/apps/api && python -c 'import email_validator; print(\"email-validator OK\")' && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 4"
+    startCommand: sh -c "python -c 'import email_validator; print(\"email-validator OK\")' && uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4"
     workingDir: /app/apps/api
```

## 4. Render Start Command

**In Render Dashboard → Settings → Start Command, set:**

```
sh -c "python -c 'import email_validator; print(\"email-validator OK\")' && uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4"
```

**OR** if Render uses the startCommand from render.yaml (which it should), leave it blank in the dashboard.

## 5. Key Points

1. ✅ `apps/api/app/__init__.py` exists (package is importable)
2. ✅ PYTHONPATH=/app/apps/api (set in Dockerfile)
3. ✅ WORKDIR=/app/apps/api (set in Dockerfile and render.yaml)
4. ✅ Module path: `app.main:app` (correct)
5. ✅ Port binding: `--host 0.0.0.0 --port $PORT` (Render's PORT env var)
6. ✅ Removed unnecessary `cd` command (workingDir already set)

## 6. Verification

After deployment, logs should show:
```
email-validator OK
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:XXXX (Press CTRL+C to quit)
INFO:     Application startup complete.
```

No more:
- ❌ `ModuleNotFoundError: No module named 'app'`
- ❌ `No open ports detected`
