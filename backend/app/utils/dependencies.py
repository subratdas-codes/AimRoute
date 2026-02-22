from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt_handler import verify_token

# This tells FastAPI to expect a Bearer Token
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    email = verify_token(token)

    if email is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return email