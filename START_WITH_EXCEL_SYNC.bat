@echo off
REM =================================================
REM DEMARRAGE DU SERVEUR AVEC SYNCHRONISATION EXCEL
REM =================================================

echo.
echo ╔════════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                                ║
echo ║  🚀 SONAGED - DIMENSIONNEMENT AVEC SYNCHRONISATION EXCEL                      ║
echo ║  ═══════════════════════════════════════════════════════════════════════════  ║
echo ║                                                                                ║
echo ║  ✨ Le serveur est en cours de démarrage...                                   ║
echo ║     Les collectes seront automatiquement synchronisées dans Excel             ║
echo ║                                                                                ║
echo ╚════════════════════════════════════════════════════════════════════════════════╝
echo.

REM Vérifier que Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERREUR: Node.js n'est pas installé ou introuvable
    echo.
    echo 💡 Solutions:
    echo    1. Installez Node.js depuis https://nodejs.org
    echo    2. Redémarrez votre terminal après installation
    echo    3. Pour vérifier: node --version
    echo.
    pause
    exit /b 1
)

REM Vérifier que les dépendances sont installées
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ ERREUR: Impossible d'installer les dépendances
        pause
        exit /b 1
    )
)

REM Vérifier que le fichier Excel est accessible
set EXCEL_PATH=c:\Users\30100-23-SNG\OneDrive - sonaged\ESPACE DE TRAVAIL\SONAGED\COMMUNES D'INTERVENTION\SUPPORT\DOSSIER DR\DIMENSIONNEMENT\DIMENSIONNEMENT.xlsx

if not exist "%EXCEL_PATH%" (
    echo ⚠️  AVERTISSEMENT: Le fichier Excel n'a pas pu être trouvé
    echo    Chemin: %EXCEL_PATH%
    echo.
    echo 💡 Vérifiez que:
    echo    1. OneDrive est synchronisé et accessible
    echo    2. Le chemin est correct dans export-excel-sync.js
    echo.
)

REM Démarrer le serveur
echo.
echo ═══════════════════════════════════════════════════════════════════════════════
echo ℹ️  Accédez à l'application: http://localhost:3001
echo ℹ️  API disponible: http://localhost:3001/api
echo ═══════════════════════════════════════════════════════════════════════════════
echo.

node server.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Le serveur s'est arrêté anormalement (Code: %ERRORLEVEL%)
    echo.
    echo 💡 Solutions possibles:
    echo    1. Le port 3001 est peut-être déjà utilisé
    echo       Attendre quelques secondes et relancer
    echo    2. La base de données PostgreSQL n'est pas accessible
    echo       Vérifier que PostgreSQL est en cours d'exécution
    echo    3. Voir les logs ci-dessus pour plus de détails
    echo.
)

pause
