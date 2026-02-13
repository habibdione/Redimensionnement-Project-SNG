# 🚀 GUIDE DE DÉPLOIEMENT RAILWAY

## Qu'est-ce que Railway?
Railway est une plateforme de déploiement gratuite qui permet de:
- ✅ Déployer Node.js facilement
- ✅ Fournir une URL publique HTTPS
- ✅ Gérer les variables d'environnement
- ✅ Intégrer PostgreSQL

---

## 📋 ÉTAPES DE DÉPLOIEMENT

### ÉTAPE 1: Créer un compte Railway

1. Allez sur: **https://railway.app**
2. Cliquez sur **"Sign up"**
3. Connectez-vous avec GitHub (recommandé)
4. Acceptez les permissions

---

### ÉTAPE 2: Créer un nouveau projet

1. Sur le dashboard Railway, cliquez **"New Project"**
2. Sélectionnez **"Deploy from GitHub"**
3. Connectez votre repo GitHub
4. Cherchez et sélectionnez: `Redimensionnement-Project-SNG`

---

### ÉTAPE 3: Ajouter PostgreSQL

1. Dans votre projet Railway, cliquez **"Add"** (en haut à droite)
2. Sélectionnez **"PostgreSQL"**
3. Railway ajoutera une base de données automatiquement

---

### ÉTAPE 4: Configurer les variables d'environnement

Railroad vous crée automatiquement les variables PostgreSQL. Vérifiez dans **"Variables"**:

```
DATABASE_URL=postgresql://user:password@host:port/database
```

Ajoutez ces variables manuelles:

```
PORT=3000
NODE_ENV=production
DB_NAME=dimentionnement_SNG
```

---

### ÉTAPE 5: Configurer le port pour Production

⚠️ **IMPORTANT**: Railway utilise le port **3000** par défaut!

Modifiez [server.js](server.js) pour utiliser la variable d'environnement correctement:

```javascript
const PORT = process.env.PORT || 3001;  // ← C'est déjà correct!
```

---

### ÉTAPE 6: Déployer automatiquement

1. Railway se connecte à votre repo GitHub
2. Chaque push sur `main` redéploie automatiquement
3. Attendez que le statut passe à **"Success"**

---

### ÉTAPE 7: Obtenir l'URL publique

1. Dans Railway, cliquez sur votre service Node.js
2. Allez à **"Settings"**
3. Cherchez **"Public URL"**
4. Elle ressemble à: `https://your-app-name-production.up.railway.app`

---

## 🔧 METTRE À JOUR LA CONFIGURATION

Une fois l'URL Railway obtenue, mettez à jour [config.js](config.js):

```javascript
production: {
    // Remplacez par votre URL Railway!
    API_URL: 'https://your-app-name-production.up.railway.app/api',
    APP_NAME: 'SENELEC Dimensionnement',
    DEBUG: false
}
```

---

## 📝 COMMANDES GIT POUR DÉPLOYER

```bash
# 1. Commit local
git add .
git commit -m "Déploiement Railway - Config mise à jour"

# 2. Push vers GitHub
git push origin main

# 3. Railway déplie automatiquement!
```

---

## ✅ TEST DE CONNEXION

Après le déploiement:

1. Ouvrez: **http://localhost:5000/test-connection.html**
2. Changez l'URL API (console browser):

```javascript
// Dans la console du navigateur
const API_URL = 'https://your-app-name-production.up.railway.app/api';
```

3. Testez les endpoints

---

## 🐛 DÉPANNAGE

### L'API ne répond pas?
1. Vérifiez le **log** de Railway
2. Vérifiez que PostgreSQL est connectée
3. Vérifiez les **variables d'environnement**

### Erreur 503 Service Unavailable?
- Railway peut mettre 30 secondes à déployer
- Attendez et réessayez

### Erreur de connexion BD?
- Vérifiez que PostgreSQL est attachée au projet
- Vérifiez `DATABASE_URL` en variables

---

## 🔗 LIEN UTILE

- Documentation Railway: https://docs.railway.app/
- Troubleshooting: https://docs.railway.app/troubleshooting

---

## 💡 PROCHAINE ÉTAPE

Une fois déployé, GitHub Pages pourra accéder à votre API! 🎉
