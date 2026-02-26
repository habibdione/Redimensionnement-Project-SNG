/**
 * CONFIGURATION TUNNEL - Mise à jour pour tunnels publics
 * ======================================================
 * Configuration complète pour utiliser le tunnel Dev Tunnels
 */

// Paramètres du tunnel
const TUNNEL_CONFIG = {
    TUNNEL_URL: 'https://4mkdbs2k-3001.euw.devtunnels.ms',
    TUNNEL_API: 'https://4mkdbs2k-3001.euw.devtunnels.ms/api',
    TUNNEL_ENABLED: true,
    
    // Ajouter les headers nécessaires pour le tunnel
    HEADERS: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    
    // Options de requête pour le tunnel
    FETCH_OPTIONS: {
        method: 'POST',
        credentials: 'omit', // Pas d'authentification
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }
};

/**
 * Override les paramètres d'API si tunnel est activé
 */
function activerTunnel() {
    if (typeof window !== 'undefined') {
        // Estimer si on est sur le tunnel
        const hostname = window.location.hostname;
        const isOnTunnel = hostname.includes('devtunnels.ms');
        
        if (isOnTunnel || new URLSearchParams(window.location.search).get('env') === 'tunnel') {
            console.log('🌐 TUNNEL MODE ACTIVÉ');
            console.log(`   URL: ${TUNNEL_CONFIG.TUNNEL_URL}`);
            console.log(`   API: ${TUNNEL_CONFIG.TUNNEL_API}`);
            
            // Override CONFIG if exists
            if (typeof CONFIG !== 'undefined') {
                CONFIG.API_URL = TUNNEL_CONFIG.TUNNEL_API;
                CONFIG.TUNNEL_MODE = true;
                console.log('✅ Configuration API mise à jour pour le tunnel');
            }
            
            return true;
        }
    }
    return false;
}

// Exporter pour utilisation globale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TUNNEL_CONFIG, activerTunnel };
} else if (typeof window !== 'undefined') {
    window.TUNNEL_CONFIG = TUNNEL_CONFIG;
    window.activerTunnel = activerTunnel;
}

// Auto-activer le tunnel si paramètre présent
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activerTunnel);
} else if (typeof window !== 'undefined') {
    activerTunnel();
}
