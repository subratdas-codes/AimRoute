from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, UserProfile
from app.schemas.schemas import UserOut, UserProfileUpdate
from app.utils.deps import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_me(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.full_name is not None:
        current_user.full_name = payload.full_name

    profile = current_user.profile
    if profile is None:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    for field in ("bio", "skills", "interests", "education"):
        value = getattr(payload, field)
        if value is not None:
            setattr(profile, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user
