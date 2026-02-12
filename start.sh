#!/bin/bash
# Script de démarrage de l'application Dimensionnement SENELEC
# Cet script démarre le serveur backend et le frontend

echo "╔═══════════════════════════════════════════════╗"
echo "║   DIMENSIONNEMENT SENELEC - DÉMARRAGE        ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "Téléchargez-le: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Vérifier PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL n'est pas installé ou pas dans le PATH"
    echo "Assurez-vous que PostgreSQL est installé et configuré"
fi

echo "✅ Dépendances vérifiées"
echo ""

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances npm..."
    npm install
fi

echo ""
echo "🚀 Démarrage de l'application..."
echo ""
echo "Le serveur backend démarre sur le port 3001"
echo "Le frontend sera accessible sur le port 5000"
echo ""
echo "Pour utiliser l'application:"
echo "1. Ouvrez http://localhost:5000 dans votre navigateur"
echo "2. Assurez-vous que PostgreSQL est en cours d'exécution"
echo "3. Vérifiez la base de données: psql -U senelec_user -d senelec_dimensionnement"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrer le serveur
npm start
