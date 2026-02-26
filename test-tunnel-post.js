#!/usr/bin/env node

/**
 * TEST TUNNEL HTTPS - Vérifier que les données vont au tunnel
 * Exécution: node test-tunnel-post.js
 */

const https = require('https');
const http = require('http');

// URLs à tester
const TUNNEL_URL = 'https://4mkdbs2k-3001.euw.devtunnels.ms/api/collecte';
const LOCAL_URL = 'http://localhost:3001/api/collecte';

// Données test
const testData = {
    partenaire: 'Test Tunnel ' + new Date().toISOString().split('T')[0],
    region: 'Dakar',
    departement: 'Dakar',
    commune: 'Plateau',
    sites_concernes: 'Site Test Tunnel',
    latitude: 14.6928,
    longitude: -17.0467,
    observation: 'Test depuis tunnel HTTPS'
};

console.log('\n📊 TEST TUNNEL HTTPS\n');
console.log('=' .repeat(80));
console.log('Données test:');
console.log(JSON.stringify(testData, null, 2));
console.log('=' .repeat(80) + '\n');

// Fonction pour faire une requête POST
function postData(url, data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 10000
        };

        console.log(`🔄 POST ${url}`);
        
        const proto = url.startsWith('https') ? https : http;
        const req = proto.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({
                        status: res.statusCode,
                        data: parsed
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: responseData
                    });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
        });

        req.write(postData);
        req.end();
    });
}

// Tester LOCAL d'abord
async function test() {
    console.log('1️⃣  TEST LOCAL (http://localhost:3001)');
    console.log('-' .repeat(80));
    
    try {
        const localResult = await postData(LOCAL_URL, testData);
        console.log(`✅ Status: ${localResult.status}`);
        console.log(`✅ Response:`, JSON.stringify(localResult.data, null, 2));
        
        if (localResult.data.success) {
            console.log(`\n✅ DONNÉES SAUVEGARDÉES LOCALEMENT`);
            console.log(`   ID: ${localResult.data.data.id}`);
        }
    } catch (err) {
        console.error(`❌ Erreur LOCAL:`, err.message);
    }
    
    console.log('\n' + '=' .repeat(80) + '\n');
    
    // Tester TUNNEL
    console.log('2️⃣  TEST TUNNEL (https://4mkdbs2k-3001.euw.devtunnels.ms)');
    console.log('-' .repeat(80));
    
    const tunnelTestData = {
        ...testData,
        partenaire: 'Test Tunnel ' + new Date().toLocaleString('fr-FR')
    };
    
    try {
        const tunnelResult = await postData(TUNNEL_URL, tunnelTestData);
        console.log(`✅ Status: ${tunnelResult.status}`);
        console.log(`✅ Response:`, JSON.stringify(tunnelResult.data, null, 2));
        
        if (tunnelResult.data.success) {
            console.log(`\n✅ DONNÉES SAUVEGARDÉES VIA TUNNEL`);
            console.log(`   ID: ${tunnelResult.data.data.id}`);
        }
    } catch (err) {
        console.error(`❌ Erreur TUNNEL:`, err.message);
        console.error(`\n⚠️  Tunnel pas accessible. Vérifications:`);
        console.error(`   1. Tunnel est-il PUBLIC? devtunnel show 4mkdbs2k`);
        console.error(`   2. Tunnel tourne-t-il? devtunnel host -p 3001`);
        console.error(`   3. Backend local tourne-t-il? npm start`);
    }
    
    console.log('\n' + '=' .repeat(80));
    console.log('\n✅ TEST TERMINÉ\n');
}

test();
