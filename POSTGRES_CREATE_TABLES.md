# 🗄️ GUIDE DE CRÉATION DES TABLES PostgreSQL

## 📊 Base de Données: `dimentionnement_SNG`

Votre base de données PostgreSQL est créée. Maintenant créons les tables pour stocker les collectes de données.

---

## 🎯 Table Principale: `collectes_donnees`

**Colonnes:** 26 champs pour dimensionner les systèmes d'assainissement

```
id (PK)                    → Identifiant unique auto-incrémenté
partenariat                → Nom du partenaire
region                     → Région administrative
departement                → Département
commune                    → Commune
type_activite              → Type d'activité (peut être multiple)
site_concerne              → Site concerné par la collecte
adresse                    → Adresse complète
superficie                 → Superficie (m²)
besoin_personnel           → Nombre de personnes
dispositif_deploye         → Dispositif de collecte déployé
nombre_rotation            → Nombre de rotations
infrastructure_gestion     → Type d'infrastructure
prn_pp                     → PRN ou PP
frequence_collecte         → Fréquence de collecte
bacs_240l                  → Nombre de bacs 240L
caisse_polybene            → Nombre de caisses Polybène
bacs_660l                  → Nombre de bacs 660L
accessibilite              → Accessibilité du site
latitude                   → Latitude GPS
longitude                  → Longitude GPS
precision                  → Précision GPS
observation                → Observations générales
image_1                    → Première image (stockage binaire)
```

---

## 🚀 MÉTHODE 1: Exécuter le Fichier SQL (Recommandé)

### Option A: Avec pgAdmin (UI - Facile)

**1. Ouvrir pgAdmin**
```
Ouvrir navigateur → http://localhost:5050
Login avec vos credentials
```

**2. Naviguer**
```
Clic droit sur "dimentionnement_SNG"
→ Query Tool
```

**3. Copier/Coller le SQL**
```sql
-- Copier tout le contenu de CREATE_TABLES.sql
-- Coller dans pgAdmin
-- Clic "Execute" (ou F6)
```

### Option B: Avec psql (Ligne de commande - Rapide)

**Windows (PowerShell ou CMD):**
```powershell
# Ouvrir une terminal
# Aller dans le dossier du projet
cd c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG

# Exécuter le fichier SQL
psql -U dimentionnement_SNG -d dimentionnement_SNG -f CREATE_TABLES.sql

# Vous verrez:
# CREATE TABLE
# CREATE INDEX
```

**Linux/Mac:**
```bash
cd ~/Redimensionnement-Project-SNG
psql -U dimentionnement_SNG -d dimentionnement_SNG -f CREATE_TABLES.sql
```

---

## 🚀 MÉTHODE 2: Exécuter depuis Node.js

### Automatique (Recommandé)

```bash
# Simplement lancer le serveur
npm start

# Le serveur exécute db.js qui:
# 1. Se connecte à PostgreSQL
# 2. Crée la table automatiquement
# 3. Crée les indices
# 4. Affiche les messages ✅
```

**Résultat dans la console:**
```
✅ Table collectes_donnees créée/existante
✅ Index créé sur date_collecte
✅ Index créé sur partenariat
✅ Connexion PostgreSQL active: 2026-02-12 14:35:22.123456
```

### Manuel

```bash
# Créer un fichier test-db.js
node -e "require('./db.js')"
```

---

## ✅ VÉRIFIER LA CRÉATION

### Vérification 1: Voir la Table

**Avec psql:**
```bash
psql -U dimentionnement_SNG -d dimentionnement_SNG

# Dans psql
\dt collectes_donnees;

# Résultat:
# ┌──────────────────────┐
# │        Table         │
# ├──────────────────────┤
# │ collectes_donnees    │
# └──────────────────────┘
```

**Avec pgAdmin:**
```
Clic: postgres → Schemas → public → Tables
→ Voir "collectes_donnees"
```

### Vérification 2: Voir les Colonnes

```psql
psql -U dimentionnement_SNG -d dimentionnement_SNG

\d collectes_donnees;
```

**Résultat attendu:**
```
                          Table "public.collectes_donnees"
       Column        │           Type           │                    Modifiers
─────────────────────┼──────────────────────────┼─────────────────────────────
 id                  │ integer                  │ not null default nextval('c...')
 partenariat         │ character varying(255)   │
 region              │ character varying(255)   │
 departement         │ character varying(255)   │
 commune             │ character varying(255)   │
 type_activite       │ text                     │
 site_concerne       │ character varying(500)   │
 adresse             │ character varying(500)   │
 superficie          │ numeric(10,2)            │
 besoin_personnel    │ integer                  │
 ... (plus 16 colonnes)
```

### Vérification 3: Voir les Indices

```psql
psql -U dimentionnement_SNG -d dimentionnement_SNG

SELECT indexname FROM pg_indexes 
WHERE tablename = 'collectes_donnees';
```

**Résultat attendu:**
```
         indexname
─────────────────────────━
 collectes_donnees_pkey
 idx_date_collecte
 idx_partenariat
 idx_region
 idx_commune
 idx_statut
```

---

## 📝 INSÉRER DES DONNÉES DE TEST

```sql
-- Insérer une collecte test
INSERT INTO collectes_donnees (
    partenariat,
    region,
    departement,
    commune,
    type_activite,
    site_concerne,
    adresse,
    superficie,
    besoin_personnel,
    latitude,
    longitude,
    statut
) VALUES (
    'SONAGED',
    'Dakar',
    'Dakar',
    'Ouakam',
    'Résidentiel',
    'Complexe Résidentiel A',
    '123 Rue de la Gare, Dakar',
    500.50,
    150,
    14.6925,
    -17.0412,
    'actif'
);

-- Vérifier l'insertion
SELECT COUNT(*) FROM collectes_donnees;
-- Résultat: 1
```

