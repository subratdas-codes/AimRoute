from fastapi import APIRouter, Query
from app.utils.college_engine import suggest_colleges

router = APIRouter(prefix="/colleges", tags=["colleges"])

@router.get("/suggest")
def get_college_suggestions(
    state: str = Query(...),
    percentage: float = Query(...),
    dominant_category: str = Query(...),
    level: str = Query(...)
):
    colleges = suggest_colleges(
        state=state,
        percentage=percentage,
        dominant_category=dominant_category,
        level=level
    )
    return {
        "total": len(colleges),
        "state": state,
        "colleges": colleges
    }