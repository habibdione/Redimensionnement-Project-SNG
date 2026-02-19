# 📱 AUDIT DE COMPATIBILITÉ MOBILE - SONAGED MAP

**Date:** 19 février 2026  
**Application:** Dimensionnement SONAGED - Collecte de Données  
**Statut:** ⚠️ **COMPATIBLE MAIS À OPTIMISER POUR TERRAIN**

---

## 📊 RÉSUMÉ EXÉCUTIF

L'application est **partiellement optimisée pour mobile**. Elle fonctionne sur smartphones, mais plusieurs éléments doivent être ajustés pour une utilisation efficace en travail de terrain (utilisation prolongée, connectivité faible, GPS, etc.).

| Aspect | Statut | Notes |
|--------|--------|-------|
| **Responsive Design** | ✅ Bon | Media queries 768px & 480px implémentées |
| **Viewport Mobile** | ✅ Bon | viewport-fit=cover, user-scalable=no |
| **Taille des Buttons** | ⚠️ À vérifier | Minimum 44x44px requis, certains petits |
| **Performance** | ⚠️ Moyen | Leaflet heavy, pas de service worker |
| **Mode Offline** | ❌ Manquant | Pas de Service Worker = Pas de mode hors-ligne |
| **GPS/Géolocalisation** | ✅ Bon | watchPosition() + enableHighAccuracy implémentés |
| **PWA** | ⚠️ Partiel | manifest.json OK, mais pas de SW |
| **Circuit Tracker** | ⚠️ A ameliorer | Hauteur fixe 500px, non responsive |
| **Battery** | ⚠️ Concern | Tracking GPS continu consomme batterie |
| **Rotation d'écran** | ⚠️ Portrait only | Orientation "portrait-primary" fixée |

---

## ✅ FORCES ACTUELLES

### 1. **Configuration Viewport Excellente**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
```
- ✅ Couvre les notches (iPhone X+)
- ✅ user-scalable=no = pas de zoom accidentel
- ✅ Parfait pour travail de terrain

### 2. **Media Queries Présentes** (768px & 480px)
- ✅ Cartes réduites à 300px (tablette) & 250px (mobile)
- ✅ Boutons adaptés (padding 12px 16px)
- ✅ Grilles responsive (1 colonne sur petit écran)
- ✅ Images redimensionnées automatiquement

### 3. **PWA Configuration Basique**
```json
"display": "standalone",
"orientation": "portrait-primary",
"theme_color": "#667eea"
```
- ✅ Peut s'installer sur écran d'accueil (Android/iOS)
- ✅ Mode fullscreen sans navigateur

### 4. **Touches & Interactions**
```css
pointer-events: auto !important;
touch-action: manipulation;
-webkit-touch-callout: none;
```
- ✅ Boutons cliquables sur mobile
- ✅ Pas de long-press par défaut
- ✅ Double-tap zoom disabled

### 5. **GPS/Tracking Intégré**
```javascript
navigator.geolocation.watchPosition(..., {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
});
```
- ✅ watchPosition() = Suivi continu
- ✅ enableHighAccuracy = Précision optimale
- ✅ timeout court = Réactivité

---

## ❌ PROBLÈMES À ADRESSER

### 1. **❌ PAS DE SERVICE WORKER** (CRITIQUE)
**Impact:** Aucun mode hors-ligne = Application inutile sans connexion  
**Risque:** Travail de terrain en zone rurale = Pas de 4G/5G

**Solution requise:**
```javascript
// À ajouter dans <body> avant </body>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => console.log(err));
}
```

**Créer `service-worker.js`:**
```javascript
const CACHE_NAME = 'sonaged-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    // Leaflet & libs
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Fallback offline page
            });
        })
    );
});
```

**Priorité:** 🔴 **CRITIQUE**

---

### 2. **⚠️ CIRCUIT TRACKER - HAUTEUR FIXE 500px**

**Problème:**
```html
<div id="circuit-map" style="width: 100%; height: 500px; ..."></div>
```

**Impact:** Sur petit mobile (320px hauteur), la carte prend 500px = Scroll énorme

**Solutions:**
```css
/* À ajouter dans <style> */
#circuit-map {
    width: 100% !important;
    height: 400px !important; /* Desktop */
}

@media (max-width: 768px) {
    #circuit-map {
        height: 300px !important;
    }
}

@media (max-width: 480px) {
    #circuit-map {
        height: 200px !important;
    }
}

