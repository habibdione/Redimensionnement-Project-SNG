/**
 * CONFIGURATION D'ENVIRONNEMENT - Dimensionnement SENELEC
 * ========================================================
 * Ce fichier configure les URLs API selon l'environnement
 * 
 * Utilisation:
 * - Automatiquement inclus dans index.html avant api-client.js
 * - Définit la variable globale SENELEC_CONFIG
 */

// Configuration par environnement
const SENELEC_CONFIG = {
    // Développement local
    development: {
        API_URL: 'http://localhost:3001/api',
        APP_NAME: 'SENELEC Dimensionnement (DEV)',
        DEBUG: true
    },
    
    // Production - Railway Backend + GitHub Pages Frontend
    production: {
        // Template: https://[votre-app-name]-production.up.railway.app/api
        // À REMPLACER après déploiement Railway!
        // Avant:
        // API_URL: 'https://your-railway-app-production.up.railway.app/api',
        // Après:
        API_URL: 'https://[ta-vraie-url]-production.up.railway.app/api',
        APP_NAME: 'SENELEC Dimensionnement',
        DEBUG: false
    },
    
    // Staging - Pour les tests
    staging: {
        API_URL: 'https://api-staging.senelec-dimensionnement.sn/api',
        APP_NAME: 'SENELEC Dimensionnement (STAGING)',
        DEBUG: true
    }
};

// Déterminer l'environnement actuel
function getEnvironment() {
    const host = window.location.hostname;
    
    // Si en localhost, c'est développement
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'development';
    }
    
    // Si sur GitHub Pages (habibdione.github.io), c'est production
    if (host.includes('github.io')) {
        return 'production';
    }
    
    // Si sur staging
    if (host.includes('staging')) {
        return 'staging';
    }
    
    // Par défaut, production
    return 'production';
}

// Obtenir la configuration actuelle
const CURRENT_ENV = getEnvironment();
let CONFIG = SENELEC_CONFIG[CURRENT_ENV] || SENELEC_CONFIG.production;

// Sécurité: Si l'URL de production contient un placeholder, utiliser le fallback development
if (CONFIG.API_URL.includes('[ta-vraie-url]')) {
    console.warn('⚠️ Configuration production invalide - URL placeholder détectée. Utilisation du fallback localhost...');
    CONFIG = SENELEC_CONFIG.development;
}

// Logger les informations de configuration
console.log(`
╔════════════════════════════════════════════╗
║  SENELEC DIMENSIONNEMENT - CONFIGURATION   ║
╠════════════════════════════════════════════╣
║  Environnement: ${CURRENT_ENV.toUpperCase().padEnd(25)}║
║  Hôte: ${window.location.hostname.padEnd(38)}║
║  API URL: ${CONFIG.API_URL.substring(0, 35).padEnd(37)}║
║  Debug: ${(CONFIG.DEBUG ? '✅' : '❌').padEnd(40)}║
╚════════════════════════════════════════════╝
`);

// Exporter la configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SENELEC_CONFIG, CONFIG, CURRENT_ENV };
}
