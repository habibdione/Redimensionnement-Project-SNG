// 🔍 SCRIPT DE DÉBOGAGE RAPIDE POUR LA CARTE
// Copiez ce code dans la console (F12) du navigateur

console.clear();
console.log('🔍 DÉMARRAGE DU DIAGNOSTIC RAPIDE');
console.log('═'.repeat(50));

// 1. Vérifier Leaflet
console.log('\n1️⃣ Vérification de Leaflet...');
if (typeof L !== 'undefined') {
    console.log('✅ Leaflet est chargée');
    console.log('   Version:', L.version);
} else {
    console.error('❌ Leaflet NON CHARGÉE');
}

// 2. Vérifier la carte
console.log('\n2️⃣ Vérification de la carte...');
if (typeof landingMap !== 'undefined' && landingMap !== null) {
    console.log('✅ Carte créée');
    const center = landingMap.getCenter();
    const zoom = landingMap.getZoom();
    console.log(`   Position: lat=${center.lat.toFixed(2)}, lng=${center.lng.toFixed(2)}`);
    console.log(`   Zoom: ${zoom}`);
} else {
    console.log('ℹ️ Carte pas encore créée (c\'est normal au démarrage)');
}

// 3. Vérifier les conteneur
console.log('\n3️⃣ Vérification du conteneur map...');
const mapDiv = document.getElementById('dimensionnement-map');
if (mapDiv) {
    console.log('✅ Conteneur trouvé');
    console.log(`   Dimension: ${mapDiv.offsetWidth}x${mapDiv.offsetHeight}px`);
} else {
    console.error('❌ Conteneur NOT FOUND');
}

// 4. Vérifier les données GeoJSON chargées
console.log('\n4️⃣ Vérification des données GeoJSON...');
const geoNames = ['json_Region_3', 'json_Departement_4', 'json_Arrondissement_5', 
                  'json_CollecteNational_6', 'json_BalayageNational_7', 'json_MobilierUrbain_8'];
let geoLoaded = 0;
geoNames.forEach(name => {
    if (typeof window[name] !== 'undefined') {
        console.log(`✅ ${name}`);
        geoLoaded++;
    } else {
        console.log(`❌ ${name}`);
    }
});
console.log(`\nRésulttat: ${geoLoaded}/${geoNames.length} GeoJSON chargées`);

// 5. Vérifier les couches affichées
console.log('\n5️⃣ Vérification des couches sur la carte...');
if (typeof geojsonLayers !== 'undefined') {
    console.log(`Couches GeoJSON chargées: ${Object.keys(geojsonLayers).length}`);
    for (let [name, layer] of Object.entries(geojsonLayers)) {
        const visible = landingMap && landingMap.hasLayer(layer) ? '✅' : '❌';
        console.log(`  ${visible} ${name}`);
    }
} else {
    console.log('ℹ️ geojsonLayers pas encore créé');
}

console.log('\n' + '═'.repeat(50));
console.log('🎯 COMMANDES DISPONIBLES:');
console.log('  • window.mapCommands.stats()     // Statistiques');
console.log('  • window.mapCommands.reset()     // Réinitialiser');
console.log('  • window.mapCommands.zoomTo("Region_3") // Zoom sur région');
console.log('═'.repeat(50));
