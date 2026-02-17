/**
 * RÉSUMÉ COMPLET - Images et Données Collectées
 * ==============================================
 */

const fs = require('fs');
const path = require('path');

function listExports() {
    const exportsDir = './exports';
    if (!fs.existsSync(exportsDir)) return [];
    
    return fs.readdirSync(exportsDir)
        .filter(f => fs.statSync(path.join(exportsDir, f)).isDirectory())
        .sort()
        .reverse();
}

function showSummary() {
    const exports = listExports();
    
    if (exports.length === 0) {
        console.log('❌ Aucun export trouvé');
        process.exit(1);
    }
    
    const latestExport = exports[0];
    const exportPath = path.join('./exports', latestExport);
    
    console.log('\n' + '═'.repeat(80));
    console.log('✨ RÉSUMÉ COMPLET - IMAGES & DONNÉES COLLECTÉES');
    console.log('═'.repeat(80) + '\n');
    
    // Fichiers disponibles
    const files = fs.readdirSync(exportPath);
    const hasGalerie = files.includes('galerie.html');
    const hasMetadata = files.includes('images_metadata.json');
    const hasMap = files.includes('carte.html');
    const hasOrganized = fs.existsSync(path.join(exportPath, 'images_organized'));
    const hasImages = fs.existsSync(path.join(exportPath, 'images'));
    
    console.log(`📁 DOSSIER D'EXPORT: ${latestExport}\n`);
    
    // Lister les ressources
    console.log('📂 RESSOURCES DISPONIBLES:\n');
    
    console.log('  📊 Données:');
    console.log(`     ✅ CSV: collectes_donnees.csv`);
    const csvPath = path.join(exportPath, 'collectes_donnees.csv');
    if (fs.existsSync(csvPath)) {
        const lines = fs.readFileSync(csvPath, 'utf-8').split('\n').length - 1;
        console.log(`        └─ ${lines} collectes`);;
    }
    
    if (hasMetadata) {
        console.log(`     ✅ Métadonnées: images_metadata.json`);
        const metadata = JSON.parse(fs.readFileSync(path.join(exportPath, 'images_metadata.json'), 'utf-8'));
        console.log(`        └─ ${metadata.length} images documentées`);
    }
    
    console.log('\n  🎨 Interfaces:');
    if (hasGalerie) {
        console.log(`     ✅ Galerie HTML: galerie.html`);
        console.log(`        └─ Interface interactive, cliquez pour zoomer`);
    }
    if (hasMap) {
        console.log(`     ✅ Carte GPS: carte.html`);
        console.log(`        └─ Avec localisations Leaflet`);
    }
    
    console.log('\n  📸 Images:');
    if (hasImages) {
        const imageCount = fs.readdirSync(path.join(exportPath, 'images')).filter(f => f.endsWith('.jpg')).length;
        console.log(`     ✅ Dossier: images/`);
        console.log(`        └─ ${imageCount} fichiers .jpg`);
        
        const totalSize = fs.readdirSync(path.join(exportPath, 'images'))
            .filter(f => f.endsWith('.jpg'))
            .reduce((sum, f) => sum + fs.statSync(path.join(exportPath, 'images', f)).size, 0);
        console.log(`        └─ Taille totale: ${(totalSize / 1024).toFixed(2)} KB`);
    }
    
    if (hasOrganized) {
        const organized = fs.readdirSync(path.join(exportPath, 'images_organized'));
        console.log(`     ✅ Organisées par région: images_organized/`);
        console.log(`        └─ ${organized.length} région(s)`);
        organized.forEach(region => {
            const count = fs.readdirSync(path.join(exportPath, 'images_organized', region)).length;
            console.log(`           • ${region}: ${count} images`);
        });
    }
    
    console.log('\n  📄 Documentation:');
    const hasReadme = files.includes('README.md');
    if (hasReadme) {
        console.log(`     ✅ README.md: Instructions d'utilisation`);
    }
    
    // Accès rapide
    console.log('\n' + '─'.repeat(80));
    console.log('🚀 ACCÈS RAPIDE:\n');
    
    console.log('  🖥️  NAVIGATEUR (Plus facile):');
    console.log(`     • Galerie: file:///${path.resolve(path.join(exportPath, 'galerie.html'))}`);
    if (hasMap) {
        console.log(`     • Carte GPS: file:///${path.resolve(path.join(exportPath, 'carte.html'))}`);
    }
    
    console.log('\n  💻 LIGNE DE COMMANDE:');
    console.log(`     • Afficher images (chemin): node images-by-path.js`);
    console.log(`     • Voir images (console): node view-gallery.js`);
    console.log(`     • Créer carte: node create-map.js`);
    
    console.log('\n  🐍 PYTHON:');
    console.log(`     import pandas as pd`);
    console.log(`     from PIL import Image`);
    console.log(`     df = pd.read_csv('exports/${latestExport}/collectes_donnees.csv')`);
    console.log(`     img = Image.open(df.iloc[0]['photo'])`);
    console.log(`     img.show()`);
    
    console.log('\n  📊 EXCEL:');
    console.log(`     1. Ouvrir: exports/${latestExport}/collectes_donnees.csv`);
    console.log(`     2. Colonnes "photo" et "latitude"/"longitude" accessibles`);
    console.log(`     3. Créer liens avec =LIEN() ou =IMAGE()`);
    
    // Infos détails
    console.log('\n' + '─'.repeat(80));
    console.log('📋 CONTENU DES COLLECTES:\n');
    
    const csvPath2 = path.join(exportPath, 'collectes_donnees.csv');
    if (fs.existsSync(csvPath2)) {
        const lines = fs.readFileSync(csvPath2, 'utf-8').split('\n').filter(l => l);
        const header = lines[0];
        const colCount = (header.match(/"/g) || []).length / 2;
        console.log(`  Colonnes: ${colCount}`);
        console.log(`  Lignes: ${lines.length - 1}`);
        
        // Parser mini pour extraire régions/communes
        const csvContent = fs.readFileSync(csvPath2, 'utf-8');
        let regionMatch = csvContent.match(/"region","[^"]*"/g);
        if (regionMatch) {
            const regions = [...new Set(csvContent.match(/"region","[^"]+"/g).map(m => m.split('"')[3]))];
            console.log(`  Régions: ${regions.join(', ')}`);
        }
    }
    
    // Fichier complet structure
    console.log('\n' + '─'.repeat(80));
    console.log('📁 STRUCTURE COMPLÈTE:\n');
    
    function showTree(dir, prefix = '', isLast = true) {
        const items = fs.readdirSync(dir).slice(0, 10); // Limiter à 10 pour lisibilité
        
        items.forEach((item, idx) => {
            const itemPath = path.join(dir, item);
            const isDirectory = fs.statSync(itemPath).isDirectory();
            const isLastItem = idx === items.length - 1;
            
            const connector = isLastItem ? '└── ' : '├── ';
            const nextPrefix = prefix + (isLastItem ? '    ' : '│   ');
            
            if (isDirectory) {
                console.log(`  ${prefix}${connector}${item}/`);
                if (item !== 'images' && item !== 'images_organized') { // Ne pas montrer l'intérieur
                    showTree(itemPath, nextPrefix, isLastItem);
                }
            } else {
                const size = (fs.statSync(itemPath).size / 1024).toFixed(1);
                console.log(`  ${prefix}${connector}${item} (${size} KB)`);
            }
        });
    }
    
    showTree(exportPath);
    
    console.log('\n' + '═'.repeat(80));
    console.log('✅ EXPORT PRÊT À UTILISER');
    console.log('═'.repeat(80) + '\n');
    
    console.log('💡 CONSEILS:\n');
    console.log('  1. Ouvrir d\'abord: galerie.html (interface la plus belle)');
    console.log('  2. Pour l\'analyse: utiliser le CSV + images_metadata.json');
    console.log('  3. Pour localiser: ouvrir carte.html');
    console.log('  4. Pour automatisation: examiner images_metadata.json');
    console.log('  5. Pour partage: compresser le dossier export entier en ZIP\n');
}

showSummary();
