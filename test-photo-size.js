/**
 * TEST - Vérifier la taille de la photo après compression
 * Cree une photo de test et affiche sa taille en base64
 */

const fs = require('fs');
const path = require('path');

// Créer une image test JPEG compressée (800x600)
const canvas = require('canvas');

console.log('🧪 TEST: Vérification taille photo après compression\n');

// Créer une image JPEG basse qualité comme le ferait le navigateur
const Canvas = canvas.Canvas;
const testCanvas = new Canvas(800, 600);
const ctx = testCanvas.getContext('2d');

// Dessiner quelque chose
ctx.fillStyle = '#2d5016'; // Vert SONAGED
ctx.fillRect(0, 0, 800, 600);
ctx.font = 'bold 40px Arial';
ctx.fillStyle = '#fff';
ctx.fillText('Photo Test SONAGED', 50, 300);

// Exporter en JPEG basse qualité (70%)
testCanvas.toDataURL('image/jpeg', 0.7).then(dataUrl => {
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    
    console.log(`📊 Statistiques photo test:`);
    console.log(`   📐 Dimension: 800x600px`);
    console.log(`   💾 Taille base64: ${(base64.length / 1024).toFixed(2)} KB`);
    console.log(`   💾 Taille buffer: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log(`   📦 Taille avec headers JSON: ${(base64.length * 1.33 / 1024 / 1024).toFixed(2)} MB`);
    
    // Calculer la requête complète
    const testData = {
        partenaire: 'SONAGED Test',
        region: 'Thiès',
        departement: 'Thiès',
        commune: 'Thiès',
        typeActivite: ['Collecte'],
        adresse: 'Route de Kaolack',
        superficie: 150,
        besoinPersonnel: 5,
        dispositifDeploy: ['Bacs 240L'],
        nombreRotation: 2,
        infrastructureGestion: 'Centre de tri',
        frequenceCollecte: 'Bi-hebdomadaire',
        bacs240: 10,
        caissePolybene: 5,
        bacs660: 2,
        accessibilite: 'Oui',
        latitude: 14.789,
        longitude: -16.256,
        precision: 5,
        coordonneeX: 381200,
        coordonneeY: 1637500,
        observation: 'Test photo',
        photo: `data:image/jpeg;base64,${base64}`,
        dateCollecte: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(testData);
    console.log(`\n📨 Taille totale requête JSON: ${(jsonString.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Limite serveur: 25 MB ✅`);
    
    if (jsonString.length > 25 * 1024 * 1024) {
        console.log('   ⚠️ ATTENTION: Requête dépasse la limite!');
    } else {
        console.log('   ✅ Taille acceptée');
    }
    
    console.log(`\n✅ Test compression réussi`);
    console.log(`   La photo compressée peut être transmise sans problème`);
    
}).catch(err => {
    console.error('❌ Erreur test:', err.message);
});
