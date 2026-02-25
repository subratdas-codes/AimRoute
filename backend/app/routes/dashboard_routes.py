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

    # get user
    user = db.query(User).filter(User.email == current_user).first()

    # total attempts
    total_attempts = db.query(func.count(Result.id)).filter(
        Result.user_email == current_user
    ).scalar()

    # latest result
    latest_result = (
        db.query(Result)
        .filter(Result.user_email == current_user)
        .order_by(Result.created_at.desc())
        .first()
    )

    if latest_result:
        latest_score = latest_result.score
        latest_career = latest_result.recommended_career
    else:
        latest_score = None
        latest_career = None

    return {
        "name": user.name,
        "email": user.email,
        "latest_score": latest_score,
        "latest_career": latest_career,
        "total_attempts": total_attempts
    }