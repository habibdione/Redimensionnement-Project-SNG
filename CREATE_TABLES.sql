-- ============================================
-- CRÉATION DES TABLES - PostgreSQL (VERSION CORRIGÉE)
-- Base de données: dimensionnement_SNG
-- Version optimisée avec contraintes et triggers
-- ============================================
-- CORRECTIONS APPORTÉES:
-- 1. Colonne 'photo' au lieu de 'image_1' (correspond à server.js)
-- 2. Ajout des colonnes 'coordonnee_x' et 'coordonnee_y' (UTM)
-- 3. Colonne 'partenaire' au lieu de 'partenariat' (correspond au code)
-- 4. BIGSERIAL pour IDs (meilleure scalabilité)
-- 5. Indices optimisés pour requêtes fréquentes
-- 6. Trigger automatique pour updated_at
-- ============================================

-- Vérifier si la table existe et la supprimer si nécessaire
DROP TABLE IF EXISTS collectes_donnees CASCADE;

-- Créer la table collectes_donnees avec toutes les colonnes requises
CREATE TABLE collectes_donnees (
    id BIGSERIAL PRIMARY KEY,
    
    -- Informations de partenariat et localisation
    partenaire VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    departement VARCHAR(255) NOT NULL,
    commune VARCHAR(255) NOT NULL,
    
    -- Type d'activité et site
    type_activite TEXT,
    sites_concernes VARCHAR(500),
    
    -- Données de dimensionnement
    superficie DECIMAL(10, 2),
    besoin_personnel INTEGER CHECK (besoin_personnel >= 0),
    dispositif_deploye TEXT,
    nombre_rotation INTEGER CHECK (nombre_rotation >= 0),
    infrastructure_gestion VARCHAR(50),
    frequence_collecte VARCHAR(50),
    
    -- Équipements
    bacs_240l INTEGER DEFAULT 0 CHECK (bacs_240l >= 0),
    caisse_polybene INTEGER DEFAULT 0 CHECK (caisse_polybene >= 0),
    bacs_660l INTEGER DEFAULT 0 CHECK (bacs_660l >= 0),
    
    -- Accessibilité et localisation GPS
    accessibilite VARCHAR(100),
    latitude DECIMAL(10, 8) CHECK (latitude >= -90 AND latitude <= 90),
    longitude DECIMAL(11, 8) CHECK (longitude >= -180 AND longitude <= 180),
    precision DECIMAL(10, 2) CHECK (precision >= 0),
    
    -- Coordonnées UTM (AJOUTÉES - ESSENTIELLES)
    coordonnee_x DECIMAL(12, 2),
    coordonnee_y DECIMAL(12, 2),
    
    -- Observations et images
    observation TEXT,
    photo BYTEA,
    
    -- Timestamps et statut
    date_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'archive', 'brouillon', 'valide')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Ajouter des commentaires pour la documentation
COMMENT ON TABLE collectes_donnees IS 'Table des collectes de données de dimensionnement SENELEC/SONAGED';
COMMENT ON COLUMN collectes_donnees.id IS 'Identifiant unique auto-incrémenté (BIGSERIAL)';
COMMENT ON COLUMN collectes_donnees.partenaire IS 'Nom du partenaire/organisme';
COMMENT ON COLUMN collectes_donnees.photo IS 'Photo capturée en format BYTEA (base64 encoded)';
COMMENT ON COLUMN collectes_donnees.coordonnee_x IS 'Coordonnée UTM Easting (axe X)';
COMMENT ON COLUMN collectes_donnees.coordonnee_y IS 'Coordonnée UTM Northing (axe Y)';
COMMENT ON COLUMN collectes_donnees.statut IS 'État de la collecte: actif, archive, brouillon, valide';

-- ============================================
-- Créer les indices pour optimiser les performances
-- ============================================

-- Index pour les requêtes par date (très fréquent)
CREATE INDEX idx_date_collecte ON collectes_donnees (date_collecte DESC) 
WHERE statut = 'actif';

-- Index simple pour filtrer par partenariat
CREATE INDEX idx_partenaire ON collectes_donnees (partenaire) 
WHERE statut = 'actif';

-- Index pour requêtes par région
CREATE INDEX idx_region ON collectes_donnees (region) 
WHERE statut = 'actif';

