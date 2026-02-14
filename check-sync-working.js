/**
 * VÉRIFIER QUE LA SYNCHRONISATION FONCTIONNE
 * ==========================================
 */

const http = require('http');

console.log('\n' + '='.repeat(70));
console.log('✅ VÉRIFICATION DE LA SYNCHRONISATION');
console.log('='.repeat(70));

const checks = [
    {
        name: 'Backend Server',
        url: 'http://localhost:3001/api/health',
        critical: true
    },
    {
        name: 'Frontend Server',
        url: 'http://localhost:5000',
        critical: false
    },
    {
        name: 'API Collectes',
        url: 'http://localhost:3001/api/collectes',
        critical: false
    },
    {
        name: 'API Statistiques',
        url: 'http://localhost:3001/api/statistiques',
        critical: false
    }
];

let checkedCount = 0;
let successCount = 0;

function checkServer(name, url, critical) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.log(`   ❌ ${name} - TIMEOUT`);
            resolve(false);
        }, 3000);

        http.get(url, (res) => {
            clearTimeout(timeout);
            if (res.statusCode === 200) {
                console.log(`   ✅ ${name} - OK (${res.statusCode})`);
                resolve(true);
            } else {
                console.log(`   ⚠️  ${name} - Status ${res.statusCode}`);
                resolve(!critical);
            }
        }).on('error', (error) => {
            clearTimeout(timeout);
            if (critical) {
                console.log(`   ❌ ${name} - ERREUR: ${error.message}`);
            } else {
                console.log(`   ⚠️  ${name} - ${error.message}`);
            }
            resolve(!critical);
        });
    });
}

async function runChecks() {
    console.log('\n🔍 Vérification des services:\n');

    for (const check of checks) {
        const result = await checkServer(check.name, check.url, check.critical);
        checkedCount++;
        if (result) successCount++;
    }

    console.log('\n' + '='.repeat(70));
    console.log(`📊 RÉSULTAT: ${successCount}/${checkedCount} services OK\n`);

    if (successCount === checkedCount) {
        console.log('✅ PARFAIT! Tout fonctionne correctement\n');
        console.log('🌐 Accédez à:');
        console.log('   • Frontend: http://localhost:5000');
        console.log('   • API: http://localhost:3001/api/collectes\n');
        console.log('📝 Remplissez le formulaire:');
        console.log('   1. Allez sur http://localhost:5000');
        console.log('   2. Remplissez les champs');
        console.log('   3. Cliquez "Valider"');
        console.log('   4. Vérifiez: node check-today-data.js\n');
    } else if (sucessCount > 0) {
        console.log('⚠️  Certains services ne répondent pas');
        console.log('   Vérifiez les logs des serveurs\n');
    } else {
        console.log('❌ AUCUN SERVICE DISPONIBLE');
        console.log('   Démarrez les serveurs:\n');
        console.log('   Terminal 1: npm start');
        console.log('   Terminal 2: npm run frontend\n');
    }

    console.log('='.repeat(70) + '\n');
}

runChecks();
