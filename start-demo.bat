@echo off
echo.
echo ====================================
echo   HEALTH & FITNESS PLANNER - ONLINE
echo ====================================
echo.
echo Starting servers and tunnels...
echo.

REM Start backend
start "Backend Server" cmd /k "cd backend && python -m uvicorn app.main:app --reload"
timeout /t 3 /nobreak > nul

REM Start frontend  
start "Frontend Server" cmd /k "cd frontend && npm start"
timeout /t 5 /nobreak > nul

REM Start backend tunnel
start "Backend Tunnel" cmd /k "lt --port 8000"
timeout /t 2 /nobreak > nul

REM Start frontend tunnel
start "Frontend Tunnel" cmd /k "lt --port 3000"

echo.
echo ====================================
echo   ALL SERVERS STARTED!
echo ====================================
echo.
echo Wait 30 seconds for everything to load, then:
echo.
echo 1. Check the "Frontend Tunnel" window for your public URL
echo 2. Open that URL in your browser
echo 3. Login with: vihaan.kulkarni@fitnessdemo.com / trainee123
echo.
echo Press any key to open localhost frontend...
pause > nul

start http://localhost:3000
