import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession

# Import your app and dependencies
from app.main import app
from app.core.database import get_session, async_engine
from app.models.user import User
from app.models.university import University


# Test database URL (use SQLite for testing)
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=True,
    pool_pre_ping=True
)

test_session_maker = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_test_session():
    """Override for test database session"""
    async with test_session_maker() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def setup_database():
    """Create test database tables"""
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    # Cleanup after tests
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


@pytest.fixture
def client(setup_database):
    """Create test client with database override"""
    app.dependency_overrides[get_session] = get_test_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


class TestBasicEndpoints:
    """Test basic endpoints that don't require authentication"""
    
    def test_university_types_enum(self, client):
        """Test getting university types"""
        response = client.get("/universities/enums/types")
        assert response.status_code == 200
        data = response.json()
        assert "university_types" in data
        assert isinstance(data["university_types"], list)
    
    def test_rankings_enum(self, client):
        """Test getting rankings"""
        response = client.get("/universities/enums/rankings")
        assert response.status_code == 200
        data = response.json()
        assert "rankings" in data
        assert isinstance(data["rankings"], list)
    
    def test_get_universities_empty(self, client):
        """Test getting universities when database is empty"""
        response = client.get("/universities/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0  # Should be empty initially


class TestAuthentication:
    """Test authentication endpoints"""
    
    def test_register_user(self, client):
        """Test user registration"""
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User", 
            "password": "testpassword123"
        }
        response = client.post("/auth/signup", json=user_data)
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["username"] == "testuser"
        assert "password" not in data  # Password should not be returned
    
    def test_login_user(self, client):
        """Test user login"""
        # First register a user
        user_data = {
            "username": "loginuser",
            "email": "login@example.com",
            "first_name": "Login",
            "last_name": "User",
            "password": "loginpass123"
        }
        client.post("/auth/signup", json=user_data)
        
        # Then try to login
        login_data = {
            "email": "login@example.com",
            "password": "loginpass123"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "Bearer"
    
    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 400
    
    def test_get_current_user_without_token(self, client):
        """Test accessing protected endpoint without token"""
        response = client.get("/auth/me")
        assert response.status_code == 403  # Should be forbidden


class TestUniversityEndpoints:
    """Test university-related endpoints"""
    
    def test_get_universities_with_pagination(self, client):
        """Test pagination parameters"""
        response = client.get("/universities/?skip=0&limit=5")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_universities_with_filters(self, client):
        """Test filtering parameters"""
        response = client.get("/universities/?country=USA&offers_scholarships=true")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_nonexistent_university(self, client):
        """Test getting a university that doesn't exist"""
        import uuid
        fake_id = str(uuid.uuid4())
        response = client.get(f"/universities/{fake_id}")
        assert response.status_code == 404


class TestAuthenticatedEndpoints:
    """Test endpoints that require authentication"""
    
    @pytest.fixture
    def auth_headers(self, client):
        """Create a user and return auth headers"""
        # Register user
        user_data = {
            "username": "authuser",
            "email": "auth@example.com", 
            "first_name": "Auth",
            "last_name": "User",
            "password": "authpass123"
        }
        client.post("/auth/signup", json=user_data)
        
        # Login to get token
        login_data = {
            "email": "auth@example.com",
            "password": "authpass123"
        }
        response = client.post("/auth/login", json=login_data)
        token = response.json()["access_token"]
        
        return {"Authorization": f"Bearer {token}"}
    
    def test_get_current_user_with_token(self, client, auth_headers):
        """Test getting current user with valid token"""
        response = client.get("/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "auth@example.com"
        assert data["username"] == "authuser"


class TestDatabaseConnection:
    """Test database connection and async operations"""
    
    @pytest.mark.asyncio
    async def test_database_session(self):
        """Test that database session works"""
        async with test_session_maker() as session:
            # Simple query to test connection
            from sqlmodel import select
            statement = select(User)
            result = await session.exec(statement)
            users = result.all()
            assert isinstance(users, list)


# Run specific tests
if __name__ == "__main__":
    pytest.main(["-v", __file__])
