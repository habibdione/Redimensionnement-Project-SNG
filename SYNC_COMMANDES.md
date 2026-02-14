# SYNCHRONISATION SERVEUR LOCAL - COMMANDES ESSENTIELLES
# ======================================================

## 🚀 DÉMARRAGE RAPIDE

### Option 1: Démarrer avec PowerShell (Recommandé)
```powershell
.\sync-server.ps1
```

### Option 2: Démarrer avec npm
```powershell
npm start
```

### Option 3: Démarrer avec Node.js direct
```powershell
node server.js
```

---

## 🧪 TESTS

### Test 1: Vérifier la base de données
```powershell
node test-db.js
```
✅ Affiche: État de PostgreSQL, tables, colonnes

### Test 2: Tester une sauvegarde complète
```powershell
node test-save.js
```
✅ Affiche: ID enregistrement, vérification en base

### Test 3: Synchroniser les données locales
```powershell
node sync-local-server.js
```
✅ Affiche: Données locales → serveur

---

## 📊 VÉRIFICATION DE L'ÉTAT

### Vérifier que le serveur répond
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing
```

### Voir les données en PostgreSQL
```bash
# Connexion
psql -U postgres -d dimentionnement_SNG

# Commandes utiles:
SELECT COUNT(*) FROM collectes_donnees;                    # Compter
SELECT * FROM collectes_donnees ORDER BY date_collecte DESC LIMIT 5;  # 5 dernières
SELECT partenaire, COUNT(*) FROM collectes_donnees GROUP BY partenaire;  # Par partenaire
```

### Voir les données via l'API
```powershell
# Toutes les collectes
Invoke-WebRequest -Uri "http://localhost:3001/api/collectes" | ConvertFrom-Json

# Une collecte spécifique
Invoke-WebRequest -Uri "http://localhost:3001/api/collecte/22" | ConvertFrom-Json

# Statistiques
Invoke-WebRequest -Uri "http://localhost:3001/api/stats" | ConvertFrom-Json
```

---

## 🔄 FLUX DE SYNCHRONISATION

### 1. Données Online (avec Internet)
```
Formulaire → POST /api/collecte → PostgreSQL
                ↓
          Confirmation immédiate
```

### 2. Données Offline (sans Internet)
```
Formulaire → localStorage (navigateur)
         ↓ (quand Internet revient)
    POST /api/collecte → PostgreSQL
```

### 3. Synchronisation Manuelle
```
node sync-local-server.js
        ↓
localStorage → Serveur → PostgreSQL
```

---

## ⚙️ CONFIGURATION

### Fichier .env
```
DB_USER=postgres
DB_PASSWORD=jtmmaman96
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dimentionnement_SNG
PORT=3001
NODE_ENV=development
```

### Déploiement Production
```
NODE_ENV=production
NODE_ENV=production
API_URL=https://votre-app.railway.app/api
```

---

## 🚨 TROUBLESHOOTING

### Erreur: "Cannot connect to database"
```
1. Vérifier PostgreSQL: Services Windows > PostgreSQL > Démarrer
2. Vérifier .env: DB_HOST, DB_PORT, DB_NAME
3. Tester: psql -U postgres -d dimentionnement_SNG
```

### Erreur: "Port 3001 already in use"
```
# Trouver le processus
Get-NetTCPConnection -LocalPort 3001

# Arrêter tous les processus Node.js
Stop-Process -Name node -Force

# Ou utiliser un autre port
PORT=3002 npm start
```

### Erreur: "Table does not exist"
```
# Créer la base et tables
npm start

# Ou manuellement:
psql -U postgres -d dimentionnement_SNG -f CREATE_TABLES.sql
```

---

## 📈 MONITORING

### Voir les logs en temps réel
```powershell
npm start    # Logs affichés dans la console

# Ou sauvegarder les logs:
npm start 2>&1 | Out-File -FilePath "server.log"

# Ou avec Tee (afficher ET sauvegarder):
npm start 2>&1 | Tee-Object -FilePath "server.log"
```

### Compter les collectes
```sql
SELECT COUNT(*) FROM collectes_donnees;
```

### Voir la dernière collecte
```sql
SELECT * FROM collectes_donnees ORDER BY date_collecte DESC LIMIT 1;
```

---

## 🔐 SÉCURITÉ

### ✅ À FAIRE
- Garder .env en sécurité (jamais en git)
- Utiliser HTTPS en production
- Valider toutes les données
- Faire des backups réguliers

### ❌ À NE PAS FAIRE
- Exposer les identifiants PostgreSQL
- Faire confiance au localStorage
- Oublier de valider les données
- Laisser le serveur en développement en production

---

## 📞 SUPPORT

### Vérifier l'état complet
```powershell
.\sync-server.ps1    # Affiche tout automated
```

### Logs détaillés
```
node server.js         # Affiche les logs
```

### Export des données
```powershell
# JSON
psql -U postgres -d dimentionnement_SNG -c "SELECT * FROM collectes_donnees" --json > collectes.json

# CSV
psql -U postgres -d dimentionnement_SNG -c "COPY collectes_donnees TO STDOUT WITH CSV HEADER" > collectes.csv
```

---

**Dernière mise à jour**: 14 février 2026
