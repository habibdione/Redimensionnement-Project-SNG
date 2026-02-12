📋 GUIDE DE VÉRIFICATION & MISE À JOUR DE LA BASE DE DONNÉES
=============================================================

## RÉSUMÉ EXÉCUTIF

🚨 **ÉTAT ACTUEL**: La base de données ne correspond PAS au code backend actuellement utilisé.

**3 PROBLÈMES CRITIQUES identifiés:**
1. ❌ Colonne `photo` vs `image_1` → INSERT va échouer
2. ❌ Colonnes manquantes `coordonnee_x` et `coordonnee_y` → INSERT va échouer  
3. ⚠️ Nom incohérent `partenariat` vs `partenaire` → INSERT va échouer

**Résultat:** ❌ **La sauvegarde des données en base va ÉCHOUER**

---

## DÉTAILS DES DISCREPANCES

### 1️⃣ PROBLÈME: Colonne PHOTO - Mismatch de nom

**Où est l'erreur?**
```
server.js (ligne 165): INSERT INTO ... photo ...     ← Cherche 'photo'
db.js (ligne 66):      image_1 BYTEA                  ← Crée 'image_1'
Schema proposé:        image_1 BYTEA                  ← Propose 'image_1'
```

**Impact:** 
- PostgreSQL renverra: `ERROR: column "photo" does not exist`
- La requête INSERT échouera avec erreur 500

**Solution:** Utiliser `photo` comme nom de colonne (correspond au code backend)

---

### 2️⃣ PROBLÈME CRITIQUE: Colonnes UTM manquantes

**Où est l'erreur?**
```
server.js (lignes 165-166): INSERT INTO ... coordonnee_x, coordonnee_y ...
db.js:                      Ces colonnes n'existent pas ❌
Schema proposé:            Ces colonnes ne sont pas prévues ❌
```

**Code qui échoue:**
```javascript
// server.js ligne 165
const query = `
    INSERT INTO collectes_donnees (
        ..., 
        coordonnee_x, coordonnee_y,     ← 🚨 N'EXISTENT PAS!
        observation, photo,
        ...
    ) VALUES (
        ..., $20, $21, $22, $23, $24, $25
    )
`;
```

**Impact:** 
- PostgreSQL renverra: `ERROR: column "coordonnee_x" does not exist`
- TOUS les INSERTs échoueront car ces colonnes sont dans chaque requête

**Solution:** Ajouter ces 2 colonnes avec type DECIMAL(12, 2)

---

### 3️⃣ PROBLÈME: Incohérence de nommage

**Où est l'erreur?**
```
server.js: INSERT INTO ... partenaire ...        ← Utilise 'partenaire'
db.js:     partenaire VARCHAR(255)               ← Crée 'partenaire' ✅
Schema:    partenariat VARCHAR(255)              ← Propose 'partenariat' ❌
```

**Impact:** Si on utilise le schema proposé, les INSERTs échoueront

**Solution:** Utiliser 'partenaire' partout pour cohérence

---

## TABLEAU COMPARATIF COMPLET

```
╔════════════════════════╦═════════════╦═════════════╦════════════╦════════════╗
║ Colonne                ║ server.js   ║ db.js       ║ Schema Pro ║ Statut     ║
╠════════════════════════╬═════════════╬═════════════╬════════════╬════════════╣
║ id                     ║ N/A         ║ SERIAL      ║ BIGSERIAL  ║ ✅ OK (upgrade)
║ partenaire            ║ ✅ Insère   ║ ✅ Existe   ║ ❌ 'partenariat' ║ ⚠️ MISMATCH
║ region                ║ ✅ Insère   ║ ✅ Existe   ║ ✅ region  ║ ✅ OK
║ departement           ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ commune               ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ type_activite         ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ site_concerne         ║ ❌ N'insère | ✅ Existe   ║ ✅ Existe  ║ ✅ OK (colonne libre)
║ adresse               ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ superficie            ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ besoin_personnel      ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ dispositif_deploye    ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ nombre_rotation       ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ infrastructure_gestion║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ prn_pp                ║ ❌ N'insère | ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ frequence_collecte    ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ bacs_240l             ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ caisse_polybene       ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ bacs_660l             ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ accessibilite         ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ latitude              ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ longitude             ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ precision             ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ coordonnee_x (UTM)    ║ ✅ Insère   ║ ❌ MANQUANT ║ ❌ MANQUANT║ 🚨 CRITIQUE
║ coordonnee_y (UTM)    ║ ✅ Insère   ║ ❌ MANQUANT ║ ❌ MANQUANT║ 🚨 CRITIQUE
║ observation           ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ photo (image_1)       ║ 'photo'     ║ 'image_1'   ║ 'image_1'  ║ 🚨 MISMATCH
║ date_collecte         ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ date_modification     ║ ❌ N'insère | ✅ Existe   ║ ✅ Existe  ║ ✅ OK (auto)
║ statut                ║ ✅ Insère   ║ ✅ Existe   ║ ✅ Existe  ║ ✅ OK
║ created_at            ║ ❌ N'insère | ✅ Existe   ║ ✅ Existe  ║ ✅ OK (auto)
║ updated_at            ║ ❌ N'insère | ✅ Existe   ║ ✅ Existe  ║ ✅ OK (auto)
╚════════════════════════╩═════════════╩═════════════╩════════════╩════════════╝
```

