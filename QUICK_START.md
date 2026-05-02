# Acuvera Enterprise - Quick Start

## 1) Install Dependencies
```bash
pip install -r requirements.txt
npm install
```

## 2) Configure Environment
```bash
cp .env.example .env
```

## 3) Start Postgres + Redis
```bash
docker compose up
```

## 4) Run the API
```bash
uvicorn --app-dir apps/api app.main:app --reload
```

## 5) Run the RQ Worker
```bash
rq worker --url redis://localhost:6379/0
```

## 6) Run the Web App
```bash
npm run dev --workspace apps/web
```

## 7) Seed the Default Org + Admin
```bash
python apps/api/scripts/seed.py
```

## 8) macOS Wrapper (Optional)
```bash
cd apps/desktop
npm install
npm run tauri dev
```

## Useful URLs

- API docs: `http://localhost:8000/docs`
- Web app: `http://localhost:3000`
