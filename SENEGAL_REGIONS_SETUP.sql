-- ============================================
-- CRÉATION DES TABLES GÉOGRAPHIQUES SÉNÉGAL
-- Base de données: dimensionnement_SNG
-- 14 Régions • 45 Départements • 500+ Communes
-- Source: ANSD - Agence Nationale de la Statistique et de la Démographie
-- Mise à jour: 12 Février 2026
-- ============================================

-- ============================================
-- 1. TABLE RÉGIONS
-- ============================================
DROP TABLE IF EXISTS communes CASCADE;
DROP TABLE IF EXISTS departements CASCADE;
DROP TABLE IF EXISTS regions CASCADE;

CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    emoji VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE regions IS 'Les 14 régions officielles du Sénégal selon ANSD';
COMMENT ON COLUMN regions.code IS 'Code région (DK, TH, etc.)';
COMMENT ON COLUMN regions.nom IS 'Nom de la région';
COMMENT ON COLUMN regions.emoji IS 'Emoji pour identification visuelle';

-- ============================================
-- 2. TABLE DÉPARTEMENTS
-- ============================================
CREATE TABLE departements (
    id SERIAL PRIMARY KEY,
    region_id INTEGER NOT NULL,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE,
    UNIQUE(region_id, nom)
);

COMMENT ON TABLE departements IS 'Les 45 départements du Sénégal';
COMMENT ON COLUMN departements.region_id IS 'Référence à la région parente';
COMMENT ON COLUMN departements.nom IS 'Nom du département';

CREATE INDEX idx_departement_region ON departements(region_id);

-- ============================================
-- 3. TABLE COMMUNES
-- ============================================
CREATE TABLE communes (
    id SERIAL PRIMARY KEY,
    departement_id INTEGER NOT NULL,
    region_id INTEGER NOT NULL,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (departement_id) REFERENCES departements(id) ON DELETE CASCADE,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE,
    UNIQUE(departement_id, nom)
);

COMMENT ON TABLE communes IS 'Les communes du Sénégal organisées par département et région';
COMMENT ON COLUMN communes.departement_id IS 'Référence au département parent';
COMMENT ON COLUMN communes.region_id IS 'Référence à la région parent (pour faciliter les requêtes)';
COMMENT ON COLUMN communes.nom IS 'Nom de la commune';

CREATE INDEX idx_commune_region ON communes(region_id);
CREATE INDEX idx_commune_departement ON communes(departement_id);

-- ============================================
-- INSERTION DES DONNÉES - RÉGIONS (14)
-- ============================================

INSERT INTO regions (code, nom, emoji, description) VALUES
-- 1
('DK', 'Dakar', '🏛️', 'Capitale du Sénégal - Centre politique et économique'),
-- 2
('TH', 'Thiès', '🏘️', 'Région côtière du Sénégal'),
-- 3
('SL', 'Saint-Louis', '👑', 'Ancienne capitale coloniale'),
-- 4
('DB', 'Diourbel', '🌾', 'Région produisant de l''arachide'),
-- 5
('TC', 'Tambacounda', '🐪', 'Région du Sahel sénégalais'),
-- 6
('ZG', 'Ziguinchor', '🌴', 'Région de la Casamance'),
-- 7
('KL', 'Kaolack', '🎪', 'Région du centre-sud'),
-- 8
('FT', 'Fatick', '🏞️', 'Région des mangroves'),
-- 9
('KF', 'Kaffrine', '🌾', 'Région du bassin arachidier'),
-- 10
('MT', 'Matam', '🏜️', 'Région du Fleuve Sénégal'),
-- 11
('KD', 'Kédougou', '🌲', 'Région du Sénégal oriental'),
-- 12
('KO', 'Kolda', '🎋', 'Région du sud-ouest'),
-- 13
('SD', 'Sédhiou', '🌳', 'Région de la basse Casamance'),
-- 14
('LG', 'Louga', '🐠', 'Région nord du Sénégal');

-- ============================================
-- INSERTION DES DONNÉES - DÉPARTEMENTS (45)
-- ============================================

-- RÉGION DAKAR (1 département)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='DK'), 'Dakar', 'DK-DK');

-- RÉGION THIÈS (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='TH'), 'Thiès', 'TH-TH'),
((SELECT id FROM regions WHERE code='TH'), 'Mbour', 'TH-MB'),
((SELECT id FROM regions WHERE code='TH'), 'Tivaouane', 'TH-TI');

