@echo off
echo ========================================================
echo Starting BrandGuard Full-Stack Platform...
echo ========================================================

start "BrandGuard Backend (FastAPI)" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 2 /nobreak >nul

start "BrandGuard Frontend (Vite React)" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul

start http://localhost:5173
echo.
echo BrandGuard running at:
echo Frontend: http://localhost:5173
echo Backend API: http://127.0.0.1:8000
echo API Docs: http://127.0.0.1:8000/docs
echo ========================================================
