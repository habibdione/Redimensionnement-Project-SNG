#!/usr/bin/env node

/**
 * SCRIPT DE MIGRATION DE BASE DE DONNÉES
 * ======================================
 * Applique les corrections critiques à la base de données:
 * 1. Ajoute les colonnes coordonnee_x et coordonnee_y (DTM) - CRITIQUE
 * 2. Renomme image_1 en photo - CORRECTION
 * 3. Crée les indices optimisés
 * 4. Crée les triggers automatiques
 *
 * Usage: node migrate-db.js
 *
 * ⚠️ ATTENTION: Cette script modifie la base de données!
 *   Assurez-vous d'avoir une sauvegarde avant de lancer.
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'dimensionnement_SNG'
});

// Couleurs pour les logs
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset} ${msg}`),
    step: (num, msg) => console.log(`${colors.cyan}[${num}]${colors.reset} ${msg}`),
    section: (msg) => console.log(`\n${colors.magenta}════════════════════════════════════════${colors.reset}\n${colors.magenta}${msg}${colors.reset}\n${colors.magenta}════════════════════════════════════════${colors.reset}\n`)
};

// Interface de confirmation
function confirm(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question(`${question} (oui/non): `, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'oui' || answer.toLowerCase() === 'o' || answer.toLowerCase() === 'y');
        });
    });
}

async function migrateDatabase() {
    log.section('🗄️ SCRIPT DE MIGRATION DATABASE');
    
    try {
        // Test connexion
        log.step(1, 'Vérification de la connexion...');
        const conn = await pool.connect();
        log.success('Connecté à PostgreSQL');
        conn.release();

        // Afficher les détails
        log.info(`Host: ${process.env.DB_HOST || 'localhost'}`);
        log.info(`Database: ${process.env.DB_NAME || 'dimensionnement_SNG'}`);
        
        // Demander confirmation
        log.warning('\n⚠️ ATTENTION!');
        log.warning('Ce script va MODIFIER votre base de données.');
        log.warning('Assurez-vous d\'avoir une sauvegarde avant de continuer!\n');
        
        const proceed = await confirm('Êtes-vous sûr de vouloir continuer?');
        if (!proceed) {
            log.info('Migration annulée');
            process.exit(0);
        }

        log.section('🚀 DÉBUT DE LA MIGRATION');

        // Migration 1: Créer une sauvegarde
        log.step(2, 'Création d\'une sauvegarde...');
        try {
            await pool.query(`
                DROP TABLE IF EXISTS collectes_donnees_migration_backup;
                CREATE TABLE collectes_donnees_migration_backup AS 
                SELECT * FROM collectes_donnees;
            `);
            log.success('Sauvegarde créée: collectes_donnees_migration_backup');
        } catch (e) {
            log.warning(`Sauvegarde échouée: ${e.message}`);
        }

        // Migration 2: Vérifier et ajouter colonnes manquantes
        log.step(3, 'Ajout des colonnes UTM manquantes...');
        try {
            // Vérifier si les colonnes existent
            const result = await pool.query(`
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'collectes_donnees' AND column_name IN ('coordonnee_x', 'coordonnee_y');
            `);

            if (result.rows.length === 0) {
                await pool.query(`
                    ALTER TABLE collectes_donnees 
                    ADD COLUMN coordonnee_x DECIMAL(12, 2),
                    ADD COLUMN coordonnee_y DECIMAL(12, 2);
                `);
                log.success('Colonnes coordonnee_x et coordonnee_y ajoutées');
            } else if (result.rows.length === 1) {
                const existing = result.rows[0].column_name;
                const missing = existing === 'coordonnee_x' ? 'coordonnee_y' : 'coordonnee_x';
                await pool.query(`
                    ALTER TABLE collectes_donnees 
                    ADD COLUMN ${missing} DECIMAL(12, 2);
                `);
                log.success(`Colonne ${missing} ajoutée`);
            } else {
                log.info('Colonnes coordonnee_x et coordonnee_y existent déjà');
            }
        } catch (e) {
            log.error(`Erreur lors de l'ajout des colonnes UTM: ${e.message}`);
            throw e;
        }

        // Migration 3: Renommer image_1 en photo
        log.step(4, 'Vérification de la colonne photo...');
        try {
            const imageResult = await pool.query(`
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'collectes_donnees' AND column_name = 'image_1';
            `);

            const photoResult = await pool.query(`
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'collectes_donnees' AND column_name = 'photo';
            `);

            if (imageResult.rows.length > 0 && photoResult.rows.length === 0) {
                await pool.query(`
                    ALTER TABLE collectes_donnees 
                    RENAME COLUMN image_1 TO photo;
                `);
                log.success('Colonne image_1 renommée en photo');
            } else if (photoResult.rows.length > 0) {
                log.info('Colonne photo existe déjà (OK)');
            } else if (imageResult.rows.length === 0 && photoResult.rows.length === 0) {
                await pool.query(`
                    ALTER TABLE collectes_donnees 
                    ADD COLUMN photo BYTEA;
                `);
                log.success('Colonne photo créée (elle n\'existait pas)');
            }
        } catch (e) {
            log.error(`Erreur lors de la gestion de la colonne photo: ${e.message}`);
            throw e;
        }

        // Migration 4: Créer/Vérifier les indices
        log.step(5, 'Créer les indices optimisés...');
        const indices = [
            ['idx_date_collecte', 'CREATE INDEX IF NOT EXISTS idx_date_collecte ON collectes_donnees (date_collecte DESC) WHERE statut = \'actif\''],
            ['idx_partenaire', 'CREATE INDEX IF NOT EXISTS idx_partenaire ON collectes_donnees (partenaire) WHERE statut = \'actif\''],
            ['idx_region', 'CREATE INDEX IF NOT EXISTS idx_region ON collectes_donnees (region) WHERE statut = \'actif\''],
            ['idx_departement', 'CREATE INDEX IF NOT EXISTS idx_departement ON collectes_donnees (departement) WHERE statut = \'actif\''],
            ['idx_commune', 'CREATE INDEX IF NOT EXISTS idx_commune ON collectes_donnees (commune) WHERE statut = \'actif\''],
            ['idx_statut', 'CREATE INDEX IF NOT EXISTS idx_statut ON collectes_donnees (statut)'],
            ['idx_region_departement', 'CREATE INDEX IF NOT EXISTS idx_region_departement ON collectes_donnees (region, departement) WHERE statut = \'actif\''],
            ['idx_partenaire_date', 'CREATE INDEX IF NOT EXISTS idx_partenaire_date ON collectes_donnees (partenaire, date_collecte DESC) WHERE statut = \'actif\''],
            ['idx_gps_coordinates', 'CREATE INDEX IF NOT EXISTS idx_gps_coordinates ON collectes_donnees (latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL'],
            ['idx_utm_coordinates', 'CREATE INDEX IF NOT EXISTS idx_utm_coordinates ON collectes_donnees (coordonnee_x, coordonnee_y) WHERE coordonnee_x IS NOT NULL AND coordonnee_y IS NOT NULL']
        ];

        for (const [indexName, query] of indices) {
            try {
                await pool.query(query);
                log.info(`  ✓ Index ${indexName}`);
            } catch (e) {
                if (e.code === '42P07') { // duplicate index
                    log.info(`  ✓ Index ${indexName} (déjà existant)`);
                } else {
                    log.warning(`  ⚠️ Index ${indexName}: ${e.message}`);
                }
            }
        }
        log.success('Indices vérifiés/créés');

        // Migration 5: Créer les triggers
        log.step(6, 'Création des triggers automatiques...');
        try {
            // Trigger pour updated_at
            await pool.query(`
                CREATE OR REPLACE FUNCTION update_updated_at_timestamp()
                RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = CURRENT_TIMESTAMP;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            `);

            // Vérifier si le trigger existe, sinon le créer
            const triggerCheck = await pool.query(`
                SELECT 1 FROM information_schema.triggers 
                WHERE trigger_name = 'update_collectes_donnees_timestamp'
            `);

            if (triggerCheck.rows.length === 0) {
                await pool.query(`
                    CREATE TRIGGER update_collectes_donnees_timestamp
                    BEFORE UPDATE ON collectes_donnees
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_timestamp();
                `);
                log.info('  ✓ Trigger update_collectes_donnees_timestamp créé');
            } else {
                log.info('  ✓ Trigger update_collectes_donnees_timestamp (déjà existant)');
            }

            log.success('Triggers vérifiés/créés');
        } catch (e) {
            log.warning(`Erreur lors de la création des triggers: ${e.message}`);
        }

        // Vérification finale
        log.step(7, 'Vérification finale...');
        const finalCheck = await pool.query(`
            SELECT column_name, data_type FROM information_schema.columns 
            WHERE table_name = 'collectes_donnees'
            ORDER BY ordinal_position;
        `);

        const columns = {};
        finalCheck.rows.forEach(row => {
            columns[row.column_name] = row.data_type;
        });

        let allGood = true;
        const criticalColumns = ['coordonnee_x', 'coordonnee_y', 'photo', 'partenaire'];
        
        for (const col of criticalColumns) {
            if (columns[col]) {
                log.info(`  ✓ ${col}: ${columns[col]}`);
            } else {
                log.error(`  ✗ ${col}: MANQUANTE`);
                allGood = false;
            }
        }

        if (allGood) {
            log.section('✅ MIGRATION RÉUSSIE!');
            log.success('Toutes les corrections ont été appliquées avec succès.');
            log.info('La base de données est maintenant compatible avec le code.');
            log.info('\nNous recommandons d\'exécuter: node validate-db-schema.js');
        } else {
            log.section('❌ MIGRATION INCOMPLÈTE');
            log.error('Certaines colonnes critiques sont manquantes.');
            log.warning('Vérifiez les messages d\'erreur ci-dessus.');
        }

    } catch (error) {
        log.error(`Erreur migration: ${error.message}`);
        log.warning('\n💡 Conseil: Si la migration a échoué, restaurez votre sauvegarde:');
        log.warning('   DROP TABLE collectes_donnees;');
        log.warning('   ALTER TABLE collectes_donnees_migration_backup RENAME TO collectes_donnees;');
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Lancer la migration
migrateDatabase();