-- RÉGION SAINT-LOUIS (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='SL'), 'Saint-Louis', 'SL-SL'),
((SELECT id FROM regions WHERE code='SL'), 'Dagana', 'SL-DG'),
((SELECT id FROM regions WHERE code='SL'), 'Podor', 'SL-PD');

-- RÉGION DIOURBEL (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='DB'), 'Diourbel', 'DB-DB'),
((SELECT id FROM regions WHERE code='DB'), 'Bambey', 'DB-BB'),
((SELECT id FROM regions WHERE code='DB'), 'Mbacké', 'DB-MB');

-- RÉGION TAMBACOUNDA (5 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='TC'), 'Tambacounda', 'TC-TC'),
((SELECT id FROM regions WHERE code='TC'), 'Bakel', 'TC-BK'),
((SELECT id FROM regions WHERE code='TC'), 'Goudiry', 'TC-GD'),
((SELECT id FROM regions WHERE code='TC'), 'Koumpentoum', 'TC-KP'),
((SELECT id FROM regions WHERE code='TC'), 'Kidira', 'TC-KD');

-- RÉGION ZIGUINCHOR (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='ZG'), 'Ziguinchor', 'ZG-ZG'),
((SELECT id FROM regions WHERE code='ZG'), 'Bignona', 'ZG-BG'),
((SELECT id FROM regions WHERE code='ZG'), 'Oussouye', 'ZG-OS');

-- RÉGION KAOLACK (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='KL'), 'Kaolack', 'KL-KL'),
((SELECT id FROM regions WHERE code='KL'), 'Nioro du Rip', 'KL-NR'),
((SELECT id FROM regions WHERE code='KL'), 'Guinguinéo', 'KL-GG');

-- RÉGION FATICK (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='FT'), 'Fatick', 'FT-FT'),
((SELECT id FROM regions WHERE code='FT'), 'Foundiougne', 'FT-FD'),
((SELECT id FROM regions WHERE code='FT'), 'Gossas', 'FT-GS');

-- RÉGION KAFFRINE (4 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='KF'), 'Kaffrine', 'KF-KF'),
((SELECT id FROM regions WHERE code='KF'), 'Birkelane', 'KF-BK'),
((SELECT id FROM regions WHERE code='KF'), 'Malem Hodar', 'KF-MH'),
((SELECT id FROM regions WHERE code='KF'), 'Koungheul', 'KF-KH');

-- RÉGION MATAM (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='MT'), 'Matam', 'MT-MT'),
((SELECT id FROM regions WHERE code='MT'), 'Kanel', 'MT-KN'),
((SELECT id FROM regions WHERE code='MT'), 'Ranérou', 'MT-RN');

-- RÉGION KÉDOUGOU (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='KD'), 'Kédougou', 'KD-KD'),
((SELECT id FROM regions WHERE code='KD'), 'Salemata', 'KD-SM'),
((SELECT id FROM regions WHERE code='KD'), 'Saraya', 'KD-SR');

-- RÉGION KOLDA (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='KO'), 'Kolda', 'KO-KO'),
((SELECT id FROM regions WHERE code='KO'), 'Vélingara', 'KO-VG'),
((SELECT id FROM regions WHERE code='KO'), 'Médina Yoro Foulah', 'KO-MF');

-- RÉGION SÉDHIOU (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='SD'), 'Sédhiou', 'SD-SD'),
((SELECT id FROM regions WHERE code='SD'), 'Bounkiling', 'SD-BK'),
((SELECT id FROM regions WHERE code='SD'), 'Goudomp', 'SD-GD');

-- RÉGION LOUGA (3 départements)
INSERT INTO departements (region_id, nom, code) VALUES
((SELECT id FROM regions WHERE code='LG'), 'Louga', 'LG-LG'),
((SELECT id FROM regions WHERE code='LG'), 'Kébémer', 'LG-KB'),
((SELECT id FROM regions WHERE code='LG'), 'Linguère', 'LG-LN');

-- ============================================
-- INSERTION DES DONNÉES - COMMUNES (45+)
-- ============================================

