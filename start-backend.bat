@echo off
echo ========================================
echo   Starting Portfolio Backend Server
echo ========================================
echo.
cd server
echo Installing dependencies...
call npm install
echo.
echo Starting server on http://localhost:3001
echo Press Ctrl+C to stop the server
echo.
call npm start
