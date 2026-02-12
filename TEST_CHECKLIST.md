✅ CHECKLIST PWA SENELEC - DIMENSIONNEMENT CARTOGRAPHIQUE
========================================================

Date: 12 Février 2026
Version: 1.0

## 📋 PRÉ-DÉPLOIEMENT

### Infrastructure
- [ ] Domaine configuré avec HTTPS valide
- [ ] Certificat SSL/TLS non expiré
- [ ] Serveur support les en-têtes nécessaires (mod_headers, mod_rewrite)
- [ ] Compression GZIP activée
- [ ] CORS configuré (si nécessaire)

### Fichiers PWA
- [ ] manifest.json présent et valide
  - [ ] Icônes 192x192 et 512x512 accessibles
  - [ ] start_url correct
  - [ ] display: "standalone"
  
- [ ] sw.js présent et enregistrable
  - [ ] Cache names différents des versions précédentes
  - [ ] CORS headers configurés
  
- [ ] index.html (Dimensionnement.html)
  - [ ] <meta name="manifest"> présent
  - [ ] Meta tags Apple iOS présent
  - [ ] Service Worker registration code présent
  - [ ] Pas d'erreurs 404 pour fichiers statiques

### Performance
- [ ] Lighthouse score > 90 (PWA audit)
- [ ] First Contentful Paint < 3s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s

### Sécurité
- [ ] HTTPS obligatoire
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] Referrer-Policy configurée
- [ ] CSP headers optionnels mais recommandé

---

## 🧪 TEST D'INSTALLATION

### Chrome/Edge Desktop
- [ ] Prompt "Installer l'application" apparaît
- [ ] Installation succès → App dans menu Démarrer
- [ ] Raccourci clavier: Win+Maj+S ou accès bureau
- [ ] Lancement mode "standalone"

### Android Chrome
- [ ] Prompt installation s'affiche
- [ ] Installation → Icône sur l'écran d'accueil
- [ ] Lancement en mode fullscreen
- [ ] Pas de barre d'adresse visible

### iOS Safari
- [ ] Bouton partage (↗️) fonctionnel
- [ ] "Sur l'écran d'accueil" disponible
- [ ] Installation → Icône app native
- [ ] Icône correcte (192x192 converted)

### Firefox
- [ ] Prompt "Ajouter à mon écran d'accueil" visible
- [ ] Installation succès (Linux/Windows)
- [ ] iOS: Installation via menu ou partage

---

## 🗺️ TEST CARTOGRAPHIQUE

### Initialisation Carte
- [ ] Leaflet charge correctement
- [ ] OpenStreetMap tuiles visibles
- [ ] Marqueur Ziguinchor affiche
- [ ] Pas de latence visuelle

### Zoom & Pan
- [ ] Zoom in/out fonctionne (+ -)
- [ ] Scroll zoom sur desktop fonctionne
- [ ] Pinch zoom sur mobile fonctionne
- [ ] Déplacement (drag) fonctionne
- [ ] Controls visuels corrects (couleur SENELEC)

### Réactivité Mobile
- [ ] Hauteur carte: 250px sur mobile (< 480px)
- [ ] Hauteur carte: 300px sur tablette (< 768px)
- [ ] Hauteur carte: 400px sur desktop
- [ ] Pas de débordement horizontal
- [ ] Touch events non-clikkés accidentellement

---

## 📡 TEST GÉOLOCALISATION

### Permissions
- [ ] 1ère demande: Prompt permission s'affiche
- [ ] Autorisation persistée (pas re-demandée)
- [ ] Refusal → message d'erreur approprié

### Fonction GPS
- [ ] Bouton "Obtenir Position GPS" clickable
- [ ] Status "Recherche..." affiche
- [ ] Position obtenue dans 10 secondes
- [ ] Latitude/Longitude affichées (6 décimales)
- [ ] Précision: ±X mètres correct
- [ ] Altitude affichée (si disponible)

### Conversion UTM
- [ ] Coordonnées X (Easting) auto-remplies
- [ ] Coordonnées Y (Northing) auto-remplies
- [ ] Valleurs correctes (Sénégal: Zone 28N)
  - X entre 200000-850000
  - Y entre 1400000-1600000

### Marqueur Carte
- [ ] Cercle bleu apparaît à la position
- [ ] Popup info détaillée s'affiche
  - [ ] Latitude/Longitude
  - [ ] Précision
  - [ ] Altitude
  - [ ] Vitesse
  - [ ] Cap (heading)
- [ ] Carte centrée avec zoom 17

### Suivi Continu
- [ ] watchPosition se réactive toutes les 10s
- [ ] Position mise à jour si déplacement
- [ ] Pas de crash navigateur

---

## 📸 TEST CAMÉRA

