#!/usr/bin/env node

/**
 * TEST POST AU SERVEUR RUNNING
 */

const http = require('http');

const testData = JSON.stringify({
    partenaire: 'Test Server POST',
    region: 'Dakar',
    departement: 'Dakar',
    commune: 'Plateau',
    sites_concernes: 'Site Test',
    latitude: 14.6928,
    longitude: -17.0467,
    observation: 'Test via node script'
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/collecte',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
    }
};

console.log('\n🔄 Envoi POST au serveur local...\n');

const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        console.log('\nVérifiez la base de données:');
        console.log('   node check-database.js');
    });
});

req.on('error', (e) => {
    console.error(`❌ Erreur: ${e.message}`);
});

req.write(testData);
req.end();
