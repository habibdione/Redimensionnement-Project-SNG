@echo off
REM Script de démarrage SONAGED
setlocal enableDelayedExpansion

cls
echo.
echo ========================================
echo  SONAGED - Dimensionnement SNG
echo  Démarrage du Serveur
echo ========================================
echo.

REM 1. Arrêter les processus Node.js sur le port 3001
echo 1) Libération du port 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    echo   - Arrêt du processus PID %%a
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

REM 2. Vérifier Node.js
echo 2) Vérification de Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   ERREUR: Node.js non installé
    pause
    exit /b 1
)
for /f "delims=" %%v in ('node --version') do echo   OK: %%v

REM 3. Vérifier npm
echo 3) Vérification de npm...
npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   ERREUR: npm non installé
    pause
    exit /b 1
)
for /f "delims=" %%v in ('npm --version') do echo   OK: %%v

echo.
echo 4) Démarrage du serveur...
echo.
npm start

pause
