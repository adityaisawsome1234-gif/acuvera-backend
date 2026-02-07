# Acuvera Frontend

Production-style Next.js frontend for Acuvera (medical billing intelligence).

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running alongside the backend

1. Start the backend at `http://localhost:8000` (Docker or uvicorn)
2. Start the frontend with `npm run dev`
3. Log in or register to access protected pages

## Key routes

- `/` Landing page
- `/login` Login
- `/register` Registration
- `/dashboard` Role-aware dashboard
- `/bills` Bill list
- `/bills/[id]` Bill detail + AI analysis
- `/upload` Upload bill
- `/provider` Provider dashboard
- `/admin` Admin tools

## Notes

- Auth token stored in `localStorage`
- All API calls use `NEXT_PUBLIC_API_BASE_URL`
- 401 responses auto-redirect to `/login`
