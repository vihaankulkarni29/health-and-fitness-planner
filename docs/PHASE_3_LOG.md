# Phase 3 Log: API Endpoint & CRUD Logic

**Goal:** Build the actual API endpoints that the Flutter app will call.

---

### To-Dos:

*   [x] Set up the database connection.
*   [ ] Create CRUD functions for each model.
*   [ ] Create API routers to expose CRUD functions.

---

### Execution Log:

*   **Step 3.1:** Initializing Phase 3.
*   **Step 3.2:** Created `crud` directory.
*   **Step 3.3:** Updated `gym` schema with `GymUpdate`.
*   **Step 3.4:** Created prompt for `Gym` CRUD functions in `prompts/crud_gym.md`.
*   **Step 3.5:** Created `api/v1/endpoints` directory structure.
*   **Step 3.6:** Created prompt for `Gym` API router in `prompts/api_gyms.md`.
*   **Step 3.7:** Created `tests` directory structure.
*   **Step 3.8:** Updated `api_gyms.md` prompt to include pytest instructions.
*   **Step 3.9:** Created `backend/app/api/v1/api.py` to aggregate v1 routers.
*   **Step 3.10:** Updated `backend/app/main.py` to include the v1 API router.
*   **Step 3.11:** Created `backend/app/tests/api/v1/test_gyms.py` with basic CRUD tests for Gym endpoints.
