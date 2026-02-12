#!/usr/bin/env node
/**
 * Test de l'API /api/collecte
 * Vérifie que les données peuvent être sauvegardées correctement
 */

const http = require('http');

const testData = {
    partenaire: "SONAGED Test",
    region: "Région de Ziguinchor",
    departement: "Ziguinchor",
    commune: "Ziguinchor",
    adresse: "123 Rue Test",
    typeActivite: "Levé des déchets",
    superficie: "0.5",
    besoinPersonnel: "5",
    dispositifDeploy: "Bacs collecte",
    nombreRotation: "2",
    infrastructureGestion: "Centralisée",
    frequenceCollecte: "Quotidienne",
    bacs240: "10",
    caissePolybene: "5",
    bacs660: "3",
    accessibilite: "Facile",
    latitude: "13.123456",
    longitude: "-15.654321",
    precision: "10",
    coordonneeX: "500000",
    coordonneeY: "1400000",
    observation: "Test de sauvegarde",
    photo: null,
    dateCollecte: new Date().toISOString()
};

console.log('\n📤 Test de l\'endpoint POST /api/collecte\n');
console.log('Données envoyées:');
console.log(JSON.stringify(testData, null, 2));

const jsonString = JSON.stringify(testData);
console.log(`\nTaille: ${jsonString.length} bytes\n`);

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/collecte',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(jsonString)
    }
};

const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}\n`);
    console.log('Headers:', res.headers);
    console.log('\n');

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('📥 Réponse du serveur:');
        console.log(data);
        
        // Essayer de parser le JSON
        try {
            const json = JSON.parse(data);
            console.log('\n✅ JSON valide!');
            console.log('Succès:', json.success);
            if (json.data) {
                console.log('ID enregistrement:', json.data.id);
            }
        } catch (e) {
            console.log('\n❌ ERREUR: Pas du JSON valide!');
            console.log('Erreur:', e.message);
            console.log('\nCela signifie que le serveur a retourné du HTML au lieu du JSON');
            console.log('Vérifez les logs du serveur pour les erreurs.');
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Erreur de connexion:', error.message);
    if (error.code === 'ECONNREFUSED') {
        console.error('   Le serveur n\'est pas accessible sur localhost:3001');
        console.error('   Assurez-vous que npm start est lancé\n');
    }
});

req.write(jsonString);
req.end();
