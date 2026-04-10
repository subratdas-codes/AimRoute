from fastapi              import APIRouter, Depends, HTTPException
from sqlalchemy.orm       import Session
from pydantic             import BaseModel

from app.database.connection import get_db
from app.models.user_model   import User
from app.models.result_model import Result
from app.utils.hash          import verify_password, hash_password
from app.utils.dependencies  import get_current_user

router = APIRouter(prefix="/users", tags=["User"])


# ── Schemas ───────────────────────────────────────────────────

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password:     str

class VerifyPasswordRequest(BaseModel):
    password: str


# ── GET /users/me ─────────────────────────────────────────────

@router.get("/me")
def get_me(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id":    user.id,
        "name":  user.name,
        "email": user.email,
    }


# ── POST /users/change-password ───────────────────────────────

@router.post("/change-password")
def change_password(
    body: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(body.current_password, user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    if body.current_password == body.new_password:
        raise HTTPException(status_code=400, detail="New password must differ from current password.")

    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    user.password = hash_password(body.new_password)
    db.commit()
    return {"message": "Password updated successfully."}


# ── POST /users/verify-password ───────────────────────────────

@router.post("/verify-password")
def verify_password_endpoint(
    body: VerifyPasswordRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(body.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect password.")

    return {"verified": True}


# ── DELETE /users/me ──────────────────────────────────────────

@router.delete("/me")
def delete_account(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.query(Result).filter(Result.user_email == user.email).delete()
    db.delete(user)
    db.commit()

    return {"message": "Account deleted successfully."}