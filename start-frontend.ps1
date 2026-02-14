# ============================================
# DÉMARRER LE SERVEUR FRONTEND
# ============================================
# Ce script démarre le serveur web pour l'interface utilisateur

Write-Host "`n" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "🌐 DÉMARRAGE DU SERVEUR FRONTEND" -ForegroundColor Green
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "`n"

# Vérifier Node.js et npm
Write-Host "1️⃣  Vérification de Node.js et npm..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "   ✅ Node.js $nodeVersion trouvé" -ForegroundColor Green
    Write-Host "   ✅ npm $npmVersion trouvé" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js ou npm non trouvé" -ForegroundColor Red
    exit 1
}

# Afficher informations
Write-Host "`n" -ForegroundColor Cyan
Write-Host ("─" * 70) -ForegroundColor Cyan
Write-Host "📋 INFORMATIONS:" -ForegroundColor Cyan
Write-Host ("─" * 70) -ForegroundColor Cyan
Write-Host "`n   🖥️  Frontend:    http://localhost:5000" -ForegroundColor Cyan
Write-Host "   🔗 Backend:    http://localhost:3001 (doit être démarré aussi)" -ForegroundColor Yellow
Write-Host "`n   💡 Le frontend détecte automatiquement le backend" -ForegroundColor Cyan
Write-Host "      et synchronise les données quand disponible" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor Cyan

# Démarrer le serveur
Write-Host ("=" * 70) -ForegroundColor Green
Write-Host "2️⃣  DÉMARRAGE EN COURS..." -ForegroundColor Green
Write-Host ("=" * 70) -ForegroundColor Green
Write-Host "`n   📦 http-server -p 5000 -c-1 --cors" -ForegroundColor Cyan
Write-Host "`n"

npx http-server -p 5000 -c-1 --cors

Write-Host "`n⚠️  Serveur arrêté" -ForegroundColor Yellow
