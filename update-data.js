/**
 * MISE À JOUR DES DONNÉES - Remplacer Test par Données Réelles
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'senelec_dimensionnement'
});

async function updateData() {
    const client = await pool.connect();

    try {
        // Mettre à jour ID 17
        const updateQuery = `
            UPDATE collectes_donnees 
            SET 
                partenaire = $1,
                region = $2,
                departement = $3,
                commune = $4,
                sites_concernes = $5,
                date_modification = CURRENT_TIMESTAMP
            WHERE id = 17
            RETURNING *;
        `;

        const result = await client.query(updateQuery, [
            'Dakar Partnership',        // partenaire
            'Dakar',                     // region
            'Dakar',                     // departement
            'Plateau',                   // commune
            'Rue de la Paix, Dakar'      // adresse/sites concernés
        ]);

        console.log('✅ Données mises à jour avec succès!\n');
        console.log('Enregistrement mis à jour:');
        console.log(result.rows[0]);

        // Afficher tous les enregistrements
        const selectQuery = 'SELECT id, partenaire, region, commune, adresse FROM collectes_donnees ORDER BY id;';
        const allData = await client.query(selectQuery);
        
        console.log('\n📋 Tous les enregistrements:');
        console.table(allData.rows);

    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

updateData();
