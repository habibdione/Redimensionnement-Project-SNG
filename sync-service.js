/**
 * Service de Synchronisation Automatique Excel
 * Intégration avec le serveur backend pour export temps réel
 */

const excelSync = require('./export-excel-sync');
const db = require('./db');

/**
 * Initialise le service de synchronisation
 */
function initializeSyncService() {
    console.log('🔗 Service de synchronisation Excel initialisé');
    
    // Vérifier la connexion Excel au démarrage
    const connected = excelSync.checkExcelConnection();
    
    if (!connected) {
        console.warn('⚠️  Attention: La synchronisation Excel pourrait ne pas fonctionner');
        return false;
    }
    
    return true;
}

/**
 * Appelé après l'insertion d'une nouvelle collecte
 */
async function onCollecteCreated(collecte) {
    try {
        console.log(`📍 Nouvelle collecte créée: ${collecte.site}`);
        
        // Attendre 1 seconde pour s'assurer que la collecte est bien en BD
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Ajouter à Excel
        const success = await excelSync.addCollecteToExcel(collecte);
        
        if (success) {
            console.log(`✅ Collecte synchronisée vers Excel`);
        } else {
            console.warn(`⚠️  Échec de la synchronisation Excel`);
        }
        
        return success;
    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation:', error.message);
        return false;
    }
}

/**
 * Appelé après la mise à jour d'une collecte
 */
async function onCollecteUpdated(collecteId, updatedData) {
    try {
        console.log(`📝 Collecte mise à jour: #${collecteId}`);
        
        // Attendre 500ms
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mettre à jour dans Excel
        const success = await excelSync.updateCollecteInExcel(collecteId, updatedData);
        
        if (success) {
            console.log(`✅ Collecte mise à jour dans Excel`);
        }
        
        return success;
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour Excel:', error.message);
        return false;
    }
}

/**
 * Synchronisation complète périodique (optionnel)
 */
function startPeriodicSync(intervalMs = 3600000) { // 1 heure par défaut
    console.log(`⏰ Synchronisation périodique activée (tous les ${intervalMs/1000}s)`);
    
    setInterval(async () => {
        console.log('🔄 Synchronisation périodique...');
        await excelSync.syncAllCollectes();
    }, intervalMs);
}

module.exports = {
    initializeSyncService,
    onCollecteCreated,
    onCollecteUpdated,
    startPeriodicSync,
    excelSync
};
