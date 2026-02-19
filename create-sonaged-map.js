/**
 * CARTE SONAGED - Réseau National SONAGED - Couverture Opérationnelle
 * ===================================================================
 * Génère une carte interactive avec toutes les couches GeoJSON du réseau SONAGED
 */

const fs = require('fs');
const path = require('path');

// Configuration des couches GeoJSON disponibles dans C:\CARTE\données
const LAYERS_CONFIG = {
    Region: {
        name: 'Régions',
        color: '#1f77b4',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.1
    },
    Departement: {
        name: 'Départements',
        color: '#ff7f0e',
        weight: 1.5,
        opacity: 0.7,
        fillOpacity: 0.05
    },
    Arrondissement: {
        name: 'Arrondissements',
        color: '#2ca02c',
        weight: 1,
        opacity: 0.6,
        fillOpacity: 0.03
    },
    CollecteNational: {
        name: 'Points de Collecte',
        color: '#d62728',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3
    },
    BalayageNational: {
        name: 'Zones de Balayage',
        color: '#9467bd',
        weight: 1.5,
        opacity: 0.7,
        fillOpacity: 0.05
    },
    MobilierUrbain: {
        name: 'Mobilier Urbain',
        color: '#8c564b',
        weight: 1,
        opacity: 0.6,
        fillOpacity: 0.1
    }
};

function findGeoJSONFiles() {
    const dataDir = 'C:\\CARTE\\données\\data';
    if (!fs.existsSync(dataDir)) {
        console.log(`❌ Répertoire non trouvé: ${dataDir}`);
        return {};
    }

    const files = fs.readdirSync(dataDir)
        .filter(f => f.endsWith('.js'))
        .sort();

    const geojsonData = {};
    
    files.forEach(file => {
        try {
            // Charger le fichier JS qui contient les données GeoJSON
            const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
            
            // Extraire le JSON des différents formats possibles
            let json = null;
            
            // Format 1: var name = {...}
            const varMatch = content.match(/var\s+\w+\s*=\s*(\{.*\})\s*;?/s);
            if (varMatch) {
                json = JSON.parse(varMatch[1]);
            }
            
            // Format 2: Directement du JSON
            if (!json) {
                try {
                    json = JSON.parse(content);
                } catch (e) {
                    // Continuer
                }
            }
            
            // Format 3: GeoJSON entre quelconque
            if (!json) {
                const jsonMatch = content.match(/(\{[\s\S]*"type"\s*:\s*"FeatureCollection"[\s\S]*\})/);
                if (jsonMatch) {
                    json = JSON.parse(jsonMatch[1]);
                }
            }

            if (json && json.type === 'FeatureCollection') {
                const baseKey = file.replace(/[_\d].js$/, '');
                geojsonData[baseKey] = {
                    file: file,
                    data: json,
                    featureCount: json.features ? json.features.length : 0
                };
                console.log(`✅ ${file} - ${json.features?.length || 0} features chargés`);
            }
        } catch (e) {
            console.log(`⚠️  Erreur lors du chargement de ${file}: ${e.message.substring(0, 50)}`);
        }
    });

    return geojsonData;
}

