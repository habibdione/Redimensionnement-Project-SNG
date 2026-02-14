#!/usr/bin/env node

/**
 * Script de diagnostic pour PostgreSQL
 * Vérifie la connexion et l'état de la base de données
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'senelec_dimensionnement'
};

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║   DIAGNOSTIC POSTGRESQL - DIMENSIONNEMENT SENELEC   ║');
console.log('╚════════════════════════════════════════════════════╝\n');

console.log('📋 Configuration detectée:');
console.log(`   Utilisateur: ${dbConfig.user}`);
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   Base: ${dbConfig.database}`);
console.log(`   .env existe: ${fs.existsSync('.env') ? '✅ OUI' : '❌ NON'}\n`);

async function runDiagnostics() {
    try {
        // Test 1: Connexion au serveur PostgreSQL
        console.log('1️⃣  Test de connexion au serveur PostgreSQL...');
        const pool = new Pool(dbConfig);
        
        const result = await pool.query('SELECT NOW() as now');
        console.log('   ✅ Connecté à PostgreSQL');
        console.log(`   Heure serveur: ${result.rows[0].now}\n`);

        // Test 2: Vérifier les tables
        console.log('2️⃣  Vérifier les tables existantes...');
        const tableResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        if (tableResult.rows.length === 0) {
            console.log('   ⚠️  Aucune table trouvée. Création des tables...\n');
            
            const createTable = `
                CREATE TABLE IF NOT EXISTS collectes_donnees (
                    id SERIAL PRIMARY KEY,
                    partenaire VARCHAR(255),
                    region VARCHAR(255),
                    departement VARCHAR(255),
                    commune VARCHAR(255),
                    type_activite TEXT,
                    adresse VARCHAR(500),
                    superficie DECIMAL(10, 2),
                    besoin_personnel INTEGER,
                    dispositif_deploye TEXT,
                    nombre_rotation INTEGER,
                    infrastructure_gestion VARCHAR(50),
                    frequence_collecte VARCHAR(50),
                    bacs_240l INTEGER DEFAULT 0,
                    caisse_polybene INTEGER DEFAULT 0,
                    bacs_660l INTEGER DEFAULT 0,
                    accessibilite VARCHAR(100),
                    latitude DECIMAL(10, 8),
                    longitude DECIMAL(11, 8),
                    precision DECIMAL(10, 2),
                    coordonnee_x DECIMAL(10, 2),
                    coordonnee_y DECIMAL(10, 2),
                    observation TEXT,
                    photo BYTEA,
                    date_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    statut VARCHAR(20) DEFAULT 'actif',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;
            
            await pool.query(createTable);
            console.log('   ✅ Table collectes_donnees créée\n');
        } else {
            console.log(`   ✅ ${tableResult.rows.length} table(s) trouvée(s):`);
            tableResult.rows.forEach(t => {
                console.log(`      • ${t.table_name}`);
            });
            console.log('');
        }

        // Test 3: Vérifier la structure de la table collectes_donnees
        console.log('3️⃣  Structure de la table collectes_donnees...');
        const columnsResult = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'collectes_donnees'
            ORDER BY ordinal_position
        `);
        
        if (columnsResult.rows.length > 0) {
            console.log(`   ✅ ${columnsResult.rows.length} colonnes trouvées:`);
            columnsResult.rows.forEach(c => {
                console.log(`      • ${c.column_name} (${c.data_type})`);
            });
        } else {
            console.log('   ❌ Impossible de trouver les colonnes');
        }
        console.log('');

        // Test 4: Compter les enregistrements
        console.log('4️⃣  Enregistrements dans la table...');
        const countResult = await pool.query('SELECT COUNT(*) as count FROM collectes_donnees');
        console.log(`   ✅ Total: ${countResult.rows[0].count} enregistrement(s)\n`);

        // Test 5: Test d'insertion
        console.log('5️⃣  Test d\'insertion d\'un enregistrement...');
        const testInsert = await pool.query(`
            INSERT INTO collectes_donnees (
                partenaire, region, departement, commune, adresse,
                superficie, besoin_personnel, latitude, longitude
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, date_collecte
        `, ['TEST_PARTENAIRE', 'Dakar', 'Dakar', 'Dakar', 'Rue Test', 1.5, 5, 14.6349, -61.5242]);
        
        console.log(`   ✅ Insertion réussie`);
        console.log(`      ID: ${testInsert.rows[0].id}`);
        console.log(`      Date: ${testInsert.rows[0].date_collecte}\n`);

        console.log('╔════════════════════════════════════════════════════╗');
        console.log('║  ✅ TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS!        ║');
        console.log('╚════════════════════════════════════════════════════╝\n');

        await pool.end();

    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
        console.error('\n💡 Solutions possibles:');
        console.error('   1. Vérifier que PostgreSQL est en cours d\'exécution');
        console.error('   2. Vérifier les identifiants dans .env');
        console.error('   3. Vérifier que la base de données existe');
        console.error('   4. Sur Windows: Services > PostgreSQL > Démarrer\n');
        process.exit(1);
    }
}

runDiagnostics();
