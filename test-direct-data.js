#!/usr/bin/env node

/**
 * Test pour vérifier que les données complètes sont maintenant envoyées
 */

const http = require('http');

const testData = {
    partenaire: "TEST SONAGED 2",
    region: "ziguinchor",
    departement: "ziguinchor",
    commune: "ziguinchor",
    adresse: "Rue Test, Ziguinchor",
    superficie: "3.5",
    besoinPersonnel: "7",
    typeActivite: "Collecte d'eau",
    latitude: 13.1939,
    longitude: -15.5277,
    precision: 10
};

console.log('🧪 TEST - Envoi de données complètes');
console.log('=====================================\n');
console.log('📋 Données à envoyer:');
console.log(JSON.stringify(testData, null, 2));

const postData = JSON.stringify(testData);

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/collecte',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('\n📨 Envoi en cours...\n');

const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('\n✅ RÉPONSE REÇUE:');
        console.log('Status:', res.statusCode);
        console.log('Response:', responseData);
        
        if (res.statusCode === 201) {
            console.log('\n✅ SUCCÈS! Les données ont bien été enregistrées.');
        } else {
            console.log('\n❌ ERREUR - Status', res.statusCode);
        }
        
        process.exit(res.statusCode === 201 ? 0 : 1);
    });
});

req.on('error', (e) => {
    console.error('❌ ERREUR:', e);
    process.exit(1);
});

req.write(postData);
req.end();
