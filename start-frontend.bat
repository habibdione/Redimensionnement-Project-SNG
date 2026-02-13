::═══════════════════════════════════════════════════════════════
:: SERVEUR FRONTEND - DIMENSIONNEMENT SENELEC
::═══════════════════════════════════════════════════════════════
:: Ce script lance le serveur HTTP pour servir les fichiers statiques
::

@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

cd /d "c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"

echo.
echo ╔═══════════════════════════════════════════════════╗
echo ║   SERVEUR FRONTEND - DIMENSIONNEMENT SENELEC     ║
echo ╚═══════════════════════════════════════════════════╝
echo.

REM Vérifier si http-server est installé
npm list http-server > nul 2>&1
if errorlevel 1 (
    echo 📥 Installation de http-server...
    call npm install -g http-server
)

echo.
echo 🚀 Lancement du serveur sur http://localhost:5000
echo.
echo 📝 Fichiers servis:
echo    ✓ index.html
echo    ✓ test-connection.html
echo.
echo 💡 Commandes utiles:
echo    - Test de connexion: http://localhost:5000/test-connection.html
echo    - Application principale: http://localhost:5000/index.html
echo    - Accueil: http://localhost:5000
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

REM Lancer le serveur sur le port 5000
call npx http-server -p 5000 -c-1 --cors
