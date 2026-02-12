# 📱 SENELEC - Application Cartographique PWA

## Vue d'ensemble

Application Progressive Web App (PWA) pour la collecte de données géographiques de dimensionnement des sites SENELEC avec support cartographique hors ligne.

### ✨ Fonctionnalités principales

- **📍 Carte Interactive** - Leaflet avec cartes OpenStreetMap
- **🗺️ Cache Offline** - Tuiles de carte mises en cache automatiquement
- **📲 Installation** - Installable sur mobile comme une app native
- **🌐 Fonctionnement Hors Ligne** - Accès aux données et tuiles cachées
- **📡 Géolocalisation GPS** - Localisation avec haute précision
- **🛰️ Conversion UTM** - Transformation automatique Lat/Lon → UTM
- **📸 Capture Photo** - Caméra intégrée pour les sites
- **📊 Export Excel** - Génération de rapports
- **🔄 Synchronisation** - Sync automatique des données quand reconnecté

---

## 📋 Installation

### Sur Desktop (Chrome, Edge, Firefox)
1. Ouvrez le site dans un navigateur moderne
2. Cliquez sur le prompt **"📲 Installer l'application SENELEC"**
3. Confirmez l'installation
4. L'application s'ajoute au menu Démarrer et à l'écran d'accueil

### Sur Mobile (Android)
1. Ouvrez Chrome/Firefox
2. Rendez-vous sur le site
3. Appuyez sur le menu (⋮) → **"Installer l'application"**
4. L'app apparaît sur l'écran d'accueil

### Sur iOS (iPhone/iPad)
1. Ouvrez Safari
2. Rendez-vous sur le site
3. Appuyez sur le bouton de partage (↗️)
4. Sélectionnez **"Sur l'écran d'accueil"**
5. L'app s'ajoute à l'écran d'accueil

---

## 🚀 Guide d'utilisation

### 1. Géolocalisation GPS 📡

```
Panel "Localisation et Images" → Obtenir Position GPS

Caractéristiques:
- Haute précision (±quelques mètres)
- Suivi continu de la position
- Affichage de l'altitude et de la vitesse
```

**Conversion Automatique:**
- Coordonnées GPS (Latitude/Longitude) → **UTM (Easting/Northing)**
- Les coordonnées UTM s'affichent automatiquement dans le formulaire

### 2. Carte Interactive 🗺️

```
- Zoom: Roulette souris / pincement (mobile)
- Déplacement: Clic + glisser
- Marqueur: Votre position actuelle s'affiche automatiquement
```

**Offline Mode:**
- Les tuiles téléchargées restent accessibles hors ligne
- L'app bascule automatiquement au cache hors ligne si pas de connexion

### 3. Capture d'Images 📸

```
1. Cliquez "Démarrer Caméra"
2. Accordez les permissions d'accès (premier lancement)
3. Cliquez "Capturer Photo"
4. L'image est incorporée aux données exportées
```

### 4. Collecte de Données 📝

Remplissez le formulaire avec:
- **Région, Département, Commune**
- **Site concerné** (liste pré-remplie par département)
- **Adresse et Localisation UTM** (auto-remplie via GPS)
- **Infrastructure** (Personnel, dispositifs, bacs, etc.)
- **Accessibilité** (Facile/Difficile/Route type)
- **Observations** supplémentaires

### 5. Export Données 💾

Trois options d'export:

```
📊 Excel (avec image)
   - Rapport complet avec photo intégrée
   - Format: .xlsx compatible Office

📥 JSON
   - Export brut des données collectées
   - Idéal pour traitement automatisé

🖨️ Imprimer
   - Version PDF/impression directe
```

---

## 🔧 Architecture Technique

### Fichiers PWA

#### **manifest.json**
```json
{
  "name": "Dimensionnement SENELEC",
  "short_name": "SENELEC Map",
  "start_url": "/index.html",
  "display": "standalone",
  "icons": [...]
}
```
Définit l'apparence, le nom, les icônes de l'application.

#### **sw.js** (Service Worker)
Gère le cache avec stratégie intelligente:

| Ressource | Stratégie | Description |
|-----------|-----------|-------------|
| Tuiles OSM | Cache-First | Utilise le cache, fallback réseau |
| CDN (Leaflet) | Cache + Network | Fallback cache si CDN indisponible |
| Autres | Network-First | Préfère réseau, fallback cache |

#### **index.html**
- Meta tags PWA complets
- Service Worker registration
- Code géolocalisation GPS
- Interfaces utilisateur responsive

### Architecture de Cache

```
CACHE_NAME              (Ressources statiques)
├── leaflet CSS/JS
├── manifest.json
└── index.html

TILE_CACHE             (Tuiles OpenStreetMap)
├── z/x/y.png (niveau zoom 13-19)
└── ...

DYNAMIC_CACHE          (Ressources dynamiques)
└── Données utilisateur
```

**Taille Cache:** Estimation automatique via Storage API
- Limite système: Généralement 50% de l'espace disponible
- Peut être nettoyé via "Nettoyer le Cache"

---

## 🌐 Fonctionnement Hors Ligne

### Détection Automatique

L'app détecte l'état réseau:
```javascript
// Connecté
Online ✅ → Sync données et télécharge tuiles

// Déconnecté  
Offline 📵 → Mode lecture-seule des données cachées
```

