from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.question_model import Question
from app.schemas.quiz_schema import QuizSubmit
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/quiz", tags=["Quiz"])

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------ GET QUESTIONS ------------------
@router.get("/")
def get_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    return questions


# ------------------ SUBMIT QUIZ ------------------
@router.post("/submit")
def submit_quiz(
    quiz: QuizSubmit,
    current_user: str = Depends(get_current_user)
):
    score = 0

    # scoring logic
    for q_id, answer in quiz.answers.items():
        if answer == "A":
            score += 2
        elif answer == "B":
            score += 1

    # career prediction (temporary rule-based)
    if score >= 8:
        career = "Engineering / Technology"
    elif score >= 5:
        career = "Management / Business"
    elif score >= 3:
        career = "Creative Field"
    else:
        career = "Medical / Life Sciences"

    return {
        "user_email": current_user,
        "score": score,
        "recommended_career": career
    }