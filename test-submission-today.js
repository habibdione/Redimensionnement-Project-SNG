/**
 * TEST COMPLET DE SOUMISSION
 * ==========================
 * Teste si le serveur reçoit et enregistre les données
 */

const http = require('http');
const https = require('https');

// Configuration
const serverUrl = 'http://localhost:3001' || process.env.API_URL;
const testData = {
    partenaire: 'TEST_AUJOURD_HUI',
    region: 'Dakar',
    departement: 'Dakar',
    commune: 'Dakar',
    type_activite: 'Collecte Test',
    site_concerne: 'Site de Test',
    adresse: 'Test Street, Dakar',
    superficie: 100.5,
    besoin_personnel: 5,
    dispositif_deploye: 'Camion',
    nombre_rotation: 2,
    infrastructure_gestion: 'Oui',
    prn_pp: 'Pointage',
    frequence_collecte: 'Quotidienne',
    bacs_240l: 5,
    caisse_polybene: 3,
    bacs_660l: 2,
    accessibilite: 'Facile',
    latitude: 14.6496,
    longitude: -17.0438,
    precision: 10,
    observation: 'Donnees de test envoyees le ' + new Date().toLocaleString('fr-FR')
};

async function testSubmission() {
    console.log('\n🧪 TEST DE SOUMISSION DES DONNÉES');
    console.log('='.repeat(60));
    console.log(`Serveur: ${serverUrl}`);
    console.log(`Date/Heure: ${new Date().toLocaleString('fr-FR')}\n`);

    // 1. Vérifier la santé du serveur
    console.log('1️⃣  Vérification de la santé du serveur...');
    try {
        const healthResponse = await fetch(`${serverUrl}/api/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Serveur en ligne');
        console.log(`   Status: ${healthData.status}`);
    } catch (error) {
        console.error('❌ ERREUR: Le serveur n\'est pas accessible');
        console.error(`   Message: ${error.message}`);
        console.error('\n💡 Solutions:');
        console.error('   1. Démarrer le serveur: npm start');
        console.error('   2. Vérifier le port 3001');
        console.error('   3. Vérifier les variables .env');
        return;
    }

    // 2. Envoyer les données de test
    console.log('\n2️⃣  Envoi des données de test...');
    try {
        const response = await fetch(`${serverUrl}/api/collecte`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Données envoyées avec succès');
            console.log(`   ID: ${result.id}`);
            console.log(`   Message: ${result.message}`);
        } else {
            console.error('❌ Erreur lors de l\'envoi');
            console.error(`   Code: ${response.status}`);
            console.error(`   Réponse: ${JSON.stringify(result, null, 2)}`);
        }
    } catch (error) {
        console.error('❌ ERREUR lors de l\'envoi:', error.message);
    }

    // 3. Récupérer les données d'aujourd'hui
    console.log('\n3️⃣  Vérification des données d\'aujourd\'hui...');
    try {
        const response = await fetch(`${serverUrl}/api/collectes`);
        const collectes = await response.json();
        
        // Filtrer les données d'aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        const todayData = collectes.filter(c => 
            new Date(c.date_collecte).toISOString().split('T')[0] === today
        );

        console.log(`✅ Total collectes en base: ${collectes.length}`);
        console.log(`   Collectes aujourd'hui: ${todayData.length}`);

        if (todayData.length > 0) {
            console.log('\n   Donnees recues aujourd\'hui:');
            todayData.forEach((data, idx) => {
                console.log(`   ${idx + 1}. ID ${data.id} - ${data.partenaire} (${new Date(data.date_collecte).toLocaleTimeString('fr-FR')})`);
            });
        }
    } catch (error) {
        console.error('❌ ERREUR lors de la récupération:', error.message);
    }

    console.log('\n' + '='.repeat(60));
}

// Utiliser fetch natif (Node.js 18+)
if (!globalThis.fetch) {
    // Fallback pour versions anciennes
    const http = require('http');
    const https = require('https');
    
    globalThis.fetch = async (url, options = {}) => {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            const req = protocol.request(url, {
                method: options.method || 'GET',
                headers: options.headers
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        status: res.statusCode,
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        json: async () => JSON.parse(data)
                    });
                });
            });
            req.on('error', reject);
            if (options.body) req.write(options.body);
            req.end();
        });
    };
}

testSubmission();
