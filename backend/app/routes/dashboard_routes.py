# backend/app/routes/dashboard_routes.py
# Replace your existing dashboard_routes.py with this

import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.connection import SessionLocal
from app.models.user_model import User
from app.models.result_model import Result
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_dashboard(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # ── User info ─────────────────────────────────────────
    user = db.query(User).filter(User.email == current_user).first()

    # ── Total attempts ────────────────────────────────────
    total_attempts = db.query(func.count(Result.id)).filter(
        Result.user_email == current_user
    ).scalar() or 0

    # ── All results (newest first) ────────────────────────
    all_results = (
        db.query(Result)
        .filter(Result.user_email == current_user)
        .order_by(Result.created_at.desc())
        .all()
    )

    # ── Build result history ──────────────────────────────
    history = []
    for r in all_results:
        # Parse all_careers JSON safely
        try:
            careers = json.loads(r.all_careers) if r.all_careers else []
        except Exception:
            careers = []

        # Parse reasons safely
        reasons = r.reasons.split(", ") if r.reasons else []

        history.append({
            "id":               r.id,
            "level":            r.level,
            "top_career":       r.top_career,
            "fit_label":        r.fit_label,
            "dominant_category":r.dominant_category,
            "percentage":       r.percentage,
            "reasons":          reasons,
            "all_careers":      careers,
            "created_at":       r.created_at.isoformat() if r.created_at else None,
        })

    # ── Latest result ─────────────────────────────────────
    latest = history[0] if history else None

    # ── Level breakdown (how many attempts per level) ─────
    level_counts = {}
    for r in all_results:
        lvl = r.level or "unknown"
        level_counts[lvl] = level_counts.get(lvl, 0) + 1

    # ── Category strength (across all attempts) ───────────
    category_totals = {}
    for r in all_results:
        cat = r.dominant_category or "general"
        category_totals[cat] = category_totals.get(cat, 0) + 1

    return {
        # User
        "user_id":          user.id if user else None,
        "name":             user.name if user else "User",
        "email":            current_user,

        # Stats
        "total_attempts":   total_attempts,
        "level_breakdown":  level_counts,
        "category_totals":  category_totals,

        # Results
        "latest":           latest,
        "history":          history,
    }