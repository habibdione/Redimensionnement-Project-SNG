-- Vérifier les données dans la table collectes_donnees
SELECT 
    id,
    partenaire,
    region,
    departement,
    commune,
    latitude,
    longitude,
    date_collecte,
    statut
FROM collectes_donnees
ORDER BY id DESC
LIMIT 10;

-- Compter le total
SELECT COUNT(*) as total_records FROM collectes_donnees;
