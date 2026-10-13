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


def top_up_extra_questions():
    """Insert any missing extra-bank questions by id (no deletes, safe on prod)."""
    from app.models.question_model import Question, QuestionOption
    from app.utils.question_bank import EXTRA_QUESTIONS

    if not EXTRA_QUESTIONS:
        return 0

    db = SessionLocal()
    try:
        existing_ids = {qid for (qid,) in db.query(Question.id).filter(
            Question.id.in_([q["id"] for q in EXTRA_QUESTIONS])
        ).all()}

        added = 0
        for q_data in EXTRA_QUESTIONS:
            if q_data["id"] in existing_ids:
                continue

            question = Question(
                id=q_data["id"],
                level=q_data["level"],
                question_text=q_data["question_text"],
                order_index=q_data["order_index"],
                is_start=q_data["is_start"]
            )
            db.add(question)
            db.flush()

            for opt in q_data["options"]:
                db.add(QuestionOption(
                    question_id=q_data["id"],
                    option_text=opt["text"],
                    category_tag=opt["tag"],
                    next_question_id=opt["next_id"]
                ))

            existing_ids.add(q_data["id"])
            added += 1

        db.commit()
        if added:
            print(f"Seed check: added {added} extra-bank questions")
        else:
            print("Seed check: extra-bank questions already present")
    except Exception as e:
        print(f"Seed check: top-up skipped ({e})")
        db.rollback()
    finally:
        db.close()


def ensure_quiz_settings():
    from app.models.quiz_setting_model import QuizSetting

    db = SessionLocal()
    try:
        for level in ["10th", "12th", "grad", "pg"]:
            row = db.query(QuizSetting).filter(QuizSetting.level == level).first()
            if not row:
                db.add(QuizSetting(level=level, question_count=20))
        db.commit()
        print("Seed check: quiz settings ready")
    except Exception as e:
        print(f"Seed check: quiz settings skipped ({e})")
        db.rollback()
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
    top_up_extra_questions()
    ensure_quiz_settings()
    ensure_admin_user()
    migrate_user_columns()