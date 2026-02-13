# ╔═══════════════════════════════════════════════════════════════╗
# ║  GUIDE DE DÉMARRAGE - SENELEC DIMENSIONNEMENT                ║
# ║  Démarrage Backend + Frontend                                ║
# ╚═══════════════════════════════════════════════════════════════╝

Write-Host "`n╔═══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  DÉMARRAGE COMPLET - SENELEC DIMENSIONNEMENT    ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$projectPath = "c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"
$backendPort = 3001
$frontendPort = 5000

# 1. Arrêter les anciens processus
Write-Host "⏹️ Arrêt des processus existants..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force 2>$null
Start-Sleep -Seconds 2

# 2. Vérifier PostgreSQL
Write-Host "📊 Vérification de PostgreSQL..." -ForegroundColor Cyan
$env:PGPASSWORD = 'jtmmaman96'
$result = & 'C:\Program Files\PostgreSQL\18\pgAdmin 4\runtime\psql.exe' -U postgres -h localhost -c "SELECT 1" 2>&1
if ($result -match "^\s*1\s*$") {
    Write-Host "✅ PostgreSQL est actif`n" -ForegroundColor Green
} else {
    Write-Host "⚠️ PostgreSQL: Vérifiez manuellement`n" -ForegroundColor Yellow
}

# 3. Information sur les URLs
Write-Host "╔═════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ INFORMATIONS DE DÉMARRAGE                              ║" -ForegroundColor Green
Write-Host "╠═════════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  🔗 ACCÈS:                                                  ║" -ForegroundColor Green
Write-Host "║  - Frontend:     http://localhost:$frontendPort                           ║" -ForegroundColor Green
Write-Host "║  - Test API:     http://localhost:$frontendPort/test-connection.html    ║" -ForegroundColor Green
Write-Host "║  - Backend API:  http://localhost:$backendPort/api                      ║" -ForegroundColor Green
Write-Host "║                                                             ║" -ForegroundColor Green
Write-Host "║  📁 RÉPERTOIRE: $projectPath" -ForegroundColor Green
Write-Host "║                                                             ║" -ForegroundColor Green
Write-Host "║  💡 DÉMARRAGE REQUIS:                                       ║" -ForegroundColor Green
Write-Host "║  Ouvrez 2 TERMINAUX PowerShell DIFFÉRENTS et exécutez:     ║" -ForegroundColor Green
Write-Host "║                                                             ║" -ForegroundColor Green
Write-Host "║  TERMINAL 1 - Backend:                                      ║" -ForegroundColor Green
Write-Host "║  cd `"$projectPath`"" -ForegroundColor Green
Write-Host "║  node server.js                                             ║" -ForegroundColor Green
Write-Host "║                                                             ║" -ForegroundColor Green
Write-Host "║  TERMINAL 2 - Frontend:                                     ║" -ForegroundColor Green
Write-Host "║  cd `"$projectPath`"" -ForegroundColor Green
Write-Host "║  npx http-server -p $frontendPort -c-1                    ║" -ForegroundColor Green
Write-Host "║                                                             ║" -ForegroundColor Green
Write-Host "╚═════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

# Ouvrir automatiquement le navigateur
Write-Host "🌐 Ouverture du navigateur..." -ForegroundColor Cyan
Start-Process "http://localhost:$frontendPort/test-connection.html"

Write-Host "✅ Configuration prête! Les deux terminaux doivent maintenant être ouverts.`n" -ForegroundColor Green
