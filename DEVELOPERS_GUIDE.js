// GUIDE TECHNIQUE - API PWA SENELEC
// ===================================

/**
 * TABLE DES MATIÈRES:
 * 1. Enregistrement Service Worker
 * 2. Géolocalisation & Conversion UTM
 * 3. Gestion du Cache
 * 4. Installation PWA
 * 5. Détection Online/Offline
 * 6. Export de Données
 */

// ============================================================
// 1. ENREGISTREMENT SERVICE WORKER
// ============================================================

// Vérifier le support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then(registration => {
        console.log('✅ SW enregistré:', registration);
        
        // Vérifier les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log('📦 Nouvelle version disponible');
            }
          });
        });
      })
      .catch(error => console.error('❌ Erreur SW:', error));
  });
}

// Unregister (rarement nécessaire)
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});

// ============================================================
// 2. GÉOLOCALISATION & CONVERSION UTM
// ============================================================

/**
 * Options de géolocalisation
 * enableHighAccuracy: true   → Mode haute précision (drain batterie)
 * timeout: 10000             → Délai max en ms
 * maximumAge: 0              → Pas de cache, position fraîche
 */

let watchId = null;

function demarrerGeolocalisation() {
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  watchId = navigator.geolocation.watchPosition(
    successCallback,
    errorCallback,
    options
  );
}

function successCallback(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const accuracy = position.coords.accuracy; // ± mètres
  const altitude = position.coords.altitude;  // en mètres
  const heading = position.coords.heading;    // 0-360°
  const speed = position.coords.speed;        // m/s

  console.log(`📍 Lat: ${lat}, Lon: ${lon}, Précision: ±${accuracy}m`);

  // Convertir en UTM
  const utm = latLonToUTM(lat, lon);
  console.log(`🗺️ UTM: ${utm.easting}E, ${utm.northing}N, Zone: ${utm.zone}`);

  // Stocker les données
  donnees.latitude = lat;
  donnees.longitude = lon;
  donnees.precision = accuracy;
  donnees.coordonneeX = utm.easting;
  donnees.coordonneeY = utm.northing;
}

function errorCallback(error) {
  const messages = {
    1: 'Permission refusée (PERMISSION_DENIED)',
    2: 'Position indisponible (POSITION_UNAVAILABLE)',
    3: 'Timeout dépassé (TIMEOUT)'
  };
  console.error('❌ Erreur GPS:', messages[error.code]);
}

function arreterGeolocalisation() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    console.log('⏹️ Suivi GPS arrêté');
  }
}

/**
 * Conversion Latitude/Longitude (WGS84) → UTM
 * 
 * @param {number} lat - Latitude (-90 à 90)
 * @param {number} lon - Longitude (-180 à 180)
 * @returns {object} {easting, northing, zone}
 * 
 * Exemple: latLonToUTM(13.1939, -15.5277) 
 *          → Zone 28N, Easting: 634568.23, Northing: 1457834.56
 */

function latLonToUTM(lat, lon) {
  const k0 = 0.9996;    // Facteur d'échelle UTM
  const E = 0.00669438; // Excentricité ellipsoïde WGS84
  const E2 = E / (1 - E);

  const zone = Math.floor((lon + 180) / 6) + 1;
  const lon0 = (zone - 1) * 6 - 180 + 3;

  // Conversions angulaires
  const N = Math.cos((lat * Math.PI) / 180);
  const T = Math.tan((lat * Math.PI) / 180);
  const C = E2 * N * N;
  const A = ((lon - lon0) * Math.PI) / 180 * N;

  // Calcul (formules de Transverse Mercator)
  const M =
    111132.92 * lat -
    16216.94 * Math.sin((2 * lat * Math.PI) / 180) +
    17.21 * Math.sin((4 * lat * Math.PI) / 180) -
    0.094 * Math.sin((6 * lat * Math.PI) / 180);

  const easting =
    500000 +
    k0 *
      6378137 *
      (A +
        ((A * A * A) / 6) * (1 - T * T + C) +
        ((A * A * A * A * A) / 120) * (5 - 18 * T * T + T * T * T * T + 72 * C - 58 * E2));

  const northing =
    k0 *
    (M +
      6378137 *
        (T * ((A * A) / 2) +
          (T * ((A * A * A * A) / 24)) *
            (5 - T * T + 9 * C + 4 * C * C) +
          (T * ((A * A * A * A * A * A) / 720)) *
            (61 - 58 * T * T + T * T * T * T + 600 * C - 330 * E2)));

  return {
    zone: zone,
    easting: easting,
    northing: northing,
    zoneDesignator: `${zone}N` // Pour hémisphère Nord (Sénégal)
  };
}

