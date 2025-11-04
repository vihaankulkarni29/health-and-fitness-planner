# Prompt for Generating API Router and Tests for ProgramExercise

**Objective:** Create a FastAPI router for the `ProgramExercise` model and a corresponding pytest file to test the API endpoints.

---

### 1. API Router Generation

**File Path:** `backend/app/api/v1/endpoints/program_exercises.py`

**Instructions:**

1.  Import necessary modules: `APIRouter`, `Depends`, `HTTPException`, `Session`, `List`.
2.  Import `program_exercise` CRUD object from `app.crud.crud_program_exercise`.
3.  Import `ProgramExercise` schemas from `app.schemas.program_exercise`.
4.  Import `get_db` dependency from `app.api.deps`.
5.  Create an `APIRouter` instance.
6.  Define the following endpoints:
    *   `GET /`: Retrieve multiple program exercises.
    *   `POST /`: Create a new program exercise.
    *   `GET /{id}`: Retrieve a specific program exercise by ID.
    *   `PUT /{id}`: Update a program exercise.
    *   `DELETE /{id}`: Delete a program exercise.
7.  Ensure endpoints have appropriate response models and status codes.

---

### 2. Pytest Generation

**File Path:** `backend/app/tests/api/v1/test_program_exercises.py`

**Instructions:**

1.  Import necessary modules: `TestClient`, `Session`.
2.  Import `program_exercise` CRUD object for creating test data.
3.  Write pytest functions to test each of the API endpoints:
    *   `test_create_program_exercise`
    *   `test_read_program_exercise`
    *   `test_read_program_exercises`
    *   `test_update_program_exercise`
    *   `test_delete_program_exercise`
4.  Use a dedicated test database session.
5.  Assert that the API returns the correct status codes and data.

