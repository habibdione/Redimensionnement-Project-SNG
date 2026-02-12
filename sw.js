// Service Worker pour SENELEC - Dimensionnement Cartographique
// Gère le cache des tuiles OpenStreetMap et la fonctionnalité hors ligne

const CACHE_PREFIX = 'senelec-map-';
const CACHE_VERSION = 'v1';
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const TILE_CACHE = `${CACHE_PREFIX}tiles-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `${CACHE_PREFIX}dynamic-${CACHE_VERSION}`;

// URLs à mettre en cache lors de l'installation
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js'
];

// Événement d'installation
self.addEventListener('install', event => {
  console.log('[SW] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Mise en cache des ressources statiques');
      return cache.addAll(urlsToCache).catch(err => {
        console.warn('[SW] Certaines ressources n\'ont pas pu être mises en cache:', err);
        // Continuer même si certaines ressources échouent
        return Promise.resolve();
      });
    }).then(() => self.skipWaiting())
  );
});

// Événement d'activation
self.addEventListener('activate', event => {
  console.log('[SW] Activation en cours...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Nettoyer les anciens caches
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME && 
              cacheName !== TILE_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Événement de récupération (fetch)
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTPS (sauf localhost)
  if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
    return;
  }

  // Stratégie pour les tuiles OpenStreetMap: cache-first
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response;
        }
        return fetch(request).then(response => {
          // Mettre en cache la réponse pour la prochaine fois
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(TILE_CACHE).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        }).catch(err => {
          console.warn('[SW] Erreur de fetch pour tuile:', url, err);
          // Retourner une image de remplacement hors ligne
          return new Response(
            `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>
              <rect fill='#e0e0e0' width='256' height='256'/>
              <text x='128' y='128' text-anchor='middle' dy='.3em' fill='#666' font-size='14'>Hors ligne</text>
            </svg>`,
            {
              headers: { 'Content-Type': 'image/svg+xml' },
              status: 200
            }
          );
        });
      })
    );
    return;
  }

  // Stratégie pour CDN (Leaflet): cache avec fallback réseau
  if (url.hostname.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        }).catch(err => {
          console.warn('[SW] CDN indisponible:', url.hostname);
          return caches.match(request);
        });
      })
    );
    return;
  }

  // Stratégie par défaut: network-first avec fallback cache
  event.respondWith(
    fetch(request)
      .then(response => {
        // Mettre en cache les réponses valides
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(err => {
        console.log('[SW] Fetch échoué, utilisation du cache:', url);
        return caches.match(request).then(response => {
          if (response) {
            return response;
          }
          // Fallback si la ressource n'est pas en cache
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
          // Réponse par défaut pour les autres types
          return new Response('Ressource non disponible hors ligne', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Message depuis le client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      ).then(() => {
        console.log('[SW] Tous les caches ont été nettoyés');
      });
    });
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    (async () => {
      let totalSize = 0;
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            totalSize += new Blob([await response.blob()]).size;
          }
        }
      }
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size: totalSize });
    })();
  }
});

// Gestion de la synchronisation en arrière-plan (si supportée)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-collecte-data') {
    event.waitUntil(
      // Synchroniser les données collectées
      Promise.resolve()
    );
  }
});

console.log('[SW] Service Worker chargé et prêt');
