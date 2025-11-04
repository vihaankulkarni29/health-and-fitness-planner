# Prompt for Generating API Router and Tests for WorkoutSession

**Objective:** Create a FastAPI router for the `WorkoutSession` model and a corresponding pytest file to test the API endpoints.

---

### 1. API Router Generation

**File Path:** `backend/app/api/v1/endpoints/workout_sessions.py`

**Instructions:**

1.  Import necessary modules: `APIRouter`, `Depends`, `HTTPException`, `Session`, `List`.
2.  Import `workout_session` CRUD object from `app.crud.crud_workout_session`.
3.  Import `WorkoutSession` schemas from `app.schemas.workout_session`.
4.  Import `get_db` dependency from `app.api.deps`.
5.  Create an `APIRouter` instance.
6.  Define the following endpoints:
    *   `GET /`: Retrieve multiple workout sessions.
    *   `POST /`: Create a new workout session.
    *   `GET /{id}`: Retrieve a specific workout session by ID.
    *   `PUT /{id}`: Update a workout session.
    *   `DELETE /{id}`: Delete a workout session.
7.  Ensure endpoints have appropriate response models and status codes.

---

### 2. Pytest Generation

**File Path:** `backend/app/tests/api/v1/test_workout_sessions.py`

**Instructions:**

1.  Import necessary modules: `TestClient`, `Session`.
2.  Import `workout_session` CRUD object for creating test data.
3.  Write pytest functions to test each of the API endpoints:
    *   `test_create_workout_session`
    *   `test_read_workout_session`
    *   `test_read_workout_sessions`
    *   `test_update_workout_session`
    *   `test_delete_workout_session`
4.  Use a dedicated test database session.
5.  Assert that the API returns the correct status codes and data.

