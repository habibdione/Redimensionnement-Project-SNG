# 🔄 GUIDE: Synchronisation Serveur Local

## 📌 Qu'est-ce que la synchronisation?

La synchronisation garde vos données **en accord** entre:
- **Frontend** (navigateur/localStorage)
- **Backend** (serveur Express - port 3001)
- **PostgreSQL** (base de données)

## 🏗️ Architecture Synchronisation

```
┌─────────────────────────────────────┐
│  NAVIGATEUR (Frontend - index.html) │
│  - Formulaire de collecte           │
│  - localStorage (données offline)   │
└──────────────┬──────────────────────┘
               │ 
               │ POST /api/collecte
               ↓
┌─────────────────────────────────────┐
│  SERVEUR EXPRESS (Backend)          │
│  - Port 3001                        │
│  - Validation des données           │
│  - Gestion des erreurs              │
└──────────────┬──────────────────────┘
               │
               │ INSERT/SELECT
               ↓
┌─────────────────────────────────────┐
│  PostgreSQL (Base de données)       │
│  - Tableau collectes_donnees        │
│  - Stockage permanent               │
└─────────────────────────────────────┘
```

## 🚀 Démarrage Complet

### Étape 1: Vérifier PostgreSQL

```powershell
# Vérifier que PostgreSQL tourne
psql -U postgres -c "SELECT version();"

# Si erreur, démarrer le service:
# Windows Services > PostgreSQL > Démarrer
```

### Étape 2: Lancer le Backend

```powershell
cd "c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"

# Démarrer le serveur
npm start

# Vous devriez voir:
# ✅ Base de données initialisée
# ✅ Connexion PostgreSQL réussie
# ✅ SERVEUR DIMENSIONNEMENT SONAGED ACTIF
# Port: 3001
# URL: http://localhost:3001
```

### Étape 3: Ouvrir l'App

```
http://localhost:3001
```

## 🔄 Types de Synchronisation

### Type 1: En Ligne (Online)

**Quand**: Vous avez une connexion internet
**Flux**: 
1. Remplir le formulaire
2. Cliquez "💾 Sauvegarder"
3. Les données vont directement à PostgreSQL
4. Confirmation: "✅ DONNÉES SAUVEGARDÉES DANS POSTGRESQL!"

### Type 2: Hors Ligne (Offline)

**Quand**: Pas de connexion internet
**Flux**:
1. Remplir le formulaire
2. Cliquez "💾 Sauvegarder"
3. Les données sont sauvegardées dans **localStorage** (navigateur)
4. Message: "💾 Données sauvegardées localement"
5. Dès que vous avez Internet → Synchronisation automatique

### Type 3: Synchronisation Manuelle

**Quand**: Vous avez des données locales à remonter au serveur

```powershell
npm run sync
# ou
node sync-local-server.js
```

## 📡 API Endpoints

### 1. Obtenir l'état du serveur

```bash
GET http://localhost:3001/api/health

# Réponse:
{
  "success": true,
  "status": "OK",
  "database": "connected",
  "timestamp": "2026-02-14T21:52:16.232Z"
}
```

### 2. Créer une nouvelle collecte

```bash
POST http://localhost:3001/api/collecte
Content-Type: application/json

{
  "partenaire": "SONAGED",
  "region": "Dakar",
  "departement": "Dakar",
  "commune": "Dakar",
  "adresse": "Rue X",
  "superficie": 2.5,
  "besoinPersonnel": 5,
  "latitude": 14.6349,
  "longitude": -61.5242,
  "dateCollecte": "2026-02-14T21:52:16Z"
}

# Réponse:
{
  "success": true,
  "data": {
    "id": "22",
    "dateCollecte": "2026-02-14T21:52:16.015Z"
  }
}
```

### 3. Voir toutes les collectes

```bash
GET http://localhost:3001/api/collectes

# Retourne un tableau de toutes les collectes
```

### 4. Voir une collecte spécifique

```bash
GET http://localhost:3001/api/collecte/:id
# Exemple: GET http://localhost:3001/api/collecte/22
```

### 5. Voir les statistiques

```bash
GET http://localhost:3001/api/stats

# Retourne le nombre total de collectes, partenaires, etc.
```

## 🧪 Tests de Synchronisation

### Test 1: Vérifier la connexion

```powershell
# Vérifier que le backend répond
Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing

# Devrait retourner: status: OK, database: connected
```

### Test 2: Tester une sauvegarde

