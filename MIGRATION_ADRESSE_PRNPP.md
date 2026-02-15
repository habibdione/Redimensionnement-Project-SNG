#!/ Mise à Jour de la Base de Données - 2026-02-15

## 📋 Résumé des modifications

Vous avez demandé de:
✅ **Remplacer la colonne `adresse` par `sites_concernes`**
✅ **Supprimer la colonne `prn_pp`**

---

## 📝 Fichiers modifiés

### 1. **Fichiers SQL (Schéma de base)**
- ✅ `CREATE_TABLES.sql` - Colonne `adresse` renommée en `sites_concernes`, `prn_pp` supprimée
- ✅ `DB_SCHEMA_CORRECTED.sql` - Même mise à jour
- ✅ `migration-rename-columns.sql` - **NOUVEAU** - Script de migration pour appliquer les changements

### 2. **Fichiers JavaScript - Création de tables**
- ✅ `db.js` - Mise à jour du schéma
- ✅ `create-db.js` - Mise à jour du schéma
- ✅ `test-db.js` - Mise à jour du schéma de test

### 3. **Fichiers JavaScript - API Backend**
- ✅ `server.js` 
  - POST /api/collecte : Remplace `adresse` par `sites_concernes`
  - PUT /api/collecte/:id : Supprime `prn_pp`, remplace `adresse`

### 4. **Fichiers JavaScript - Tests**
- ✅ `test-submission-today.js` - Données de test mises à jour
- ✅ `test-github-pages.js` - Deux datasets de test mis à jour
- ✅ `update-data.js` - Script de mise à jour des données

### 5. **Fichiers JavaScript - API Client**
- ✅ `api-client.js` 
  - Méthode POST : Utilise `sites_concernes`
  - Méthode PUT : Utilise `sites_concernes`, supprime `prnPp`
  - Export CSV : Mise à jour des en-têtes et colonnes

### 6. **Fichiers Frontend**
- ✅ `index.html` - JavaScript mis à jour (10 modifications)
  - Objet `donnees.sites_concernes` au lieu de `donnees.adresse`
  - Validation mise à jour
  - Affichage des données mis à jour
  - Envoi des données au backend

---

## 🚀 Comment appliquer les modifications

### Option 1: Appliquer directement à la BD existante (Pour une BD active)
Exécutez le script de migration SQL:
```bash
psql -U postgres -d dimensionnement_SNG -f migration-rename-columns.sql
```

### Option 2: Créer une nouvelle BD (Recommandé pour un nouveau déploiement)
```bash
# Supprimer l'ancienne table (optionnel)
psql -U postgres -d dimensionnement_SNG -c "DROP TABLE IF EXISTS collectes_donnees CASCADE;"

# Exécuter CREATE_TABLES.sql ou DB_SCHEMA_CORRECTED.sql
psql -U postgres -d dimensionnement_SNG -f CREATE_TABLES.sql
```

### Option 3: Via Node.js
```bash
node create-db.js
# ou
node db.js
```

---

## 📊 Changements de structure de table

| Avant | Après |
|-------|-------|
| `adresse VARCHAR(500)` | `sites_concernes VARCHAR(500)` |
| `prn_pp VARCHAR(50)` | Supprimé ❌ |
| `site_concerne VARCHAR(500)` | Conservé ✅ |

---

## ✅ Vérification

Après appliquer les changements, vérifiez la structure:
```sql
\d collectes_donnees
```

Vous devriez voir:
- ✅ Colonne `sites_concernes` présente
- ❌ Colonne `prn_pp` absente
- ✅ Colonne `site_concerne` toujours présente

---

## 🔄 Données existantes

⚠️ **NOTE**: Si vous aviez des données dans la colonne `adresse`, le script de migration à base de **DROP** ne les gardera pas. 

Pour conserver les données:
```sql
-- Avant de renommer
ALTER TABLE collectes_donnees 
ADD COLUMN sites_concernes VARCHAR(500);

-- Copier les données
UPDATE collectes_donnees 
SET sites_concernes = adresse;

-- Supprimer l'ancienne colonne
ALTER TABLE collectes_donnees 
DROP COLUMN adresse;

-- Supprimer prn_pp
ALTER TABLE collectes_donnees 
DROP COLUMN prn_pp;
```

---

## 📝 Points importants

1. **ID HTML conservé**: Le `id="adresse"` du formulaire HTML reste inchangé pour minimiser les modifications. Le JavaScript renomme le champ en `sites_concernes` avant l'envoi au backend.

2. **Colonne `site_concerne`**: Conservée à titre informatif. Vous pouvez la supprimer plus tard si elle n'est plus utilisée.

3. **Compatibilité**: Tous les fichiers JavaScript sont synchronisés pour fonctionner ensemble.

4. **Backend prêt**: Le serveur `server.js` n'accepte plus `prn_pp` et utilise `sites_concernes`.

---

## ⏭️ Prochaines étapes

1. ✅ Exécutez le script de migration SQL
2. ✅ Testez avec: `node test-submission-today.js`
3. ✅ Vérifiez les données insérées
4. ✅ Testez le frontend avec le nouveau formulaire

---

**Date**: 2026-02-15
**Status**: ✅ Prêt pour déploiement
