# Backend Development Plan: Fitness Tracker

This document outlines the comprehensive plan for developing the backend of the fitness tracker application.

**Note:** A detailed log, including steps, commands, and outcomes for each phase will be maintained in a separate `PHASE_X_LOG.md` file within this `docs` directory.

**Current Progress: 0%**

---

### **Phase 1: Project Setup & Foundation (0% -> 15%)**

**Goal:** Establish a clean, professional project structure and a runnable "Hello World" FastAPI application.

**Steps:**
1.  **Initialize Virtual Environment:** Create an isolated space for our Python packages.
2.  **Install Dependencies:** Install core tools: `fastapi`, `uvicorn`, `SQLAlchemy`, `psycopg2-binary`, `alembic`.
3.  **Create Directory Structure:** Create a scalable folder structure (`/app`, `/app/models`, `/app/schemas`, etc.).
4.  **"Hello World" Endpoint:** Create a `main.py` to confirm the setup is working.

**Security Focus:** Use `Alembic` from the start to ensure all database changes are version-controlled and repeatable.

**Agentic AI Role:** Provide exact shell commands for setup and initial code.

---

### **Phase 2: Database Modeling & API Schemas (15% -> 40%)**

**Goal:** Translate the ERD from the diagram into Python code.

**Steps:**
1.  **SQLAlchemy Models (`app/models`):** Define tables (`Gym`, `Trainer`, `Member`, etc.) as Python classes.
2.  **Pydantic Schemas (`app/schemas`):** Define the shape of API data for requests and responses.

**Security Focus:** Create separate schemas for input and output to prevent leaking sensitive data in API responses.

**Agentic AI Role:** Write the complete, commented code for all SQLAlchemy models and Pydantic schemas.

**GitHub Copilot Prompts:**
*   `# Create a SQLAlchemy model for a Member with fields: id, name, email, and a foreign key to the Gym table.`
*   `# Create Pydantic schemas for the Member model: MemberBase, MemberCreate for input, and Member for output.`

---

### **Phase 3: API Endpoint & CRUD Logic (40% -> 75%)**

**Goal:** Build the actual API endpoints that the Flutter app will call.

**Steps:**
1.  **Database Connection:** Set up the logic to connect to the database.
2.  **CRUD Functions:** Create Create, Read, Update, Delete functions for each model.
3.  **API Routers:** Expose the CRUD functions as API endpoints.

**Security Focus:** Implement robust authentication using **OAuth2**. Use FastAPI's Pydantic integration to automatically validate all incoming data.

**Agentic AI Role:** Generate code for database session management, all CRUD functions, API routers, and the standard code for setting up OAuth2.

**GitHub Copilot Prompts:**
*   `# Create a FastAPI dependency to get a database session.`
*   `# Write a CRUD function to create a member in the database.`
*   `# Create a FastAPI POST endpoint at /members/ to create a new member, protected by OAuth2.`

---

### **Phase 4: Business Logic, Testing & Finalization (75% -> 100%)**

**Goal:** Implement complex logic, ensure reliability through tests, and prepare for deployment.

**Steps:**
1.  **Implement Business Logic:** Code specific rules (e.g., assigning a program to a member).
2.  **Write Tests:** Use `pytest` to create automated tests.
3.  **Configuration Management:** Move sensitive data (like database passwords) into environment variables.

**Security Focus:** Use `pip-audit` to scan dependencies for known vulnerabilities. Store secrets in environment variables.

**Agentic AI Role:** Generate unit tests, integration tests, and help refactor the code to use a secure configuration setup.

**GitHub Copilot Prompts:**
*   `# Write a pytest for the create member endpoint, testing for success and failure cases.`
*   `# Use Pydantic's BaseSettings to load the DATABASE_URL from an environment variable.`
