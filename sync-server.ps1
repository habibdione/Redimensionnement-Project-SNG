# Script de synchronisation complète pour Windows
# Démarre le serveur et affiche le statut en temps réel

param(
    [switch]$AdminOnly = $false,
    [switch]$NoTests = $false
)

$ErrorActionPreference = "Continue"

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   SYNCHRONISATION SERVEUR LOCAL DIMENSIONNEMENT SONAGED    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Fonction pour afficher les messages
function Write-Status {
    param([string]$Message, [string]$Status = "info")
    
    $colors = @{
        "success" = "Green"
        "error" = "Red"
        "warning" = "Yellow"
        "info" = "Cyan"
    }
    
    $prefix = @{
        "success" = "✅"
        "error" = "❌"
        "warning" = "⚠️"
        "info" = "ℹ️"
    }
    
    Write-Host "$($prefix[$Status]) $Message" -ForegroundColor $colors[$Status]
}

# ===== VÉRIFICATIONS =====
Write-Host "📋 VÉRIFICATION DES PRÉREQUIS`n" -ForegroundColor Magenta

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Status "Node.js $nodeVersion trouvé" "success"
} catch {
    Write-Status "Node.js non trouvé. Installez depuis https://nodejs.org" "error"
    exit 1
}

# Vérifier npm
try {
    $npmVersion = npm --version
    Write-Status "npm v$npmVersion trouvé" "success"
} catch {
    Write-Status "npm non trouvé" "error"
    exit 1
}

# Vérifier PostgreSQL
try {
    $psqlVersion = psql --version
    Write-Status "PostgreSQL trouvé: $psqlVersion" "success"
} catch {
    Write-Status "PostgreSQL CLI non trouvé (optionnel)" "warning"
}

# Vérifier le fichier .env
if (-not (Test-Path ".env")) {
    Write-Status ".env non trouvé!" "error"
    exit 1
}
Write-Status ".env trouvé" "success"

# Vérifier package.json
if (-not (Test-Path "package.json")) {
    Write-Status "package.json non trouvé! Assurez-vous d'être dans le bon dossier" "error"
    exit 1
}
Write-Status "package.json trouvé" "success"

# Vérifier node_modules
if (-not (Test-Path "node_modules")) {
    Write-Status "Installation des dépendances..." "info"
    npm install
    Write-Status "Dépendances installées" "success"
} else {
    Write-Status "Dépendances trouvées" "success"
}

# ===== TESTS =====
if (-not $NoTests) {
    Write-Host "`n🧪 TESTS DE DIAGNOSTIC`n" -ForegroundColor Magenta
    
    Write-Status "Test 1: Connexion PostgreSQL..." "info"
    node test-db.js | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Test 1: Connexion PostgreSQL OK" "success"
    } else {
        Write-Status "Test 1: Connexion PostgreSQL échouée" "warning"
    }
}

# ===== DÉMARRAGE =====
Write-Host "`n🚀 DÉMARRAGE DU SERVEUR`n" -ForegroundColor Magenta

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  ✅ SERVEUR DIMENSIONNEMENT ACTIF                          ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  Accès Direct:                                            ║" -ForegroundColor Green
Write-Host "║  🌐 Frontend: http://localhost:3001                       ║" -ForegroundColor Green
Write-Host "║  📊 API: http://localhost:3001/api                        ║" -ForegroundColor Green
Write-Host "║  💚 Santé: http://localhost:3001/api/health               ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  Base de Données:                                         ║" -ForegroundColor Green
Write-Host "║  🗄️  PostgreSQL: localhost:5432                           ║" -ForegroundColor Green
Write-Host "║  📦 Database: dimentionnement_SNG                          ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  ➡️  Appuyez sur Ctrl+C pour arrêter                       ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host ""

# Enregistrer les logs
$logFile = "server_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
Write-Status "Logs sauvegardés dans: $logFile" "info"

# Démarrer le serveur
npm start 2>&1 | Tee-Object -FilePath $logFile

Write-Host "`n❌ Serveur arrêté" -ForegroundColor Red

# Afficher le résumé
Write-Host "`n📊 RÉSUMÉ DE SESSION" -ForegroundColor Magenta
Write-Host "   Logs: $logFile`n" -ForegroundColor Cyan

pause
