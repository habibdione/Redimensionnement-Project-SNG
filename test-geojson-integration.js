#!/usr/bin/env node
/**
 * 🧪 TEST D'INTÉGRATION GeoJSON - Diagnostic complet
 * Vérifie que toutes les couches GeoJSON sont correctement chargées
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 DIAGNOSTIC COMPLET DES DONNÉES GeoJSON\n');
console.log('═'.repeat(60));

const dataDir = path.join(__dirname, 'data');
const layers = [
    'Region_3',
    'Departement_4', 
    'Arrondissement_5',
    'CollecteNational_6',
    'BalayageNational_7',
    'MobilierUrbain_8'
];

let totalFeatures = 0;
let allLayersValid = true;

layers.forEach(layerName => {
    const filePath = path.join(dataDir, `${layerName}.js`);
    
    console.log(`\n📄 ${layerName}.js`);
    console.log('─'.repeat(60));
    
    if (!fs.existsSync(filePath)) {
        console.log('❌ FICHIER NON TROUVÉ');
        allLayersValid = false;
        return;
    }
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileSize = fs.statSync(filePath).size;
        const fileSizeKB = (fileSize / 1024).toFixed(2);
        
        // Vérifier la structure GeoJSON
        const match = content.match(/var json_(\w+) = ({[\s\S]*});/);
        
        if (!match) {
            console.log('❌ Format invalide - variable globale non trouvée');
            allLayersValid = false;
            return;
        }
        
        const jsonStr = match[2];
        const geoJson = JSON.parse(jsonStr);
        
        if (geoJson.type !== 'FeatureCollection') {
            console.log('❌ Type invalide - doit être FeatureCollection');
            allLayersValid = false;
            return;
        }
        
        const featureCount = geoJson.features ? geoJson.features.length : 0;
        totalFeatures += featureCount;
        
        console.log(`✅ Status: VALIDE`);
        console.log(`📊 Features: ${featureCount}`);
        console.log(`💾 Taille: ${fileSizeKB} KB`);
        
        if (featureCount > 0) {
            const firstFeature = geoJson.features[0];
            const geomType = firstFeature.geometry?.type || 'Unknown';
            console.log(`🔷 Type géométrie: ${geomType}`);
            
            const propCount = Object.keys(firstFeature.properties || {}).length;
            console.log(`🏷️  Propriétés: ${propCount}`);
        } else {
            console.log('⚠️  ATTENTION: Aucune donnée');
            allLayersValid = false;
        }
        
    } catch (error) {
        console.log(`❌ Erreur de parsing: ${error.message}`);
        allLayersValid = false;
    }
});

console.log('\n' + '═'.repeat(60));
console.log('\n📈 RÉSUMÉ FINAL\n');

if (allLayersValid && totalFeatures > 0) {
    console.log(`✅ INTÉGRATION COMPLÈTE`);
    console.log(`   Total Features: ${totalFeatures.toLocaleString()}`);
    console.log(`   Tous les fichiers sont valides et contiennent des données`);
} else {
    console.log(`⚠️  PROBLÈMES DÉTECTÉS`);
    console.log(`   Vérifiez les fichiers signalés ci-dessus`);
}

console.log('\n🎯 ÉTAPES SUIVANTES:\n');
console.log('1. Ouvrez index.html dans un navigateur');
console.log('2. Allez à la section "Réseau National SONAGED"');
console.log('3. Les couches doivent s\'afficher sur la carte Leaflet');
console.log('4. Cliquez sur le contrôle des couches (en haut à droite) pour activer/désactiver');
console.log('\n');
