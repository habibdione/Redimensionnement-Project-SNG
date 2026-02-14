/**
 * DIAGNOSTIC COMPLET DU SYSTÈME DE SYNCHRONISATION
 * =================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n' + '█'.repeat(80));
console.log('█' + ' '.repeat(78) + '█');
console.log('█' + '  🔍 DIAGNOSTIC COMPLET DU SYSTÈME DE SYNCHRONISATION'.padEnd(79) + '█');
console.log('█' + '  Date: ' + new Date().toLocaleString('fr-FR').padEnd(72) + '█');
console.log('█' + ' '.repeat(78) + '█');
console.log('█'.repeat(80) + '\n');

let allOk = true;

// 1. VÉRIFIER NODE.JS ET NPM
console.log('1️⃣  VÉRIFICATION NODE.JS ET NPM');
console.log('─'.repeat(80));
try {
    const nodeVersion = execSync('node --version').toString().trim();
    const npmVersion = execSync('npm --version').toString().trim();
    console.log('   ✅ Node.js:', nodeVersion);
    console.log('   ✅ NPM:', npmVersion);
} catch (e) {
    console.log('   ❌ Node.js ou NPM non installé');
    allOk = false;
}

// 2. VÉRIFIER POSTGRESQL
console.log('\n2️⃣  VÉRIFICATION PostgreSQL');
console.log('─'.repeat(80));
try {
    const psqlVersion = execSync('psql --version', { timeout: 3000 }).toString().trim();
    console.log('   ✅ PostgreSQL installé:', psqlVersion);
    
    // Tenter une connexion
    try {
        execSync('psql -U postgres -d senelec_dimensionnement -c "SELECT 1;" 2>&1', { timeout: 3000 });
        console.log('   ✅ Connexion BD: senelec_dimensionnement OK');
    } catch (e) {
        console.log('   ⚠️  Connexion BD: Non accessible (normal si première fois)');
    }
} catch (e) {
    console.log('   ⚠️  PostgreSQL: Non détecté sur PATH');
    console.log('      (Vous pouvez l\'installer plus tard)');
}

// 3. VÉRIFIER FICHIERS REQUIS
console.log('\n3️⃣  VÉRIFICATION FICHIERS REQUIS');
console.log('─'.repeat(80));
const requiredFiles = [
    'index.html',
    'server.js',
    'db.js',
    'package.json'
];

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        const sizeMB = (stat.size / 1024).toFixed(1);
        console.log(`   ✅ ${file.padEnd(20)} (${sizeMB} KB)`);
    } else {
        console.log(`   ❌ ${file} - MANQUANT`);
        allOk = false;
    }
});

// 4. VÉRIFIER FICHIER .env
console.log('\n4️⃣  VÉRIFICATION FICHIER .env');
console.log('─'.repeat(80));
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('   ✅ Fichier .env existe');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    envVars.forEach(line => {
        const [key] = line.split('=');
        console.log(`      • ${key}`);
    });
} else {
    console.log('   ⚠️  Fichier .env non trouvé - Création recommandée');
}

// 5. VÉRIFIER DÉPENDANCES NPM
console.log('\n5️⃣  VÉRIFICATION DÉPENDANCES NPM');
console.log('─'.repeat(80));
try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    
    const dependencies = Object.keys(packageData.dependencies || {});
    const installed = fs.existsSync(nodeModulesPath);
    
    if (installed) {
        console.log('   ✅ node_modules installés');
        console.log(`      • ${dependencies.length} dépendances`);
    } else {
        console.log('   ⚠️  node_modules non trouvé');
        console.log('      → Exécutez: npm install');
    }
} catch (e) {
    console.log('   ❌ Erreur lecture package.json:', e.message);
}

// 6. VÉRIFIER PORT 3001
console.log('\n6️⃣  VÉRIFICATION PORT 3001 (Backend)');
console.log('─'.repeat(80));
try {
    execSync('netstat -ano | findstr :3001', { 
        timeout: 2000,
        stdio: 'pipe'
    });
    console.log('   ⏳ Port 3001 en utilisation (Serveur peut-être démarré)');
} catch (e) {
    console.log('   ✅ Port 3001 disponible');
}

// 7. VÉRIFIER PORT 5000
console.log('\n7️⃣  VÉRIFICATION PORT 5000 (Frontend)');
console.log('─'.repeat(80));
try {
    execSync('netstat -ano | findstr :5000', { 
        timeout: 2000,
        stdio: 'pipe'
    });
    console.log('   ⏳ Port 5000 en utilisation');
} catch (e) {
    console.log('   ✅ Port 5000 disponible');
}

// 8. AFFICHER STATUT FINAL
console.log('\n' + '█'.repeat(80));
console.log('█' + ' '.repeat(78) + '█');
console.log('█' + '  📋 RÉSUMÉ ET INSTRUCTIONS'.padEnd(79) + '█');
console.log('█' + ' '.repeat(78) + '█');
console.log('█'.repeat(80) + '\n');

if (allOk) {
    console.log('✅ SYSTÈME PRÊT À DÉMARRER\n');
} else {
    console.log('⚠️  VÉRIFIEZ LES POINTS MANQUANTS CI-DESSUS\n');
}

console.log('🚀 DÉMARRAGE DU SYSTÈME:');
console.log(`
┌─ TERMINAL 1 (Backend - Port 3001) ─────────────┐
│ $ npm start                                     │
│ Ou: $ node server.js                            │
│                                                 │
│ Vérif: http://localhost:3001/api/health        │
└─────────────────────────────────────────────────┘

┌─ TERMINAL 2 (Frontend - Port 5000) ────────────┐
│ $ npm run frontend                              │
│ Ou: $ npx http-server -p 5000 -c-1 --cors      │
│                                                 │
│ Accédez à: http://localhost:5000               │
└─────────────────────────────────────────────────┘

🔄 SYNCHRONISATION AUTOMATIQUE:
   • Serveur en ligne → Envoi immédiat
   • Serveur offline → localStorage
   • Reconnexion → Sync auto

📊 VÉRIFIER:
   $ node check-today-data.js
   $ curl http://localhost:3001/api/collectes

📖 Plus d'infos:
   Lire: SYNCHRONIZATION_GUIDE.md
`);

console.log('█'.repeat(80) + '\n');
