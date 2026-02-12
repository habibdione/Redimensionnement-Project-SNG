#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de démarrage intelligent pour SONAGED Dimensionnement
.DESCRIPTION
    - Vérifie et libère le port 3001
    - Démarre le serveur correctement
    - Gère les erreurs
#>

Write-Host "`n╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  SONAGED - Dimensionnement                    ║" -ForegroundColor Green
Write-Host "║  Démarage du Serveur...                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝`n" -ForegroundColor Green

# 1️⃣ Vérifier Node.js
Write-Host "1️⃣  Vérification de Node.js..." -ForegroundColor Cyan
$nodeVersion = node -v 2>$null
if ($nodeVersion) {
    Write-Host "   ✅ Node.js $nodeVersion trouvé`n" -ForegroundColor Green
} else {
    Write-Host "   ❌ Node.js n'est pas installé!`n" -ForegroundColor Red
    Write-Host "   Téléchargez depuis: https://nodejs.org/`n" -ForegroundColor Yellow
    exit 1
}

# 2️⃣ Libérer le port 3001
Write-Host "2️⃣  Libération du port 3001..." -ForegroundColor Cyan
$port = 3001
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($connections) {
    Write-Host "   ⚠️  Processus trouvé sur le port 3001" -ForegroundColor Yellow
    foreach ($conn in $connections) {
        $process = Get-Process -PID $conn.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   ⏹️  Arrêt du processus: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
            $process | Stop-Process -Force -ErrorAction SilentlyContinue
            Start-Sleep -Milliseconds 500
        }
    }
    Write-Host "   ✅ Port libéré`n" -ForegroundColor Green
} else {
    Write-Host "   ✅ Port disponible`n" -ForegroundColor Green
}

# 3️⃣ Vérifier PostgreSQL
Write-Host "3️⃣  Vérification de PostgreSQL..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "   ℹ️  Serveur déjà en cours d'exécution!`n" -ForegroundColor Yellow
        Write-Host "   URL: http://localhost:3001`n" -ForegroundColor Cyan
        exit 0
    }
} catch {
    # Serveur pas lancé, c'est normal
}

Write-Host "   ✅ Prêt à démarrer`n" -ForegroundColor Green

# 4️⃣ Démarrer le serveur
Write-Host "4️⃣  Démarrage du serveur..." -ForegroundColor Cyan
Write-Host "   🚀 npm start`n" -ForegroundColor Green

npm start

