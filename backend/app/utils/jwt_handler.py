from datetime import datetime, timedelta
from jose import JWTError, jwt

# Secret key (later you can move this to .env)
SECRET_KEY = "aimroute_super_secret_key"

# Algorithm used to sign token
ALGORITHM = "HS256"

# Token expiry time (60 minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ---------------------------
# Create JWT Token
# ---------------------------
def create_access_token(data: dict):
    """
    Generates JWT token after login
    data will contain: {"sub": user.email}
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # add expiry inside token
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


# ---------------------------
# Verify JWT Token
# ---------------------------
def verify_token(token: str):
    """
    Decodes token and returns user email
    If token invalid/expired -> returns None
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            return None

        return email

    except JWTError:
        return None