# 🚀 QUICK START - RAILWAY EN 5 MINUTES

## ⚡ Le plus rapide possible!

### 1️⃣ Allez sur Railway.app (1 min)
```
https://railway.app → Sign Up (avec GitHub)
```

### 2️⃣ Créez un Projet (2 min)
```
New Project → Deploy from GitHub
→ Sélectionnez: Redimensionnement-Project-SNG
```

### 3️⃣ Ajoutez PostgreSQL (1 min)
```
Add → PostgreSQL → Railway le configure automatiquement
```

### 4️⃣ Obtenez l'URL (1 min)
```
Service Node.js → Settings → Copier "Public URL"
```

---

## 📋 Par défaut, Railway crée:

```
✅ PORT = 3000 (automatique)
✅ DATABASE_URL (automatique)
✅ Node.js + Express déploié
✅ PostgreSQL connectée
✅ HTTPS activé
✅ URL publique: https://[votre-app]-production.up.railway.app
```

---

## 🔄 Après le déploiement

**Mettez à jour config.js:**

```javascript
production: {
    API_URL: 'https://YOUR-ACTUAL-URL-production.up.railway.app/api',
    //...
}
```

**Puis commit:**
```bash
git add .
git commit -m "Railway deployed"
git push origin main
```

---

## ✅ C' est fait!

GitHub Pages → Railroad Backend → PostgreSQL
🎊 Tout connecté et public!

---

## 🐛 Si ça ne marche pas?

1. **Erreur 503?** → Attendez 1 min, Railway redéploie
2. **BD non connectée?** → Vérifiez `DATABASE_URL` dans Variables
3. **API erreur?** → Regardez les Logs dans Railway Dashboard

---

**Questions ?** Lisez: `RAILWAY_DEPLOYMENT.md`
