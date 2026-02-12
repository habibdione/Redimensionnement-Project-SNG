/**
 * CONFIGURATION BASE DE DONNÉES - PostgreSQL
 * ============================================
 * Connexion et initialisation de la base de données
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Configuration du pool de connexions
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'senelec_dimensionnement'
});

/**
 * Créer la structure de la base de données
 */
async function initDatabase() {
    const client = await pool.connect();

    try {
        // Créer la table collectes_donnees avec toutes les colonnes requises
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS collectes_donnees (
                id SERIAL PRIMARY KEY,
                partenariat VARCHAR(255),
                region VARCHAR(255),
                departement VARCHAR(255),
                commune VARCHAR(255),
                type_activite TEXT,
                site_concerne VARCHAR(500),
                adresse VARCHAR(500),
                superficie DECIMAL(10, 2),
                besoin_personnel INTEGER,
                dispositif_deploye TEXT,
                nombre_rotation INTEGER,
                infrastructure_gestion VARCHAR(50),
                prn_pp VARCHAR(50),
                frequence_collecte VARCHAR(50),
                bacs_240l INTEGER DEFAULT 0,
                caisse_polybene INTEGER DEFAULT 0,
                bacs_660l INTEGER DEFAULT 0,
                accessibilite VARCHAR(100),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                precision DECIMAL(10, 2),
                observation TEXT,
                image_1 BYTEA,
                date_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                statut VARCHAR(20) DEFAULT 'actif',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await client.query(createTableQuery);
        console.log('✅ Table collectes_donnees créée/existante');

        // Créer un index sur la date de collecte pour les performances
        const createIndexQuery = `
            CREATE INDEX IF NOT EXISTS idx_date_collecte 
            ON collectes_donnees (date_collecte DESC);
        `;
        await client.query(createIndexQuery);
        console.log('✅ Index créé sur date_collecte');

        // Créer un index sur partenariat
        const createPartenariatIndexQuery = `
            CREATE INDEX IF NOT EXISTS idx_partenariat 
            ON collectes_donnees (partenariat);
        `;
        await client.query(createPartenariatIndexQuery);
        console.log('✅ Index créé sur partenariat');

        // Tester la connexion
        const testQuery = 'SELECT NOW() as current_time;';
        const result = await client.query(testQuery);
        console.log('✅ Connexion PostgreSQL active:', result.rows[0].current_time);

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Vérifier la connexion à la base de données
 */
async function testConnection() {
    try {
        const result = await pool.query('SELECT 1');
        console.log('✅ Connexion à PostgreSQL réussie');
        return true;
    } catch (error) {
        console.error('❌ Connexion échouée:', error.message);
        return false;
    }
}

/**
 * Fermer la connexion au pool
 */
async function closePool() {
    await pool.end();
    console.log('✅ Pool de connexions fermé');
}

/**
 * Exporter les données en JSON
 */
async function exportToJSON() {
    try {
        const result = await pool.query('SELECT * FROM collectes_donnees ORDER BY date_collecte DESC;');
        return result.rows;
    } catch (error) {
        console.error('Erreur lors de l\'export JSON:', error);
        throw error;
    }
}

/**
 * Exporter les données en CSV
 */
async function exportToCSV() {
    try {
        const result = await pool.query('SELECT * FROM collectes_donnees ORDER BY date_collecte DESC;');
        
        if (result.rows.length === 0) {
            return '';
        }

        // Récupérer les colonnes
        const headers = Object.keys(result.rows[0]);
        const csvHeaders = headers.map(h => `"${h}"`).join(',');

        // Construire les lignes
        const csvRows = result.rows.map(row => {
            return headers.map(header => {
                const value = row[header];
                // Échapper les guillemets et envelopper les valeurs
                if (value === null) {
                    return '""';
                }
                const stringValue = String(value).replace(/"/g, '""');
                return `"${stringValue}"`;
            }).join(',');
        });

        return [csvHeaders, ...csvRows].join('\n');
    } catch (error) {
        console.error('Erreur lors de l\'export CSV:', error);
        throw error;
    }
}

/**
 * Obtenir les statistiques des collectes
 */
async function getStatistics() {
    try {
        const query = `
            SELECT
                COUNT(*) as total_collectes,
                COUNT(DISTINCT partenariat) as nombre_partenariats,
                COUNT(DISTINCT departement) as nombre_departements,
                COUNT(DISTINCT commune) as nombre_communes,
                SUM(CAST(superficie AS FLOAT)) as superficie_totale,
                SUM(besoin_personnel) as personnel_total
            FROM collectes_donnees
            WHERE statut = 'actif';
        `;
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        throw error;
    }
}

module.exports = {
    pool,
    initDatabase,
    testConnection,
    closePool,
    exportToJSON,
    exportToCSV,
    getStatistics
};