function createSonagedMap(geojsonData) {
    const outputPath = path.join('./SONAGED_CARTE_NATIONALE.html');
    
    // Préparer les données GeoJSON pour injection dans le HTML
    const layersScript = Object.entries(geojsonData).map(([key, value]) => {
        return `const ${key}Data = ${JSON.stringify(value.data)};`;
    }).join('\n        ');

    const layersInit = Object.entries(geojsonData).map(([key, config]) => {
        const layerConfig = LAYERS_CONFIG[key] || {
            name: key,
            color: '#666',
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.1
        };
        
        return `
        // Couche: ${layerConfig.name}
        const ${key}Layer = L.geoJSON(${key}Data, {
            style: function(feature) {
                return {
                    color: '${layerConfig.color}',
                    weight: ${layerConfig.weight},
                    opacity: ${layerConfig.opacity},
                    fillOpacity: ${layerConfig.fillOpacity},
                    fillColor: '${layerConfig.color}'
                };
            },
            onEachFeature: function(feature, layer) {
                let popupContent = '<div style="max-width: 250px;">';
                popupContent += '<h3 style="color: ${layerConfig.color}; margin: 5px 0;">${layerConfig.name}</h3>';
                
                if (feature.properties) {
                    Object.keys(feature.properties).forEach(key => {
                        const value = feature.properties[key];
                        popupContent += '<p><strong>' + key + ':</strong> ' + value + '</p>';
                    });
                }
                
                popupContent += '</div>';
                layer.bindPopup(popupContent);
            }
        });
        
        layersObject['${layerConfig.name}'] = ${key}Layer;
        `;
    }).join('\n');

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🗺️ Réseau National SONAGED - Couverture Opérationnelle</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet-draw/1.0.4/leaflet.draw.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            height: 100%;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
        }

        body {
            display: flex;
            flex-direction: column;
        }

        .header {
            background: linear-gradient(135deg, #2d5016 0%, #4a7c27 50%, #6db038 100%);
            color: white;
            padding: 15px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-left h1 {
            font-size: 1.8em;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-left p {
            font-size: 0.95em;
            opacity: 0.95;
        }

        .header-controls {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .header-controls button {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.5);
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.3s;
        }

        .header-controls button:hover {
            background: rgba(255,255,255,0.3);
            border-color: white;
        }

        .map-container {
            flex: 1;
            position: relative;
        }

        #map {
            width: 100%;
            height: 100%;
        }

        .control-panel {
            position: fixed;
            top: 80px;
            right: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.2);
            z-index: 999;
            max-width: 300px;
            max-height: 70vh;
            overflow-y: auto;
        }

        .control-panel-header {
            background: linear-gradient(135deg, #2d5016 0%, #4a7c27 100%);
            color: white;
            padding: 15px;
            font-weight: bold;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .control-panel-header button {
            background: none;
            border: none;
            color: white;
            font-size: 1.2em;
            cursor: pointer;
        }

        .control-panel-content {
            padding: 15px;
        }

        .layer-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            margin: 5px 0;
            background: #f9f9f9;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .layer-item:hover {
            background: #f0f0f0;
        }

        .layer-item input[type="checkbox"] {
            cursor: pointer;
        }

        .layer-item label {
            cursor: pointer;
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .layer-color {
            width: 16px;
            height: 16px;
            border-radius: 3px;
            border: 2px solid #ddd;
        }

        .legend {
            position: fixed;
            bottom: 20px;
            left: 15px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.2);
            z-index: 999;
            max-width: 300px;
        }

        .legend h3 {
            margin-bottom: 15px;
            color: #2d5016;
            border-bottom: 2px solid #6db038;
            padding-bottom: 10px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 8px 0;
            font-size: 0.9em;
        }

        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 3px;
            border: 1px solid #999;
            flex-shrink: 0;
        }

        /* Styles pour les différentes formes */
        .legend-polygon {
            width: 24px;
            height: 24px;
            background: currentColor;
            opacity: 0.3;
            border: 2px solid currentColor;
            border-radius: 2px;
            flex-shrink: 0;
        }

        .legend-line {
            width: 24px;
            height: 24px;
            position: relative;
            flex-shrink: 0;
            display: flex;
            align-items: center;
        }

        .legend-line::after {
            content: '';
            width: 100%;
            height: 3px;
            background: currentColor;
            border-radius: 2px;
        }

        .legend-point {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: currentColor;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            flex-shrink: 0;
        }

        .legend-label {
            flex: 1;
        }

        .stats-panel {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .stats-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 0.9em;
        }

        .stats-item strong {
            color: #2d5016;
        }

        @media (max-width: 768px) {
            .header-left h1 {
                font-size: 1.3em;
            }

            .control-panel {
                max-width: 250px;
                top: 70px;
                right: 10px;
            }

            .legend {
                max-width: 250px;
                bottom: 10px;
                left: 10px;
            }
        }

        .info-popup {
            max-width: 300px;
        }

        .info-popup h3 {
            color: #2d5016;
            margin-bottom: 10px;
            border-bottom: 2px solid #6db038;
            padding-bottom: 5px;
        }

        .info-popup p {
            margin: 5px 0;
            font-size: 0.85em;
            line-height: 1.4;
        }

        .info-popup strong {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <h1>🗺️ Réseau National SONAGED - Couverture Opérationnelle</h1>
            <p>Visualisation des couches géographiques et de la couverture opérationnelle</p>
        </div>
        <div class="header-controls">
            <button id="togglePanel" title="Afficher/masquer le panneau">
                <i class="fas fa-bars"></i> Couches
            </button>
            <button id="resetMap" title="Réinitialiser la vue">
                <i class="fas fa-sync"></i>
            </button>
        </div>
    </div>

    <div class="map-container">
        <div id="map"></div>
        
        <div class="control-panel">
            <div class="control-panel-header">
                <span>📊 Couches Actives</span>
                <button id="closePanel" style="cursor: pointer;">×</button>
            </div>
            <div class="control-panel-content">
                <div class="stats-panel">
                    <div class="stats-item">
                        <strong>Couches:</strong>
                        <span id="layerCount">0</span>
                    </div>
                    <div class="stats-item">
                        <strong>Visibles:</strong>
                        <span id="visibleCount">0</span>
                    </div>
                </div>
                <div id="layerControls"></div>
            </div>
        </div>

        <div class="legend">
            <h3>📍 Légende - Couches</h3>
            
            <div class="legend-item">
                <div class="legend-polygon" style="color: #1f77b4;"></div>
                <div class="legend-label">Régions</div>
            </div>
            
            <div class="legend-item">
                <div class="legend-polygon" style="color: #ff7f0e;"></div>
                <div class="legend-label">Départements</div>
            </div>
            
            <div class="legend-item">
                <div class="legend-polygon" style="color: #2ca02c;"></div>
                <div class="legend-label">Arrondissements</div>
            </div>
            
            <div class="legend-item">
                <div class="legend-line" style="color: #d62728;"></div>
                <div class="legend-label">Circuits de Collecte</div>
            </div>
            
            <div class="legend-item">
                <div class="legend-line" style="color: #9467bd;"></div>
                <div class="legend-label">Zones de Balayage</div>
            </div>
            
            <div class="legend-item">
                <div class="legend-point" style="background: #8c564b;"></div>
                <div class="legend-label">Mobilier Urbain</div>
            </div>
            
            <h3 style="margin-top: 15px;">ℹ️ Informations</h3>
            <p><strong>Source:</strong> Réseau National SONAGED</p>
            <p><strong>Date:</strong> Février 2026</p>
            <p><strong>Projection:</strong> WGS-84 (EPSG:4326)</p>
            
            <h3 style="margin-top: 15px;">🎯 Comment utiliser</h3>
            <p>• Cliquez sur les couches pour afficher/masquer</p>
            <p>• Cliquez sur les zones pour voir les détails</p>
            <p>• Utilisez le menu pour naviguer</p>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-draw/1.0.4/leaflet.draw.min.js"></script>
    <script>
        // Données GeoJSON chargées
        ${layersScript}

        // Initialiser la carte
        const map = L.map('map').setView([14.0, -14.0], 6);

        // Couche de base
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 4
        }).addTo(map);

        // Couche satellite optionnelle
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles © Esri',
            maxZoom: 18
        });

        // Conteneur des couches
        const layersObject = {
            'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: 19
            })
        };

        // Ajouter les couches GeoJSON
        ${layersInit}

        // Contrôle de calques
        const layerControl = L.control.layers(
            {},
            {},
            { position: 'topleft', collapsed: true }
        ).addTo(map);

        // Générer les contrôles des couches personnalisés
        function initLayerControls() {
            const controlDiv = document.getElementById('layerControls');
            const layerKeys = Object.keys(layersObject).filter(k => k !== 'OpenStreetMap');
            
            layerKeys.forEach(layerName => {
                const layer = layersObject[layerName];
                const item = document.createElement('div');
                item.className = 'layer-item';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'layer_' + layerName.replace(/\\s+/g, '_');
                checkbox.checked = false;
                
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                
                const color = document.createElement('div');
                color.className = 'layer-color';
                color.style.backgroundColor = getLayerColor(layerName);
                
                const text = document.createElement('span');
                text.textContent = layerName;
                
                label.appendChild(color);
                label.appendChild(text);
                
                item.appendChild(checkbox);
                item.appendChild(label);
                
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        map.addLayer(layer);
                    } else {
                        map.removeLayer(layer);
                    }
                    updateVisibleCount();
                });
                
                controlDiv.appendChild(item);
            });
            
            document.getElementById('layerCount').textContent = layerKeys.length;
            updateVisibleCount();
        }

        function getLayerColor(layerName) {
            const colors = {
                'Régions': '#1f77b4',
                'Départements': '#ff7f0e',
                'Arrondissements': '#2ca02c',
                'Points de Collecte': '#d62728',
                'Zones de Balayage': '#9467bd',
                'Mobilier Urbain': '#8c564b'
            };
            return colors[layerName] || '#666';
        }

        function updateVisibleCount() {
            const checkboxes = document.querySelectorAll('#layerControls input[type="checkbox"]');
            const visibleCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            document.getElementById('visibleCount').textContent = visibleCount;
        }

        // Événements des boutons
        document.getElementById('togglePanel').addEventListener('click', function() {
            const panel = document.querySelector('.control-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('closePanel').addEventListener('click', function() {
            document.querySelector('.control-panel').style.display = 'none';
        });

        document.getElementById('resetMap').addEventListener('click', function() {
            map.setView([14.0, -14.0], 6);
        });

        // Initialiser les contrôles
        initLayerControls();

        // Ajouter automatiquement les premières couches intéressantes
        if (layersObject['Régions']) {
            map.addLayer(layersObject['Régions']);
            document.getElementById('layer_Régions').checked = true;
        }
        if (layersObject['Points de Collecte']) {
            map.addLayer(layersObject['Points de Collecte']);
            document.getElementById('layer_Points de Collecte').checked = true;
        }

        updateVisibleCount();

        console.log('✅ Carte SONAGED chargée avec succès');
        console.log('📊 Couches disponibles:', Object.keys(layersObject).slice(1));
    </script>
</body>
</html>`;

    fs.writeFileSync(outputPath, html, 'utf-8');
    return outputPath;
}

function main() {
    console.log('\n' + '═'.repeat(80));
    console.log('🗺️  GÉNÉRATION CARTE - Réseau National SONAGED - Couverture Opérationnelle');
    console.log('═'.repeat(80));
    
    console.log('\n📁 Chargement des données GeoJSON depuis C:\\CARTE\\données\\data...');
    const geojsonData = findGeoJSONFiles();
    
    if (Object.keys(geojsonData).length === 0) {
        console.log('❌ Aucune donnée GeoJSON trouvée');
        process.exit(1);
    }

    console.log('\n✅ Données GeoJSON chargées:');
    Object.entries(geojsonData).forEach(([key, value]) => {
        console.log(`   • ${key}: ${value.featureCount} features`);
    });

    console.log('\n🏗️  Génération de la carte...');
    const outputPath = createSonagedMap(geojsonData);

    console.log(`\n✅ Carte créée avec succès: ${outputPath}`);
    console.log(`\n📖 Ouvrir dans navigateur:`);
    console.log(`   file:///${path.resolve(outputPath).replace(/\\\\/g, '/').replace(/C:/, 'C:/')}`);
    console.log('\n' + '═'.repeat(80));
    console.log('💡 Astuces:');
    console.log('   • Activez les couches pour les visualiser');
    console.log('   • Cliquez sur les zones pour voir les détails');
    console.log('   • Utilisez les contrôles de zoom pour explorer');
    console.log('═'.repeat(80) + '\n');
}

main();
