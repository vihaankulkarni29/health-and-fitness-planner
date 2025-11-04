# Prompt for Phase 5 Next Steps: Testing, Security, and Migrations

This prompt provides a consolidated, step-by-step guide to fix the test suite, protect all API endpoints, and apply database migrations.

## Part 1: Fix Router Double-Prefix Bug (CRITICAL)

**Goal:** Ensure all API endpoints have the correct path by removing duplicate prefixes.

**Instruction:**

Check ALL endpoint router files for duplicate prefix definitions. The prefix should ONLY be defined in `backend/app/api/v1/api.py` when the router is included, NOT in the individual endpoint files.

**Files to Check:**
- `backend/app/api/v1/endpoints/gyms.py`
- `backend/app/api/v1/endpoints/trainers.py`
- `backend/app/api/v1/endpoints/trainees.py`
- `backend/app/api/v1/endpoints/programs.py`
- `backend/app/api/v1/endpoints/exercises.py`
- `backend/app/api/v1/endpoints/health_metrics.py`
- `backend/app/api/v1/endpoints/program_exercises.py`
- `backend/app/api/v1/endpoints/workout_sessions.py`
- `backend/app/api/v1/endpoints/exercise_logs.py`

**Expected Pattern:**

```python
# In each endpoint file (e.g., trainers.py)
router = APIRouter()  # NO prefix here

# In backend/app/api/v1/api.py
api_router.include_router(trainers.router, prefix="/trainers", tags=["trainers"])  # Prefix here only
```

## Part 2: Apply Database Migration (HIGH)

**Goal:** Update the development PostgreSQL database with the `hashed_password` column.

**Instruction:**

Run the following commands from the `backend` directory:

```bash
alembic current
alembic upgrade head
alembic current
```

## Part 3: Secure CORS Configuration (HIGH)

**Goal:** Restrict CORS origins to prevent security vulnerabilities.

**Instruction:**

1.  **Add CORS settings to `backend/app/core/config.py`:**

    ```python
    # backend/app/core/config.py
    from pydantic_settings import BaseSettings, SettingsConfigDict
    from pydantic import Field
    from typing import Any

    class Settings(BaseSettings):
        model_config = SettingsConfigDict(env_file=".env")

        SQLALCHEMY_DATABASE_URI: str = ""
        API_V1_STR: str = "/api/v1"
        SECRET_KEY: str = "a_secret_key"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
        ALGORITHM: str = "HS256"

        CORS_ORIGINS: list[str] = Field(
            default=["http://localhost:3000", "http://localhost:8000"],
            description="Allowed CORS origins (comma-separated in .env)"
        )

        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str) -> Any:
            if field_name == "CORS_ORIGINS":
                return [origin.strip() for origin in raw_val.split(",")]
            return raw_val

    settings = Settings()
    ```

2.  **Update `backend/app/main.py` to use config:**

    ```python
    # backend/app/main.py
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded

    from app.api.v1.api import api_router
    from app.core.config import settings

    limiter = Limiter(key_func=get_remote_address)
    app = FastAPI()
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    def read_root():
        return {"message": "Hello World"}

    app.include_router(api_router, prefix="/api/v1")
    ```

3.  **Add `CORS_ORIGINS` to `backend/.env`:**

    ```
    # Development
    CORS_ORIGINS=http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000

    # Production (set in deployment environment)
    # CORS_ORIGINS=https://yourapp.com,https://www.yourapp.com
    ```

## Part 4: Protect All Mutating Endpoints (HIGH)

**Goal:** Secure all `POST`, `PUT`, and `DELETE` endpoints with authentication.

**Instruction:**

For each of the following files and functions, add the `current_user` dependency to require authentication. Ensure you import `get_current_user` from `app.auth.deps` and `Trainee` from `app.models.trainee`.

**Example:**

Change this:
```python
def create_exercise(
    *,
    db: Session = Depends(get_db),
    exercise_in: ExerciseCreate,
) -> Any:
```

To this:
```python
from app.auth.deps import get_current_user
from app.models.trainee import Trainee

def create_exercise(
    *,
    db: Session = Depends(get_db),
    exercise_in: ExerciseCreate,
    current_user: Trainee = Depends(get_current_user),
) -> Any:
```

**Files and Functions to Update:**

1.  `backend/app/api/v1/endpoints/exercises.py`
    - `create_exercise`
    - `update_exercise`
    - `delete_exercise`
2.  `backend/app/api/v1/endpoints/health_metrics.py`
    - `create_health_metric`
    - `update_health_metric`
    - `delete_health_metric`
3.  `backend/app/api/v1/endpoints/program_exercises.py`
    - `create_program_exercise`
    - `update_program_exercise`
    - `delete_program_exercise`
4.  `backend/app/api/v1/endpoints/programs.py`
    - `create_program`
    - `update_program`
    - `delete_program`
5.  `backend/app/api/v1/endpoints/trainees.py`
    - `create_trainee`
    - `update_trainee`
    - `delete_trainee`
    - `assign_program_to_trainee`
