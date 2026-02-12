# 🚀 Guide d'Utilisation - Application Dimensionnement SENELEC avec PostgreSQL

## Vue d'ensemble

L'application Dimensionnement SENELEC est maintenant capable de :
- ✅ Collecter des données sur le terrain via l'interface PWA
- ✅ Sélectionner **plusieurs Type d'Activité**
- ✅ Enregistrer un **Partenaire** pour chaque collecte
- ✅ Sauvegarder les données dans une **base de données PostgreSQL**
- ✅ Exporter les données en **CSV**
- ✅ Travailler avec multiples **partenariats**

---

## 🎯 Données Collectées

L'application collecte les colonnes suivantes dans PostgreSQL :

| Colonne | Type | Description |
|---------|------|-------------|
| **Partenariat** | VARCHAR(255) | Nom du partenaire (SONAGED, ONG, etc.) |
| **Région** | VARCHAR(255) | Région administrative |
| **Département** | VARCHAR(255) | Département |
| **Commune** | VARCHAR(255) | Commune |
| **Type d'Activité** | TEXT | Types multiples séparés par virgule |
| **Site Concerné** | VARCHAR(500) | Site de l'activité |
| **Adresse** | VARCHAR(500) | Adresse détaillée |
| **Superficie (ha)** | DECIMAL(10,2) | Surface en hectares |
| **Besoin en Personnel** | INTEGER | Nombre de personnes requises |
| **Dispositif Déployé** | TEXT | Équipements déployés |
| **Nombre de Rotation** | INTEGER | Nombre de rotations |
| **Infrastructure de Gestion** | VARCHAR(50) | PRN ou PP |
| **PRN/PP** | VARCHAR(50) | Type d'infrastructure |
| **Fréquence de Collecte** | VARCHAR(50) | F1 à F7 |
| **Bacs 240L** | INTEGER | Nombre de bacs 240L |
| **Caisse Polybene** | INTEGER | Nombre de caisses |
| **Bacs 660L** | INTEGER | Nombre de bacs 660L |
| **Accessibilité** | VARCHAR(100) | Facile / Difficile / Route |
| **Latitude** | DECIMAL(10,8) | Coordonnée GPS |
| **Longitude** | DECIMAL(11,8) | Coordonnée GPS |
| **Précision (m)** | DECIMAL(10,2) | Précision GPS en mètres |
| **Observation** | TEXT | Notes supplémentaires |
| **Image 1** | LONGTEXT | Photo capturée en base64 |

---

## 📱 Utilisation de l'Application

### 1. Démarrer l'Application

**Terminal 1 - Backend :**
```bash
npm start
```

**Terminal 2 - Frontend :**
```bash
npm run frontend
```

Puis ouvrez : http://localhost:5000

### 2. Remplir le Formulaire

#### Section: Informations du Site

```
Région : Région de Ziguinchor (prérempli)
Département : Ziguinchor / Bignona / Oussouye
Commune : Sélectionner la commune
```

#### Sélectionner Plusieurs Type d'Activité

```
Type d'Activité:
✓ Levé des dechets vert
✓ Desherbage
✓ Mecanisation (Hold Ctrl/Cmd pour sélectionner plusieurs)
✓ Collecte
✓ Balayage

💡 Sur Windows: Maintenez Ctrl + Clic
💡 Sur Mac: Maintenez Cmd + Clic
💡 Sur Phone: Appuyez et maintenez
```

#### Partenaire (Nouveau Champ)

```
Partenaire: SONAGED, Helvetica, ONG, etc.
```

#### Site Concerné

```
Sélectionner parmi la liste des sites par département
Ou saisir un nouveau site
```

#### Autres Champs

```
- Adresse : Saisir l'adresse détaillée
- Superficie : 2.81 (en hectares)
- Besoin en Personnel : 5 (nombre de personnes)
- Dispositif Déployé : Sélectionner plusieurs
- Nombre de Rotation : 3
- Infrastructure de Gestion : PRN ou PP
- Fréquence de Collecte : F1 à F7
- Bacs 240L : 10
- Caisse Polybene : 5
- Bacs 660L : 3
- Accessibilité : Facile / Difficile
- Observations : Texte libre
```

### 3. Localisation GPS

```
1. Cliquer sur "📡 Obtenir Position GPS"
2. Autoriser l'accès au GPS
3. Les coordonnées apparaissent:
   - Latitude / Longitude (WGS84)
   - Précision (en mètres)
```

### 4. Capturer une Photo

```
1. Cliquer sur "📹 Démarrer Caméra"
2. Cliquer sur "📸 Capturer Photo"
3. Vérifier la photo
4. Cliquer sur "✓" pour confirmer
```

### 5. Sauvegarder les Données

#### Option 1: Sauvegarde Locale

```
Cliquer sur 💾 "Sauvegarder Localement"
→ Les données sont sauvegardées dans le navigateur
→ Peut être utilisé hors ligne
```

#### Option 2: Sauvegarder en Base de Données (Recommandé ✅)

```
Cliquer sur 🗄️ "Sauvegarder en Base de Données"
→ Les données sont envoyées au serveur PostgreSQL
→ Statut: "✅ Données sauvegardées avec succès"
```

### 6. Exporter les Données

#### Exporter en CSV

```
Cliquer sur 📥 "Exporter en CSV"
→ Télécharge un fichier `.csv`
→ Peut être ouvert dans Excel
```

#### Imprimer

```
Cliquer sur 🖨️ "Imprimer"
→ Fenêtre d'impression du navigateur
```

---

## 💾 Base de Données PostgreSQL

### Vérifier les Données

