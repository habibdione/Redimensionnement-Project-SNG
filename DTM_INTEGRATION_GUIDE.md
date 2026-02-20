# 📊 Intégration DTM.csv - Guide d'Utilisation

## Vue d'ensemble
Cette intégration permet de charger les données du fichier DTM.csv (OneDrive SONAGED) directement dans l'application SONAGED, affichant:
- Les images dans la Galerie des Collectes
- Les sites de collecte sur la Carte de Localisation

## Architecture

```
DTM.csv (OneDrive)
    ↓
read-dtm-csv.js (Serveur Node.js sur port 3002)
    ↓
API: /api/dtm-data
    ↓
index.html (chargerDonneesDTM())
    ↓
Affichage → Galerie + Carte
```

## Fichiers modifiés/créés

### 1. **read-dtm-csv.js** (NOUVEAU)
Serveur Node.js qui:
- Lit le fichier DTM.csv
- Parse le format CSV
- Expose l'API `/api/dtm-data` sur port 3002
- Retourne les données formatées en JSON

### 2. **index.html** (MODIFIÉ - lignes ~7170-7360)
Nouvelle fonction: `chargerDonneesDTM()`
- Appel API vers le serveur DTM
- Mise à jour de `collectesGPS` avec données DTM
- Mise à jour de `galleriePhotos` avec photos DTM
- Refresh de la galerie VI
- Réinitialisation automatique de la carte

### 3. **START-DTM-SERVER.bat** (NOUVEAU)
Script pour démarrer facilement le serveur DTM

## Instructions de démarrage

### Étape 1 : Démarrer le serveur DTM

```bash
# Option A : Double-cliquer sur START-DTM-SERVER.bat
# Option B : Terminal PowerShell
cd "c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"
node read-dtm-csv.js
```

**Résultat attendu :**
```
✅ Serveur DTM démarré sur http://localhost:3002
📊 Endpoint API: http://localhost:3002/api/dtm-data
🔍 Health check: http://localhost:3002/api/health
📁 Chemin DTM.csv: c:\Users\30100-23-SNG\OneDrive - sonaged\Bureau\DTM.csv
📦 Fichier existe: OUI ✅
```

### Étape 2 : Ouvrir l'application

1. Ouvrir `index.html` dans le navigateur
2. La fonction `chargerDonneesDTM()` se déclenche automatiquement au chargement
3. Les données DTM s'affichent dans :
   - **Galerie des Collectes** (section "Actualité & Convention")
   - **Carte des Localisations** (section "Accueil")

## Endpoints API disponibles

### 1. `/api/dtm-data` (GET)
Récupère toutes les données DTM

**Réponse :**
```json
{
  "success": true,
  "count": 13,
  "data": [
    {
      "id": 5,
      "partenaire": "SENELEC",
      "region": "Ziguinchor",
      "commune": "Ziguinchor",
      "site": "Ziguinchor - ...",
      "latitude": 13.123,
      "longitude": -15.456,
      "photo": "/chemin/vers/image.jpg",
      "date_collecte": "2024-02-17T10:30:00Z"
    }
    // ... 12 enregistrements supplémentaires
  ]
}
```

### 2. `/api/dtm-image/:id` (GET)
Récupère le chemin de l'image pour un enregistrement

**Exemple :**
```
GET /api/dtm-image/5
```

**Réponse :**
```json
{
  "success": true,
  "id": 5,
  "photoPath": "/chemin/vers/image.jpg",
  "commune": "Ziguinchor",
  "partenaire": "SENELEC"
}
```

### 3. `/api/health` (GET)
Vérification de santé du serveur

**Réponse :**
```json
{
  "status": "ok",
  "service": "dtm-csv-server",
  "records": 13,
  "dtmPath": "c:\\Users\\30100-23-SNG\\OneDrive - sonaged\\Bureau\\DTM.csv",
  "dtmExists": true
}
```

## Chemins des images

Les chemins des images dans DTM.csv sont stockés dans la colonne `photo`.

**Format attendu :**
- Chemin absolu: `C:\Users\30100-23-SNG\OneDrive - sonaged\photos\img001.jpg`
- Chemin relatif: `./photos/img001.jpg`
- URL distant: `https://example.com/images/img001.jpg`

## Flux de données

