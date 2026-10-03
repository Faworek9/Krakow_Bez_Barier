# Skrypt jednoczesnego uruchomienia backendu i frontendu bez Dockera
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Uruchamianie projektu Kraków Bez Barier (AccessKrakow)   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

# 1. Uruchomienie backendu w osobnym procesie
Write-Host "[1/2] Startowanie serwera FastAPI (port 8000)..." -ForegroundColor Green
$backendCmd = "cd '$root\backend'; if (Test-Path '.venv\Scripts\python.exe') { .\.venv\Scripts\python.exe run.py } else { python run.py }"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# 2. Uruchomienie frontendu w osobnym procesie
Write-Host "[2/2] Startowanie deweloperskiego serwera React (port 5173)..." -ForegroundColor Green
$frontendCmd = "`$env:Path = 'C:\Program Files\nodejs;' + `$env:Path; cd '$root\frontend'; & 'C:\Program Files\nodejs\npm.cmd' run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host ""
Write-Host "Aplikacja wystartowala!" -ForegroundColor Yellow
Write-Host "  -> Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  -> Backend API: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
