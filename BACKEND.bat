@echo off
REM ═════════════════════════════════════════════════════════════
REM  TERMINAL 1 - DEMARRAGE DU BACKEND
REM ═════════════════════════════════════════════════════════════

cd /d "c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"

echo.
echo ╔═════════════════════════════════════════════════════════╗
echo ║  BACKEND - DIMENSIONNEMENT SENELEC                     ║
echo ╚═════════════════════════════════════════════════════════╝
echo.
echo 📍 Répertoire: %cd%
echo 🚀 Démarrage du serveur sur http://localhost:3001
echo 📊 API: http://localhost:3001/api
echo.
echo ⏳ Démarrage en cours...
echo.

REM Vérifier que node_modules existe
if not exist "node_modules" (
    echo 📥 Installation des dépendances npm...
    call npm install
)

REM Lancer le serveur
node server.js

REM En cas d'erreur
if errorlevel 1 (
    echo.
    echo ❌ ERREUR! Appuyez sur une touche...
    pause
)
