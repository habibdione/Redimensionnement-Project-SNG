#!/usr/bin/env node

/**
 * TEST TUNNEL - Vérifie la connectivité au tunnel HTTPS
 */

const https = require('https');

const TUNNEL_URL = 'https://4mkdbs2k-3001.euw.devtunnels.ms';

console.log('\n' + '═'.repeat(70));
console.log('🌐 TEST CONNECTIVITÉ TUNNEL HTTPS');
console.log('═'.repeat(70) + '\n');

console.log(`Tunnel: ${TUNNEL_URL}`);
console.log(`Port: 443 (HTTPS)\n`);

/**
 * Faire une requête HTTPS au tunnel
 */
function testerTunnel(endpoint) {
    return new Promise((resolve) => {
        console.log(`\n📡 Test de l'endpoint: ${endpoint}`);
        
        const url = `${TUNNEL_URL}${endpoint}`;
        
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Diagnostic/1.0'
            },
            rejectUnauthorized: false // Accepter les certificats autosignés
        }, (res) => {
            let data = '';
            
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`   Status: ${res.statusCode}`);
                console.log(`   Content-Type: ${res.headers['content-type']}`);
                
                if (res.statusCode === 200) {
                    console.log('   ✅ Réponse réussie');
                    try {
                        const json = JSON.parse(data);
                        console.log('   Données:', JSON.stringify(json).substring(0, 100) + '...');
                    } catch (e) {
                        console.log('   (Réponse non-JSON)');
                    }
                    resolve(true);
                } else if (res.statusCode >= 300 && res.statusCode < 400) {
                    console.log('   ⚠️  Redirection détectée (problème d\'authentification?)');
                    console.log(`   Location: ${res.headers['location']}`);
                    resolve(false);
                } else {
                    console.log(`   ❌ Erreur HTTP ${res.statusCode}`);
                    resolve(false);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log(`   ❌ Erreur de connexion: ${error.message}`);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log(`   ⏱️  Timeout (5s) - Le tunnel n'est peut-être pas joignable`);
            req.destroy();
            resolve(false);
        });
    });
}

/**
 * Exécuter les tests
 */
async function executerTests() {
    console.log('\n' + '─'.repeat(70));
    console.log('Test 1: Endpoint /api/health');
    console.log('─'.repeat(70));
    const health = await testerTunnel('/api/health');
    
    console.log('\n' + '─'.repeat(70));
    console.log('Test 2: Endpoint /api/collectes');
    console.log('─'.repeat(70));
    const collectes = await testerTunnel('/api/collectes');
    
    console.log('\n' + '═'.repeat(70));
    console.log('📊 RÉSUMÉ DES TESTS');
    console.log('═'.repeat(70) + '\n');
    
    if (health || collectes) {
        console.log('✅ Le tunnel est ACCESSIBLE et fonctionnel');
        console.log('\nVous pouvez maintenant:');
        console.log('  1. Ouvrir: http://localhost:5000?env=tunnel');
        console.log('  2. Remplir le formulaire');
        console.log('  3. Sauvegarder les données via le tunnel');
    } else {
        console.log('❌ Le tunnel ne semble pas accessible');
        console.log('\nPossibles causes:');
        console.log('  • Le tunnel n\'est pas lancé');
        console.log('  • Le tunnel n\'est pas configuré comme PUBLIC');
        console.log('  • Le tunnel nécessite une authentification');
        console.log('  • Problème de connectivité réseau');
        console.log('\nSolutions:');
        console.log('  1. Vérifiez que Dev Tunnels est activé: devtunnel list');
        console.log('  2. Rendez le tunnel PUBLIC: devtunnel update <id> --allow-anonymous');
        console.log('  3. Relancez le tunnel si nécessaire');
    }
    
    console.log('\n' + '═'.repeat(70) + '\n');
}

executerTests().catch(console.error);
