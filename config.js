/**
 * CONFIGURATION D'ENVIRONNEMENT - Dimensionnement SENELEC
 * ========================================================
 * Ce fichier configure les URLs API selon l'environnement
 * 
 * Utilisation:
 * - Automatiquement inclus dans index.html avant api-client.js
 * - Définit la variable globale SENELEC_CONFIG
 * 
 * Production: GitHub Pages + Tunnel HTTPS
 * Développement: localhost 3001 + localhost 5000
 */

// Configuration par environnement
const SENELEC_CONFIG = {
    // Développement local
    development: {
        API_URL: 'http://localhost:3001/api',
        APP_NAME: 'SENELEC Dimensionnement (DEV)',
        DEBUG: true,
        TUNNEL_ENABLED: false
    },
    
    // Production - GitHub Pages Frontend + Tunnel HTTPS Backend
    production: {
        API_URL: 'https://4mkdbs2k-3001.euw.devtunnels.ms/api',
        APP_NAME: 'SENELEC Dimensionnement',
        DEBUG: false,
        TUNNEL_ENABLED: true
    },
    
    // Staging - Pour les tests
    staging: {
        API_URL: 'https://api-staging.senelec-dimensionnement.sn/api',
        APP_NAME: 'SENELEC Dimensionnement (STAGING)',
        DEBUG: true,
        TUNNEL_ENABLED: false
    },
    
    // Tunnel distant (Dev Tunnels) - Alias pour production
    tunnel: {
        API_URL: 'https://4mkdbs2k-3001.euw.devtunnels.ms/api',
        APP_NAME: 'SENELEC Dimensionnement (TUNNEL)',
        DEBUG: true,
        TUNNEL_ENABLED: true
    }
};

// Déterminer l'environnement actuel
function getEnvironment() {
    // Vérifier si un environnement est forcé via URL (?env=tunnel)
    const urlParams = new URLSearchParams(window.location.search);
    const forcedEnv = urlParams.get('env');
    if (forcedEnv && SENELEC_CONFIG[forcedEnv]) {
        console.log(`🔄 Environnement forcé via URL: ${forcedEnv}`);
        return forcedEnv;
    }
    
    const host = window.location.hostname;
    
    // Si en localhost, c'est développement
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'development';
    }
    
    // Si sur tunnel Dev Tunnels
    if (host.includes('devtunnels.ms')) {
        return 'tunnel';
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
const tunnelActive = CURRENT_ENV === 'tunnel';
console.log(`
╔════════════════════════════════════════════╗
║  SENELEC DIMENSIONNEMENT - CONFIGURATION   ║
╠════════════════════════════════════════════╣
║  Environnement: ${CURRENT_ENV.toUpperCase().padEnd(25)}║
║  Hôte: ${window.location.hostname.padEnd(38)}║
║  API URL: ${CONFIG.API_URL.substring(0, 35).padEnd(37)}║
║  Debug: ${(CONFIG.DEBUG ? '✅' : '❌').padEnd(40)}║
${tunnelActive ? '║  🌐 TUNNEL MODE ACTIF' + ''.padEnd(20) + '║\n' : ''}╚════════════════════════════════════════════╝
`);

// Exporter la configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SENELEC_CONFIG, CONFIG, CURRENT_ENV };
}
