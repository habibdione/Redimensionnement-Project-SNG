#!/usr/bin/env node

/**
 * Script de test complet: Sauvegarde dans PostgreSQL
 * Simule un formulaire rempli et envoie les données au backend
 */

const http = require('http');

const testData = {
    partenaire: 'SONAGED Test',
    region: 'Dakar',
    departement: 'Dakar',
    commune: 'Dakar',
    typeActivite: 'Collecte,Balayage',
    adresse: '123 Rue de Test, Dakar',
    superficie: '2.45',
    besoinPersonnel: '8',
    deviceDeploy: 'Pelle Chargeur,Camion BTP',
    nombreRotation: '3',
    infrastructureGestion: 'PRN',
    frequenceCollecte: 'F2',
    bacs240: '10',
    caissePolybene: '5',
    bacs660: '3',
    accessibilite: 'Facile',
    latitude: '14.6349',
    longitude: '-61.5242',
    precision: '8.5',
    coordonneeX: '123456.78',
    coordonneeY: '654321.12',
    observation: 'Ceci est un test d\'insertion dans PostgreSQL',
    photo: null,
    dateCollecte: new Date().toISOString()
};

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║  TEST COMPLET: SAUVEGARDE DANS POSTGRESQL         ║');
console.log('╚════════════════════════════════════════════════════╝\n');

console.log('📋 Données de test à envoyer:');
console.log(`   Partenaire: ${testData.partenaire}`);
console.log(`   Région: ${testData.region}`);
console.log(`   Latitude: ${testData.latitude}`);
console.log(`   Longitude: ${testData.longitude}\n`);

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

console.log('🚀 Envoi des données au serveur...\n');

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`\n📡 Réponse serveur (Status: ${res.statusCode}):\n`);
        
        try {
            const response = JSON.parse(data);
            console.log(JSON.stringify(response, null, 2));

            if (response.success) {
                console.log('\n╔════════════════════════════════════════════════════╗');
                console.log('║  ✅ DONNÉES SAUVEGARDÉES DANS POSTGRESQL!          ║');
                console.log('╚════════════════════════════════════════════════════╝\n');
                console.log(`   ID enregistrement: ${response.data.id}`);
                console.log(`   Date de collecte: ${response.data.dateCollecte}\n`);

                // Vérifier immédiatement que les données existent en base
                console.log('⏳ Vérification en base de données...\n');
                setTimeout(() => {
                    verifyInDatabase(response.data.id);
                }, 500);
            } else {
                console.log('\n❌ Erreur lors de la sauvegarde');
                process.exit(1);
            }
        } catch (e) {
            console.error('❌ Erreur parsing JSON:', e.message);
            console.error('Réponse brute:', data);
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Erreur lors de l'envoi: ${e.message}`);
    console.error('\n💡 Vérifiez que le serveur backend est lancé:');
    console.error('   npm start\n');
    process.exit(1);
});

req.write(postData);
req.end();

// Vérifier en base
async function verifyInDatabase(id) {
    const { Pool } = require('pg');
    const dotenv = require('dotenv');
    
    dotenv.config();
    
    const pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'senelec_dimensionnement'
    });

    try {
        const result = await pool.query(
            'SELECT id, partenaire, region, latitude, longitude, date_collecte FROM collectes_donnees WHERE id = $1',
            [id]
        );

        if (result.rows.length > 0) {
            const record = result.rows[0];
            console.log('✅ Enregistrement trouvé en base de données:');
            console.log(`   ID: ${record.id}`);
            console.log(`   Partenaire: ${record.partenaire}`);
            console.log(`   Région: ${record.region}`);
            console.log(`   Latitude: ${record.latitude}`);
            console.log(`   Longitude: ${record.longitude}`);
            console.log(`   Date: ${record.date_collecte}\n`);

            console.log('╔════════════════════════════════════════════════════╗');
            console.log('║  ✅ SYSTÈME COMPLET FONCTIONNEL!                   ║');
            console.log('║  Les données sont bien sauvegardées dans PostgreSQL║');
            console.log('╚════════════════════════════════════════════════════╝\n');
        } else {
            console.log('❌ Enregistrement non trouvé en base!');
            process.exit(1);
        }

        await pool.end();
    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error.message);
        process.exit(1);
    }
}
