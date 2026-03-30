import pickle
import numpy as np
from fastapi import APIRouter
from pydantic import BaseModel
from pathlib import Path
from typing import Optional
from app.utils.career_pools import CAREER_POOLS, SALARY_RANGES

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "mlmodel" / "model.pkl"

try:
    with open(MODEL_PATH, "rb") as f:
        ml_model = pickle.load(f)
    ML_AVAILABLE = True
except Exception:
    ML_AVAILABLE = False


class PredictRequest(BaseModel):
    level: str
    category_scores: dict
    percentage: Optional[float] = 60.0


HIGH_BAR_CAREERS = {
    "10th": ["Science with PCM", "Science with PCB"],
    "12th": ["MBBS (NEET-UG)", "B.Tech / B.E (JEE)", "B.Arch (Architecture)", "NDA — National Defence Academy"],
    "grad": ["MBA (CAT — IIM)", "MS Abroad (GRE)", "UPSC Civil Services (IAS/IPS/IFS)", "MD / MS (NEET-PG)"],
    "pg":   ["IAS / IPS / IFS (UPSC)", "PhD in CS / AI (IIT / IISc / Abroad)", "DM / MCh — Superspeciality Medical"],
}

PERCENTAGE_THRESHOLD = 70.0


def get_fit_label(score: int, pct: float) -> str:
    if score >= 3 and pct >= 75:
        return "Excellent fit"
    elif score >= 2 or pct >= 65:
        return "Good fit"
    else:
        return "Worth exploring"


@router.post("/predict")
def predict_career(req: PredictRequest):
    level = req.level.lower().strip()
    scores = req.category_scores
    pct = req.percentage or 60.0

    if level not in CAREER_POOLS:
        level = "grad"

    pool = CAREER_POOLS[level]
    hard_careers = HIGH_BAR_CAREERS.get(level, [])
    sorted_cats = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    top_careers = []
    seen = set()

    for cat, score in sorted_cats:
        if score == 0:
            continue
        for c in pool.get(cat, []):
            if c["career"] not in seen:
                salary = SALARY_RANGES.get(c["career"], {"min": "₹3L", "max": "₹10L", "note": "Varies by role"})
                top_careers.append({
                    "career":      c["career"],
                    "desc":        c["desc"],
                    "category":    cat,
                    "score":       score,
                    "fit":         get_fit_label(score, pct),
                    "salary_min":  salary["min"],
                    "salary_max":  salary["max"],
                    "salary_note": salary["note"],
                })
                seen.add(c["career"])

    if not top_careers:
        for c in pool.get("general", []):
            salary = SALARY_RANGES.get(c["career"], {"min": "₹3L", "max": "₹10L", "note": "Varies"})
            top_careers.append({
                "career":      c["career"],
                "desc":        c["desc"],
                "category":    "general",
                "score":       0,
                "fit":         "Worth exploring",
                "salary_min":  salary["min"],
                "salary_max":  salary["max"],
                "salary_note": salary["note"],
            })

    accessible   = [c for c in top_careers if c["career"] not in hard_careers or pct >= PERCENTAGE_THRESHOLD]
    aspirational = [c for c in top_careers if c["career"] in hard_careers and pct < PERCENTAGE_THRESHOLD]
    for c in aspirational:
        c["fit"] = "Aspirational — needs strong prep"

    final = (accessible + aspirational)[:5]
    dominant_category = sorted_cats[0][0] if sorted_cats else "general"

    return {
        "top_careers":       final,
        "level":             level,
        "dominant_category": dominant_category,
        "percentage":        pct,
    }
