from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from app.database.base import Base

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255))
    score = Column(Integer)
    recommended_career = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)