```powershell
# Créer et sauvegarder une collecte de test
node test-save.js

# Vérifier qu'elle est dans la base
psql -U postgres -d dimentionnement_SNG -c "SELECT COUNT(*) FROM collectes_donnees;"
```

### Test 3: Synchronisation complète

```powershell
# Synchroniser les données locales vers le serveur
node sync-local-server.js
```

## 🔧 Configuration Avancée

### Ajouter un endpoint personnalisé

Modifier `server.js` pour ajouter une route:

```javascript
app.get('/api/collectes/:partenaire', async (req, res) => {
    const { partenaire } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM collectes_donnees WHERE partenaire = $1',
            [partenaire]
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

Puis accéder: `http://localhost:3001/api/collectes/SONAGED`

## 🛡️ Sécurité & Bonnes Pratiques

### ✅ À FAIRE

- ✅ Toujours valider les données côté backend
- ✅ Utiliser HTTPS en production
- ✅ Sauvegarder localement si pas de connexion
- ✅ Logger tous les changements
- ✅ Tester régulièrement

### ❌ À NE PAS FAIRE

- ❌ Ne pas exposer les identifiants PostgreSQL en frontend
- ❌ Ne pas faire confiance au localStorage (données non chiffrées)
- ❌ Ne pas synchroniser sans validation
- ❌ Ne pas oublier de démarrer le serveur!

## 🚨 Troubleshooting

### "Cannot GET /"

```
Cause: Serveur Express non lancé
Solution: npm start
```

### "ECONNREFUSED - Connection refused"

```
Cause: Serveur n'écoute pas sur port 3001
Solution: 
  1. Vérifier: npm start
  2. Vérifier le port: PORT=3001 npm start
  3. Tuer le processus existant: Get-NetTCPConnection -LocalPort 3001 | Stop-Process -Force
```

### "EADDRINUSE - Port already in use"

```
Cause: Le port 3001 est déjà utilisé
Solution:
  1. Utiliser un autre port: PORT=3002 npm start
  2. Ou tuer le processus: Stop-Process -Name node -Force
```

### "PostgreSQL connection refused"

```
Cause: PostgreSQL n'est pas en cours d'exécution
Solution:
  1. Ouvrir Services Windows
  2. PostgreSQL > Démarrer
  3. Ou redémarrer: net start postgresql-x64-15
```

### "Base de données n'existe pas"

```
Cause: La base n'a pas été créée
Solution:
  1. La créer manuellement: createdb -U postgres dimentionnement_SNG
  2. Ou relancer le backend (création automatique): npm start
```

## 📊 Vérifier les Données

### Via PostgreSQL

```bash
# Se connecter
psql -U postgres -d dimentionnement_SNG

# Voir toutes les collectes
SELECT id, partenaire, region, date_collecte FROM collectes_donnees ORDER BY date_collecte DESC;

# Voir les 10 dernières
SELECT * FROM collectes_donnees ORDER BY date_collecte DESC LIMIT 10;

# Compter par partenaire
SELECT partenaire, COUNT(*) as total FROM collectes_donnees GROUP BY partenaire;

# Quitter
\q
```

### Via API

```bash
# Voir toutes les collectes
curl http://localhost:3001/api/collectes | jq

# Voir les stats
curl http://localhost:3001/api/stats | jq

# Voir une collecte spécifique
curl http://localhost:3001/api/collecte/22 | jq
```

### Via l'App Web

1. Ouvrir http://localhost:3001
2. Voir le nombre d'enregistrements
3. Vérifier l'affichage de la dernière collecte

## 🔄 Cycle de Vie d'une Collecte

```
1. SAISIE
   - Utilisateur remplit le formulaire
   - GPS activé
   - Photo prise

2. VALIDATION
   - Backend valide les données
   - GPS obligatoire
   - Champs requis

3. SAUVEGARDE
   - INSERT dans PostgreSQL
   - ID retourné
   - Confirmation affichée

4. SYNCHRONISATION
   - Auto si en ligne
   - Manuel si offline
   - Export possible

5. ARCHIVAGE
   - Données permanentes
   - Backups réguliers
   - Exportable (JSON/CSV)
```

## 📝 Notes

- La synchronisation est **bidirectionnelle** (locale ↔ serveur)
- Les données **offline** sont sauvegardées dans localStorage (non chiffré)
- Les données **online** vont directement dans PostgreSQL
- Le formulaire se **vide automatiquement** après sauvegarde
- Les **erreurs** sont loggées dans la console du serveur

---

**Dernière mise à jour**: 14 février 2026
