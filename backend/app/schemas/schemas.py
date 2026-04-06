import datetime

from pydantic import BaseModel, EmailStr


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── User / Profile ────────────────────────────────────────────────────────────

class UserProfileOut(BaseModel):
    bio: str | None = None
    skills: str | None = None
    interests: str | None = None
    education: str | None = None

    model_config = {"from_attributes": True}


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    is_active: bool
    created_at: datetime.datetime
    profile: UserProfileOut | None = None

    model_config = {"from_attributes": True}


class UserProfileUpdate(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    skills: str | None = None
    interests: str | None = None
    education: str | None = None


# ── Assessment ────────────────────────────────────────────────────────────────

class QuestionOut(BaseModel):
    id: int
    question_text: str
    category: str
    order: int

    model_config = {"from_attributes": True}


class AnswerIn(BaseModel):
    question_id: int
    answer_value: int  # 1–5


class AssessmentSubmit(BaseModel):
    answers: list[AnswerIn]


class CareerMatchOut(BaseModel):
    career_domain_id: int
    name: str
    description: str | None = None
    score: int


class AssessmentResultOut(BaseModel):
    assessment_id: int
    completed_at: datetime.datetime
    matches: list[CareerMatchOut]


# ── Career Domain ─────────────────────────────────────────────────────────────

class CareerDomainOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    icon: str | None = None

    model_config = {"from_attributes": True}
