from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.question_model import Question
from app.models.result_model import Result
from app.schemas.quiz_schema import QuizSubmit
from app.utils.dependencies import get_current_user
import numpy as np
import pickle
from pathlib import Path

router = APIRouter(prefix="/quiz", tags=["Quiz"])

# Load ML model once
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
MODEL_PATH = BASE_DIR / "mlmodel" / "model.pkl"
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

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

@router.post("/submit")
def submit_quiz(
    quiz: QuizSubmit,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Convert answers to skill scores
    # Each answer maps to a skill — you define this mapping
    skill_scores = {
        "Python": 0, "SQL": 0, "HTML": 0, "CSS": 0,
        "Java": 0, "Communication": 0, "Logic": 0, "Math": 0
    }

    # Map each question answer to a skill score
    # Adjust this mapping based on your actual questions
    answer_to_skill = {
        "q1": {"A": "Math", "B": "Communication"},
        "q2": {"A": "Python", "B": "HTML"},
        "q3": {"A": "Logic", "B": "Communication"},
        "q4": {"A": "SQL", "B": "CSS"},
        "q5": {"A": "Java", "B": "HTML"},
        "q6": {"A": "Math", "B": "SQL"},
        "q7": {"A": "Logic", "B": "Python"},
        "q8": {"A": "Communication", "B": "CSS"},
    }

    for q_id, answer in quiz.answers.items():
        if q_id in answer_to_skill:
            skill = answer_to_skill[q_id].get(answer)
            if skill:
                skill_scores[skill] += 1

    # Send to ML model
    input_data = np.array([[
        skill_scores["Python"],
        skill_scores["SQL"],
        skill_scores["HTML"],
        skill_scores["CSS"],
        skill_scores["Java"],
        skill_scores["Communication"],
        skill_scores["Logic"],
        skill_scores["Math"]
    ]])

    probabilities = model.predict_proba(input_data)[0]
    classes = model.classes_
    top_indices = np.argsort(probabilities)[-3:][::-1]

    top_careers = []
    for i in top_indices:
        top_careers.append({
            "career": classes[i],
            "confidence": f"{round(probabilities[i]*100, 2)}%"
        })

    # Save top career to database
    new_result = Result(
        user_email=current_user,
        score=int(sum(skill_scores.values())),
        recommended_career=top_careers[0]["career"]
    )
    db.add(new_result)
    db.commit()

    return {
        "user_email": current_user,
        "top_careers": top_careers,
        "skill_scores": skill_scores
    }