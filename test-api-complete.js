#!/usr/bin/env node

/**
 * 🧪 TEST COMPLET DE L'API
 * Vérifie que le serveur et la base de données sont correctement configurés
 */

const http = require('http');
const https = require('https');

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
console.log('\n🧪 Test API - URL:', API_BASE_URL);
console.log('=' .repeat(60));

// Fonction générique pour faire des requêtes
function faireRequete(methode, chemin, donnees = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(API_BASE_URL + chemin);
        const isHttps = url.protocol === 'https:';
        const client = isHttps ? https : http;

        const options = {
            method: methode,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Test-API/1.0'
            }
        };

        const req = client.request(url, options, (res) => {
            let data = '';
            
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data, error: 'JSON parse error' });
                }
            });
        });

        req.on('error', reject);
        
        if (donnees) {
            req.write(JSON.stringify(donnees));
        }
        
        req.end();
    });
}

// Tests
async function lancerTests() {
    console.log('\n📋 TESTS:');
    console.log('-'.repeat(60));

    try {
        // Test 1: Health Check
        console.log('\n✓ Test 1: Health Check');
        console.log('  Endpoint: GET /api/health');
        const health = await faireRequete('GET', '/api/health');
        if (health.status === 200 && health.data.success) {
            console.log('  ✅ SUCCÈS');
            console.log('  Statut:', health.data.status);
            console.log('  Base de données:', health.data.database);
        } else {
            console.log('  ❌ ÉCHOUÉ');
            console.log('  Status:', health.status);
            console.log('  Réponse:', health.data);
        }

        // Test 2: Statistiques
        console.log('\n✓ Test 2: Statistiques');
        console.log('  Endpoint: GET /api/statistiques');
        const stats = await faireRequete('GET', '/api/statistiques');
        if (stats.status === 200 && stats.data.success) {
            console.log('  ✅ SUCCÈS');
            console.log('  Total collectes:', stats.data.data.total_collectes);
            console.log('  Nombre de partenaires:', stats.data.data.nombre_partenaires);
        } else {
            console.log('  ❌ ÉCHOUÉ');
            console.log('  Status:', stats.status);
            console.log('  Réponse:', stats.data);
        }

        // Test 3: Envoi de données
        console.log('\n✓ Test 3: Envoi de données (POST)');
        console.log('  Endpoint: POST /api/collecte');
        
        const testData = {
            partenaire: 'TEST-AUTOMATIQUE',
            region: 'Dakar',
            departement: 'Dakar',
            commune: 'Dakar',
            typeActivite: 'Collecte',
            adresse: 'Rue Test, Dakar',
            superficie: 1.5,
            besoinPersonnel: 5,
            dispositifDeploy: 'Camion BTP',
            nombreRotation: 2,
            infrastructureGestion: 'PRN',
            frequenceCollecte: 'F1',
            bacs240: 10,
            caissePolybene: 5,
            bacs660: 3,
            accessibilite: 'Facile',
            observation: 'Test automatique',
            latitude: 14.6949,
            longitude: -17.0469,
            precision: 50,
            coordonneeX: 494000,
            coordonneeY: 1640000,
            photo: null,
            dateCollecte: new Date().toISOString()
        };

        const resultat = await faireRequete('POST', '/api/collecte', testData);
        if (resultat.status === 201 && resultat.data.success) {
            console.log('  ✅ SUCCÈS');
            console.log('  ID enregistrement:', resultat.data.data.id);
            console.log('  Date collecte:', resultat.data.data.dateCollecte);
        } else {
            console.log('  ❌ ÉCHOUÉ');
            console.log('  Status:', resultat.status);
            console.log('  Réponse:', resultat.data);
        }

        // Test 4: Récupérer toutes les collectes
        console.log('\n✓ Test 4: Récupérer toutes les collectes');
        console.log('  Endpoint: GET /api/collectes');
        const collectes = await faireRequete('GET', '/api/collectes');
        if (collectes.status === 200) {
            console.log('  ✅ SUCCÈS');
            console.log('  Total enregistrements:', collectes.data.length || collectes.data.data?.length || 0);
        } else {
            console.log('  ⚠️ NOTE');
            console.log('  Status:', collectes.status);
            console.log('  (Cet endpoint peut ne pas exister)');
        }

    } catch (error) {
        console.log('\n❌ ERREUR GÉNÉRALE');
        console.log('   Message:', error.message);
        console.log('\n💡 Vérifiez que:');
        console.log('   1. Le serveur est lancé: npm start');
        console.log('   2. L\'URL est correcte: ' + API_BASE_URL);
        console.log('   3. PostgreSQL est lancé');
        console.log('   4. La connexion réseau fonctionne');
        process.exit(1);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Tests terminés');
    console.log('\n💡 Prochaines étapes:');
    console.log('   1. Accédez à votre application');
    console.log('   2. Remplissez le formulaire');
    console.log('   3. Cliquez "Sauvegarder les Données"');
    console.log('   4. Les données devraient aparaître en base de données');
    console.log('   5. Relancez ce test pour voir le nouveau total');
    console.log('');
}

// Lancer les tests
lancerTests().catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
});
