# 🏗️ ARCHITECTURE GITHUB PAGES + POSTGRESQL SERVER

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Frontend Statique (GitHub Pages)                          │
│   https://habibdione.github.io/Redimensionnement-Project/  │
│   - HTML, CSS, JavaScript                                   │
│   - Aucun serveur nécessaire                                │
│   - Déploiement automatique via git push                    │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │ (Requêtes API CORS)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Backend API Server (Serveur Dédié/Cloud)                │
│   https://api.senelec-dimensionnement.sn:3001/api         │
│   - Express.js + Node.js                                    │
│   - PostgreSQL Database                                     │
│   - CORS activé                                             │
│   - SSL/TLS                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 ÉTAPES DE CONFIGURATION

### 1️⃣ Frontend (GitHub Pages) - DÉJÀ PRÊT ✅

Le frontend est déjà configuré pour :
- Être hébergé sur GitHub Pages
- Utiliser le fichier `config.js` pour gérer les URLs API
- Supporter plusieurs environnements (Dev, Staging, Prod)

**URL Frontend:**
```
https://habibdione.github.io/Redimensionnement-Project-SNG/
```

### 2️⃣ Backend (Serveur Dédié/Cloud) - À CONFIGURER

#### Option A: Serveur Dédié (Recommandé)

1. **Louer un serveur:**
   - DigitalOcean, Linode, AWS, Scaleway, Hetzner
   - Coût: $5-20/mois
   - OS: Ubuntu 20.04 LTS

2. **Suivre le guide:** [DEPLOYMENT_BACKEND.md](DEPLOYMENT_BACKEND.md)

3. **Domaine API (optionnel):**
   - `api.senelec-dimensionnement.sn` → Points vers l'IP du serveur
   - Nginx en reverse proxy sur port 3001
   - SSL/TLS avec Let's Encrypt

#### Option B: Cloud PaaS (Plus simple)

Déployer directement sur Heroku/Railway/Render

```bash
# Exemple Heroku
npm install -g heroku
heroku create senelec-api
heroku config:set DB_USER=... DB_PASSWORD=...
git push heroku main
```

**URL API Heroku:**
```
https://senelec-api.herokuapp.com/api
```

### 3️⃣ Configuration des URLs

#### Fichier: `config.js`

```javascript
// config.js (dans le projet)
const SENELEC_CONFIG = {
    production: {
        // À changer avec l'URL réelle du backend
        API_URL: 'https://api.senelec-dimensionnement.sn/api',
        APP_NAME: 'SENELEC Dimensionnement',
        DEBUG: false
    }
};
```

#### Comment Configurer

**Sur le Serveur Backend (.env):**
```env
# /root/applications/Redimensionnement-Project-SNG/.env

# PostgreSQL
DB_USER=senelec_user
DB_PASSWORD=votre_mot_de_passe_super_secret_ici
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senelec_dimensionnement

# Serveur
PORT=3001
NODE_ENV=production

# URLs (pour information)
FRONTEND_URL=https://habibdione.github.io/Redimensionnement-Project-SNG/
API_URL=https://api.senelec-dimensionnement.sn/api
```

**Sur le Frontend (config.js):**
```javascript
production: {
    API_URL: 'https://api.senelec-dimensionnement.sn/api',  // ← URL du serveur
    APP_NAME: 'SENELEC Dimensionnement',
    DEBUG: false
}
```

Puis faire un git push:
```bash
git push origin main
# GitHub Pages se met à jour automatiquement
```

---

## 📡 FLUX DE DONNÉES

### 1. Utilisateur Ouvre l'Application

```
Navigateur → https://habibdione.github.io/Redimensionnement-Project-SNG/
                    ↓
             Charge les fichiers HTML/CSS/JS
                    ↓
             Exécute config.js
                    ↓
             Affiche: "API_URL = https://api.senelec-dimensionnement.sn/api"
```

### 2. Utilisateur Saisit des Données et Clique "Sauvegarder"

```
Frontend (index.html)
    ↓ sauvegarderDonneesBD()
    ↓ APIClient.sauvegarderEnBaseDonnees(donnees)
    ↓ fetch POST à https://api.senelec-dimensionnement.sn/api/collecte
    ↓ 
Backend (server.js)
    ↓ Valide les données
    ↓ Insère dans PostgreSQL
    ↓
PostgreSQL
    ↓ INSERT INTO collectes_donnees (...)
    ↓ Retourne l'ID et la date
    ↓
Backend
    ↓ Retourne JSON: { success: true, id: 1, ... }
    ↓
Frontend
    ↓ Affiche: "✅ Données sauvegardées avec succès (ID: 1)"
```

### 3. Utilisateur Exporte les Données

```
Frontend
    ↓ APIClient.exporterCSV()
    ↓ fetch GET https://api.senelec-dimensionnement.sn/api/collectes
    ↓
Backend
    ↓ SELECT * FROM collectes_donnees
    ↓ Formate en CSV
    ↓
Frontend
    ↓ Télécharge le fichier collectes_TIMESTAMP.csv
```

---

## 🔌 CONNECTIVITÉ RÉSEAU

### Configuration CORS (Automatique ✅)

Le `server.js` a déjà:

```javascript
app.use(cors({
    origin: '*',  // Accepte toutes les origines
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Cela permet au frontend GitHub Pages de faire des requêtes au backend.

### En Cas de Problème CORS

**Vérifier les Headers HTTP:**
```bash
# Depuis le navigateur (F12 → Network)
# Les réponses doivent avoir:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

**Si ca ne fonctionne pas:**

