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


def migrate_user_columns():
    from sqlalchemy import text

    db = SessionLocal()
    try:
        existing = set()
        if engine.dialect.name == "postgresql":
            rows = db.execute(text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name = 'users'"
            )).fetchall()
            existing = {r[0] for r in rows}
            types = {
                "is_banned": "BOOLEAN NOT NULL DEFAULT FALSE",
                "last_login": "TIMESTAMP NULL",
                "created_at": "TIMESTAMP NULL",
            }
            for col, ddl in types.items():
                if col not in existing:
                    db.execute(text(f"ALTER TABLE users ADD COLUMN {col} {ddl}"))
        elif engine.dialect.name.startswith("mysql"):
            rows = db.execute(text("SHOW COLUMNS FROM users")).fetchall()
            existing = {r[0] for r in rows}
            types = {
                "is_banned": "BOOLEAN NOT NULL DEFAULT 0",
                "last_login": "DATETIME NULL",
                "created_at": "DATETIME NULL",
            }
            for col, ddl in types.items():
                if col not in existing:
                    db.execute(text(f"ALTER TABLE users ADD COLUMN {col} {ddl}"))
        else:
            rows = db.execute(text("PRAGMA table_info(users)")).fetchall()
            existing = {r[1] for r in rows}
            for col in ("is_banned", "last_login", "created_at"):
                if col not in existing:
                    db.execute(text(f"ALTER TABLE users ADD COLUMN {col} BOOLEAN NULL"))

        db.commit()
        print("Migration: users table columns ready")
    except Exception as e:
        print(f"Migration: skipped ({e})")
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
    migrate_user_columns()