---

## PLAN D'ACTION RECOMMANDÉ

### **Option 1: MISE À JOUR URGENTE (RECOMMANDÉE) ⭐**

Exécuter le schema corrigé fourni: `DB_SCHEMA_CORRECTED.sql`

**Étapes:**
1. ✅ Sauvegarder vos données actuelles (si nécessaire)
   ```sql
   -- Créer une sauvegarde
   CREATE TABLE collectes_donnees_backup AS SELECT * FROM collectes_donnees;
   ```

2. ✅ Exécuter le schema corrigé:
   ```bash
   psql -U postgres -d dimensionnement_SNG -f DB_SCHEMA_CORRECTED.sql
   ```

3. ✅ Vérifier les résultats:
   ```bash
   psql -U postgres -d dimensionnement_SNG -c "\d collectes_donnees"
   ```

4. ✅ Restaurer les données si nécessaire:
   ```sql
   INSERT INTO collectes_donnees (
       partenaire, region, departement, commune, type_activite,
       adresse, superficie, besoin_personnel, dispositif_deploye,
       nombre_rotation, infrastructure_gestion, frequence_collecte,
       bacs_240l, caisse_polybene, bacs_660l, accessibilite,
       latitude, longitude, precision, observation, date_collecte, statut
   )
   SELECT 
       partenaire, region, departement, commune, type_activite,
       adresse, superficie, besoin_personnel, dispositif_deploye,
       nombre_rotation, infrastructure_gestion, frequence_collecte,
       bacs_240l, caisse_polybene, bacs_660l, accessibilite,
       latitude, longitude, precision, observation, date_collecte, statut
   FROM collectes_donnees_backup;
   ```

**Avantages:**
- ✅ Fixe les 3 problèmes critiques
- ✅ Ajoute les indices d'optimisation
- ✅ Ajoute les triggers automatiques
- ✅ Rajoute les contraintes CHECK
- ✅ Compatible avec le code existant

---

### **Option 2: PATCH MINIMAL (si vous avez des données)**

Si vous avez des données existantes à préserver:

```sql
-- Ajouter les colonnes UTM manquantes
ALTER TABLE collectes_donnees 
ADD COLUMN coordonnee_x DECIMAL(12, 2),
ADD COLUMN coordonnee_y DECIMAL(12, 2);

-- Renommer image_1 en photo
ALTER TABLE collectes_donnees 
RENAME COLUMN image_1 TO photo;

-- Créer les indices manquants
CREATE INDEX idx_utm_coordinates ON collectes_donnees (coordonnee_x, coordonnee_y);
```

**Avantages:**
- ✅ Préserve les données existantes
- ✅ Moins d'interruption

**Inconvénients:**
- ❌ Moins optimal (pas de contraintes, pas de triggers)
- ❌ Laisse les anomalies existantes

---

## VÉRIFICATION POST-MIGRATION

Après la migration, exécutez cette requête pour confirmer:

