-- ============================================
-- CRÉATION DES TABLES - PostgreSQL
-- Base de données: dimentionnement_SNG
-- ============================================
-- Exécuter ce fichier avec:
-- psql -U dimentionnement_SNG -d dimentionnement_SNG -f CREATE_TABLES.sql
-- ============================================

-- Créer la table collectes_donnees avec toutes les colonnes requises
CREATE TABLE IF NOT EXISTS collectes_donnees (
    id SERIAL PRIMARY KEY,
    
    -- Informations de partenariat et localisation
    partenariat VARCHAR(255),
    region VARCHAR(255),
    departement VARCHAR(255),
    commune VARCHAR(255),
    
    -- Type d'activité et site
    type_activite TEXT,
    site_concerne VARCHAR(500),
    adresse VARCHAR(500),
    
    -- Données de dimensionnement
    superficie DECIMAL(10, 2),
    besoin_personnel INTEGER,
    dispositif_deploye TEXT,
    nombre_rotation INTEGER,
    infrastructure_gestion VARCHAR(50),
    prn_pp VARCHAR(50),
    frequence_collecte VARCHAR(50),
    
    -- Équipements
    bacs_240l INTEGER DEFAULT 0,
    caisse_polybene INTEGER DEFAULT 0,
    bacs_660l INTEGER DEFAULT 0,
    
    -- Accessibilité et localisation GPS
    accessibilite VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    precision DECIMAL(10, 2),
    
    -- Observations et images
    observation TEXT,
    image_1 BYTEA,
    
    -- Timestamps et statut
    date_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_date_collecte 
ON collectes_donnees (date_collecte DESC);

CREATE INDEX IF NOT EXISTS idx_partenariat 
ON collectes_donnees (partenariat);

CREATE INDEX IF NOT EXISTS idx_region 
ON collectes_donnees (region);

CREATE INDEX IF NOT EXISTS idx_commune 
ON collectes_donnees (commune);

CREATE INDEX IF NOT EXISTS idx_statut 
ON collectes_donnees (statut);

-- ============================================
-- Vérification de la création
-- ============================================
-- Afficher les indices créés
SELECT indexname FROM pg_indexes 
WHERE tablename = 'collectes_donnees';

-- ✅ Si vous voyez 5 indices, c'est bon!
-- idx_date_collecte
-- idx_partenariat
-- idx_region
-- idx_commune
-- idx_statut
