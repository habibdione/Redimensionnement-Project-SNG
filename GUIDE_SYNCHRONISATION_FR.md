# 📱 GUIDE RAPIDE - SYNCHRONISATION DES DONNÉES

## 🎯 Objectif
Comprendre comment les données du formulaire sont envoyées et sauvegardées dans la base de données PostgreSQL avec synchronisation automatique.

---

## ⚡ 3 CAS DE FIGURE

### ✅ CAS 1: Serveur EN LIGNE (Normal)
```
Utilisateur remplit le formulaire
           ↓
        Clique "Valider"
           ↓
    Frontend détecte serveur OK
           ↓
    Envoie à http://localhost:3001/api/collecte
           ↓
    Sauvegarde immédiate en PostgreSQL
           ↓
✅ "Données synchronisées avec succès"
```

**Résultat:** Les données apparaissent immédiatement dans la base de données.

---

### 📵 CAS 2: Serveur HORS LIGNE (Mode local)
```
Utilisateur remplit le formulaire
           ↓
        Clique "Valider"
           ↓
    Frontend essaie serveur... TIMEOUT
           ↓
    Mode local activé ⚠️
           ↓
    Sauvegarde dans localStorage (navigateur)
           ↓
💾 "Données sauvegardées localement - Sync quand serveur OK"
```

**Résultat:** Les données attendent dans le navigateur jusqu'au retour du serveur.

---

### 🔄 CAS 3: Serveur REVIENT (Auto sync)
```
Serveur était hors ligne
           ↓
    Utilisateur se reconnecte/reload page
           ↓
    Frontend détecte serveur de retour
           ↓
    Récupère toutes les données en localStorage
           ↓
    Les envoie automatiquement à la BD
           ↓
✅ "Synchronisation automatique effectuée"
```

**Résultat:** Les données en attente sont automatiquement synchronisées.

---

## 🚀 COMMENT DÉMARRER

### Option 1: Scripts PowerShell (Windows)
```powershell
# Terminal 1 - Backend
.\start-backend.ps1

# Terminal 2 - Frontend (dans un autre terminal)
.\start-frontend.ps1
```

### Option 2: Commandes NPM
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
npm run frontend
```

### Option 3: Commande Node.js directe
```bash
# Terminal 1 - Backend
node server.js

# Terminal 2 - Frontend
npx http-server -p 5000 -c-1 --cors
```

---

## 🌐 ACCÉDER À L'APPLICATION

**Une fois démarrée:**
- Ouvrez votre navigateur
- Allez à: `http://localhost:5000`
- Remplissez le formulaire
- Cliquez "Valider"
- Les données se synchronisent automatiquement

---

## 📊 VÉRIFIER LES DONNÉES

### Depuis Terminal
```bash
# Voir toutes les données
node check-today-data.js

# Voir les données d'aujourd'hui
node check-today-data.js

# Tester la soumission
node test-submission-today.js
```

### Depuis API
```bash
# Toutes les collectes
http://localhost:3001/api/collectes

# État du serveur
http://localhost:3001/api/health

# Statistiques
http://localhost:3001/api/statistiques

# Collecte avec ID 14
http://localhost:3001/api/collecte/14
```

### Via Console JavaScript (DevTools)
```javascript
// Voir les données en attente (localStorage)
Object.keys(localStorage).filter(k => k.startsWith('pending_'))

// Effacer une donnée en attente
localStorage.removeItem('pending_123')

// Voir toutes les données
fetch('http://localhost:3001/api/collectes')
    .then(r => r.json())
    .then(data => console.log(data))
```

---

## 🔧 QUE FAIRE SI...

### ❌ "Les données ne s'envoient pas"

1. **Vérifier que les 2 serveurs tournent:**
   ```bash
   node system-diagnostic.js
   ```

2. **Vérifier la console du navigateur (F12):**
   - Onglet "Console"
   - Chercher des erreurs rouges
   - Chercher "API_BASE_URL"

3. **Vérifier les logs du serveur:**
   - Chercher "POST /api/collecte"
   - Chercher les erreurs

### ❌ "Impossible de se connecter app"

1. Frontend ne trouve pas le backend
   ```bash
   # Vérifier que backend tourne
   npm start
   ```

2. Configurer l'URL du serveur dans index.html (~ligne 858)
   ```javascript
   let API_BASE_URL = 'http://localhost:3001'
   ```

### ❌ "Les données ne sont pas en base"

1. Vérifier PostgreSQL:
   ```bash
   # Windows - Démarrer PostgreSQL via Services
   # Ou via pgAdmin
   ```

2. Vérifier .env:
   ```
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=password
   DB_NAME=senelec_dimensionnement
   ```

3. Si la base n'existe pas, la créer:
   ```bash
   node setup-postgres.js
   ```

---

## 📋 CHECKLIST DÉMARRAGE

Pour que TOUT fonctionne:

- [ ] Node.js installé (`node --version`)
- [ ] PostgreSQL démarré
- [ ] Fichier `.env` existe
- [ ] Terminal 1: `npm start` ✅
- [ ] Terminal 2: `npm run frontend` ✅
- [ ] Navigateur: `http://localhost:5000` ✅
- [ ] Remplir et envoyer un formulaire ✅
- [ ] Vérifier les données: `node check-today-data.js` ✅

---

## 🎨 ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────┐
│        NAVIGATEUR WEB (5000)             │
│   ┌──────────────────────────────────┐  │
│   │    index.html                    │  │
│   │  - Formulaire                    │  │
│   │  - Détection serveur             │  │
│   │  - localStorage (offline)        │  │
│   └──────────────────────────────────┘  │
└───────────────┬──────────────────────────┘
                │ HTTP/HTTPS
        ┌───────↓────────────────────┐
        │  NODE.JS BACKEND (3001)    │
        │ ┌──────────────────────┐   │
        │ │   server.js          │   │
        │ │ - Routes API         │   │
        │ │ - Validation         │   │
        │ └──────────────────┬───┘   │
        │                   │        │
        │ ┌──────────────────↓────┐  │
        │ │   PostgreSQL          │  │
        │ │   collectes_donnees   │  │
        │ │   (Stockage BD)       │  │
        │ └───────────────────────┘  │
        └────────────────────────────┘
```

---

## 📞 SUPPORT COMPLET

Pour obtenir tous les détails:
```bash
# Lire le guide complet
cat SYNCHRONIZATION_GUIDE.md

# Diagnostic système
node system-diagnostic.js

# Test complet
node test-submission-today.js
```

---

## 🌍 EN PRODUCTION

Sur **devtunnels.ms** ou **GitHub Pages**:

1. Le frontend récupère l'URL du serveur automatiquement
2. La synchronisation fonctionne de la même manière
3. localStorage sert de sauvegarde hors connexion
4. Les données se synchronisent dès que possible

**Exemple automatique:**
```javascript
// Détection auto du serveur de prod
if (hostname.includes('github.io')) {
    API_BASE_URL = 'https://xyz-3001.euw.devtunnels.ms'
}
```

---

## ✅ RÉSUMÉ

**SANS SERVEUR:** Les données attendent dans localStorage (navigateur)
**AVEC SERVEUR:** Les données vont directement en PostgreSQL
**RECONNEXION:** Les données en attente se synchronisent auto

C'est tout ! Le système gère tout automatiquement. 🎉
