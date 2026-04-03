import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal
from app.models.user_model import User
from app.utils.hash import hash_password  # ← use passlib, not raw bcrypt

ADMIN_NAME     = "Admin"
ADMIN_EMAIL    = "aimroute.noreply@gmail.com"
ADMIN_PASSWORD = "Admin@123"

def create_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if existing:
            existing.password = hash_password(ADMIN_PASSWORD)
            existing.name = ADMIN_NAME
            db.commit()
            print(f"✅ Admin password updated: {ADMIN_EMAIL}")
        else:
            admin = User(name=ADMIN_NAME, email=ADMIN_EMAIL, password=hash_password(ADMIN_PASSWORD))
            db.add(admin)
            db.commit()
            print(f"✅ Admin user created: {ADMIN_EMAIL}")
        print(f"🔑 Password: {ADMIN_PASSWORD}")
        print(f"👉 Go to: http://localhost:5173/admin-login")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()