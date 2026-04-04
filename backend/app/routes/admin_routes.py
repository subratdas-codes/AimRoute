from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

from app.database.connection import get_db
from app.models.user_model import User
from app.models.question_model import Question, QuestionOption
from app.models.result_model import Result
from app.models.college_model import College
from app.utils.dependencies import get_current_user
from app.utils.hash import hash_password

router = APIRouter(prefix="/admin", tags=["Admin"])


# ─── Admin Guard ─────────────────────────────────────────────────────────────

ADMIN_EMAILS = ["aimroute.noreply@gmail.com"]

def require_admin(current_user=Depends(get_current_user)):
    email = current_user.email if hasattr(current_user, "email") else current_user
    if email not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ─── Schemas ──────────────────────────────────────────────────────────────────

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class QuestionCreate(BaseModel):
    level: str
    question_text: str
    order_index: int
    is_start: bool = False

class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    order_index: Optional[int] = None
    is_start: Optional[bool] = None

class OptionCreate(BaseModel):
    question_id: int
    option_text: str
    category_tag: str
    next_question_id: Optional[int] = None

class OptionUpdate(BaseModel):
    option_text: Optional[str] = None
    category_tag: Optional[str] = None
    next_question_id: Optional[int] = None

class CollegeCreate(BaseModel):
    name: str
    stream: Optional[str] = None
    state: Optional[str] = None
    type: Optional[str] = None
    min_percentage: Optional[float] = None
    medium: Optional[str] = None
    gender: Optional[str] = None
    fees_lpa: Optional[float] = None
    courses: Optional[str] = None
    ranking: Optional[int] = None

class CollegeUpdate(BaseModel):
    name: Optional[str] = None
    stream: Optional[str] = None
    state: Optional[str] = None
    type: Optional[str] = None
    min_percentage: Optional[float] = None
    medium: Optional[str] = None
    gender: Optional[str] = None
    fees_lpa: Optional[float] = None
    courses: Optional[str] = None
    ranking: Optional[int] = None


# ─── Dashboard Stats ──────────────────────────────────────────────────────────

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), admin=Depends(require_admin)):
    total_users = db.query(func.count(User.id)).filter(User.email.notin_(ADMIN_EMAILS)).scalar()
    total_results = db.query(func.count(Result.id)).scalar()
    total_questions = db.query(func.count(Question.id)).scalar()
    total_colleges = db.query(func.count(College.id)).scalar()

    level_breakdown = (
        db.query(Result.level, func.count(Result.id))
        .group_by(Result.level)
        .all()
    )

    top_careers = (
        db.query(Result.top_career, func.count(Result.id).label("count"))
        .group_by(Result.top_career)
        .order_by(desc("count"))
        .limit(5)
        .all()
    )

    recent_users = (
        db.query(User)
        .filter(User.email.notin_(ADMIN_EMAILS))
        .order_by(desc(User.id))
        .limit(5)
        .all()
    )

    return {
        "total_users": total_users,
        "total_results": total_results,
        "total_questions": total_questions,
        "total_colleges": total_colleges,
        "level_breakdown": [{"level": l, "count": c} for l, c in level_breakdown],
        "top_careers": [{"career": c, "count": n} for c, n in top_careers],
        "recent_users": [{"id": u.id, "name": u.name, "email": u.email} for u in recent_users],
    }


# ─── Users CRUD ───────────────────────────────────────────────────────────────

@router.get("/users")
def list_users(
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    query = db.query(User).filter(User.email.notin_(ADMIN_EMAILS))
    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%"))
        )
    total = query.count()
    users = query.order_by(desc(User.id)).offset(skip).limit(limit).all()
    return {
        "total": total,
        "users": [{"id": u.id, "name": u.name, "email": u.email} for u in users]
    }


@router.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    results = db.query(Result).filter(Result.user_email == user.email).all()
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "total_attempts": len(results),
        "results": [
            {"id": r.id, "level": r.level, "top_career": r.top_career,
             "fit_label": r.fit_label, "percentage": r.percentage,
             "created_at": str(r.created_at)}
            for r in results
        ]
    }


