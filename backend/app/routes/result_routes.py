from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
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

@router.get("/my")
def get_my_results(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = db.query(Result).filter(Result.user_email == current_user).all()
    return results