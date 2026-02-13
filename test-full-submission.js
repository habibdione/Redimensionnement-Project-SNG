#!/usr/bin/env node

/**
 * Script de diagnostic - Teste la soumission de données complètes
 * Usage: node test-full-submission.js
 */

const http = require('http');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
const API_ENDPOINT = '/api/collecte';

// Données de test complètes
const testData = {
    partenaire: "SONAGED TEST",
    region: "ziguinchor",
    departement: "ziguinchor", 
    commune: "ziguinchor",
    type_activite: "Collecte d'eau",
    adresse: "Rue de l'Indépendance, Ziguinchor",
    superficie: 2.81,
    besoin_personnel: 5,
    dispositif_deploye: "Réservoir 10000L",
    infrastructure_gestion: "Pompe solaire",
    frequence_collecte: "quotidien",
    latitude: 13.1939,
    longitude: -15.5277,
    precision: 10
};

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║        TEST DE SOUMISSION DE DONNÉES COMPLÈTES              ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📋 Données de test:');
console.log(JSON.stringify(testData, null, 2));
console.log('\n⏳ Envoi des données vers:', BASE_URL + API_ENDPOINT);

function sendData(data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);

        const options = {
            hostname: 'localhost',
            port: 3001,
            path: API_ENDPOINT,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: responseData
                });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        // Envoi des données
        req.write(postData);
        req.end();
    });
}

async function runTest() {
    try {
        const result = await sendData(testData);

        console.log('\n✅ RÉPONSE REÇUE:\n');
        console.log('🔢 Code HTTP:', result.statusCode);
        console.log('📨 Headers:', result.headers);
        console.log('\n📦 Réponse:');

        try {
            const jsonResponse = JSON.parse(result.body);
            console.log(JSON.stringify(jsonResponse, null, 2));

            if (result.statusCode === 200 || result.statusCode === 201) {
                console.log('\n✅ SUCCÈS - Les données ont été enregistrées!');
                
                if (jsonResponse.id) {
                    console.log('   ID de l\'enregistrement:', jsonResponse.id);
                }
                
                console.log('\n💡 Prochaines étapes:');
                console.log('   1. Ouvrez la page http://localhost:3001');
                console.log('   2. Remplissez le formulaire avec les mêmes données');
                console.log('   3. Vérifiez la console (F12) pour les logs');
                console.log('   4. Comparez avec ce test qui fonctionne');
            } else {
                console.log('\n⚠️  ERREUR - Le serveur a retourné:', result.statusCode);
                console.log('   Message:', jsonResponse.message || jsonResponse.error);
            }
        } catch (e) {
            console.log(result.body);
        }

    } catch (error) {
        console.error('\n❌ ERREUR DE CONNEXION:');
        console.error('   Message:', error.message);
        console.error('\n💡 Assurez-vous que:');
        console.error('   1. Le serveur est lancé avec "npm start"');
        console.error('   2. Le serveur est accessible à localhost:3001');
        console.error('   3. La base de données PostgreSQL est en marche');
    }
}

// Vérifications préalables
console.log('\n🔍 Vérifications préalables:');

try {
    const packageJson = require('./package.json');
    console.log('✅ project trouvé:', packageJson.name);
} catch(e) {
    console.log('❌ package.json non trouvé');
}

if (fs.existsSync('./server.js')) {
    console.log('✅ server.js trouvé');
} else {
    console.log('❌ server.js non trouvé');
}

if (fs.existsSync('./db.js')) {
    console.log('✅ db.js trouvé');
} else {
    console.log('❌ db.js non trouvé');
}

console.log('\n' + '═'.repeat(60));
runTest();