### Accès Caméra
- [ ] Bouton "Démarrer Caméra" actif
- [ ] Permission caméra demandée (1ère fois)
- [ ] Stream caméra affiché dans video element
- [ ] Sur mobile: caméra arrière (facingMode: 'environment')

### Capture Photo
- [ ] Bouton "Capturer Photo" clickable
- [ ] Photo sauvegardée en Base64
- [ ] Aperçu image affichée
- [ ] Image incluse dans export Excel

### Arrêt Caméra
- [ ] Bouton "Arrêter" arrête le stream
- [ ] Permission pas re-demandée
- [ ] Ressources libérées (pas de lag batterie)

### Performance
- [ ] Pas de freeze UI pendant capture
- [ ] Photo < 500KB compressée
- [ ] Pas d'erreur memory sur 10+ captures

---

## 💾 TEST EXPORT DONNÉES

### Export Excel
- [ ] Bouton "📊 Excel (avec image)" present
- [ ] Clic → Téléchargement .xlsx
- [ ] Filename: SENELEC_Collecte_TIMESTAMP.xlsx
- [ ] Fichier ouvrable dans Excel/Calc
- [ ] Données correctes dans colonnes
- [ ] Image intégrée si photo capturée

### Export JSON
- [ ] Bouton "📥 Exporter JSON" present
- [ ] Clic → Téléchargement .json
- [ ] Données structure valide
- [ ] Base64 image incluse si présente

### Impression
- [ ] Bouton "🖨️ Imprimer" déclenche Ctrl+P
- [ ] Format page correct
- [ ] Image s'affiche en impression

### Résumé Données  
- [ ] Section "Résumé Collectées" s'affiche
- [ ] Tous les champs affichés:
  - [ ] Région, Département, Commune
  - [ ] Site, Adresse
  - [ ] Coordonnées GPS + UTM
  - [ ] Infrastructure (bacs, caisses)
  - [ ] Accessibilité
  - [ ] Observations

---

## 🌐 TEST OFFLINE MODE

### Détection Connectivité
- [ ] Online → "✅ Connecté à internet" (alert)
- [ ] Offline → "📵 Mode hors ligne..." (alert)
- [ ] Transitions smooth (max 2s)

### Fonctionnement Offline
- [ ] Formulaires restent remplissables
- [ ] Cartes tuiles cachées affichées (pas grises)
- [ ] GPS fonctionne (ne dépend pas réseau)
- [ ] Caméra fonctionne (locale)

### Simulation Offline
1. Chrome DevTools → Network → Offline
2. Ou: DevTools → Service Workers → Offline (checkbox)
3. Ou: iOS → Mode Avion ON

Tests offline:
- [ ] Navigation interface OK
- [ ] Remplissage formulaire OK
- [ ] Export données OK (JSON/Excel)
- [ ] Tuiles carte visibles
- [ ] Pas d'erreur console

### Sync Reconnection
- [ ] Basculer online → "🌐 Connexion rétablie"
- [ ] Données prêtes pour export
- [ ] Pas de perte données

---

## 💾 TEST CACHE & STOCKAGE

### Cache Service Worker
- [ ] manifest.json en cache (no-cache headers)
- [ ] sw.js en cache (no-cache headers)
- [ ] Leaflet JS/CSS en cache
- [ ] Tuiles OSM en cache (après zoom 15+)

### Taille Cache
- [ ] Estimation stockage disponible > 50MB
- [ ] Cache utilisé < Quota max
- [ ] Pas de erreurs quota

### Nettoyage Cache
- [ ] Bouton "Nettoyer Cache" fonctionne (si présent)
- [ ] SW reçoit message CLEAR_CACHE
- [ ] Cache vide confirmé
- [ ] App re-telécharge les ressources

### Storage API
- [ ] navigator.storage.estimate() fonctionne
- [ ] Logs affichent %usage correct
- [ ] Pas de dépassement quota

---

## 🔔 TEST NOTIFICATIONS (Optionnel)

- [ ] Notification permission demandée
- [ ] Push notifications reçues (si implémenté)
- [ ] Clic notification ouvre app
- [ ] Notification disparaît après 5s

---

## 📱 TEST RESPONSIVE DESIGN

### Mobile (< 480px)
- [ ] Layout une colonne
- [ ] Boutons largeur 100%
- [ ] Texte lisible (min 12px)
- [ ] Images scaled correctement
- [ ] Pas de débordement horizontal
- [ ] Safe area (notch) respectée

### Tablette (480px - 768px)
- [ ] Layout adapté
- [ ] Espacements corrects
- [ ] Carte hauteur 300px

### Desktop (> 768px)
- [ ] Layout deux colonnes
- [ ] Carte hauteur 400px
- [ ] Tous les éléments visibles

### Orientation
- [ ] Portrait: Tests réussis
- [ ] Landscape: Layout reflow correct
- [ ] Pas de crash rotation

