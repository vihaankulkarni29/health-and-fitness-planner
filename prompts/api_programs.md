# Prompt for Generating API Router and Tests for Programs

**Objective:** Create a FastAPI router for the `Program` model, exposing CRUD operations, and include tests.

---

### Part 1: API Router

**File Path:** `backend/app/api/v1/endpoints/programs.py`

**Dependencies:**
*   `FastAPI`, `APIRouter`, `Depends`, `HTTPException`, `status`
*   `Session` from `sqlalchemy.orm`
*   `crud_program` from `app.crud.crud_program`
*   `Program`, `ProgramCreate`, `ProgramUpdate` from `app.schemas.program`
*   `get_db` (a dependency to get a database session)

**Instructions:**

1.  Define a dependency `get_db` that yields a SQLAlchemy `Session`. This function should be placed at the top of the file.
2.  Create an `APIRouter` instance with a prefix `/programs` and tag `programs`.
3.  Implement the following API endpoints:
    *   **POST /programs/**: Create a new program.
        *   Input: `ProgramCreate` schema.
        *   Output: `Program` schema.
        *   Uses `crud_program.create`.
    *   **GET /programs/**: Retrieve multiple programs.
        *   Input: `skip` (int, default 0), `limit` (int, default 100).
        *   Output: `List[Program]` schema.
        *   Uses `crud_program.get_multi`.
    *   **GET /programs/{program_id}**: Retrieve a single program by ID.
        *   Input: `program_id` (int).
        *   Output: `Program` schema.
        *   Uses `crud_program.get`. If not found, raise `HTTPException` 404.
    *   **PUT /programs/{program_id}**: Update an existing program.
        *   Input: `program_id` (int), `ProgramUpdate` schema.
        *   Output: `Program` schema.
        *   Uses `crud_program.get` to find the program, then `crud_program.update`. If not found, raise `HTTPException` 404.
    *   **DELETE /programs/{program_id}**: Delete a program by ID.
        *   Input: `program_id` (int).
        *   Output: `Program` schema.
        *   Uses `crud_program.remove`. If not found, raise `HTTPException` 404.

---

### Part 2: Pytest Validation

**Objective:** Create a test file to validate the CRUD endpoints for the `Program` model using a temporary SQLite database.

**File Path:** `backend/app/tests/api/v1/test_programs.py`

**Dependencies:**
*   `pytest`
*   `TestClient` from `fastapi.testclient`
*   `Session` from `sqlalchemy.orm`
*   `create_engine` from `sqlalchemy`
*   `app.main.app`
*   `app.db.base.Base`
*   `get_db` from `app.api.v1.endpoints.programs` (will be created by Copilot)

**Instructions:**

1.  **Setup a test database:**
    *   Create a temporary SQLite database engine.
    *   Create all tables using `Base.metadata.create_all(bind=engine)`.
    *   Define an `override_get_db` dependency that yields a session from the test database.
    *   Use `app.dependency_overrides[get_db] = override_get_db` to replace the default database dependency.
2.  **Create a `TestClient`:**
    *   Instantiate `TestClient(app)`.
3.  **Write test functions for each endpoint:**
    *   `test_create_program()`:
        *   Create a program using a `POST` request to `/api/v1/programs/`. 
        *   Assert that the status code is 200.
        *   Assert that the returned JSON matches the created data.
    *   `test_read_program()`:
        *   Create a program first.
        *   Read the program using a `GET` request to `/api/v1/programs/{program_id}`.
        *   Assert that the status code is 200.
        *   Assert that the returned JSON matches the created data.
    *   `test_read_programs()`:
        *   Create multiple programs.
        *   Read the programs using a `GET` request to `/api/v1/programs/`.
        *   Assert that the status code is 200.
        *   Assert that the returned list contains the created programs.
    *   `test_update_program()`:
        *   Create a program first.
        *   Update the program using a `PUT` request to `/api/v1/programs/{program_id}`.
        *   Assert that the status code is 200.
        *   Assert that the returned JSON reflects the updated data.
    *   `test_delete_program()`:
        *   Create a program first.
        *   Delete the program using a `DELETE` request to `/api/v1/programs/{program_id}`.
        *   Assert that the status code is 200.
        *   Try to read the deleted program and assert that the status code is 404.

**Example Test Structure:**

```python
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.api.v1.endpoints.programs import get_db
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

def test_create_program():
    response = client.post(
        "/api/v1/programs/",
        json={"name": "Test Program", "description": "A test program", "trainer_id": 1},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Program"
    assert "id" in data
```
