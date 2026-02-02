# Final Port Binding Fix for Render

## Issue
Render says "No open ports detected" even though we're binding to PORT.

## Root Cause
According to Render docs:
- Default PORT is **10000** (not 8000)
- App must bind to **0.0.0.0** (we have this ✅)
- The startCommand must use **$PORT** directly (not ${PORT:-8000})

## Fix Applied

### 1. Simplified startCommand
Removed email validator check and workers flag to make it simpler:
```yaml
startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 2. Updated Dockerfile CMD
Changed default port to 10000 to match Render's default:
```dockerfile
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
```

## Why This Works

1. **Direct $PORT usage**: Render sets PORT=10000 by default, using $PORT directly ensures we use Render's value
2. **Simplified command**: No shell complexity, just direct uvicorn call
3. **0.0.0.0 binding**: Required for Render to detect the port
4. **No workers flag**: Single worker is fine for Render to detect the port

## Render Dashboard Settings

If setting manually in Render Dashboard → Settings:

**Start Command:**
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Working Directory:**
```
/app/apps/api
```

**Port (optional, Render sets this automatically):**
Leave blank or set to `10000`

## Verification

After deployment, logs should show:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000 (Press CTRL+C to quit)
```

If you see port 10000 in the logs, Render will detect it correctly.
