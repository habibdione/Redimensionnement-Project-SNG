/**
 * GALERIE IMAGES - Accès aux Photos par Chemin
 * ============================================
 * Visualiser les images collectées avec leurs informations
 */

const fs = require('fs');
const path = require('path');

// Parser CSV simple (sans dépendance)
function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 1) return [];
    
    // Parse header
    const headerLine = lines[0];
    const headers = headerLine.split('","')
        .map(h => h.replace(/"/g, '').trim());
    
    // Parse rows
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
        console.log('❌ Dossier exports non trouvé');
        return [];
    }
    
    return fs.readdirSync(exportsDir)
        .filter(f => fs.statSync(path.join(exportsDir, f)).isDirectory())
        .sort()
        .reverse();
}

// Fonction pour charger les données d'un export
function loadExportData(exportFolder) {
    const csvPath = path.join('./exports', exportFolder, 'collectes_donnees.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.log(`❌ Fichier CSV non trouvé: ${csvPath}`);
        return [];
    }
    
    const content = fs.readFileSync(csvPath, 'utf-8');
    return parseCSV(content);
}

// Fonction pour afficher une galerie par région
function showGalleryByRegion(exportFolder) {
    const records = loadExportData(exportFolder);
    const imagesDir = path.join('./exports', exportFolder, 'images');
    
    if (records.length === 0) {
        console.log('❌ Aucune donnée trouvée');
        return;
    }
    
    // Grouper par région
    const byRegion = {};
    records.forEach(record => {
        const region = record.region || 'Région inconnue';
        if (!byRegion[region]) {
            byRegion[region] = [];
        }
        byRegion[region].push(record);
    });
    
    console.log('\n' + '═'.repeat(70));
    console.log('📸 GALERIE DES COLLECTES PHOTOGRAPHIÉES');
    console.log('═'.repeat(70) + '\n');
    
    console.log(`📁 Export: ${exportFolder}`);
    console.log(`📍 Régions: ${Object.keys(byRegion).length}\n`);
    
    // Afficher par région
    Object.entries(byRegion).forEach(([region, collectes]) => {
        console.log(`\n🗺️  RÉGION: ${region.toUpperCase()}`);
        console.log('─'.repeat(70));
        
        collectes.forEach((collecte, idx) => {
            const photoPath = path.join('./exports', exportFolder, collecte.photo || '');
            const photoExists = fs.existsSync(photoPath);
            const photoSize = photoExists ? 
                ((fs.statSync(photoPath).size / 1024).toFixed(2) + ' KB') : 
                'N/A';
            
            console.log(`\n  ${idx + 1}. 📍 ${collecte.commune || 'N/A'}`);
            console.log(`     • Partenaire: ${collecte.partenaire}`);
            console.log(`     • Département: ${collecte.departement || 'N/A'}`);
            console.log(`     • Type: ${collecte.type_activite || 'N/A'}`);
            console.log(`     • 🖼️  Image: ${collecte.photo || 'Aucune'}`);
            console.log(`     • 💾 Taille: ${photoSize}`);
            console.log(`     • ✅ Accessible: ${photoExists ? 'OUI' : 'NON'}`);
            
            // Afficher le chemin absolu
            if (photoExists) {
                console.log(`     • 📂 Chemin: ${photoPath}`);
            }
        });
    });
    
    console.log('\n' + '═'.repeat(70) + '\n');
}

