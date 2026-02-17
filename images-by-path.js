/**
 * AFFICHAGE IMAGES PAR CHEMIN
 * ============================
 * Accéder aux images réelles collectées avec leurs chemins complets
 */

const fs = require('fs');
const path = require('path');

// Parser CSV simple
function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 1) return [];
    
    const headerLine = lines[0];
    const headers = headerLine.split('","')
        .map(h => h.replace(/"/g, '').trim());
    
    const records = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        
        const record = {};
        headers.forEach((header, idx) => {
            record[header.replace(/"/g, '')] = values[idx].replace(/"/g, '').trim();
        });
        records.push(record);
    }
    
    return records;
}

// Fonction pour lister les exports
function listExports() {
    const exportsDir = './exports';
    
    if (!fs.existsSync(exportsDir)) {
        return [];
    }
    
    return fs.readdirSync(exportsDir)
        .filter(f => fs.statSync(path.join(exportsDir, f)).isDirectory())
        .sort()
        .reverse();
}

// Afficher les images par chemin
function showImagesByPath(exportFolder, filterRegion = null) {
    const csvPath = path.join('./exports', exportFolder, 'collectes_donnees.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.log(`❌ Fichier CSV non trouvé`);
        return;
    }
    
    const content = fs.readFileSync(csvPath, 'utf-8');
    const records = parseCSV(content);
    
    if (records.length === 0) {
        console.log('❌ Aucune donnée trouvée');
        return;
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log('🖼️  IMAGES COLLECTÉES - ACCÈS PAR CHEMIN');
    console.log('═'.repeat(80) + '\n');
    
    console.log(`📁 Export: ${exportFolder}`);
    if (filterRegion) {
        console.log(`🗺️  Région filtrée: ${filterRegion}`);
    }
    console.log();
    
    let count = 0;
    const imagesByPath = {};
    
    records.forEach((record, idx) => {
        // Filtrer par région si demandé
        if (filterRegion && record.region !== filterRegion) {
            return;
        }
        
        count++;
        
        const photoRelative = record.photo || '';
        const photoAbsolute = path.join(__dirname, 'exports', exportFolder, photoRelative);
        const fileExists = fs.existsSync(photoAbsolute);
        
        if (photoRelative && fileExists) {
            const stats = fs.statSync(photoAbsolute);
            
            imagesByPath[photoAbsolute] = {
                id: record.id,
                commune: record.commune,
                region: record.region,
                partenaire: record.partenaire,
                size: stats.size,
                relativePath: photoRelative
            };
        }
    });
    
    // Afficher les images organisées
    if (Object.keys(imagesByPath).length === 0) {
        console.log('❌ Aucune image trouvée');
        return;
    }
    
    console.log(`📷 Total d'images: ${Object.keys(imagesByPath).length}\n`);
    console.log('─'.repeat(80));
    
    Object.entries(imagesByPath).forEach(([absolutePath, info], idx) => {
        const sizeKB = (info.size / 1024).toFixed(2);
        
        console.log(`\n${idx + 1}. 🖼️  ${info.commune} (Région: ${info.region})`);
        console.log(`   📋 ID: ${info.id} | Partenaire: ${info.partenaire}`);
        console.log(`   💾 Taille: ${sizeKB} KB`);
        console.log(`   📂 Chemin relatif: ${info.relativePath}`);
        console.log(`   🔗 Chemin absolu: ${absolutePath}`);
        
        // Afficher comment accéder à l'image
        console.log(`   ✨ Utilisation:`);
        console.log(`      • Python: Image.open('${info.relativePath}')`);
        console.log(`      • HTML: <img src="${info.relativePath}">`);
        console.log(`      • CMD: start "${absolutePath}"`);
    });
    
    console.log('\n' + '─'.repeat(80));
    console.log(`\n✅ ${Object.keys(imagesByPath).length} images trouvées et accessibles\n`);
}

// Créer une structure organisée par région
function createOrganizedStructure(exportFolder) {
    const csvPath = path.join('./exports', exportFolder, 'collectes_donnees.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.log(`❌ Fichier CSV non trouvé`);
        return;
    }
    
    const content = fs.readFileSync(csvPath, 'utf-8');
    const records = parseCSV(content);
    
    const imagesDir = path.join('./exports', exportFolder, 'images');
    const organizedDir = path.join('./exports', exportFolder, 'images_organized');
    
    // Créer la structure
    if (!fs.existsSync(organizedDir)) {
        fs.mkdirSync(organizedDir, { recursive: true });
    }
    
    console.log('\n📁 Organisation des images par région...\n');
    
    // Grouper par région
    const byRegion = {};
    records.forEach(record => {
        const region = record.region || 'Autres';
        if (!byRegion[region]) {
            byRegion[region] = [];
        }
        byRegion[region].push(record);
    });
    
    // Créer les dossiers
    Object.entries(byRegion).forEach(([region, collectes]) => {
        const regionDir = path.join(organizedDir, region);
        
        if (!fs.existsSync(regionDir)) {
            fs.mkdirSync(regionDir, { recursive: true });
        }
        
        collectes.forEach(collecte => {
            const srcPath = path.join(imagesDir, collecte.photo.replace('./images/', ''));
            const fileName = `${collecte.id}_${collecte.commune}.jpg`;
            const destPath = path.join(regionDir, fileName);
            
            if (fs.existsSync(srcPath)) {
                // Copier le fichier (ou créer un lien symbolique)
                const content = fs.readFileSync(srcPath);
                fs.writeFileSync(destPath, content);
                console.log(`   ✅ ${region}/${fileName}`);
            }
        });
    });
    
    console.log(`\n✨ Images organisées dans: ./exports/${exportFolder}/images_organized/\n`);
}

// Exporter les métadonnées des images
function exportImageMetadata(exportFolder) {
    const csvPath = path.join('./exports', exportFolder, 'collectes_donnees.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.log(`❌ Fichier CSV non trouvé`);
        return;
    }
    
    const content = fs.readFileSync(csvPath, 'utf-8');
    const records = parseCSV(content);
    
    const imagesDir = path.join('./exports', exportFolder, 'images');
    
    const metadata = records
        .filter(r => r.photo && fs.existsSync(path.join(imagesDir, r.photo.replace('./images/', ''))))
        .map(r => ({
            id: r.id,
            chemin: r.photo,
            commune: r.commune,
            region: r.region,
            departement: r.departement,
            partenaire: r.partenaire,
            type_activite: r.type_activite,
            latitude: r.latitude,
            longitude: r.longitude,
            date_collecte: r.date_collecte,
            taille_kb: (fs.statSync(path.join(imagesDir, r.photo.replace('./images/', ''))).size / 1024).toFixed(2)
        }));
    
    const jsonPath = path.join('./exports', exportFolder, 'images_metadata.json');
    fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2), 'utf-8');
    
    console.log(`\n✅ Métadonnées exportées: images_metadata.json (${metadata.length} images)`);
    console.log(`   Chemin: ./exports/${exportFolder}/images_metadata.json\n`);
}

// Menu principal
function main() {
    const exports = listExports();
    
    if (exports.length === 0) {
        console.log('❌ Aucun export trouvé');
        process.exit(1);
    }
    
    const latestExport = exports[0];
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'organize':
            createOrganizedStructure(latestExport);
            break;
        
        case 'metadata':
            exportImageMetadata(latestExport);
            break;
        
        case 'filter':
            const region = args[1];
            showImagesByPath(latestExport, region);
            break;
        
        default:
            showImagesByPath(latestExport);
    }
}

main();
