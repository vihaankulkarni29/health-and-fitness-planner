# Login Network Error - Diagnostic Guide

## Issue
Users experience "Network error" when attempting to login, even with correct credentials.

## Root Causes Identified

### 1. Backend Not Running
**Symptom:** Network error, no response from server  
**Solution:** Start FastAPI backend server

```powershell
# From backend folder
cd backend
uvicorn app.main:app --reload --port 8000
```

### 2. CORS Configuration Mismatch
**Current Config:** `backend/app/core/config.py`
```python
CORS_ORIGINS_STR: str = "http://localhost:3000,http://localhost:8000"
```

**Frontend API URL:** `frontend/src/api/client.js`
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
```

**Verify:** Both must match exactly (protocol + port).

### 3. Database Connection Issues
**Symptom:** Backend starts but crashes on auth requests  
**Solution:** Check SQLAlchemy database URI in `.env` or config

```bash
# Check backend logs for:
# "sqlalchemy.exc.OperationalError"
```

### 4. Missing Environment Variables
**Required in backend `.env`:**
```
SQLALCHEMY_DATABASE_URI=sqlite:///./fitness.db
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
```

## Diagnostic Steps

### Step 1: Verify Backend is Running
```powershell
curl http://localhost:8000
# Expected: {"message": "Hello World"}
```

### Step 2: Test Auth Endpoint Directly
```powershell
curl -X POST http://localhost:8000/api/v1/auth/login/access-token `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=vihaan.kulkarni@fitnessdemo.com&password=trainee123"
```

**Expected Response:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

**Error Responses:**
- `401`: Wrong credentials
- `404`: User not found (need to seed database)
- `500`: Database or server error
- No response: Backend not running

### Step 3: Check Browser Console
Open DevTools (F12) → Network tab → Attempt login

Look for:
- Request URL (should be `http://localhost:8000/api/v1/auth/login/access-token`)
- Status code
- Response body
- CORS errors (preflight failed)

### Step 4: Verify Database Seeded
```powershell
# Check if test users exist
cd backend
python -c "from app.db.session import SessionLocal; from app.models.trainee import Trainee; db = SessionLocal(); print(db.query(Trainee).filter_by(email='vihaan.kulkarni@fitnessdemo.com').first())"
```

## Quick Fix Checklist

- [ ] Backend server running on port 8000
- [ ] Database file exists and is accessible
- [ ] `.env` file has required variables
- [ ] CORS origins include `http://localhost:3000`
- [ ] Test user exists in database
- [ ] Frontend API_BASE_URL points to correct backend
- [ ] No firewall blocking localhost:8000

## Production Deployment Notes

When deploying:
1. Update `CORS_ORIGINS_STR` to include production domain
2. Set `REACT_APP_API_URL` environment variable for frontend build
3. Use HTTPS for both frontend and backend
4. Store `SECRET_KEY` securely (not in code)
5. Reduce `ACCESS_TOKEN_EXPIRE_MINUTES` to 15 min (already done)

## Fallback UI Enhancement

Added to `LoginPage.js`:
- Specific error messages per status code (401, 404, 422, 429)
- Network error detection (`!status`)
- User-friendly guidance for each error type

```javascript
if (!status) {
  setError('Network error. Check server availability.');
}
```

## Testing After Fix

1. Start backend: `uvicorn app.main:app --reload`
2. Start frontend: `npm start`
3. Navigate to http://localhost:3000/login
4. Use demo credentials:
   - Email: `vihaan.kulkarni@fitnessdemo.com`
   - Password: `trainee123`
5. Should redirect to dashboard on success

## Related Files
- `frontend/src/api/client.js` - API base URL
- `frontend/src/api/auth.js` - Login function
- `frontend/src/pages/LoginPage.js` - Error handling
- `backend/app/core/config.py` - CORS settings
- `backend/app/auth/api.py` - Login endpoint
