# Prompt for Generating API Router for Gyms

**Objective:** Create a FastAPI router for the `Gym` model, exposing CRUD operations, and include tests.

---

### Part 1: API Router

**File Path:** `backend/app/api/v1/endpoints/gyms.py`

**Dependencies:**
*   `FastAPI`, `APIRouter`, `Depends`, `HTTPException`, `status`
*   `Session` from `sqlalchemy.orm`
*   `crud_gym` from `app.crud.crud_gym`
*   `Gym`, `GymCreate`, `GymUpdate` from `app.schemas.gym`
*   `get_db` (a dependency to get a database session)

**Instructions:**

1.  Define a dependency `get_db` that yields a SQLAlchemy `Session`.
2.  Create an `APIRouter` instance.
3.  Implement the following API endpoints:
    *   **POST /**: Create a new gym.
    *   **GET /**: Retrieve multiple gyms.
    *   **GET /{gym_id}**: Retrieve a single gym by ID.
    *   **PUT /{gym_id}**: Update an existing gym.
    *   **DELETE /{gym_id}**: Delete a gym by ID.

---

### Part 2: Pytest Validation

**Objective:** Create a test file to validate the CRUD endpoints for the `Gym` model using a temporary SQLite database.

**File Path:** `backend/app/tests/api/v1/test_gyms.py`

**Dependencies:**
*   `pytest`
*   `TestClient` from `fastapi.testclient`
*   `Session` from `sqlalchemy.orm`
*   `create_engine` from `sqlalchemy`
*   `app.main.app`
*   `app.db.base.Base`
*   `get_db` from `app.api.v1.endpoints.gyms`

**Instructions:**

1.  **Setup a test database:**
    *   Create a temporary SQLite database engine.
    *   Create all tables using `Base.metadata.create_all(bind=engine)`.
    *   Define a `override_get_db` dependency that yields a session from the test database.
    *   Use `app.dependency_overrides[get_db] = override_get_db` to replace the default database dependency.
2.  **Create a `TestClient`:**
    *   Instantiate `TestClient(app)`.
3.  **Write test functions for each endpoint:**
    *   `test_create_gym()`
    *   `test_read_gym()`
    *   `test_read_gyms()`
    *   `test_update_gym()`
    *   `test_delete_gym()`

**Example Test Structure:**

```python
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.api.v1.endpoints.gyms import get_db
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

def test_create_gym():
    response = client.post(
        "/api/v1/gyms/",
        json={"name": "Test Gym", "address": "123 Test St"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Gym"
    assert data["address"] == "123 Test St"
    assert "id" in data
```