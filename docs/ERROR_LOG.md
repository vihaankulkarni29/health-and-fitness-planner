# Error Log

**Purpose:** Track all failures, errors, and issues encountered during development with root cause analysis and resolution status.

**Last Updated:** November 4, 2025

---

## 1. Test Failures

### 1.1 Gym API Tests Failing After Auth Protection

**Error:**
```
FAILED tests/test_gyms_api.py::test_create_gym_success - KeyError: 'id'
FAILED tests/test_gyms_api.py::test_create_gym_duplicate_name_returns_400 - KeyError: 'id'
FAILED tests/test_gyms_api.py::test_read_gyms_list - KeyError: 'id'
FAILED tests/test_gyms_api.py::test_update_gym_success - KeyError: 'id'
FAILED tests/test_gyms_api.py::test_delete_gym_success - KeyError: 'id'

Root assertion failures show: 404 != 200 on POST /api/v1/gyms/
Response: {"detail": "Not Found"}
```

**Root Cause:**
- POST `/api/v1/gyms/` endpoint now requires authentication (protected with `get_current_user` dependency)
- Tests attempt to POST without providing authentication token
- FastAPI returns 404 for unauthenticated requests to protected endpoints
- Subsequent tests fail with KeyError because they expect `gym_id` from successful POST response

**Status:** ✅ **RESOLVED**

**Resolution:**
1. Created `auth_headers` fixture in `conftest.py` that:
   - Creates or reuses test user `testuser@example.com`
   - Logs in to get JWT token
   - Returns authentication headers dict
2. Updated all 5 gym tests to accept `auth_headers` parameter
3. Added `headers=auth_headers` to all authenticated POST requests
4. Fixed double prefix issue (router had `/gyms` prefix in both api.py and gyms.py)
5. Downgraded bcrypt from 5.0.0 to 4.1.3 for passlib compatibility
6. **Result: All 6 tests passing (6 passed, 19 warnings)**

**Files Modified:**
- `backend/tests/conftest.py` (added auth_headers fixture)
- `backend/tests/test_gyms_api.py` (added auth_headers parameter to all tests)
- `backend/app/api/v1/endpoints/gyms.py` (removed duplicate prefix)
- `backend/requirements.txt` (pinned bcrypt==4.1.3)

