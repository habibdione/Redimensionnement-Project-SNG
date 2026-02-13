# ✅ CHECKLIST DE DÉPLOIEMENT RAILWAY

## ÉTAPE 1: Préparation Locale ✅
- [x] Backend prêt (`node server.js` fonctionne)
- [x] Frontend prêt (`npx http-server` fonctionne)  
- [x] PostgreSQL accessible localement
- [x] Base de données `dimentionnement_SNG` créée
- [x] `.env` configuré avec les credentials
- [x] `.gitignore` contient `.env`
- [x] `config.js` prêt pour production

## ÉTAPE 2: Repository GitHub
- [ ] Vérifier que le code est commité
- [ ] Vérifier que `.env` n'est PAS dans Git

```bash
git status
# Vérifier que .env n'apparaît pas dans la liste
```

## ÉTAPE 3: Créer un compte Railway
- [ ] Aller sur https://railway.app
- [ ] Créer un compte (GitHub recommandé)
- [ ] Accepter les permissions

## ÉTAPE 4: Créer un Projet Railway
- [ ] Cliquer "New Project"
- [ ] Sélectionner "Deploy from GitHub"
- [ ] Sélectionner le repo `Redimensionnement-Project-SNG`

## ÉTAPE 5: Ajouter PostgreSQL
- [ ] Dans le projet, cliquer "Add"
- [ ] Sélectionner "PostgreSQL"
- [ ] Railway génère `DATABASE_URL` automatiquement

## ÉTAPE 6: Configurer les Variables d'Environnement
- [ ] Vérifier que `DATABASE_URL` existe (auto-généré)
- [ ] Ajouter `PORT=3000`
- [ ] Ajouter `NODE_ENV=production`

**Variables à vérifier dans Railway:**
```
DATABASE_URL=postgresql://...  (auto-généré)
PORT=3000
NODE_ENV=production
```

## ÉTAPE 7: Démarket le Déploiement
- [ ] Railway redéploie automatiquement après chaque push
- [ ] Attendre le statut "Success"
- [ ] Vérifier les logs pour les erreurs

## ÉTAPE 8: Obtenir l'URL Publique
- [ ] Cliquer sur le service Node.js
- [ ] Aller à "Settings"
- [ ] Copier la "Public URL"
- [ ] Format: `https://[app-name]-production.up.railway.app`

## ÉTAPE 9: Mettre à Jour config.js
- [ ] Ouvrir [config.js](config.js)
- [ ] Remplacer `your-railway-app-production.up.railway.app` par votre URL réelle

```javascript
production: {
    API_URL: 'https://YOUR-ACTUAL-URL-production.up.railway.app/api',
    // ...
}
```

## ÉTAPE 10: Commit et Push
```bash
git add .
git commit -m "Configuration Railway - API_URL mise à jour"
git push origin main
```

## ÉTAPE 11: Tester GitHub Pages
- [ ] Ouvrir https://habibdione.github.io/Redimensionnement-Project-SNG/
- [ ] Ouvrir les DevTools (F12)
- [ ] Vérifier que l'API URL est correcte dans la console
- [ ] Tester les requêtes API

## ÉTAPE 12: Test API Complète
```bash
# Terminal Local
curl https://YOUR-URL-production.up.railway.app/api/health

# Devrait retourner:
# {"success":true,"status":"OK","database":"connected"}
```

---

## 🆘 EN CAS DE PROBLÈME

### L'API ne répond pas (503)?
1. Vérifier les logs Railway: `Railway Dashboard > Logs`
2. Vérifier que `DATABASE_URL` est configurée
3. Attendre 2 minutes le déploiement

### Erreur de connexion BD?
1. Vérifier que PostgreSQL est attachée
2. Vérifier `DATABASE_URL` en Variables
3. Redéployer: `git push origin main`

### CORS error?
1. Vérifier que CORS est activé dans [server.js](server.js)
2. config.js: `origin: '*'` doit être présent

---

## 🎉 RÉSULTAT FINAL

```
GitHub Pages (Frontend)
↓ HTTPS ✅
↓ CORS ✅  
↓
Railway (Backend + PostgreSQL)
↓ Public URL ✅
↓
Application Fonctionnelle! 🚀
```

---

## 📞 SUPPORT RAILWAY

- **Docs**: https://docs.railway.app/
- **Community**: https://discord.gg/railway (Discord)
- **Contact**: support@railway.app
