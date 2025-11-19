# launch_app.ps1
Write-Host "🚀 Launching Health & Fitness Planner..." -ForegroundColor Cyan

# 1. Check Backend Environment
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  .env not found. Creating from example..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    # Generate a basic secret key
    $content = Get-Content "backend\.env"
    $content = $content -replace "changethis", "generated_secret_key_$(Get-Random)"
    Set-Content "backend\.env" $content
    Write-Host "✅ .env created." -ForegroundColor Green
}

# 2. Start Backend
Write-Host "Starting Backend..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd backend && python -m uvicorn app.main:app --reload"

# 3. Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd frontend && npm start"

# 4. Open Browser
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "✅ Systems launched! Check the new windows." -ForegroundColor Cyan
