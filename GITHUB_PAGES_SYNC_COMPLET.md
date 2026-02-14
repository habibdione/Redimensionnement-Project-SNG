# 🔗 SYNCHRONISER GITHUB PAGES AVEC LA BD

## 🎯 Votre Objectif
Récupérer les données depuis **https://habibdione.github.io/Redimensionnement-Project-SNG/** et les stocker dans la base de données.

---

## ⚡ SOLUTION RAPIDE (5 min)

### TERMINAL 1: Backend local
```bash
npm start
```
✅ Backend sur: `http://localhost:3001`

### TERMINAL 2: Tunnel DevTunnels
```bash
node tunnel-devtunnels.js
```
✅ Vous verrez une URL comme: `https://abc123def-3001.euw.devtunnels.ms`

### TERMINAL 3: Vérifier (optionnel)
```bash
node check-today-data.js
```

### NAVIGATEUR: Ouvrir GitHub Pages (F12 Console)
```javascript
// Modifiez l'URL du serveur pour utiliser le tunnel
API_BASE_URL = 'https://abc123def-3001.euw.devtunnels.ms';
console.log(API_BASE_URL); // Vérifier qu'elle est correcte
```

### Remplir le formulaire → Valider
✅ Les données vont directement en BD!

---

## 📊 FLUX COMPLET

```
┌─────────────────────────────────────────────┐
│ utilisateur sur https://habibdione.github.io│
│ Remplit le formulaire                       │
│ Clique "Valider"                            │
└────────────┬────────────────────────────────┘
             │ POST /api/collecte
             ↓
┌─────────────────────────────────────────────┐
│ DevTunnels Tunnel                           │
│ https://abc123def-3001.euw.devtunnels.ms   │
└────────────┬────────────────────────────────┘
             │ Proxy
             ↓
┌─────────────────────────────────────────────┐
│ Backend Local Node.js                       │
│ http://localhost:3001                       │
│ server.js + db.js                           │
└────────────┬────────────────────────────────┘
             │ INSERT SQL
             ↓
┌─────────────────────────────────────────────┐
│ PostgreSQL Database                         │
│ collectes_donnees                           │
│ ✅ DONNÉES SAUVEGARDÉES                      │
└─────────────────────────────────────────────┘
```

---

## 🚀 ÉTAPES DÉTAILLÉES

### ÉTAPE 1: Démarrer le Backend

```bash
npm start
```

Vous devez voir:
```
✅ Table collectes_donnees créée/existante
✅ Connexion PostgreSQL active
╔═══════════════════════════════════════════╗
║   SERVEUR DIMENSIONNEMENT SONAGED ACTIF  ║
╠═══════════════════════════════════════════╣
║   Port: 3001
║   Health: http://localhost:3001/api/health
╚═══════════════════════════════════════════╝
```

✅ **Status:** Backend prêt

---

### ÉTAPE 2: Lancer le Tunnel

```bash
node tunnel-devtunnels.js
```

Ou directement:
```bash
devtunnel host -p 3001 --allow-anonymous
```

Vous verrez:
```
DevTunnel URL: https://abc123xyz-3001.euw.devtunnels.ms
Accepting from:
  Endpoint: https://abc123xyz-3001.euw.devtunnels.ms
```

**Copiez cette URL!!!** (elle change à chaque lancement)

✅ **Tunnel actif et accessible globalement**

---

### ÉTAPE 3: Tester le Tunnel

Ouvrez dans le navigateur:
```
https://abc123xyz-3001.euw.devtunnels.ms/api/health
```

Vous devez voir:
```json
{"success":true,"status":"OK","database":"connected"}
```

✅ **GitHub Pages peut accéder au backend!**

---

### ÉTAPE 4: Configurer GitHub Pages

Allez à: **https://habibdione.github.io/Redimensionnement-Project-SNG/**

Ouvrez DevTools (F12) → onglet **Console**

Collez ce code (remplacez `abc123xyz` par votre tunnel ID):

