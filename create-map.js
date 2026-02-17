/**
 * CARTE - Localisation GPS des Collectes
 * =======================================
 */

const fs = require('fs');
const path = require('path');

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

function createMap(exportFolder) {
    const csvPath = path.join('./exports', exportFolder, 'collectes_donnees.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.log(`❌ Fichier CSV non trouvé`);
        return;
    }
    
    const content = fs.readFileSync(csvPath, 'utf-8');
    const records = parseCSV(content);
    
    const mapPath = path.join('./exports', exportFolder, 'carte.html');
    
    // Créer les points de la carte
    let markers = '[\n';
    records.forEach((record, idx) => {
        if (record.latitude && record.longitude) {
            const lat = parseFloat(record.latitude);
            const lng = parseFloat(record.longitude);
            
            if (!isNaN(lat) && !isNaN(lng)) {
                const photoIcon = record.photo ? '📸' : '❌';
                const photoLink = record.photo ? `<a href="${record.photo}" target="_blank">Voir image</a>` : 'Pas d\'image';
                markers += `    {\n`;
                markers += `        lat: ${lat},\n`;
                markers += `        lng: ${lng},\n`;
                markers += `        popup: "<b>${record.commune}</b><br>${record.partenaire}<br>${record.type_activite || 'N/A'}<br>${photoIcon} ${photoLink}" `;
                
                if (idx < records.length - 1) {
                    markers += '\n    },\n';
                } else {
                    markers += '\n    }\n';
                }
            }
        }
    });
    markers += ']';
    
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🗺️ Carte des Collectes</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            height: 100vh;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            position: relative;
        }
        
        .header h1 {
            font-size: 1.5em;
            margin-bottom: 5px;
        }
        
        .header p {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        #map {
            width: 100%;
            height: calc(100vh - 80px);
        }
        
        .info {
            background: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            font-size: 14px;
        }
        
        .legend {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            z-index: 999;
            max-width: 300px;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .legend h3 {
            margin-bottom: 10px;
            color: #333;
        }
        
        .legend p {
            margin: 5px 0;
            color: #666;
            font-size: 13px;
        }
        
        .leaflet-popup-content {
            font-family: Arial, sans-serif;
            font-size: 13px;
        }
        
        .leaflet-popup-content b {
            color: #667eea;
            font-size: 14px;
            display: block;
            margin-bottom: 5px;
        }
        
        .leaflet-popup-content a {
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
        }
        
        .leaflet-popup-content a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🗺️ CARTE - Localisation des Collectes</h1>
        <p>Région de Ziguinchor - ${records.length} sites collectés</p>
    </div>
    
    <div id="map"></div>
    
    <div class="legend">
        <h3>📍 Informations</h3>
        <p><strong>Sites:</strong> ${records.length}</p>
        <p><strong>Images:</strong> ${records.filter(r => r.photo).length}</p>
        <p><strong>Région:</strong> Ziguinchor</p>
        
        <h3 style="margin-top: 15px;">🎯 Actions</h3>
        <p>• Cliquez sur un marqueur pour voir les détails</p>
        <p>• Cliquez sur "Voir image" pour afficher la photo</p>
        <p>• Utilisez la souris pour naviguer la carte</p>
        
        <h3 style="margin-top: 15px;">📊 Communes</h3>
        ${Array.from(new Set(records.map(r => r.commune))).map(c => 
            `<p>• ${c}</p>`
        ).join('')}
    </div>
    
    <script>
        // Données des marqueurs
        const markers = ${markers};
        
        // Créer la carte
        const map = L.map('map').setView([12.5, -16.5], 10);
        
        // Ajouter la couche de base (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Ajouter les marqueurs
        markers.forEach(function(marker) {
            const popupContent = marker.popup;
            
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: '<div style="' +
                    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' +
                    'width: 30px;' +
                    'height: 30px;' +
                    'border-radius: 50%;' +
                    'display: flex;' +
                    'align-items: center;' +
                    'justify-content: center;' +
                    'color: white;' +
                    'font-weight: bold;' +
                    'font-size: 16px;' +
                    'box-shadow: 0 2px 8px rgba(0,0,0,0.3);' +
                    '">📍</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
            });
            
            L.marker([marker.lat, marker.lng], { icon: customIcon })
                .bindPopup(popupContent)
                .addTo(map);
        });
        
        // Ajouter une couche de contrôle
        L.control.scale().addTo(map);
    </script>
</body>
</html>`;
    
    fs.writeFileSync(mapPath, html, 'utf-8');
    console.log(`\n✅ Carte géographique créée: ${mapPath}`);
    console.log(`📖 Ouvrir dans navigateur: file:///${path.resolve(mapPath)}`);
}

function main() {
    const exports = listExports();
    
    if (exports.length === 0) {
        console.log('❌ Aucun export trouvé');
        process.exit(1);
    }
    
    const latestExport = exports[0];
    
    console.log('\n' + '═'.repeat(70));
    console.log('🗺️  CRÉATION DE LA CARTE - LOCALISATION GPS');
    console.log('═'.repeat(70));
    console.log(`\n📁 Export: ${latestExport}`);
    
    createMap(latestExport);
    
    console.log('\n💡 Astuce: Vous pouvez aussi vérifier les coordonnées GPS directement:');
    console.log('   • Fichier CSV: colonne latitude/longitude');
    console.log('   • Métadonnées: images_metadata.json');
    console.log('\n');
}

main();
