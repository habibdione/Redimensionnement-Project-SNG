/**
 * SCRIPT TEST AMÉLIORÉ - SYNCHRONISATION COMPLÈTE
 * ================================================
 * Teste: Récupère données après sauvegarde → Les synchronise avec le backend
 */

const http = require('http');
const https = require('https');

// ═══════════════════════════════════════════════════════════════
// ⚙️  CONFIGURATION - À ADAPTER
// ═══════════════════════════════════════════════════════════════

// Frontend GitHub Pages
const FRONTEND_URL = 'https://habibdione.github.io/Redimensionnement-Project-SNG/';

// Options de backend (décommenter celle à utiliser)
const BACKEND_OPTIONS = {
    // Option 1: Backend local (localhost:3001)
    local: 'http://localhost:3001',
    
    // Option 2: Backend sur devtunnels.ms (remplacer par votre domaine)
    devtunnels: 'https://YOUR_TUNNEL_ID-3001.euw.devtunnels.ms',
    
    // Option 3: Backend sur GitHub Pages + API
    github: 'https://habibdione.github.io/api',
    
    // Option 4: Backend personnalisé
    custom: process.env.BACKEND_URL || 'http://localhost:3001'
};

// Choisir le backend actif ici:
// Décommenter la ligne correspondante à votre configuration
const ACTIVE_BACKEND = BACKEND_OPTIONS.local; 
// const ACTIVE_BACKEND = BACKEND_OPTIONS.devtunnels; 
// const ACTIVE_BACKEND = BACKEND_OPTIONS.github;
// const ACTIVE_BACKEND = BACKEND_OPTIONS.custom;

console.log('\n' + '█'.repeat(80));
console.log('█' + ' '.repeat(78) + '█');
console.log('█' + '  🧪 TEST SYNCHRONISATION COMPLÈTE - GitHub Pages + Backend'.padEnd(79) + '█');
console.log('█' + ' '.repeat(78) + '█');
console.log('█'.repeat(80) + '\n');

console.log('📋 CONFIGURATION:');
console.log(`   Frontend: ${FRONTEND_URL}`);
console.log(`   Backend:  ${ACTIVE_BACKEND}`);
console.log(`   Date:     ${new Date().toLocaleString('fr-FR')}\n`);

// ═══════════════════════════════════════════════════════════════
// 📊 DONNÉES DE TEST
// ═══════════════════════════════════════════════════════════════

const testDataSet = [
    {
        partenaire: 'Test GitHub Pages 1',
        region: 'Dakar',
        departement: 'Dakar',
        commune: 'Plateau',
        type_activite: 'Collecte',
        site_concerne: 'Site Test GitHub 1',
        adresse: 'Rue de la Paix, Dakar',
        superficie: 150.5,
        besoin_personnel: 8,
        dispositif_deploye: 'Camion 3 essieux',
        nombre_rotation: 3,
        infrastructure_gestion: 'Oui',
        prn_pp: 'Pointage',
        frequence_collecte: 'Quotidienne',
        bacs_240l: 10,
        caisse_polybene: 5,
        bacs_660l: 3,
        accessibilite: 'Facile',
        latitude: 14.6749,
        longitude: -17.0555,
        precision: 15,
        observation: 'Données test envoyées depuis GitHub Pages'
    },
    {
        partenaire: 'Test GitHub Pages 2',
        region: 'Thiès',
        departement: 'Thiès',
        commune: 'Thiès',
        type_activite: 'Collecte Partielle',
        site_concerne: 'Site Test GitHub 2',
        adresse: 'Avenue Lamine Guèye, Thiès',
        superficie: 200.0,
        besoin_personnel: 12,
        dispositif_deploye: 'Camion 2 essieux',
        nombre_rotation: 2,
        infrastructure_gestion: 'Non',
        prn_pp: 'Pointage',
        frequence_collecte: 'Bi-quotidienne',
        bacs_240l: 15,
        caisse_polybene: 8,
        bacs_660l: 5,
        accessibilite: 'Difficile',
        latitude: 14.7920,
        longitude: -16.9671,
        precision: 20,
        observation: 'Route d\'accès étroite'
    }
];

// ═══════════════════════════════════════════════════════════════
// 🔄 FONCTIONS D'ENVOI
// ═══════════════════════════════════════════════════════════════

