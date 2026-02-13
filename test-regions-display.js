/**
 * Script de test pour vérifier l'affichage des régions, départements et communes
 */

const http = require('http');

// Récupérer le contenu HTML
const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('✅ HTML reçu du serveur');
        console.log(`📊 Taille du fichier: ${(data.length / 1024).toFixed(2)} KB\n`);

        // Vérifier si SENEGAL_REGIONS est présent
        if (data.includes('const SENEGAL_REGIONS')) {
            console.log('✅ SENEGAL_REGIONS trouvé dans le HTML');
        } else {
            console.log('❌ SENEGAL_REGIONS NON trouvé dans le HTML');
        }

        // Vérifier si initialiserSelectsGeographiques est présent
        if (data.includes('function initialiserSelectsGeographiques')) {
            console.log('✅ initialiserSelectsGeographiques trouvé');
        } else {
            console.log('❌ initialiserSelectsGeographiques NON trouvé');
        }

        // Compter le nombre de régions
        const regionMatches = data.match(/id: '[^']*',\s*nom: '🏛️|🏘️|👑|🌾|🐪|🌴|🎪|🏞️|🌾|🏜️|🌲|🎋|🌳|🐠/g);
        if (regionMatches) {
            console.log(`✅ ${regionMatches.length} régions trouvées dans le HTML`);
        }

        // Compter les départements
        const deptMatches = data.match(/id: '[^']*-dept'/g);
        if (deptMatches) {
            console.log(`✅ ${deptMatches.length} départements trouvés dans le HTML`);
        }

        // Vérifier les select elements
        if (data.includes('id="region"')) {
            console.log('✅ Select region présent');
        } else {
            console.log('❌ Select region NON présent');
        }

        if (data.includes('id="departement"')) {
            console.log('✅ Select departement présent');
        } else {
            console.log('❌ Select departement NON présent');
        }

        if (data.includes('id="commune"')) {
            console.log('✅ Select commune présent');
        } else {
            console.log('❌ Select commune NON présent');
        }

        // Vérifier mettreAJourDepartements
        if (data.includes('function mettreAJourDepartements')) {
            console.log('✅ mettreAJourDepartements trouvé');
        } else {
            console.log('❌ mettreAJourDepartements NON trouvé');
        }

        // Vérifier mettreAJourCommunes
        if (data.includes('function mettreAJourCommunes')) {
            console.log('✅ mettreAJourCommunes trouvé');
        } else {
            console.log('❌ mettreAJourCommunes NON trouvé');
        }

        // Vérifier DOMContentLoaded avec initialiserSelectsGeographiques
        if (data.includes("DOMContentLoaded") && data.includes("initialiserSelectsGeographiques()")) {
            console.log('✅ DOMContentLoaded appelle initialiserSelectsGeographiques()');
        } else if (data.includes("DOMContentLoaded")) {
            console.log('⚠️  DOMContentLoaded trouvé mais initialiserSelectsGeographiques() pas appelé dedans');
        }

        console.log('\n✨ Test de présence terminé!');
    });
});

req.on('error', (e) => {
    console.error(`❌ Erreur de requête: ${e.message}`);
});

req.end();
