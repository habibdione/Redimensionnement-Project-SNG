# 📊 Guide Complet: Sauvegarder les données en Base de Données

> **Tout est maintenant configuré automatiquement!** Les données que vous saisissez sont directement enregistrées en PostgreSQL.

---

## 🚀 Démarrage Rapide (3 étapes)

### 1️⃣ Lancer le serveur backend
```bash
npm start
```
✅ Vous verrez:
```
╔═══════════════════════════════════════════════╗
║   SERVEUR DIMENSIONNEMENT SONAGED ACTIF       ║
║   Port: 3001
║   URL: http://localhost:3001
╚═══════════════════════════════════════════════╝
```

### 2️⃣ Ouvrir l'application frontend
- **Développement local**: http://localhost:8000
- **GitHub Pages**: https://habibdione.github.io/Redimensionnement-Project-SNG/

### 3️⃣ Remplir et sauvegarder
1. Remplissez tous les champs obligatoires (marqués avec 🔴)
2. Cliquez "📡 Obtenir Position GPS"
3. Cliquez "💾 Sauvegarder les Données"
4. ✅ Les données sont sauvegardées dans PostgreSQL

---

## 🎯 Configuration par Contexte

### 🏠 Mode Développement Local
```
Frontend:  http://localhost:8000
Backend:   http://localhost:3001
Détection: ✅ Automatique
```

**Pas de configuration requise!** Le système détecte automatiquement `localhost`.

### 🌐 Mode Dev Tunnel (pour GitHub Pages)

**Option 1: VS Code Tunnels (Recommandé)**
```bash
# Dans VS Code:
1. Command Palette: Ctrl+Shift+P
2. Tapez: "Ports: Focus on Ports View"
3. Right-click port 3001 → "Make Public"
4. Copier l'URL: https://xyz123-3001.euw.devtunnels.ms/
```

**Option 2: ngrok**
```bash
ngrok http localhost:3001
# Copier l'URL: https://abc123.ngrok.io
```

**Mettre à jour le frontend:**
```javascript
// index.html - ligne ~800
if (hostname.includes('github.io')) {
    API_BASE_URL = 'https://xyz123-3001.euw.devtunnels.ms'; // ← VOTRE URL
}
```

**Note:** Si vous utilisez le tunnel `https://4mkdbs2k-3001.euw.devtunnels.ms`, c'est déjà configuré! 

### 📦 Mode Production
L'URL est détectée automatiquement selon votre domaine.

---

## 🧪 Vérifier que tout fonctionne

### Test 1: Serveur accessible
```bash
curl http://localhost:3001/api/health
```

Réponse attendue:
```json
{
  "success": true,
  "status": "OK",
  "database": "connected",
  "timestamp": "2026-02-13T10:30:00.000Z"
}
```

### Test 2: Test complet automatisé
```bash
node test-api-complete.js
```

✅ Cela va:
- ✓ Tester la connexion au serveur
- ✓ Vérifier la base de données
- ✓ Envoyer un enregistrement de test
- ✓ Récupérer les statistiques

### Test 3: Vérifier les données au navigateur
```javascript
// Ouvrez la console du navigateur (F12) et collez:

// Voir l'URL utilisée:
console.log(API_BASE_URL);

// Tester la connexion:
fetch(API_BASE_URL + '/api/health')
  .then(r => r.json())
  .then(d => console.table(d));

// Récupérer les statistiques:
fetch(API_BASE_URL + '/api/statistiques')
  .then(r => r.json())
  .then(d => console.table(d.data));
```

### Test 4: Vérifier en PostgreSQL
```bash
# Afficher tous les enregistrements
psql -U postgres -d senelec_dimensionnement \
  -c "SELECT id, partenaire, region, departement, commune FROM collectes_donnees ORDER BY id DESC LIMIT 10;"
```

---

## 📍 Console - Logs à Vérifier

Ouvrez la console du navigateur (F12) et vous devriez voir:

```
🌐 INITIALISATION API
✅ Mode Développement Local
Serveur: http://localhost:3001
🔗 API_BASE_URL
http://localhost:3001
✅ Configuration API complétée
```

Ou:
```
🌐 INITIALISATION API
✅ Mode GitHub Pages
Serveur: https://xyz123-3001.euw.devtunnels.ms
```

---

## ⚡ Flux Complet de Données

