# Script de déploiement GitHub Pages - Windows PowerShell
# Usage: .\deploy-to-github.ps1

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 Déploiement GitHub Pages - Redimensionnement-Project" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Fonction pour afficher des messages colorés
function Write-Status {
    param([string]$Message, [string]$Type = "info")
    switch ($Type) {
        "success" { Write-Host "✅ $Message" -ForegroundColor Green }
        "error" { Write-Host "❌ $Message" -ForegroundColor Red }
        "warning" { Write-Host "⚠️  $Message" -ForegroundColor Yellow }
        "info" { Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
        "question" { Write-Host "❓ $Message" -ForegroundColor Magenta }
        default { Write-Host "   $Message" }
    }
}

# Vérifications préalables
Write-Status "Vérifications préalables..." "info"
Write-Host ""

# Vérifier Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Status "Git n'est pas installé" "error"
    exit 1
}
Write-Status "Git détecté" "success"

# Vérifier que c'est un dépôt Git
if (-not (Test-Path ".git")) {
    Write-Status "Ceci n'est pas un dépôt Git" "error"
    Write-Host ""
    Write-Status "Clonez d'abord le dépôt:" "info"
    Write-Host "  git clone https://github.com/habibdione/Redimensionnement-Project-SNG.git"
    exit 1
}
Write-Status "Dépôt Git détecté" "success"

# Vérifier les fichiers essentiels
Write-Host ""
Write-Status "Vérification des fichiers essentiels..." "info"
$requiredFiles = @(
    "index.html",
    "config.js",
    "api-client.js",
    "tunnel-config.js",
    "server.js",
    "package.json",
    "manifest.json"
)

$missingCount = 0
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Status "$file" "success"
    } else {
        Write-Status "$file (MANQUANT)" "error"
        $missingCount++
    }
}

if ($missingCount -gt 0) {
    Write-Host ""
    Write-Status "$missingCount fichier(s) manquant(s). Vérifiez votre installation." "error"
    exit 1
}

Write-Host ""
Write-Status "Tous les fichiers essentiels sont présents" "success"

# Vérifier la branche Git
Write-Host ""
Write-Status "Vérification de la branche Git..." "info"
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Status "Branche actuelle: $currentBranch" "info"

if ($currentBranch -ne "main" -and $currentBranch -ne "master" -and $currentBranch -ne "gh-pages") {
    Write-Status "Vous êtes sur la branche '$currentBranch'" "warning"
    $response = Read-Host "Continuer le déploiement? (o/n)"
    if ($response -ne "o" -and $response -ne "O") {
        Write-Status "Déploiement annulé" "error"
        exit 1
    }
}

# Vérifier les modifications non engagées
Write-Host ""
Write-Status "Vérification des modifications..." "info"
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Status "Aucune modification non engagée" "success"
} else {
    Write-Status "Modifications détectées:" "warning"
    Write-Host $status
    Write-Host ""
    $response = Read-Host "Voulez-vous ajouter ces modifications? (o/n)"
    if ($response -eq "o" -or $response -eq "O") {
        git add .
        Write-Status "Fichiers ajoutés au staging" "success"
    }
}

# Message de commit
Write-Host ""
Write-Status "Messages de commit récents:" "info"
git log --oneline -5
Write-Host ""

$commitMsg = Read-Host "Entrez le message de commit (défaut: 'Deploy application')"
if ([string]::IsNullOrEmpty($commitMsg)) {
    $commitMsg = "Deploy application with tunnel HTTPS support"
}

# Créer le commit
Write-Host ""
Write-Status "Création du commit..." "info"
git add .
$commitOutput = git commit -m $commitMsg 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Status "Commit créé" "success"
} else {
    if ($commitOutput -match "nothing to commit") {
        Write-Status "Aucune modification à committer" "info"
    } else {
        Write-Status "Erreur lors du commit" "error"
        Write-Host $commitOutput
    }
}

# Push vers GitHub
Write-Host ""
Write-Status "Push vers GitHub..." "info"
Write-Status "Branche: $currentBranch" "info"

$pushOutput = git push origin $currentBranch 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Status "Push réussi" "success"
} else {
    Write-Status "Erreur lors du push" "error"
    Write-Host $pushOutput
    exit 1
}

# Résumé final
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ Déploiement réussi!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Status "Votre application est maintenant accessible à:" "info"
Write-Host "   https://habibdione.github.io/Redimensionnement-Project-SNG/" -ForegroundColor Cyan
Write-Host ""

Write-Status "Attendez 1-2 minutes pour que les changements soient visibles" "warning"
Write-Host ""

Write-Host "✨ Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Vérifier que le tunnel est PUBLIC:"
Write-Host "      devtunnel show 4mkdbs2k" -ForegroundColor Yellow
Write-Host ""
Write-Host "   2. Accéder à votre application en production"
Write-Host "      https://habibdione.github.io/Redimensionnement-Project-SNG/" -ForegroundColor Yellow
Write-Host ""
Write-Host "   3. Vérifier la console (F12) pour 'TUNNEL MODE ACTIF'"
Write-Host ""
Write-Host "   4. Tester la soumission de données via le formulaire"
Write-Host ""

Write-Status "Besoin d'aide?" "info"
Write-Host "   - Console error? Vérifier que tunnel est PUBLIC:"
Write-Host "     devtunnel update 4mkdbs2k --allow-anonymous" -ForegroundColor Yellow
Write-Host "   - Données ne se sauvegardent pas? Vérifier que PostgreSQL tourne"
Write-Host "   - Autre problème? Vérifier GITHUB_PAGES_DEPLOYMENT.md"
Write-Host ""

# Option pour ouvrir le navigateur automtiquement
$response = Read-Host "Voulez-vous ouvrir l'application dans votre navigateur maintenant? (o/n)"
if ($response -eq "o" -or $response -eq "O") {
    Start-Process "https://habibdione.github.io/Redimensionnement-Project-SNG/"
    Write-Status "Navigateur ouvert" "success"
}

Write-Host ""
