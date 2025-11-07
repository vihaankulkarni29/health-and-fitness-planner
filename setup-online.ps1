# Quick Setup Script for Online Demo

Write-Host "`n🚀 SETTING UP ONLINE DEMO`n" -ForegroundColor Cyan

# Step 1: Update backend CORS
Write-Host "Step 1: Updating backend CORS settings..." -ForegroundColor Yellow
$backendEnv = @"
SQLALCHEMY_DATABASE_URI=sqlite:///C:/Users/Vihaan/Desktop/Planner/backend/dev.db
CORS_ORIGINS_STR=http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000,https://old-ducks-brush.loca.lt,https://clean-bars-sip.loca.lt,https://*.loca.lt
"@
$backendEnv | Out-File -FilePath "C:\Users\Vihaan\Desktop\Planner\backend\.env" -Encoding UTF8
Write-Host "✅ Backend .env updated" -ForegroundColor Green

# Step 2: Create frontend .env
Write-Host "`nStep 2: Creating frontend .env with tunnel URL..." -ForegroundColor Yellow
$frontendEnv = @"
REACT_APP_API_URL=https://clean-bars-sip.loca.lt/api/v1
"@
$frontendEnv | Out-File -FilePath "C:\Users\Vihaan\Desktop\Planner\frontend\.env" -Encoding UTF8  
Write-Host "✅ Frontend .env created" -ForegroundColor Green

# Step 3: Instructions
Write-Host "`n📋 NEXT STEPS:`n" -ForegroundColor Cyan
Write-Host "1. Restart Backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   python -m uvicorn app.main:app --reload`n" -ForegroundColor Gray

Write-Host "2. Restart Frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm start`n" -ForegroundColor Gray

Write-Host "3. Start Tunnels (in separate terminals):" -ForegroundColor White
Write-Host "   lt --port 3000" -ForegroundColor Gray
Write-Host "   lt --port 8000`n" -ForegroundColor Gray

Write-Host "4. Access your app at:" -ForegroundColor White
Write-Host "   https://old-ducks-brush.loca.lt`n" -ForegroundColor Green

Write-Host "🔐 Login Credentials:" -ForegroundColor Cyan
Write-Host "   Trainee: vihaan.kulkarni@fitnessdemo.com / trainee123" -ForegroundColor White
Write-Host "   Trainer: rohit.wagh@fitnessdemo.com / trainer123`n" -ForegroundColor White

Write-Host "✅ Setup complete! Follow the steps above to go online.`n" -ForegroundColor Green
