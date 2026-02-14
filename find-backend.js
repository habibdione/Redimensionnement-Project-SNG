/**
 * 🔍 SCRIPT AUTO - TROUVER LE BACKEND
 * ===================================
 * Teste automatiquement toutes les URLs possibles
 */

const http = require('http');
const https = require('https');

console.log('\n' + '█'.repeat(80));
console.log('█' + ' '.repeat(78) + '█');
console.log('█' + '  🔍 RECHERCHE AUTOMATIQUE DU BACKEND'.padEnd(79) + '█');
console.log('█' + ' '.repeat(78) + '█');
console.log('█'.repeat(80) + '\n');

console.log('Teste les  URLs possibles...\n');

const URLS_TO_TEST = [
    // LOCAL
    { name: 'Local (localhost:3001)', url: 'http://localhost:3001' },
    { name: 'Local (localhost:3000)', url: 'http://localhost:3000' },
    { name: 'Local (localhost:5000)', url: 'http://localhost:5000' },
    { name: 'Local (127.0.0.1:3001)', url: 'http://127.0.0.1:3001' },
    
    // DEVTUNNELS - EXEMPLES
    { name: 'DevTunnels (exemple 1)', url: 'https://4mkdbs2k-3001.euw.devtunnels.ms' },
    { name: 'DevTunnels (exemple 2)', url: 'https://8bm42nfx-3001.euw.devtunnels.ms' },
    { name: 'DevTunnels (exemple 3)', url: 'https://abc123def-3001.euw.devtunnels.ms' },
    
    // RAILWAY - EXEMPLES
    { name: 'Railway (exemple)', url: 'https://your-app.up.railway.app' },
    
    // HEROKU - EXEMPLES
    { name: 'Heroku (exemple)', url: 'https://your-app.herokuapp.com' },
    
    // GITHUB PAGES API
    { name: 'GitHub Pages API', url: 'https://habibdione.github.io/api' },
    
    // VARIANTES LOCALES
    { name: 'MacOS/Linux:3001', url: 'http://0.0.0.0:3001' },
];

let foundServers = [];

function testURL(name, url) {
    return new Promise((resolve) => {
        const protocol = url.startsWith('https') ? https : http;
        const timeout = setTimeout(() => {
            resolve({ name, url, status: '⏱️  TIMEOUT', found: false });
        }, 2000);

        protocol.get(url, { rejectUnauthorized: false }, (res) => {
            clearTimeout(timeout);
            resolve({ name, url, status: `⏳ HTTP ${res.statusCode}`, found: true });
        }).on('error', (error) => {
            clearTimeout(timeout);
            const errorMsg = error.code === 'ECONNREFUSED' ? '❌ Refused' : 
                           error.code === 'ETIMEDOUT' ? '⏱️  Timeout' :
                           error.code === 'ENOTFOUND' ? '❌ Not Found' : '❌ Error';
            resolve({ name, url, status: errorMsg, found: false });
        });
    });
}

async function findBackend() {
    console.log('Teste ' + URLS_TO_TEST.length + ' URLs...\n');
    
    for (const item of URLS_TO_TEST) {
        process.stdout.write(`   [${URLS_TO_TEST.indexOf(item) + 1}/${URLS_TO_TEST.length}] ${item.name.padEnd(35)}`);
        
        const result = await testURL(item.name, item.url);
        console.log(`  ${result.status}`);
        
        if (result.found || result.status.includes('HTTP')) {
            foundServers.push(result);
        }
    }

    console.log('\n' + '─'.repeat(80) + '\n');

    if (foundServers.length > 0) {
        console.log('✅ SERVEURS TROUVÉS:\n');
        foundServers.forEach((server, idx) => {
            console.log(`   ${idx + 1}. ${server.name}`);
            console.log(`      URL: ${server.url}`);
            console.log(`      Status: ${server.status}\n`);
        });
        
        console.log('💡 SUIVANT:\n');
        console.log('   1. Choisissez l\'URL trouvée');
        console.log('   2. Testez: URL/api/health dans le navigateur');
        console.log('   3. Donnez-moi l\'URL et je la configure!\n');
        
    } else {
        console.log('❌ AUCUN SERVEUR TROUVÉ PAR DÉFAUT\n');
        
        console.log('💡 SOLUTIONS:\n');
        console.log('   1. Démarrer le backend:');
        console.log('      npm start\n');
        console.log('   2. Puis relancer ce script:\n');
        console.log('      node find-backend.js\n');
        console.log('   3. Ou si vous avez une URL DevTunnels:');
        console.log('      Modifiez URLS_TO_TEST dans ce script (ligne ~20)\n');
        console.log('   4. Ou cherchez manuellement: TROUVER_URL_BACKEND.md\n');
    }

    console.log('─'.repeat(80) + '\n');
    
    // Tests additionnels
    console.log('🔧 TESTS DE VALIDATION:\n');
    
    if (foundServers.length > 0) {
        const firstServer = foundServers[0].url;
        console.log(`   1️⃣  Teste /api/health sur: ${firstServer}\n`);
        
        try {
            const protocol = firstServer.startsWith('https') ? https : http;
            const testUrl = new URL(firstServer + '/api/health');
            
            protocol.get(testUrl, { rejectUnauthorized: false }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    console.log(`      Response: ${res.statusCode}`);
                    try {
                        const json = JSON.parse(data);
                        console.log(`      Data: ${JSON.stringify(json)}\n`);
                        console.log(`      ✅ BACKEND VALIDE!`);
                    } catch (e) {
                        console.log(`      Data: ${data}\n`);
                    }
                });
            }).on('error', (err) => {
                console.log(`      Erreur: ${err.message}\n`);
            });
        } catch (e) {
            console.log(`      Erreur test: ${e.message}\n`);
        }
    }
}

findBackend();

console.log(`
════════════════════════════════════════════════════════════════════════════

📝 NOTES:

Si la recherche ne trouve rien:

1. Vérifiez que votre backend est lancé:
   • Terminal → npm start
   • Attendez: "Server running on port 3001"

2. Vérifiez le port utilisé:
   • Peut-être 3000, 8000, 5000 ou autre
   • Cherchez dans: server.js ou .env

3. Si sur un serveur distant:
   • Vérifiez l'URL du serveur
   • Modifiez URLS_TO_TEST dans ce script
   • Ajouter votre URL personnalisée

4. Si vous avez un tunnel DevTunnels:
   • Lancez: devtunnel host -p 3001 --allow-anonymous
   • Notez l'URL affichée
   • Ajoutez-la dans URLS_TO_TEST

════════════════════════════════════════════════════════════════════════════
`);
