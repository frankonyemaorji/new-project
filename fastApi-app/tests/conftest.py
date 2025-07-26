import os
import pytest
from dotenv import load_dotenv

# Load test environment variables before importing the app
load_dotenv('.env.test')

from app.core.config import Settings
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """Create a test client"""
    return TestClient(app)

@pytest.fixture
def test_settings():
    """Override settings for testing"""
    return Settings(
        DATABASE_URL="sqlite:///./test.db",
        JWT_SECRET="test-secret-key",
        JWT_ALGORITHM="HS256"
    )
