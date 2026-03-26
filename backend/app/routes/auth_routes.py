from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.user_model import User
from app.schemas.user_schema import UserCreate
from app.utils.hash import hash_password
from app.utils.email_handler import send_reset_email
from pydantic import BaseModel, EmailStr
import secrets
from datetime import datetime, timedelta

router = APIRouter()

# Temporary in-memory token store
reset_tokens = {}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    safe_password = user.password[:72]
    hashed_pwd = hash_password(safe_password)
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


# ── FORGOT PASSWORD ──────────────────────────────────────
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()

    # Always return same message for security
    if not user:
        return {"message": "If this email is registered, a reset link has been sent."}

    # Generate secure random token
    token = secrets.token_urlsafe(32)

    # Store token with expiry
    reset_tokens[token] = {
        "email": request.email,
        "expires": datetime.utcnow() + timedelta(minutes=30)
    }

    # Reset link pointing to React frontend
    reset_link = f"http://localhost:5173/reset-password?token={token}"

    # Send email
    await send_reset_email(request.email, reset_link)

    return {"message": "If this email is registered, a reset link has been sent."}


# ── RESET PASSWORD ───────────────────────────────────────
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    token_data = reset_tokens.get(request.token)

    if not token_data:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link."
        )

    if datetime.utcnow() > token_data["expires"]:
        del reset_tokens[request.token]
        raise HTTPException(
            status_code=400,
            detail="Reset link has expired. Please request a new one."
        )

    user = db.query(User).filter(
        User.email == token_data["email"]
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Hash and save new password
    user.password = hash_password(request.new_password[:72])
    db.commit()

    # Delete used token
    del reset_tokens[request.token]

    return {"message": "Password reset successful. You can now login."}