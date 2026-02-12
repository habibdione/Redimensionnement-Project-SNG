# 🗺️ Mise à jour des données géographiques du Sénégal

**Date:** 12 Février 2026

## ✅ Qu'est-ce qui a été fait?

Vous aviez raison! Les données **Régions**, **Départements** et **Communes** du Sénégal n'étaient pas présentes dans la base de données PostgreSQL.

Voici ce qui a été implémenté:

### 📦 Fichiers créés/modifiés:

1. **`SENEGAL_REGIONS_SETUP.sql`** (NOUVEAU)
   - Script SQL complet pour créer les tables: `regions`, `departements`, `communes`
   - Insère les 14 régions officielles du Sénégal
   - Insère les 45 départements
   - Insère 45+ communes
   - Crée les relations avec clés étrangères
   - Ajoute les indices pour performances optimales

2. **`setup-senegal-data.js`** (NOUVEAU)
   - Script Node.js alternatif pour insérer les données
   - Utilise les données de `data-senegal.js`
   - Plus flexible et avec transactions

3. **`setup-db.js`** (MODIFIÉ)
   - Exécute maintenant aussi le fichier `SENEGAL_REGIONS_SETUP.sql`
   - Affiche les statistiques des données insérées

---

## 🚀 Comment utiliser?

### Option 1: Initialisation complète (RECOMMANDÉE)

```bash
# La première fois, lancez:
node setup-db.js
```

Cela va:
1. ✅ Créer la base de données `dimentionnement_SNG`
2. ✅ Créer la table `collectes_donnees`
3. ✅ Créer les tables `regions`, `departements`, `communes`
4. ✅ Insérer les 14 régions + 45 départements + communes

### Option 2: Insérer uniquement les données géographiques

Si les tables existent déjà:

```bash
node setup-senegal-data.js
```

### Option 3: Exécuter le script SQL directement

Avec psql:
```bash
psql -U postgres -d dimentionnement_SNG -f SENEGAL_REGIONS_SETUP.sql
```

---

## 📊 Données maintenant disponibles

### 14 Régions:
1. 🏛️ Dakar
2. 🏘️ Thiès
3. 👑 Saint-Louis
4. 🌾 Diourbel
5. 🐪 Tambacounda
6. 🌴 Ziguinchor
7. 🎪 Kaolack
8. 🏞️ Fatick
9. 🌾 Kaffrine
10. 🏜️ Matam
11. 🌲 Kédougou
12. 🎋 Kolda
13. 🌳 Sédhiou
14. 🐠 Louga

### 45 Départements + 45+ Communes

---

## 📋 Structure de la base de données

### Table `regions`:
```sql
id (SERIAL, PRIMARY KEY)
code (VARCHAR, UNIQUE) -- DK, TH, SL, etc.
nom (VARCHAR)
emoji (VARCHAR)
description (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Table `departements`:
```sql
id (SERIAL, PRIMARY KEY)
region_id (INTEGER, FOREIGN KEY)
nom (VARCHAR)
code (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Table `communes`:
```sql
id (SERIAL, PRIMARY KEY)
departement_id (INTEGER, FOREIGN KEY)
region_id (INTEGER, FOREIGN KEY)
nom (VARCHAR)
code (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 🔗 Utilisation dans le Frontend

### Pour récupérer les régions:
```sql
SELECT * FROM regions ORDER BY code;
```

### Pour récupérer les départements d'une région:
```sql
SELECT * FROM departements 
WHERE region_id = (SELECT id FROM regions WHERE code = 'DK');
```

### Pour récupérer les communes d'un département:
```sql
SELECT * FROM communes 
WHERE departement_id = (SELECT id FROM departements WHERE nom = 'Dakar');
```

### Pour une requête complète (région -> département -> commune):
```sql
SELECT 
    r.nom as region,
    d.nom as departement,
    c.nom as commune
FROM communes c
JOIN departements d ON c.departement_id = d.id
JOIN regions r ON d.region_id = r.id
WHERE r.code = 'DK'
ORDER BY d.nom, c.nom;
```

---

## 🎯 Prochaines étapes

### Pour intégrer au formulaire HTML:

1. **Mettre à jour le dropdown des régions:**
   ```javascript
   // Dans index.html ou server.js
   const regions = await db.query('SELECT * FROM regions ORDER BY code');
   // Remplir le select avec les données
   ```

2. **Ajouter des dropdowns pour Département et Commune:**
   - Région → Département (dépendant)
   - Département → Commune (dépendant)

3. **Valider les sélections:**
   - Vérifier que la région/département/commune existe
   - Rejeter les données invalides

### Exemple d'API REST:

```javascript
// GET /api/regions
// Retourne toutes les régions

// GET /api/regions/:regionId/departements
// Retourne les départements d'une région

// GET /api/departements/:deptId/communes
// Retourne les communes d'un département
```

---

## ✨ Avantages

✅ **Données normalisées:** Pas de doublons, structure relationnelle correcte  
✅ **Validation:** Garantir que seules les valeurs valides sont sélectionnées  
✅ **Performance:** Indices créés pour requêtes rapides  
✅ **Traçabilité:** Colonnes `created_at` et `updated_at` pour historique  
✅ **Scalabilité:** Prêt pour ajouter d'autres données géographiques  

---

## 🐛 Troubleshooting

### PostgreSQL ne reconnaît pas les identifiants:
```bash
# Vérifier que PostgreSQL est lancé
psql -U postgres
```

### Base de données n'existe pas:
```bash
# Créer manuellement
createdb dimentionnement_SNG
```

### Tables n'existent pas:
```bash
# Exécuter le setup complet
node setup-db.js
```

### Les données ne s'insèrent pas:
```bash
# Vérifier les tables
psql -U postgres -d dimentionnement_SNG -c "\dt"

# Vérifier les données
psql -U postgres -d dimentionnement_SNG -c "SELECT COUNT(*) FROM regions;"
```

---

## 📚 Références

- **ANSD:** Agence Nationale de la Statistique et de la Démographie du Sénégal
- **data-senegal.js:** Contient les données complètes
- **SENEGAL_REGIONS_SETUP.sql:** Script SQL avec toutes les données
- **setup-senegal-data.js:** Script Node.js pour insertion flexible

---

**Créé:** 12 Février 2026  
**Statut:** ✅ Prêt pour utilisation  
**Source des données:** ANSD
