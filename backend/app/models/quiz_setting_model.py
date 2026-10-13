from sqlalchemy import Column, String, Integer
from app.database.base import Base

class QuizSetting(Base):
    __tablename__ = "quiz_settings"

    level = Column(String(20), primary_key=True, index=True)
    question_count = Column(Integer, nullable=False, default=20)