### Synchronisation des Données

1. **Online mode:**
   - Export Excel live vers serveur (si connecté)
   - Tuiles OSM téléchargées et cachées

2. **Offline mode:**
   - Données sauvegardées localement (IndexedDB)
   - Tuiles cachées restent accessibles
   - Sync automatique au reconnexion

---

## 🎯 Spécifications GPS & Conversion

### Localisation GPS
- **Haute Précision:** Options `enableHighAccuracy: true`
- **Timeout:** 10 secondes
- **Latitude/Longitude:** 6 décimales
- **Altitude:** Si disponible
- **Heading/Bearing:** Direction de déplacement
- **Vitesse:** Convertie en km/h

### Système de Coordonnées

**WGS84 (GPS) ↔ UTM (Terrain)**

```
Lat: 13.1939°N
Lon: -15.5277°W
    ↓ (Conversion)
UTM Zone 28N
Easting: 634568.23 m
Northing: 1457834.56 m
```

**Utilité pour SENELEC:**
- Cartes imprimées utilisent UTM
- Coordonnées précises pour relevés terrain
- Compatible systèmes GPS Garmin/Trimble industriels

---

## 💾 Stockage Local

### Données Conservées Offline

```
localStorage
├── donnees.json (Arborescence collecte)
├── photos (Base64 encoded)
└── metadata

IndexedDB (Cache Service Worker)
├── tuiles OSM (z/x/y.png)
└── manifests
```

### Nettoyage Cache

```javascript
// Via interface
Paramètres → Nettoyer le Cache

// Via console
localStorage.clear()
caches.delete('senelec-map-*')
```

---

## 🔒 Sécurité & Confidentialité

### Données Collectées

- ✅ Localisées: `localStorage` (navigateur uniquement)
- ✅ Aucun envoi automatique de GPS
- ✅ Consentement explicite requis
- ✅ Données supprimables

### Permissions Requises

1. **Géolocalisation:** Demandée au premier usage
2. **Caméra:** Demandée lors de capturation photo
3. **Stockage:** Transparent (Service Worker)

---

## 📈 Performance

### Optimisations Mobile

| Aspect | Optimisation |
|--------|-------------|
| **CSS** | Media queries pour écrans < 768px |
| **Carte** | Hauteur réduite (250-300px mobile) |
| **Zoom** | Désactivé par défaut sur mobile |
| **Safe Area** | Support iPhone notch/encoche |
| **Bundle** | Minifié, CDN distant |

### Temps de Chargement

- **1ère visite:** ~2-3s (télécharge et cache)
- **2ème visite:** <500ms (depuis cache)
- **Offline:** Immédiat (tout en cache)

---

## 🐛 Dépannage

### Le site ne s'installe pas?

**Problèmes courants:**
```
❌ HTTPS requis
   Solution: Utiliser HTTPS ou localhost:5000

❌ Manifest.json non trouvé
   Solution: Vérifier certificat SSL + en-têtes CORS

❌ Prompt n'apparaît pas
   Solution: Accepter prompt une fois → Réessayer 3 jours après
```

### Pas de localisation GPS?

```
✓ Vérifier les permissions navigateur
✓ Attendre 10 secondes (haute précision)
✓ Aller dehors (signal GPS meilleur)
✓ Mode avion OFF
✓ Localisation Active dans paramètres
```

### Cache plein?

```javascript
// Vérifier taille
navigator.storage.estimate().then(est => {
  console.log(est.usage / est.quota * 100) // % utilisé
})

// Nettoyer
→ Paramètres → Nettoyer le Cache
```

---

## 📚 Ressources

### Technologie

- **Leaflet:** https://leafletjs.com/ (Cartographie)
- **OpenStreetMap:** https://www.openstreetmap.org/ (Données géo)
- **Service Worker API:** MDN Web Docs
- **PWA Baseline:** https://www.pwastats.com/

### Documentation API

```javascript
// Géolocalisation
navigator.geolocation.watchPosition(success, error, options)

// Service Worker
navigator.serviceWorker.register('./sw.js')

// Storage API
navigator.storage.estimate()
caches.open('cache-name')
```

---

## 📞 Support

Pour les problèmes ou questions:

1. **Vérifier la console** (F12 → Console)
2. **Effacer le cache** (Ctrl+Shift+Del)
3. **Relancer l'app** (Fermer complètement puis rouvrir)
4. **Rapport technique:** Copier logs de console

---

## 📄 Changelog PWA

### v1.0 - 2026-02-12

✅ **Ajouts:**
- Service Worker avec stratégie cache intelligente
- Manifest.json complet pour installation PWA
- Géolocalisation haute précision avec conversion UTM
- CSS mobile optimisé (Responsive design)
- Prompt d'installation personnalisé
- Détection automatique online/offline
- Information taille cache

✅ **Améliorations:**
- Marqueur géolocalisation avec info détaillées
- Tuiles OSM cachées automatiquement
- Export de base de données locale
- Support iPhone notch/safe area

---

## 📅 Calendrier Déploiement

- **12 Février:** Ziguinchor (5 sites)
- **13-14 Février:** Bignona (4 sites)
- **15 Février:** Oussouye (2 sites)

---

**© 2026 SENELEC - Application de Dimensionnement Cartographique**
