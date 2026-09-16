from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.question_model import Question, QuestionOption

router = APIRouter()

# ── GET QUESTIONS (no auth required) ─────────────────────
@router.get("/")
def get_questions(level: str, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(
        Question.level == level
    ).order_by(Question.order_index).all()

    result = []
    for q in questions:
        result.append({
            "id": q.id,
            "question_text": q.question_text,
            "is_start": q.is_start,
            "options": [
                {
                    "id": opt.id,
                    "option_text": opt.option_text,
                    "category_tag": opt.category_tag,
                    "next_question_id": opt.next_question_id
                }
                for opt in q.options
            ]
        })
    return result