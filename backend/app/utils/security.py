import datetime

import bcrypt
from jose import JWTError, jwt

from app.config import settings

_ENCODING = "utf-8"


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(_ENCODING), bcrypt.gensalt()).decode(_ENCODING)


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(_ENCODING), hashed.encode(_ENCODING))


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
