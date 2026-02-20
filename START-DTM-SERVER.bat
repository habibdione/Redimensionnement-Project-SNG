@echo off
echo.
echo ======================================
echo SVP DTM CSV Server - Démarrage
echo ======================================
echo.

set PORT=3002

echo 📂 Répertoire de travail: %cd%
echo 🔍 Vérification du fichier DTM.csv...

if not exist "c:\Users\30100-23-SNG\OneDrive - sonaged\Bureau\DTM.csv" (
    echo ❌ ERREUR: DTM.csv introuvable!
    echo 📍 Chemin attendu: c:\Users\30100-23-SNG\OneDrive - sonaged\Bureau\DTM.csv
    pause
    exit /b 1
)

echo ✅ DTM.csv trouvé!
echo.
echo 🚀 Démarrage du serveur sur le port %PORT%...
echo 📊 Endpoint API: http://localhost:%PORT%/api/dtm-data
echo 🔍 Health check: http://localhost:%PORT%/api/health
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

node read-dtm-csv.js

pause