```
┌─────────────────────────────────────────────────────────┐
│ Utilisateur remplit le formulaire                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Clique "💾 Sauvegarder les Données"                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Frontend valide les champs obligatoires                  │
│ ✓ Région, Département, Commune, etc.                   │
│ ✓ Coordonnées GPS                                       │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Envoi via fetch() à:                                     │
│ POST ${API_BASE_URL}/api/collecte                        │
│ • http://localhost:3001 (local)                         │
│ • https://xyz123-3001.euw.devtunnels.ms (GitHub Pages)  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Serveur Node.js (server.js) reçoit les données         │
│ • Valide le JSON                                        │
│ • Vérifie les coordonnées GPS                          │
│ • Convertit la photo en base64 si présente             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ INSERT dans PostgreSQL                                   │
│ INSERT INTO collectes_donnees (...)                     │
│ VALUES (partenaire, region, commune, ...)              │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ ✅ Réponse au frontend:                                  │
│ {                                                        │
│   "success": true,                                       │
│   "data": { "id": 123, "dateCollecte": "..." }          │
│ }                                                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ ✅ Message de succès affichée                            │
│ "Données sauvegardées avec succès!"                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🐛 Dépannage

### ❌ "Le serveur n'est pas accessible"
```
✓ Vérifier: npm start est lancé
✓ Vérifier: http://localhost:3001/api/health retourne 200
✓ Vérifier: pas de firewall qui bloque le port 3001
✓ Vérifier: console du navigateur (F12) montre l'URL correcte
```

### ❌ "Erreur de format de réponse (JSON)"
```
✓ Vérifier: logs du serveur (node server.js)
✓ Vérifier: la réponse est bien du JSON, pas du HTML
✓ Vérifier: Content-Type: application/json
✓ Vérifier: pas d'erreur 500 sur le serveur
```

### ❌ "Les données n'apparaissent pas en base"
```
✓ Vérifier: PostgreSQL est lancé
✓ Vérifier: python run check-db
✓ Vérifier: psql -U postgres -d senelec_dimensionnement
✓ Vérifier: SELECT COUNT(*) FROM collectes_donnees;
✓ Vérifier: tous les champs obligatoires sont remplis
```

### ❌ "Erreur CORS"
```
✓ Vérifier: server.js a cors({origin: '*'})
✓ Vérifier: npm start redémarré après modification
✓ Vérifier: console du navigateur pour le message exact
```

---

## 📋 Checklist de Déploiement

- [ ] Node.js installé (v14+)
- [ ] PostgreSQL lancé et configuré
- [ ] Variables d'environnement .env correctes
- [ ] npm install (dépendances installées)
- [ ] npm start (serveur lancé)
- [ ] Frontend accessible (local ou GitHub Pages)
- [ ] Console du navigateur affiche API_BASE_URL correct
- [ ] Test formulaire → sauvegarde ✅
- [ ] Données visibles en PostgreSQL ✅

---

## 📚 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `server.js` | API/Backend Node.js - Reçoit et enregistre les données |
| `index.html` | Frontend - Formulaire et logique client |
| `db.js` | Configuration PostgreSQL |
| `API_CONFIG.md` | Guide de configuration de l'URL |
| `API_CONFIG.js` | Instructions pour forcer une URL |
| `test-api-complete.js` | Test automatisé complet |

---

## 🎓 Documentations Supplémentaires

- [Configuration API](API_CONFIG.md) - Détail des 3 modes de déploiement
- [Guide complet du serveur](DEPLOYMENT.md) - Déploiement sur Railway
- [Gestion de la base de données](POSTGRESQL_SETUP.md) - PostgreSQL

---

## ✅ Résumé

**Avant:** Les données restaient vides ❌
- ❌ Pas de validation du formulaire
- ❌ URL serveur en dur (localhost:3001)
- ❌ Pas d'erreurs claires

**Après:** Les données sont sauvegardées ✅
- ✅ Validation stricte avant envoi
- ✅ URL détectée automatiquement (3 contextes supportés)
- ✅ Logs détaillés pour diagnostiquer
- ✅ Fallback localStorage si serveur down
- ✅ Messages d'erreur clairs

---

## 📞 Support

En cas de problème:

1. **Vérifiez la console** (F12) -> Onglet "Console"
   - Cherchez: `🔗 API_BASE_URL`
   - Cherchez: erreurs rouges

2. **Vérifiez le serveur** 
   ```bash
   npm start
   # Cherchez les logs des requêtes POST
   ```

3. **Testez la base de données**
   ```bash
   node test-api-complete.js
   ```

4. **Vérifiez PostgreSQL**
   ```bash
   psql -U postgres -d senelec_dimensionnement
   SELECT * FROM collectes_donnees LIMIT 5;
   ```

---

**Dernière mise à jour:** 13 février 2026
**Version:** 2.0 - Support multi-contexte (local, dev tunnel, GitHub Pages)
