/**
 * Script pour créer la base de données PostgreSQL
 */

const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function createDatabase() {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres' // Se connecter à postgres par défaut
    });

    try {
        await client.connect();
        console.log('✅ Connecté à PostgreSQL');

        // Créer la base de données
        const dbName = process.env.DB_NAME || 'dimentionnement_sng';
        await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
        await client.query(`CREATE DATABASE ${dbName}`);
        console.log(`✅ Base de données '${dbName}' créée`);

        await client.end();

        // Maintenant initialiser les tables
        await initializeTables();
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

async function initializeTables() {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'dimentionnement_sng'
    });

    try {
        await client.connect();
        console.log('✅ Connecté à la base de données');

        // Créer les tables
        await client.query(`
            CREATE TABLE IF NOT EXISTS collectes_donnees (
                id SERIAL PRIMARY KEY,
                partenaire VARCHAR(255),
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
                photo_url VARCHAR(500),
                observations TEXT,
                date_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Table collectes_donnees créée');
        await client.end();
        console.log('🎉 Base de données initialisée avec succès!');
    } catch (error) {
        console.error('❌ Erreur lors de la création des tables:', error.message);
        process.exit(1);
    }
}

createDatabase();
