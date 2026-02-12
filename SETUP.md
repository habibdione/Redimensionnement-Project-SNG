## 🚀 INSTALLATION RAPIDE - SONAGED Dimensionnement

### Prérequis
- ✅ Node.js installé (https://nodejs.org/)
- ✅ PostgreSQL lancé (port 5432)
- ✅ Usuario PostgreSQL: `postgres` / Password: `postgres`

---

## Option 1️⃣ : Windows (RECOMMANDÉ)

```bash
# Double-cliquez sur ce fichier:
setup-windows.bat
```

**Ce script:**
1. ✅ Installe les dépendances npm
2. ✅ Crée la base de données PostgreSQL
3. ✅ Lance le serveur Express
4. ✅ Ouvre automatiquement http://localhost:3001

---

## Option 2️⃣ : Manuel (Tous OS)

### Étape 1: Installer les dépendances
```powershell
npm install
```

### Étape 2: Initialiser la base de données
```powershell
node setup-db.js
```

Cela va:
- ✅ Créer la base `dimentionnement_SNG`
- ✅ Créer la table `collectes_donnees` avec 29 colonnes
- ✅ Créer tous les indices pour performance

### Étape 3: Lancer le serveur
```powershell
npm start
```

Le serveur démarre sur **http://localhost:3001**

---

## Option 3️⃣ : SQLTools dans VS Code (Configuration)

### Fichier: `.sqltools.json`
Déjà créé dans le projet avec la config:
- **Serveur:** PostgreSQL
- **Host:** localhost:5432
- **Base:** dimentionnement_SNG
- **User:** postgres

### Test de connexion dans VS Code:
1. Ouvrez le fichier `.sqltools.json`
2. VS Code detectera SQLTools automatiquement
3. Cliquez sur le bouton **📊 Database** en bas à gauche
4. Vous devriez voir "PostgreSQL - dimentionnement_SNG"
5. Cliquez pour vous connecter

---

## ✅ Vérification de l'Installation

### Via PowerShell:
```powershell
# Vérifier PostgreSQL
psql -U postgres -h localhost -d dimentionnement_SNG -c "SELECT COUNT(*) FROM collectes_donnees;"

# Vérifier le serveur
Invoke-WebRequest http://localhost:3001/api/health
```

### Via CLI:
```bash
node setup-db.js
```

---

## 🐛 Troubleshooting

### Erreur: "PostgreSQL n'est pas installé"
**Solution:**
1. Téléchargez: https://www.postgresql.org/download/windows/
2. Installez avec user `postgres` et mot de passe `postgres`
3. Assurez-vous que PostgreSQL tourne (Services Windows)

### Erreur: "Impossible de se connecter au serveur"
**Solution:**
```powershell
# Démarrer PostgreSQL
net start postgresql-x64-15
# (remplacez 15 par votre version)
```

### Erreur: "npm install échoue"
**Solution:**
```powershell
# Effacer le cache
npm cache clean --force

# Réinstaller
npm install
```

---

## 🎯 Utilisation de l'App

1. Ouvrez: **http://localhost:3001**
2. Remplissez le formulaire:
   - 📍 Région/Département/Commune
   - 📡 Cliquez "Obtenir Position GPS"
   - 📸 Capturez une photo
   - ✍️ Remplissez les détails
3. Cliquez **💾 Sauvegarder les Données**
4. Les données vont en PostgreSQL ✅

---

## 📊 Vérifier les données sauvegardées

### Depuis SQLTools VS Code:
1. Cliquez l'icône **📊 Database** en bas
2. Trouvez `collectes_donnees`
3. Cliquez **"Show Table"**

### Depuis pgAdmin (GUI):
1. Ouvrez pgAdmin sur http://localhost:5050
2. Naviguez à `dimentionnement_SNG`
3. Voyez les enregistrements

### Depuis CLI:
```bash
psql -U postgres -d dimentionnement_SNG -c "SELECT id, partenaire, region, commune, date_collecte FROM collectes_donnees ORDER BY date_collecte DESC LIMIT 10;"
```

---

## 🔗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (PWA)                                              │
│  http://localhost:3001                                      │
│  - index.html (formulaire + carte + caméra)                 │
│  - data-senegal.js (14 régions, 45+ depts)                  │
│  - Capture GPS + Photo                                      │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP POST /api/collecte
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Express.js - Node.js)                             │
│  http://localhost:3001                                      │
│  - server.js (API REST)                                     │
│  - Validation des données                                   │
│  - Conversion Photo Base64 → BYTEA                          │
└─────────────────────────────────────────────────────────────┘
                              ↓ INSERT INTO collectes_donnees
┌─────────────────────────────────────────────────────────────┐
│  DATABASE (PostgreSQL)                                       │
│  localhost:5432 - dimentionnement_SNG                       │
│  - Table: collectes_donnees (29 colonnes)                   │
│  - Photo stockée en BYTEA                                   │
│  - Indices créés pour performance                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎓 Crédits

**Application créée par:** Habib DIONE | Chargé SIG Ziguinchor | SONAGED

**Date:** 12 Février 2026

**Version:** 1.0.0 Production Ready ✅

---

**Questions?** Consultez les fichiers de documentation:
- `README_PWA.md` - Guide PWA
- `DEPLOYMENT.md` - Déploiement en production
- `DEVELOPERS_GUIDE.js` - API complète
