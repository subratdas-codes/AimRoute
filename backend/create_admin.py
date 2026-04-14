import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal
from app.models.user_model import User
from app.utils.hash import hash_password

ADMIN_NAME     = "Admin"
ADMIN_EMAIL    = "aimroute.noreply@gmail.com"
ADMIN_PASSWORD = "Admin@123"
ADMIN_URL      = ADMIN_URL = "https://aimroute-live-drab.vercel.app/admin-login"   
# "http://localhost:5173/admin-login"

def create_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if existing:
            existing.password = hash_password(ADMIN_PASSWORD)
            existing.name = ADMIN_NAME
            db.commit()
            print(f"✅ Admin password updated!")
        else:
            admin = User(name=ADMIN_NAME, email=ADMIN_EMAIL, password=hash_password(ADMIN_PASSWORD))
            db.add(admin)
            db.commit()
            print(f"✅ Admin user created!")

        print(f"")
        print(f"📧 Email    : {ADMIN_EMAIL}")
        print(f"🔑 Password : {ADMIN_PASSWORD}")
        print(f"🌐 Login URL: {ADMIN_URL}")
        print(f"")
        print(f"👆 Ctrl + Click the URL to open in browser")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()