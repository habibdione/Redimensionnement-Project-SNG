/**
 * Test de vérification des données de SENEGAL_REGIONS
 * Ce test parse le HTML et extrait les données
 */

const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let html = '';

    res.on('data', (chunk) => {
        html += chunk;
    });

    res.on('end', () => {
        console.log('🔍 Analyse des données de régions, départements et communes...\n');

        // Extraire la définition de SENEGAL_REGIONS
        const startIdx = html.indexOf('const SENEGAL_REGIONS = {');
        const endIdx = html.indexOf('};', startIdx);

        if (startIdx !== -1 && endIdx !== -1) {
            const regionCode = html.substring(startIdx, endIdx + 2);
            
            // Compter les régions uniques
            const regionIds = Array.from(regionCode.matchAll(/id: '([^']*)',\s*nom: '[^']*'/g)).map(m => m[1]);
            const uniqueRegionIds = [...new Set(regionIds.filter(id => id.endsWith('') && !id.endsWith('-dept') && !id.endsWith('-kulor')))];
            
            console.log(`📊 DONNÉES EXTRAITES:`);
            console.log(`   ✅ Nombre de régions: ${Object.values(regionIds).filter((v, i, a) => a.indexOf(v) === i && !v.includes('-')).length}`);
            
            // Extraire quelques régions pour vérifier
            const dkarMatch = regionCode.match(/id: 'dakar'.*?nom: '([^']*)'/);
            if (dkarMatch) {
                console.log(`   ✅ Région Dakar trouvée: ${dkarMatch[1]}`);
            }
            
            const zigMatch = regionCode.match(/id: 'ziguinchor'.*?nom: '([^']*)'/);
            if (zigMatch) {
                console.log(`   ✅ Région Ziguinchor trouvée: ${zigMatch[1]}`);
            }

            // Extraire les communes de Ziguinchor
            const zigSection = regionCode.match(/id: 'ziguinchor'[\s\S]*?(?=},\s*\{|\])/);
            if (zigSection) {
                const zigCommunes = zigSection[0].match(/communes: \[(.*?)\]/g);
                if (zigCommunes) {
                    console.log(`\n🌴 Communes de Ziguinchor trouvées: ${zigCommunes.length} groupe(s)`);
                    
                    // Afficher quelques communes
                    const zCommuns = Array.from(zigSection[0].matchAll(/'([^']+)'/g));
                    const uniqueZ = [...new Set(zCommuns.map(m => m[1]))];
                    console.log(`   - Ziguinchor (ville)`);
                    uniqueZ.slice(0, 3).forEach(commune => {
                        if (commune !== 'Ziguinchor' && commune !== 'ziguinchor-dept' && commune !== 'Adéane') {
                            console.log(`   - ${commune}`);
                        }
                    });
                }
            }

            // Vérifier les fonctions getRegions, getDepartements, getCommunes
            if (regionCode.includes('getRegions: function()')) {
                console.log(`\n✅ Méthode getRegions trouvée`);
            }
            if (regionCode.includes('getDepartements: function(regionId)')) {
                console.log(`✅ Méthode getDepartements trouvée`);
            }
            if (regionCode.includes('getCommunes: function(regionId, departementId)')) {
                console.log(`✅ Méthode getCommunes trouvée`);
            }

            console.log('\n✨ Vérification complète');
        } else {
            console.error('❌ SENEGAL_REGIONS non trouvé dans le HTML');
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Erreur: ${e.message}`);
});

req.end();
