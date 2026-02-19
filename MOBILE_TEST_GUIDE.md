# 📱 GUIDE TEST MOBILE - SONAGED MAP v2.1

## ✅ OPTIMISATIONS APPLIQUÉES

### 1. **Service Worker pour Mode Offline** ✅
- Fichier créé: `service-worker.js`
- Cache des ressources essentielles + librairies
- Stratégie: Network First pour API, Cache First pour assets
- **Enregistrement:** Automatique au chargement

### 2. **Responsive Circuit Tracker** ✅
- **Desktop (>768px):** Carte 500px
- **Tablette (768px):** Carte 350px + 2 colonnes
- **Mobile (480px):** Carte 200px + 1 colonne
- **Paysage (height<600px):** Carte 150px

### 3. **Battery & Screen Wake Lock** ✅
- Détecte batterie faible (<20%)
- Maintient écran allumé pendant tracking
- Auto-pause si batterie critique (<5%)

### 4. **GPS Qualité Indicateur** ✅
- Affiche précision en temps réel
- 🟢 **Bon:** <10m (vert)
- 🟡 **Moyen:** 10-20m (orange)
- 🔴 **Faible:** >20m (rouge)

### 5. **Optimisation Boutons** ✅
- Minimum 44x44px (WCAG AAA)
- Padding augmenté: 12px 16px
- Feedback tactile: scale(0.98) au clic
- Font augmentée sur mobile

### 6. **Support Safe Area (Notch)** ✅
- Détecte les encoches iPhone X/12/13
- Padding ajusté automatiquement

---

## 🧪 PLAN DE TEST

### Phase 1: Test Responsive (Bureau)
```
Outils: DevTools Chrome > Device Toggle
Raccourci: F12 ou Cmd+Opt+I
```

#### Breakpoints à tester:
- [ ] iPhone 12 mini (375px)
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] Galaxy S10 (360px)
- [ ] Pixel 5 (393px)
- [ ] iPad (768px)
- [ ] Paysage sur petit mobile (360x640 landscape)

**Instructions:**
1. Ouvrir DevTools (F12)
2. Cliquer "Toggle device toolbar" (Ctrl+Shift+M)
3. Sélectionner chaque appareil
4. **Tester:**
   - [ ] Formulaire scrolle bien
   - [ ] Boutons sont cliquables
   - [ ] Carte s'affiche correctement
   - [ ] Modal ferme bien

---

### Phase 2: Test Desktop Throttling (Bureau)
```
DevTools > Network tab > Throttling = Slow 4G
DevTools > Performance > CPU throttling = 4x
```

**Scénarios:**
- [ ] Carte charge en <3s (Slow 4G)
- [ ] Survit à throttling CPU 4x
- [ ] GPS reste réactif même ralenti

---

### Phase 3: Test Mobile Réel (Smartphones)

#### Appareils recommandés:
```
Minimum:
- iPhone 6s (iOS 13+)
- Samsung Galaxy S9+ (Android 9+)

Optimal:
- iPhone 12 mini (iOS 14+) - Petit écran
- Pixel 5 (Android 12+) - Large écran
```

#### CheckList par appareil:
- [ ] Application s'installe (Ajouter à l'écran d'accueil)
- [ ] Mode fullscreen sans navigateur
- [ ] Icône correcte sur accueil
- [ ] Formulaire scrolle fluide
- [ ] GPS fonctionne (permet géolocalisation)
- [ ] Carte Leaflet charge
- [ ] Circuit tracker s'ouvre (Tap sur Collecte/Balayage)
- [ ] Démarrage tracking lance le GPS
- [ ] Position GPS affichée en temps réel
- [ ] Batterie affichée si disponible
- [ ] Export Shapefile fonctionne
- [ ] Pas de lag lors du scroll

---

### Phase 4: Test Batterie

#### Configuration:
```
Appareil: Smartphone avec batterie faible
Batterie: 20% / 10% / 5%
```

**Scénarios:**
- [ ] @20% = Alert "Batterie faible"
- [ ] @10% = Suggère branchement
- [ ] @5% = Auto-pause tracking
- [ ] Wake Lock maintient écran allumé

**Commande debug (Chrome DevTools):**
```javascript
// Simuler batterie faible
navigator.getBattery().then(battery => {
    console.log('Level:', battery.level * 100 + '%');
});
```

---

### Phase 5: Test Offline Mode

#### Étapes:
1. Ouvrir application sur mobile
2. Laisser charger complètement
3. Activer mode Avion
4. Recharger page (F5)
5. Vérifier que l'app reste accessible

**Attendu:**
```
✅ Page charge (depuis cache)
✅ Formulaire accessible
❌ API échoue gracefully
```

---

### Phase 6: Test GPS (Sur le Terrain)

#### Lieu: Parc, Rue, Terrain dégagé
```
Conditions: Ciel dégagé (pas en intérieur)
Durée: 10 minutes minimum
```

**Procédure:**
1. Ouvrir l'application
2. Aller à Collecte/Balayage → Modal Circuit
3. Attendre 30s stabilisation GPS
4. Cliquer "Démarrer"
5. Se déplacer en marchant (100-200m)
6. Observer la trace sur la carte
7. Vérifier la précision GPS