function makeRequest(method, url, data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const protocol = url.startsWith('https') ? https : http;
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = protocol.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', reject);
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// ═══════════════════════════════════════════════════════════════
// 🚀 TESTS
// ═══════════════════════════════════════════════════════════════

async function runTests() {
    let successCount = 0;
    let failCount = 0;

    // Test 1: Vérifier la santé du backend
    console.log('1️⃣  VÉRIFICATION BACKEND\n');
    try {
        const healthUrl = `${ACTIVE_BACKEND}/api/health`;
        console.log(`   Teste: ${healthUrl}`);
        const health = await makeRequest('GET', healthUrl);
        
        if (health.status === 200) {
            console.log(`   ✅ Backend en ligne (Status: ${health.status})`);
            console.log(`   Status: ${health.data.status || 'OK'}\n`);
            successCount++;
        } else {
            console.log(`   ⚠️  Status: ${health.status}`);
            console.log(`   Réponse: ${JSON.stringify(health.data)}\n`);
        }
    } catch (error) {
        console.log(`   ❌ Erreur: ${error.message}\n`);
        failCount++;
    }

    // Test 2: Envoyer les données de test
    console.log('2️⃣  ENVOI DES DONNÉES DE TEST\n');
    let submittedIds = [];
    
    for (let i = 0; i < testDataSet.length; i++) {
        const data = testDataSet[i];
        try {
            const collecteUrl = `${ACTIVE_BACKEND}/api/collecte`;
            console.log(`   [${i + 1}/${testDataSet.length}] Envoi données: ${data.partenaire}`);
            
            const response = await makeRequest('POST', collecteUrl, data);
            
            if (response.status === 200 || response.status === 201) {
                const id = response.data.id || response.data.insertId || 'unknown';
                console.log(`         ✅ Enregistrée avec ID: ${id}`);
                submittedIds.push(id);
                successCount++;
            } else {
                console.log(`         ⚠️  Status: ${response.status}`);
                console.log(`         ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            console.log(`         ❌ Erreur: ${error.message}`);
            failCount++;
        }
    }
    console.log();

    // Test 3: Récupérer et vérifier les données
    console.log('3️⃣  RÉCUPÉRATION DES DONNÉES\n');
    try {
        const collectesUrl = `${ACTIVE_BACKEND}/api/collectes`;
        console.log(`   Fetch: ${collectesUrl}`);
        
        const response = await makeRequest('GET', collectesUrl);
        
        if (response.status === 200) {
            const collectes = Array.isArray(response.data) ? response.data : response.data.data || [];
            console.log(`   ✅ ${collectes.length} données reçues\n`);
            
            // Afficher les dernières données
            console.log('   📋 Dernières données:');
            const recent = collectes.slice(-5);
            recent.forEach((item, idx) => {
                console.log(`      ${idx + 1}. [ID ${item.id}] ${item.partenaire || 'N/A'} - ${item.region || 'N/A'}`);
            });
            console.log();
            successCount++;
        } else {
            console.log(`   ❌ Impossible de récupérer (Status: ${response.status})\n`);
            failCount++;
        }
    } catch (error) {
        console.log(`   ❌ Erreur: ${error.message}\n`);
        failCount++;
    }

    // Test 4: Récupérer statistiques
    console.log('4️⃣  STATISTIQUES\n');
    try {
        const statsUrl = `${ACTIVE_BACKEND}/api/statistiques`;
        console.log(`   Fetch: ${statsUrl}`);
        
        const response = await makeRequest('GET', statsUrl);
        
        if (response.status === 200) {
            console.log(`   ✅ Statistiques reçues:\n`);
            console.log(`      Total collectes: ${response.data.total || '?'}`);
            console.log(`      Aujourd'hui: ${response.data.today || 0}`);
            console.log(`      Cette semaine: ${response.data.week || '?'}\n`);
            successCount++;
        } else {
            console.log(`   ⚠️  Status: ${response.status}\n`);
        }
    } catch (error) {
        console.log(`   ℹ️  Stats non disponibles: ${error.message}\n`);
    }

    // Résumé
    console.log('█'.repeat(80));
    console.log('█' + ' '.repeat(78) + '█');
    console.log('█' + `  📊 RÉSUMÉ: ${successCount} ✅ | ${failCount} ❌`.padEnd(79) + '█');
    console.log('█' + ' '.repeat(78) + '█');
    console.log('█'.repeat(80) + '\n');

    if (failCount === 0) {
        console.log('✅ TOUS LES TESTS RÉUSSIS!\n');
        console.log('📝 Données synchronisées avec succès:\n');
        submittedIds.forEach((id, idx) => {
            console.log(`   ${idx + 1}. ID: ${id}`);
        });
    } else {
        console.log('⚠️  CERTAINS TESTS ONT ÉCHOUÉ\n');
        console.log('🔧 DIAGNOSTIC:\n');
        console.log(`   1. Vérifier que le backend est lancé:`);
        console.log(`      npm start\n`);
        console.log(`   2. Vérifier l'URL du backend:`);
        console.log(`      ${ACTIVE_BACKEND}\n`);
        console.log(`   3. Vérifier la configuration du parefeu/CORS\n`);
        console.log(`   4. Modifiez si besoin ACTIVE_BACKEND dans ce script\n`);
    }

    console.log('💡 POUR CONFIGURER LE BACKEND:\n');
    console.log('   Modifiez la ligne:');
    console.log('   const ACTIVE_BACKEND = BACKEND_OPTIONS.local; // ← changez ici\n');
    console.log('   Options disponibles:');
    console.log('   • .local      → http://localhost:3001');
    console.log('   • .devtunnels → https://YOUR_ID-3001.euw.devtunnels.ms');
    console.log('   • .github     → https://habibdione.github.io/api');
    console.log('   • .custom     → Variable d\'env BACKEND_URL\n');

    console.log('═'.repeat(80) + '\n');
}

// Exécuter
runTests().catch(console.error);