6.  `backend/app/api/v1/endpoints/trainers.py`
    - `create_trainer`
    - `update_trainer`
    - `delete_trainer`
7.  `backend/app/api/v1/endpoints/workout_sessions.py`
    - `start_workout_session`
    - `log_exercise_in_session`
    - `end_workout_session`
8.  `backend/app/api/v1/endpoints/exercise_logs.py`
    - `create_exercise_log`
    - `update_exercise_log`
    - `delete_exercise_log`

## Part 5: Implement Role-Based Authorization (HIGH)

**Goal:** Add a role system to differentiate user permissions.

**Instruction:**

1.  **Add `UserRole` Enum and `role` column to `backend/app/models/trainee.py`:**

    ```python
    # backend/app/models/trainee.py
    from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Enum
    from sqlalchemy.orm import relationship, Mapped, mapped_column
    from app.db.base_class import Base
    import enum

    class UserRole(str, enum.Enum):
        ADMIN = "admin"
        TRAINER = "trainer"
        TRAINEE = "trainee"

    class Trainee(Base):
        __tablename__ = 'trainees'

        id = Column(Integer, primary_key=True, index=True)
        first_name = Column(String(100), nullable=False)
        last_name = Column(String(100), nullable=False)
        email = Column(String(100), unique=True, index=True, nullable=False)
        hashed_password = Column(String(255), nullable=False)
        gym_id = Column(Integer, ForeignKey("gyms.id"))
        trainer_id = Column(Integer, ForeignKey("trainers.id"))
        program_id = Column(Integer, ForeignKey("programs.id"))
        created_at = Column(DateTime(timezone=True), server_default=func.now())
        role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.TRAINEE, nullable=False)

        gym = relationship("Gym", back_populates="trainees")
        trainer = relationship("Trainer", back_populates="trainees")
        program = relationship("Program", back_populates="trainees")
        health_metrics = relationship("HealthMetric", back_populates="trainee")
        workout_sessions = relationship("WorkoutSession", back_populates="trainee")
    ```

2.  **Create a new Alembic migration** to add the `role` column to the `trainees` table. Run the following commands from the `backend` directory:

    ```bash
    alembic revision --autogenerate -m "add_role_to_trainees"
    alembic upgrade head
    ```

3.  **Add permission dependencies to `backend/app/auth/deps.py`:**

    ```python
    # backend/app/auth/deps.py
    from typing import Any

    from fastapi import Depends, HTTPException, status
    from fastapi.security import OAuth2PasswordBearer
    from jose import jwt
    from pydantic import ValidationError
    from sqlalchemy.orm import Session

    from app.api.deps import get_db
    from app.core.config import settings
    from app.auth.schemas import TokenPayload
    from app.models.trainee import Trainee, UserRole # Import UserRole

    reusable_oauth2 = OAuth2PasswordBearer(
        tokenUrl="/api/v1/auth/login/access-token"
    )


    def get_current_user(
        db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
    ) -> Trainee:
        try:
            payload: dict[str, Any] = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            token_data = TokenPayload(**payload)
        except (jwt.JWTError, ValidationError):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
            )
        user = db.query(Trainee).filter(Trainee.id == token_data.sub).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user


    def require_trainer(current_user: Trainee = Depends(get_current_user)) -> Trainee:
        """Require user to be a trainer or admin."""
        if current_user.role not in [UserRole.TRAINER, UserRole.ADMIN]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return current_user


    def require_admin(current_user: Trainee = Depends(get_current_user)) -> Trainee:
        """Require user to be an admin."""
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        return current_user
    ```

4.  **Apply role-based dependencies to endpoints** based on the Authorization Matrix (Suggested) in `MAJOR_WORK.md`. For example:

    -   **Gyms (Create, Update, Delete):** Require `require_admin`
    -   **Programs (Create, Update, Delete):** Require `require_trainer`
    -   **Trainees (Create):** Decide if public or `require_admin`
    -   **Trainees (Update, Delete):** Require `get_current_user` and add logic for self-ownership or `require_admin`

## Part 7: Comprehensive Test Coverage (MEDIUM)

**Goal:** Expand test coverage to all resources, including authorization and edge cases.

**Instruction:**

