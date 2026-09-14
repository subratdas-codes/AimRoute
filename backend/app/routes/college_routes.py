from fastapi import APIRouter, Query
from app.utils.college_engine import suggest_colleges

router = APIRouter(prefix="/colleges", tags=["colleges"])

@router.get("/suggest")
def get_college_suggestions(
    state: str = Query(...),
    percentage: float = Query(...),
    dominant_category: str = Query(...),
    level: str = Query(...),
    medium: str = Query(None),
    gender: str = Query(None),
):
    colleges = suggest_colleges(
        state=state,
        percentage=percentage,
        dominant_category=dominant_category,
        level=level,
        medium=medium,
        gender=gender,
    )
    return {
        "total": len(colleges),
        "state": state,
        "colleges": colleges
    }