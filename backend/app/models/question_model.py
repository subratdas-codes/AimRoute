from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(20), nullable=False)
    question_text = Column(String(500), nullable=False)
    order_index = Column(Integer, default=0)
    is_start = Column(Boolean, default=False)
    options = relationship("QuestionOption", back_populates="question")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    option_text = Column(String(200), nullable=False)
    category_tag = Column(String(50), nullable=False)
    next_question_id = Column(Integer, nullable=True)
    question = relationship("Question", back_populates="options")