### Démarrage de l'application

```
DOMContentLoaded
    ↓
chargerDonneesDTM()
    ↓
fetch('http://localhost:3002/api/dtm-data')
    ↓
Données reçues (13 enregistrements)
    ↓
✅ Mise à jour collectesGPS
✅ Mise à jour galleriePhotos
✅ Refresh galerie UI
✅ Réinitialisation carte
    ↓
Si succès : STOP (utiliser DTM)
Si erreur : chargerDernierExportEnGalerie() (fallback)
```

## Dépannage

### Problème : La galerie ne charge pas

**Solutions:**
1. Vérifier que le serveur DTM est en cours d'exécution
   ```bash
   curl http://localhost:3002/api/health
   ```

2. Vérifier que DTM.csv existe et est accessible
   ```bash
   Test-Path "c:\Users\30100-23-SNG\OneDrive - sonaged\Bureau\DTM.csv"
   ```

3. Vérifier la console du navigateur (F12 → Onglet Console)
   - Chercher les messages commençant par 📥 ou ⚠️

### Problème : Les images s'affichent pas

**Vérifier:**
1. Les chemins des images dans DTM.csv sont valides
2. Les fichiers image existent aux chemins spécifiés
3. Les autorisations d'accès OneDrive/fichiers locaux

### Problème : Impossible de se connecter au serveur

**Vérifier:**
1. Le port 3002 est disponible (pas d'autre processus en cours)
2. Node.js est installé et accessible
3. Les fichiers `read-dtm-csv.js` et `index.html` sont dans le même répertoire

## Configuration avancée

### Changer le port du serveur

Dans `read-dtm-csv.js` (ligne ~165):
```javascript
const PORT = process.env.DTM_PORT || 3002;  // Changer 3002 à votre port
```

Ou via variable d'environnement:
```bash
set DTM_PORT=3003
node read-dtm-csv.js
```

### Changer le chemin DTM.csv

Dans `read-dtm-csv.js` (ligne ~17):
```javascript
const DTM_PATH = 'VOTRE_NOUVEAU_CHEMIN\\DTM.csv';
```

## Scripts NPM disponibles

```bash
npm start              # Démarrer l'application principale
node read-dtm-csv.js   # Démarrer le serveur DTM
npm run dev            # Démarrer le serveur de développement
```

## Intégration avec l'application existante

La fonction `chargerDonneesDTM()` est appelée automatiquement au démarrage:

1. **Si les données DTM se chargent avec succès** : utiliser DTM
2. **Si les données DTM échouent** : basculer vers `chargerDernierExportEnGalerie()` (fallback)

Cela assure une compatibilité arrière complète avec le système existant.

## Monitoring et logs

### Logs du serveur DTM
```
✅ Serveur DTM démarré sur http://localhost:3002
📊 Endpoint API: http://localhost:3002/api/dtm-data
🔍 Health check: http://localhost:3002/api/health
📁 Chemin DTM.csv: ...
📦 Fichier existe: OUI ✅
```

### Logs du client (navigateur - F12)
```
📥 Chargement des données DTM.csv...
✅ 13 enregistrements DTM chargés
🗺️ collectesGPS mise à jour avec 13 marqueurs DTM
📷 Galerie mise à jour avec X photos DTM
✅ Galerie DTM affichée avec succès
🗺️ Réinitialisation de la carte avec données DTM...
```

## Performance

- **Temps de chargement** : ~200ms pour 13 enregistrements
- **Taille mémoire** : ~50KB pour 13 enregistrements + 13 images
- **Requête API** : Une seule requête au démarrage

## Prochaines étapes

1. ✅ Tester le chargement DTM
2. ✅ Vérifier les chemins des images
3. ✅ Monitorer les logs console
4. ⚠️ Gérer les images manquantes/inaccessibles
5. ⚠️ Synchroniser les mises à jour DTM (polling/websocket)

## Support et erreurs

Si des erreurs persistent:
1. Consulter la section "Dépannage"
2. Vérifier les logs navigateur (F12 - Console)
3. Vérifier les logs serveur (terminal DTM)
4. Vérifier le fichier DTM.csv lui-même

---

**Document créé:** 2024-02-17  
**Version:** 1.0.0  
**Statut:** Fonctionnel avec fallback
