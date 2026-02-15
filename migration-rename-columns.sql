-- ============================================
-- MIGRATION: Renommer 'adresse' -> 'sites_concernés' et supprimer 'prn_pp'
-- Date: 2026-02-15
-- ============================================

-- Vérifier que la table existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'collectes_donnees'
    ) THEN
        RAISE NOTICE 'Table collectes_donnees trouvée. Début de la migration...';
        
        -- 1. Renommer la colonne 'adresse' en 'sites_concernés'
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'collectes_donnees' 
            AND column_name = 'adresse'
        ) THEN
            ALTER TABLE collectes_donnees 
            RENAME COLUMN adresse TO sites_concernes;
            RAISE NOTICE 'Colonne adresse renommée en sites_concernes';
        ELSE
            RAISE NOTICE 'Colonne adresse non trouvée';
        END IF;
        
        -- 2. Supprimer la colonne 'prn_pp'
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'collectes_donnees' 
            AND column_name = 'prn_pp'
        ) THEN
            ALTER TABLE collectes_donnees 
            DROP COLUMN prn_pp;
            RAISE NOTICE 'Colonne prn_pp supprimée';
        ELSE
            RAISE NOTICE 'Colonne prn_pp non trouvée';
        END IF;
        
    ELSE
        RAISE NOTICE 'Table collectes_donnees non trouvée';
    END IF;
END $$;

COMMIT;
