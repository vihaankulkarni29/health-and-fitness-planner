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
