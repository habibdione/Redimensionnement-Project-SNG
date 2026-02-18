/**
 * SERVICE DE SYNCHRONISATION EXCEL
 * Gère la synchronisation périodique des données avec les fichiers Excel
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let syncInterval = null;
let isSyncServiceEnabled = false;

/**
 * Traitement lors de la création d'une collecte
 * @param {Object} collecteData - Les données de la collecte créée
 */
async function onCollecteCreated(collecteData) {
    try {
        console.log('📊 [Sync Service] Nouvelle collecte créée:', collecteData.id);
        // Logique de synchronisation si nécessaire
        return {
            success: true,
            message: 'Collecte synchronized successfully'
        };
    } catch (error) {
        console.error('❌ [Sync Service] Erreur lors de la synchronisation:', error);
        throw error;
    }
}

/**
 * Initialiser le service de synchronisation
 * @returns {boolean} - true si le service est activé
 */
function initializeSyncService() {
    try {
        console.log('🔄 [Sync Service] Initialisation du service de synchronisation');
        
        // Vérifier si la synchronisation est activée
        const enableSync = process.env.ENABLE_SYNC === 'true';
        isSyncServiceEnabled = enableSync;
        
        if (enableSync) {
            console.log('✅ [Sync Service] Service de synchronisation ACTIVÉ');
        } else {
            console.log('⚪ [Sync Service] Service de synchronisation DÉSACTIVÉ');
        }
        
        return enableSync;
    } catch (error) {
        console.error('❌ [Sync Service] Erreur lors de l\'initialisation:', error);
        return false;
    }
}

/**
 * Démarrer la synchronisation périodique
 * @param {number} interval - Intervalle en millisecondes
 */
function startPeriodicSync(interval) {
    try {
        if (!isSyncServiceEnabled) {
            console.log('⚪ [Sync Service] Synchronisation périodique non démarrée (service désactivé)');
            return;
        }
        
        if (syncInterval) {
            clearInterval(syncInterval);
        }
        
        console.log(`🕐 [Sync Service] Synchronisation périodique démarrée (intervalle: ${interval}ms)`);
        
        syncInterval = setInterval(async () => {
            try {
                console.log('🔄 [Sync Service] Exécution de la synchronisation périodique');
                // Ajouter la logique de synchronisation ici
            } catch (error) {
                console.error('❌ [Sync Service] Erreur lors de la synchronisation périodique:', error);
            }
        }, interval);
    } catch (error) {
        console.error('❌ [Sync Service] Erreur lors du démarrage de la synchronisation périodique:', error);
    }
}

/**
 * Arrêter la synchronisation périodique
 */
function stopPeriodicSync() {
    if (syncInterval) {
        clearInterval(syncInterval);
        console.log('⏹️  [Sync Service] Synchronisation périodique arrêtée');
    }
}

/**
 * Exporter le service
 */
module.exports = {
    onCollecteCreated,
    initializeSyncService,
    startPeriodicSync,
    stopPeriodicSync
};
