# 🔐 Demo Login Credentials

## Test User Account

```
Email:    test@example.com
Password: test1234
```

## Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs

## Quick Login Test

1. Go to http://localhost:3000
2. Click "Get Started" or "Go to Login"
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `test1234`
4. Click "Login"

## If Login Still Fails

### Option 1: Check Backend Logs
Look for 401 errors in the backend terminal

### Option 2: Check Browser Console
Press F12 and check for network errors

### Option 3: Reset Test User
Run this in backend directory:
```bash
python create_test_user.py
```

### Option 4: Test via API Docs
1. Go to http://localhost:8000/docs
2. Click on POST `/api/v1/auth/login/access-token`
3. Click "Try it out"
4. Enter:
   - username: `test@example.com`
   - password: `test1234`
5. Click "Execute"

## Creating Additional Users

### Via API
POST to http://localhost:8000/api/v1/trainees/

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "New",
  "last_name": "User"
}
```

### Via Script
Create a new Python script in `backend/`:

```python
from app.db.session import SessionLocal
from app.db import base
from app.models.trainee import Trainee, UserRole
from app.auth.token import get_password_hash

db = SessionLocal()
user = Trainee(
    email="your@email.com",
    first_name="First",
    last_name="Last",
    hashed_password=get_password_hash("yourpassword123"),
    role=UserRole.TRAINEE
)
db.add(user)
db.commit()
db.close()
```

## Troubleshooting Common Issues

### ❌ "Invalid email or password"
- **Cause**: Wrong credentials or user doesn't exist
- **Fix**: Run `python create_test_user.py` to reset

### ❌ "Network Error" or CORS issue  
- **Cause**: Backend not running or CORS misconfigured
- **Fix**: Check backend is running on port 8000

### ❌ 429 Too Many Requests
- **Cause**: Rate limiting (5 attempts per minute)
- **Fix**: Wait 60 seconds before trying again

### ❌ Password must contain at least one number
- **Cause**: Password validation requires alphanumeric
- **Fix**: Use passwords like `password123`, `test1234`, etc.

## Rate Limits

- Login: 5 attempts per minute
- Registration: 3 attempts per minute  
- API operations: 10 per minute (authenticated)

## Security Features Active

✅ Input validation on all fields
✅ SQL injection prevention
✅ XSS protection
✅ Rate limiting on authentication
✅ Password complexity requirements (min 8 chars, must have number)
✅ JWT token authentication
✅ Role-based access control

---

**Last Updated**: November 7, 2025
**Status**: ✅ Login working with updated auth.js
