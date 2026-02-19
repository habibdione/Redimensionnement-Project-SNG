# 🗺️ GUIDE RAPIDE - Utilisation de la Carte

## 🚀 Démarrage Rapide

### 1. Voir la Carte
1. Ouvrez le fichier `index.html` dans votre navigateur
2. Attendez le chargement (quelques secondes)
3. Vous verrez la carte interactive au centre de la page d'accueil

### 2. Explorer la Carte
- **Zoomer** : Utilisez les boutons `+` et `-` ou la molette de la souris
- **Panoramique** : Cliquez et glissez avec la souris
- **Affichage des couches** : Cliquez sur les cases à cocher dans le contrôle en haut à droite

### 3. Visualiser les Détails
- **Cliquez** sur n'importe quel élément (région, département, etc.)
- Une **popup** s'affichera avec les informations détaillées

## 🎯 Contrôles et Éléments

### Contrôle du Zoom (haut-gauche)
```
[+] Zoom avant
[-] Zoom arrière
```

### Contrôle des Couches (haut-droit)
- ✅ **Mobilier Urbain** - Points de collecte (points verts)
- ✅ **Balayage National** - Routes de balayage (ligne violette)
- ✅ **Collecte National** - Routes de collecte (ligne rouge)
- ✅ **Arrondissement** - Zones d'arrondissement (polygones violets)
- ✅ **Département** - Zones de département (polygones magenta)
- ✅ **Région** - Zones de région (polygones marron)

### Légende (bas-droit)
```
🟫 Régions - Couleur : Marron
🟣 Départements - Couleur : Magenta
🟪 Arrondissements - Couleur : Violet
🔴 Circuits Collecte - Couleur : Rouge
🟪 Circuits Balayage - Couleur : Violet
🟢 Mobilier Urbain - Couleur : Vert
```

### Message d'Aide (haut-gauche)
```
💡 Astuce: Cliquez sur les éléments pour voir les détails. 
Utilisez la molette pour zoomer.
```

## 💻 Commandes Console (Avancées)

Pour les utilisateurs techniques, ouvrez le navigateur (F12) et accédez à l'onglet **Console**.

### Commandes Disponibles

```javascript
// 📊 Afficher les statistiques de toutes les couches
window.mapCommands.stats()
// Résultat: Affiche Region_3: 14 éléments ✅ visible, etc.

// 🎯 Centrer la carte sur une région spécifique
window.mapCommands.zoomTo("Region_3")        // Centres sur les régions
window.mapCommands.zoomTo("Departement_4")   // Centres sur les départements
window.mapCommands.zoomTo("MobilierUrbain_8")// Centres sur le mobilier urbain

// 👁️ Afficher ou masquer une couche
window.mapCommands.toggle("Region_3")
// Masquera ou affichera les régions selon l'état actuel

// 🔄 Réinitialiser la vue par défaut
window.mapCommands.reset()
// Revient à la vue d'accueil du Sénégal

// 💾 Exporter la vue actuelle
const view = window.mapCommands.export()
// Retourne un objet avec les coordonnées, zoom, et état des couches

// 📥 Charger une vue sauvegardée
window.mapCommands.load(view)
// Restaure la vue à partir d'un objet exporté précédemment

// 📖 Afficher l'aide complète
window.mapCommands.help()
// Liste toutes les commandes disponibles
```

## 🎨 Éléments Interactifs

### Régions, Départements, Arrondissements
- **Au survol** : L'élément s'illumine et devient plus visible
- **Au clic** : Une popup affiche toutes les informations
- **Codes** : Chaque zone a un code administratif

### Circuits (Collecte & Balayage)
- **Au survol** : Les lignes s'épaississent
- **Au clic** : Détails de la route et de la fréquence

### Mobilier Urbain
- **Au survol** : Le point grandit et s'illumine
- **Au clic** : Informations sur le type, localisation, et état

## 📱 Sur Mobile

La carte s'affiche correctement sur mobile avec :
- Hauteur adaptée pour l'écran
- Contrôles agrandis pour la touche
- Popups redimensionnées
- Légende compacte

## 🔧 Dépannage

### La carte n'apparaît pas
- ✓ Vérifiez JavaScript est activé
- ✓ Vérifiez la console pour les erreurs
- ✓ Actualisez la page (Ctrl+F5 ou Cmd+Shift+R)

### Les éléments ne s'affichent pas
- ✓ Vérifiez que les cases correspondantes sont cochées dans le contrôle des couches
- ✓ Zoomez/dézoomez pour rafraîchir l'affichage
- ✓ Réinitialisez la vue avec `window.mapCommands.reset()`

### La carte est lente
- ✓ Masquez certaines couches pour réduire la charge
- ✓ Videz le cache du navigateur
- ✓ Réduisez le niveau de zoom

### Je vois des messages d'erreur en console
- ✓ Scroll vers le haut de la console pour voir le message exact
- ✓ Vérifiez que les fichiers `data/*.js` existent
- ✓ Consultez `MAP_DOCUMENTATION.md` pour plus de détails

## 📊 Informations Affichées dans les Popups

### Régions
- OBJECTID_1 : Identifiant de la région
- Statut : Code de statut
- Code : Code administratif
- Région : Nom de la région

### Départements
- OBJECTID_1 : Identifiant
- ogr_fid : Identifiant FID
- Région / Num_Dept / Cod_Dept : Codes et noms
- Shape_Area / Shape_Le_1 : Superficies et périmètres

### Mobilier Urbain
- Type_de_Mo : Type (Bac, Polybenne, PP, PRN)
- Région / Département / Commune : Localisation
- Etat_du_Mo : État du mobilier
- Observations : Notes additionnelles
- Photos : Liens vers les images

## 📧 Besoin d'Aide?

1. Consultez la documentation : `MAP_DOCUMENTATION.md`
2. Lisez le résumé d'intégration : `CARTE_INTEGRATION_SUMMARY.md`
3. Ouvrez la console et tapez : `window.mapCommands.help()`
4. Vérifiez les logs : Appuyez sur F12 → Console

## 🎓 Ressources Utiles

- [Documentation Leaflet](https://leafletjs.com/)
- [Leaflet GeoJSON Support](https://leafletjs.com/examples/geojson/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## ✨ Vous avez des suggestions?

La carte est facilement extensible. Vous pouvez ajouter :
- Plus de couches de données
- Nouveaux types d'éléments
- Filtres personnalisés
- Interactions supplémentaires

---

**Version** : 1.1  
**Dernière mise à jour** : 19 février 2026  
**Status** : ✅ Opérationnel
