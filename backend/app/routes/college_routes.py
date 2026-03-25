from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.college_model import College

router = APIRouter(prefix="/colleges", tags=["Colleges"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_colleges(
    career: str = Query(...),
    state: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(College).filter(College.career_tag == career)

    if state and state != "All States":
        query = query.filter(College.state == state)

    colleges = query.order_by(College.cutoff_percentage.desc()).all()

    return [
        {
            "name": c.name,
            "city": c.city,
            "state": c.state,
            "college_type": c.college_type,
            "cutoff_percentage": c.cutoff_percentage,
        }
        for c in colleges
    ]