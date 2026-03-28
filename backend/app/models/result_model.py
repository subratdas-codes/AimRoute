from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from app.database.base import Base

class Result(Base):
    __tablename__ = "results"

    id                  = Column(Integer, primary_key=True, index=True)
    user_email          = Column(String(255), index=True)
    level               = Column(String(20))           # "10th", "12th", "grad", "pg"
    top_career          = Column(String(255))          # best match career name
    fit_label           = Column(String(100))          # "Excellent fit" etc
    dominant_category   = Column(String(100))          # "Technology", "Business" etc
    percentage          = Column(Float, default=0.0)   # student's last exam %
    reasons             = Column(Text)                 # comma-separated quiz answers
    all_careers         = Column(Text)                 # JSON string of top 5 careers
    created_at          = Column(DateTime, default=datetime.utcnow)