@media (max-height: 600px) {
    #circuit-map {
        height: 150px !important;
    }
}
```

**Priorité:** 🟠 **HAUTE**

---

### 3. **⚠️ MODAL CIRCUIT TRACKER - NON OPTIMISÉE MOBILE**

**Problèmes identifiés:**
- Modal `display: grid; grid-template-columns: 1fr 350px` = Colonnes fixes
- Sur mobile 320px : carte prend 320px - 350px = **IMPOSSIBLE**
- Panel de contrôle 350px trop large pour petit écran

**Solution:**
```css
@media (max-width: 768px) {
    #circuit-modal > div {
        grid-template-columns: 1fr 1fr !important;
        gap: 10px !important;
    }
}

@media (max-width: 480px) {
    #circuit-modal > div {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
    }
    
    /* Panel latéral passe à onglets */
    #circuit-modal [style*="350px"] {
        width: 100% !important;
        max-width: 100% !important;
    }
}
```

**Priorité:** 🟠 **HAUTE**

---

### 4. **⚠️ CONSOMMATION BATTERIE EXCESSIVE**

**Problème:** GPS + Leaflet + Affichage continu = Décharge rapide

**Solutions:**
```javascript
// 1. Ajouter Battery API
if ('getBattery' in navigator) {
    navigator.getBattery().then((battery) => {
        console.log('Battery:', battery.level);
        
        // Réduire la fréquence GPS si batterie faible
        if (battery.level < 0.20) {
            timeout = 10000; // Augmenter le timeout à 10s
        }
        
        battery.addEventListener('levelchange', () => {
            if (battery.level < 0.10) {
                pauseTracking(); // Auto-pause si critique
            }
        });
    });
}

// 2. Réduire les anims quand batterie faible
if (navigator.deviceStorage?.freeSpace || battery?.level < 0.20) {
    document.documentElement.style.cssText += 'animation: none !important; transition: none !important;';
}
```

**Priorité:** 🟠 **MOYENNE**

---

### 5. **⚠️ ORIENTATION - PORTRAIT UNIQUEMENT**

**Problème:** 
```json
"orientation": "portrait-primary"
```
Verrouille l'app en portrait = Inconfortable en terrain

**Solution:** Autoriser landscape
```json
"orientation": "any",
```

**Priorité:** 🟡 **MOYENNE**

---

### 6. **⚠️ TAILLE MINIMALE BOUTONS** (Accessibilité)

**Standard:** Minimum 44x44px pour doigt (WCAG AAA)  
**Vérification manuelle requise:** Certains boutons pourraient être < 44px

**Solution:**
```css
button, input[type="button"], input[type="submit"] {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 16px; /* Augmenté */
}

button:active {
    transform: scale(0.98); /* Feedback tactile */
}
```

**Priorité:** 🟡 **MOYENNE**

---

### 7. **❌ PAS D'AFFICHAGE DE LA QUALITÉ GPS**

**Problème:** Utilisateur ne sait pas si le GPS est bon (3m vs 50m de précision)

**Solution:**
```javascript
// Montrer la précision GPS
document.getElementById('circuit-accuracy').textContent = 
    position.coords.accuracy.toFixed(1) + 'm';

// Changer couleur si précision faible
if (position.coords.accuracy > 20) {
    marker.setIcon(redIcon); // Mauvaise précision
} else if (position.coords.accuracy > 10) {
    marker.setIcon(orangeIcon); // Moyenne
} else {
    marker.setIcon(greenIcon); // Bonne
}
```

**Priorité:** 🟡 **MOYENNE**

---

### 8. **⚠️ FORM INPUT - PAS D'OPTIMISATION MOBILE**

**Problèmes:**
- Pas de `inputmode` sur les inputs
- Pas de `autocomplete` pour les champs
- Pas de masques de saisie (ex: phone)

**Solutions:**
```html
<!-- Géolocalisation -->
<input type="number" id="latitude" inputmode="decimal">

<!-- Téléphone (si applicable) -->
<input type="tel" inputmode="tel" placeholder="Tel">

<!-- Email -->
<input type="email" inputmode="email">

<!-- Auto-complete -->
<input type="text" autocomplete="street-address" id="adresse">
<input type="text" autocomplete="email" id="email">
```

**Priorité:** 🟡 **MOYENNE**

---

### 9. **⚠️ PERFORMANCE LEAFLET**

**Problème:** Leaflet.js (130KB) + 4 basemaps = Lent sur 3G

**Solutions:**
```javascript
// 1. Lazy-load la carte
let circuitMapInitialized = false;
document.getElementById('circuit-modal').addEventListener('show', () => {
    if (!circuitMapInitialized) {
        initCircuitMap(); // Charger uniquement si modal ouverte
    }
});