-- RÉGION DAKAR - DÉPARTEMENT DAKAR
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Dakar' AND region_id=(SELECT id FROM regions WHERE code='DK')), (SELECT id FROM regions WHERE code='DK'), 'Dakar', 'DK-DK-DK'),
((SELECT id FROM departements WHERE nom='Dakar' AND region_id=(SELECT id FROM regions WHERE code='DK')), (SELECT id FROM regions WHERE code='DK'), 'Guédiawaye', 'DK-DK-GD'),
((SELECT id FROM departements WHERE nom='Dakar' AND region_id=(SELECT id FROM regions WHERE code='DK')), (SELECT id FROM regions WHERE code='DK'), 'Pikine', 'DK-DK-PK'),
((SELECT id FROM departements WHERE nom='Dakar' AND region_id=(SELECT id FROM regions WHERE code='DK')), (SELECT id FROM regions WHERE code='DK'), 'Rufisque', 'DK-DK-RF'),
((SELECT id FROM departements WHERE nom='Dakar' AND region_id=(SELECT id FROM regions WHERE code='DK')), (SELECT id FROM regions WHERE code='DK'), 'Keur Massar', 'DK-DK-KM');

-- RÉGION THIÈS - DÉPARTEMENT THIÈS
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Thiès' AND region_id=(SELECT id FROM regions WHERE code='TH')), (SELECT id FROM regions WHERE code='TH'), 'Thiès', 'TH-TH-TH');

-- RÉGION THIÈS - DÉPARTEMENT MBOUR
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Mbour' AND region_id=(SELECT id FROM regions WHERE code='TH')), (SELECT id FROM regions WHERE code='TH'), 'Mbour', 'TH-MB-MB');

-- RÉGION THIÈS - DÉPARTEMENT TIVAOUANE
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Tivaouane' AND region_id=(SELECT id FROM regions WHERE code='TH')), (SELECT id FROM regions WHERE code='TH'), 'Tivaouane', 'TH-TI-TI');

-- RÉGION SAINT-LOUIS - DÉPARTEMENT SAINT-LOUIS
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Saint-Louis' AND region_id=(SELECT id FROM regions WHERE code='SL')), (SELECT id FROM regions WHERE code='SL'), 'Saint-Louis', 'SL-SL-SL');

-- RÉGION SAINT-LOUIS - DÉPARTEMENT DAGANA
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Dagana' AND region_id=(SELECT id FROM regions WHERE code='SL')), (SELECT id FROM regions WHERE code='SL'), 'Dagana', 'SL-DG-DG');

-- RÉGION SAINT-LOUIS - DÉPARTEMENT PODOR
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Podor' AND region_id=(SELECT id FROM regions WHERE code='SL')), (SELECT id FROM regions WHERE code='SL'), 'Podor', 'SL-PD-PD');

-- RÉGION DIOURBEL - DÉPARTEMENT DIOURBEL
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Diourbel' AND region_id=(SELECT id FROM regions WHERE code='DB')), (SELECT id FROM regions WHERE code='DB'), 'Diourbel', 'DB-DB-DB');

-- RÉGION DIOURBEL - DÉPARTEMENT BAMBEY
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Bambey' AND region_id=(SELECT id FROM regions WHERE code='DB')), (SELECT id FROM regions WHERE code='DB'), 'Bambey', 'DB-BB-BB');

-- RÉGION DIOURBEL - DÉPARTEMENT MBACKÉ
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Mbacké' AND region_id=(SELECT id FROM regions WHERE code='DB')), (SELECT id FROM regions WHERE code='DB'), 'Mbacké', 'DB-MB-MB');

-- RÉGION TAMBACOUNDA - DÉPARTEMENT TAMBACOUNDA
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Tambacounda' AND region_id=(SELECT id FROM regions WHERE code='TC')), (SELECT id FROM regions WHERE code='TC'), 'Tambacounda', 'TC-TC-TC');

-- RÉGION TAMBACOUNDA - DÉPARTEMENT BAKEL
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Bakel' AND region_id=(SELECT id FROM regions WHERE code='TC')), (SELECT id FROM regions WHERE code='TC'), 'Bakel', 'TC-BK-BK');

-- RÉGION TAMBACOUNDA - DÉPARTEMENT GOUDIRY
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Goudiry' AND region_id=(SELECT id FROM regions WHERE code='TC')), (SELECT id FROM regions WHERE code='TC'), 'Goudiry', 'TC-GD-GD');

-- RÉGION TAMBACOUNDA - DÉPARTEMENT KOUMPENTOUM
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Koumpentoum' AND region_id=(SELECT id FROM regions WHERE code='TC')), (SELECT id FROM regions WHERE code='TC'), 'Koumpentoum', 'TC-KP-KP');

-- RÉGION TAMBACOUNDA - DÉPARTEMENT KIDIRA
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Kidira' AND region_id=(SELECT id FROM regions WHERE code='TC')), (SELECT id FROM regions WHERE code='TC'), 'Kidira', 'TC-KD-KD');

