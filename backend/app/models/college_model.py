from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base

class College(Base):
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    career_tag = Column(String(100))
    college_type = Column(String(50))
    cutoff_percentage = Column(Float)
    level = Column(String(50))