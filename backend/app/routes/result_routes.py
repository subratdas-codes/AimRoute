import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.database.connection import SessionLocal
from app.models.result_model import Result
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/results", tags=["Results"])


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


# ── Save result ───────────────────────────────────────────────
@router.post("/save")
def save_result(
    body: SaveResultRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
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
    return {"message": "Result saved successfully", "id": result.id}


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
            "id":               r.id,
            "level":            r.level,
            "top_career":       r.top_career,
            "fit_label":        r.fit_label,
            "dominant_category":r.dominant_category,
            "percentage":       r.percentage,
            "reasons":          r.reasons.split(", ") if r.reasons else [],
            "all_careers":      json.loads(r.all_careers) if r.all_careers else [],
            "created_at":       r.created_at.isoformat(),
        }
        for r in results
    ]