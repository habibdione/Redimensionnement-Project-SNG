#!/usr/bin/env node
/**
 * Script d'initialisation PostgreSQL
 * Exécute: node setup-db.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres'  // Se connecter à la db par défaut d'abord
});

async function initDatabase() {
    try {
        console.log('🔄 Initialisation PostgreSQL...\n');

        // 1️⃣ Créer la base de données
        console.log('1️⃣ Création de la base "dimentionnement_SNG"...');
        try {
            await pool.query('CREATE DATABASE dimentionnement_SNG');
            console.log('✅ Base créée\n');
        } catch (e) {
            if (e.code === '42P04') {
                console.log('ℹ️  Base déjà existante\n');
            } else {
                throw e;
            }
        }

        // 2️⃣ Se connecter à la nouvelle base
        console.log('2️⃣ Connexion à la base dimentionnement_SNG...');
        const dbPool = new Pool({
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'dimentionnement_SNG'
        });

        // 3️⃣ Lire et exécuter le script SQL
        console.log('3️⃣ Lecture du fichier CREATE_TABLES.sql...');
        const sqlFile = path.join(__dirname, 'CREATE_TABLES.sql');
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');

        console.log('4️⃣ Exécution du script SQL...');
        await dbPool.query(sqlContent);
        console.log('✅ Tables créées avec succès\n');

        // 4️⃣ Insérer les données géographiques du Sénégal
        console.log('5️⃣ Insertion des données géographiques du Sénégal...');
        const senegalSqlFile = path.join(__dirname, 'SENEGAL_REGIONS_SETUP.sql');
        const senegalSqlContent = fs.readFileSync(senegalSqlFile, 'utf8');
        
        await dbPool.query(senegalSqlContent);
        console.log('✅ Données géographiques insérées (14 régions, 45 départements, 45+ communes)\n');

        // 6️⃣ Vérifier la table
        console.log('6️⃣ Vérification des colonnes...');
        const result = await dbPool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'collectes_donnees'
            ORDER BY ordinal_position;
        `);

        console.log('📊 Colonnes de la table collectes_donnees:');
        result.rows.forEach((row, i) => {
            console.log(`   ${i + 1}. ${row.column_name} (${row.data_type})`);
        });

        // 7️⃣ Compter les colonnes collectes_donnees
        const expectedColumns = 29;  // Nombre attendu de colonnes
        if (result.rows.length >= expectedColumns) {
            console.log(`\n✅ ${result.rows.length} colonnes trouvées (attendu: ${expectedColumns}+)`);
            console.log('✅ BASE DE DONNÉES INITIALISÉE AVEC SUCCÈS!\n');
            console.log('� Données chargées:');
            console.log('   • 14 Régions du Sénégal');
            console.log('   • 45 Départements');
            console.log('   • 45+ Communes');
            console.log('   • Table collectes_donnees prête');
            console.log('�🚀 Vous pouvez maintenant:');
            console.log('   1. Lancer le serveur: npm start');
            console.log('   2. Tester l\'app: ouvrez http://localhost:3001');
            console.log('   3. Remplir le formulaire et sauvegarder\n');
        } else {
            console.warn(`⚠️  Seulement ${result.rows.length} colonnes (attendu: ${expectedColumns}+)`);
        }

        await dbPool.end();
        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ ERREUR:', error.message);
        console.error('\n📋 Troubleshooting:');
        console.error('   - Assurez-vous que PostgreSQL est lancé');
        console.error('   - Vérifiez les identifiants (user: postgres, password: postgres)');
        console.error('   - Vérifiez le port (5432)');
        console.error('   - Essayez: npm install pg');
        await pool.end();
        process.exit(1);
    }
}

initDatabase();
