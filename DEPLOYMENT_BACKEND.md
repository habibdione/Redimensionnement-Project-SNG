# 🚀 GUIDE DE DÉPLOIEMENT BACKEND - Architecture GitHub Pages + PostgreSQL Server

## Architecture Distribuée

```
Frontend:  https://habibdione.github.io/Redimensionnement-Project-SNG/
                        ↓ (Requêtes API CORS)
Backend:   https://api.senelec-dimensionnement.sn:3001/api
                        ↓
Database:  PostgreSQL (sur serveur backend)
```

---

## 📋 Prérequis Serveur

### Option 1: Serveur Dédié (Recommandé)

**Spécifications Minimales:**
- RAM: 2GB
- CPU: 1 vCore
- Disque: 20GB SSD
- OS: Ubuntu 18.04+ ou Debian 10+
- Connexion: 1Mbps minimum

**Fournisseurs Suggérés:**
- Linode, DigitalOcean, AWS Lightsail, Scaleway, Hetzner

### Option 2: PaaS (Platform as a Service)

**Fournisseurs:**
- Heroku (gratuit + payant)
- Railway (gratuit + payant)
- Render (gratuit + payant)
- Fly.io

---

## 🛠️ INSTALLATION SUR SERVEUR UBUNTU/DEBIAN

### Étape 1: Connexion SSH

```bash
# Avec clé SSH
ssh -i /chemin/vers/cle.pem user@ip.du.serveur

# Ou avec mot de passe
ssh user@ip.du.serveur
```

### Étape 2: Mettre à Jour le Système

```bash
sudo apt update
sudo apt upgrade -y
```

### Étape 3: Installer Node.js

```bash
# Installer NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Installer Node.js LTS
nvm install 18
nvm use 18

# Vérifier
node -v
npm -v
```

### Étape 4: Installer PostgreSQL

```bash
# Ajouter le dépôt PostgreSQL
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Installer PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Démarrer et activer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier
sudo -u postgres psql --version
```

### Étape 5: Créer la Base de Données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Exécuter les commandes SQL:
CREATE USER senelec_user WITH PASSWORD 'VOTRE_MOT_DE_PASSE_FORT_ICI';
CREATE DATABASE senelec_dimensionnement OWNER senelec_user;
GRANT ALL PRIVILEGES ON DATABASE senelec_dimensionnement TO senelec_user;
ALTER ROLE senelec_user SET client_encoding TO 'utf8';
ALTER ROLE senelec_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE senelec_user SET default_transaction_deferrable TO on;
ALTER ROLE senelec_user SET default_transaction_read_only TO off;
\q
```

### Étape 6: Cloner le Projet

```bash
# Créer un dossier pour l'application
mkdir -p ~/applications
cd ~/applications

# Cloner depuis GitHub
git clone https://github.com/habibdione/Redimensionnement-Project-SNG.git
cd Redimensionnement-Project-SNG

# Ou uploader les fichiers via SCP/SFTP
```

### Étape 7: Configurer l'Application

```bash
# Créer le fichier .env
nano .env

# Ajouter ces lignes (adapter les valeurs):
DB_USER=senelec_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE_FORT_ICI
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senelec_dimensionnement
PORT=3001
NODE_ENV=production
```

Sauvegarder: `Ctrl+X` → `Y` → `Enter`

### Étape 8: Installer les Dépendances

```bash
npm install --production

# Vérifier que tout est ok
node -e "const db = require('./db'); db.testConnection();"
```

### Étape 9: Configurer Nginx (Reverse Proxy)

```bash
# Installer Nginx
sudo apt install -y nginx

# Créer la configuration
sudo nano /etc/nginx/sites-available/senelec-api

