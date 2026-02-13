/**
 * Test JavaScript - Simulation du chargement côté client
 * Vérifie que les données s'affichent dans les dropdowns
 */

const http = require('http');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

console.log('🔄 Récupération du HTML...\n');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/',
    method: 'GET'
};

const req = http.request(options, async (res) => {
    let html = '';

    res.on('data', (chunk) => {
        html += chunk;
    });

    res.on('end', async () => {
        console.log('📄 HTML reçu, création du DOM virtuel...\n');

        try {
            // Créer un DOM virtuel
            const dom = new JSDOM(html, {
                runScripts: "outside-only",
                resources: "usable"
            });

            const window = dom.window;
            const document = window.document;

            console.log('✅ DOM virtuel créé\n');

            // Vérifier les éléments HTML
            const regionSelect = document.getElementById('region');
            const departementSelect = document.getElementById('departement');
            const communeSelect = document.getElementById('commune');

            if (regionSelect) {
                console.log(`✅ Select région trouvé`);
                console.log(`   - Options initiales: ${regionSelect.options.length}`);
            } else {
                console.log('❌ Select région NON trouvé');
            }

            if (departementSelect) {
                console.log(`✅ Select département trouvé`);
                console.log(`   - Options initiales: ${departementSelect.options.length}`);
            } else {
                console.log('❌ Select département NON trouvé');
            }

            if (communeSelect) {
                console.log(`✅ Select commune trouvé`);
                console.log(`   - Options initiales: ${communeSelect.options.length}`);
            } else {
                console.log('❌ Select commune NON trouvé');
            }

            // Extraire et exécuter le script inline
            console.log('\n🚀 Exécution du script du formulaire...\n');

            // Récupérer tous les scripts inline
            const scripts = document.querySelectorAll('script');
            let mainScript = '';

            for (let script of scripts) {
                if (!script.src && script.textContent.includes('SENEGAL_REGIONS')) {
                    mainScript = script.textContent;
                    break;
                }
            }

            if (mainScript) {
                try {
                    // Exécuter le script dans le contexte du window
                    window.eval(mainScript);
                    
                    console.log('✅ Script exécuté\n');

                    // Vérifier si SENEGAL_REGIONS est disponible
                    if (window.SENEGAL_REGIONS) {
                        console.log('✅ SENEGAL_REGIONS défini globalement');
                        console.log(`   - Régions: ${window.SENEGAL_REGIONS.getRegions().length}`);
                        
                        // Afficher les régions
                        console.log('\n🗺️  RÉGIONS CHARGÉES:');
                        window.SENEGAL_REGIONS.getRegions().forEach(region => {
                            console.log(`   ✅ ${region.nom} (${region.departements.length} depts)`);
                        });

                        // Tester l'initialisation
                        console.log('\n🔧 Test d\'initialisation des selects...\n');
                        
                        if (window.initialiserSelectsGeographiques) {
                            window.initialiserSelectsGeographiques();
                            
                            console.log(`✅ initialiserSelectsGeographiques() exécutée`);
                            console.log(`   - Options région après init: ${regionSelect.options.length}`);
                            
                            // Afficher les régions dans le dropdown
                            console.log('\n📋 OPTIONS RÉGION DANS LE DROPDOWN:');
                            for (let i = 0; i < regionSelect.options.length; i++) {
                                const opt = regionSelect.options[i];
                                if (i > 0) console.log(`   ✅ ${opt.text}`);
                                if (i > 5 && i < regionSelect.options.length - 1) {
                                    console.log(`   ... (${regionSelect.options.length - i - 2} plus)`);
                                    break;
                                }
                            }
                        } else {
                            console.log('❌ initialiserSelectsGeographiques NON définie');
                        }

                        // Tester la mise à jour des départements
                        console.log('\n🔧 Test de mise à jour des départements...\n');
                        
                        if (window.mettreAJourDepartements) {
                            // Sélectionner Ziguinchor
                            regionSelect.value = 'ziguinchor';
                            window.mettreAJourDepartements();
                            
                            console.log(`✅ mettreAJourDepartements() exécutée pour Ziguinchor`);
                            console.log(`   - Options département: ${departementSelect.options.length}`);
                            
                            console.log('\n📋 DÉPARTEMENTS DE ZIGUINCHOR:');
                            for (let i = 1; i < departementSelect.options.length; i++) {
                                console.log(`   ✅ ${departementSelect.options[i].text}`);
                            }

                            // Tester les communes
                            console.log('\n🔧 Test de mise à jour des communes...\n');
                            
                            departementSelect.value = departementSelect.options[1].value;
                            window.mettreAJourCommunes();
                            
                            console.log(`✅ mettreAJourCommunes() exécutée`);
                            console.log(`   - Options commune: ${communeSelect.options.length}`);
                            
                            const deptSelected = departementSelect.options[departementSelect.selectedIndex].text;
                            console.log(`\n📋 COMMUNES DE ${deptSelected}:`);
                            for (let i = 1; i < communeSelect.options.length && i <= 5; i++) {
                                console.log(`   ✅ ${communeSelect.options[i].text}`);
                            }
                            if (communeSelect.options.length > 6) {
                                console.log(`   ... (${communeSelect.options.length - 6} plus)`);
                            }
                        } else {
                            console.log('❌ mettreAJourDepartements NON définie');
                        }

                        console.log('\n✨ TEST COMPLET - SUCCÈS!');
                    } else {
                        console.log('❌ SENEGAL_REGIONS NON défini après exécution du script');
                    }
                } catch (error) {
                    console.error('❌ Erreur during script execution:', error.message);
                }
            } else {
                console.log('⚠️  Script principal non trouvé');
            }

        } catch (error) {
            console.error('❌ Erreur JSDOM:', error.message);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Erreur de requête: ${e.message}`);
});

req.end();
