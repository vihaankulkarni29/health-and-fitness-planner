# Prompt for Generating API Router and Tests for Exercises

**Objective:** Create a FastAPI router for the `Exercise` model, exposing CRUD operations, and include tests.

---

### Part 1: API Router

**File Path:** `backend/app/api/v1/endpoints/exercises.py`

**Dependencies:**
*   `FastAPI`, `APIRouter`, `Depends`, `HTTPException`, `status`
*   `Session` from `sqlalchemy.orm`
*   `crud_exercise` from `app.crud.crud_exercise`
*   `Exercise`, `ExerciseCreate`, `ExerciseUpdate` from `app.schemas.exercise`
*   `get_db` (a dependency to get a database session)

**Instructions:**

1.  Define a dependency `get_db` that yields a SQLAlchemy `Session`. This function should be placed at the top of the file.
2.  Create an `APIRouter` instance with a prefix `/exercises` and tag `exercises`.
3.  Implement the following API endpoints:
    *   **POST /exercises/**: Create a new exercise.
        *   Input: `ExerciseCreate` schema.
        *   Output: `Exercise` schema.
        *   Uses `crud_exercise.create`. Return `HTTPException` 400 if `exercise_in.name` already exists.
    *   **GET /exercises/**: Retrieve multiple exercises.
        *   Input: `skip` (int, default 0), `limit` (int, default 100).
        *   Output: `List[Exercise]` schema.
        *   Uses `crud_exercise.get_multi`.
    *   **GET /exercises/{exercise_id}**: Retrieve a single exercise by ID.
        *   Input: `exercise_id` (int).
        *   Output: `Exercise` schema.
        *   Uses `crud_exercise.get`. If not found, raise `HTTPException` 404.
    *   **PUT /exercises/{exercise_id}**: Update an existing exercise.
        *   Input: `exercise_id` (int), `ExerciseUpdate` schema.
        *   Output: `Exercise` schema.
        *   Uses `crud_exercise.get` to find the exercise, then `crud_exercise.update`. If not found, raise `HTTPException` 404.
    *   **DELETE /exercises/{exercise_id}**: Delete an exercise by ID.
        *   Input: `exercise_id` (int).
        *   Output: `Exercise` schema.
        *   Uses `crud_exercise.remove`. If not found, raise `HTTPException` 404.

---

### Part 2: Pytest Validation

**Objective:** Create a test file to validate the CRUD endpoints for the `Exercise` model using a temporary SQLite database.

**File Path:** `backend/app/tests/api/v1/test_exercises.py`

**Dependencies:**
*   `pytest`
*   `TestClient` from `fastapi.testclient`
*   `Session` from `sqlalchemy.orm`
*   `create_engine` from `sqlalchemy`
*   `app.main.app`
*   `app.db.base.Base`
*   `get_db` from `app.api.v1.endpoints.exercises` (will be created by Copilot)

**Instructions:**

1.  **Setup a test database:**
    *   Create a temporary SQLite database engine.
    *   Create all tables using `Base.metadata.create_all(bind=engine)`.
    *   Define an `override_get_db` dependency that yields a session from the test database.
    *   Use `app.dependency_overrides[get_db] = override_get_db` to replace the default database dependency.
2.  **Create a `TestClient`:**
    *   Instantiate `TestClient(app)`.
3.  **Write test functions for each endpoint:**
    *   `test_create_exercise()`:
        *   Create an exercise using a `POST` request to `/api/v1/exercises/`. 
        *   Assert that the status code is 200.
        *   Assert that the returned JSON matches the created data.
    *   `test_read_exercise()`:
        *   Create an exercise first.
        *   Read the exercise using a `GET` request to `/api/v1/exercises/{exercise_id}`.
        *   Assert that the status code is 200.
        *   Assert that the returned JSON matches the created data.
    *   `test_read_exercises()`:
        *   Create multiple exercises.
        *   Read the exercises using a `GET` request to `/api/v1/exercises/`.
        *   Assert that the status code is 200.
        *   Assert that the returned list contains the created exercises.
    *   `test_update_exercise()`:
        *   Create an exercise first.
        *   Update the exercise using a `PUT` request to `/api/v1/exercises/{exercise_id}`.
        *   Assert that the status code is 200.
        *   Assert that the returned JSON reflects the updated data.
    *   `test_delete_exercise()`:
        *   Create an exercise first.
        *   Delete the exercise using a `DELETE` request to `/api/v1/exercises/{exercise_id}`.
        *   Assert that the status code is 200.
        *   Try to read the deleted exercise and assert that the status code is 404.

**Example Test Structure:**

```python
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.api.v1.endpoints.exercises import get_db
from app.db.base import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_exercise():
    response = client.post(
        "/api/v1/exercises/",
        json={"name": "Test Exercise", "description": "A test exercise"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Exercise"
    assert "id" in data
```