# Ajouter cette configuration:
```

```nginx
upstream senelec_backend {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name api.senelec-dimensionnement.sn;

    location / {
        proxy_pass http://senelec_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Autoriser les requêtes cors
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
}
```

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/senelec-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Étape 10: Configurer SSL/TLS avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat (remplacer le domaine)
sudo certbot --nginx -d api.senelec-dimensionnement.sn

# Auto-renouvellement
sudo systemctl enable certbot.timer
```

### Étape 11: Configurer PM2 (Process Manager)

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Créer un fichier de configuration
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'senelec-api',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
EOF

# Créer les dossiers de logs
mkdir -p logs

# Démarrer avec PM2
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Configurer le démarrage automatique
pm2 startup systemd -u $USER --hp $HOME
```

### Étape 12: Vérifier le Déploiement

```bash
# Vérifier que le serveur fonctionne
curl http://localhost:3001/api/health

# Ou depuis un autre ordinateur
curl https://api.senelec-dimensionnement.sn/api/health

# Vérifier l'état PM2
pm2 status
pm2 logs senelec-api
```

---

## ☁️ DÉPLOIEMENT SUR HEROKU

### Étape 1: Créer un Compte

Visiter: https://www.heroku.com/

### Étape 2: Installer Heroku CLI

```bash
# Sur macOS
brew tap heroku/brew && brew install heroku

# Sur Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh

# Vérifier
heroku --version
```

### Étape 3: Login et Créer l'Application

```bash
# Se connecter
heroku login

# Créer l'application
heroku create senelec-api

# Ajouter PostgreSQL (addon gratuit/payant)
heroku addons:create heroku-postgresql:hobby-dev

# Vérifier les variables d'environnement
heroku config

# Paramétrer les variables d'environnement
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
```

### Étape 4: Configurer Procfile

```bash
# Créer le fichier Procfile
echo "web: node server.js" > Procfile

# S'assurer que le PORT est utilisé du fichier.env heroku
```

### Étape 5: Déployer

```bash
# Ajouter origin Heroku
git remote add heroku https://git.heroku.com/senelec-api.git

# Déployer
git push heroku main

# Ou depuis une autre branche
git push heroku develop:main

# Voir les logs
heroku logs --tail
```

### Étape 6: Vérifier

```bash
# Tester l'API
curl https://senelec-api.herokuapp.com/api/health
```

---

## 🔄 DÉPLOIEMENT CONTINU (CI/CD)

### GitHub Actions (Gratuit)

```bash
# Créer le dossier
mkdir -p .github/workflows

# Créer deploy.yml
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd ~/applications/Redimensionnement-Project-SNG
          git pull origin main
          npm install --production
          pm2 restart senelec-api
          pm2 save
EOF

# Ajouter les secrets sur GitHub:
# Settings → Secrets and variables → Actions
# - SERVER_HOST: IP du serveur
# - SERVER_USER: utilisateur SSH
# - SERVER_SSH_KEY: clé privée SSH
```

---

## 📊 MONITORING ET MAINTENANCE

### Vérifier les Logs

```bash
# Logs PM2
pm2 logs senelec-api

# Logs PostgreSQL
sudo tail -f /var/log/postgresql/postgresql.log

# Logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Sauvegardes PostgreSQL

```bash
# Sauvegarde manuelle
pg_dump -U senelec_user senelec_dimensionnement > backup_$(date +%Y%m%d_%H%M%S).sql

# Restauration
psql -U senelec_user senelec_dimensionnement < backup_20260212.sql

# Automatiser (cron)
0 2 * * * pg_dump -U senelec_user senelec_dimensionnement > /backups/db_$(date +\%Y\%m\%d).sql
```

### Statistiques Serveur

```bash
# Vérifier l'utilisation des ressources
top
free -h
df -h

# Vérifier les connexions PostgreSQL
sudo -u postgres psql -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"
```

---

## 🔐 SÉCURITÉ

### Pare-feu UFW

```bash
# Activer UFW
sudo ufw enable

# Autoriser SSH
sudo ufw allow 22/tcp

# Autoriser HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Autoriser PostgreSQL (interne seulement)
sudo ufw allow from 127.0.0.1 to 127.0.0.1 port 5432

# Vérifier
sudo ufw status
```

### Fail2Ban (Anti-brute force)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📝 CONFIGURATION URL API FRONTEND

Le frontend (GitHub Pages) doit être configuré pour appeler le backend.

### Modifier config.js

```javascript
// Dans config.js:
production: {
    API_URL: 'https://api.senelec-dimensionnement.sn/api',  // ← URL réelle du backend
    APP_NAME: 'SENELEC Dimensionnement',
    DEBUG: false
}
```

### Ou via le fichier .env du serveur

```env
# Sur le serveur backend (.env)
FRONTEND_URL=https://habibdione.github.io/Redimensionnement-Project-SNG/
API_URL=https://api.senelec-dimensionnement.sn/api
```

---

## ✅ CHECKLIST DE DÉPLOIEMENT

- [ ] Serveur loué et SSH configuré
- [ ] Node.js et PostgreSQL installés
- [ ] Base de données créée
- [ ] Fichier .env configuré
- [ ] npm install exécuté
- [ ] Nginx configuré en reverse proxy
- [ ] SSL/TLS avec Let's Encrypt
- [ ] PM2 configuré pour démarrage auto
- [ ] Health check réussi (curl /api/health)
- [ ] config.js mis à jour avec URLs réelles
- [ ] Frontend (GitHub Pages) peut appeler l'API
- [ ] Sauvegardes PostgreSQL automatiques

---

## 🆘 DÉPANNAGE

### Erreur: "Connection Refused"
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Vérifier le port 3001
netstat -an | grep 3001

# Vérifier les logs PM2
pm2 logs senelec-api
```

### Erreur: "CORS Policy"
```
# Vérifier la configuration CORS dans server.js
# Vérifier que Nginx a les bonnes headers
# Vérifier que l'URL frontend est correcte dans config.js
```

### Erreur: "PostgreSQL Connection Error"
```bash
# Vérifier que PostgreSQL fonctionne
sudo -u postgres psql -l

# Vérifier le fichier .env
cat .env

# Tester la connexion
psql -U senelec_user -d senelec_dimensionnement -h localhost
```

---

## 🎯 RÉSUMÉ

1. **Frontend:** Hébergé sur GitHub Pages (statique, gratuit)2. **Backend:** Serveur Node.js/Express sur un serveur dédié
3. **Base de Données:** PostgreSQL sur le serveur backend
4. **Communication:** API REST avec CORS configuré
5. **SSL:** Let's Encrypt pour HTTPS
6. **Monitoring:** PM2 pour gestion des processus

---

**Version:** 1.0.0  
**Date:** 12 Février 2026  
**Auteur:** SENELEC
