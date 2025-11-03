# Phase 2 Log: Database Modeling & API Schemas

**Goal:** Translate the ERD from the diagram into Python code.

---

### To-Dos:

*   [x] Get ERD information from the user.
*   [ ] Create SQLAlchemy models for all tables.
*   [ ] Create Pydantic schemas for all models.

---

### Execution Log:

*   **Step 2.1:** Received ERD information and created `docs/ERD.md`.
*   **Step 2.2:** Created `prompts` directory for GitHub Copilot prompts.
*   **Step 2.3:** Set up database configuration (`core/config.py`) and declarative base (`db/base_class.py`).
*   **Step 2.4:** Created SQLAlchemy model for `Gym` in `models/gym.py`.
*   **Step 2.5:** Created Pydantic schemas for `Gym` in `schemas/gym.py`.
*   **Step 2.6:** Created SQLAlchemy model for `Trainer` in `models/trainer.py` and updated `Gym` model with relationship.
*   **Step 2.7:** Created Pydantic schemas for `Trainer` in `schemas/trainer.py`.
*   **Step 2.8:** Created SQLAlchemy model for `Program` in `models/program.py`.
*   **Step 2.9:** Created SQLAlchemy model for `Trainee` in `models/trainee.py`.
*   **Step 2.10:** Updated `Gym`, `Trainer`, and `Program` models with `trainee` relationships.
*   **Step 2.11:** Created Pydantic schemas for `Program` in `schemas/program.py`.
*   **Step 2.12:** Created Pydantic schemas for `Trainee` in `schemas/trainee.py`.
*   **Step 2.13:** Created SQLAlchemy model for `HealthMetric` in `models/health_metric.py` and updated `Trainee` model.
*   **Step 2.14:** Created Pydantic schemas for `HealthMetric` in `schemas/health_metric.py`.
*   **Step 2.15:** Created SQLAlchemy model for `Exercise` in `models/exercise.py`.
*   **Step 2.16:** Created Pydantic schemas for `Exercise` in `schemas/exercise.py`.
