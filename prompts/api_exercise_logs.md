# Prompt for Generating API Router and Tests for ExerciseLog

**Objective:** Create a FastAPI router for the `ExerciseLog` model and a corresponding pytest file to test the API endpoints.

---

### 1. API Router Generation

**File Path:** `backend/app/api/v1/endpoints/exercise_logs.py`

**Instructions:**

1.  Import necessary modules: `APIRouter`, `Depends`, `HTTPException`, `Session`, `List`.
2.  Import `exercise_log` CRUD object from `app.crud.crud_exercise_log`.
3.  Import `ExerciseLog` schemas from `app.schemas.exercise_log`.
4.  Import `get_db` dependency from `app.api.deps`.
5.  Create an `APIRouter` instance.
6.  Define the following endpoints:
    *   `GET /`: Retrieve multiple exercise logs.
    *   `POST /`: Create a new exercise log.
    *   `GET /{id}`: Retrieve a specific exercise log by ID.
    *   `PUT /{id}`: Update an exercise log.
    *   `DELETE /{id}`: Delete an exercise log.
7.  Ensure endpoints have appropriate response models and status codes.

---

### 2. Pytest Generation

**File Path:** `backend/app/tests/api/v1/test_exercise_logs.py`

**Instructions:**

1.  Import necessary modules: `TestClient`, `Session`.
2.  Import `exercise_log` CRUD object for creating test data.
3.  Write pytest functions to test each of the API endpoints:
    *   `test_create_exercise_log`
    *   `test_read_exercise_log`
    *   `test_read_exercise_logs`
    *   `test_update_exercise_log`
    *   `test_delete_exercise_log`
4.  Use a dedicated test database session.
5.  Assert that the API returns the correct status codes and data.

