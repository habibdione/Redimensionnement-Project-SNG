@echo off
REM Script d'initialisation pour Windows
REM Initialise PostgreSQL et lance le serveur

cls
echo.
echo ========================================
echo  SONAGED - Dimensionnement SNG
echo  Initialisation du Système
echo ========================================
echo.

REM Vérifier if npm est installé
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: npm n'est pas trouvé
    echo Installez Node.js depuis: https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si PostgreSQL est installé
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  WARNING: psql n'est pas dans le PATH
    echo Mais on va quand même essayer via Node.js...
)

echo.
echo 1️⃣ Installation des dépendances...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de npm install
    pause
    exit /b 1
)
echo ✅ Dépendances installées

echo.
echo 2️⃣ Initialisation de la base de données PostgreSQL...
call node setup-db.js
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de l'initialisation BD
    pause
    exit /b 1
)
echo ✅ Base de données initialisée

echo.
echo 3️⃣ Démarrage du serveur Express...
echo Le serveur démarre sur http://localhost:3001
echo.
call npm start

pause
