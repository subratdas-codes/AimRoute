from datetime import datetime

from app.models.activity_model import UserActivity


def log_activity(db, email: str, action: str, detail: str = ""):
    try:
        db.add(
            UserActivity(
                email=email,
                action=action,
                detail=detail,
                created_at=datetime.utcnow(),
            )
        )
        db.commit()
    except Exception:
        db.rollback()