### Écrans spéciaux
- [ ] iPhone notch: Safe area padding OK
- [ ] Samsung fold: Layout adaptée
- [ ] Très petits écrans (320px): Lisible

---

## ⚡ TEST PERFORMANCE

### Lighthouse (Chrome DevTools)
```
Exécuter: F12 → Lighthouse → Generate report
```

Cibles:
- Performance: ≥ 90
- Accessibility: ≥ 85
- Best Practices: ≥ 90
- SEO: ≥ 90
- PWA: ≥ 90

### Vitesse Chargement
- [ ] 1ère charge: < 5s
- [ ] 2ème charge (cache): < 1s
- [ ] 3ème charge: < 500ms
- [ ] Offline: < 100ms

### Profiling CPU
DevTools → Performance → Record
- [ ] Pas de long tasks (> 50ms)
- [ ] FCP < 2.5s
- [ ] LCP < 2.5s
- [ ] TTI < 3.5s

### Memory Usage
- [ ] Pas de memory leak
- [ ] Cache size stable
- [ ] Pas de croissance après 10 cycles

---

## 🔒 TEST SÉCURITÉ

### HTTPS/SSL
- [ ] URL commence par https://
- [ ] Certificat valide (pas d'avertissement)
- [ ] Certificat chaîne valid
- [ ] Support TLS 1.2+

### Headers
Vérifier via DevTools → Network → Response Headers:
- [ ] Service-Worker-Allowed: /
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] Cache-Control approprié par ressource

### Content Security Policy (si implémenté)
- [ ] CSP headers présents
- [ ] Pas de violations CSP (DevTools console)
- [ ] Inline scripts strictement contrôlés

### XSS Protection
- [ ] Pas d'injection de code possible
- [ ] Form inputs sanitizés
- [ ] localStorage/IndexedDB sécurisés

### CORS
- [ ] CDN requests OK
- [ ] Pas d'erreurs CORS (console)
- [ ] headers CORS corrects

---

## 📊 TEST DONNÉES DE TEST

### Collecte Minimale
```
Region: Sénégal
Département: Ziguinchor
Commune: Ziguinchor
Site: Agence principal de Ziguinchor
Adresse: Rue de l'indépendance
Coordonnées GPS: 13.1939, -15.5277
Coordonnées UTM: 634568E, 1457834N
Bacs 240L: 2
Caisse Polybene: 1
Bacs 660L: 1
Accessibilité: Facile
```

- [ ] Données remplissables
- [ ] Export OK
- [ ] Données conservées en offline

### Export Test
- [ ] Excel généré correctement
- [ ] JSON valide structure
- [ ] Impression format OK

---

## 🐛 DÉBOGAGE

### Console Erreurs
```
Ouvrir: F12 → Console
Lancer: window.SENELEC.afficherDiagnosticPWA()
```

- [ ] Aucune erreur rouge
- [ ] Warnings acceptables seulement
- [ ] Logs SW: "✅ Service Worker enregistré"

### Application Tab (DevTools)
- [ ] Manifest: Status ✅
- [ ] Service Workers: Active ✅, Registered ✅
- [ ] Storage: LocalStorage OK, Cache OK

### Network Tab
- [ ] sw.js: Status 200, Cache policy
- [ ] manifest.json: Status 200
- [ ] Tuiles OSM: Status 200 (cached après)
- [ ] Pas de 404 errors

---

## 📋 CHECKLIST FINAL

### Avant Production
- [ ] Tous tests passés
- [ ] Pas de erreurs critique
- [ ] Performance OK (Lighthouse > 90)
- [ ] Sécurité: HTTPS, headers, CSP OK
- [ ] Offline mode confirmé
- [ ] Geolocalisation testée (en extérieur)
- [ ] Export données fonctionnel
- [ ] Documentation complète

### Déploiement  
- [ ] Fichiers uploadés sur serveur
- [ ] Permissions fichiers correctes (755)
- [ ] HTTPS certificat renouvelé
- [ ] DNS propagé
- [ ] Monitoring configuré

### Post-Déploiement
- [ ] Vérifier URL fonctionnelle
- [ ] Test installation PWA OK
- [ ] Lighthouse audit re-run
- [ ] Monitoring: Pas d'erreurs
- [ ] Users: Collecte de compat reports

---

## 📞 CONTACTS RÉFÉRENCE

- **Leaflet Docs:** https://leafletjs.com/reference.html
- **MDN PWA:** https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps
- **Chrome DevTools:** https://developer.chrome.com/docs/devtools/
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse
- **Can I Use:** https://caniuse.com/ (compatibilité features)

---

**Test Date:** ________________
**Tester Name:** _____________
**Result:** ✅ PASS / ❌ FAIL
**Notes:** _____________________

Signature + Date: _____________

---

© 2026 SENELEC - Dimensionnement Cartographique PWA