```bash
# Se connecter à PostgreSQL
psql -U senelec_user -d senelec_dimensionnement

# Voir toutes les collectes
SELECT * FROM collectes_donnees;

# Voir les collectes d'un partenaire
SELECT * FROM collectes_donnees WHERE partenariat = 'SONAGED';

# Quitter
\q
```

### Export Automatique

```bash
# Export en CSV
psql -U senelec_user -d senelec_dimensionnement \
  -c "\copy (SELECT * FROM collectes_donnees) TO 'export.csv' WITH CSV HEADER"

# Export en JSON (via script)
node export-json.js
```

---

## 🤝 Travail avec Multiples Partenaires

### Scénario 1: SONAGED collecte des données

```
1. Remplir le formulaire
2. Partenaire: "SONAGED"
3. Sauvegarder en Base de Données
→ Les données sont marquées comme partenariat: SONAGED
```

### Scénario 2: ONG collecte des données pour le même site

```
1. Remplir le formulaire (même site)
2. Partenaire: "ONG-Helvetica"
3. Sauvegarder en Base de Données
→ Les données sont marquées comme partenariat: ONG-Helvetica
```

### Scénario 3: Récupérer les données d'un partenaire

```bash
# Via l'API
curl http://localhost:3001/api/collectes/partenariat/SONAGED

# Réponse JSON avec toutes les collectes du partenaire
{
  "success": true,
  "count": 5,
  "data": [
    {...},
    {...}
  ]
}
```

---

## 📊 Statistiques et Rapports

### Voir les Statistiques

```bash
curl http://localhost:3001/api/statistiques

# Réponse:
{
  "success": true,
  "data": {
    "total_collectes": 42,
    "nombre_partenariats": 3,
    "nombre_departements": 3,
    "nombre_communes": 8,
    "superficie_totale": 125.45,
    "personnel_total": 156
  }
}
```

### Rapports Personnalisés

```sql
-- Rapport par Commune
SELECT 
    commune,
    COUNT(*) as nombre_sites,
    SUM(CAST(superficie AS FLOAT)) as superficie
FROM collectes_donnees
GROUP BY commune;

-- Rapport par Type d'Activité
SELECT 
    type_activite,
    COUNT(*) as nombre_collectes
FROM collectes_donnees
GROUP BY type_activite;

-- Rapport par Partenariat
SELECT 
    partenariat,
    COUNT(*) as nombre_collectes,
    SUM(besoin_personnel) as personnel_total
FROM collectes_donnees
GROUP BY partenariat;
```

---

## 🔧 Troubleshooting

### Les données ne sont pas sauvegardées

```
✓ Vérifier que le serveur est actif: http://localhost:3001/api/health
✓ Vérifier les erreurs dans la console du navigateur (F12)
✓ Vérifier que tous les champs requis sont remplis
✓ Vérifier la connexion PostgreSQL
```

### Erreur "Impossible de se connecter au serveur"

```
✓ S'assurer que le serveur Node.js est démarré (npm start)
✓ Vérifier que PostgreSQL est en cours d'exécution
✓ Vérifier les variables d'environnement dans .env
✓ Redémarrer le serveur: npm start
```

### Erreur GPS

```
✓ Autoriser l'accès au GPS dans les paramètres du navigateur
✓ S'assurer d'être en plein air
✓ Le GPS peut mettre 30 secondes à se verrouiller
✓ Vérifier que le navigateur supporte l'API Geolocation
```

---

## 🌐 API RESTful

L'application utilise une API RESTful pour communiquer avec PostgreSQL.

### Endpoints Disponibles

```
POST   /api/collecte           → Créer une collecte
GET    /api/collecte/:id       → Récupérer une collecte
GET    /api/collectes          → Récupérer toutes les collectes
GET    /api/collectes/partenariat/:partenariat → Collectes par partenaire
PUT    /api/collecte/:id       → Modifier une collecte
DELETE /api/collecte/:id       → Supprimer une collecte
GET    /api/statistiques       → Statistiques générales
GET    /api/health             → État du serveur
```

### Exemple d'Appel API

```javascript
// Récupérer les collectes
const response = await fetch('http://localhost:3001/api/collectes?page=1&limit=10');
const data = await response.json();
console.log(data);

// Résultat:
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  },
  "data": [...]
}
```

---

## 📁 Structure des Fichiers

```
projet/
├── index.html              (application PWA)
├── api-client.js           (client API frontend)
├── server.js               (serveur Express)
├── db.js                   (configuration PostgreSQL)
├── .env                    (variables d'environnement)
├── package.json            (dépendances Node.js)
└── POSTGRESQL_SETUP.md     (guide d'installation)
```

---

## 🔐 Sécurité

### Bonnes Pratiques

1. **Ne pas partager le .env** - Contient les identifiants PostgreSQL
2. **HTTPS en production** - Utiliser SSL/TLS
3. **Authentification** - Ajouter un système de login
4. **Validation** - Valider les données entrantes
5. **Backup réguliers** - Sauvegarder la base de données

### Sauvegarde

```bash
# Sauvegarder la base de données
pg_dump -U senelec_user senelec_dimensionnement > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurer depuis une sauvegarde
psql -U senelec_user senelec_dimensionnement < backup_20260212_100000.sql
```

---

## 📞 Support

Pour les problèmes :
1. Consulter les logs : `npm start` affiche les erreurs
2. Vérifier la console navigateur (F12 → Console)
3. Vérifier les tables PostgreSQL : `psql -U senelec_user senelec_dimensionnement`

---

**Version:** 1.0.0  
**Dernière mise à jour:** 12 Février 2026  
**Auteur:** SENELEC
