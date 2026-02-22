from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.question_model import Question

router = APIRouter(prefix="/quiz", tags=["Quiz"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    return questions