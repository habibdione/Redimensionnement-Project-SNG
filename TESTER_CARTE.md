# 🎯 TESTER LA CARTE MAINTENANT

## ⚠️ ÉTAPE 1: VIDEZ LE CACHE (CRUCIAL!)

Si vous ne videz pas le cache, vous verrez toujours la vieille version!

### ✅ Videz le cache:

**Windows - Chrome/Edge:**
```
Ctrl + Shift + Suppr
```
- Sélectionner "Tout le temps"
- Cocher "Cookies et autres données de site" ✓
- Cocher "Images et fichiers en cache" ✓  
- Cliquer "Supprimer les données"

**Windows - Firefox:**
```
Ctrl + Shift + Suppr
```
- Sélectionner menu déroulant "Tout"
- Cliquer "Effacer maintenant"

**macOS/Safari:**
```
Cmd + Option + E
```

## ✅ ÉTAPE 2: RECHARGER LA PAGE

```
https://4mkdbs2k-3001.euw.devtunnels.ms/
```

Force recharger:
- **Windows:** `Ctrl + F5` ou `Ctrl + Shift + R`
- **macOS:** `Cmd + Shift + R`

## ✅ ÉTAPE 3: VÉRIFIER LA CARTE

### La carte devrait afficher:
- 🗺️ Fond gris/vert (tuiles OpenStreetMap)
- 📍 12 points bruns = Régions du Sénégal
- 🔸 Contrôle des couches en haut à droite  
- 🟩 Boutons zoom en haut à gauche
- 📋 Légende en bas à droite

### Interacti on:
- 🖱️ Cliquez sur un point → Popup avec détails
- 🔍 Ctrl+Scroll → Zoom in/out
- 🖐️ Drag → Panorama

## ✅ ÉTAPE 4: VÉRIFIER LA CONSOLE

Appuyer sur **F12** → Onglet **Console**

Vous devriez voir (en vert):
```
📥 Initialisation des données GeoJSON...
✅ Region_3 OK (12 features)
✅ Departement_4 OK (9 features)
✅ Arrondissement_5 OK (2 features)
✅ CollecteNational_6 OK (0 features)
✅ BalayageNational_7 OK (0 features)
✅ MobilierUrbain_8 OK (0 features)
✅ GeoJSON prêts, initialisation de la carte
✅ L.map créée avec succès
✅ TileLayer OSM ajoutée
✅ Carte Leaflet initialisée
📥 Traitement des couches GeoJSON...
✅ Régions affichée
✅ Départements affichée
✅ Arrondissements affichée
🎛️ Contrôle des couches créé
```

**PAS D'ERREURS ROUGES** = Tout va bien! ✅

## ❌ SI ÇA NE MARCHE TOUJOURS PAS

### 1️⃣ Vérifier que c'est vraiment l'index.html modifié

```javascript
// Dans la console:
document.querySelector('#dimensionnement-map')
```

Si rien ne s'affiche, l'ancien fichier est toujours en cache.

**Solution:** 
- Vider le cache COMPLÈTEMENT (voir Étape 1)
- Fermer TOUS les onglets du site
- Redémarrer le navigateur

### 2️⃣ Vérifier les fichiers GeoJSON

```javascript
// Dans la console:
fetch('./data/Region_3.js').then(r => r.text()).then(console.log)
```

Vous devriez voir le contenu du fichier (pas vide!).

### 3️⃣ Vérifier que les données sont chargées

```javascript
// Dans la console:
Object.keys(window).filter(k => k.includes('json_'))
```

Devrait afficher: 
```
['json_Region_3', 'json_Departement_4', 'json_Arrondissement_5', ...]
```

### 4️⃣ Tester une requête simple

```javascript
// Dans la console (copier/coller):
console.log('🔍 Diagnostic complet:');
console.log('Ready:', window.geoJsonReady);
console.log('Loaded:', window.geoJsonLoaded);
console.log('Region_3 features:', window.json_Region_3?.features?.length);
console.log('Map:', window.landingMap?.getCenter());
```

## 📍 COORDONNÉES DE TEST

Pour vérifier que la carte fonctionne, voici les coordonnées de 3 grandes villes:

| Ville | Lat | Lon | Sur la carte |
|-------|-----|-----|--------------|
| Dakar | 14.67 | -17.57 | Ouest |
| Thiès | 14.79 | -16.36 | Centre-Ouest |
| Kaolack | 13.95 | -15.93 | Centre |

Vous devriez les voir tous les trois comme points bruns sur la carte.

## 🎬 QUICK TEST (30 secondes)

1. Vider cache (Ctrl+Shift+Suppr)
2. Aller sur https://4mkdbs2k-3001.euw.devtunnels.ms/
3. Recharger (Ctrl+F5)
4. Scroll jusqu'à "🗺️ Carte Géospatiale Sénégal"
5. Vérifier 3 points bruns visibles
6. Appuyer F12 et chercher ✅ dans console

**Si vous voyez les points bruns = SUCCÈS!** 🎉

---

## 📞 Besoin d'aide?

Si ça ne marche pas:
1. Copiez/collez les logs de la console (F12 > Console)
2. Vérifiez qu'aucune erreur rouge n'apparaît
3. Essayez dans un autre navigateur
4. Allez dans le dossier `/data` et vérifiez que les fichiers JSmexistent et ne sont pas vides

---

**Dernière mise à jour:** 19 février 2026  
**Version:** 1.0 - Prête pour test
