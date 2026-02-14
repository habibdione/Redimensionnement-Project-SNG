@echo off
REM Vérifie l'état du serveur et de la base de données
setlocal enabledelayedexpansion

cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║      VÉRIFICATION STATUT SYNCHRONISATION SERVEUR            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Vérifier PowerShell
powershell -Command "Get-Host" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ PowerShell disponible
) else (
    echo ⚠️  PowerShell non trouvé
)

REM Vérifier Node.js
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do (
        echo ✅ Node.js %%i
    )
) else (
    echo ❌ Node.js non trouvé - Installez-le: https://nodejs.org
    goto :error
)

REM Vérifier npm
npm --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm --version') do (
        echo ✅ npm v%%i
    )
) else (
    echo ❌ npm non trouvé
    goto :error
)

REM Vérifier PostgreSQL
psql --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('psql --version') do (
        echo ✅ %%i
    )
) else (
    echo ⚠️  PostgreSQL CLI non trouvé (les données seront quand même sauvegardées)
)

echo.
echo Vérification des fichiers...

REM Vérifier package.json
if exist "package.json" (
    echo ✅ package.json trouvé
) else (
    echo ❌ package.json non trouvé
    goto :error
)

REM Vérifier .env
if exist ".env" (
    echo ✅ .env trouvé
) else (
    echo ❌ .env non trouvé - Créez-le avec les variables PostgreSQL
    goto :error
)

REM Vérifier node_modules
if exist "node_modules" (
    echo ✅ node_modules trouvé
) else (
    echo ⚠️  node_modules non trouvé - Executing: npm install
    call npm install
)

echo.
echo 🚀 ÉTAT DU SERVEUR:
echo.

REM Vérifier si le serveur répond
timeout /t 1 /nobreak >nul
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/health' -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { return 0 } else { return 1 } } catch { return 1 }" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Serveur ACTIF sur http://localhost:3001
    echo ✅ API accessible: http://localhost:3001/api
) else (
    echo ⚠️  Serveur NON ACTIF (lancez: npm start)
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║            RÉSUMÉ: TOUT EST PRÊT!                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📋 PROCHAINES ACTIONS:
echo.
echo    1. Lancer le serveur:
echo       $ npm start
echo.
echo    2. Ouvrir l'app:
echo       → http://localhost:3001
echo.
echo    3. Tester la sauvegarde:
echo       $ npm run test:save
echo.
echo ℹ️  Pour arrêter le serveur: Ctrl+C
echo.

goto :end

:error
echo.
echo ❌ ERREUR: Veuillez installer les dépendances manquantes
echo.
pause
exit /b 1

:end
pause
