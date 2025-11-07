@echo off
cls
echo ================================
echo   STARTING BACKEND SERVER
echo ================================
echo.
cd /d C:\Users\Vihaan\Desktop\Planner\backend
python -m uvicorn app.main:app --reload
