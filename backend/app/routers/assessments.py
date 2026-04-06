from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import (
    AssessmentAnswer,
    AssessmentQuestion,
    CareerDomain,
    CareerMatch,
    User,
    UserAssessment,
)
from app.schemas.schemas import (
    AssessmentResultOut,
    AssessmentSubmit,
    CareerDomainOut,
    CareerMatchOut,
    QuestionOut,
)
from app.utils.deps import get_current_user

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


@router.get("/questions", response_model=list[QuestionOut])
def get_questions(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return db.query(AssessmentQuestion).order_by(AssessmentQuestion.order).all()


@router.post("/submit", response_model=AssessmentResultOut, status_code=status.HTTP_201_CREATED)
def submit_assessment(
    payload: AssessmentSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not payload.answers:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No answers provided")

    assessment = UserAssessment(user_id=current_user.id)
    db.add(assessment)
    db.flush()

    domain_scores: dict[str, int] = {}
    for ans in payload.answers:
        question = db.get(AssessmentQuestion, ans.question_id)
        if question is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Question {ans.question_id} not found",
            )
        if not (1 <= ans.answer_value <= 5):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"answer_value must be between 1 and 5 (question {ans.question_id})",
            )
        db.add(AssessmentAnswer(
            assessment_id=assessment.id,
            question_id=ans.question_id,
            answer_value=ans.answer_value,
        ))
        domain_scores[question.category] = (
            domain_scores.get(question.category, 0) + ans.answer_value
        )

    # Map category totals → career domains (by matching domain name to category)
    matches: list[CareerMatchOut] = []
    for category, score in domain_scores.items():
        domain = db.query(CareerDomain).filter(CareerDomain.name == category).first()
        if domain:
            db.add(CareerMatch(
                assessment_id=assessment.id,
                career_domain_id=domain.id,
                score=score,
            ))
            matches.append(CareerMatchOut(
                career_domain_id=domain.id,
                name=domain.name,
                description=domain.description,
                score=score,
            ))

    db.commit()
    db.refresh(assessment)

    return AssessmentResultOut(
        assessment_id=assessment.id,
        completed_at=assessment.completed_at,
        matches=sorted(matches, key=lambda m: m.score, reverse=True),
    )


@router.get("/results", response_model=list[AssessmentResultOut])
def get_results(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    assessments = (
        db.query(UserAssessment)
        .filter(UserAssessment.user_id == current_user.id)
        .order_by(UserAssessment.completed_at.desc())
        .all()
    )
    results = []
    for assessment in assessments:
        matches = [
            CareerMatchOut(
                career_domain_id=m.career_domain_id,
                name=m.career_domain.name,
                description=m.career_domain.description,
                score=m.score,
            )
            for m in sorted(assessment.matches, key=lambda m: m.score, reverse=True)
        ]
        results.append(AssessmentResultOut(
            assessment_id=assessment.id,
            completed_at=assessment.completed_at,
            matches=matches,
        ))
    return results


careers_router = APIRouter(prefix="/api/careers", tags=["careers"])


@careers_router.get("", response_model=list[CareerDomainOut])
def list_careers(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return db.query(CareerDomain).order_by(CareerDomain.name).all()
