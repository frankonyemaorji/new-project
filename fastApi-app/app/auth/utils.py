from datetime import datetime, timedelta
import logging
import uuid
import jwt
from passlib.context import CryptContext
from app.core.config import settings as Config


passwd_context = CryptContext(schemes=["bcrypt"])

ACCESS_TOKEN_EXPIRY = 18000  # 5 hours in seconds


def generate_passwd_hash(password: str) -> str:
    hash = passwd_context.hash(password)

    return hash


async def verify_password(password: str, hash: str) -> bool:
    return passwd_context.verify(password, hash)


def create_access_token(
    user_data: dict, expiry: timedelta = None, refresh: bool = False
):
    payload = {}

    payload["user"] = user_data
    payload["exp"] = datetime.now() + (
        expiry if expiry is not None else timedelta(seconds=ACCESS_TOKEN_EXPIRY)
    )
    payload["jti"] = str(uuid.uuid4())

    payload["refresh"] = refresh

    token = jwt.encode(
        payload=payload, key=Config.JWT_SECRET, algorithm=Config.JWT_ALGORITHM
    )

    return token


def decode_token(token: str) -> str:
    try:
        token_data = jwt.decode(
            token, key=Config.JWT_SECRET, algorithms=[Config.JWT_ALGORITHM]
        )

        return token_data
    except jwt.PyJWTError as e:
        # logging.exception(e)
        return None
