# 🎯 QUICK SETUP - Architecture GitHub Pages + PostgreSQL

## 📍 ARCHITECTURE

```
Frontend:  https://habibdione.github.io/Redimensionnement-Project-SNG/  ← GitHub Pages
Backend:   https://api.senelec-dimensionnement.sn/api                  ← Serveur dédié
Database:  PostgreSQL (sur le serveur backend)
```

---

## ⚡ ÉTAPES RAPIDES

### ÉTAPE 1: BACKEND - Louer un Serveur (5 min)

```bash
# Options:
# 1. DigitalOcean Droplet ($5/mois)
# 2. Heroku (gratuit avec limitations)
# 3. Scaleway, Hetzner, Linode, AWS, Google Cloud

# Pour ce guide: Ubuntu 20.04 LTS, 2GB RAM
```

### ÉTAPE 2: BACKEND - Installation (30 min)

Suivre: [DEPLOYMENT_BACKEND.md - Installation sur Ubuntu](DEPLOYMENT_BACKEND.md)

```bash
# Résumé:
1. SSH sur le serveur
2. Installer node.js
3. Installer PostgreSQL
4. Créer BD + utilisateur
5. Cloner le projet
6. npm install
7. Configurer .env
8. PM2 start
9. Nginx + Let's Encrypt
```

### ÉTAPE 3: BACKEND - Configurer l'URL API

```bash
# Sur le serveur, modifier config.js:
# (Dans le dossier du projet)

# Garder devrait être quelque chose comme:
# https://api.senelec-dimensionnement.sn/api
# (ou l'IP du serveur temporairement)
```

### ÉTAPE 4: FRONTEND - Mettre à jour config.js

```javascript
// Dans le fichier local: config.js
production: {
    API_URL: 'https://api.senelec-dimensionnement.sn/api',  // ← URL du backend
    APP_NAME: 'SENELEC Dimensionnement',
    DEBUG: false
}
```

### ÉTAPE 5: FRONTEND - Git Push

```bash
git add .
git commit -m "Configuration: API backend PostgreSQL"
git push origin main

# GitHub Pages met à jour automatiquement (1-2 min)
```

### ÉTAPE 6: TEST

```bash
# 1. Ouvrir l'app
https://habibdione.github.io/Redimensionnement-Project-SNG/

# 2. Ouvrir la console (F12)
# Doit afficher:
# ✅ API Client initialisé avec URL: https://api.senelec-dimensionnement.sn/api

# 3. Remplir et soumettre un formulaire
# Doit afficher: ✅ Données sauvegardées avec succès

# 4. Vérifier dans PostgreSQL
ssh user@ip.serveur
psql -U senelec_user -d senelec_dimensionnement
SELECT COUNT(*) FROM collectes_donnees;
\q
```

---

## 🚀 DÉPLOIEMENT EXPRESS (< 1h)

### Option A: Serveur Ubuntu ($5-10/mois)

```bash
# 1. Louer chez DigitalOcean/Linode
#    - Ubuntu 20.04 LTS
#    - 2GB RAM (minimum)
#    - Garder l'IP

# 2. SSH accessibilité
ssh root@IP_DU_SERVEUR

# 3. Copier le script de setup
# Script existant: Voir DEPLOYMENT_BACKEND.md - Installation

# 4. Exécuter les commandes (~ 30 minutes)
# Résumé: Node.js + PostgreSQL + PM2 + Nginx + Let's Encrypt

# 5. Modifier .env et .git
cd ~/applications/Redimensionnement-Project-SNG
nano .env
# Ajouter les bonnes credentials

# 6. Démarrer
npm install
pm2 start ecosystem.config.js
pm2 save

# 7. Vérifier
curl http://localhost:3001/api/health
```

### Option B: Heroku (Gratuit + payant)

```bash
# 1. Créer compte Heroku.com
# 2. Installer Heroku CLI
# 3. Exécuter:

heroku login
heroku create senelec-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main

# L'URL sera: https://senelec-api.herokuapp.com/api

# 4. Mettre à jour config.js:
# API_URL: 'https://senelec-api.herokuapp.com/api'

# 5. Git push origin main
```

---

## 🔧 FICHIERS À CONFIGURER

### 1. config.js (FRONTEND - Local)

```javascript
production: {
    // CHANGER CETTE URL avec celle du backend!
    API_URL: 'https://api.senelec-dimensionnement.sn/api',
    APP_NAME: 'SENELEC Dimensionnement',
    DEBUG: false
}
```

### 2. .env (BACKEND - Sur le serveur)

```env
DB_USER=senelec_user
DB_PASSWORD=MOT_DE_PASSE_FORT_ICI
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senelec_dimensionnement
PORT=3001
NODE_ENV=production
```

### 3. index.html (FRONTEND - Déjà configuré ✅)

```html
<!-- Chargement de config.js avant api-client.js -->
<script src="config.js"></script>
<script src="api-client.js"></script>
```

---

## ✅ CHECKLIST DÉPLOIEMENT RAPIDE

### Jour 1: Préparation

- [ ] Lire GITHUB_PAGES_POSTGRESQL.md
- [ ] Lire DEPLOYMENT_BACKEND.md
- [ ] Choisir le fournisseur serveur (DigitalOcean/Heroku/autre)
- [ ] Commander/créer le serveur
- [ ] Obtenir SSH access ou Heroku CLI

### Jour 2: Installation Backend

- [ ] SSH sur le serveur
- [ ] Installer Node.js
- [ ] Installer PostgreSQL
- [ ] Créer utilisateur PostgreSQL
- [ ] Cloner le projet
- [ ] npm install
- [ ] Configurer .env
- [ ] PM2 start
- [ ] Tester health check

### Jour 3: Configuration URLs

- [ ] Configurer Nginx + SSL (ou Heroku automatique)
- [ ] Mettre à jour config.js avec URL backend
- [ ] Git push origin main (redéployer frontend)
- [ ] Tests end-to-end

### Jour 4: Production

- [ ] Sauvegardes PostgreSQL automatiques
- [ ] Monitoring actif
- [ ] Logs en place
- [ ] Documentation mise à jour

---

## 📞 RÉFÉRENCES

- [GITHUB_PAGES_POSTGRESQL.md](GITHUB_PAGES_POSTGRESQL.md) - Architecture complète
- [DEPLOYMENT_BACKEND.md](DEPLOYMENT_BACKEND.md) - Installation serveur
- [API_TESTING.md](API_TESTING.md) - Tests API
- [config.js](config.js) - Configuration d'environnement

---

## 🎉 SUCCÈS!

Une fois configuré:
- Frontend: https://habibdione.github.io/Redimensionnement-Project-SNG/ ✅
- Backend: https://api.senelec-dimensionnement.sn/api ✅ (ou Heroku equivalent)
- Database: PostgreSQL ✅
- Data Flow: Fonctionnel ✅

Prêt pour la production! 🚀

---

**Version:** 1.0.0  
**Date:** 12 Février 2026
