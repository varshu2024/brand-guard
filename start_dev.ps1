Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting BrandGuard Platform (Round 2 Build)..." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = Join-Path $PSScriptRoot "frontend"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm run dev"
Start-Sleep -Seconds 3

Start-Process "http://localhost:5173"
Write-Host "BrandGuard started successfully!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend API: http://127.0.0.1:8000" -ForegroundColor White