1.  **Replicate Test Pattern for All Resources:**
    Create test files for each resource in `backend/tests/`, following the pattern of `test_gyms_api.py` and `test_auth.py`. Each file should include tests for `create`, `read` (single and multiple), `update`, and `delete` operations.

    **Files to Create/Update:**
    - `backend/tests/test_trainers_api.py`
    - `backend/tests/test_trainees_api.py`
    - `backend/tests/test_programs_api.py`
    - `backend/tests/test_exercises_api.py`
    - `backend/tests/test_health_metrics_api.py`
    - `backend/tests/test_workout_sessions_api.py`
    - `backend/tests/test_exercise_logs_api.py`
    - `backend/tests/test_program_exercises_api.py`

    **Template for each test file (example for `test_trainers_api.py`):**
    ```python
    from fastapi import status
    from fastapi.testclient import TestClient
    from sqlalchemy.orm import Session
    from app.core.config import settings
    from app.schemas.trainer import TrainerCreate, TrainerUpdate
    from app.crud.crud_trainer import trainer as crud_trainer

    def test_create_trainer_success(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
        payload = {"first_name": "John", "last_name": "Doe", "email": "john.doe@example.com", "gym_id": None}
        resp = client.post(f"{settings.API_V1_STR}/trainers/", json=payload, headers=auth_headers)
        assert resp.status_code == status.HTTP_200_OK
        data = resp.json()
        assert data["first_name"] == payload["first_name"]
        assert data["email"] == payload["email"]
        assert "id" in data

    def test_create_trainer_unauthorized(client: TestClient) -> None:
        payload = {"first_name": "John", "last_name": "Doe", "email": "unauth@example.com", "gym_id": None}
        resp = client.post(f"{settings.API_V1_STR}/trainers/", json=payload)
        assert resp.status_code == status.HTTP_403_FORBIDDEN # Or 401 depending on exact auth setup

    def test_read_trainers_list(client: TestClient) -> None:
        resp = client.get(f"{settings.API_V1_STR}/trainers/?skip=0&limit=10")
        assert resp.status_code == status.HTTP_200_OK
        assert isinstance(resp.json(), list)

    # ... add tests for read_trainer, update_trainer, delete_trainer
    ```

2.  **Add Authorization Tests:**
    For each resource, add tests to verify that users with insufficient roles (e.g., a `TRAINEE` trying to create a `GYM`) receive `403 Forbidden` responses. You will need to create fixtures for different user roles (e.g., `admin_auth_headers`, `trainer_auth_headers`).

    **Example for `test_gyms_api.py` (assuming `admin_auth_headers` fixture exists):**
    ```python
    def test_create_gym_requires_admin(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
        # auth_headers is for a regular trainee
        payload = {"name": "Test Gym", "address": "123 St"}
        resp = client.post(f"{settings.API_V1_STR}/gyms/", json=payload, headers=auth_headers)
        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_create_gym_as_admin_succeeds(client: TestClient, db_session: Session, admin_auth_headers: dict[str, str]) -> None:
        payload = {"name": "Test Gym", "address": "123 St"}
        resp = client.post(f"{settings.API_V1_STR}/gyms/", json=payload, headers=admin_auth_headers)
        assert resp.status_code == status.HTTP_200_OK
    ```

3.  **Add Edge Case & Validation Tests:**
    For each resource, add tests for common edge cases and validation failures (e.g., invalid email format, non-existent IDs, missing required fields).

    **Example for `test_trainers_api.py`:**
    ```python
    def test_create_trainer_invalid_email(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
        payload = {"first_name": "Invalid", "last_name": "Email", "email": "not-an-email", "gym_id": None}
        resp = client.post(f"{settings.API_V1_STR}/trainers/", json=payload, headers=auth_headers)
        assert resp.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_update_trainer_not_found(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
        update_data = {"first_name": "Updated"}
        resp = client.put(f"{settings.API_V1_STR}/trainers/999999", json=update_data, headers=auth_headers)
        assert resp.status_code == status.HTTP_404_NOT_FOUND
    ```

## Part 8: Add Input Validation & Error Handling (MEDIUM)

**Goal:** Enhance the application's robustness with more explicit validation and consistent error responses.

**Instruction:**

1.  **Implement Business Logic Validation:**
    Add specific validation logic within endpoint functions where business rules apply (e.g., preventing a workout session from ending before it starts, ensuring related entities exist).

    **Example for `backend/app/api/v1/endpoints/workout_sessions.py` (within `start_workout_session` or `log_exercise_in_session`):**
    ```python
    # Validate trainee exists
    trainee = crud_trainee.get(db, id=session_in.trainee_id)
    if not trainee:
        raise HTTPException(
            status_code=404,
            detail="Trainee not found"
        )
    ```

2.  **Create Consistent Error Responses:**
    Define custom exception classes for common error scenarios to ensure consistent API error messages.

    **File: `backend/app/core/exceptions.py`**
    ```python
    from fastapi import HTTPException, status

    class NotFoundException(HTTPException):
        def __init__(self, resource: str, id: int):
            super().__init__(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{resource} with id {id} not found"
            )

    class DuplicateException(HTTPException):
        def __init__(self, resource: str, field: str, value: str):
            super().__init__(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{resource} with {field}='{value}' already exists"
            )

    class ForbiddenException(HTTPException):
        def __init__(self, message: str = "Not enough permissions"):
            super().__init__(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=message
            )
    ```

3.  **Implement Global Exception Handler:**
    Add global exception handlers in `backend/app/main.py` to catch common exceptions and return standardized error responses.

    **File: `backend/app/main.py`**
    ```python
    from fastapi.responses import JSONResponse
    from sqlalchemy.exc import IntegrityError
    import logging

    logger = logging.getLogger(__name__)

    @app.exception_handler(IntegrityError)
    async def integrity_error_handler(request, exc):
        logger.error(f"IntegrityError: {exc}", exc_info=True)
        return JSONResponse(
            status_code=400,
            content={"detail": "Database constraint violation"}
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request, exc):
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )
    ```