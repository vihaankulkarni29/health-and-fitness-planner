# Prompt for Generating API Router and Tests for HealthMetric

**Objective:** Create a FastAPI router for the `HealthMetric` model and a corresponding pytest file to test the API endpoints.

---

### 1. API Router Generation

**File Path:** `backend/app/api/v1/endpoints/health_metrics.py`

**Instructions:**

1.  Import necessary modules: `APIRouter`, `Depends`, `HTTPException`, `Session`, `List`.
2.  Import `health_metric` CRUD object from `app.crud.crud_health_metric`.
3.  Import `HealthMetric` schemas from `app.schemas.health_metric`.
4.  Import `get_db` dependency from `app.api.deps`.
5.  Create an `APIRouter` instance.
6.  Define the following endpoints:
    *   `GET /`: Retrieve multiple health metrics.
    *   `POST /`: Create a new health metric.
    *   `GET /{id}`: Retrieve a specific health metric by ID.
    *   `PUT /{id}`: Update a health metric.
    *   `DELETE /{id}`: Delete a health metric.
7.  Ensure endpoints have appropriate response models and status codes.

---

### 2. Pytest Generation

**File Path:** `backend/app/tests/api/v1/test_health_metrics.py`

**Instructions:**

1.  Import necessary modules: `TestClient`, `Session`.
2.  Import `health_metric` CRUD object for creating test data.
3.  Write pytest functions to test each of the API endpoints:
    *   `test_create_health_metric`
    *   `test_read_health_metric`
    *   `test_read_health_metrics`
    *   `test_update_health_metric`
    *   `test_delete_health_metric`
4.  Use a dedicated test database session.
5.  Assert that the API returns the correct status codes and data.

