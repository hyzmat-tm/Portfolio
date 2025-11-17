@echo off
echo ========================================
echo   Portfolio Full Stack Launcher
echo ========================================
echo.
echo Starting Backend Server...
start cmd /k "cd server && npm install && npm start"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Application...
start cmd /k "npm install && npm run dev"
echo.
echo ========================================
echo   Both servers are starting!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo   Admin:    http://localhost:5173/login
echo ========================================
