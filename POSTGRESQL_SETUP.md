# 🗄️ Guide d'Installation PostgreSQL - Dimensionnement SENELEC

## Table des Matières
1. [Installation PostgreSQL](#installation-postgresql)
2. [Configuration de la Base de Données](#configuration-de-la-base-de-données)
3. [Installation du Serveur Backend](#installation-du-serveur-backend)
4. [Lancement de l'Application](#lancement-de-lapplication)
5. [API Endpoints](#api-endpoints)
6. [Architecture de Base de Données](#architecture-de-base-de-données)
7. [Dépannage](#dépannage)

---

## 📋 Installation PostgreSQL

### Sur Windows

#### 1. Télécharger PostgreSQL
- Visitez: https://www.postgresql.org/download/windows/
- Téléchargez le version 15.x ou plus récente
- Exécutez l'installateur

#### 2. Configuration lors de l'installation
```
Port: 5432 (par défaut)
Utilisateur: postgres
Mot de passe: (à définir - ex: "password")
```

#### 3. Vérifier l'installation
Ouvrez PowerShell et exécutez:
```powershell
psql --version
psql -U postgres -h localhost
```

### Sur macOS

```bash
# Via Homebrew
brew install postgresql@15
brew services start postgresql@15

# Vérifier
psql --version
```

### Sur Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier
sudo -u postgres psql --version
```

---

## 🔧 Configuration de la Base de Données

### 1. Créer l'utilisateur et la base de données

Connectez-vous à PostgreSQL:
```bash
psql -U postgres
```

Exécutez les commandes SQL:
```sql
-- Créer l'utilisateur pour l'application
CREATE USER senelec_user WITH PASSWORD 'senelec_password_123';

-- Créer la base de données
CREATE DATABASE senelec_dimensionnement OWNER senelec_user;

-- Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE senelec_dimensionnement TO senelec_user;

-- Quitter
\q
```

### 2. Configuration du fichier .env

Créez/modifiez le fichier `.env` dans la racine du projet:

```env
# PostgreSQL Configuration
DB_USER=senelec_user
DB_PASSWORD=senelec_password_123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senelec_dimensionnement

# Server Configuration
PORT=3001
NODE_ENV=production

# API URLs
API_URL=http://localhost:3001/api
FRONTEND_URL=http://localhost:5000
```

### 3. Tester la Connexion

```bash
psql -U senelec_user -d senelec_dimensionnement -h localhost
```

Si succès, vous verrez le prompt `senelec_dimensionnement=>`

---

## 🚀 Installation du Serveur Backend

### 1. Installer les dépendances

```bash
# À partir du répertoire du projet
npm install
```

### 2. Initialiser la Base de Données

La base de données se crée automatiquement au démarrage du serveur, mais vous pouvez vérifier:

```bash
npm run serve
```

Le serveur créera automatiquement la table `collectes_donnees` avec tous les indices nécessaires.

---

## ▶️ Lancement de l'Application

### Démarrer le Backend (Terminal 1)

```bash
npm run serve
# ou
npm start
```

Vous devriez voir:
```
╔═══════════════════════════════════════════════╗
║   SERVEUR DIMENSIONNEMENT SENELEC ACTIF       ║
╚═══════════════════════════════════════════════╝
Port: 3001
URL: http://localhost:3001
API: http://localhost:3001/api
Health: http://localhost:3001/api/health
```

### Démarrer le Frontend (Terminal 2)

```bash
npm run frontend
```

Puis ouvrez: `http://localhost:5000`

### Vérifier la Connexion API

Visitez: `http://localhost:3001/api/health`

Vous devriez voir:
```json
{
  "success": true,
  "status": "OK",
  "database": "connected",
  "timestamp": "2026-02-12T10:30:00.000Z"
}
```

---

## 📡 API Endpoints

### POST /api/collecte
**Sauvegarder une nouvelle collecte**

```bash
curl -X POST http://localhost:3001/api/collecte \
  -H "Content-Type: application/json" \
  -d '{
    "partenariat": "SONAGED",
    "region": "Ziguinchor",
    "departement": "Ziguinchor",
    "commune": "Ziguinchor",
    "typeActivite": "Collecte",
    "siteConcerne": "Agence principal",
    "adresse": "Rue du Commerce",
    "superficie": 2.81,
    "besoinPersonnel": 5,
    "dispositifDeploy": "Camion BTP",
    "nombreRotation": 3,
    "infrastructureGestion": "PRN",
    "prnPp": "PRN",
    "frequenceCollecte": "F1",
    "bacs240": 10,
    "caissePolybene": 5,
    "bacs660": 3,
    "accessibilite": "Facile",
    "latitude": 13.1939,
    "longitude": -15.5277,
    "precision": 8.5,
    "observation": "Site accessible",
    "image1": null
  }'
```

### GET /api/collectes
**Récupérer toutes les collectes (avec pagination)**

```bash
curl http://localhost:3001/api/collectes?page=1&limit=10
```

### GET /api/collecte/:id
**Récupérer une collecte spécifique**

```bash
curl http://localhost:3001/api/collecte/1
```

### GET /api/collectes/partenariat/:partenariat
**Récupérer les collectes par partenariat**

```bash
curl http://localhost:3001/api/collectes/partenariat/SONAGED
```

### PUT /api/collecte/:id
**Mettre à jour une collecte**

```bash
curl -X PUT http://localhost:3001/api/collecte/1 \
  -H "Content-Type: application/json" \
  -d '{...données modifiées...}'
```

### DELETE /api/collecte/:id
**Supprimer une collecte**

```bash
curl -X DELETE http://localhost:3001/api/collecte/1
```

### GET /api/statistiques
**Obtenir les statistiques**

```bash
curl http://localhost:3001/api/statistiques
```

### GET /api/health
**Vérifier l'état du serveur**

```bash
curl http://localhost:3001/api/health
```

---

## 📊 Architecture de Base de Données

### Table: collectes_donnees

```sql
CREATE TABLE collectes_donnees (
    id SERIAL PRIMARY KEY,
    partenariat VARCHAR(255),
    region VARCHAR(255),
    departement VARCHAR(255),
    commune VARCHAR(255),
    type_activite TEXT,
    site_concerne VARCHAR(500),
    adresse VARCHAR(500),
    superficie DECIMAL(10, 2),
    besoin_personnel INTEGER,
    dispositif_deploye TEXT,
    nombre_rotation INTEGER,
    infrastructure_gestion VARCHAR(50),
    prn_pp VARCHAR(50),
    frequence_collecte VARCHAR(50),
    bacs_240l INTEGER DEFAULT 0,
    caisse_polybene INTEGER DEFAULT 0,
    bacs_660l INTEGER DEFAULT 0,
    accessibilite VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    precision DECIMAL(10, 2),
    observation TEXT,
    image_1 LONGTEXT,
    date_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices pour les performances
CREATE INDEX idx_date_collecte ON collectes_donnees (date_collecte DESC);
CREATE INDEX idx_partenariat ON collectes_donnees (partenariat);
```

---

## 🔍 Requêtes PostgreSQL Utiles

### Voir toutes les collectes

```sql
SELECT * FROM collectes_donnees ORDER BY date_collecte DESC;
```

### Statistiques par Partenariat

```sql
SELECT 
    partenariat,
    COUNT(*) as nombre_collectes,
    SUM(CAST(superficie AS FLOAT)) as superficie_totale,
    SUM(besoin_personnel) as personnel_total
FROM collectes_donnees
GROUP BY partenariat
ORDER BY nombre_collectes DESC;
```

### Statistiques par Commune

```sql
SELECT 
    commune,
    COUNT(*) as nombre_sites,
    AVG(CAST(superficie AS FLOAT)) as superficie_moyenne
FROM collectes_donnees
GROUP BY commune;
```

### Exporter en CSV

```bash
psql -U senelec_user -d senelec_dimensionnement -c "
\copy (SELECT * FROM collectes_donnees ORDER BY date_collecte DESC) 
TO STDOUT WITH CSV HEADER;" > export.csv
```

---

## 🐛 Dépannage

### Erreur: "connection refused"
```
❌ Problem: Le serveur PostgreSQL n'est pas en cours d'exécution

Solution:
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### Erreur: "authentication failed"
```
❌ Problem: Nom d'utilisateur ou mot de passe incorrect

Solution:
1. Vérifier les variables d'environnement dans .env
2. Réinitialiser le mot de passe PostgreSQL:

psql -U postgres -c "ALTER USER senelec_user WITH PASSWORD 'new_password';"
```

### Erreur: "database does not exist"
```
❌ Problem: La base de données n'existe pas

Solution:
Connectez-vous et créez-la:
psql -U postgres -c "CREATE DATABASE senelec_dimensionnement OWNER senelec_user;"
```

### Port 5432 déjà utilisé
```
❌ Problem: Autre processus utilise le port 5432

Solution:
# Windows
netstat -ano | findstr :5432

# macOS/Linux
lsof -i :5432
kill -9 <PID>
```

### Performance lente

```sql
-- Analyser la performance
EXPLAIN ANALYZE SELECT * FROM collectes_donnees;

-- Rendre les indices à jour
REINDEX TABLE collectes_donnees;

-- Optimiser la base de données
VACUUM ANALYZE collectes_donnees;
```

---

## 📝 Notes Importantes

1. **Sauvegarde des données**
   ```bash
   pg_dump -U senelec_user senelec_dimensionnement > backup_$(date +%Y%m%d).sql
   ```

2. **Restauration**
   ```bash
   psql -U senelec_user senelec_dimensionnement < backup_20260212.sql
   ```

3. **Sécurité**
   - Ne pas partager le mot de passe PostgreSQL
   - Utiliser HTTPS en production
   - Mettre à jour PostgreSQL régulièrement

4. **Monitoring**
   - Monitorer l'utilisation du disque: `df -h`
   - Vérifier les connexions: `SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;`
   - Vérifier la taille de la base: `SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size FROM pg_database;`

---

## 📚 Ressources

- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Node.js PostgreSQL Client](https://node-postgres.com/)
- [pgAdmin - Interface Graphique](https://www.pgadmin.org/)

---

**Dernière mise à jour:** 12 Février 2026  
**Version:** 1.0.0  
**Auteur:** SENELEC
