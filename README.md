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
- **Email:** confirmation + result summary email on save, password reset emails (Gmail API over HTTPS).
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
- **Database:** MySQL (cloud)
- **ML/AI:** scikit-learn model (`mlmodel/model.pkl`) for career prediction; **Groq + Gemini** for the chatbot; **Gmail API** for email
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

### Making your name visible on your branch
Because git attaches a name/email to every commit, each member should configure their identity once, then pull and add an empty commit so their name shows on their branch on GitHub:

```bash
# one-time setup (your full name + the email on your GitHub account)
git config user.name  "Your Full Name"
git config user.email "your.github.email@gmail.com"

# pull your branch's latest code, then add your name commit
git pull origin frontend-ui        # or api-integration / ml-model / backend-dev
git commit --allow-empty -m "contributed by Your Full Name"
git push origin frontend-ui
```

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
| `DATABASE_URL` | MySQL connection string (or `MYSQL_*` host/user/pass/db) |
| `GROQ_API_KEY` | Chatbot (Groq) |
| `GEMINI_API_KEY` | Chatbot / ML (Gemini) |
| `FRONTEND_URL` | Where the frontend lives (for email links) |
| `EMAIL_PROVIDER` | `gmail` for Gmail API |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN` | Gmail API OAuth |
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

## Email / tokens (ops note)
The backend sends email via the Gmail API. The OAuth **refresh token** used for email expires every 7 days while the Google app is in "Testing" mode. When email stops sending, re-run:
```bash
python scripts/get_gmail_token.py
```
and update `GOOGLE_REFRESH_TOKEN` in Render. There are also diagnostics endpoints (see `/docs`) to verify email config without sending mail.

## API overview
- `POST /auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`
- `GET/POST` user endpoints under `/users/*` (profile, password, account)
- `GET /quiz/?level=...` — questions for a level
- `POST /quiz/submit` — submit answers → careers
- `POST /results/save`, `GET /results/my`, `DELETE /results/{id}`, `DELETE /results/clear`
- `GET /dashboard/` — stats + history for the current user
- `GET /colleges/suggest` — filtered college suggestions
- `POST /chat/message` — chatbot
- `POST /ml/predict` — raw ML prediction
- `GET /careers/list`, `/careers/compare` — career data
- `/admin/*` — full admin API (protected), including reset & delete-all actions
- `GET /health` — health check

Full interactive docs at `https://aimroute.onrender.com/docs`.