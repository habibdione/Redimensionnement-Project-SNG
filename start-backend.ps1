# ============================================
# DÉMARRER LE SERVEUR BACKEND
# ============================================
# Ce script démarre le serveur Node.js pour la synchronisation des données

Write-Host "`n" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "🚀 DÉMARRAGE DU SERVEUR BACKEND" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "`n"

# Vérifier Node.js
Write-Host "1️⃣  Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js $nodeVersion trouvé" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js non trouvé" -ForegroundColor Red
    exit 1
}

# Vérifier .env
Write-Host "`n2️⃣  Vérification du fichier .env..." -ForegroundColor Yellow
if (Test-Path ".\.env") {
    Write-Host "   ✅ Fichier .env trouvé" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Fichier .env non trouvé - Création avec valeurs par défaut" -ForegroundColor Yellow
    @"
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senelec_dimensionnement
PORT=3001
NODE_ENV=production
"@ | Out-File -Encoding UTF8 -FilePath .\.env
    Write-Host "   ✅ Fichier .env créé" -ForegroundColor Green
}

# Afficher informations du serveur
Write-Host "`n" -ForegroundColor Cyan
Write-Host ("─" * 70) -ForegroundColor Cyan
Write-Host "📋 INFORMATIONS DU SERVEUR:" -ForegroundColor Cyan
Write-Host ("─" * 70) -ForegroundColor Cyan
Write-Host "`n   🌐 Backend:   http://localhost:3001" -ForegroundColor Cyan
Write-Host "   📱 Frontend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "`n   🏥 Health:    http://localhost:3001/api/health" -ForegroundColor Cyan
Write-Host "   📊 Données:   http://localhost:3001/api/collectes" -ForegroundColor Cyan
Write-Host "   📈 Stats:     http://localhost:3001/api/statistiques" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor Cyan

# Démarrer le serveur
Write-Host ("=" * 70) -ForegroundColor Green
Write-Host "3️⃣  DÉMARRAGE EN COURS..." -ForegroundColor Green
Write-Host ("=" * 70) -ForegroundColor Green
Write-Host "`n"

node server.js

Write-Host "`n⚠️  Serveur arrêté" -ForegroundColor Yellow