```javascript
API_BASE_URL = 'https://abc123xyz-3001.euw.devtunnels.ms';
console.log('✅ Backend configuré sur:', API_BASE_URL);
```

Vous devez voir:
```
✅ Backend configuré sur: https://abc123xyz-3001.euw.devtunnels.ms
```

✅ **Synchronisation configurée!**

---

### ÉTAPE 5: Tester l'Envoi de Données

1. Dans la même page (GitHub Pages)
2. Remplissez le formulaire
3. Cliquez "Valider"
4. Vous devez voir: **"✅ Données synchronisées"**

---

### ÉTAPE 6: Vérifier les Données en BD

```bash
node check-today-data.js
```

Vous devez voir:
```
📅 Données AUJOURD'HUI: X entrées
   1. ID: ...
      Partenaire: [Votre données]
      Région: [Votre région]
      ...
```

✅ **DONNÉES REÇUES ET SAUVEGARDÉES!**

---

## 🔄 RENDRE PERMANENT

### SI le tunnel ID CHANGE à chaque lancement:

Vous devez modifier **index.html** pour mettre l'URL du tunnel:

1. Trouvez la ligne ~874:
```javascript
if (hostname.includes('github.io')) {
    API_BASE_URL = 'https://4mkdbs2k-3001.euw.devtunnels.ms';
```

2. Remplacez par votre nouvelle URL:
```javascript
if (hostname.includes('github.io')) {
    API_BASE_URL = 'https://abc123xyz-3001.euw.devtunnels.ms';  // ← Votre tunnel
```

3. Faites un commit et push:
```bash
git add index.html
git commit -m "Update backend URL"
git push
```

4. Attendez 1-2 min pour la mise à jour
5. Rechargez GitHub Pages

✅ **Maintenant c'est permanent!**

---

## ⚡ COMMANDES UTILES

### Redémarrer TOUT

```powershell
# Terminal 1
npm start

# Terminal 2
node tunnel-devtunnels.js

# Terminal 3
node check-today-data.js
```

### Tester l'envoi décors

```bash
node test-github-pages.js
```

### Diagnostic complet

```bash
node system-diagnostic.js
```

### Voir les données

```bash
node check-today-data.js
```

---

## 🚨 TROUBLESHOOTING

### ❌ "Tunnel pas trouvé"
```
Solution: Installer devtunnel CLI
Windows: choco install devtunnels-cli
Ou: https://aka.ms/devtunnels/clients
```

### ❌ "Backend refuse la connexion"
```
Solution: Vérifier que npm start tourne
Terminal 1: npm start
Vérifier: http://localhost:3001/api/health
```

### ❌ "Données ne s'envoient pas"
```
Solution:
1. console.log(API_BASE_URL) dans DevTools
2. Vérifier l'URL
3. Tester: https://YOUR_TUNNEL/api/health
4. Si timeout → Le tunnel a changé ID
```

### ❌ "Les données ne sont pas en BD"
```
Solution:
1. Vérifier PostgreSQL lancé
2. Tester: node check-today-data.js
3. Vérifier les logs du serveur
```

---

## 📋 CHECKLIST FINAL

- [ ] Backend lancé (`npm start`)
- [ ] Tunnel lancé (`devtunnel host -p 3001`)
- [ ] URL du tunnel notée
- [ ] Tunnel accessible (`https://YOUR_TUNNEL/api/health` = 200)
- [ ] GitHub Pages ouverte
- [ ] API_BASE_URL configurée en console
- [ ] Formulaire rempli et validé
- [ ] Message "Données synchronisées" ✅
- [ ] Données visibles en BD (`node check-today-data.js`)
- [ ] index.html mis à jour avec la bonne URL

---

## 🎉 C'EST RÉGLÉ!

Une fois que vous avez suivi ces étapes:

✅ GitHub Pages envoie les données
✅ Backend reçoit et valide
✅ Données se sauvegardent en PostgreSQL
✅ Aucune donnée n'est perdue

**Le système est maintenant pleinement synchronisé!** 🚀
