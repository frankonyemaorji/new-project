import asyncio
import uuid
from sqlmodel import select
from app.models.user import User
from app.auth.schemas import UserCreateModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.exc import InterfaceError
from .utils import generate_passwd_hash


class UserService:
    async def get_user_by_email(self, email: str, session: AsyncSession, max_retries: int = 3):
        for attempt in range(max_retries):
            try:
                statement = select(User).where(User.email == email)
                result = await session.exec(statement)
                user = result.first()
                return user
            except InterfaceError as e:
                if "connection is closed" in str(e) and attempt < max_retries - 1:
                    # Wait before retry with exponential backoff
                    await asyncio.sleep(2 ** attempt)
                    continue
                raise
            except Exception:
                # Re-raise other exceptions immediately
                raise

    async def get_user_by_id(self, user_id: uuid.UUID, session: AsyncSession, max_retries: int = 3):
        for attempt in range(max_retries):
            try:
                statement = select(User).where(User.uid == user_id)
                result = await session.exec(statement)
                user = result.first()
                return user
            except InterfaceError as e:
                if "connection is closed" in str(e) and attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
                    continue
                raise
            except Exception:
                raise

    async def user_exists(self, email: str, session: AsyncSession):
        user = await self.get_user_by_email(email, session)
        return True if user is not None else False

    async def create_user(self, user_data: UserCreateModel, session: AsyncSession, max_retries: int = 3):
        for attempt in range(max_retries):
            try:
                user_data_dict = user_data.model_dump()
                new_user = User(**user_data_dict)
                new_user.password_hash = generate_passwd_hash(user_data_dict["password"])
                
                session.add(new_user)
                await session.commit()
                return new_user
            except InterfaceError as e:
                if "connection is closed" in str(e) and attempt < max_retries - 1:
                    await session.rollback()
                    await asyncio.sleep(2 ** attempt)
                    continue
                raise
            except Exception:
                await session.rollback()
                raise