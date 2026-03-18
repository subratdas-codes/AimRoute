from fastapi import APIRouter, Depends
from app.utils.dependencies import get_current_user

router = APIRouter(tags=["User"])

@router.get("/profile")
def get_profile(current_user: str = Depends(get_current_user)):
    return {
        "message": "Welcome to CareerLens",
        "logged_in_user": current_user
    }