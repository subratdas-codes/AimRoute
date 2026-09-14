import json
import os
import asyncio
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.database.connection import SessionLocal
from app.models.result_model import Result
from app.models.user_model import User
from app.utils.dependencies import get_current_user
from app.utils.email_handler import send_result_email
from app.utils.activity import log_activity

router = APIRouter(prefix="/results", tags=["Results"])

DASHBOARD_URL = f"{os.getenv('FRONTEND_URL', 'https://aimroute.vercel.app')}/dashboard"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Save schema ───────────────────────────────────────────────
class SaveResultRequest(BaseModel):
    level: str
    top_career: str
    fit_label: str
    dominant_category: str
    percentage: Optional[float] = 0.0
    reasons: List[str] = []
    all_careers: List[dict] = []


# ── Save result + send email ──────────────────────────────────
@router.post("/save")
async def save_result(
    body: SaveResultRequest,
    background_tasks: BackgroundTasks,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Save to DB
    result = Result(
        user_email        = current_user,
        level             = body.level,
        top_career        = body.top_career,
        fit_label         = body.fit_label,
        dominant_category = body.dominant_category,
        percentage        = body.percentage,
        reasons           = ", ".join(body.reasons),
        all_careers       = json.dumps(body.all_careers),
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    log_activity(db, current_user, "quiz_saved", f"{body.level} · {body.top_career}")

    # Get user's name from DB
    user = db.query(User).filter(User.email == current_user).first()
    user_name = user.name if user else "Student"

    # Send congratulation email in background (non-blocking)
    async def _send_result_email_safe():
        try:
            await asyncio.to_thread(
                send_result_email,
                current_user,
                user_name,
                body.top_career,
                body.level,
                DASHBOARD_URL,
            )
            print(f"[Email] result email SENT to {current_user}")
        except Exception as e:
            print(f"[Email] result email send failed for {current_user}: {type(e).__name__}: {e}")
            import traceback
            print(traceback.format_exc())

    background_tasks.add_task(_send_result_email_safe)

    return {"message": "Result saved successfully", "id": result.id}


# ── Delete a single result (owner only) ──────────────────────
@router.delete("/{result_id}")
def delete_my_result(
    result_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    r = db.query(Result).filter(
        Result.id == result_id,
        Result.user_email == current_user,
    ).first()
    if not r:
        raise HTTPException(status_code=404, detail="Result not found")
    db.delete(r)
    db.commit()
    return {"message": "Result deleted"}


# ── Clear ALL of the user's results ───────────────────────────
@router.delete("/clear")
def clear_my_results(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(Result).filter(Result.user_email == current_user).delete()
    db.commit()
    return {"message": "All results cleared"}


# ── Get all results for logged-in user ────────────────────────
@router.get("/my")
def get_my_results(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    results = db.query(Result).filter(
        Result.user_email == current_user
    ).order_by(Result.created_at.desc()).all()

    return [
        {
            "id":                r.id,
            "level":             r.level,
            "top_career":        r.top_career,
            "fit_label":         r.fit_label,
            "dominant_category": r.dominant_category,
            "percentage":        r.percentage,
            "reasons":           r.reasons.split(", ") if r.reasons else [],
            "all_careers":       json.loads(r.all_careers) if r.all_careers else [],
            "created_at":        r.created_at.isoformat(),
        }
        for r in results
    ]