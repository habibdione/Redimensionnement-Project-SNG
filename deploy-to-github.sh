#!/bin/bash
# Script de déploiement GitHub Pages automatisé
# Usage: bash deploy-to-github.sh

set -e  # Exit on error

echo "════════════════════════════════════════════════════════════"
echo "🚀 Déploiement sur GitHub Pages - Redimensionnement-Project"
echo "════════════════════════════════════════════════════════════"
echo ""

# Vérifications préalables
echo "📋 Vérifications préalables..."

if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Veuillez installer Git d'abord."
    exit 1
fi

if [ ! -d ".git" ]; then
    echo "❌ Ce n'est pas un dépôt Git. Veuillez cloner le dépôt d'abord:"
    echo "   git clone https://github.com/habibdione/Redimensionnement-Project-SNG.git"
    exit 1
fi

# Vérifier que les fichiers essentiels existent
echo ""
echo "🔍 Vérification des fichiers essentiels..."

REQUIRED_FILES=(
    "index.html"
    "config.js"
    "api-client.js"
    "tunnel-config.js"
    "server.js"
    "package.json"
    "manifest.json"
)

MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MANQUANT)"
        MISSING=$((MISSING + 1))
    fi
done

if [ $MISSING -gt 0 ]; then
    echo ""
    echo "❌ $MISSING fichier(s) manquant(s). Vérifiez votre installation."
    exit 1
fi

echo ""
echo "✅ Tous les fichiers essentiels sont présents"

# Vérifier la branche
echo ""
echo "🌿 Vérification de la branche Git..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "  Branche actuelle: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ] && [ "$CURRENT_BRANCH" != "gh-pages" ]; then
    echo "  ⚠️  Vous êtes sur la branche '$CURRENT_BRANCH'"
    read -p "  Continuer le déploiement? (o/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        echo "❌ Déploiement annulé"
        exit 1
    fi
fi

# Vérifier les fichiers modifiés
echo ""
echo "📝 État du dépôt Git..."
if [ -z "$(git status --porcelain)" ]; then
    echo "  ✅ Aucune modification non engagée"
else
    echo "  ⚠️  Modifications détectées:"
    git status --short
    read -p "  Voulez-vous ajouter ces modifications? (o/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        git add .
        echo "  ✅ Fichiers ajoutés au staging"
    fi
fi

# Message de commit
echo ""
echo "💬 Messages de commit récents:"
git log --oneline -5

echo ""
read -p "Entrez le message de commit (défaut: 'Deploy application'): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Deploy application with tunnel HTTPS support"
fi

# Créer le commit
echo ""
echo "📦 Création du commit..."
git add .
git commit -m "$COMMIT_MSG" || echo "  ℹ️  Aucune modification à committer"

# Push vers GitHub
echo ""
echo "🚀 Push vers GitHub..."
echo "  Branche: $CURRENT_BRANCH"
git push origin "$CURRENT_BRANCH"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Déploiement réussi!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📍 Votre application est maintenant accessible à:"
echo "   https://habibdione.github.io/Redimensionnement-Project-SNG/"
echo ""
echo "⏱️  Attendez 1-2 minutes pour que les changements soient visibles"
echo ""
echo "✨ Prochaines étapes:"
echo "   1. Vérifier que le tunnel est PUBLIC:"
echo "      devtunnel show 4mkdbs2k"
echo "   2. Accéder à votre application en production"
echo "   3. Vérifier la console (F12) pour 'TUNNEL MODE ACTIF'"
echo "   4. Tester la soumission de données via le formulaire"
echo ""
echo "📞 Besoin d'aide?"
echo "   - Console error? Vérifier que tunnel est PUBLIC avec:"
echo "     devtunnel update 4mkdbs2k --allow-anonymous"
echo "   - Données ne se sauvegardent pas? Vérifier que PostgreSQL tourne"
echo "   - Autre problème? Vérifier GITHUB_PAGES_DEPLOYMENT.md"
echo ""
