// 🔧 SERVICE WORKER - SONAGED MAP v2.1
// Mode offline pour travail de terrain

const CACHE_NAME = 'sonaged-v2.1';
const RUNTIME_CACHE = 'sonaged-runtime';

// Ressources essentielles à mettre en cache
const ESSENTIAL_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/service-worker.js'
];

// CDN et librairies à mettre en cache
const LIBRARY_CACHE = [
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
    'https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js',
    'https://cdn.jsdelivr.net/npm/shpwrite@0.3.2/dist/shpwrite.js'
];

// EVENT: Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker - Installation...');
    
    event.waitUntil(
        Promise.all([
            // Cache les ressources essentielles
            caches.open(CACHE_NAME).then((cache) => {
                console.log('📦 Mise en cache des ressources essentielles...');
                return cache.addAll(ESSENTIAL_ASSETS).catch(() => {
                    console.log('⚠️ Certain essentials assets not found, continuing...');
                });
            }),
            // Pré-cache les librairies CDN
            caches.open(RUNTIME_CACHE).then((cache) => {
                console.log('📡 Pré-cache des librairies CDN...');
                return cache.addAll(LIBRARY_CACHE).catch(() => {
                    console.log('⚠️ CDN pre-cache skipped (no internet)');
                });
            })
        ])
    );
    
    // Forcer l'activation immédiate
    self.skipWaiting();
});

// EVENT: Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker - Activé');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                    .map((name) => {
                        console.log(`🗑️ Suppression ancien cache: ${name}`);
                        return caches.delete(name);
                    })
            );
        })
    );
    
    self.clients.claim(); // Prendre control des clients existants
});

// EVENT: Interception des requêtes (Network First)
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-GET
    if (request.method !== 'GET') {
        return;
    }

    // Ignorer les requêtes chrome-extension://
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // ============ STRATÉGIE 1: Network First pour les ressources dynamiques ============
    if (url.pathname.includes('/api/') || url.hostname !== self.location.hostname) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Mettre en cache les réponses valides (status 200)
                    if (response.status === 200) {
                        const cache_copy = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            cache.put(request, cache_copy);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback au cache si erreur réseau
                    return caches.match(request);
                })
        );
        return;
    }

    // ============ STRATÉGIE 2: Cache First pour les ressources statiques ============
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) {
                return cached;
            }

            return fetch(request)
                .then((response) => {
                    // Ne mettre en cache que les réponses valides
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    const cache_copy = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, cache_copy);
                    });

                    return response;
                })
                .catch(() => {
                    // Offline fallback
                    console.log(`❌ Offline: ${request.url}`);
                    
                    // Retourner une page offline si disponible
                    return caches.match('/offline.html').then((response) => {
                        return response || new Response(
                            JSON.stringify({
                                error: 'Offline',
                                message: 'Vous êtes hors ligne. Les données seront synchronisées ultérieurement.'
                            }),
                            { 
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: new Headers({
                                    'Content-Type': 'application/json'
                                })
                            }
                        );
                    });
                });
        })
    );
});

// ============ SYNCHRONISATION EN ARRIÈRE-PLAN ============
self.addEventListener('sync', (event) => {
    console.log('🔄 Background Sync:', event.tag);
    
    if (event.tag === 'sync-circuits') {
        event.waitUntil(
            // Récupérer les circuits en attente depuis IndexedDB
            // et les envoyer au serveur
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({
                        type: 'SYNC_COMPLETE',
                        data: 'Circuits synchronisés'
                    });
                });
            })
        );
    }
});

// ============ MESSAGES DEPUIS LES CLIENTS ============
self.addEventListener('message', (event) => {
    console.log('📨 Message au Service Worker:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CACHE_URLS') {
        const urls = event.data.urls || [];
        caches.open(RUNTIME_CACHE).then((cache) => {
            cache.addAll(urls).then(() => {
                event.ports[0].postMessage('✅ Ressources mises en cache');
            }).catch((err) => {
                event.ports[0].postMessage('❌ Erreur cache: ' + err.message);
            });
        });
    }
});

// ============ GESTION NOTIFICATIONS PUSH ============
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'Nouvelle notification',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'sonaged-notification',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'SONAGED', options)
    );
});

// ============ LOG STATUS ============
console.log('✅ Service Worker enregistré - Offline mode activé');