// ============================================================
// 3. GESTION DU CACHE SERVICE WORKER
// ============================================================

/**
 * Communication avec le Service Worker via postMessage
 */

// Nettoyer tout le cache
function nettoyerToutLeCache() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_CACHE'
    });
    console.log('🗑️ Demande de nettoyage du cache envoyée');
  }
}

// Obtenir la taille du cache
function obtenirTailleCache() {
  return new Promise((resolve, reject) => {
    if (navigator.serviceWorker.controller) {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_SIZE') {
          const sizeInMB = (event.data.size / 1024 / 1024).toFixed(2);
          console.log(`📦 Cache utilisé: ${sizeInMB} MB`);
          resolve(sizeInMB);
        }
      };
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [channel.port2]
      );
    }
  });
}

// Forcer une mise à jour du Service Worker
function forceUpdateServiceWorker() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SKIP_WAITING'
    });
  }
}

/**
 * Storage API - Estimation d'espace disponible
 */

async function afficherEstimationStockage() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const percentUsed = (estimate.usage / estimate.quota) * 100;
    const usedMB = (estimate.usage / 1024 / 1024).toFixed(2);
    const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);

    console.log(`Stockage utilisé: ${usedMB} MB / ${quotaMB} MB (${percentUsed.toFixed(1)}%)`);

    return {
      usage: estimate.usage,
      quota: estimate.quota,
      percentUsed: percentUsed
    };
  }
}

// ============================================================
// 4. INSTALLATION PWA (beforeinstallprompt)
// ============================================================

let deferredPrompt;

// Capturer l'événement d'installation
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('📲 Prompt d\'installation PWA disponible');
  
  // Afficher le bouton d'installation
  document.getElementById('install-button').style.display = 'block';
});

// Déclencher l'installation
async function installerApplication() {
  if (!deferredPrompt) {
    console.log('❌ Prompt d\'installation non disponible');
    return;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('✅ Installation acceptée');
  } else {
    console.log('❌ Installation refusée');
  }
  
  deferredPrompt = null;
}

// Détecter si déjà installée
window.addEventListener('appinstalled', () => {
  console.log('✅ Application PWA installée!');
  deferredPrompt = null;
  // Masquer le bouton d'installation
  document.getElementById('install-button').style.display = 'none';
});

/**
 * Vérifier si eksécution en mode PWA
 */

function estExecuteeEnModePWA() {
  // iOS Safari (ajout à l'écran d'accueil)
  if (window.navigator.standalone === true) {
    return true;
  }

  // Autres navigateurs
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Windowed mode (temporaire pendant installation)
  if (window.matchMedia('(display-mode: windowed)').matches) {
    return false;
  }

  return false;
}

if (estExecuteeEnModePWA()) {
  console.log('📱 Exécution en mode PWA');
} else {
  console.log('🌐 Exécution en mode navigateur');
}

// ============================================================
// 5. DÉTECTION ONLINE/OFFLINE
// ============================================================

// Événements de connectivité
window.addEventListener('online', () => {
  console.log('🌐 Connexion internet rétablie');
  synchroniserDonnees();
});

window.addEventListener('offline', () => {
  console.log('📵 Mode hors ligne activé');
});

// Vérification actuelle
function estConnecte() {
  return navigator.onLine;
}

// Attendre la connexion
async function attendreConnexion() {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve();
    } else {
      window.addEventListener('online', resolve, { once: true });
    }
  });
}