// 2. Réduire les tuiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17, // Réduire au lieu de 19
    minZoom: 10
}).addTo(map);

// 3. WebWorker pour les calculs géométriques
```

**Priorité:** 🟡 **MOYENNE**

---

### 10. **⚠️ GÉRER L'ÉCRAN NOIR (MISE EN VEILLE)**

**Problème:** GPS s'arrête si l'écran s'éteint

**Solution:** Request Screen Wake Lock
```javascript
if ('wakeLock' in navigator) {
    document.getElementById('btn-demarrer-circuit').addEventListener('click', async () => {
        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            console.log('✅ Écran restera allumé');
            
            wakeLock.addEventListener('release', () => {
                console.log('❌ Wake lock libéré');
            });
        } catch (err) {
            console.log('❌ Wake Lock non supporté:', err);
        }
    });
}
```

**Navigateurs supportés:** Chrome, Edge, Android (pas iOS)

**Priorité:** 🟡 **MOYENNE**

---

## 📋 CHECKLIST D'OPTIMISATION

### CRITIQUES (À faire d'urgence)
- [ ] Ajouter Service Worker pour mode offline
- [ ] Adapter hauteur circuit-map par breakpoint
- [ ] Tester sur vrais appareils (iPhone 6, Samsung S10, Pixel 4)

### HAUTES PRIORITÉS
- [ ] Optimiser layout modal circuit (1 colonne mobile)
- [ ] Tester tailles boutons (44x44px min)
- [ ] Vérifier inputs avec clavier mobile

### MOYENNES PRIORITÉS
- [ ] Battery API pour avertir utilisateur
- [ ] Autoriser orientation landscape
- [ ] Afficher qualité GPS en temps réel
- [ ] Wake Lock pour tracking prolongé
- [ ] Lazy-load Leaflet

### AGRÉABLES À AVOIR
- [ ] Ajouter vibration (haptics)
- [ ] Notifications push (offline messages)
- [ ] Darkmode basé sur device

---

## 🧪 TESTS REQUIS

### Appareils
- [ ] iPhone 6s (4.7") - petit écran
- [ ] iPhone 12 mini (5.4") - très petit
- [ ] Samsung S10 (6.1") - Android
- [ ] Xiaomi ou équivalent budget (6"+ écran, 2GB RAM)
- [ ] Tablet (iPad 7e, Samsung Tab)

### Scénarios
- [ ] GPS sans connexion internet
- [ ] Batterie à 10%
- [ ] Écran en veille pendant tracking
- [ ] Passage portrait → landscape
- [ ] Forme sur mauvaise connection (3G)
- [ ] Zoom sur circuit-map

### Tools
```bash
# Lighthouse mobile
chrome://settings/reset  # DevTools > Lighthouse

# Throttling: Slow 4G
# CPU Throttling: 4x

# Battery Saver activé
```

---

## 📱 RECOMMANDATIONS PAR APPAREIL

### iPhone (iOS)
- ✅ Bon support PWA depuis iOS 13
- ⚠️ Wake Lock pas supporté
- ✅ Portrait + Landscape supportés
- ⚠️ Battery API pas standard

### Android
- ✅ Excellent support PWA
- ✅ Wake Lock supporté
- ✅ Battery API disponible
- ✅ Peut s'installer en natif

### Navigateurs recommandés
1. **Chrome/Chromium** - Meilleur support PWA
2. **Firefox** - Très bon support
3. **Safari** - Support partiel (iOS important!)
4. **Samsung Internet** - Excellent sur Samsung

---

## 🔧 IMPLÉMENTATIONS RECOMMANDÉES

### **Priorité 1: Service Worker**
```
Duration: 4-6 heures
Impact: CRITIQUE - App inutile sans
```

### **Priorité 2: Circuit Tracker Mobile**
```
Duration: 2-3 heures
Impact: HAUTE - UX brisée sur petit mobile
```

### **Priorité 3: Battery & Wake Lock**
```
Duration: 2 heures
Impact: MOYENNE - Améliore UX terrain
```

---

## ✅ POINTS POSITIFS À MAINTENIR

✅ Configuration viewport excellente  
✅ Media queries implémentées  
✅ Manifest.json correct  
✅ GPS/Tracking solide  
✅ Touch-friendly  
✅ Animations fluides  

---

## 📞 CONTACT & SUIVI

**Prochaine audit:** Post-implémentation Service Worker  
**Envergure:** Moyenne (1-2 jours de travail)  
**Criticité:** HAUTE (Application de terrain)  

---

**Généré le:** 19 février 2026  
**Auditeur:** GitHub Copilot  
**Version app:** 2.1.0