1. Vérifier que le backend est accessible:
```bash
curl -I https://api.senelec-dimensionnement.sn/api/health
```

2. Vérifier que CORS est bien configuré dans server.js

3. Vérifier la console du navigateur pour les erreurs

---

## 🧪 TESTS DE CONNEXION

### Test 1: Frontend Peut Appeler l'API

```javascript
// Ouvrir la console du navigateur (F12 → Console)
APIClient.verifierConnexion()
  .then(result => console.log('Connexion:', result))

// Doit afficher: true
```

### Test 2: API est Accessible

```bash
# Depuis un terminal
curl https://api.senelec-dimensionnement.sn/api/health

# Doit retourner:
{
  "success": true,
  "status": "OK",
  "database": "connected"
}
```

### Test 3: Créer une Collecte depuis le Frontend

1. Ouvrir l'application
2. Remplir le formulaire
3. Cliquer "🗄️ Sauvegarder en Base de Données"
4. Vérifier le message de succès

### Test 4: Vérifier dans PostgreSQL

```bash
# Sur le serveur backend
psql -U senelec_user -d senelec_dimensionnement

# Vérifier les collectes
SELECT * FROM collectes_donnees;

# Doit afficher au moins la collecte que vous avez créée
```

---

## 📋 CHECKLIST DÉPLOIEMENT

### Frontend (GitHub Pages)

- [x] Code sur GitHub
- [x] config.js configuré
- [x] repo settings → Pages → main branch
- [x] Domaine personnalisé (optionnel)
- [ ] Tester: https://habibdione.github.io/Redimensionnement-Project-SNG/

### Backend (Serveur)

- [ ] Serveur loué et SSH configuré
- [ ] Node.js et PostgreSQL installés
- [ ] Projet cloné sur le serveur
- [ ] .env configuré avec les bonnes credentials
- [ ] npm install exécuté
- [ ] PM2 lancé: `pm2 start ecosystem.config.js`
- [ ] Nginx/Reverse Proxy configuré
- [ ] SSL/TLS avec Let's Encrypt
- [ ] Tests API réussis

### Configuration URLs

- [ ] config.js mis à jour avec l'URL du backend
- [ ] Git push origin main (pour redéployer le frontend)
- [ ] Vérifier que le frontend peut appeler le backend

### Tests End-to-End

- [ ] Ouvrir le frontend
- [ ] Créer une collecte
- [ ] Vérifier dans PostgreSQL
- [ ] Exporter en CSV
- [ ] Voir les statistiques

---

## 🔄 MISE À JOUR CODE

### Frontend (GitHub Pages)

```bash
# 1. Modifier les fichiers localement
# 2. Commit et push
git add .
git commit -m "Mise à jour: nouvelle fonctionnalité"
git push origin main

# 3. GitHub Pages met à jour automatiquement
# 4. Visible sur https://habibdione.github.io/... dans 1-2 minutes
```

### Backend (Serveur)

```bash
# 1. SSH sur le serveur
ssh -i cle.pem user@ip.serveur

# 2. Mettre à jour le code
cd ~/applications/Redimensionnement-Project-SNG
git pull origin main
npm install --production

# 3. Redémarrer
pm2 restart senelec-api
pm2 save

# 4. Vérifier
pm2 logs senelec-api
```

Ou avec CI/CD automatique (GitHub Actions) - voir DEPLOYMENT_BACKEND.md

---

## 🔐 SÉCURITÉ

### Frontend (GitHub Pages)

- ✅ Pas de données sensibles dans le code
- ✅ HTTPS automatique
- ✅ Code public (ok, c'est open source)

### Backend (Serveur)

- 🔐 Garder .env secret (ne pas commiter)
- 🔐 Utiliser des mots de passe forts PostgreSQL
- 🔐 Activer le pare-feu UFW
- 🔐 Utiliser SSH avec clés (pas de password)
- 🔐 Mettre à jour les paquets système régulièrement
- 🔐 Faire des sauvegardes PostgreSQL régulières

---

## 📊 MONITORING

### Frontend

- Vérifier les erreurs en console (F12)
- Utiliser un service comme Sentry pour le monitoring

### Backend

```bash
# Logs en temps réel
pm2 logs senelec-api

# État du serveur
pm2 status

# Ressources utilisées
pm2 monit

# Sauvegardes
pg_dump -U senelec_user senelec_dimensionnement > backup.sql
```

---

## 🆘 SUPPORT

### Erreurs Courantes

**Frontend ne peut pas atteindre le backend:**
1. Vérifier que le backend est en cours d'exécution
2. Vérifier l'URL dans config.js
3. Vérifier les CORS (F12 → Network → Headers)
4. Vérifier le pare-feu du serveur

**PostgreSQL non accessible:**
1. Vérifier: `sudo systemctl status postgresql`
2. Vérifier les logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`
3. Vérifier les credentials dans .env

**PM2 crash:**
1. Voir les logs: `pm2 logs senelec-api`
2. Redémarrer: `pm2 restart senelec-api`
3. Vérifier l'espace disque: `df -h`

---

## 📚 Documentation Complète

- [DEPLOYMENT_BACKEND.md](DEPLOYMENT_BACKEND.md) - Installation serveur
- [API_TESTING.md](API_TESTING.md) - Tests API
- [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md) - Configuration PostgreSQL
- [USAGE_GUIDE.md](USAGE_GUIDE.md) - Guide d'utilisation
- [config.js](#) - Configuration d'environnement

---

**Version:** 1.0.0  
**Date:** 12 Février 2026  
**Architecture:** GitHub Pages + PostgreSQL Server

🎉 **Application Prête pour Production!** 🎉
