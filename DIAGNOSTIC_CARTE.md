# 🔍 GUIDE DE DIAGNOSTIC - Carte Leaflet Non Affichée

## Problem: "Les changements n'affichent toujours pas"

### Étapes de Diagnostic

#### **Étape 1: Vérifier que la page HTML charge**
1. Ouvrez `index.html` dans votre navigateur
2. Appuyez sur **F12** pour ouvrir la console développeur
3. Allez à l'onglet **Console**

#### **Étape 2: Exécuter le diagnostic**
Copiez ce code dans la console et appuyez sur Entrée:

```javascript
// Vérification rapide
console.log('🔍 Diagnostic rapide');
console.log('1. Leaflet:', typeof L !== 'undefined' ? '✅' : '❌');
console.log('2. Conteneur map:', document.getElementById('dimensionnement-map') ? '✅' : '❌');
console.log('3. Carte créée:', typeof landingMap !== 'undefined' && landingMap !== null ? '✅' : '❌');
console.log('4. Region_3:', typeof json_Region_3 !== 'undefined' ? '✅' : '❌');
console.log('5. Contrôles de carte:', typeof addMapControls === 'function' ? '✅' : '❌');
```

Résultats attendus:
- ✅ = Tout va bien
- ❌ = Il y a un problème

#### **Étape 3: Si le conteneur map ne s'affiche pas**

**Cause possible:** Le style CSS n'est pas appliqué

Solution:
1. Dans la console, tapez:
```javascript
document.getElementById('dimensionnement-map').style.height = '600px';
document.getElementById('dimensionnement-map').style.width = '100%';
document.getElementById('dimensionnement-map').style.border = '2px solid red';
```

2. Si la carte devrait être rouge maintenant et visible dans le rouge

#### **Étape 4: Si Leaflet n'est pas chargée**

**Cause possible:** Le navigateur n'a pas accès à CDN

Solution:
1. Vérifiez la connexion Internet
2. Actualisez la page (Ctrl+F5 ou Cmd+Shift+R)
3. Vérifiez que pas de bloqueur de contenu actif

#### **Étape 5: Si les GeoJSON ne se chargent pas**

Tapez dans la console:
```javascript
console.log('GeoJSON chargés:');
['json_Region_3', 'json_Departement_4', 'json_Arrondissement_5', 
 'json_CollecteNational_6', 'json_BalayageNational_7', 'json_MobilierUrbain_8']
.forEach(name => {
    console.log(`${name}:`, typeof window[name] !== 'undefined' ? '✅' : '❌');
});
```

Si tous sont ❌:
- Attendez 2-3 secondes et réessayez (les fichiers peuvent être en cours de chargement)
- Vérifiez que les fichiers existent: `./data/*.js`
- Utilisez le navigateur de fichiers pour vérifier les chemins

#### **Étape 6: Forcer l'initialisation manuelle**

Si rien d'autre ne fonctionne, tapez dans la console:

```javascript
// Initialiser manuellement
if (typeof initLandingMap === 'function') {
    console.log('Initialisation manuelle...');
    initLandingMap();
    setTimeout(() => addMapControls(), 500);
    console.log('✅ Initialisation forcée');
} else {
    console.error('Fonction initLandingMap non trouvée');
}
```

### Vérifications Complètes

#### **Test 1: Carte vide**
Ouvrez la page et faites défiler jusqu'à la section "Carte Géospatiale Sénégal". Vous devriez voir:
- Un conteneur gris-vert
- Les contrôles de zoom (+/-)
- Une carte OpenStreetMap background

#### **Test 2: Données visibles**
Une fois la carte chargée:
- Les régions marron devraient s'afficher
- Les boutons d'affichage/masquage en haut à droite devraient être coéchés
- Une légende devrait s'afficher en bas à droite

#### **Test 3: Interactivité**
- Cliquez sur un élément (région, département, etc.)
- Une popup devrait s'afficher
- Le zoom devrait fonctionner (+/- ou molette)

### Fichiers Importants à Vérifier

```
✓ css/map-styles.css          (CSS de la carte)
✓ js/map-enhancements.js      (Commandes avancées)
✓ js/geojson-preloader.js     (Pré-chargement GeoJSON)
✓ js/map-debug.js             (Outils de débogage)
✓ data/Region_3.js            (Données)
✓ data/Departement_4.js       (Données)
✓ ... etc
```

### Commandes Utiles en Console

```javascript
// Afficher le statut
window.mapCommands?.stats();

// Tester spécifiquement
if (typeof initLandingMap === 'function') {
    initLandingMap();
} else {
    console.error('✗ Fonction non trouvée');
}

// Vérifier les erreurs de chargement
fetch('./data/Region_3.js')
    .then(r => r.ok ? '✅ OK' : `❌ ${r.status}`)
    .then(console.log)
    .catch(e => console.error('❌', e.message));

// Afficher tous les scripts chargés
console.log(document.scripts.length, 'scripts chargés');
```

### Solutions Rapides

| Symptôme | Cause | Solution |
|----------|-------|----------|
| Conteneur blanc/gris | CSS non appliqué | Actualiser (Ctrl+F5) |
| Pas de tuiles OSM | Pas de connexion | Vérifier internet |
| Pas de données GeoJSON | Fichiers non trouvés | Vérifier `data/` |
| Pas d'interaction | JS non chargé | Ouvrir console pour erreurs |
| Très lent | Trop de données | Masquer les couches |

### Dépannage Avancé

1. **Ouvrir DevTools complètement** (F12)
2. **Aller à l'onglet Network**
3. **Actualiser la page** (Ctrl+F5)
4. **Filtrer par type:**
   - xhr (voir si le GeoJSON se charge)
   - js (vérifier les Scripts)
   - css (vérifier les Styles)

5. **Vérifier les erreurs** (onglet Console)
   - Les erreurs rouge sont graves
   - Les warnings jaunes peuvent être ignorées

### Rapport de Diagnostic

Si vous devez signaler un problème, la console devrait montrer:

```
✅ Leaflet chargée
✅ Conteneur trouvé
✅ Carte créée
✅ GeoJSON chargés
✅ Contrôles ajoutés
✅ Pas d'erreurs rouge
```

Si vous voyez une ou plusieurs ❌ ou erreur rouge, partagez le message d'erreur exact.

---

**Dernière mise à jour:** 19 février 2026
**Version:** 1.1
