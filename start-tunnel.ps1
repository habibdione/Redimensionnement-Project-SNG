# ============================================
# LANCER LE TUNNEL DEVTUNNELS
# ============================================
# Expose localhost:3001 à GitHub Pages

Write-Host "`n" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan
Write-Host "🚀 TUNNEL DEVTUNNELS - GitHub Pages ↔ Backend Local" -ForegroundColor Green
Write-Host ("=" * 80) -ForegroundColor Cyan

Write-Host "`n📋 CE TUNNEL FAIT:`n" -ForegroundColor Yellow
Write-Host "   1. Expose localhost:3001 publiquement" -ForegroundColor Cyan
Write-Host "   2. GitHub Pages pourra envoyer les données au backend" -ForegroundColor Cyan
Write-Host "   3. Les données se sauvegardent en PostgreSQL" -ForegroundColor Cyan

Write-Host "`n" -ForegroundColor Cyan
Write-Host ("─" * 80) -ForegroundColor Cyan
Write-Host "🔍 PRÉREQUIS:" -ForegroundColor Yellow
Write-Host ("─" * 80) -ForegroundColor Cyan

# Vérifier devtunnels CLI
Write-Host "`n1️⃣  Vérification DevTunnels CLI..." -ForegroundColor Yellow
try {
    $version = devtunnel --version
    Write-Host "   ✅ DevTunnels CLI trouvé: $version" -ForegroundColor Green
} catch {
    Write-Host "   ❌ DevTunnels CLI pas trouvé" -ForegroundColor Red
    Write-Host "`n   Installation:" -ForegroundColor Yellow
    Write-Host "   Windows: choco install devtunnels-cli" -ForegroundColor Cyan
    Write-Host "   Ou télécharger: https://aka.ms/devtunnels/clients" -ForegroundColor Cyan
    exit 1
}

# Vérifier Backend
Write-Host "`n2️⃣  Vérification Backend (localhost:3001)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 2 -SkipCertificateCheck
    Write-Host "   ✅ Backend détecté" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Backend pas démarré" -ForegroundColor Yellow
    Write-Host "   → Assurez-vous que npm start tourne dans un autre terminal!" -ForegroundColor Yellow
    Write-Host "   → Continuant de toute façon..." -ForegroundColor Yellow
}

# Lancer le tunnel
Write-Host "`n" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan
Write-Host "3️⃣  LANCEMENT DU TUNNEL" -ForegroundColor Green
Write-Host ("=" * 80) -ForegroundColor Cyan

Write-Host "`n   ⏳ Attendre le message avec l'URL du tunnel..." -ForegroundColor Yellow
Write-Host "   (Ex: https://abc123def-3001.euw.devtunnels.ms)" -ForegroundColor Cyan
Write-Host "`n   Une fois lancé, vous verrez:" -ForegroundColor Cyan
Write-Host "   • DevTunnel URL: https://..." -ForegroundColor Gray
Write-Host "   • Copiez cette URL" -ForegroundColor Gray
Write-Host "   • Utilisez-la sur GitHub Pages" -ForegroundColor Gray

Write-Host "`n" -ForegroundColor Cyan
Write-Host ("─" * 80) -ForegroundColor Cyan

# Lancer le tunnel
devtunnel host -p 3001 --allow-anonymous

Write-Host "`n⚠️  Tunnel arrêté" -ForegroundColor Yellow
Write-Host "   Pour relancer, exécutez ce script à nouveau" -ForegroundColor Gray
