import os
import sys

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BACKEND_DIR not in sys.path:
    sys.path.append(BACKEND_DIR)

from app.database.connection import SessionLocal
from app.database.base import Base
from app.database.connection import engine


def seed_questions_if_empty() -> bool:
    from app.models.question_model import Question, QuestionOption

    db = SessionLocal()
    try:
        if db.query(Question).first() is not None:
            print("Seed check: questions already present, skipping")
            return False

        import seed
        seed.seed_questions(db)
        print("Seed check: questions seeded")
        return True
    except Exception as e:
        print(f"Seed check: skipped ({e})")
        return False
    finally:
        db.close()


def ensure_admin_user():
    from app.models.user_model import User
    from app.utils.hash import hash_password

    name = "Admin"
    email = "aimroute.noreply@gmail.com"
    password = "Admin@123"

    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == email).first()
        if admin:
            admin.password = hash_password(password)
            admin.name = name
            db.commit()
        else:
            db.add(User(name=name, email=email, password=hash_password(password)))
            db.commit()
        print("Admin check: admin user ready")
    except Exception as e:
        print(f"Admin check: skipped ({e})")
        db.rollback()
    finally:
        db.close()


def run_bootstrap():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables ready")
    except Exception as e:
        print(f"Database unavailable at startup (API still booting): {e}")
        return

    seed_questions_if_empty()
    ensure_admin_user()