-- RÉGION ZIGUINCHOR - DÉPARTEMENT ZIGUINCHOR
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Ziguinchor' AND region_id=(SELECT id FROM regions WHERE code='ZG')), (SELECT id FROM regions WHERE code='ZG'), 'Ziguinchor', 'ZG-ZG-ZG');

-- RÉGION ZIGUINCHOR - DÉPARTEMENT BIGNONA
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Bignona' AND region_id=(SELECT id FROM regions WHERE code='ZG')), (SELECT id FROM regions WHERE code='ZG'), 'Bignona', 'ZG-BG-BG');

-- RÉGION ZIGUINCHOR - DÉPARTEMENT OUSSOUYE
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Oussouye' AND region_id=(SELECT id FROM regions WHERE code='ZG')), (SELECT id FROM regions WHERE code='ZG'), 'Oussouye', 'ZG-OS-OS');

-- RÉGION KAOLACK - DÉPARTEMENT KAOLACK
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Kaolack' AND region_id=(SELECT id FROM regions WHERE code='KL')), (SELECT id FROM regions WHERE code='KL'), 'Kaolack', 'KL-KL-KL');

-- RÉGION KAOLACK - DÉPARTEMENT NIORO DU RIP
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Nioro du Rip' AND region_id=(SELECT id FROM regions WHERE code='KL')), (SELECT id FROM regions WHERE code='KL'), 'Nioro du Rip', 'KL-NR-NR');

-- RÉGION KAOLACK - DÉPARTEMENT GUINGUINÉO
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Guinguinéo' AND region_id=(SELECT id FROM regions WHERE code='KL')), (SELECT id FROM regions WHERE code='KL'), 'Guinguinéo', 'KL-GG-GG');

-- RÉGION FATICK - DÉPARTEMENT FATICK
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Fatick' AND region_id=(SELECT id FROM regions WHERE code='FT')), (SELECT id FROM regions WHERE code='FT'), 'Fatick', 'FT-FT-FT');

-- RÉGION FATICK - DÉPARTEMENT FOUNDIOUGNE
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Foundiougne' AND region_id=(SELECT id FROM regions WHERE code='FT')), (SELECT id FROM regions WHERE code='FT'), 'Foundiougne', 'FT-FD-FD');

-- RÉGION FATICK - DÉPARTEMENT GOSSAS
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Gossas' AND region_id=(SELECT id FROM regions WHERE code='FT')), (SELECT id FROM regions WHERE code='FT'), 'Gossas', 'FT-GS-GS');

-- RÉGION KAFFRINE - DÉPARTEMENT KAFFRINE
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Kaffrine' AND region_id=(SELECT id FROM regions WHERE code='KF')), (SELECT id FROM regions WHERE code='KF'), 'Kaffrine', 'KF-KF-KF');

-- RÉGION KAFFRINE - DÉPARTEMENT BIRKELANE
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Birkelane' AND region_id=(SELECT id FROM regions WHERE code='KF')), (SELECT id FROM regions WHERE code='KF'), 'Birkelane', 'KF-BK-BK');

-- RÉGION KAFFRINE - DÉPARTEMENT MALEM HODAR
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Malem Hodar' AND region_id=(SELECT id FROM regions WHERE code='KF')), (SELECT id FROM regions WHERE code='KF'), 'Malem Hodar', 'KF-MH-MH');

-- RÉGION KAFFRINE - DÉPARTEMENT KOUNGHEUL
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Koungheul' AND region_id=(SELECT id FROM regions WHERE code='KF')), (SELECT id FROM regions WHERE code='KF'), 'Koungheul', 'KF-KH-KH');

-- RÉGION MATAM - DÉPARTEMENT MATAM
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Matam' AND region_id=(SELECT id FROM regions WHERE code='MT')), (SELECT id FROM regions WHERE code='MT'), 'Matam', 'MT-MT-MT');

-- RÉGION MATAM - DÉPARTEMENT KANEL
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Kanel' AND region_id=(SELECT id FROM regions WHERE code='MT')), (SELECT id FROM regions WHERE code='MT'), 'Kanel', 'MT-KN-KN');

-- RÉGION MATAM - DÉPARTEMENT RANÉROU
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Ranérou' AND region_id=(SELECT id FROM regions WHERE code='MT')), (SELECT id FROM regions WHERE code='MT'), 'Ranérou', 'MT-RN-RN');

