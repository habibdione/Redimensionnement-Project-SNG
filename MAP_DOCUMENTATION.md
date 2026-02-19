# 🗺️ Documentation de la Carte Leaflet - Page d'Accueil

## 📋 Vue d'ensemble

La carte interactive Leaflet a été intégrée à la page d'accueil du projet SONAGED. Elle affiche les données géospatiales du Sénégal avec support pour plusieurs couches de données.

## 🎯 Fonctionnalités implémentées

### 1. **Affichage des Couches Géospatiales**
- 🟫 **Régions** : Limites administratives régionales
- 🟣 **Départements** : Divisions départementales
- 🟪 **Arrondissements** : Divisions au niveau arrondissement
- 🔴 **Circuits Collecte** : Routes de collecte des déchets
- 🟣 **Circuits Balayage** : Routes de balayage
- 🟢 **Mobilier Urbain** : Points de collecte et équipements

### 2. **Contrôles Interactifs**
- ✅ **Zoom In/Out** : Contrôle de zoom intégré
- ✅ **Sélection des couches** : Menu déroulant pour afficher/masquer les couches
- ✅ **Légende dynamique** : Légende personnalisée en bas à droite
- ✅ **Conseil d'utilisation** : Message d'aide contextualisé

### 3. **Interactions Utilisateur**
- 🖱️ **Survol des éléments (Hover)** : Les éléments s'illuminent au survol
- 📍 **PopUps enrichies** : Affichage des détails au clic sur les éléments
- 🎯 **Navigation fluide** : Zoom et panoramique lisses

### 4. **Optimisations Visuelles**
- CSS personnalisé pour un rendu professionnel
- Animations de transition fluides
- Responsivité complète (mobile, tablette, desktop)
- Ombres et effets de profondeur

## 🚀 Utilisation

### Accéder à la Carte
La carte s'affiche automatiquement dans la section "🗺️ Carte Géospatiale Sénégal" de la page d'accueil.

### Contrôles Basiques
1. **Zoom** : Utilisez les boutons `+` et `-` ou la molette de la souris
2. **Panoramique** : Cliquez et glissez pour vous déplacer
3. **Affichage des couches** : Utilisez le contrôle des couches (en haut à droite) pour cocher/décocher les éléments

### Consulter les Détails
Cliquez sur n'importe quel élément de la carte pour voir un popup avec les informations détaillées.

## 🛠️ Commandes Avancées (Console JavaScript)

Pour utiliser les commandes avancées, ouvrez la console des développeurs (F12) et utilisez :

```javascript
// Afficher les statistiques de toutes les couches
window.mapCommands.stats()

// Centrer sur une couche spécifique
window.mapCommands.zoomTo("Region_3")
window.mapCommands.zoomTo("Departement_4")
window.mapCommands.zoomTo("MobilierUrbain_8")

// Afficher/masquer une couche
window.mapCommands.toggle("Region_3")

// Réinitialiser la vue
window.mapCommands.reset()

// Exporter la vue actuelle
window.mapCommands.export()

// Charger une vue sauvegardée
window.mapCommands.load(viewData)

// Afficher l'aide
window.mapCommands.help()
```

## 📊 Données Chargées

Les données GeoJSON sont stockées et chargées depuis le dossier `/data/` :

- `Region_3.js` - 14 régions du Sénégal
- `Departement_4.js` - 45+ départements
- `Arrondissement_5.js` - Divisions arrondissements
- `CollecteNational_6.js` - Circuits de collecte
- `BalayageNational_7.js` - Circuits de balayage
- `MobilierUrbain_8.js` - Points de mobilier urbain

## 🎨 Personnalisation

### Modifier les Couleurs
Les couleurs des couches sont définies dans le code JavaScript (voir `loadGeoJSONLayers()`) :

```javascript
const layerStyles = {
    'Region_3': {
        fillColor: 'rgba(164,113,88,1.0)',
        // ...
    },
    // ...
};
```

### Modifier les Hauteurs
La hauteur de la carte peut être ajustée dans `css/map-styles.css` :

```css
#dimensionnement-map {
    height: 600px; /* Modifier cette valeur */
}
```

## 📱 Responsive Design

La carte s'adapte automatiquement à tous les appareils :
- **Desktop** : 600px de hauteur
- **Tablette** : 400px de hauteur
- **Mobile** : 300px de hauteur

## ⚙️ Fichiers Concernés

- `index.html` - Fichier principal avec la carte
- `css/map-styles.css` - Styles personnalisés de la carte
- `js/map-enhancements.js` - Script d'amélioration et commandes avancées
- `data/*.js` - Fichiers GeoJSON des couches

## 🐛 Dépannage

### La carte n'apparaît pas
1. Vérifiez que les fichiers `data/*.js` existent
2. Vérifiez la console du navigateur pour les erreurs Leaflet
3. Assurez-vous que JavaScript est activé

### Les couches ne s'affichent pas
1. Vérifiez que le fichier GeoJSON existe
2. Regardez la console pour les messages d'erreur
3. Utilisez `window.mapCommands.stats()` pour voir les couches chargées

### La carte est trop lente
1. Masquez les couches moins nécessaires
2. Réduisez le niveau de zoom
3. Videz le cache du navigateur

## 📞 Support

Pour plus d'informations sur Leaflet, consultez la [documentation officielle](https://leafletjs.com/).

## 📝 Historique des Modifications

### Version 1.0 - Initial
- Intégration de Leaflet
- Support des 6 couches GeoJSON
- Contrôles interactifs basiques
- Architecture responsif

### Version 1.1 - Améliorations
- CSS personnalisé avancé
- Script d'amélioration de la carte
- Commandes JavaScript avancées
- Animations et transitions fluides
- Légende et aide visuelles

---

**Dernière mise à jour :** 19 février 2026  
**Version actuelle :** 1.1
