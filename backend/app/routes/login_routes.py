from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.user_model import User
from app.utils.hash import verify_password
from app.utils.jwt_handler import create_access_token
from app.schemas.login_schema import LoginRequest

router = APIRouter()

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    # find user
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # verify password
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # create token
    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "name": user.name
    }