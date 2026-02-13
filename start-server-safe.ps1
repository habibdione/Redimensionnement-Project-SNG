# Script de démarrage sécurisé du serveur

Write-Host "🚀 Démarrage du serveur SENELEC Dimensionnement..." -ForegroundColor Cyan

# Vérifier les processus Node.js actifs
$activeNodes = Get-Process node -ErrorAction SilentlyContinue
if ($activeNodes) {
    Write-Host "⚠️  Processus Node.js existants détectés. Arrêt..." -ForegroundColor Yellow
    Stop-Process -Name node -Force
    Start-Sleep -Seconds 2
}

# Vérifier PostgreSQL
Write-Host "📊 Vérification de PostgreSQL..." -ForegroundColor Cyan
try {
    $env:PGPASSWORD='jtmmaman96'
    & 'C:\Program Files\PostgreSQL\18\pgAdmin 4\runtime\psql.exe' -U postgres -h localhost -c "SELECT 1" > $null 2>&1
    Write-Host "✅ PostgreSQL actif" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur PostgreSQL: $_" -ForegroundColor Red
    exit 1
}

# Démarrer le serveur
Write-Host "🔧 Lancement du serveur..." -ForegroundColor Cyan
cd "c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"

# Vérifier les dépendances
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installation des dépendances npm..." -ForegroundColor Yellow
    npm install
}

# Lancer le serveur
node server.js
