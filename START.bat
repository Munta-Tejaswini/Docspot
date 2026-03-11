@echo off
REM Quick Start for DocSpot - Windows Batch Script

echo.
echo ====================================
echo DocSpot - Appointment Booking System
echo ====================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB...
mongosh --eval "db.version()" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: MongoDB may not be running!
    echo Please ensure MongoDB is running before starting the server.
    echo.
    echo Start MongoDB with: mongod
    echo Or visit: https://docs.mongodb.com/manual/installation/
    echo.
)

echo.
echo Starting Backend Server...
echo.
cd server
call npm install
start cmd /k "npm start"

echo Waiting for server to start...
timeout /t 3 /nobreak

echo.
echo Starting Frontend...
echo.
cd ../client
call npm install
call npm start

echo.
echo Application is starting!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
