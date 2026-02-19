/**
 * 🗺️ Script d'initialisation des données GeoJSON
 * Charge simplement les fichiers de données depuis /data/
 */

console.log('📥 Initialisation des données GeoJSON...');

// Mapping simple des fichiers
const geoJsonFiles = {
    'Region_3': { file: './data/Region_3.js', varName: 'json_Region_3' },
    'Departement_4': { file: './data/Departement_4.js', varName: 'json_Departement_4' },
    'Arrondissement_5': { file: './data/Arrondissement_5.js', varName: 'json_Arrondissement_5' },
    'CollecteNational_6': { file: './data/CollecteNational_6.js', varName: 'json_CollecteNational_6' },
    'BalayageNational_7': { file: './data/BalayageNational_7.js', varName: 'json_BalayageNational_7' },
    'MobilierUrbain_8': { file: './data/MobilierUrbain_8.js', varName: 'json_MobilierUrbain_8' }
};

// Flag pour indiquer que les données sont prêtes
window.geoJsonReady = false;
window.geoJsonLoaded = {};

// Charger récursivement les fichiers GeoJSON
function loadNextFile(fileNames, index = 0) {
    if (index >= fileNames.length) {
        console.log('✅ Tous les GeoJSON sont chargés');
        window.geoJsonReady = true;
        
        // Afficher le résumé
        const loaded = Object.keys(window.geoJsonLoaded).filter(k => window.geoJsonLoaded[k]).length;
        console.log(`📊 Résumé: ${loaded}/${fileNames.length} couches chargées`);
        
        return;
    }
    
    const fileName = fileNames[index];
    const config = geoJsonFiles[fileName];
    
    console.log(`📥 Chargement ${fileName}...`);
    
    const script = document.createElement('script');
    script.src = config.file;
    script.async = false; // Charger séquentiellement
    
    script.onload = () => {
        const geoJson = window[config.varName];
        if (geoJson && geoJson.type === 'FeatureCollection') {
            console.log(`✅ ${fileName} OK (${geoJson.features.length} features)`);
            window.geoJsonLoaded[fileName] = true;
        } else {
            console.warn(`⚠️ ${fileName} chargée mais pas de données (vide)`);
            window.geoJsonLoaded[fileName] = false;
        }
        
        // Charger le fichier suivant
        loadNextFile(fileNames, index + 1);
    };
    
    script.onerror = (error) => {
        console.error(`❌ Erreur lors du chargement de ${fileName}:`, error);
        window.geoJsonLoaded[fileName] = false;
        
        // Créer une variable vide par défaut
        window[config.varName] = { type: 'FeatureCollection', features: [] };
        
        // Continuer quand même
        loadNextFile(fileNames, index + 1);
    };
    
    document.head.appendChild(script);
}

// Attendre que le document soit complètement chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM chargé - Initialisation GeoJSON...');
        loadNextFile(Object.keys(geoJsonFiles));
    });
} else {
    console.log('📄 DOM déjà chargé - Initialisation GeoJSON...');
    loadNextFile(Object.keys(geoJsonFiles));
}

// Attendre que geoJsonReady soit true avant d'appeler la carte
window.waitForGeoJson = async function(timeout = 10000) {
    const startTime = Date.now();
    while (!window.geoJsonReady && (Date.now() - startTime) < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return window.geoJsonReady;
};

