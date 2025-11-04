### Prompt 1: Code Quality and Consistency Audit

This prompt directs Copilot to act as a meticulous code reviewer, ensuring the entire codebase is clean, consistent, and adheres to best practices.

```markdown
# GitHub Copilot: Code Quality and Consistency Audit

You are a strict code auditor for a FastAPI application. Your task is to analyze the entire codebase for inconsistencies, potential bugs, and deviations from best practices.

**Instructions:**

1.  **Analyze all Python files** in the `backend/app` directory.
2.  **Identify and fix the following issues:**
    *   **Inconsistent Naming:** Ensure all variables, functions, and classes follow a consistent `snake_case` for variables and functions, and `PascalCase` for classes.
    *   **Magic Strings:** Replace all status strings (e.g., "in-progress", "completed") with a robust `Enum`. Create a new file at `backend/app/schemas/enums.py` to store all status enums.
    *   **Missing or Inconsistent Docstrings:** Ensure all functions, classes, and modules have clear and consistent docstrings that explain their purpose, arguments, and return values.
    *   **Type Hinting:** Verify that all functions have proper type hints for their arguments and return values. Add or correct any missing or incorrect type hints.
    *   **Error Handling:** Review the error handling logic. Ensure that appropriate HTTP exceptions are raised with clear and informative detail messages.
    *   **Redundant Code:** Identify and refactor any redundant or duplicated code.
3.  **Provide a summary of the changes made** for each file.
```

### Prompt 2: Security Audit

This prompt transforms Copilot into a security expert, tasked with finding and mitigating potential vulnerabilities.

```markdown
# GitHub Copilot: Security Audit

You are a security auditor for a FastAPI application. Your task is to perform a security audit of the codebase and fix any vulnerabilities you find.

**Instructions:**

1.  **Analyze all Python files** in the `backend/app` directory.
2.  **Focus on the following security concerns:**
    *   **Input Validation:** Review all API endpoints to ensure that incoming data is properly validated by the Pydantic models. Pay close attention to potential edge cases and malicious inputs.
    *   **Authentication and Authorization:** Since we have not yet implemented authentication, add comments (`# TODO: Add authentication and authorization`) to all endpoints that create, update, or delete data.
    *   **Sensitive Data Exposure:** Ensure that no sensitive data (e.g., passwords, API keys) is ever leaked in API responses or logs. Double-check all Pydantic schemas used in response models.
3.  **Provide a summary of the security-related changes and recommendations** for each file.
```

### Prompt 3: Performance Audit

This prompt directs Copilot to analyze the code for performance bottlenecks and suggest optimizations.

```markdown
# GitHub Copilot: Performance Audit

You are a performance engineer for a FastAPI application. Your task is to analyze the codebase for potential performance bottlenecks and suggest improvements.

**Instructions:**

1.  **Analyze all Python files** in the `backend/app` directory.
2.  **Focus on the following performance aspects:**
    *   **Database Queries:** Review all database interactions. Identify any opportunities to optimize queries, such as using `joinedload` to reduce the number of queries when fetching related objects. Add comments with your suggestions.
    *   **Asynchronous Operations:** Our current setup uses a synchronous database driver. Add comments (`# NOTE: Consider using an async database driver for improved performance`) to all database-dependent functions to note this potential future improvement.
3.  **Provide a summary of the performance-related suggestions** for each file.
```
