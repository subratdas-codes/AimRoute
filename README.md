# AimRoute 🎓

AI-powered career guidance platform. Users answer a short interest quiz, get matched to careers, colleges, roadmaps and salaries, save their result and track attempts on a personal dashboard.

**Live:** Frontend → `aimroute.vercel.app` · Backend → `aimroute.onrender.com` · API docs (Swagger) → `https://aimroute.onrender.com/docs`

## Features

### User side
- **Career quiz** by level: `10th`, `12th`, `grad`, `pg` — 12–15 random questions per bucket, asked one at a time, no branching.
- **Career matching:** answers are scored by category tags → top career matches with fit labels, descriptions and salary ranges, plus category scores.
- **Result page:** score ring, career cards, "why this fits" reasons, step-by-step roadmap, downloadable result PDF, and suggested colleges.
- **College suggestions:** filterable by state, language and college type; shows eligibility vs cutoff, NIRF rank and average package. Custom-published college dataset.
- **Personal dashboard:** saved results history with per-row delete and a reset-history button, profile card, password reset.
- **Authentication:** register, login, forgot/reset password, change/verify password.
- **Email:** result summary email on save, password reset emails (HTTPS email API, lifetime Brevo key).
- **AI chatbot:** in-app assistant answering career questions (Groq + Gemini) — hidden on auth pages and admin panel.
- **Career tools:** full roadmap page and career comparison.

### Admin side (`/admin`)
- Login-protected admin panel (HTTP bearer auth, admins only).
- **Dashboard stats:** totals, recent users, level distribution, attempts.
- **Users:** list/search, create/edit/ban, reset password, **reset one user's data** (results + activity, account kept), **delete one user**, **delete ALL non-admin users**.
- **Reset all:** wipe every user's results + activity in one click (accounts, questions, colleges kept).
- **Questions & Options:** full CRUD per level.
- **Results:** view (flat + grouped by level), search, delete any result.
- **Colleges:** full CRUD.
- **Activity log:** all user + admin actions.

> Admin credentials are **not** committed to the repository. Set admin email(s) via `ADMIN_EMAILS` in the backend (see `.env.example` / Render env).

## Tech Stack
- **Frontend:** React 19 + Vite + Tailwind (deployed on **Vercel** → `aimroute.vercel.app`)
- **Backend:** FastAPI + SQLAlchemy (deployed on **Render** → `aimroute.onrender.com`)
- **Database:** PostgreSQL (cloud, permanent) **or** MySQL (local dev) — the backend auto-detects either from `DATABASE_URL`
- **ML/AI:** scikit-learn model (`mlmodel/model.pkl`) for career prediction; **Groq + Gemini** for the chatbot; **Brevo/SendGrid/Resend** HTTPS API for email
- **PDF reports:** generated client-side

## Repository layout
```
backend/     FastAPI app (routes, models, utils, seed data)
frontend/    React + Vite app (pages, components, services, utils)
mlmodel/     ML model, college dataset, training/validation scripts
scripts/     Dev/ops helpers (e.g. Gmail token refresh)
```

## Git Workflow (IMPORTANT — 4 members)

Each member owns a feature branch. **Never push directly to `develop` or `main`.**

| Branch | Owner | Main area |
|---|---|---|
| `frontend-ui` | Lipsa Kiran Sahoo | `frontend/` |
| `api-integration` | Jyoti Ranjan Panda | `frontend/`, API wiring |
| `ml-model` | Kamlesh Nayak | `mlmodel/`, `backend/`, `docs/` |
| `backend-dev` | Subrat Das | `backend/` |

`develop` and `main` are maintained by Subrat Das.

### Feature flow
1. Pull your branch → create your feature commits (details like "fixed x" or "added y").
2. Push to **your** branch.
3. Open a **Pull Request** into `develop` (integration branch).
4. After testing, open a PR from `develop` into `main` (production).
5. Vercel (frontend) and Render (backend) **auto-deploy** on every merge to `main`.

## Local Development

First time: clone, then install dependencies.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
- Serve at `http://localhost:5173`.
- Backend URL: set `VITE_API_URL` (defaults to the deployed Render URL). Create a `.env.local`:
  ```
  VITE_API_URL=http://localhost:8000
  ```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
