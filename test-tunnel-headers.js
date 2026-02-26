#!/usr/bin/env node

/**
 * TEST TUNNEL HTTPS avec différents en-têtes
 * Reporter ce qui retourne 401 et pourquoi
 */

const https = require('https');

const TUNNEL_URL = 'https://4mkdbs2k-3001.euw.devtunnels.ms/api/collecte';

const testData = JSON.stringify({
    partenaire: 'Test Tunnel Headers',
    region: 'Dakar',
    latitude: 14.6928,
    longitude: -17.0467
});

// Différentes configurations à tester
const tests = [
    {
        name: 'Configuration 1: Headers standards',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(testData),
            'Accept': 'application/json'
        }
    },
    {
        name: 'Configuration 2: Avec User-Agent',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(testData),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
            'Accept': 'application/json'
        }
    },
    {
        name: 'Configuration 3: Avec Authorization Bearer',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(testData),
            'Authorization': 'Bearer tunnel-token',
            'Accept': 'application/json'
        }
    },
    {
        name: 'Configuration 4: Minimal (Content-Type seulement)',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(testData)
        }
    }
];

async function testConfig(config) {
    return new Promise((resolve) => {
        const urlObj = new URL(TUNNEL_URL);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: config.headers,
            timeout: 15000,
            rejectUnauthorized: false  // Accepter tous les certificats SSL
        };

        console.log(`\n💡 ${config.name}`);
        console.log('-'.repeat(80));
        console.log(`En-têtes: ${JSON.stringify(config.headers, null, 2)}`);
        
        const req = https.request(options, (res) => {
            let responseData = '';
            
            console.log(`Status: ${res.statusCode}`);
            console.log(`Headers:`, {
                'content-type': res.headers['content-type'],
                'www-authenticate': res.headers['www-authenticate'],
                'access-control-allow-origin': res.headers['access-control-allow-origin']
            });
            
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                if (responseData) {
                    console.log(`Body: ${responseData.substring(0, 200)}`);
                }
                resolve({
                    status: res.statusCode,
                    name: config.name
                });
            });
        });

        req.on('error', (err) => {
            console.error(`❌ Erreur: ${err.message}`);
            resolve({ status: 'ERROR', name: config.name });
        });

        req.on('timeout', () => {
            req.destroy();
            console.error(`❌ Timeout`);
            resolve({ status: 'TIMEOUT', name: config.name });
        });

        req.write(testData);
        req.end();
    });
}

async function runTests() {
    console.log('\n' + '='.repeat(80));
    console.log('🔬 TEST TUNNEL HTTPS - DIAGNOSTIC DES EN-TÊTES');
    console.log(`Endpoint: ${TUNNEL_URL}`);
    console.log('='.repeat(80));
    
    const results = [];
    
    for (const test of tests) {
        const result = await testConfig(test);
        results.push(result);
        
        // Attendre un peu entre les tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 RÉSUMÉ DES RÉSULTATS');
    console.log('='.repeat(80));
    
    results.forEach(r => {
        const emoji = r.status === 201 ? '✅' : r.status === 401 ? '🔐' : r.status === 'ERROR' ? '❌' : '⚠️';
        console.log(`${emoji} ${r.name}: Status ${r.status}`);
    });
    
    const success = results.find(r => r.status === 201 || r.status === 200);
    if (success) {
        console.log(`\n✅ Succès trouvé avec: ${success.name}`);
        console.log('Utilisez cette configuration dans le client!');
    } else {
        console.log(`\n⚠️ Aucune configuration n'a réussi (tous 401 ou erreur)`);
        console.log(`\nDiagnostics possibles:`);
        console.log(`1. Le tunnel a une authentification activée parVS Code`);
        console.log(`2. Le tunnel accepte seulement les requêtes locales (localhost:3001)`);
        console.log(`3. Le tunnel nécessite un header spécifique que nous n'avons pas`);
    }
}

runTests();