// Fonction pour créer une galerie HTML
function createHtmlGallery(exportFolder) {
    const records = loadExportData(exportFolder);
    const htmlPath = path.join('./exports', exportFolder, 'galerie.html');
    
    if (records.length === 0) {
        console.log('❌ Aucune donnée trouvée');
        return;
    }
    
    // Grouper par région
    const byRegion = {};
    records.forEach(record => {
        const region = record.region || 'Région inconnue';
        if (!byRegion[region]) {
            byRegion[region] = [];
        }
        byRegion[region].push(record);
    });
    
    // Générer le HTML
    let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📸 Galerie des Collectes</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .stats {
            display: flex;
            justify-content: space-around;
            padding: 20px;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
        }
        
        .stat-box {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
        
        .regions {
            padding: 20px;
        }
        
        .region-section {
            margin-bottom: 40px;
        }
        
        .region-title {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 1.3em;
            font-weight: bold;
        }
        
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .gallery-item {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }
        
        .gallery-item img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            background: #f0f0f0;
        }
        
        .gallery-info {
            padding: 15px;
        }
        
        .gallery-commune {
            font-size: 1.1em;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }
        
        .gallery-detail {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 5px;
        }
        
        .gallery-detail strong {
            color: #667eea;
        }
        
        .gallery-photo-path {
            font-size: 0.85em;
            color: #999;
            margin-top: 10px;
            word-break: break-all;
            font-family: monospace;
            background: #f5f5f5;
            padding: 8px;
            border-radius: 4px;
        }
        
        .no-image {
            width: 100%;
            height: 250px;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ccc;
            font-size: 3em;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
        }
        
        .modal-content {
            background-color: #fefefe;
            margin: auto;
            padding: 0;
            border-radius: 8px;
            width: 90%;
            max-width: 900px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        
        .modal-image {
            width: 100%;
            max-height: 70vh;
            object-fit: contain;
        }
        
        .modal-info {
            padding: 20px;
            background: white;
        }
        
        .close {
            position: absolute;
            right: 20px;
            top: 20px;
            font-size: 2em;
            font-weight: bold;
            color: white;
            cursor: pointer;
            background: rgba(0,0,0,0.3);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        
        .close:hover {
            background: rgba(0,0,0,0.6);
        }
        
        footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #ddd;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📸 GALERIE - Collectes Photographiées</h1>
            <p>Visualisez tous les sites collectés avec leurs images</p>
        </div>
        
        <div class="stats">
            <div class="stat-box">
                <div class="stat-number">${records.length}</div>
                <div class="stat-label">Collectes</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${Object.keys(byRegion).length}</div>
                <div class="stat-label">Régions</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${records.filter(r => r.photo && r.photo.trim()).length}</div>
                <div class="stat-label">Images</div>
            </div>
        </div>
        
        <div class="regions">
`;
    
    // Ajouter les régions
    Object.entries(byRegion).forEach(([region, collectes]) => {
        html += `
            <div class="region-section">
                <div class="region-title">🗺️  ${region.toUpperCase()}</div>
                <div class="gallery">
`;
        
        collectes.forEach((collecte) => {
            const imagePath = collecte.photo ? collecte.photo.replace('./', '') : '';
            const absolutePath = path.join('./exports', exportFolder, imagePath);
            const hasImage = collecte.photo && fs.existsSync(absolutePath);
            
            html += `
                    <div class="gallery-item" onclick="openModal(this)">
                        ${hasImage ? 
                            `<img src="${imagePath}" alt="${collecte.commune}">` : 
                            `<div class="no-image">📷</div>`
                        }
                        <div class="gallery-info">
                            <div class="gallery-commune">📍 ${collecte.commune || 'N/A'}</div>
                            <div class="gallery-detail"><strong>Partenaire:</strong> ${collecte.partenaire}</div>
                            <div class="gallery-detail"><strong>Département:</strong> ${collecte.departement || 'N/A'}</div>
                            <div class="gallery-detail"><strong>Type:</strong> ${(collecte.type_activite || 'N/A').substring(0, 30)}...</div>
                            ${hasImage ? `
                                <div class="gallery-photo-path">📂 ${imagePath}</div>
                            ` : `
                                <div class="gallery-photo-path">❌ Pas d'image</div>
                            `}
                        </div>
                    </div>
`;
        });
        
        html += `
                </div>
            </div>
`;
    });
    
    html += `
        </div>
        
        <footer>
            <p>Export généré le: ${new Date().toLocaleString('fr-FR')}</p>
            <p>Dossier source: ${exportFolder}</p>
        </footer>
    </div>
    
    <div id="modal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <img class="modal-image" id="modalImage" src="" alt="">
            <div class="modal-info" id="modalInfo"></div>
        </div>
    </div>
    
    <script>
        function openModal(element) {
            const modal = document.getElementById('modal');
            const img = element.querySelector('img');
            if (!img) return;
            
            const modalImage = document.getElementById('modalImage');
            const modalInfo = document.getElementById('modalInfo');
            
            modalImage.src = img.src;
            
            const commune = element.querySelector('.gallery-commune').textContent;
            const details = Array.from(element.querySelectorAll('.gallery-detail'))
                .map(d => d.innerHTML).join('<br>');
            
            modalInfo.innerHTML = commune + '<br><br>' + details;
            modal.style.display = 'block';
        }
        
        function closeModal() {
            document.getElementById('modal').style.display = 'none';
        }
        
        window.onclick = function(event) {
            const modal = document.getElementById('modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
    </script>
</body>
</html>`;
    
    fs.writeFileSync(htmlPath, html, 'utf-8');
    console.log(`✅ Galerie HTML créée: ${htmlPath}`);
    console.log(`📖 Ouvrez dans le navigateur: file:///${path.resolve(htmlPath).replace(/\\\//g, '/')}`);
}

// Fonction principale
function main() {
    const exports = listExports();
    
    if (exports.length === 0) {
        console.log('❌ Aucun export trouvé');
        process.exit(1);
    }
    
    const latestExport = exports[0];
    console.log(`📁 Export utilisé: ${latestExport}\n`);
    
    // Afficher la galerie textuelle
    showGalleryByRegion(latestExport);
    
    // Créer la galerie HTML
    console.log('\n📊 Création de la galerie HTML interactive...');
    createHtmlGallery(latestExport);
    
    console.log('\n✨ Galerie créée avec succès!');
    console.log('\n💡 Utilisation:');
    console.log(`   • Galerie HTML: exports/${latestExport}/galerie.html`);
    console.log('   • Ouvrir dans le navigateur pour voir les images interactives\\n');
}

main();