@router.post("/users")
def create_user(body: UserCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(name=body.name, email=body.email, password=hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "name": user.name, "email": user.email}


@router.put("/users/{user_id}")
def update_user(user_id: int, body: UserUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if body.name:
        user.name = body.name
    if body.email:
        user.email = body.email
    if body.password:
        user.password = hash_password(body.password)
    db.commit()
    return {"id": user.id, "name": user.name, "email": user.email}


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.query(Result).filter(Result.user_email == user.email).delete()
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


# ─── Questions CRUD ───────────────────────────────────────────────────────────

@router.get("/questions")
def list_questions(
    level: Optional[str] = None,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    query = db.query(Question)
    if level:
        query = query.filter(Question.level == level)
    questions = query.order_by(Question.level, Question.order_index).all()
    result = []
    for q in questions:
        options = db.query(QuestionOption).filter(QuestionOption.question_id == q.id).all()
        result.append({
            "id": q.id,
            "level": q.level,
            "question_text": q.question_text,
            "order_index": q.order_index,
            "is_start": q.is_start,
            "options": [
                {"id": o.id, "option_text": o.option_text,
                 "category_tag": o.category_tag, "next_question_id": o.next_question_id}
                for o in options
            ]
        })
    return result


@router.get("/questions/{question_id}")
def get_question(question_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    options = db.query(QuestionOption).filter(QuestionOption.question_id == q.id).all()
    return {
        "id": q.id, "level": q.level, "question_text": q.question_text,
        "order_index": q.order_index, "is_start": q.is_start,
        "options": [{"id": o.id, "option_text": o.option_text,
                     "category_tag": o.category_tag, "next_question_id": o.next_question_id}
                    for o in options]
    }


@router.post("/questions")
def create_question(body: QuestionCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    q = Question(level=body.level, question_text=body.question_text,
                 order_index=body.order_index, is_start=body.is_start)
    db.add(q)
    db.commit()
    db.refresh(q)
    return {"id": q.id, "level": q.level, "question_text": q.question_text}


@router.put("/questions/{question_id}")
def update_question(question_id: int, body: QuestionUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    if body.question_text is not None:
        q.question_text = body.question_text
    if body.order_index is not None:
        q.order_index = body.order_index
    if body.is_start is not None:
        q.is_start = body.is_start
    db.commit()
    return {"id": q.id, "question_text": q.question_text}


@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    db.query(QuestionOption).filter(QuestionOption.question_id == question_id).delete()
    db.delete(q)
    db.commit()
    return {"message": "Question deleted"}


# ─── Options CRUD ─────────────────────────────────────────────────────────────

@router.post("/options")
def create_option(body: OptionCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    opt = QuestionOption(question_id=body.question_id, option_text=body.option_text,
                         category_tag=body.category_tag, next_question_id=body.next_question_id)
    db.add(opt)
    db.commit()
    db.refresh(opt)
    return {"id": opt.id, "option_text": opt.option_text}


@router.put("/options/{option_id}")
def update_option(option_id: int, body: OptionUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    opt = db.query(QuestionOption).filter(QuestionOption.id == option_id).first()
    if not opt:
        raise HTTPException(status_code=404, detail="Option not found")
    if body.option_text is not None:
        opt.option_text = body.option_text
    if body.category_tag is not None:
        opt.category_tag = body.category_tag
    if body.next_question_id is not None:
        opt.next_question_id = body.next_question_id
    db.commit()
    return {"id": opt.id, "option_text": opt.option_text}


@router.delete("/options/{option_id}")
def delete_option(option_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    opt = db.query(QuestionOption).filter(QuestionOption.id == option_id).first()
    if not opt:
        raise HTTPException(status_code=404, detail="Option not found")
    db.delete(opt)
    db.commit()
    return {"message": "Option deleted"}


# ─── Results CRUD ─────────────────────────────────────────────────────────────

@router.get("/results")
def list_results(
    skip: int = 0,
    limit: int = 20,
    level: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    query = db.query(Result)
    if level:
        query = query.filter(Result.level == level)
    if search:
        query = query.filter(
            (Result.user_email.ilike(f"%{search}%")) | (Result.top_career.ilike(f"%{search}%"))
        )
    total = query.count()
    results = query.order_by(desc(Result.created_at)).offset(skip).limit(limit).all()
    return {
        "total": total,
        "results": [
            {
                "id": r.id, "user_email": r.user_email, "level": r.level,
                "top_career": r.top_career, "fit_label": r.fit_label,
                "dominant_category": r.dominant_category, "percentage": r.percentage,
                "created_at": str(r.created_at)
            }
            for r in results
        ]
    }


@router.get("/results/grouped")
def list_results_grouped(
    level: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    query = db.query(Result)
    if level:
        query = query.filter(Result.level == level)
    if search:
        query = query.filter(
            (Result.user_email.ilike(f"%{search}%")) | (Result.top_career.ilike(f"%{search}%"))
        )

    all_results = query.order_by(desc(Result.created_at)).all()

    grouped = {}
    for r in all_results:
        email = r.user_email
        if email not in grouped:
            grouped[email] = {
                "user_email": email,
                "attempt_count": 0,
                "latest_career": r.top_career,
                "latest_level": r.level,
                "latest_date": str(r.created_at),
                "attempts": []
            }
        grouped[email]["attempt_count"] += 1
        grouped[email]["attempts"].append({
            "id": r.id,
            "level": r.level,
            "top_career": r.top_career,
            "fit_label": r.fit_label,
            "dominant_category": r.dominant_category,
            "percentage": r.percentage,
            "created_at": str(r.created_at)
        })

    users = list(grouped.values())
    return {
        "total_users": len(users),
        "users": users
    }


@router.delete("/results/{result_id}")
def delete_result(result_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    r = db.query(Result).filter(Result.id == result_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Result not found")
    db.delete(r)
    db.commit()
    return {"message": "Result deleted"}


# ─── Colleges CRUD ────────────────────────────────────────────────────────────

@router.get("/colleges")
def list_colleges(
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    query = db.query(College)
    if search:
        query = query.filter(
            (College.name.ilike(f"%{search}%")) | (College.state.ilike(f"%{search}%"))
        )
    total = query.count()
    colleges = query.offset(skip).limit(limit).all()
    return {
        "total": total,
        "colleges": [
            {
                "id": c.id, "name": c.name, "stream": c.stream, "state": c.state,
                "type": c.type, "min_percentage": c.min_percentage, "medium": c.medium,
                "gender": c.gender, "fees_lpa": c.fees_lpa, "ranking": c.ranking
            }
            for c in colleges
        ]
    }


@router.get("/colleges/{college_id}")
def get_college(college_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    c = db.query(College).filter(College.id == college_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="College not found")
    return {
        "id": c.id, "name": c.name, "stream": c.stream, "state": c.state,
        "type": c.type, "min_percentage": c.min_percentage, "medium": c.medium,
        "gender": c.gender, "fees_lpa": c.fees_lpa, "courses": c.courses, "ranking": c.ranking
    }


@router.post("/colleges")
def create_college(body: CollegeCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    c = College(**body.dict())
    db.add(c)
    db.commit()
    db.refresh(c)
    return {"id": c.id, "name": c.name}


@router.put("/colleges/{college_id}")
def update_college(college_id: int, body: CollegeUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    c = db.query(College).filter(College.id == college_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="College not found")
    for field, value in body.dict(exclude_none=True).items():
        setattr(c, field, value)
    db.commit()
    return {"id": c.id, "name": c.name}


@router.delete("/colleges/{college_id}")
def delete_college(college_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    c = db.query(College).filter(College.id == college_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="College not found")
    db.delete(c)
    db.commit()
    return {"message": "College deleted"}