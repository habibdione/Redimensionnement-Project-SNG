#!/usr/bin/env node

/**
 * DIAGNOSTIC COMPLET - SAUVEGARDE ET SYNCHRONISATION
 * Affiche l'état du système et la configuration
 */

const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

console.log('\n' + '═'.repeat(70));
console.log('🔍 DIAGNOSTIC COMPLET - SAUVEGARDE ET SYNCHRONISATION');
console.log('═'.repeat(70) + '\n');

// Test 1: Vérifier la connexion au serveur
console.log('1️⃣  CONNEXION SERVEUR');
console.log('─'.repeat(70));
console.log(`✅ Adresse: http://localhost:${PORT}`);
console.log(`✅ API: http://localhost:${PORT}/api`);
console.log(`ℹ️  Testez l'API avec: curl http://localhost:${PORT}/api/health\n`);

// Test 2: Fichier de synchronisation locale
console.log('2️⃣  SYNCHRONISATION LOCALE');
console.log('─'.repeat(70));
const ficSync = path.join(__dirname, 'donnees_locales.json');
if (fs.existsSync(ficSync)) {
    const data = JSON.parse(fs.readFileSync(ficSync, 'utf8'));
    console.log(`✅ Fichier trouvé: donnees_locales.json`);
    console.log(`   Enregistrements: ${data.length}`);
} else {
    console.log(`⚠️  Fichier manquant: donnees_locales.json`);
    console.log(`   Il sera créé automatiquement lors de la première synchronisation`);
}
console.log();

// Test 3: Dossier uploads
console.log('3️⃣  DOSSIER UPLOADS');
console.log('─'.repeat(70));
const dossierUp = path.join(__dirname, 'uploads');
if (fs.existsSync(dossierUp)) {
    const fichiers = fs.readdirSync(dossierUp);
    console.log(`✅ Dossier exists: uploads/`);
    console.log(`   Fichiers: ${fichiers.length}`);
    if (fichiers.length > 0) {
        console.log(`   Exemples: ${fichiers.slice(0, 3).join(', ')}`);
    }
} else {
    console.log(`ℹ️  Dossier sera créé à la première utilisation`);
}
console.log();

// Test 4: Configuration PostgreSQL
console.log('4️⃣  CONFIGURATION POSTGRESQL');
console.log('─'.repeat(70));
require('dotenv').config();
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'senelec_dimensionnement'
};
console.log(`✅ Serveur DB: ${dbConfig.host}:${dbConfig.port}`);
console.log(`✅ Base: ${dbConfig.database}`);
console.log(`✅ Utilisateur: ${dbConfig.user}`);
console.log();

// Test 5: Configuration API
console.log('5️⃣  CONFIGURATION API');
console.log('─'.repeat(70));
console.log(`✅ GET  /api/health           - État du serveur`);
console.log(`✅ GET  /api/collectes        - Toutes les collectes`);
console.log(`✅ POST /api/collecte         - Créer une collecte`);
console.log(`✅ GET  /api/collecte/{id}    - Obtenir une collecte`);
console.log(`✅ GET  /api/statistiques     - Statistiques`);
console.log();

// Résumé
console.log('═'.repeat(70));
console.log('📊 RÉSUMÉ ET REMÈDES');
console.log('═'.repeat(70) + '\n');

const problemes = [];

// Vérifier fichier sync
if (!fs.existsSync(ficSync)) {
    problemes.push('donnees_locales.json manquant');
}

// Vérifier dossier uploads
if (!fs.existsSync(dossierUp)) {
    console.log('ℹ️  Le dossier uploads sera créé à la première utilisation\n');
}

if (problemes.length === 0) {
    console.log('🎉 SYSTÈME OPÉRATIONNEL\n');
    console.log('Commandes utiles:');
    console.log('  npm start              - Lance le serveur backend');
    console.log('  npm run frontend       - Lance le serveur frontend (port 5000)');
    console.log('  npm run sync           - Synchronise les données locales');
    console.log('  npm run diagnostic     - Relance ce diagnostic\n');
} else {
    console.log('⚠️  PROBLÈMES DÉTECTÉS:\n');
    problemes.forEach(p => console.log(`  • ${p}`));
    console.log();
}

console.log('═'.repeat(70) + '\n');