**Related Issues:** See [1.2 Test Directory Structure Confusion](#12-test-directory-structure-confusion)

---

### 1.2 Test Directory Structure Confusion

**Error:**
Two separate test directories exist with different fixture configurations:
- `backend/tests/` (old structure with test_gyms_api.py)
- `backend/app/tests/` (new structure with test_auth.py, test_gyms.py)

**Root Cause:**
- Tests were refactored into new location (`app/tests/`) but old tests remain in `tests/`
- `conftest.py` exists in `backend/tests/` but may not be discovered by tests in `backend/app/tests/`
- Duplicate test coverage (test_gyms_api.py vs test_gyms.py)

**Status:** ⚠️ **Unresolved** - Architectural decision needed

**Resolution Plan:**
1. Decide on single test directory structure (prefer `backend/tests/` for simplicity)
2. Consolidate fixtures in one `conftest.py`
3. Migrate or delete duplicate test files
4. Update pytest discovery configuration if needed

**Files Affected:**
- `backend/tests/conftest.py`
- `backend/tests/test_gyms_api.py`
- `backend/app/tests/api/v1/test_auth.py`
- `backend/app/tests/api/v1/test_gyms.py`

---

## 2. Dependency Issues

### 2.1 Bcrypt 5.0.0 Incompatible with Passlib 1.7.4

**Error:**
```
ValueError: password cannot be longer than 72 bytes, truncate manually if necessary (e.g. my_password[:72])
Raised during passlib bcrypt backend initialization
```

**Root Cause:**
- Bcrypt 5.0.0 removed the `__about__` attribute
- Passlib 1.7.4 tries to access `_bcrypt.__about__.__version__`
- During backend initialization, passlib runs a bug detection test with a 200+ byte password
- Bcrypt 5.0.0 enforces strict 72-byte limit, causing the test to fail

**Status:** ✅ **Resolved** - Downgraded bcrypt

**Resolution:**
```powershell
pip install "bcrypt==4.1.3"
```
- Downgraded from bcrypt 5.0.0 to 4.1.3
- Version 4.1.3 is compatible with passlib 1.7.4
- Updated `requirements.txt` to pin `bcrypt==4.1.3`

**Files Affected:**
- `backend/requirements.txt` (added bcrypt==4.1.3)

**Note:** When passlib releases a new version with bcrypt 5.x support, this pin can be removed.

---

### 2.2 SQLAlchemy 2.0.23 Incompatible with Python 3.13

**Error:**
```
AssertionError in sqlalchemy.sql.operations.py
Raised when importing SQLAlchemy with Python 3.13.7
```

---

### 2.2 SQLAlchemy 2.0.23 Incompatible with Python 3.13

**Error:**
```
AssertionError in sqlalchemy.sql.operations.py
Raised when importing SQLAlchemy with Python 3.13.7
```

**Root Cause:**
- SQLAlchemy 2.0.23 has compatibility issues with Python 3.13
- Internal assertion failure in SQLCoreOperations class initialization

**Status:** ✅ **Resolved** - Upgraded SQLAlchemy

**Resolution:**
- Upgraded SQLAlchemy from 2.0.23 to 2.0.44 using `pip install --upgrade sqlalchemy`
- Version 2.0.44 includes Python 3.13 compatibility fixes
- Updated `backend/requirements.txt` to require `sqlalchemy>=2.0.36`

**Files Affected:**
- `backend/requirements.txt`

**Timestamp:** Fixed during dependency installation phase

---

### 2.3 Missing Authentication Dependencies

**Error:**
```
ModuleNotFoundError: No module named 'jose'
ModuleNotFoundError: No module named 'passlib'
ModuleNotFoundError: No module named 'slowapi'
ModuleNotFoundError: No module named 'email_validator'
ModuleNotFoundError: No module named 'multipart'
```

**Root Cause:**
- Auth system implementation requires JWT, password hashing, and OAuth2 form support
- Security features require rate limiting
- Pydantic EmailStr validation requires email-validator
- Dependencies not installed in Python 3.13 environment

**Status:** ✅ **Resolved** - All dependencies installed

**Resolution:**
Installed all missing packages:
```powershell
pip install email-validator
pip install python-jose[cryptography] passlib[bcrypt]
pip install slowapi
pip install psycopg2-binary
pip install python-multipart
```

Installed versions:
- email-validator 2.3.0 (+ dnspython 2.8.0)
- python-jose 3.5.0 (+ ecdsa 0.19.1)
- passlib 1.7.4
- bcrypt 5.0.0
- slowapi 0.1.9 (+ limits 5.6.0, deprecated 1.3.1)
- psycopg2-binary 2.9.11
- python-multipart 0.0.20

**Files Affected:**
- `backend/requirements.txt` (updated with all dependencies)

**Installation Location:** `C:\Users\Vihaan\AppData\Roaming\Python\Python313\site-packages`

**Timestamp:** Fixed during dependency installation phase

---

## 3. Type-Checker Issues

### 3.1 Import Resolution Warnings (Non-Blocking)

**Error:**
```
IDE/Pylance warnings:
- "jose" is not a known member of module
- "passlib" is not a known member of module
- Import could not be resolved
```

**Root Cause:**
- Packages installed in user site-packages (`AppData\Roaming\Python\Python313`)
- IDE may not be indexing user site-packages correctly
- Type stubs may not exist for these packages

**Status:** ⚠️ **Non-Blocking** - Runtime works, IDE warnings only

**Workaround:**
- Code runs successfully despite warnings
- Imports resolve correctly at runtime
- Can be safely ignored or suppressed with `# type: ignore`

**Files Affected:**
- `backend/app/auth/token.py` (jose.jwt, jose.JWTError, passlib.context)
- `backend/app/auth/api.py` (jose.JWTError)

---

### 3.2 SQLAlchemy Column Type Comparison

**Error:**
```
Type-checker warning: Argument of type "Column[str | None]" cannot be assigned to parameter "plain_password" of type "str"
Occurs when comparing user.hashed_password with verify_password()
```

**Root Cause:**
- SQLAlchemy 2.0 uses Column objects that have complex typing
- Type-checker sees `user.hashed_password` as `Column[str | None]` not `str`
- Password comparison requires string, not Column object

**Status:** ✅ **Resolved** - Workaround applied

**Resolution:**
Added type cast to Any before accessing hashed_password:
```python
from typing import Any as _Any

user: Trainee | None = get_user_by_email(session, email=form_data.username)
if not user:
    raise HTTPException(...)

_user: _Any = user  # Cast to Any to avoid SQLAlchemy type issues
if not verify_password(form_data.password, _user.hashed_password):
    raise HTTPException(...)
```

**Files Affected:**
- `backend/app/auth/api.py`

---

### 3.3 Trainee Model Import Path

**Error:**
```
Type-checker error: "trainee" is not a known attribute of module "app.models"
Occurs in backend/app/api/v1/endpoints/gyms.py
```

**Root Cause:**
- Import statement `from app import models` requires accessing `models.trainee.Trainee`
- Type-checker cannot resolve nested module path
- `app/models/__init__.py` may not export trainee submodule correctly

**Status:** ✅ **Resolved** - Changed import path

**Resolution:**
Changed from:
```python
from app import models
# ...
current_user: models.trainee.Trainee = Depends(get_current_user)
```

To:
```python
from app.models.trainee import Trainee
# ...
current_user: Trainee = Depends(get_current_user)
```

**Files Affected:**
- `backend/app/api/v1/endpoints/gyms.py`

---

---

## 4. Integration Issues

### 4.1 Double Prefix in Gyms Router

**Error:**
```
AssertionError: {"detail":"Not Found"}
assert 404 == 200
POST to /api/v1/gyms/ returns 404 even with valid authentication
```

**Root Cause:**
- Router had duplicate prefix configuration:
  - In `api.py`: `api_router.include_router(gyms.router, prefix="/gyms")`
  - In `gyms.py`: `router = APIRouter(prefix="/gyms", tags=["gyms"])`
- This caused the actual endpoint path to be `/api/v1/gyms/gyms/` instead of `/api/v1/gyms/`
- Tests were sending requests to `/api/v1/gyms/` which didn't exist
- FastAPI returned 404 for non-existent routes

**Status:** ✅ **Resolved** - Removed duplicate prefix

**Resolution:**
Changed `backend/app/api/v1/endpoints/gyms.py`:
```python
# Before:
router = APIRouter(prefix="/gyms", tags=["gyms"])

# After:
router = APIRouter()
```

The prefix is now only defined in `api.py` where the router is included.

**Files Affected:**
- `backend/app/api/v1/endpoints/gyms.py`

**Note:** Check other endpoint routers (trainers, trainees, programs, etc.) for the same double-prefix issue.

---

### 4.2 Test User UNIQUE Constraint Violation

**Error:**
```
sqlalchemy.exc.IntegrityError: (sqlite3.IntegrityError) UNIQUE constraint failed: trainees.email
Raised when auth_headers fixture tries to create test user for second test
```

**Root Cause:**
- `auth_headers` fixture is function-scoped (runs for each test)
- Test database engine is session-scoped (shared across all tests)
- First test creates `testuser@example.com`
- Second test tries to create same user → UNIQUE constraint violation

**Status:** ✅ **Resolved** - Check before creating user

**Resolution:**
Updated `auth_headers` fixture to check if user exists before creating:
```python
from app.auth.crud import get_user_by_email

existing_user = get_user_by_email(db_session, email=user_in.email)
if not existing_user:
    create_user(db_session, obj_in=user_in)
```

Now fixture safely reuses existing test user across tests.

**Files Affected:**
- `backend/tests/conftest.py`

---

### 4.3 OAuth2PasswordRequestForm Requires Multipart

**Error:**
```
RuntimeError: python-multipart is required for OAuth2PasswordRequestForm
Raised when accessing POST /auth/login/access-token endpoint
```

**Root Cause:**
- `OAuth2PasswordRequestForm` expects form data, not JSON
- Form data parsing requires `python-multipart` package
- FastAPI doesn't auto-install this optional dependency

**Status:** ✅ **Resolved** - Installed python-multipart

**Resolution:**
```powershell
pip install python-multipart
```

Installed version: python-multipart 0.0.20

**Files Affected:**
- `backend/app/auth/api.py` (uses OAuth2PasswordRequestForm)
- `backend/requirements.txt` (added python-multipart)

---

### 4.4 Database Migration Not Applied

**Error:**
No runtime error yet, but Alembic migration exists but hasn't been applied to development database.

**Root Cause:**
- Migration `a1b2c3d4e5f6_add_hashed_password_to_trainees.py` created but not run
- Development database may not have `hashed_password` column yet
- Could cause runtime errors when creating trainees with passwords

**Status:** ⚠️ **Pending** - Migration exists but not applied

**Resolution Plan:**
```powershell
cd backend
alembic upgrade head
```

**Files Affected:**
- `backend/alembic/versions/a1b2c3d4e5f6_add_hashed_password_to_trainees.py`
- Development PostgreSQL database

---

## 5. Configuration Issues

### 5.1 CORS Allows All Origins (Security Risk)

**Error:**
Not an error per se, but security misconfiguration:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Allows ALL origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Root Cause:**
- Development convenience setting used in production-ready code
- Allows any website to make authenticated requests to API

**Status:** ⚠️ **Development OK, Production Risk**

**Resolution Plan:**
1. Add `CORS_ORIGINS` to `backend/app/core/config.py` settings
2. Use environment variable for allowed origins
3. Production: Set to specific frontend URLs only
4. Development: Can remain `["*"]` for local testing

**Files Affected:**
- `backend/app/main.py`
- `backend/app/core/config.py`

---

## 6. Warnings (Non-Critical)

### 6.1 Pydantic Deprecation Warnings

**Warning:**
```
PydanticDeprecatedSince20: `pydantic.config.ConfigDict` has been deprecated. Use `model_config` instead.
12 warnings from various schema files
```

**Root Cause:**
- Using Pydantic v1 `Config` class instead of v2 `model_config`
- Pydantic 2.x has different configuration syntax

**Status:** ⚠️ **Non-Breaking** - Deprecated but functional

**Resolution Plan:**
Update all schema files to use Pydantic v2 syntax:
```python
# Old (v1):
class Config:
    orm_mode = True

# New (v2):
model_config = ConfigDict(from_attributes=True)
```

**Files Affected:**
- All files in `backend/app/schemas/` (9 files)

---

### 6.2 SQLAlchemy MovedIn20Warning

**Warning:**
```
SADeprecationWarning: Calling declarative_base() without a metaclass parameter is deprecated
```

**Root Cause:**
- Using legacy SQLAlchemy declarative base syntax
- SQLAlchemy 2.0 prefers new DeclarativeBase approach

**Status:** ⚠️ **Non-Breaking** - Deprecated but functional

**Resolution Plan:**
Refactor to use SQLAlchemy 2.0 declarative base:
```python
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
```

**Files Affected:**
- `backend/app/db/base_class.py`

---

## Summary

### Critical Blockers (Preventing Production)
- ❌ **Database Migration**: Not applied to dev database (tests use SQLite, need PostgreSQL migration)
- ❌ **CORS Configuration**: Allows all origins (security risk)
- ⚠️ **Endpoint Protection Incomplete**: Only POST /gyms protected, need to protect PUT/DELETE across all resources

### Resolved Issues
- ✅ **Test Authentication**: Created auth_headers fixture, all 6 gym tests passing
- ✅ **Bcrypt Compatibility**: Downgraded to 4.1.3 for passlib compatibility
- ✅ **SQLAlchemy 2.0.23 → 2.0.44**: Python 3.13 compatibility
- ✅ **Double Prefix Bug**: Fixed gyms router duplicate prefix
- ✅ **UNIQUE Constraint**: Fixed test user creation in auth_headers
- ✅ **All authentication dependencies installed**
- ✅ **Type-checker errors in gyms.py fixed**
- ✅ **OAuth2 multipart dependency installed**

### Non-Blocking Issues
- ⚠️ IDE import resolution warnings (runtime works)
- ⚠️ Pydantic deprecation warnings (v1 → v2 syntax)
- ⚠️ SQLAlchemy deprecation warnings (declarative base)
- ⚠️ Test directory structure needs consolidation

---

## Next Actions

1. **High Priority**: Apply Alembic migration to dev database (`alembic upgrade head`)
2. **High Priority**: Configure CORS with environment-specific origins
3. **High Priority**: Check and fix double-prefix issue in other routers (trainers, trainees, programs, exercises, etc.)
4. **Medium**: Protect remaining PUT/DELETE endpoints across all resources
5. **Medium**: Consolidate test directory structure (tests/ vs app/tests/)
6. **Low**: Update Pydantic schemas to v2 syntax (orm_mode → from_attributes)
7. **Low**: Refactor SQLAlchemy declarative base to 2.0 style
8. **Low**: Fix datetime.utcnow() deprecation (use datetime.now(datetime.UTC))
