from sqlalchemy import Column, Integer, String, DateTime, func
from app.database.base import Base


class UserActivity(Base):
    __tablename__ = "user_activities"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), index=True, nullable=False)
    action = Column(String(50), nullable=False)
    detail = Column(String(255), nullable=False, default="")
    created_at = Column(DateTime, default=func.now(), index=True)