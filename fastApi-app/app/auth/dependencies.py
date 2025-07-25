from fastapi import Request, status, Depends
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from app.auth.utils import decode_token
from fastapi.exceptions import HTTPException
from app.core.redis import token_in_blocklist
from app.core.database import get_session
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from .services import UserService
from typing import List, Optional
from app.models.user import User
import jwt
import uuid


user_service = UserService()


class TokenBearer(HTTPBearer):
    def __init__(self, auto_error=True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> HTTPAuthorizationCredentials | None:
        creds = await super().__call__(request)
        
        if not creds:
            return None

        token = creds.credentials
        token_data = decode_token(token)

        if not self.token_valid(token):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid or expired token",
            )

        if await token_in_blocklist(token_data["jti"]):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token has been revoked",
            )

        self.verify_token_data(token_data)
        return token_data

    def token_valid(self, token: str) -> bool:
        token_data = decode_token(token)
        return token_data is not None

    def verify_token_data(self, token_data):
        raise NotImplementedError("Please override this method in child classes")


class AccessTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and token_data["refresh"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please provide an access token, not a refresh token",
            )


class RefreshTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and not token_data["refresh"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please provide a refresh token, not an access token",
            )


# Create instances of token bearers
access_token_bearer = AccessTokenBearer()
refresh_token_bearer = RefreshTokenBearer()


async def get_current_user(
    token_data: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session)
) -> User:
    """Get current authenticated user from decoded token data"""
    
    try:
        # Extract user ID from token data

        # print all the token data for debugging
        print(token_data)

        user_id: str = token_data.get("user", {}).get("user_uid") or token_data.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials - no user ID in token",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # Convert string UUID to UUID object if needed
        if isinstance(user_id, str):
            user_uuid = uuid.UUID(user_id)
        else:
            user_uuid = user_id
        
    except (ValueError, TypeError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials - invalid user ID: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database using the service
    try:
        user = await user_service.get_user_by_id(user_uuid, session)
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is not verified"
            )
        
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Dependency to ensure user has admin role"""

    print(current_user.role)
    
    if current_user.role != "Admin" :
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin access required."
        )
    
    return current_user


# Optional token bearer that doesn't raise errors for missing tokens
class OptionalTokenBearer(HTTPBearer):
    def __init__(self):
        super().__init__(auto_error=False)

    async def __call__(self, request: Request) -> Optional[dict]:
        try:
            creds = await super().__call__(request)
            
            if not creds:
                return None

            token = creds.credentials
            token_data = decode_token(token)

            if not token_data:
                return None

            # Check if token is in blocklist
            if await token_in_blocklist(token_data["jti"]):
                return None

            # Verify it's an access token
            if token_data.get("refresh"):
                return None

            return token_data
            
        except Exception:
            # If anything fails, just return None (optional auth)
            return None


optional_token_bearer = OptionalTokenBearer()


async def get_current_user_optional(
    token_data: Optional[dict] = Depends(optional_token_bearer),
    session: AsyncSession = Depends(get_session)
) -> Optional[User]:
    """Optional authentication for endpoints that can be accessed by both authenticated and unauthenticated users"""
    
    if not token_data:
        return None
    
    try:
        # Extract user ID from token data
        user_id: str = token_data.get("user", {}).get("uid") or token_data.get("sub")
        
        if user_id is None:
            return None
            
        # Convert string UUID to UUID object if needed
        if isinstance(user_id, str):
            user_uuid = uuid.UUID(user_id)
        else:
            user_uuid = user_id
        
        # Get user from database
        user = await user_service.get_user_by_id(user_uuid, session)
        
        if user is None or not user.is_verified:
            return None
        
        return user
        
    except Exception:
        # If anything fails, return None (optional auth should be forgiving)
        return None
