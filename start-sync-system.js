/**
 * GESTIONNAIRE DE SYNCHRONISATION ET SERVEUR
 * ===========================================
 * Démarre le serveur et gère la synchronisation des données
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(70));
console.log('🚀 DÉMARRAGE DU SYSTÈME DE SYNCHRONISATION');
console.log('='.repeat(70));

// 1. Vérifier .env
console.log('\n1️⃣  Vérification du fichier .env...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('✅ Fichier .env trouvé');
} else {
    console.log('⚠️  Création d\'un fichier .env par défaut...');
    const defaultEnv = `DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senelec_dimensionnement
PORT=3001
NODE_ENV=production`;
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Fichier .env créé');
}

// 2. Vérifier les dépendances
console.log('\n2️⃣  Vérification des dépendances...');
const packagePath = path.join(__dirname, 'package.json');
const packageData = require(packagePath);
const requiredDeps = ['express', 'cors', 'pg', 'dotenv', 'multer'];
const missingDeps = requiredDeps.filter(dep => 
    !packageData.dependencies || !packageData.dependencies[dep]
);

if (missingDeps.length > 0) {
    console.log('⚠️  Dépendances manquantes:', missingDeps.join(', '));
    console.log('   Exécutez: npm install');
} else {
    console.log('✅ Toutes les dépendances sont installées');
}

// 3. Démarrer le serveur
console.log('\n3️⃣  Démarrage du serveur backend...\n');

const server = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'inherit'
});

server.on('error', (error) => {
    console.error('\n❌ Erreur au démarrage du serveur:', error.message);
    process.exit(1);
});

server.on('close', (code) => {
    console.log('\n⚠️  Serveur arrêté avec le code:', code);
});

// 4. Afficher les instructions
console.log('\n' + '='.repeat(70));
console.log('📋 INSTRUCTIONS DE SYNCHRONISATION DES DONNÉES');
console.log('='.repeat(70));
console.log(`
✅ Serveur backend DÉMARRÉ sur: http://localhost:3001

📱 FRONTEND (dans un autre terminal):
   → npm run frontend
   → Ou: npx http-server -p 5000 -c-1 --cors
   → Accédez à: http://localhost:5000

🔄 SYNCHRONISATION AUTOMATIQUE:
   • Les données du formulaire sont envoyées au serveur
   • Si le serveur est hors ligne = mode local
   • Les données sont sauvegardées dans localStorage
   • Quand le serveur revient = synchronisation auto

📊 VÉRIFIER LES DONNÉES:
   • Ouvrez: http://localhost:3001/api/collectes (JSON)
   • Ou exécutez: node check-today-data.js

🛑 Pour arrêter le serveur: Ctrl+C

`);
console.log('='.repeat(70));

// Gestion des signaux d'arrêt propre
process.on('SIGINT', () => {
    console.log('\n\n🛑 Arrêt du serveur...');
    server.kill();
    process.exit(0);
});