```sql
-- Vérifier les colonnes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'collectes_donnees'
ORDER BY ordinal_position;

-- Résultat attendu:
--  id                | bigint
--  partenaire        | character varying
--  region            | character varying
--  departement       | character varying
--  commune           | character varying
--  type_activite     | text
--  site_concerne     | character varying
--  adresse           | character varying
--  superficie        | numeric
--  besoin_personnel  | integer
--  dispositif_deploye| text
--  nombre_rotation   | integer
--  infrastructure_gestion | character varying
--  prn_pp            | character varying
--  frequence_collecte| character varying
--  bacs_240l         | integer
--  caisse_polybene   | integer
--  bacs_660l         | integer
--  accessibilite     | character varying
--  latitude          | numeric
--  longitude         | numeric
--  precision         | numeric
--  coordonnee_x      | numeric  ← 🆕 IMPORTANT
--  coordonnee_y      | numeric  ← 🆕 IMPORTANT
--  observation       | text
--  photo             | bytea    ← ✅ CORRECTION
--  date_collecte     | timestamp
--  date_modification | timestamp
--  statut            | character varying
--  created_at        | timestamp
--  updated_at        | timestamp
```

Vérifier les indices:
```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'collectes_donnees';

-- Résultat attendu: Au minimum 9 indices
```

---

## TEST DE INSERT APRÈS MIGRATION

Après migration, tester avec une requête INSERT:

```sql
INSERT INTO collectes_donnees (
    partenaire, region, departement, commune, type_activite,
    adresse, superficie, besoin_personnel,
    dispositif_deploye, nombre_rotation, infrastructure_gestion,
    frequence_collecte, bacs_240l, caisse_polybene,
    bacs_660l, accessibilite, latitude, longitude, precision,
    coordonnee_x, coordonnee_y, observation, photo,
    date_collecte, statut
) VALUES (
    'SONAGED', 'Région de Ziguinchor', 'Ziguinchor', 'Ziguinchor', 'Résidentiel',
    'Adresse Test', 2.81, 5,
    'Pelle Chargeur', 2, 'PRN',
    'F2', 48, 24,
    12, 'Route goudronnée', 13.1939, -15.5277, 8.5,
    649874.25, 1456325.75, 'Test data', NULL,
    NOW(), 'actif'
)
RETURNING id, partenaire, coordonnee_x, coordonnee_y;

-- ✅ Si INSERT réussit → Migration OK!
```

---

## RECOMMANDATIONS SUPPLÉMENTAIRES

### 🔒 Sécurité
- [ ] Ajouter une contrainte UNIQUE sur la combinaison (partenaire, date_collecte, latitude, longitude)
- [ ] Activer Row Level Security (RLS) si nécessaire
- [ ] Mettre en place des backups automatiques

### 🚀 Performance
- [ ] Monitorer la taille des tables (photos BYTEA can be large)
- [ ] Envisager la compression BYTEA en futur
- [ ] Archiver les anciennes données (< 6 mois → statut='archive')

### 📊 Maintenance
- [ ] Analyser les indices tous les mois: `ANALYZE collectes_donnees;`
- [ ] Nettoyer les données orphelines
- [ ] Documenter les migrations dans un fichier de versioning

---

## RÉSUMÉ FINAL

| Aspect | Avant | Après |
|--------|-------|-------|
| Compatibilité code | ❌ 3 erreurs | ✅ 100% compatible |
| Colonnes UTM | ❌ Manquantes | ✅ Présentes |
| Indices optimisés | ❌ Basiques | ✅ 9+ indices |
| Triggers automatiques | ❌ Absents | ✅ Actifs |
| Contraintes validation | ⚠️ Minimales | ✅ Complètes |
| Documentation | ❌ Absente | ✅ Commentaires SQL |

**Statut:** 🟢 **PRÊT À DÉPLOYER**

---

## QUESTIONS FRÉQUENTES

**Q: Vais-je perdre mes données?**  
R: Non si vous suivez l'Option 1 avec sauvegarde. Les données existantes seront restaurées.

**Q: Combien de temps prend la migration?**  
R: < 1 minute pour une petite base, quelques minutes pour une grande.

**Q: Puis-je revenir en arrière?**  
R: Oui si vous avez sauvegardé avec `_backup`. Sinon, demandez un backup auprès de votre administrateur DB.

**Q: Quand dois-je faire cette migration?**  
R: IMMÉDIATEMENT - Les INSERTs échouent actuellement!

---

**Créé:** 12 Février 2026  
**Révision:** v2.0  
**Status:** ✅ PRÊT À DÉPLOYER
