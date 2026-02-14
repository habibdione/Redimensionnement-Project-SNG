# 🚀 GUIDE: Sauvegarde dans PostgreSQL

## ✅ Système Actuel

Les données du formulaire sont **directement sauvegardées dans PostgreSQL** via le backend Express.

## 📋 Architecture

```
Frontend (Navigateur)
    ↓
    | POST /api/collecte
    ↓
Backend Express (server.js)
    ↓
    | INSERT INTO collectes_donnees
    ↓
PostgreSQL Database
```

## 🔧 Configuration Requise

Vérifiez que votre fichier `.env` contient:

```env
DB_USER=postgres
DB_PASSWORD=jtmmaman96
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dimentionnement_SNG
PORT=3001
NODE_ENV=development
```

## ▶️ Démarrage

### 1. Vérifier PostgreSQL

Assurez-vous que PostgreSQL est en cours d'exécution:

```powershell
# Windows - Vérifier le service
Get-Service | grep -i postgres

# Ou ouvrir Services > PostgreSQL > Démarrer
```

### 2. Lancer le Backend

```powershell
cd "c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"
npm start
```

Vous devriez voir:
```
✅ Base de données initialisée
✅ Connexion PostgreSQL réussie
✅ Serveur DIMENSIONNEMENT SONAGED ACTIF
```

### 3. Ouvrir l'App

- **Locale**: http://localhost:3001
- **Web**: Déployer sur GitHub Pages/Railway

## 🧪 Tests

### Test 1: Vérifier la connexion PostgreSQL

```powershell
node test-db.js
```

Vous devriez voir:
```
✅ Connecté à PostgreSQL
✅ Tables trouvées
✅ Tous les tests sont passés
```

### Test 2: Tester la sauvegarde complète

```powershell
node test-save.js
```

Vous devriez voir:
```
✅ DONNÉES SAUVEGARDÉES DANS POSTGRESQL!
✅ SYSTÈME COMPLET FONCTIONNEL!
```

## 📊 Vérifier les Données Sauvegardées

### Via PostgreSQL CLI

```sql
-- Se connecter
psql -U postgres -d dimentionnement_SNG

-- Voir les collectes
SELECT id, partenaire, region, date_collecte FROM collectes_donnees ORDER BY date_collecte DESC;

-- Compter les collectes
SELECT COUNT(*) as total FROM collectes_donnees;

-- Voir les stats
SELECT 
    COUNT(*) as total,
    COUNT(DISTINCT partenaire) as partenaires,
    COUNT(DISTINCT region) as regions
FROM collectes_donnees;
```

### Via l'App Web

L'API fournit plusieurs endpoints:

```
GET  http://localhost:3001/api/health              → Vérifier l'état
GET  http://localhost:3001/api/collectes            → Voir toutes les données
GET  http://localhost:3001/api/collecte/:id         → Voir une collecte spécifique
GET  http://localhost:3001/api/stats                → Voir les statistiques
```

## 🚨 Troubleshooting

### Erreur: "Port 3001 is already in use"

```powershell
# Trouver et tuer le processus
Get-NetTCPConnection -LocalPort 3001 | Stop-Process -Force

# Ou changer le port dans .env
PORT=3002
```

### Erreur: "Impossible de joindre PostgreSQL"

```powershell
# Vérifier PostgreSQL
psql -U postgres

# Si erreur, redémarrer le service
# Windows Services > PostgreSQL > Redémarrer

# Ou via PowerShell
Restart-Service postgresql-x64-15
```

### Erreur: "Base de données n'existe pas"

```powershell
# Créer la base
createdb -U postgres dimentionnement_SNG

# Ou relancer le backend (il la crée automatiquement)
npm start
```

## ✅ Vérifier que tout fonctionne

1. ✅ Backend lancé (`npm start`)
2. ✅ PostgreSQL actif
3. ✅ Formulaire rempli correctement
4. ✅ GPS activé (latitude/longitude)
5. ✅ Cliquer sur "💾 Sauvegarder"
6. ✅ Vérifier le message "✅ DONNÉES SAUVEGARDÉES DANS POSTGRESQL!"
7. ✅ Les données apparaissent dans la base (requête SQL)

## 📝 Notes

- Les données sont sauvegardées **immédiatement** dans PostgreSQL
- En cas d'erreur réseau, elles sont sauvegardées en localStorage
- Les photos sont stockées en BYTEA (format binaire PostgreSQL)
- Tous les champs obligatoires doivent être remplis et validés

## 🔍 Logs

Le backend affiche des logs détaillés pour chaque sauvegarde:

```
📥 NOUVELLE REQUÊTE POST /api/collecte reçue
📋 DÉTAILS DES DONNÉES REÇUES:
   Partenaire: SONAGED
   Région: Dakar
   ...
🔄 Exécution requête SQL INSERT...
✅ INSERTION RÉUSSIE!
   ID enregistrement: 22
```

---

**Dernière mise à jour**: 14 février 2026
