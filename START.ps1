#!/usr/bin/env pwsh

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "DocSpot - Appointment Booking System" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $null = mongosh --eval "db.version()" 2>$null
} catch {
    Write-Host ""
    Write-Host "WARNING: MongoDB may not be running!" -ForegroundColor Yellow
    Write-Host "Please ensure MongoDB is running before proceeding." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Start MongoDB with: mongod" -ForegroundColor Gray
    Write-Host ""
}

# Backend
Write-Host ""
Write-Host "Setting up Backend Server..." -ForegroundColor Cyan
Set-Location server
npm install
Write-Host ""
Write-Host "Starting server (in new window)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
Start-Sleep -Seconds 3

# Frontend
Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Cyan
Set-Location ../client
npm install
Write-Host ""
Write-Host "Starting frontend..." -ForegroundColor Green
Write-Host ""

npm start