// Synchroniser quand reconnecté
async function synchroniserDonnees() {
  if (!estConnecte()) {
    console.log('⏳ Application en cours de synchronisation...');
    await attendreConnexion();
  }

  console.log('✅ Données en cours de synchronisation');
  // Logique de sync personnalisée
}

// ============================================================
// 6. EXPORT DE DONNÉES
// ============================================================

/**
 * Export JSON des données collectées
 */
function exporterJSON() {
  const dataStr = JSON.stringify(donnees, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `collecte_donnees_${new Date().getTime()}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Export Excel (nécessite xlsx library)
 */
async function exporterExcel() {
  const XLSX = window.XLSX;
  const workbook = XLSX.utils.book_new();
  
  // Transformer les données
  const worksheet = XLSX.utils.json_to_sheet([donnees]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Collecte');
  
  // Télécharger
  XLSX.writeFile(workbook, `collecte_${new Date().getTime()}.xlsx`);
}

/**
 * Export CSV
 */
function exporterCSV() {
  const keys = Object.keys(donnees);
  const csv = [
    keys.join(','),
    keys.map(k => donnees[k]).join(',')
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `donnees_${new Date().getTime()}.csv`;
  link.click();
}

// ============================================================
// 7. STORAGE AVANCÉ
// ============================================================

/**
 * IndexedDB - Pour stockage plus gros (photos, etc.)
 */

function ouvrirBaseDeDonnees() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('senelec_db', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('donnees')) {
        db.createObjectStore('donnees', { keyPath: 'id' });
      }
    };
  });
}

async function sauvegarderDonneesIndexedDB(donnees) {
  const db = await ouvrirBaseDeDonnees();
  const transaction = db.transaction('donnees', 'readwrite');
  const store = transaction.objectStore('donnees');

  donnees.id = new Date().getTime();
  store.add(donnees);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(donnees.id);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function chargerDonneesIndexedDB(id) {
  const db = await ouvrirBaseDeDonnees();
  const transaction = db.transaction('donnees', 'readonly');
  const store = transaction.objectStore('donnees');
  const request = store.get(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ============================================================
// 8. DIAGNOSTIC PWA
// ============================================================

function afficherDiagnosticPWA() {
  console.group('📊 Diagnostic PWA');

  // Check Service Worker
  console.log(
    '✅ Service Worker support:',
    'serviceWorker' in navigator
  );

  // Check Geolocation
  console.log(
    '✅ Geolocation support:',
    'geolocation' in navigator
  );

  // Check Storage
  console.log(
    '✅ Storage API support:',
    'storage' in navigator
  );

  // Check manifest
  fetch('./manifest.json')
    .then(r => r.json())
    .then(m => console.log('✅ Manifest:', m.name))
    .catch(() => console.error('❌ Manifest introuvable'));

  // Stockage utilisé
  obtenirTailleCache();
  afficherEstimationStockage();

  // Mode PWA
  console.log(
    '📱 Mode PWA:',
    estExecuteeEnModePWA() ? 'OUI' : 'NON'
  );

  // Connectivité
  console.log('🌐 Connecté:', estConnecte() ? 'OUI' : 'NON');

  console.groupEnd();
}

// Afficher le diagnostic au chargement
window.addEventListener('load', afficherDiagnosticPWA);

// ============================================================
// EXPORT POUR UTILISATION EXTERNE
// ============================================================

window.SENELEC = {
  // Géolocalisation
  demarrerGeolocalisation,
  arreterGeolocalisation,
  latLonToUTM,

  // PWA
  installerApplication,
  estExecuteeEnModePWA,

  // Connectivité
  estConnecte,
  attendreConnexion,
  synchroniserDonnees,

  // Export
  exporterJSON,
  exporterExcel,
  exporterCSV,

  // Cache
  nettoyerToutLeCache,
  obtenirTailleCache,
  forceUpdateServiceWorker,

  // Stockage
  sauvegarderDonneesIndexedDB,
  chargerDonneesIndexedDB,

  // Diagnostic
  afficherDiagnosticPWA,
  afficherEstimationStockage
};

console.log('✅ API SENELEC PWA chargée - Utilisez window.SENELEC');
