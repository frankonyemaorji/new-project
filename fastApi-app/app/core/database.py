from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from app.core.config import settings as Config

# Create the async engine with proper connection handling
async_engine = create_async_engine(
    url=Config.DATABASE_URL,
    echo=True,  # Set to False in production
    
    # Connection pool settings - these are crucial for fixing your issue
    pool_size=10,                # Number of connections to maintain in pool
    max_overflow=20,             # Additional connections beyond pool_size
    pool_pre_ping=True,          # Test connections before use (FIXES YOUR ISSUE!)
    pool_recycle=300,            # Recycle connections every 5 minutes (300 seconds)
    pool_timeout=30,             # Timeout when getting connection from pool
    
    # Additional connection handling
    connect_args={
        "server_settings": {
            "application_name": "fastapi_app",
        }
    }
)

# Create session factory using the new async_sessionmaker
async_session_maker = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncSession:
    """
    Dependency function to get database session
    """
    async with async_session_maker() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# Alternative session dependency with retry logic
async def get_session_with_retry() -> AsyncSession:
    """
    Session dependency with connection retry logic
    """
    import asyncio
    from sqlalchemy.exc import InterfaceError
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            async with async_session_maker() as session:
                yield session
                break
        except InterfaceError as e:
            if "connection is closed" in str(e) and attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
                continue
            raise
        except Exception:
            raise