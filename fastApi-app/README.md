# FastAPI Application

A modern, fast (high-performance) web API built with FastAPI for Python 3.7+.

## Prerequisites

- Python 3.7+
- pip (Python package manager)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd new-project/fastApi-app
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On macOS/Linux
   # or
   .venv\Scripts\activate     # On Windows
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Quick Start

1. **Activate your virtual environment** (if not already active):
   ```bash
   source .venv/bin/activate
   ```

2. **Run the development server**:
   ```bash
   uvicorn main:app --reload
   ```

3. **Open your browser** and navigate to:
   - API: http://localhost:8000
   - Interactive API docs: http://localhost:8000/docs
   - Alternative API docs: http://localhost:8000/redoc

## Project Structure

```
project_root/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI entry point
│   ├── core/                   # Centralized config and utilities
│   │   ├── __init__.py
│   │   ├── config.py           # Environment variables and settings
│   │   ├── database.py         # Database connection setup
│   │   └── security.py         # Authentication utilities
│   ├── models/                 # Centralized SQLModel models
│   │   ├── __init__.py
│   │   ├── user.py             # User model
│   │   └── others.py           # any other model, just create a model file
│   ├── auth/                   # Authentication domain
│   │   ├── __init__.py
│   │   ├── routes.py           # Auth routes (e.g., /v1/auth/login)
│   │   ├── schemas.py          # Auth Pydantic schemas
│   │   └── services.py         # Auth business logic
│   ├── example/             # otehr application domain folders
│   │   ├── __init__.py
│   │   ├── routes.py           # routes (e.g., /v1/example/papers)
│   │   ├── schemas.py          # Pydantic schemas
│   │   └── services.py         # business logic
├── tests/                      # Unit and integration tests
│   ├── __init__.py
│   └── test_main.py
├── .env                        # Environment variables
├── requirements.txt            # Dependencies
└── README.md                   # Documentation
```

## Application Configuration

### How the App is Structured

The FastAPI application follows a **domain-driven design** with clear separation of concerns:

1. **Core Layer** (`app/core/`): Contains shared utilities and configuration
   - `config.py`: Centralizes all environment variables and app settings
   - `database.py`: Handles database connections and session management
   - `redis.py`: Manages Redis connections for token blacklisting

2. **Models Layer** (`app/models/`): SQLModel database models
   - Each model file represents a database table
   - Models are imported by services for database operations

3. **Domain Layers** (`app/auth/`, `app/example/`): Business logic organized by feature
   - `routes.py`: API endpoints and HTTP handling
   - `services.py`: Business logic and database operations
   - `schemas.py`: Request/response data validation with Pydantic
   - `dependencies.py`: Reusable dependency injection functions

### How Everything Connects

```
Request → Route → Schema (validation) → Service (business logic) → Model (database)
                     ↓
              Dependencies (auth, DB session)
```

**Example Flow:**
1. User hits `/api/v1/auth/login` endpoint
2. Route validates input using `UserLoginModel` schema
3. Route calls `UserService` with validated data
4. Service queries database using `User` model
5. Response is serialized using `UserModel` schema

## Authentication System

### Overview

The authentication system uses **JWT tokens** with the following features:
- Access tokens (short-lived, 15 minutes)
- Refresh tokens (long-lived, 2 days)
- Token blacklisting for secure logout
- Role-based access control

### Key Components

#### 1. JWT Utilities (`app/auth/utils.py`)

**`create_access_token()`**: Creates JWT tokens
```python
# Create access token
access_token = create_access_token(
    user_data={"email": "user@example.com", "user_uid": "123", "role": "user"}
)

# Create refresh token
refresh_token = create_access_token(
    user_data={"email": "user@example.com", "user_uid": "123"},
    refresh=True,
    expiry=timedelta(days=2)
)
```

**`verify_password()`**: Validates user passwords against hashed versions
```python
is_valid = verify_password("plain_password", user.password_hash)
```

#### 2. Authentication Dependencies (`app/auth/dependencies.py`)

**`AccessTokenBearer`**: Validates access tokens for protected routes
```python
@router.get("/protected-route")
async def protected_endpoint(token_data: dict = Depends(AccessTokenBearer())):
    user_id = token_data["user_uid"]
    # Access granted - user is authenticated
```

**`RefreshTokenBearer`**: Validates refresh tokens for token renewal
```python
@router.get("/refresh")
async def refresh_token(token_data: dict = Depends(RefreshTokenBearer())):
    # Generate new access token
```

#### 3. User Service (`app/auth/services.py`)

Handles all user-related database operations:
```python
# Check if user exists
user_exists = await user_service.user_exists("user@example.com", session)

# Create new user
new_user = await user_service.create_user(user_data, session)

# Get user by email
user = await user_service.get_user_by_email("user@example.com", session)
```

### Usage Examples

#### 1. Register a New User
```bash
POST /api/v1/auth/signup/
{
    "username": "johndoe",
    "email": "john@example.com",
    "last_name": "Doe",
    "password": "securepassword"
}
```

#### 2. Login
```bash
POST /api/v1/auth/login
{
    "email": "john@example.com",
    "password": "securepassword"
}

# Response includes both tokens
{
    "message": "Login Successful",
    "access_token": "eyJ0eXAiOiJKV1Q...",
    "refresh_token": "eyJ0eXAiOiJKV1Q...",
    "user": {"email": "john@example.com", "uid": "123"}
}
```

#### 3. Access Protected Routes
```bash
GET /api/v1/auth/me
Authorization: Bearer eyJ0eXAiOiJKV1Q...
```

#### 4. Refresh Access Token
```bash
GET /api/v1/auth/refresh
Authorization: Bearer <refresh_token>
```

#### 5. Logout (Blacklist Token)
```bash
GET /api/v1/auth/logout
Authorization: Bearer <access_token>
```

### Protecting Your Routes

To protect any route, use the `AccessTokenBearer` dependency:

```python
from app.auth.dependencies import AccessTokenBearer

@router.post("/create-post")
async def create_post(
    post_data: PostCreate,
    current_user: dict = Depends(AccessTokenBearer())
):
    user_id = current_user["user_uid"]
    user_role = current_user["role"]
    # Create post logic here
```

### Role-Based Access

Check user roles in your business logic:
```python
if current_user["role"] != "admin":
    raise HTTPException(status_code=403, detail="Admin access required")
```

## Configuration

1. **Copy the environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Update the `.env` file** with your configuration:
   ```env
   DATABASE_URL=your_database_url
   SECRET_KEY=your_secret_key
   DEBUG=True
   ```

### Using Uvicorn in Production

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///./test.db` |
| `SECRET_KEY` | Secret key for JWT tokens | Required |
| `DEBUG` | Enable debug mode | `False` |
| `CORS_ORIGINS` | Allowed CORS origins | `["*"]` |