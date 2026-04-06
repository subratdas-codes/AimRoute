import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    profile: Mapped["UserProfile"] = relationship("UserProfile", back_populates="user", uselist=False)
    assessments: Mapped[list["UserAssessment"]] = relationship("UserAssessment", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    bio: Mapped[str | None] = mapped_column(Text)
    skills: Mapped[str | None] = mapped_column(Text)
    interests: Mapped[str | None] = mapped_column(Text)
    education: Mapped[str | None] = mapped_column(String(255))

    user: Mapped["User"] = relationship("User", back_populates="profile")


class CareerDomain(Base):
    __tablename__ = "career_domains"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    icon: Mapped[str | None] = mapped_column(String(50))

    matches: Mapped[list["CareerMatch"]] = relationship("CareerMatch", back_populates="career_domain")


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(80))
    order: Mapped[int] = mapped_column(Integer, default=0)

    answers: Mapped[list["AssessmentAnswer"]] = relationship("AssessmentAnswer", back_populates="question")


class UserAssessment(Base):
    __tablename__ = "user_assessments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    completed_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="assessments")
    answers: Mapped[list["AssessmentAnswer"]] = relationship("AssessmentAnswer", back_populates="assessment")
    matches: Mapped[list["CareerMatch"]] = relationship("CareerMatch", back_populates="assessment")


class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    assessment_id: Mapped[int] = mapped_column(Integer, ForeignKey("user_assessments.id", ondelete="CASCADE"))
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("assessment_questions.id", ondelete="CASCADE"))
    answer_value: Mapped[int] = mapped_column(Integer)  # 1–5 Likert scale

    assessment: Mapped["UserAssessment"] = relationship("UserAssessment", back_populates="answers")
    question: Mapped["AssessmentQuestion"] = relationship("AssessmentQuestion", back_populates="answers")


class CareerMatch(Base):
    __tablename__ = "career_matches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    assessment_id: Mapped[int] = mapped_column(Integer, ForeignKey("user_assessments.id", ondelete="CASCADE"))
    career_domain_id: Mapped[int] = mapped_column(Integer, ForeignKey("career_domains.id", ondelete="CASCADE"))
    score: Mapped[int] = mapped_column(Integer)

    assessment: Mapped["UserAssessment"] = relationship("UserAssessment", back_populates="matches")
    career_domain: Mapped["CareerDomain"] = relationship("CareerDomain", back_populates="matches")