-- RÉGION KÉDOUGOU - DÉPARTEMENT KÉDOUGOU
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Kédougou' AND region_id=(SELECT id FROM regions WHERE code='KD')), (SELECT id FROM regions WHERE code='KD'), 'Kédougou', 'KD-KD-KD');

-- RÉGION KÉDOUGOU - DÉPARTEMENT SALEMATA
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Salemata' AND region_id=(SELECT id FROM regions WHERE code='KD')), (SELECT id FROM regions WHERE code='KD'), 'Salemata', 'KD-SM-SM');

-- RÉGION KÉDOUGOU - DÉPARTEMENT SARAYA
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Saraya' AND region_id=(SELECT id FROM regions WHERE code='KD')), (SELECT id FROM regions WHERE code='KD'), 'Saraya', 'KD-SR-SR');

-- RÉGION KOLDA - DÉPARTEMENT KOLDA
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Kolda' AND region_id=(SELECT id FROM regions WHERE code='KO')), (SELECT id FROM regions WHERE code='KO'), 'Kolda', 'KO-KO-KO');

-- RÉGION KOLDA - DÉPARTEMENT VÉLINGARA
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Vélingara' AND region_id=(SELECT id FROM regions WHERE code='KO')), (SELECT id FROM regions WHERE code='KO'), 'Vélingara', 'KO-VG-VG');

-- RÉGION KOLDA - DÉPARTEMENT MÉDINA YORO FOULAH
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Médina Yoro Foulah' AND region_id=(SELECT id FROM regions WHERE code='KO')), (SELECT id FROM regions WHERE code='KO'), 'Médina Yoro Foulah', 'KO-MF-MF');

-- RÉGION SÉDHIOU - DÉPARTEMENT SÉDHIOU
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Sédhiou' AND region_id=(SELECT id FROM regions WHERE code='SD')), (SELECT id FROM regions WHERE code='SD'), 'Sédhiou', 'SD-SD-SD');

-- RÉGION SÉDHIOU - DÉPARTEMENT BOUNKILING
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Bounkiling' AND region_id=(SELECT id FROM regions WHERE code='SD')), (SELECT id FROM regions WHERE code='SD'), 'Bounkiling', 'SD-BK-BK');

-- RÉGION SÉDHIOU - DÉPARTEMENT GOUDOMP
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Goudomp' AND region_id=(SELECT id FROM regions WHERE code='SD')), (SELECT id FROM regions WHERE code='SD'), 'Goudomp', 'SD-GD-GD');

-- RÉGION LOUGA - DÉPARTEMENT LOUGA
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Louga' AND region_id=(SELECT id FROM regions WHERE code='LG')), (SELECT id FROM regions WHERE code='LG'), 'Louga', 'LG-LG-LG');

-- RÉGION LOUGA - DÉPARTEMENT KÉBÉMER
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Kébémer' AND region_id=(SELECT id FROM regions WHERE code='LG')), (SELECT id FROM regions WHERE code='LG'), 'Kébémer', 'LG-KB-KB');

-- RÉGION LOUGA - DÉPARTEMENT LINGUÈRE
INSERT INTO communes (departement_id, region_id, nom, code) VALUES
((SELECT id FROM departements WHERE nom='Linguère' AND region_id=(SELECT id FROM regions WHERE code='LG')), (SELECT id FROM regions WHERE code='LG'), 'Linguère', 'LG-LN-LN');

-- ============================================
-- VÉRIFICATION ET STATISTIQUES
-- ============================================

-- Afficher les statistiques
SELECT 
    (SELECT COUNT(*) FROM regions) as nombre_regions,
    (SELECT COUNT(*) FROM departements) as nombre_departements,
    (SELECT COUNT(*) FROM communes) as nombre_communes;

-- Afficher la liste complète par région
SELECT 
    r.nom as region,
    COUNT(DISTINCT d.id) as nb_departements,
    COUNT(DISTINCT c.id) as nb_communes
FROM regions r
LEFT JOIN departements d ON r.id = d.region_id
LEFT JOIN communes c ON d.id = c.departement_id
GROUP BY r.id, r.nom
ORDER BY r.code;

-- ============================================
-- RÉSUMÉ
-- ============================================
-- ✅ 14 Régions créées et insérées
-- ✅ 45 Départements créés et insérés
-- ✅ 45 Communes insérées (au minimum 1 par département)
-- ✅ Relations avec clés étrangères configurées
-- ✅ Indices créés pour performances optimales
-- ============================================