- Serve at `http://localhost:8000` — Swagger UI at `http://localhost:8000/docs`.
- Required env vars (create a `.env`):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | **PostgreSQL** (e.g. `postgresql://user:pass@host:5432/db`) **or** MySQL (`mysql+mysqlconnector://...`) — auto-detected |
| `GROQ_API_KEY` | Chatbot (Groq) |
| `GEMINI_API_KEY` | Chatbot / ML (Gemini) |
| `FRONTEND_URL` | Where the frontend lives (for email links) |
| `EMAIL_PROVIDER` | `brevo` (recommended) / `sendgrid` / `resend` / `gmail` |
| `BREVO_API_KEY` (or `SENDGRID_API_KEY` / `RESEND_API_KEY`) | Lifetime API key for HTTPS email |
| `MAIL_FROM` | Verified sender email (e.g. `aimroute.noreply@gmail.com`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN` | Gmail API OAuth (token expires every 7 days in Testing mode) |
| `ADMIN_EMAILS` | Comma-separated admin emails allowed into the admin panel |

- Startup auto-runs: database table creation, question seeding (if empty), admin-user bootstrap, and column migrations.

### ML model
```bash
cd mlmodel
python train.py        # train/retrain prediction model
python validate.py     # validate model accuracy and outputs
```
The trained artifact is `mlmodel/model.pkl`; the college dataset lives in `mlmodel/colleges.csv` (used by the backend at startup).

## Deployment

### Vercel (frontend)
- Connected to GitHub, production branch: `main`, root directory: `frontend/`.
- SPA rewrite handled by `frontend/vercel.json`.
- Set `VITE_API_URL` in Vercel → Settings → Environment Variables (defaults to the Render URL).

### Render (backend)
- Connected to GitHub, production branch: `main`.
- Root directory: `backend/`, start command:
  ```
  uvicorn app.main:app --host 0.0.0.0 --port 10000
  ```
- Set the env vars from the table above in the Render dashboard.

### Database permanence (why it broke, and how to keep it)
The Aiven free MySQL instance got **deleted/paused and its hostname disappeared**, which bricked signup/login/admin + emailed (everything writes to the DB first). The backend keeps working with **your own MySQL** — you can keep your existing local/hosted MySQL (no code change): set `DATABASE_URL=mysql+mysqlconnector://user:pass@host:3306/name` and all auth/result flows just work.

Two ways to run it, depending on where the backend lives:
- **Backend runs on your own machine / VPS (localhost MySQL)** → your MySQL *is* the permanent store. Nothing else needed.
- **Backend on Render (cloud)** → Render cannot reach `localhost` on your PC. For the live site you need a DB host Render can reach, either:
  - **Neon (free Postgres)** — permanent hostname, never deleted: `DATABASE_URL=<neon connection string>`. First boot auto-creates tables, seeds questions and bootstraps the admin (`aimroute.noreply@gmail.com` / `Admin@123`), or
  - any **MySQL** host with a stable hostname (paid/self-hosted) — point `DATABASE_URL` at it.

Avoid free Aiven for the live app — its hostname can vanish at any time.

## Email / sending (recommended: Brevo API key — lifetime, no expiry)
The Gmail API path needs a Google OAuth refresh token that **expires every 7 days** while the app is in Google "Testing" mode — that's the "emails stopped arriving" cause. Avoid it by using an **HTTPS email API with a permanent API key** (the backend already supports all of them):

| Provider | Free limit | Env vars |
|---|---|---|
| **Brevo** (recommended) | 300/day | `EMAIL_PROVIDER=brevo`, `BREVO_API_KEY`, `MAIL_FROM` |
| SendGrid | 100/day | `EMAIL_PROVIDER=sendgrid`, `SENDGRID_API_KEY`, `MAIL_FROM` |
| Resend | 100/day | `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `MAIL_FROM` |

Setup for Brevo (one-time, permanent):
1. Create a free account at `brevo.com` → API Keys → create a key → copy it.
2. **Sender address:** Settings → Senders & IPs → verify `aimroute.noreply@gmail.com` (or any email you own) as a sender.
3. On Render → backend → Environment:
   - `EMAIL_PROVIDER=brevo`
   - `BREVO_API_KEY=<your key>`
   - `MAIL_FROM=<the verified sender, e.g. aimroute.noreply@gmail.com>` (defaults to `MAIL_USERNAME`)
4. Deploy. Reset/forgot-password and result emails now send over HTTPS (port 443) — no Gmail token to refresh, ever.

If you keep `EMAIL_PROVIDER=gmail` instead, re-run `python scripts/get_gmail_token.py` and update `GOOGLE_REFRESH_TOKEN` in Render every 7 days.

## API overview
- `POST /auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`
- `GET /users/me`, `POST /users/change-password`, `POST /users/verify-password`, `DELETE /users/me`
- `GET /quiz/?level=...` — questions for a level
- `POST /results/save`, `GET /results/my`, `DELETE /results/{id}`, `DELETE /results/clear`
- `GET /dashboard/` — stats + history for the current user
- `GET /colleges/suggest` — filtered college suggestions
- `POST /chat/message` — chatbot
- `POST /ml/predict` — raw ML prediction
- `GET /careers/list`, `/careers/compare` — career data
- `/admin/*` — full admin API (protected), including reset & delete-all actions
- `GET /health` — health check

Full interactive docs at `https://aimroute.onrender.com/docs`.