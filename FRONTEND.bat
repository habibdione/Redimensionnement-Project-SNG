@echo off
REM ═════════════════════════════════════════════════════════════
REM  TERMINAL 2 - DEMARRAGE DU FRONTEND
REM ═════════════════════════════════════════════════════════════

cd /d "c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"

echo.
echo ╔═════════════════════════════════════════════════════════╗
echo ║  FRONTEND - DIMENSIONNEMENT SENELEC                    ║
echo ╚═════════════════════════════════════════════════════════╝
echo.
echo 📍 Répertoire: %cd%
echo 🌐 Serveur Frontend: http://localhost:5000
echo 🧪 Test de connexion: http://localhost:5000/test-connection.html
echo 📝 Application: http://localhost:5000/index.html
echo.
echo ⏳ Démarrage en cours...
echo.

REM Lancer le serveur HTTP
call npx http-server -p 5000 -c-1 --cors

REM En cas d'erreur
if errorlevel 1 (
    echo.
    echo ❌ ERREUR! Appuyez sur une touche...
    pause
)
