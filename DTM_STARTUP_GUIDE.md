## 🚀 GUIDE DE DEMARRAGE - DTM AVEC IMAGES DEPUIS ASSETS

### ✅ QU'EST-IL ÉTÉ FAIT ?

Les images du fichier **DTM.csv** (stockées en format JSON Buffer) ont été :
1. **Extraites** vers des fichiers JPEG individuels
2. **Stockées** dans le dossier `/assets/` du projet
3. **Intégrées** via une API REST sur le port 3002
4. **Affichées** dans la galerie et sur la carte

### 🎬 DÉMARRER LE SYSTÈME

#### Étape 1 : Démarrer le serveur API DTM

```powershell
# Dans le terminal PowerShell du projet
cd c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG
node read-dtm-csv.js
```

**Sortie attendue :**
```
✅ Serveur DTM démarré sur http://localhost:3002
📊 Endpoint API: http://localhost:3002/api/dtm-data
🔍 Health check: http://localhost:3002/api/health
📁 Chemin DTM.csv: c:\Users\30100-23-SNG\OneDrive - sonaged\Bureau\DTM.csv
📦 Fichier existe: OUI ✅
```

#### Étape 2 : Ouvrir le projet dans le navigateur

Ouvrir **index.html** dans votre navigateur :
```
http://localhost:8080/index.html  (si deploié localement)
ou
file:///c:/DIMENSIONNEMENT/.../index.html (mode fichier local)
```

#### Étape 3 : Vérifier l'intégration

✅ **Vérifications automatiques** (la page fait ça automatiquement) :
- Function `chargerDonneesDTM()` s'exécute au chargement
- 13 images se chargent automatiquement
- Galerie s'affiche (section "Actualité & Convention")
- Carte se réinitialise avec les 13 marqueurs (section "Accueil")

### 🔗 ENDPOINTS API DISPONIBLES

```
➊ Récupérer TOUS les enregistrements DTM avec images:
   GET http://localhost:3002/api/dtm-data
   
   Réponse:
   {
     "success": true,
     "count": 13,
     "data": [
       {
         "id": 5,
         "commune": "Ziguinchor",
         "partenaire": "SENELEC",
         "photo": "http://localhost:3002/assets/collecte-5.jpg",
         "latitude": 13.156...,
         "longitude": -15.627...,
         ...
       },
       ...
     ]
   }

➋ Vérifier le statut du serveur:
   GET http://localhost:3002/api/health
   
   Réponse:
   {
     "status": "ok",
     "service": "dtm-csv-server",
     "records": 13,
     "dtmPath": "c:\\Users\\...\\DTM.csv",
     "dtmExists": true
   }

➌ Accéder à une image directement:
   GET http://localhost:3002/assets/collecte-5.jpg
   → Retourne l'image JPEG binaire
```

### 📁 STRUCTURE DES FICHIERS

```
projet/
├── assets/                      ← Dossier avec les 13 images JPEG
│   ├── collecte-5.jpg
│   ├── collecte-6.jpg
│   ├── ... (10 autres images)
│   └── collecte-27.jpg
│
├── read-dtm-csv.js             ← Serveur API (port 3002)
├── extract-images-to-assets.js ← Utilitaire extraction (déjà exécuté)
├── test-assets-api.js          ← Script test API
├── index.html                  ← Front-end (charges images via API)
├── DTM_ASSETS_INTEGRATION.md   ← Documentation technique
├── DTM_STARTUP_GUIDE.md        ← Ce fichier
└── ...
```

### 🎨 CE QUI FONCTIONNE

#### Dans la section "Actualité & Convention"
- ✅ Affiche les 13 photos du DTM en grille
- ✅ Chaque photo inclut : commune, site, partenaire, date
- ✅ Les images se chargent depuis `http://localhost:3002/assets/collecte-X.jpg`

#### Dans la section "Accueil" (Carte)
- ✅ 13 marqueurs positionnent les sites DTM
- ✅ Clic sur marqueur = popup avec photo et détails
- ✅ Les popups affichent les images JPEG du dossier assets

### 📊 CHIFFRES CLÉ

- **Nombre d'enregistrements** : 13
- **Tous les partenaires** : SENELEC
- **Région** : Ziguinchor
- **IDs des collectes** : 5, 6, 7, 8, 9, 10, 11, 12, 23, 24, 25, 26, 27
- **Taille totale images** : ~512 KB
- **Format image** : JPEG

### ⚙️ COMMANDES UTILES

```powershell
# Tester l'API rapidement
node test-assets-api.js

# Vérifier les images dans assets
Get-ChildItem assets | Measure-Object -Sum -Property Length

# Arrêter le serveur (Ctrl+C dans le terminal)

# Extraire à nouveau les images (si modifié DTM.csv)
node extract-images-to-assets.js
```

### 🔍 DÉPANNAGE

**Les images ne s'affichent pas ?**
1. Vérifier que `node read-dtm-csv.js` est en cours d'exécution
2. Vérifier la console du navigateur (F12 → Console)
3. Vérifier que `assets/` contient les 13 fichiers JPEG
4. Essayer d'accéder directement : `http://localhost:3002/api/health`

**Erreur "CORS" ou "Connection refused" ?**
1. Assurez-vous que le serveur DTM est démarré
2. Vérifier que le port 3002 est libre : `netstat -ano | grep 3002`

**Erreur "DTM.csv non trouvé" ?**
1. Vérifier que le chemin est correct : `c:\Users\30100-23-SNG\OneDrive - sonaged\Bureau\DTM.csv`
2. Vérifier que le fichier DTM.csv existe et n'a pas été déplacé

### 📚 DOCUMENTATION COMPLÈTE

Pour plus de détails techniques, consultez :
- [DTM_ASSETS_INTEGRATION.md](DTM_ASSETS_INTEGRATION.md) - Architecture technique
- [DTM_QUICK_START.txt](DTM_QUICK_START.txt) - Guide décision rapide
- [DTM_IMPLEMENTATION_SUMMARY.txt](DTM_IMPLEMENTATION_SUMMARY.txt) - Historique implémentation

---

**Prêt à démarrer ?** Exécutez : `node read-dtm-csv.js`
Puis ouvrez `index.html` dans votre navigateur !

✨ Les images du DTM.csv s'affichent maintenant dans la galerie et sur la carte !
