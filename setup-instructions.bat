@echo off
REM ╔══════════════════════════════════════════════════════════════╗
REM ║  GUIDE DE CONFIGURATION - SENELEC DIMENSIONNEMENT           ║
REM ╚══════════════════════════════════════════════════════════════╝

echo.
echo ╔═════════════════════════════════════════════════════════════╗
echo ║  CONFIGURATION - SENELEC DIMENSIONNEMENT                   ║
echo ║  Ouvrez 2 terminaux separés pour démarrer le projet        ║
echo ╚═════════════════════════════════════════════════════════════╝
echo.

set "projectPath=c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"

echo.
echo  TERMINAL 1 - LANCER LE BACKEND
echo ─────────────────────────────────────
echo Copiez cette commande dans PowerShell ou CMD:
echo.
echo cd "%projectPath%"
echo node server.js
echo.
echo.
echo  TERMINAL 2 - LANCER LE FRONTEND  
echo ─────────────────────────────────────
echo Copiez cette commande dans PowerShell ou CMD:
echo.
echo cd "%projectPath%"
echo npx http-server -p 5000 -c-1
echo.
echo.
echo  ACCES AUX SERVICES
echo ─────────────────────────────────────
echo - Frontend:      http://localhost:5000
echo - Test API:      http://localhost:5000/test-connection.html
echo - Backend API:   http://localhost:3001/api
echo - Health Check:  http://localhost:3001/api/health
echo.
echo.
echo Appuyez sur une touche...
pause > nul