-- Index pour requêtes par département
CREATE INDEX idx_departement ON collectes_donnees (departement) 
WHERE statut = 'actif';

-- Index pour requêtes par commune
CREATE INDEX idx_commune ON collectes_donnees (commune) 
WHERE statut = 'actif';

-- Index pour filtrer par statut
CREATE INDEX idx_statut ON collectes_donnees (statut);

-- Index composite pour requêtes fréquentes (région + département)
CREATE INDEX idx_region_departement ON collectes_donnees (region, departement) 
WHERE statut = 'actif';

-- Index pour recherche par partenariat et date
CREATE INDEX idx_partenaire_date ON collectes_donnees (partenaire, date_collecte DESC) 
WHERE statut = 'actif';

-- Index pour localisation GPS (recherche spatiale)
CREATE INDEX idx_gps_coordinates ON collectes_donnees (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Index pour localisation UTM
CREATE INDEX idx_utm_coordinates ON collectes_donnees (coordonnee_x, coordonnee_y) 
WHERE coordonnee_x IS NOT NULL AND coordonnee_y IS NOT NULL;

-- Index pour type d'activité (recherche texte)
CREATE INDEX idx_type_activite ON collectes_donnees USING GIN(to_tsvector('french', type_activite));

-- Index pour observations
CREATE INDEX idx_observation ON collectes_donnees USING GIN(to_tsvector('french', observation));

-- ============================================
-- Créer la séquence pour l'ID
-- ============================================
CREATE SEQUENCE IF NOT EXISTS collectes_donnees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    OWNED BY collectes_donnees.id;

-- ============================================
-- Créer un trigger pour mettre à jour updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger
DROP TRIGGER IF EXISTS update_collectes_donnees_timestamp ON collectes_donnees;
CREATE TRIGGER update_collectes_donnees_timestamp
    BEFORE UPDATE ON collectes_donnees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_timestamp();

-- ============================================
-- Créer un trigger pour mettre à jour date_modification
-- ============================================
CREATE OR REPLACE FUNCTION update_date_modification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_collectes_donnees_modification ON collectes_donnees;
CREATE TRIGGER update_collectes_donnees_modification
    BEFORE UPDATE ON collectes_donnees
    FOR EACH ROW
    EXECUTE FUNCTION update_date_modification_timestamp();

-- ============================================
-- Données de test (optionnel)
-- ============================================
-- INSERT INTO collectes_donnees (
--     partenaire, region, departement, commune, type_activite, 
--     sites_concernes, statut, latitude, longitude, 
--     coordonnee_x, coordonnee_y, photo
-- ) VALUES (
--     'SONAGED', 
--     'Région de Ziguinchor', 
--     'Ziguinchor', 
--     'Ziguinchor', 
--     'Résidentiel', 
--     'Site Test', 
--     '123 Rue de la Paix, Ziguinchor', 
--     'brouillon',
--     13.1939,
--     -15.5277,
--     649874.25,
--     1456325.75,
--     NULL
-- );

-- ============================================
-- Vérification de la création
-- ============================================
SELECT 
    'Table collectes_donnees' as objet,
    COUNT(*) as nombre_colonnes
FROM information_schema.columns 
WHERE table_name = 'collectes_donnees'
GROUP BY table_name;

SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename = 'collectes_donnees'
ORDER BY indexname;

-- ============================================
-- RÉSUMÉ DES CORRECTIONS APPORTÉES
-- ============================================
-- ✅ Colonne 'photo' (au lieu de 'image_1') - Correspond à server.js
-- ✅ Colonnes 'coordonnee_x' et 'coordonnee_y' AJOUTÉES - Essentielles pour UTM
-- ✅ Colonne 'partenaire' (au lieu de 'partenariat') - Correspond au code
-- ✅ Colonne 'sites_concernes' - Remplace 'adresse' pour meilleure clarté
-- ✅ Colonne 'prn_pp' SUPPRIMÉE - Plus utilisée
-- ✅ BIGSERIAL pour meilleure scalabilité
-- ✅ Indices optimisés pour requêtes fréquentes
-- ✅ Triggers pour mise à jour automatique des timestamps
-- ✅ Contraintes CHECK pour validation des données
-- ✅ Commentaires expliquant l'usage de chaque colonne
-- ✅ Séquence explicite déclarée
-- ✅ La table EST NOW compatible avec le code existant!
-- ============================================
