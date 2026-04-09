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
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id":    current_user.id,
        "name":  current_user.name,
        "email": current_user.email,
    }


# ── POST /users/change-password ───────────────────────────────

@router.post("/change-password")
def change_password(
    body: ChangePasswordRequest,
    db:   Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(body.current_password, current_user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    if body.current_password == body.new_password:
        raise HTTPException(status_code=400, detail="New password must differ from current password.")

    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    current_user.password = hash_password(body.new_password)
    db.commit()
    return {"message": "Password updated successfully."}


# ── POST /users/verify-password ───────────────────────────────
# Used by the Settings re-auth modal to confirm identity
# before showing the change-password form.

@router.post("/verify-password")
def verify_password_endpoint(
    body: VerifyPasswordRequest,
    db:   Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(body.password, current_user.password):
        raise HTTPException(status_code=400, detail="Incorrect password.")
    return {"verified": True}


# ── DELETE /users/me ──────────────────────────────────────────
# Permanently deletes the user account and all their results.
# Frontend sends the JWT in Authorization header as usual.

@router.delete("/me")
def delete_account(
    db:   Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Delete all quiz results first (foreign key safety)
    db.query(Result).filter(Result.user_email == current_user.email).delete()

    # Delete the user
    db.delete(current_user)
    db.commit()

    return {"message": "Account deleted successfully."}