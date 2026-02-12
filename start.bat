@echo off
REM Script de démarrage pour Windows
REM Dimensionnement SENELEC

cls
echo.
echo ╔═══════════════════════════════════════════════╗
echo ║   DIMENSIONNEMENT SENELEC - DÉMARRAGE        ║
echo ╚═══════════════════════════════════════════════╝
echo.

REM Vérifier Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé
    echo Téléchargez-le: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Vérifier PostgreSQL
where psql >nul 2>&1
if errorlevel 1 (
    echo ⚠️  PostgreSQL n'est pas dans le PATH
    echo Assurez-vous que PostgreSQL est installé et accessible
)

echo ✅ Dépendances vérifiées
echo.

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo 📦 Installation des dépendances npm...
    call npm install
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Démarrage de l'application...
echo.
echo Le serveur backend démarre sur le port 3001
echo Le frontend sera accessible sur le port 5000
echo.
echo Pour utiliser l'application:
echo 1. Ouvrez http://localhost:5000 dans votre navigateur
echo 2. Assurez-vous que PostgreSQL est en cours d'exécution
echo 3. Vérifiez la base de données dans pgAdmin
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

REM Démarrer le serveur
call npm start

pause
