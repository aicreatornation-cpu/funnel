# Time To Shoot

A video‑booking sales funnel. The code is split into two independently‑deployable apps:

```
.
├── frontend/        React + Vite single‑page app (the funnel + /admin leads page)
│   ├── src/
│   ├── public/      logo + testimonial photos
│   ├── index.html
│   ├── vite.config.js
│   └── .env.example   → VITE_API_URL (backend URL in production)
│
├── backend/         Express API → Supabase Postgres (stores leads)
│   ├── index.js
│   └── .env.example   → Postgres credentials
│
└── package.json     root: dev orchestration only (runs both together)
```

## Local development

One‑time install (frontend + backend + root):

```bash
npm run install:all
```

Create the backend env file from the example and fill in your Supabase Postgres creds:

```bash
cp backend/.env.example backend/.env   # then edit values
```

Run both apps together (API on :3001, web on :5173):

```bash
npm run dev
```

- Web: http://localhost:5173  · Admin: http://localhost:5173/admin
- In dev the frontend calls `/api/...` and Vite proxies it to the backend (see `frontend/vite.config.js`), so no `VITE_API_URL` is needed locally.

Run on your phone (same Wi‑Fi):

```bash
npm --prefix backend run dev                 # API
npm --prefix frontend run dev -- --host      # web, exposed on the LAN
```

## Deployment (two separate services)

**Backend** → any Node host (Render, Railway, Fly, a VPS, etc.)
- Root directory: `backend`
- Start command: `npm start`
- Set env vars: `PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD` (and the host's `PORT`).

**Frontend** → any static host (Vercel, Netlify, Cloudflare Pages, etc.)
- Root directory: `frontend`
- Build: `npm run build`  → output `dist/`
- Set env var `VITE_API_URL` = your deployed backend URL (e.g. `https://your-api.onrender.com`).
- Enable SPA fallback (rewrite all routes → `index.html`) so `/admin` works on a hard refresh.

## Notes
- Never commit `backend/.env` — it holds the database password (already git‑ignored).
- The admin page (`/admin`) has no auth yet; add a login before going public.
