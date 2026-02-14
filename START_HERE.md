# 🎯 DÉMARRAGE RAPIDE - SYNCHRONISATION DONNÉES

## 📱 LE SYSTÈME EN UNE IMAGE

```
┌─────────────────────────────────────┐
│ Navigateur http://localhost:5000    │
│ └─ Remplir formulaire ─→ Valider    │
└────────────┬────────────────────────┘
             │ Données →
    ┌────────↓──────────────────┐
    │ Serveur http://localhost  │
    │ :3001                      │
    │                            │
    │ • Si serveur OK            │
    │   └→ PostgreSQL ✅         │
    │                            │
    │ • Si serveur DOWN          │
    │   └→ localStorage 💾       │
    │      Puis sync auto 🔄     │
    └────────────────────────────┘
```

---

## ⚡ 3 ÉTAPES POUR DÉMARRER

### ÉTAPE 1: Terminal 1 (Backend)
```powershell
# Windows PowerShell
.\start-backend.ps1

# Ou directement
npm start
```
**Attend:** http://localhost:3001

### ÉTAPE 2: Terminal 2 (Frontend)
```powershell
# Windows PowerShell
.\start-frontend.ps1

# Ou directement
npm run frontend
```
**Envoie à:** http://localhost:5000

### ÉTAPE 3: Navigateur
```
Allez à: http://localhost:5000
↓
Remplissez le formulaire
↓
Cliquez "Valider"
↓
Données synchronisées ✅
```

---

## 🔄 COMMENT ÇA MARCHE

### Cas Normal (Serveur EN LIGNE)
```
Formulaire soumis
    ↓
Frontend teste: Hey, serveur? Tu réponds?
    ↓ OUI ✅
Frontend envoie les données
    ↓
Serveur reçoit POST /api/collecte
    ↓
Sauvegarde dans PostgreSQL
    ↓
✅ Message: "Données synchronisées"
    ↓
Données visibles immédiatement
```

### Cas Offline (Serveur ABSENT)
```
Formulaire soumis
    ↓
Frontend teste: Hey, serveur?
    ↓ TIMEOUT ❌
Mode local activé
    ↓
Données sauvegardées dans localStorage
    ↓
⚠️ Message: "Mode hors ligne - Sync quand serveur OK"
    ↓
Données attendent le serveur
```

### Cas Reconnexion (Serveur REVIENT)
```
Utilisateur rechargé page / nouveau formulaire
    ↓
Frontend teste: Serveur?
    ↓ OUI ✅
Frontend voit les données en attente dans localStorage
    ↓
Envoie TOUT au serveur
    ↓
✅ Synchronisation auto complète
```

---

## 📊 VÉRIFIER QUE ÇA MARCHE

### Depuis Terminal
```bash
# Voir l'état complet
node system-diagnostic.js

# Vérifier les données d'aujourd'hui
node check-today-data.js

# Tester soumission
node test-submission-today.js

# Vérifier synchronisation
node check-sync-working.js
```

### Depuis Navigateur
Ouvrir DevTools (F12):
```javascript
// Onglet Console:

// Voir les données en attente
Object.keys(localStorage).filter(k => k.includes('pending'))

// Voir l'URL du serveur
API_BASE_URL  // Devrait afficher http://localhost:3001

// Tester l'API
fetch('http://localhost:3001/api/collectes')
    .then(r => r.json())
    .then(d => console.log(d))
```

### Depuis Navigateur (URL)
```
Santé serveur:
http://localhost:3001/api/health

Toutes les données:
http://localhost:3001/api/collectes

Statistiques:
http://localhost:3001/api/statistiques
```

---

## ⚙️ CONFIGURATION

### Fichier `.env`
```env
# Base de données
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senelec_dimensionnement

# Serveur
PORT=3001
NODE_ENV=production
```

### Fichier `index.html` (ligne ~858)
```javascript
let API_BASE_URL = 'http://localhost:3001';

// Ou détection auto pour production
function detecterURLServeur() {
    const hostname = window.location.hostname;
    if (hostname.includes('github.io')) {
        return 'https://xyz-3001.euw.devtunnels.ms';
    }
    return 'http://localhost:3001';
}
```

---

## 🆘 DÉBOGAGE

### "Données ne s'envoient pas"
```bash
# 1. Vérifier les logs du serveur
# → Chercher "POST /api/collecte"

# 2. Vérifier console navigateur (F12)
# → Onglet Network → Form Data

# 3. Tester manuellement
node test-submission-today.js
```

### "Impossible de trouver le serveur"
```bash
# 1. Vérifier que backend est ON
npm start

# 2. Vérifier port 3001
netstat -ano | findstr :3001

# 3. Vérifier .env
cat .env
```

### "Données pas en BD"
```bash
# 1. Vérifier PostgreSQL démarré
# Services → PostgreSQL

# 2. Vérifier la BD existe
node setup-postgres.js

# 3. Vérifier données
node check-today-data.js
```

---

## 📖 DOCUMENTS COMPLETS

```bash
# Guide détaillé synchronisation
cat SYNCHRONIZATION_GUIDE.md

# Guide francais complet
cat GUIDE_SYNCHRONISATION_FR.md

# Architecture technique
cat ARCHITECTURE_FINALE.md
```

---

## ✅ CHECKLIST FINAL

- [ ] **PostgreSQL**: Serveur local en cours (Services ou pgAdmin)
- [ ] **Node.js**: `node --version` fonctionne
- [ ] **npm**: `npm --version` fonctionne
- [ ] **.env**: Fichier existe et config correcte
- [ ] **Terminal 1**: `npm start` affiche "Server running on port 3001"
- [ ] **Terminal 2**: `npm run frontend` affiche "Hit CTRL-C to stop..."
- [ ] **Navigateur**: `http://localhost:5000` s'ouvre
- [ ] **Formulaire**: Peut être rempli et soumis
- [ ] **Vérif**: `node check-today-data.js` affiche les données

---

## 🎯 RÉSUMÉ

| Composant | Status | Port | Action |
|-----------|--------|------|--------|
| PostgreSQL | ✅ | 5432 | Déjà lancé? |
| Backend | ⏳ | 3001 | `npm start` |
| Frontend | ⏳ | 5000 | `npm run frontend` |
| App | ⏳ | - | http://localhost:5000 |

---

## 💡 POINTS CLÉS

1. **SANS SERVEUR** = Données sauvegardées localement
2. **AVEC SERVEUR** = Données immédiatement en BD
3. **SERVEUR REVIENT** = Auto-synchronisation complète
4. **UTILISATEUR VOIT** = Interface pareil dans les 2 cas

✅ **LE SYSTÈME GÈRE TOUT AUTOMATIQUEMENT**

---

## 🚀 C'EST TOUT!

Suivez juste les 3 étapes et ça marche. Les données se synchronisent toutes seules.

**BESOIN D'AIDE:**
- `node system-diagnostic.js` → Voir l'état
- `node check-today-data.js` → Voir les données  
- `node test-submission-today.js` → Tester l'envoi
- Lire `GUIDE_SYNCHRONISATION_FR.md` → Doc complète
