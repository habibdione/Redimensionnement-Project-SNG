/**
 * TEST END-TO-END - Sauvegarde avec photo compressée
 * Teste la requête complète avec une petite photo de test
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST END-TO-END: Sauvegarde avec photo\n');

// Petite image de test en base64 (100x100 JPEG)
const smallTestPhoto = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

const testData = {
    partenaire: 'SONAGED',
    region: 'Dakar',
    departement: 'Dakar',
    commune: 'Dakar',
    typeActivite: 'Collecte des ordures ménagères',
    adresse: 'Route de l\'Aéroport',
    superficie: 150,
    besoinPersonnel: 5,
    dispositifDeploy: 'Bacs 240L',
    nombreRotation: 2,
    infrastructureGestion: 'Centre de tri',
    frequenceCollecte: 'Bi-hebdomadaire',
    bacs240: 10,
    caissePolybene: 5,
    bacs660: 2,
    accessibilite: 'Oui',
    latitude: 14.6928,
    longitude: -17.0469,
    precision: 10,
    coordonneeX: 449800,
    coordonneeY: 1628200,
    observation: 'Test avec photo compressée',
    photo: smallTestPhoto,
    dateCollecte: new Date().toISOString()
};

const jsonBody = JSON.stringify(testData);
const requestSize = jsonBody.length;

console.log(`📊 Statistiques requête:`);
console.log(`   Photo base64 size: ${(testData.photo.length / 1024).toFixed(2)} KB`);
console.log(`   Requête JSON complète: ${(requestSize / 1024).toFixed(2)} KB`);
console.log(`   Limite serveur: 25 MB`);

if (requestSize > 25 * 1024 * 1024) {
    console.log('   ⚠️ ERREUR: Requête dépasse la limite!');
    process.exit(1);
}

console.log('   ✅ Taille OK\n');

// Envoyer à l'API
console.log('📨 Envoi de la requête à http://localhost:3001/api/collecte...\n');

fetch('http://localhost:3001/api/collecte', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: jsonBody
})
.then(response => {
    console.log(`📡 Status: ${response.status} ${response.statusText}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    
    if (!response.ok) {
        return response.text().then(text => {
            console.log(`   Body (first 500 chars): ${text.substring(0, 500)}`);
            throw new Error(`HTTP ${response.status}`);
        });
    }
    
    return response.json();
})
.then(data => {
    console.log(`\n✅ Réponse du serveur:`);
    console.log(`   ${JSON.stringify(data, null, 2)}`);
    
    if (data.data && data.data.id) {
        console.log(`\n✅ TEST RÉUSSI - Record ID: ${data.data.id}`);
    } else {
        console.log('\n⚠️ Réponse reçue mais pas de ID');
    }
})
.catch(error => {
    console.error(`\n❌ ERREUR:`);
    console.error(`   ${error.message}`);
    console.error(`   Vérifiez que le serveur est lancé: npm start`);
    process.exit(1);
});