**Attentes:**
```
Précision GPS:
- Zone dégagée (côté rue): < 10m ✓
- Zone urbaine (entre bâtiments): 10-30m ✓
- Intérieur: > 50m ✗
```

---

### Phase 7: Test Formulaire Complet

#### Scénario:
Remplir un formulaire complet jusqu'à l'export

**Étapes:**
1. [ ] Sélectionner Région
2. [ ] Sélectionner Département
3. [ ] Sélectionner Commune
4. [ ] Choisir "Collecte" → Modal ouvre
5. [ ] Lancer tracking GPS → Attendre 30s
6. [ ] Ajouter 1-2 repères
7. [ ] Terminer
8. [ ] Exporter GeoJSON
9. [ ] Vérifier fichier créé

**Points Clés:**
- [ ] Modal responsive sur petit écran
- [ ] Pas de débordement (overflow)
- [ ] Tous les boutons cliquables
- [ ] Export fonctionne

---

## 📊 COMPARAISON AVANT/APRÈS

### AVANT Optimisations
| Critère | Status | Problème |
|---------|--------|---------|
| Service Worker | ❌ Non | Offline impossible |
| Circuit Map Mobile | ⚠️ Cassé | 500px fixe = scroll énorme |
| GPS Qualité | ⚠️ Caché | Pas visible |
| Batterie | ❌ Ignorée | Drain rapide |
| Boutons | ⚠️ Petits | < 44px |
| Notches | ❌ Non | Contenu caché |

### APRÈS Optimisations
| Critère | Status | Solution |
|---------|--------|----------|
| Service Worker | ✅ Actif | Cache + Network First |
| Circuit Map Mobile | ✅ Responsive | 500px→350px→200px |
| GPS Qualité | ✅ Visible | Indicateur 3 couleurs |
| Batterie | ✅ Monitoré | Alerte + Auto-pause |
| Boutons | ✅ 48px+ | WCAG AAA |
| Notches | ✅ Supporté | Safe area CSS |

---

## 🔍 DEBUGGING ET LOGS

### Chrome DevTools (Mobile Web)
```javascript
// Voir les logs Service Worker
DevTools > Console > Application > Service Workers

// Voir le cache
DevTools > Application > Storage > Cache
```

### Logs recommandés
```javascript
// Ouvrir Console (F12)
// Taper dans la Console:

// Vérifier Service Worker
navigator.serviceWorker.getRegistrations().then(r => 
    console.log('SW:', r[0]?.active?.state)
);

// Vérifier Cache
caches.keys().then(keys => 
    console.log('Caches:', keys)
);

// Vérifier GPS capability
console.log('GPS Support:', 'geolocation' in navigator);

// Vérifier Wake Lock
console.log('Wake Lock:', 'wakeLock' in navigator);

// Simuler offline
DevTools > Network > Offline (checkbox)
```

---

## ✅ CHECKLIST FINAL DE DÉPLOIEMENT

### Avant livraison:
- [ ] Service Worker enregistré automatiquement
- [ ] Pas d'erreurs console (F12)
- [ ] Test sur 3 appareils réels
- [ ] Test offline (DevTools Offline)
- [ ] Test GPS sur le terrain
- [ ] Export Shapefile/GeoJSON fonctionne
- [ ] Batterie monitored (<20% alert)
- [ ] Circuit tracker responsive (<480px)
- [ ] Notches/Safe areas supportées
- [ ] Wake Lock maintient écran allumé

### Monitoring production:
- [ ] Vérifier logs Service Worker
- [ ] Monitorer crash lors de GPS
- [ ] Surveiller les exports Shapefile
- [ ] Tracer les erreurs API en offline

---

## 📞 RÉSOLUTION PROBLÈMES COURANTS

### ❌ Service Worker n'apparait pas
```
Solution:
1. Vérifier HTTPS activé (obligatoire)
2. DevTools > Application > Service Workers
3. Rafraichir la page (Ctrl+F5)
4. Si toujours rien: vérifier console pour erreurs
```

### ❌ GPS affiche "Erreur: Timeout"
```
Solution:
1. Attendre 30-60s pour stabilisation
2. Aller dehors (pas en intérieur)
3. Vérifier GPS activé dans paramètres téléphone
4. Autoriser permission géolocalisation
```

### ❌ Circuit Tracker déborde en largeur
```
Solution:
1. Vérifier viewport meta tag présent
2. Redimensionner fenêtre Dev Tools
3. Hard refresh (Ctrl+Shift+R)
4. Vider cache Service Worker
```

### ❌ Batterie API affiche undefined
```
Solution:
1. Battery Status API est deprecated
2. Utiliser Battery Manager alternative
3. Ou faire test sur Android seulement
```

---

## 📈 MÉTRIQUES DE SUCCÈS

Après optimisations, l'app doit:
- ✅ Charger en <2s sur 4G
- ✅ Fonctionner offline (lecture)
- ✅ Supporter GPS précis <10m
- ✅ Avoir batterie monitored
- ✅ Être responsive jusqu'à 320px
- ✅ Avoir boutons 44x44px min
- ✅ Exporter en <5s
- ✅ Pas de crash sur petit RAM (~2GB)

---

**Version:** 2.1.0  
**Date:** 19 février 2026  
**Statut:** ✅ Prêt pour test
