from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user_model import User
from app.schemas.user_schema import UserCreate
from app.utils.hash import hash_password
from app.utils.email_handler import send_reset_email_background
from app.utils.activity import log_activity
from pydantic import BaseModel, EmailStr
import secrets
import os
from datetime import datetime, timedelta

router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://aimroute.vercel.app")

reset_tokens = {}

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=409, detail="Email already registered. Please login instead.")
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
    log_activity(db, new_user.email, "register", "Account created")
    return {"message": "User registered successfully"}


# ── FORGOT PASSWORD ──────────────────────────────────────
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        return {"message": "If this email is registered, a reset link has been sent."}

    token = secrets.token_urlsafe(32)
    reset_tokens[token] = {
        "email": request.email,
        "expires": datetime.utcnow() + timedelta(minutes=30)
    }

    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"
    send_reset_email_background(request.email, reset_link)

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
        raise HTTPException(status_code=400, detail="Invalid or expired reset link.")

    if datetime.utcnow() > token_data["expires"]:
        del reset_tokens[request.token]
        raise HTTPException(status_code=400, detail="Reset link has expired. Please request a new one.")

    user = db.query(User).filter(User.email == token_data["email"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.password = hash_password(request.new_password[:72])
    db.commit()
    del reset_tokens[request.token]

    return {"message": "Password reset successful. You can now login."}