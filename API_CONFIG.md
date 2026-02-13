# 🔧 Configuration API - Guide de Déploiement

## 📍 Trois Scénarios Supportés

### 1️⃣ **Mode Développement Local**
```
Frontend: http://localhost:8000 (ou http://127.0.0.1:8000)
Backend: http://localhost:3001
Détection: Automatique
```
- Le frontend détecte automatiquement `localhost` et utilise `http://localhost:3001`
- Aucune configuration requise!

### 2️⃣ **Mode Dev Tunnel (VS Code / ngrok)**
```
Frontend: https://xyz123.euw.devtunnels.ms/
Backend: https://xyz123-3001.euw.devtunnels.ms/
Détection: Automatique
```
- Le frontend détecte les domaines `devtunnels.ms`
- Utilise le même domaine pour construire l'URL API

**Exemple avec VS Code Tunnels:**
```bash
# Depuis VS Code - Command Palette > "Ports: Expose Port"
Port 3001 → https://4mkdbs2k-3001.euw.devtunnels.ms/
Port 8000 → https://4mkdbs2k-8000.euw.devtunnels.ms/
```

### 3️⃣ **Mode GitHub Pages + Dev Tunnel**
```
Frontend: https://habibdione.github.io/Redimensionnement-Project-SNG/
Backend: https://4mkdbs2k-3001.euw.devtunnels.ms/
Détection: Automatique (hardcodé)
```
- Le frontend détecte `github.io` et utilise le dev tunnel
- **⚠️ Important:** Mettez à jour l'URL du tunnel dans `index.html` ligne 800:

```javascript
if (hostname.includes('github.io')) {
    API_BASE_URL = 'https://4mkdbs2k-3001.euw.devtunnels.ms'; // ← VOTRE URL ICI
}
```

---

## 🚀 Procédure de Déploiement

### Étape 1: Démarrer le serveur backend
```bash
npm start
# Serveur lancé sur http://localhost:3001
```

### Étape 2: Ouvrir un tunnel pour le backend (optionnel)
```bash
# Via VS Code Tunnels
- Command Palette > "Ports: Expose Port"
- Port: 3001
- Public: Yes
- Obtenir l'URL: https://xyz123-3001.euw.devtunnels.ms/

# Ou via ngrok
ngrok http http://localhost:3001
# Obtenir l'URL: https://xyz123.ngrok.io
```

### Étape 3: Mettre à jour le URL du tunnel en base de données (GitHub Pages)
```javascript
// index.html - ligne ~800
if (hostname.includes('github.io')) {
    API_BASE_URL = 'https://xyz123-3001.euw.devtunnels.ms'; // ← URL DE VOTRE TUNNEL
}
```

### Étape 4: Tester les données
```
1. Accédez à votre frontend (local, tunnel ou GitHub Pages)
2. Remplissez le formulaire
3. Cliquez "💾 Sauvegarder les Données"
4. Vérifiez la console pour voir l'URL utilisée: 🔗 API_BASE_URL configuré à: ...
5. Les données doivent apparaître en base de données
```

---

## 🐛 Dépannage

### "Le serveur n'est pas accessible"
```
✓ Vérifier que le serveur est lancé: npm start
✓ Vérifier l'URL dans la console: 🔗 API_BASE_URL configuré à: ...
✓ Vérifier la connectivité réseau
```

### "Erreur CORS"
```
✓ Vérifier que le serveur Node.js est lancé
✓ Vérifier que CORS est activé dans server.js:
  app.use(cors({ origin: '*' }));
```

### "Réponse invalide - JSON parse error"
```
✓ Vérifier la console du serveur pour les erreurs
✓ Vérifier que le Content-Type est 'application/json'
✓ S'assurer que le JSON est valide (pas de caractères spéciaux mal encodés)
```

### "Les données ne sont pas enregistrées en base"
```
✓ Vérifier que PostgreSQL est lancé
✓ Vérifier la connexion à la base: npm run check-db
✓ Vérifier les logs du serveur: node server.js
✓ Vérifier que tous les champs obligatoires sont remplis
```

---

## 📊 Vérifier l'État du Backend

### Health Check
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

### Récupérer les statistiques
```bash
curl http://localhost:3001/api/statistiques
```

---

## 🔐 Sécurité en Production

> ⚠️ **Important:** N'utilise pas `origin: '*'` en production!

```javascript
// ✅ À faire en production
app.use(cors({
    origin: ['https://habibdione.github.io', 'https://xyz123-3001.euw.devtunnels.ms'],
    methods: ['GET', 'POST'],
    credentials: true
}));
```

---

## 📝 Notes

- Les URLs sont détectées **automatiquement** au démarrage
- Les données sont stockées en PostgreSQL
- Fallback en localStorage si le serveur est indisponible
- Maximum 25MB par requête

**Dernière mise à jour:** 13/02/2026
