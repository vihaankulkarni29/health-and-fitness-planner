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
*   **Step 3.12:** Updated `trainer` schema with `TrainerUpdate`.
*   **Step 3.13:** Created prompt for `Trainer` CRUD functions in `prompts/crud_trainer.md`.
*   **Step 3.14:** Created prompt for `Trainer` API router and tests in `prompts/api_trainers.md`.
*   **Step 3.15:** Generated `backend/app/crud/crud_trainer.py` using Copilot.
*   **Step 3.16:** Generated `backend/app/api/v1/endpoints/trainers.py` using Copilot.
*   **Step 3.17:** Updated `backend/app/api/v1/api.py` to include the `trainers` router.
*   **Step 3.18:** Generated `backend/app/tests/api/v1/test_trainers.py` using Copilot.
*   **Step 3.19:** Updated `trainee` schema with `TraineeUpdate`.
*   **Step 3.20:** Created prompt for `Trainee` CRUD functions in `prompts/crud_trainee.md`.
*   **Step 3.21:** Created prompt for `Trainee` API router and tests in `prompts/api_trainees.md`.
*   **Step 3.22:** Generated `backend/app/crud/crud_trainee.py` using Copilot.
*   **Step 3.23:** Generated `backend/app/api/v1/endpoints/trainees.py` using Copilot.
*   **Step 3.24:** Updated `backend/app/api/v1/api.py` to include the `trainees` router.
*   **Step 3.25:** Generated `backend/app/tests/api/v1/test_trainees.py` using Copilot.
*   **Step 3.26:** Updated `program` schema with `ProgramUpdate`.
*   **Step 3.27:** Created prompt for `Program` CRUD functions in `prompts/crud_program.md`.
*   **Step 3.28:** Created prompt for `Program` API router and tests in `prompts/api_programs.md`.
*   **Step 3.29:** Generated `backend/app/crud/crud_program.py` using Copilot.
*   **Step 3.30:** Generated `backend/app/api/v1/endpoints/programs.py` using Copilot.
*   **Step 3.31:** Updated `backend/app/api/v1/api.py` to include the `programs` router.
*   **Step 3.32:** Generated `backend/app/tests/api/v1/test_programs.py` using Copilot.
*   **Step 3.33:** Updated `exercise` schema with `ExerciseUpdate`.
*   **Step 3.34:** Created prompt for `Exercise` CRUD functions in `prompts/crud_exercise.md`.
*   **Step 3.35:** Created prompt for `Exercise` API router and tests in `prompts/api_exercises.md`.
*   **Step 3.36:** Generated `backend/app/crud/crud_exercise.py` using Copilot.
*   **Step 3.37:** Generated `backend/app/api/v1/endpoints/exercises.py` using Copilot.
*   **Step 3.38:** Updated `backend/app/api/v1/api.py` to include the `exercises` router.
*   **Step 3.39:** Generated `backend/app/tests/api/v1/test_exercises.py` using Copilot.
