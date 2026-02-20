/**
 * Test du serveur DTM
 * Utilisation: node test-dtm.js
 */

const fs = require('fs');

// Chemin vers DTM.csv
const DTM_PATH = 'c:\\Users\\30100-23-SNG\\OneDrive - sonaged\\Bureau\\DTM.csv';

console.log('\n======================================');
console.log('🧪 TEST DTM.CSV SERVER');
console.log('======================================\n');

// Test 1 : Existe le fichier?
console.log('TEST 1 : Vérification du fichier DTM.csv');
console.log(`📍 Chemin: ${DTM_PATH}`);

if (fs.existsSync(DTM_PATH)) {
    console.log('✅ Fichier trouvé!\n');
} else {
    console.log('❌ Fichier NOT FOUND!\n');
    process.exit(1);
}

// Test 2 : Lire le fichier
console.log('TEST 2 : Lecture du fichier');
try {
    const content = fs.readFileSync(DTM_PATH, 'utf-8');
    const lines = content.split('\n');
    console.log(`✅ Fichier lu avec succès`);
    console.log(`📊 Nombre de lignes: ${lines.length}`);
    console.log(`📏 Taille du fichier: ${content.length} bytes\n`);
} catch (err) {
    console.log(`❌ Erreur: ${err.message}\n`);
    process.exit(1);
}

// Test 3 : Parser le CSV
console.log('TEST 3 : Parsing du CSV');
try {
    const content = fs.readFileSync(DTM_PATH, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const headerLine = lines[0];
    
    console.log(`📌 En-tête (première ligne):`);
    console.log(`   ${headerLine.substring(0, 100)}...`);
    console.log(`✅ Parsing réussi\n`);
} catch (err) {
    console.log(`❌ Erreur: ${err.message}\n`);
    process.exit(1);
}

// Test 4 : Vérifier le contenu
console.log('TEST 4 : Vérification du contenu');
try {
    const content = fs.readFileSync(DTM_PATH, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    console.log(`📊 Statistiques:`);
    console.log(`   - En-têtes: 1`);
    console.log(`   - Lignes de données: ${lines.length - 1}`);
    
    if (lines.length > 1) {
        console.log(`✅ Des données présentes!\n`);
    } else {
        console.log(`❌ Aucune donnée trouvée!\n`);
        process.exit(1);
    }
} catch (err) {
    console.log(`❌ Erreur: ${err.message}\n`);
    process.exit(1);
}

// Test 5 : Service Node + Express
console.log('TEST 5 : Vérification des dépendances Node');
try {
    const express = require('express');
    const cors = require('cors');
    console.log(`✅ express: OK`);
    console.log(`✅ cors: OK\n`);
} catch (err) {
    console.log(`❌ Erreur: ${err.message}`);
    console.log(`   Installation: npm install\n`);
    process.exit(1);
}

console.log('======================================');
console.log('✅ TOUS LES TESTS PASSÉS!');
console.log('======================================\n');

console.log('Vous pouvez maintenant démarrer le serveur:');
console.log('  node read-dtm-csv.js\n');
