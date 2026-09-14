# AimRoute

AI-powered career guidance platform — React (Vite) frontend, FastAPI backend, MySQL database, and an ML career-matching model.

## Tech Stack
- **Frontend:** React 19 + Vite (deployed on Vercel → `aimroute.vercel.app`)
- **Backend:** FastAPI (deployed on Render → `aimroute.onrender.com`)
- **Database:** MySQL (cloud)
- **ML/AI:** scikit-learn model (`mlmodel/model.pkl`), Groq + Gemini APIs

## Git Workflow (IMPORTANT — 4 members)
Each member owns a feature branch. **Never push directly to `develop` or `main`.**

| Branch | Owner | Contents |
|---|---|---|
| `frontend-ui` | Lipsa Kiran Sahoo | `frontend/` |
| `api-integration` | Jytiranjan Panda | `frontend/` |
| `backend-dev` | Subrat Das | `backend/` |
| `ml-model` | Kamlesh Nayak | `mlmodel/`, `backend/`, `docs/` |

Flow:
1. Work on **your** feature branch → commit → push.
2. Open a **Pull Request** into `develop` (test branch) — CI runs automatically.
3. After testing, open a PR from `develop` into `main` (production) — CI runs again, then Vercel auto-deploys.

## Local Development
- Frontend: `cd frontend && npm install && npm run dev`
- Backend: `cd backend` then `uvicorn app.main:app --reload` (set `DATABASE_URL`/`MYSQL_*` env vars)
- Frontend calls the backend via `VITE_API_URL` (defaults to the deployed Render URL).

## Deployment
- Frontend: connected to Vercel, production branch `main`, SPA rewrite in `frontend/vercel.json`.
- Backend: Render web service, root dir `backend/`, start command `uvicorn app.main:app --host 0.0.0.0 --port 10000`.
- Env vars for backend: `DATABASE_URL`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `FRONTEND_URL`.