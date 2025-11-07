# Phase 3 Log: API Endpoint & CRUD Logic

**Goal:** Build the actual API endpoints that the Flutter app will call.

---

### To-Dos:

*   [x] Set up the database connection.
*   [x] Create CRUD functions for each model.
*   [x] Create API routers to expose CRUD functions.

---

### execution Log:

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
*   **Step 3.31:**. Updated `backend/app/api/v1/api.py` to include the `programs` router.
*   **Step 3.32:** Generated `backend/app/tests/api/v1/test_programs.py` using Copilot.
*   **Step 3.33:** Updated `exercise` schema with `ExerciseUpdate`.
*   **Step 3.34:** Created prompt for `Exercise` CRUD functions in `prompts/crud_exercise.md`.
*   **Step 3.35:** Created prompt for `Exercise` API router and tests in `prompts/api_exercises.md`.
*   **Step 3.36:** Generated `backend/app/crud/crud_exercise.py` using Copilot.
*   **Step 3.37:** Generated `backend/app/api/v1/endpoints/exercises.py` using Copilot.
*   **Step 3.38:** Updated `backend/app/api/v1/api.py` to include the `exercises` router.
*   **Step 3.39:** Generated `backend/app/tests/api/v1/test_exercises.py` using Copilot.
*   **Step 3.40:** Updated `health_metric` schema with `HealthMetricUpdate`.
*   **Step 3.41:** Created prompt for `HealthMetric` CRUD functions in `prompts/crud_health_metric.md`.
*   **Step 3.42:** Created prompt for `HealthMetric` API router and tests in `prompts/api_health_metrics.md`.
*   **Step 3.43:** Generated `backend/app/crud/crud_health_metric.py`.
*   **Step 3.44:** Generated `backend/app/api/v1/endpoints/health_metrics.py`.
*   **Step 3.45:** Updated `backend/app/api/v1/api.py` to include the `health_metrics` router.
*   **Step 3.46:** Generated `backend/app/tests/api/v1/test_health_metrics.py`.
*   **Step 3.47:** Updated `program_exercise` schema with `ProgramExerciseUpdate`.
*   **Step 3.48:** Created prompt for `ProgramExercise` CRUD functions in `prompts/crud_program_exercise.md`.
*   **Step 3.49:** Created prompt for `ProgramExercise` API router and tests in `prompts/api_program_exercises.md`.
*   **Step 3.50:** Generated `backend/app/crud/crud_program_exercise.py`.
*   **Step 3.51:** Generated `backend/app/api/v1/endpoints/program_exercises.py`.
*   **Step 3.52:** Updated `backend/app/api/v1/api.py` to include the `program_exercises` router.
*   **Step 3.53:** Generated `backend/app/tests/api/v1/test_program_exercises.py`.
*   **Step 3.54:** Updated `workout_session` schema with `WorkoutSessionUpdate`.
*   **Step 3.55:** Created prompt for `WorkoutSession` CRUD functions in `prompts/crud_workout_session.md`.
*   **Step 3.56:** Created prompt for `WorkoutSession` API router and tests in `prompts/api_workout_sessions.md`.
*   **Step 3.57:** Generated `backend/app/crud/crud_workout_session.py`.
*   **Step 3.58:** Generated `backend/app/api/v1/endpoints/workout_sessions.py`.
*   **Step 3.59:** Updated `backend/app/api/v1/api.py` to include the `workout_sessions` router.
*   **Step 3.60:** Generated `backend/app/tests/api/v1/test_workout_sessions.py`.
*   **Step 3.61:** Updated `exercise_log` schema with `ExerciseLogUpdate`.
*   **Step 3.62:** Created prompt for `ExerciseLog` CRUD functions in `prompts/crud_exercise_log.md`.
*   **Step 3.63:** Created prompt for `ExerciseLog` API router and tests in `prompts/api_exercise_logs.md`.
*   **Step 3.64:** Generated `backend/app/crud/crud_exercise_log.py`.
*   **Step 3.65:** Generated `backend/app/api/v1/endpoints/exercise_logs.py`.
*   **Step 3.66:** Updated `backend/app/api/v1/api.py` to include the `exercise_logs` router.
*   **Step 3.67:** Generated `backend/app/tests/api/v1/test_exercise_logs.py`.
