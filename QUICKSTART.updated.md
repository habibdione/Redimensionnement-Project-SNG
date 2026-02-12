# 🚀 DÉMARRAGE RAPIDE - Dimensionnement SENELEC avec PostgreSQL

## ⚡ Démarrage en 5 minutes

### Étape 1: Installer PostgreSQL

**Windows:**
1. Téléchargez: https://www.postgresql.org/download/windows/
2. Installez avec mot de passe simple (ex: `password`)
3. Port: `5432` (par défaut)

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu):**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Étape 2: Créer la Base de Données

```bash
# Connectez-vous à PostgreSQL
psql -U postgres

# Exécutez ces commandes SQL:
CREATE USER senelec_user WITH PASSWORD 'senelec_password_123';
CREATE DATABASE senelec_dimensionnement OWNER senelec_user;
GRANT ALL PRIVILEGES ON DATABASE senelec_dimensionnement TO senelec_user;
\q
```

### Étape 3: Configurer l'Application

1. Ouvrez le fichier `.env`
2. Déjà configuré avec les bonnes valeurs!
3. Si vous avez changé le mot de passe PostgreSQL, mettez à jour:

```env
DB_PASSWORD=votre_mot_de_passe_postgresql
```

### Étape 4: Installer les Dépendances

```bash
npm install
```

### Étape 5: Démarrer l'Application

**Terminal 1 - Serveur Backend :**
```bash
npm start
```

Attendez le message:
```
✅ Base de données initialisée
SERVEUR DIMENSIONNEMENT SENELEC ACTIF
Port: 3001
```

**Terminal 2 - Frontend :**
```bash
npm run frontend
```

### Étape 6: Utiliser l'Application

Ouvrez: **http://localhost:5000**

✅ **C'est prêt!**

---

## 📋 Checklist de Configuration

- [ ] PostgreSQL installé et en cours d'exécution
- [ ] Base de données `senelec_dimensionnement` créée
- [ ] Utilisateur `senelec_user` créé
- [ ] Fichier `.env` configuré
- [ ] `npm install` exécuté
- [ ] Serveur backend démarré (`npm start`)
- [ ] Frontend démarré (`npm run frontend`)
- [ ] Application accessible à http://localhost:5000

---

## 🧪 Tester l'API

### Vérifier la Connexion

```bash
curl http://localhost:3001/api/health
```

Réponse attendue:
```json
{
  "success": true,
  "status": "OK",
  "database": "connected"
}
```

### Créer une Collecte (Test)

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
    "superficie": 2.5,
    "besoinPersonnel": 5,
    "dispositifDeploy": "Camion BTP",
    "nombreRotation": 2,
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
    "observation": "Test data"
  }'
```

### Récupérer les Collectes

```bash
curl http://localhost:3001/api/collectes
```

---

## 🎯 Fonctionnalités Principales

### ✅ Sélectionner Plusieurs Type d'Activité

```
Type d'Activité (multiselection):
☑ Levé des dechets vert
☑ Desherbage
☑ Mecanisation
☐ Collecte
☐ Balayage
```

### ✅ Enregistrer un Partenaire

```
Partenaire: SONAGED, ONG, Helvetica, etc.
```

### ✅ Sauvegarder en PostgreSQL

- Cliquer: 🗄️ "Sauvegarder en Base de Données"
- Les données sont le serveur
- Confirmé par notification

### ✅ Exporter en CSV

- Cliquer: 📥 "Exporter en CSV"
- Téléchargement du fichier CSV

### ✅ Logo SONAGED

Le logo est visible dans l'en-tête de l'application

---

## 📊 Voir les Données dans PostgreSQL

```bash
# Connecter à la base de données
psql -U senelec_user -d senelec_dimensionnement

# Voir toutes les collectes
SELECT * FROM collectes_donnees;

# Voir les collectes d'un partenaire
SELECT * FROM collectes_donnees WHERE partenariat = 'SONAGED';

# Voir les statistiques
SELECT COUNT(*) FROM collectes_donnees;
SELECT DISTINCT partenariat FROM collectes_donnees;
```

---

## 🆘 Dépannage Rapide

### ❌ "connection refused"
```bash
# Vérifier si PostgreSQL est en cours d'exécution
# Windows:
pg_ctl status

# macOS:
brew services list

# Linux:
sudo systemctl status postgresql
```

### ❌ "Cannot GET /api/health"
```bash
# Le serveur backend n'est pas démarré
# Terminal: npm start
```

### ❌ "Permission denied"
```bash
# Variables d'environnement incorrectes
# Vérifier .env avec les bonnes identifiants
```

---

## 📁 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `index.html` | Application PWA |
| `api-client.js` | Client API frontend |
| `server.js` | Serveur Express |
| `db.js` | Configuration PostgreSQL |
| `.env` | Configuration sensible |
| `package.json` | Dépendances |

---

## 📚 Documentation Complète

Pour plus de détails:
- Voir [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md) pour l'installation
- Voir [USAGE_GUIDE.md](USAGE_GUIDE.md) pour l'utilisation

---

## 🎉 Succès!

Vous avez maintenant une application PWA fonctionnelle avec:
- ✅ Sauvegarde en PostgreSQL
- ✅ Support multi-partenaires
- ✅ Sélection multiple des activités
- ✅ Export de données en CSV
- ✅ Logo SONAGED
- ✅ API RESTful complète

**Bon travail! 🚀**

---

**Version:** 1.0.0  
**Date:** 12 Février 2026
