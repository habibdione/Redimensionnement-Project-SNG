/**
 * 🚀 TUNNEL DEVTUNNELS + SYNCHRONISATION GITHUB PAGES
 * ===================================================
 * Lance un tunnel pour que GitHub Pages accède au backend
 */

const { spawn } = require('child_process');
const net = require('net');
const fs = require('fs');

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║          🚀 TUNNEL DEVTUNNELS - GitHub Pages ↔ Backend Local             ║
╚════════════════════════════════════════════════════════════════════════════╝

📋 CE QUE CELA FAIT:
───────────────────────────────────────────────────────────────────────────

1. Lance un tunnel DevTunnels qui expose localhost:3001 publiquement
2. GitHub Pages pourra accéder au backend via ce tunnel
3. Les données du formulaire seront synchronisées avec la BD

📍 FLUX:
───────────────────────────────────────────────────────────────────────────

    [Utilisateur]
         ↓ (remplir formulaire)
    https://habibdione.github.io/Redimensionnement-Project-SNG/
         ↓ (POST /api/collecte)
    https://YOUR_TUNNEL_ID-3001.euw.devtunnels.ms
         ↓ (proxy vers)
    http://localhost:3001
         ↓ (INSERT SQL)
    PostgreSQL ✅ (Données sauvegardées)

─────────────────────────────────────────────────────────────────────────────

✅ PRÉREQUIS:
   1. DevTunnels CLI installé
   2. Backend lancé (npm start)
   3. PostgreSQL actif

─────────────────────────────────────────────────────────────────────────────
`);

// Vérifier si le backend est lancé
console.log('\n1️⃣  VÉRIFICATION PRÉ-LANCEMENT\n');

function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createConnection({
            port: port,
            host: 'localhost'
        });
        
        server.on('connect', () => {
            server.destroy();
            resolve(true);
        });
        
        server.on('error', () => {
            resolve(false);
        });
    });
}

async function startTunnel() {
    // Vérifier backend
    const backendUp = await checkPort(3001);
    if (!backendUp) {
        console.log('   ⚠️  Backend pas détecté sur port 3001');
        console.log('      Assurez-vous que npm start est lancé dans un autre terminal!');
        console.log('      Continuant quand même...\n');
    } else {
        console.log('   ✅ Backend détecté sur localhost:3001');
    }

    // Vérifier la CLI devtunnel
    console.log('\n2️⃣  LANCEMENT DU TUNNEL\n');
    console.log('   Démarrage du tunnel DevTunnels...');
    console.log('   Attendez un message avec l\'URL du tunnel\n');

    const tunnel = spawn('devtunnel', ['host', '-p', '3001', '--allow-anonymous'], {
        stdio: 'inherit',
        shell: true
    });

    tunnel.on('error', (error) => {
        console.error('\n❌ ERREUR: devtunnel CLI pas trouvée');
        console.error('   Installation: https://aka.ms/devtunnels/clients\n');
        console.log('   Windows:');
        console.log('   choco install devtunnels-cli\n');
        console.log('   Ou manuellement depuis: https://aka.ms/devtunnels/clients\n');
        process.exit(1);
    });

    tunnel.on('close', (code) => {
        console.log('\n⚠️  Tunnel arrêté (code: ' + code + ')');
    });

    // Afficher les instructions
    console.log(`
   ────────────────────────────────────────────────────────────────────────
   
   💡 INSTRUCTIONS:
   
   1. Le tunnel va afficher une URL comme:
      https://abc123def-3001.euw.devtunnels.ms
   
   2. Copiez cette URL complète
   
   3. Allez à: https://habibdione.github.io/Redimensionnement-Project-SNG/
      Ouvrez DevTools (F12) → Console
   
   4. Collez ce code:
      
      API_BASE_URL = 'https://abc123def-3001.euw.devtunnels.ms';
      
      (Remplacez abc123def par votre tunnel ID)
   
   5. Rechargez la page
   
   6. Testez de remplir et soumettre un formulaire
   
   7. Vérifiez les données en base:
      node check-today-data.js
   
   ────────────────────────────────────────────────────────────────────────
   
   🛑 Pour arrêter le tunnel: Ctrl+C
   
   ────────────────────────────────────────────────────────────────────────
    `);
}

startTunnel().catch(console.error);
