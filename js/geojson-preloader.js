/**
 * 🗺️ Script d'initialisation des données GeoJSON
 * Ce script assure que les données sont correctement chargées et accessibles
 */

console.log('📥 Initialisation des données GeoJSON...');

// Mapping des fichiers vers les noms de variables
const geoJsonMappings = {
    'Region_3': { file: './data/Region_3.js', varName: 'json_Region_3' },
    'Departement_4': { file: './data/Departement_4.js', varName: 'json_Departement_4' },
    'Arrondissement_5': { file: './data/Arrondissement_5.js', varName: 'json_Arrondissement_5' },
    'CollecteNational_6': { file: './data/CollecteNational_6.js', varName: 'json_CollecteNational_6' },
    'BalayageNational_7': { file: './data/BalayageNational_7.js', varName: 'json_BalayageNational_7' },
    'MobilierUrbain_8': { file: './data/MobilierUrbain_8.js', varName: 'json_MobilierUrbain_8' }
};

// Pré-charger tous les fichiers GeoJSON
function preloadGeoJsonFiles() {
    return new Promise((resolve) => {
        let loadedCount = 0;
        
        Object.entries(geoJsonMappings).forEach(([key, config]) => {
            const script = document.createElement('script');
            script.src = config.file;
            script.async = true;
            
            script.onload = () => {
                loadedCount++;
                console.log(`✅ ${key} chargée (${loadedCount}/${Object.keys(geoJsonMappings).length})`);
                
                // Vérifier que la variable existe
                if (typeof window[config.varName] !== 'undefined') {
                    console.log(`   Data found: ${config.varName}`);
                } else {
                    console.warn(`   ⚠️ Variable ${config.varName} non trouvée`);
                }
                
                if (loadedCount === Object.keys(geoJsonMappings).length) {
                    console.log('✅ Tous les GeoJSON sont pré-chargés');
                    resolve();
                }
            };
            
            script.onerror = () => {
                console.error(`❌ Erreur lors du chargement de ${config.file}`);
                loadedCount++;
                if (loadedCount === Object.keys(geoJsonMappings).length) {
                    resolve();
                }
            };
            
            document.head.appendChild(script);
        });
    });
}

// Attendre que le document soit complètement chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM chargé - Pré-chargement des GeoJSON...');
        preloadGeoJsonFiles();
    });
} else {
    console.log('📄 DOM déjà chargé - Pré-chargement des GeoJSON...');
    preloadGeoJsonFiles();
}
