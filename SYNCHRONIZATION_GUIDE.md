# 🔄 SYNCHRONISATION DES DONNÉES - GUIDE COMPLET

## ⚡ Vue d'ensemble du système

L'application utilise un système de **synchronisation intelligente** avec localStorage et la base de données PostgreSQL.

### Architecture:
```
📱 APPLICATION FRONTEND (index.html)
        ↓
    localStorage (Mode local)
        ↓
    Vérification serveur disponible?
        ↓ OUI          ↓ NON
      ✅ ONLINE    📵 OFFLINE
        ↓             ↓
    PostgreSQL   localStorage
    (En temps     (Attente
     réel)        serveur)
```

---

## 🚀 DÉMARRAGE CORRECT

### 1️⃣ Terminal 1 - Backend (Serveur)
```bash
npm start
# Ou
node server.js
```
- ⏳ Attend sur http://localhost:3001
- 🔌 PostgreSQL doit être démarré
- 📊 Gère toutes les données

### 2️⃣ Terminal 2 - Frontend (Interface)
```bash
npm run frontend
# Ou
npx http-server -p 5000 -c-1 --cors
```
- 🌐 Accédez à http://localhost:5000
- 📝 Remplissez les formulaires
- 💾 Les données sont synchronisées

---

## 💾 FLUX DE SYNCHRONISATION

### ✅ AVEC SERVEUR DISPONIBLE (Mode ONLINE)

1. **Utilisateur remplit le formulaire**
   ```
   Clique sur "Valider"
   ```

2. **Frontend détecte le serveur**
   ```javascript
   fetch('http://localhost:3001/api/health')
   // ✅ Réponse reçue = Serveur OK
   ```

3. **Données envoyées directement**
   ```javascript
   fetch('http://localhost:3001/api/collecte', {
       method: 'POST',
       body: JSON.stringify(formData)
   })
   ```

4. **Sauvegarde en base de données**
   ```sql
   INSERT INTO collectes_donnees (...)
   VALUES (...)
   -- Données visibles immédiatement
   ```

5. **Confirmation à l'utilisateur**
   ```
   ✅ "Données synchronisées avec succès"
   ```

---

### 📵 SANS SERVEUR (Mode OFFLINE)

1. **Serveur ne répond pas**
   ```javascript
   fetch('http://localhost:3001/api/health')
   // ❌ Timeout/Erreur
   ```

2. **Mode local activé**
   ```
   💾 Les données sont sauvegardées dans localStorage
   ⚠️  "Mode hors ligne - Données synchronisées quand serveur disponible"
   ```

3. **Données stockées localement**
   ```javascript
   localStorage.setItem('pending_collecte_14', JSON.stringify(formData))
   ```

4. **Tentative de sync périodique**
   - Chaque 30 secondes = Test si serveur revient
   - Dès que serveur répond = Synchronisation auto
   ```javascript
   setInterval(() => {
       verifierServeur().then(() => synchroniserDonnees())
   }, 30000)
   ```

5. **Synchronisation automatique**
   ```
   Serveur revient en ligne → Toutes les données locales sont envoyées
   ```

---

## 🔍 VÉRIFICATION DES DONNÉES

### Terminal: Vérifier données en base
```bash
node check-today-data.js
```

Résultat:
```
✅ Connexion PostgreSQL active
📊 Total données en base: X
📅 Données AUJOURD'HUI: Y entrées
📈 Cette semaine: Z entrées
```

### API: Récupérer toutes les données
```bash
curl http://localhost:3001/api/collectes
```

### API: Récupérer les stats
```bash
curl http://localhost:3001/api/statistiques
```

---

## ⚙️ CONFIGURATION DE LA SYNCHRONISATION

### Fichier: index.html (Rechercher ~ligne 2500)

**Section: Gestion de la soumission**
```javascript
// Mode détection automatique du serveur
if (serverAvailable) {
    // Envoyer directement à la BD
    await fetch(API_BASE_URL + '/api/collecte', {...})
} else {
    // Sauvegarder localement
    localStorage.setItem('pending_' + timestamp, JSON.stringify(data))
    showAlert('info', '💾 Données sauvegardées localement...')
}
```

### Fichier: .env

Assurez-vous que ces variables sont correctes:
```env
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senelec_dimensionnement
PORT=3001
```

---

## 🐛 DÉPANNAGE

### ❌ "Serveur indisponible"
```bash
# 1. Vérifier PostgreSQL
psql -U postgres -d senelec_dimensionnement

# 2. Vérifier le serveur
npm start

# 3. Tester le port 3001
netstat -ano | findstr :3001
```

### ❌ "Données ne synchronisent pas"
```bash
# 1. Vérifier les données en localStorage
# Ouvrir DevTools → Application → localStorage → http://localhost:5000
# Chercher clés: "pending_*"

# 2. Vérifier la BD
node check-today-data.js

# 3. Vérifier logs du serveur
# Regarder la console du serveur pour les messages POST
```

### ❌ "Synchronisation en boucle infinie"
```javascript
// Implémenter un délai exponentiel
const retryDelay = Math.min(1000 * (2 ** retries), 60000)
```

---

## 📊 TABLEAU DE SYNTHÈSE

| Situation | Comportement | Résultat |
|-----------|-------------|---------|
| Serveur ✅ + Données | Envoi direct | Immédiat en BD |
| Serveur ❌ + Données | localStorage | Sync quand OK |
| Serveur ✅ + Reconnect | Sync auto | Données restaurées |
| Serveur ❌ Prolongé | Danger perte | Nécessite backup |

---

## 🎯 CHECKLIST DE DÉMARRAGE

- [ ] PostgreSQL démarré
- [ ] Fichier .env configuré
- [ ] Terminal 1: `npm start` ✅
- [ ] Terminal 2: `npm run frontend` ✅
- [ ] Ouvrir http://localhost:5000
- [ ] Tester avec données de test
- [ ] Vérifier BD: `node check-today-data.js`

---

## 🌐 MODE PRODUCTION

En production avec **devtunnels.ms** ou **GitHub Pages**:

1. Serveur déployé sur URL distante
2. Frontend détecte automatiquement:
   ```javascript
   const hostname = window.location.hostname
   if (hostname.includes('github.io')) {
       API_BASE_URL = 'https://xyz-3001.euw.devtunnels.ms'
   }
   ```
3. Synchronisation fonctionne partout
4. localStorage en backup hors connexion

---

## 📞 SUPPORT

Pour debug complet:
```bash
node test-submission-today.js
```

Cela fait:
1. ✅ Teste connexion serveur
2. ✅ Envoie une donnée de test
3. ✅ Vérifie stockage en BD
4. ✅ Affiche résultats détaillés