---

## 🛠️ TESTER L'INTÉGRATION

### Test 1: Créer une Collecte via API

```bash
# Terminal 1: Démarrer le serveur
npm start

# Terminal 2: Tester l'API
curl -X POST http://localhost:3001/api/collecte \
  -H "Content-Type: application/json" \
  -d '{
    "partenariat": "SONAGED",
    "region": "Dakar",
    "commune": "Ouakam",
    "type_activite": "Résidentiel",
    "site_concerne": "Site Test 1",
    "latitude": 14.6925,
    "longitude": -17.0412,
    "statut": "actif"
  }'

# Résultat attendu:
# {
#   "success": true,
#   "message": "Collecte sauvegardée",
#   "id": 1
# }
```

### Test 2: Récupérer les Collectes

```bash
curl http://localhost:3001/api/collectes

# Résultat:
# {
#   "success": true,
#   "total": 1,
#   "data": [
#     {
#       "id": 1,
#       "partenariat": "SONAGED",
#       ...
#     }
#   ]
# }
```

### Test 3: Exporter en CSV

```bash
curl http://localhost:3001/api/export/csv > collectes.csv

# Fichier CSV créé avec toutes les données
```

---

## 🗄️ STRUCTURE DE LA BASE

```
dimentionnement_SNG (Database)
└── public (Schema)
    └── collectes_donnees (Table)
        ├── id (PK, Serial)
        ├── partenariat (VARCHAR)
        ├── region (VARCHAR)
        ├── departement (VARCHAR)
        ├── commune (VARCHAR)
        ├── type_activite (TEXT)
        ├── site_concerne (VARCHAR)
        ├── adresse (VARCHAR)
        ├── superficie (Decimal)
        ├── besoin_personnel (Integer)
        ├── dispositif_deploye (TEXT)
        ├── nombre_rotation (Integer)
        ├── infrastructure_gestion (VARCHAR)
        ├── prn_pp (VARCHAR)
        ├── frequence_collecte (VARCHAR)
        ├── bacs_240l (Integer)
        ├── caisse_polybene (Integer)
        ├── bacs_660l (Integer)
        ├── accessibilite (VARCHAR)
        ├── latitude (Decimal)
        ├── longitude (Decimal)
        ├── precision (Decimal)
        ├── observation (TEXT)
        ├── image_1 (LONGTEXT)
        ├── date_collecte (Timestamp)
        ├── date_modification (Timestamp)
        ├── statut (VARCHAR)
        ├── created_at (Timestamp)
        ├── updated_at (Timestamp)
        │
        └── Indices:
            ├── idx_date_collecte (date_collecte DESC)
            ├── idx_partenariat (partenariat)
            ├── idx_region (region)
            ├── idx_commune (commune)
            └── idx_statut (statut)
```

---

## 🆘 TROUBLESHOOTING

### Erreur: "role dimentionnement_SNG does not exist"

```bash
# Créer l'utilisateur d'abord
createuser -U postgres -P dimentionnement_SNG

# Puis créer la base
createdb -U postgres -O dimentionnement_SNG dimentionnement_SNG
```

### Erreur: "permission denied"

```bash
# Donner les permissions
psql -U postgres

ALTER USER dimentionnement_SNG WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE dimentionnement_SNG TO dimentionnement_SNG;
```

### Table existe déjà

```bash
# Ne pas inverser - le script utilise CREATE TABLE IF NOT EXISTS
# Aucun problème à le réexécuter
psql -U dimentionnement_SNG -d dimentionnement_SNG -f CREATE_TABLES.sql
```

### Connexion refusée

```bash
# Vérifier que PostgreSQL est actif
pg_isready -h localhost -p 5432

# Si "accepting connections" - OK
# Sinon, démarrer PostgreSQL
```

---

## ✅ CHECKLIST

- [ ] Base de données `dimentionnement_SNG` créée
- [ ] Table `collectes_donnees` créée (26 colonnes)
- [ ] 5 indices créés pour performance
- [ ] Test insertion données réussi
- [ ] API POST /api/collecte fonctionne
- [ ] API GET /api/collectes fonctionne
- [ ] CSV export fonctionne
- [ ] Frontend peut créer collectes

---

## 📚 FICHIERS IMPLIQUÉS

| Fichier | Description |
|---------|-------------|
| [CREATE_TABLES.sql](CREATE_TABLES.sql) | Script SQL pour créer les tables |
| [db.js](db.js) | Configuration PostgreSQL (Node.js) |
| [server.js](server.js) | API Express (utilise les tables) |
| [.env](.env) | Configuration (DB_USER, DB_PASSWORD, etc.) |

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ **Créer les tables** (MAINTENANT)
   ```bash
   psql -U dimentionnement_SNG -d dimentionnement_SNG -f CREATE_TABLES.sql
   ```

2. 🚀 **Démarrer le serveur**
   ```bash
   npm start
   ```

3. 🌐 **Tester le frontend**
   ```
   https://habibdione.github.io/Redimensionnement-Project-SNG/
   ```

4. 📤 **Créer une collecte test**

---

**Version:** 1.0.0  
**Date:** 12 Février 2026  
**Status:** ✅ Prêt à exécuter!

🚀 **Let's Create Tables!** 🚀
