# Prompt for Generating API Router and Tests for Trainers

**Objective:** Create a FastAPI router for the `Trainer` model, exposing CRUD operations, and include tests.

---

### Part 1: API Router

**File Path:** `backend/app/api/v1/endpoints/trainers.py`

**Dependencies:**
*   `FastAPI`, `APIRouter`, `Depends`, `HTTPException`, `status`
*   `Session` from `sqlalchemy.orm`
*   `crud_trainer` from `app.crud.crud_trainer`
*   `Trainer`, `TrainerCreate`, `TrainerUpdate` from `app.schemas.trainer`
*   `get_db` (a dependency to get a database session)

**Instructions:**

1.  Define a dependency `get_db` that yields a SQLAlchemy `Session`. This function should be placed at the top of the file.
2.  Create an `APIRouter` instance with a prefix `/trainers` and tag `trainers`.
3.  Implement the following API endpoints:
    *   **POST /**: Create a new trainer.
        *   Input: `TrainerCreate` schema.
        *   Output: `Trainer` schema.
        *   Uses `crud_trainer.create`. Return `HTTPException` 400 if `trainer_in.email` already exists.
    *   **GET /**: Retrieve multiple trainers.
        *   Input: `skip` (int, default 0), `limit` (int, default 100).
        *   Output: `List[Trainer]` schema.
        *   Uses `crud_trainer.get_multi`.
    *   **GET /{trainer_id}**: Retrieve a single trainer by ID.
        *   Input: `trainer_id` (int).
        *   Output: `Trainer` schema.
        *   Uses `crud_trainer.get`. If not found, raise `HTTPException` 404.
    *   **PUT /{trainer_id}**: Update an existing trainer.
        *   Input: `trainer_id` (int), `TrainerUpdate` schema.
        *   Output: `Trainer` schema.
        *   Uses `crud_trainer.get` to find the trainer, then `crud_trainer.update`. If not found, raise `HTTPException` 404.
    *   **DELETE /{trainer_id}**: Delete a trainer by ID.
        *   Input: `trainer_id` (int).
        *   Output: `Trainer` schema.
        *   Uses `crud_trainer.remove`. If not found, raise `HTTPException` 404.

---

### Part 2: Pytest Validation

**Objective:** Create a test file to validate the CRUD endpoints for the `Trainer` model using a temporary SQLite database.

**File Path:** `backend/app/tests/api/v1/test_trainers.py`

**Dependencies:**
*   `pytest`
*   `TestClient` from `fastapi.testclient`
*   `Session` from `sqlalchemy.orm`
*   `create_engine` from `sqlalchemy`
*   `app.main.app`
*   `app.db.base.Base`
*   `get_db` from `app.api.v1.endpoints.trainers` (will be created by Copilot)

**Instructions:**

1.  **Setup a test database:**
    *   Create a temporary SQLite database engine.
    *   Create all tables using `Base.metadata.create_all(bind=engine)`.
    *   Define a `override_get_db` dependency that yields a session from the test database.
    *   Use `app.dependency_overrides[get_db] = override_get_db` to replace the default database dependency.
2.  **Create a `TestClient`:**
    *   Instantiate `TestClient(app)`.
3.  **Write test functions for each endpoint:**
    *   `test_create_trainer()`:
        *   Create a trainer using a `POST` request to `/api/v1/trainers/`.
        *   Assert that the status code is 200.
        *   Assert that the returned JSON matches the created data.
    *   `test_read_trainer()`:
        *   Create a trainer first.
        *   Read the trainer using a `GET` request to `/api/v1/trainers/{trainer_id}`.
        *   Assert that the status code is 200.
        *   Assert that the returned JSON matches the created data.
    *   `test_read_trainers()`:
        *   Create multiple trainers.
        *   Read the trainers using a `GET` request to `/api/v1/trainers/`.
        *   Assert that the status code is 200.
        *   Assert that the returned list contains the created trainers.
    *   `test_update_trainer()`:
        *   Create a trainer first.
        *   Update the trainer using a `PUT` request to `/api/v1/trainers/{trainer_id}`.
        *   Assert that the status code is 200.
        *   Assert that the returned JSON reflects the updated data.
    *   `test_delete_trainer()`:
        *   Create a trainer first.
        *   Delete the trainer using a `DELETE` request to `/api/v1/trainers/{trainer_id}`.
        *   Assert that the status code is 200.
        *   Try to read the deleted trainer and assert that the status code is 404.

**Example Test Structure:**

```python
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.api.v1.endpoints.trainers import get_db
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

def test_create_trainer():
    response = client.post(
        "/api/v1/trainers/",
        json={"first_name": "John", "last_name": "Doe", "email": "john.doe@example.com", "gym_id": 1},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "John"
    assert data["email"] == "john.doe@example.com"
    assert "id" in data
```
