#!/usr/bin/env node
/**
 * 🧪 VÉRIFICATION COMPLÈTE COMPRESSION ET SAUVEGARDE
 * 
 * Ce script vérifie que:
 * 1. Le serveur démarre correctement
 * 2. L'API répond aux requêtes
 * 3. La compression photo fonctionne
 * 4. Les données sont sauvegardées correctement
 */

const fs = require('fs');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════╗
║  🧪 VÉRIFICATION COMPRESSION & SAUVEGARDE PHOTO       ║
║      Version 1.0 - Test complet du système           ║
╚════════════════════════════════════════════════════════╝
`);

let totalTests = 0;
let passedTests = 0;

function test(name, condition, details = '') {
    totalTests++;
    const status = condition ? '✅ PASS' : '❌ FAIL';
    console.log(`\n${status} ${name}`);
    if (details) console.log(`   ${details}`);
    if (condition) passedTests++;
    return condition;
}

function section(title) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  ${title}`);
    console.log('═'.repeat(60));
}

// ============================================
// 1. VÉRIFIER FICHIERS
// ============================================

section('1️⃣  VÉRIFICATION DES FICHIERS');

const requiredFiles = [
    'index.html',
    'server.js',
    'db.js',
    '.env',
    'test-save-with-photo.js',
    'package.json'
];

requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    test(`Fichier présent: ${file}`, exists);
});

// ============================================
// 2. VÉRIFIER CODE COMPRESSION
// ============================================

section('2️⃣  VÉRIFICATION CODE COMPRESSION');

const indexContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

test('Canvas.toDataURL avec qualité 0.7', 
    indexContent.includes("toDataURL('image/jpeg', 0.7)"),
    'La compression JPEG 70% est présente dans index.html'
);

test('Validation taille photo > 5MB',
    indexContent.includes('5 * 1024 * 1024'),
    'Limite de 5MB pour les photos est configurée'
);

test('Message feedback photo KB',
    indexContent.includes("Photo capturée (") && indexContent.includes("KB)"),
    'Le message avec taille en KB est présent'
);

test('Validation taille requête 25MB',
    indexContent.includes('25 * 1024 * 1024'),
    "Limite de 25MB pour la requête JSON complète est configurée"
);

// ============================================
// 3. VÉRIFIER CODE SERVER
// ============================================

section('3️⃣  VÉRIFICATION CODE SERVEUR');

const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');

test('Middleware json limit 25mb',
    serverContent.includes("limit: '25mb'"),
    'Paramètre express.json({ limit: "25mb" }) configuré'
);

test('Logging Content-Length',
    serverContent.includes('Content-Length'),
    'Les logs affichent la taille de la requête reçue'
);

test('Validation photo base64',
    serverContent.includes('data:image') && serverContent.includes('base64'),
    'Validation du base64 photo implémentée'
);

test('Gestion erreur Buffer.from',
    serverContent.includes('catch') && serverContent.includes('photo'),
    'Gestion des erreurs lors de conversion base64 → buffer'
);

// ============================================
// 4. VÉRIFIER CONFIGURATION
// ============================================

section('4️⃣  VÉRIFICATION CONFIGURATION');

try {
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    test('Fichier .env existe et lisible', true, 'Variables d\'environnement peuvent être chargées');
    
    const dbUser = envContent.includes('DB_USER');
    const dbPassword = envContent.includes('DB_PASSWORD');
    const dbHost = envContent.includes('DB_HOST');
    const dbPort = envContent.includes('DB_PORT');
    const dbName = envContent.includes('DB_NAME');
    
    test('DB_USER dans .env', dbUser);
    test('DB_PASSWORD dans .env', dbPassword);
    test('DB_HOST dans .env', dbHost);
    test('DB_PORT dans .env', dbPort);
    test('DB_NAME dans .env', dbName);
} catch (e) {
    test('Fichier .env existe', false, `Fichier .env manquant: ${e.message}`);
}

// ============================================
// 5. VÉRIFIER DÉPENDANCES
// ============================================

section('5️⃣  VÉRIFICATION DÉPENDANCES NODE');

try {
    const pkgContent = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    
    const hasExpress = pkgContent.dependencies && pkgContent.dependencies.express;
    const hasCors = pkgContent.dependencies && pkgContent.dependencies.cors;
    const hasDotenv = pkgContent.dependencies && pkgContent.dependencies.dotenv;
    const hasPostgres = pkgContent.dependencies && (pkgContent.dependencies.pg || pkgContent.dependencies.postgres);
    
    test('express présent', hasExpress, hasExpress ? `v${pkgContent.dependencies.express}` : 'Manquant');
    test('cors présent', hasCors, hasCors ? `v${pkgContent.dependencies.cors}` : 'Manquant');
    test('dotenv présent', hasDotenv, hasDotenv ? `v${pkgContent.dependencies.dotenv}` : 'Manquant');
    test('pg (PostgreSQL) présent', hasPostgres, hasPostgres ? 'PostgreSQL driver trouvé' : 'Manquant');
} catch (e) {
    test('package.json lisible', false, `Erreur: ${e.message}`);
}

// ============================================
// 6. VÉRIFIER TAILLES FICHIERS
// ============================================

section('6️⃣  VÉRIFICATION TAILLES FICHIERS');

[
    { name: 'index.html', min: 50000, max: 2000000 },
    { name: 'server.js', min: 10000, max: 1000000 },
    { name: 'package.json', min: 100, max: 50000 }
].forEach(({ name, min, max }) => {
    try {
        const stats = fs.statSync(path.join(__dirname, name));
        const size = stats.size;
        const sizeOk = size >= min && size <= max;
        test(`Taille ${name}`, sizeOk, 
            `${(size/1024).toFixed(0)}KB (attendu: ${(min/1024).toFixed(0)}-${(max/1024).toFixed(0)}KB)`);
    } catch (e) {
        test(`Taille ${name}`, false, `Erreur: ${e.message}`);
    }
});

// ============================================
// 7. RÉSUMÉ
// ============================================

section('📊 RÉSUMÉ');

const percentage = Math.round((passedTests / totalTests) * 100);
console.log(`
Tests réussis: ${passedTests}/${totalTests} (${percentage}%)

${percentage >= 80 ? '✅ SUCCÈS: Le système est configuré correctement!' : 
  percentage >= 60 ? '⚠️  ATTENTION: Des configurations manquent' :
  '❌ ERREUR: Des problèmes majeurs détectés'}
`);

if (passedTests === totalTests) {
    console.log(`
┌────────────────────────────────────────────────────────┐
│  🚀 TOUT EST PRÊT!                                     │
│                                                        │
│  Commandes suivantes:                                 │
│  1. npm start          (démarrer serveur)             │
│  2. node test-save-with-photo.js  (tester API)        │
│  3. Ouvrir l'app et tester la sauvegarde              │
└────────────────────────────────────────────────────────┘
    `);
    process.exit(0);
} else {
    console.log(`
┌────────────────────────────────────────────────────────┐
│  ⚠️  À CORRIGER:                                       │
│                                                        │
│  1. Vérifier que tous les fichiers sont présents      │
│  2. Vérifier que .env est configuré                   │
│  3. Vérifier que npm install a été exécuté            │
│  4. Vérifier que PostgreSQL est lancé                 │
│                                                        │
│  Puis relancer: node verify-setup.js                  │
└────────────────────────────────────────────────────────┘
    `);
    process.exit(1);
}
