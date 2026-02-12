# Configuration Serveur PWA SENELEC

## ⚠️ Important: HTTPS Requis pour PWA

Les Progressive Web Apps **requièrent HTTPS** en production (sauf localhost).

---

## 🚀 Options de Déploiement

### 1️⃣ **Développement Local (Node.js)**

#### Installation

```bash
npm install -g http-server
```

#### Lancer le serveur HTTP simple

```bash
# À partir du répertoire Redimensionnement-Project
http-server -c-1 -p 5000

# Accès: http://localhost:5000
```

#### Avec CORS activé

```bash
http-server -c-1 -p 5000 --cors
```

---

### 2️⃣ **Serveur Local avec Node.js Express**

#### Installation

```bash
npm init -y
npm install express
```

#### server.js

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '.')));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Headers PWA
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.type('application/javascript; charset=utf-8');
  }
  if (req.path.endsWith('.webmanifest') || req.path.endsWith('.json')) {
    res.type('application/json; charset=utf-8');
  }
  res.header('Service-Worker-Allowed', '/');
  next();
});

// Route par défaut
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Dimensionnement.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur SENELEC lancé sur http://localhost:${PORT}`);
  console.log(`📍 Service Worker disponible: http://localhost:${PORT}/sw.js`);
  console.log(`📦 Manifest disponible: http://localhost:${PORT}/manifest.json`);
});
```

#### Lancer

```bash
node server.js
```

---

### 3️⃣ **Azure App Service (Production)**

#### Fichier `web.config` (Windows)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".webmanifest" mimeType="application/manifest+json" />
    </staticContent>
    <httpProtocol>
      <customHeaders>
        <add name="Service-Worker-Allowed" value="/" />
        <add name="Cache-Control" value="no-cache, no-store, must-revalidate" />
        <add name="Access-Control-Allow-Origin" value="*" />
      </customHeaders>
    </httpProtocol>
    <rewrite>
      <rules>
        <rule name="SPA Fallback" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="Dimensionnement.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

#### Déploiement Bicep (Infrastructure as Code)

```bicep
param location string = 'eastus'
param appName string = 'senelec-dimensionnement'

resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: '${appName}-plan'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
}

resource webApp 'Microsoft.Web/sites@2021-02-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
  }
}

resource webAppSettings 'Microsoft.Web/sites/config@2021-02-01' = {
  name: '${webApp.name}/web'
  properties: {
    httpLoggingEnabled: true
    minTlsVersion: '1.2'
  }
}

output appUrl string = 'https://${webApp.defaultHostName}'
```

---

### 4️⃣ **Docker (Conteneurisation)**

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers
COPY . .

# Installer http-server
RUN npm install -g http-server

# Expose le port
EXPOSE 3000

# Lancer le serveur
CMD ["http-server", "-c-1", "-p", "3000"]
```

#### docker-compose.yml

```yaml
version: '3.8'
services:
  senelec-app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./:/app
    environment:
      - NODE_ENV=production
```

#### Build et Run

```bash
# Build
docker build -t senelec-map .

# Run
docker run -p 3000:3000 senelec-map

# Avec docker-compose
docker-compose up
```

---

### 5️⃣ **Nginx (Production Linux)**

#### /etc/nginx/sites-available/senelec

```nginx
server {
    listen 443 ssl http2;
    server_name dimensionnement.senelec.sn;

    # SSL
    ssl_certificate /etc/letsencrypt/live/dimensionnement.senelec.sn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dimensionnement.senelec.sn/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Root
    root /var/www/senelec-dimensionnement;
    index Dimensionnement.html;

    # Cache buster pour Service Worker
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Service-Worker-Allowed "/";
    }

    # Manifest
    location = /manifest.json {
        add_header Content-Type "application/manifest+json";
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # HTML (no cache)
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA fallback
    error_page 404 /Dimensionnement.html;
    location / {
        try_files $uri $uri/ /Dimensionnement.html;
    }

    # CORS pour CDN
    add_header Access-Control-Allow-Origin "*" always;
}

# Redirection HTTP vers HTTPS
server {
    listen 80;
    server_name dimensionnement.senelec.sn;
    return 301 https://$server_name$request_uri;
}
```

#### Enable et restart

```bash
sudo ln -s /etc/nginx/sites-available/senelec /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔐 SSL/HTTPS

### Let's Encrypt (Gratuit)

```bash
# Installation Certbot
apt-get install certbot python3-certbot-nginx

# Générer certificat
sudo certbot certonly --nginx -d dimensionnement.senelec.sn

# Auto-renouvellement
sudo certbot install --nginx -d dimensionnement.senelec.sn
```

---

## ✅ Checklist Déploiement PWA

### Avant le Go-Live

- [ ] **HTTPS activé**
- [ ] **manifest.json accessible** et valide
- [ ] **Service Worker** (sw.js) enregistrable
- [ ] **Icons** 192x192 et 512x512
- [ ] **Meta tags** pour Apple iOS
- [ ] **Cache headers** configurés correctement
- [ ] **CORS** activé si nécessaire
- [ ] **Tests offline** réussis
- [ ] **Performance Lighthouse** > 90

### Test de Qualité PWA

```bash
# Audit Lighthouse (Chrome DevTools)
F12 → Lighthouse → Audit

# Vérification manifest
https://manifest-validator.appspot.com/

# Simulateur PWA
https://www.pwabuilder.com/
```

---

## 📊 Monitoring & Logs

### Application Insights (Azure)

```javascript
// Dans index.html
const ai = new ApplicationInsights({
    config: {
        instrumentationKey: 'YOUR_KEY'
    }
});
ai.trackPageView();
ai.trackEvent({name: 'GPS_Found'});
```

### Logs Serveur

```bash
# Nginx
tail -f /var/log/nginx/access.log

# AppService (Azure)
az webapp log tail -g rg-senelec -n app-senelec
```

---

## 🚀 Optimisations Performance

### Headers Recommandés

```
Cache-Control: public, max-age=31536000, immutable  (assets)
Cache-Control: no-cache, no-store, must-revalidate  (HTML)
Expires: Thu, 01 Jan 1970 00:00:01 GMT
ETag: "hash-valeur"
Vary: Accept-Encoding
Content-Encoding: gzip
```

### Compression

```bash
# Nginx - gzip
gzip on;
gzip_vary on;
gzip_types text/plain text/css text/xml text/javascript 
           application/javascript application/xml+rss application/json;
```

---

## 📱 Testing Offline

### Chrome DevTools

1. F12 → Network
2. Cocher "Offline"
3. Tester fonctionnalités
4. Service Worker doit servir depuis cache

### Android Device

1. Menu → DevTools → Network throttling
2. Sélectionner "Offline"
3. Tester app

---

## 🆙 Mises à jour PWA

### Update Service Worker

```javascript
// Dans sw.js
const CACHE_VERSION = 'v2'; // Incrémenter

// Les ressources vont être re-téléchargées
```

### Notifier les utilisateurs

```javascript
// Dans index.html
registration.addEventListener('controllerchange', () => {
  showAlert('info', 'Nouvelle version disponible! Relancez l\'app.');
});
```

---

## 📞 Support Déploiement

Pour aide sur déploiement:
- **Azure:** Contacter support Microsoft
- **Docker:** Documentation Docker Hub
- **Nginx:** Documentation officielle nginx.org

---

**Dernière mise à jour:** 12 Février 2026
