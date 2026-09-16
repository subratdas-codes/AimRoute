from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database.connection import get_db
from app.models.user_model import User
from app.utils.hash import verify_password
from app.utils.jwt_handler import create_access_token
from app.utils.activity import log_activity
from app.schemas.login_schema import LoginRequest

router = APIRouter()


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    # find user
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # verify password
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # block banned users
    if user.is_banned:
        raise HTTPException(status_code=403, detail="Your account has been suspended. Contact support.")

    # record last login + activity
    user.last_login = datetime.utcnow()
    db.commit()
    log_activity(db, user.email, "login", "Logged in")

    # create token
    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "name": user.name
    }