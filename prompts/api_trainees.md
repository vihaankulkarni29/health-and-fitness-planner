# Prompt for Generating API Router and Tests for Trainees

**Objective:** Create a FastAPI router for the `Trainee` model, exposing CRUD operations, and include tests.

---

### Part 1: API Router

**File Path:** `backend/app/api/v1/endpoints/trainees.py`

**Dependencies:**
*   `FastAPI`, `APIRouter`, `Depends`, `HTTPException`, `status`
*   `Session` from `sqlalchemy.orm`
*   `crud_trainee` from `app.crud.crud_trainee`
*   `Trainee`, `TraineeCreate`, `TraineeUpdate` from `app.schemas.trainee`
*   `get_db` (a dependency to get a database session)

**Instructions:**

1.  Define a dependency `get_db` that yields a SQLAlchemy `Session`. This function should be placed at the top of the file.
2.  Create an `APIRouter` instance with a prefix `/trainees` and tag `trainees`.
3.  Implement the following API endpoints:
    *   **POST /trainees/**: Create a new trainee.
        *   Input: `TraineeCreate` schema.
        *   Output: `Trainee` schema.
        *   Uses `crud_trainee.create`. Return `HTTPException` 400 if `trainee_in.email` already exists.
    *   **GET /trainees/**: Retrieve multiple trainees.
        *   Input: `skip` (int, default 0), `limit` (int, default 100).
        *   Output: `List[Trainee]` schema.
        *   Uses `crud_trainee.get_multi`.
    *   **GET /trainees/{trainee_id}**: Retrieve a single trainee by ID.
        *   Input: `trainee_id` (int).
        *   Output: `Trainee` schema.
        *   Uses `crud_trainee.get`. If not found, raise `HTTPException` 404.
    *   **PUT /trainees/{trainee_id}**: Update an existing trainee.
        *   Input: `trainee_id` (int), `TraineeUpdate` schema.
        *   Output: `Trainee` schema.
        *   Uses `crud_trainee.get` to find the trainee, then `crud_trainee.update`. If not found, raise `HTTPException` 404.
    *   **DELETE /trainees/{trainee_id}**: Delete a trainee by ID.
        *   Input: `trainee_id` (int).
        *   Output: `Trainee` schema.
        *   Uses `crud_trainee.remove`. If not found, raise `HTTPException` 404.

---

### Part 2: Pytest Validation

**Objective:** Create a test file to validate the CRUD endpoints for the `Trainee` model using a temporary SQLite database.

**File Path:** `backend/app/tests/api/v1/test_trainees.py`

**Dependencies:**
*   `pytest`
*   `TestClient` from `fastapi.testclient`
*   `Session` from `sqlalchemy.orm`
*   `create_engine` from `sqlalchemy`
*   `app.main.app`
*   `app.db.base.Base`
*   `get_db` from `app.api.v1.endpoints.trainees` (will be created by Copilot)

**Instructions:**

1.  **Setup a test database:**
    *   Create a temporary SQLite database engine.
    *   Create all tables using `Base.metadata.create_all(bind=engine)`.
    *   Define an `override_get_db` dependency that yields a session from the test database.
    *   Use `app.dependency_overrides[get_db] = override_get_db` to replace the default database dependency.
2.  **Create a `TestClient`:**
    *   Instantiate `TestClient(app)`.
3.  **Write test functions for each endpoint:**
    *   `test_create_trainee()`:
        *   Create a trainee using a `POST` request to `/api/v1/trainees/`. 
        *   Assert that the status code is 200.
        *   Assert that the returned JSON matches the created data.
    *   `test_read_trainee()`:
        *   Create a trainee first.
        *   Read the trainee using a `GET` request to `/api/v1/trainees/{trainee_id}`.
        *   Assert that the status code is 200.
        *   Assert that the returned JSON matches the created data.
    *   `test_read_trainees()`:
        *   Create multiple trainees.
        *   Read the trainees using a `GET` request to `/api/v1/trainees/`.
        *   Assert that the status code is 200.
        *   Assert that the returned list contains the created trainees.
    *   `test_update_trainee()`:
        *   Create a trainee first.
        *   Update the trainee using a `PUT` request to `/api/v1/trainees/{trainee_id}`.
        *   Assert that the status code is 200.
        *   Assert that the returned JSON reflects the updated data.
    *   `test_delete_trainee()`:
        *   Create a trainee first.
        *   Delete the trainee using a `DELETE` request to `/api/v1/trainees/{trainee_id}`.
        *   Assert that the status code is 200.
        *   Try to read the deleted trainee and assert that the status code is 404.

**Example Test Structure:**

```python
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.api.v1.endpoints.trainees import get_db
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

def test_create_trainee():
    response = client.post(
        "/api/v1/trainees/",
        json={"first_name": "Jane", "last_name": "Doe", "email": "jane.doe@example.com", "gym_id": 1, "trainer_id": 1, "program_id": 1},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Jane"
    assert data["email"] == "jane.doe@example.com"
    assert "id" in data
```
