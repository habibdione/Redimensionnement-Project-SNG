# 🚀 DÉPLOIEMENT TUNNEL - Guide Complet

## ✅ État actuel

L'application a été mise à jour pour supporter complètement le tunnel Dev Tunnels HTTPS.

### Fichiers mis à jour:
- ✅ `tunnel-config.js` - Configuration du tunnel
- ✅ `config.js` - Support de la détection tunnel
- ✅ `api-client.js` - Retry logic pour tunnel + détection automatique
- ✅ `index.html` - Charge tunnel-config en premier
- ✅ `package.json` - Scripts de test tunnel
- ✅ `test-config.js` - Validation de la configuration

---

## 🌐 URL du tunnel

```
https://4mkdbs2k-3001.euw.devtunnels.ms
```

**API Endpoint:**
```
https://4mkdbs2k-3001.euw.devtunnels.ms/api
```

---

## 🔧 Configuration requise

Le tunnel doit être configuré comme **PUBLIC** (pas private). Exécutez:

```powershell
# Lister les tunnels
devtunnel list

# Rendre public (remplacer 4mkdbs2k par votre ID)
devtunnel update 4mkdbs2k --allow-anonymous

# Vérifier
devtunnel show 4mkdbs2k
```

---

## 📋 Étapes de déploiement

### 1. Backend Server
```bash
# Terminal 1: Lancer le serveur Node.js
npm start

# Output devrait montrer:
# ✅ Serveur Dimensionnement sur port 3001
# ✅ PostgreSQL connecté
# ✅ CORS activé
```

### 2. Tunnel Dev Tunnels
```bash
# Terminal 2: S'assurer que le tunnel est actif
devtunnel list

# Le tunnel devrait afficher:
# - ID: 4mkdbs2k
# - URL: https://4mkdbs2k-3001.euw.devtunnels.ms
```

### 3. Frontend
```bash
# Terminal 3: Serveur frontend (optionnel)
npm run frontend

# L'application est servie sur http://localhost:5000
```

---

## 🧪 Tests

### Test Configuration
```bash
npm run test:config
```

Tous les fichiers devraient être checkboxed

### Test Tunnel Directement
```bash
npm run test:tunnel
```

### Test Diagnostic Complet
```bash
npm run diagnostic
```

---

## 🌐 Accès à l'application

### Via localhost
```
http://localhost:5000
(utilise localhost:3001 automatiquement)
```

### Via tunnel (forcé)
```
http://localhost:5000?env=tunnel
(force l'utilisation du tunnel HTTPS)
```

### Directement depuis le tunnel
```
https://4mkdbs2k-3001.euw.devtunnels.ms
(charge l'application depuis le tunnel)
```

---

## 🔍 Vérifications

### 1. Vérifier que le tunnel fonctionne
```bash
curl https://4mkdbs2k-3001.euw.devtunnels.ms/api/health
```

### 2. Vérifier les données
```bash
curl https://4mkdbs2k-3001.euw.devtunnels.ms/api/collectes
```

### 3. Tester dans le navigateur (F12 console)
```javascript
// Test direct du tunnel
fetch('https://4mkdbs2k-3001.euw.devtunnels.ms/api/health')
    .then(r => r.json())
    .then(d => console.log('✅ Tunnel fonctionne:', d))
    .catch(e => console.error('❌ Erreur:', e));
```

---

## 🚨 Troubleshooting

### Le tunnel est inaccessible
**Solutions:**
1. Vérifier que le tunnel est PUBLIC: `devtunnel show 4mkdbs2k`
2. Relancer le tunnel si nécessaire
3. Vérifier la connexion réseau

### La sauvegarde ne fonctionne pas
**Solutions:**
1. Vérifier que le backend est lancé: `npm start`
2. Vérifier PostgreSQL: `psql -U postgres -d senelec_dimensionnement`
3. Vérifier les logs de la console (F12)

### CORS Error
**Solutions:**
1. Vérifier que `cors()` est activé dans server.js
2. Le backend doit avoir `origin: '*'`

---

## 📊 Architecture

```
Frontend (Port 5000)
    ↓
API Client (tunnel-config.js + api-client.js)
    ↓
Tunnel HTTPS (4mkdbs2k-3001.euw.devtunnels.ms)
    ↓
Backend Node.js (Port 3001)
    ↓
PostgreSQL Database
```

---

## ✨ Fonctionnalités de tunnel

### Auto-détection
- L'application détecte automatiquement si elle est lancée sur le tunnel
- Bascule automatiquement vers `tunnel-config`

### Retry Logic
- 3 tentatives de connexion au tunnel
- Délai d'attente avant nouvelle tentative
- Fallback sur localhost en cas d'échec

### CORS Compatible
- Accepte les certificats autosignés du tunnel
- Mode CORS configuré correctement
- Headers configurés pour le tunnel

---

## 📝 Commandes rapides

```bash
# Démarrer tout
npm start                    # Backend
npm run frontend            # Frontend (autre terminal)
devtunnel list              # Vérifier tunnel

# Tests
npm run test:config         # Valider configuration
npm run test:tunnel         # Tester connectivité
npm run diagnostic          # Diagnostic complet

# Synchronisation
npm run sync                # Sync données locales
npm run diagnostic          # État du système
```

---

## 🎯 Prochaines étapes

1. ✅ Configuration terminée
2. ⏳ Attendre que le tunnel soit PUBLIC
3. 🧪 Tester avec `npm run test:config`
4. 🚀 Accéder à l'application
5. 💾 Tester la sauvegarde
6. 📤 Vérifier les données dans PostgreSQL

---

**Merci d'utiliser SENELEC Dimensionnement! 🎉**
