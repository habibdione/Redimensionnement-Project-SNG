/**
 * 🗺️ Script d'amélioration de la carte Leaflet
 * Fonctionnalités: Zoom automatique, statistiques de couches, animations
 */

// Variables globales pour la carte
let mapInitialized = false;
let layerStats = {};

/**
 * Initialiser la carte avec optimisations avancées
 */
function initializeMapWithEnhancements() {
    if (mapInitialized || !window.landingMap) return;
    
    console.log('🚀 Initialisation avancée de la carte...');
    
    try {
        // Zoom initial optimal
        window.landingMap.setView([14.5, -14.5], 6);
        
        // Ajouter les événements de zoom
        window.landingMap.on('zoomend', () => {
            const currentZoom = window.landingMap.getZoom();
            console.log(`🔍 Niveau de zoom: ${currentZoom}`);
        });
        
        mapInitialized = true;
        console.log('✅ Carte initialisée avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation avancée:', error);
    }
}

/**
 * Obtenir les statistiques des couches chargées
 */
function getLayerStatistics() {
    const stats = {};
    
    if (window.geojsonLayers) {
        for (const [layerName, layer] of Object.entries(window.geojsonLayers)) {
            let featureCount = 0;
            
            if (layer.eachLayer) {
                layer.eachLayer(() => featureCount++);
            }
            
            stats[layerName] = {
                name: window.layerDisplayNames[layerName] || layerName,
                count: featureCount,
                visible: window.landingMap.hasLayer(layer)
            };
        }
    }
    
    return stats;
}

/**
 * Afficher les statistiques dans la console
 */
function showLayerStats() {
    const stats = getLayerStatistics();
    console.group('📊 Statistiques des Couches');
    for (const [key, value] of Object.entries(stats)) {
        console.log(`  ${value.name}: ${value.count} éléments ${value.visible ? '✅ visible' : '❌ masquée'}`);
    }
    console.groupEnd();
}

/**
 * Centrer la carte sur une couche spécifique
 */
function zoomToLayer(layerName) {
    if (!window.landingMap || !window.geojsonLayers[layerName]) {
        console.error(`Couche '${layerName}' non trouvée`);
        return;
    }
    
    const layer = window.geojsonLayers[layerName];
    const bounds = layer.getBounds();
    
    if (bounds.isValid()) {
        window.landingMap.fitBounds(bounds, { padding: [50, 50] });
        console.log(`🎯 Centré sur ${window.layerDisplayNames[layerName]}`);
    }
}

/**
 * Afficher/masquer une couche
 */
function toggleLayer(layerName) {
    if (!window.landingMap || !window.geojsonLayers[layerName]) {
        console.error(`Couche '${layerName}' non trouvée`);
        return;
    }
    
    const layer = window.geojsonLayers[layerName];
    const isVisible = window.landingMap.hasLayer(layer);
    
    if (isVisible) {
        window.landingMap.removeLayer(layer);
        console.log(`✅ ${window.layerDisplayNames[layerName]} masquée`);
    } else {
        window.landingMap.addLayer(layer);
        console.log(`✅ ${window.layerDisplayNames[layerName]} affichée`);
    }
}

/**
 * Recenter la carte sur le Sénégal
 */
function resetMapView() {
    if (window.landingMap) {
        window.landingMap.setView([14.5, -14.5], 6);
        console.log('🔄 Vue réinitialisée');
    }
}

/**
 * Exporter la vue actuelle de la carte
 */
function exportMapView() {
    if (!window.landingMap) return;
    
    const center = window.landingMap.getCenter();
    const zoom = window.landingMap.getZoom();
    const bounds = window.landingMap.getBounds();
    
    const viewData = {
        timestamp: new Date().toISOString(),
        center: { lat: center.lat, lng: center.lng },
        zoom: zoom,
        bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
        },
        layers: getLayerStatistics()
    };
    
    console.log('📊 Vue exportée:', viewData);
    return viewData;
}

/**
 * Charger une vue sauvegardée
 */
function loadMapView(viewData) {
    if (!window.landingMap || !viewData) return;
    
    window.landingMap.setView([viewData.center.lat, viewData.center.lng], viewData.zoom);
    console.log('✅ Vue chargée');
}

/**
 * Ajouter un événement d'aide à la console
 */
function showMapCommands() {
    console.group('🗺️ Commandes de Carte Disponibles');
    console.log('showLayerStats() - Affiche les statistiques de toutes les couches');
    console.log('zoomToLayer("Region_3") - Centre sur une couche spécifique');
    console.log('toggleLayer("Region_3") - Affiche/masque une couche');
    console.log('resetMapView() - Réinitialise la vue de la carte');
    console.log('exportMapView() - Exporte la vue actuelle');
    console.log('loadMapView(viewData) - Charge une vue sauvegardée');
    console.groupEnd();
}

/**
 * Initialiser au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeMapWithEnhancements();
        showMapCommands();
    }, 1000);
});

// Exposer les commandes globalement
window.mapCommands = {
    stats: showLayerStats,
    zoomTo: zoomToLayer,
    toggle: toggleLayer,
    reset: resetMapView,
    export: exportMapView,
    load: loadMapView,
    help: showMapCommands
};

console.log('💡 Tapez window.mapCommands.help() pour afficher les commandes disponibles');
