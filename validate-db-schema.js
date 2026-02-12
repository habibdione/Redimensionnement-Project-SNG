#!/usr/bin/env node

/**
 * SCRIPT DE VALIDATION DE LA BASE DE DONNÉES
 * ==========================================
 * Vérifie que:
 * - Les colonnes essentielles existent
 * - Les types de données sont corrects
 * - Une requête INSERT fonctionne
 * 
 * Usage: node validate-db-schema.js
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Configuration de connexion
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'dimensionnement_SNG'
});

// Colonnes requises avec leurs types
const REQUIRED_COLUMNS = {
    'id': 'bigint|integer',
    'partenaire': 'character varying|varchar',
    'region': 'character varying|varchar',
    'departement': 'character varying|varchar',
    'commune': 'character varying|varchar',
    'type_activite': 'text',
    'adresse': 'character varying|varchar',
    'superficie': 'numeric',
    'besoin_personnel': 'integer',
    'dispositif_deploye': 'text',
    'nombre_rotation': 'integer',
    'infrastructure_gestion': 'character varying|varchar',
    'frequence_collecte': 'character varying|varchar',
    'bacs_240l': 'integer',
    'caisse_polybene': 'integer',
    'bacs_660l': 'integer',
    'accessibilite': 'character varying|varchar',
    'latitude': 'numeric',
    'longitude': 'numeric',
    'precision': 'numeric',
    'coordonnee_x': 'numeric',  // 🆕 ESSENTIEL
    'coordonnee_y': 'numeric',  // 🆕 ESSENTIEL
    'observation': 'text',
    'photo': 'bytea',           // ✅ CORRECTION
    'date_collecte': 'timestamp',
    'statut': 'character varying|varchar',
    'created_at': 'timestamp',
    'updated_at': 'timestamp'
};

const REQUIRED_INDICES = [
    'idx_date_collecte',
    'idx_partenaire',
    'idx_region',
    'idx_departement',
    'idx_commune',
    'idx_statut',
    'idx_region_departement',
    'idx_partenaire_date',
    'idx_gps_coordinates',
    'idx_utm_coordinates'
];

// Couleurs pour les logs
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset} ${msg}`),
    section: (msg) => console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}═══════════════════════════════════════${colors.reset}\n`)
};

async function validateDatabase() {
    let testsPassed = 0;
    let testsFailed = 0;

    try {
        // Tester la connexion
        log.section('1️⃣ VÉRIFICATION DE CONNEXION');
        try {
            const result = await pool.query('SELECT NOW()');
            log.success('Connexion PostgreSQL établie');
            log.info(`Heure serveur: ${result.rows[0].now}`);
            testsPassed++;
        } catch (error) {
            log.error(`Impossible de se connecter: ${error.message}`);
            testsFailed++;
            return;
        }

        // Vérifier l'existence de la table
        log.section('2️⃣ VÉRIFICATION DE LA TABLE');
        try {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'collectes_donnees'
                );
            `);
            
            if (result.rows[0].exists) {
                log.success('Table collectes_donnees existe');
                testsPassed++;
            } else {
                log.error('Table collectes_donnees n\'existe pas');
                testsFailed++;
                return;
            }
        } catch (error) {
            log.error(`Erreur lors de la vérification de table: ${error.message}`);
            testsFailed++;
            return;
        }

        // Vérifier les colonnes
        log.section('3️⃣ VÉRIFICATION DES COLONNES');
        try {
            const result = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'collectes_donnees'
                ORDER BY ordinal_position;
            `);

            const actualColumns = {};
            result.rows.forEach(row => {
                actualColumns[row.column_name] = row.data_type;
            });

            let criticalMissing = [];
            let warningMissing = [];

            Object.entries(REQUIRED_COLUMNS).forEach(([colName, expectedType]) => {
                if (actualColumns[colName]) {
                    // Vérifier le type
                    const expectedTypes = expectedType.split('|');
                    const isValidType = expectedTypes.some(t => actualColumns[colName].includes(t));
                    
                    if (isValidType) {
                        log.success(`Colonne '${colName}' (${actualColumns[colName]})`);
                        testsPassed++;
                    } else {
                        log.warning(`Colonne '${colName}' type incorrect: ${actualColumns[colName]} (attendu: ${expectedType})`);
                        testsFailed++;
                    }
                } else {
                    // Vérifier si c'est une colonne critique
                    if (['coordonnee_x', 'coordonnee_y', 'photo', 'partenaire'].includes(colName)) {
                        criticalMissing.push(colName);
                        log.error(`Colonne CRITIQUE manquante: '${colName}'`);
                    } else {
                        warningMissing.push(colName);
                        log.warning(`Colonne optionnelle manquante: '${colName}'`);
                    }
                    testsFailed++;
                }
            });

            if (criticalMissing.length > 0) {
                log.error(`\n🚨 COLONNES CRITIQUES MANQUANTES: ${criticalMissing.join(', ')}`);
                log.error('Migration URGENTE requise!');
            }

            if (warningMissing.length > 0) {
                log.warning(`Colonnes optionnelles manquantes: ${warningMissing.join(', ')}`);
            }
        } catch (error) {
            log.error(`Erreur lors de la vérification des colonnes: ${error.message}`);
            testsFailed++;
        }

        // Vérifier les indices
        log.section('4️⃣ VÉRIFICATION DES INDICES');
        try {
            const result = await pool.query(`
                SELECT indexname FROM pg_indexes 
                WHERE tablename = 'collectes_donnees'
                ORDER BY indexname;
            `);

            const actualIndices = result.rows.map(r => r.indexname);
            
            REQUIRED_INDICES.forEach(indexName => {
                if (actualIndices.includes(indexName)) {
                    log.success(`Index '${indexName}' présent`);
                    testsPassed++;
                } else {
                    log.warning(`Index '${indexName}' manquant`);
                    testsFailed++;
                }
            });
        } catch (error) {
            log.error(`Erreur lors de la vérification des indices: ${error.message}`);
            testsFailed++;
        }

        // Tester les triggers
        log.section('5️⃣ VÉRIFICATION DES TRIGGERS');
        try {
            const result = await pool.query(`
                SELECT trigger_name FROM information_schema.triggers 
                WHERE event_object_table = 'collectes_donnees'
                ORDER BY trigger_name;
            `);

            const triggers = result.rows.map(r => r.trigger_name);
            
            if (triggers.length > 0) {
                log.success(`${triggers.length} trigger(s) déclaré(s): ${triggers.join(', ')}`);
                testsPassed++;
            } else {
                log.warning('Aucun trigger déclaré (recommended: au moins 2)');
                testsFailed++;
            }
        } catch (error) {
            log.error(`Erreur lors de la vérification des triggers: ${error.message}`);
            testsFailed++;
        }

        // Tester une requête INSERT
        log.section('6️⃣ TEST DE REQUÊTE INSERT');
        try {
            const testData = {
                coordonnee_x: 649874.25,
                coordonnee_y: 1456325.75
            };

            // Vérifier d'abord que coordonnee_x et coordonnee_y existent
            const result = await pool.query(`
                INSERT INTO collectes_donnees (
                    partenaire, region, departement, commune, type_activite,
                    adresse, superficie, besoin_personnel,
                    dispositif_deploye, nombre_rotation, infrastructure_gestion,
                    frequence_collecte, bacs_240l, caisse_polybene,
                    bacs_660l, accessibilite, latitude, longitude, precision,
                    coordonnee_x, coordonnee_y, observation, photo,
                    date_collecte, statut
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
                    $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23,
                    $24, $25
                ) RETURNING id, partenaire, coordonnee_x, coordonnee_y;
            `, [
                'TEST_SONAGED',
                'Région de Ziguinchor',
                'Ziguinchor',
                'Ziguinchor',
                'Test',
                'Adresse Test',
                2.81,
                5,
                'Pelle Chargeur',
                2,
                'PRN',
                'F2',
                48,
                24,
                12,
                'Route goudronnée',
                13.1939,
                -15.5277,
                8.5,
                testData.coordonnee_x,
                testData.coordonnee_y,
                'Test de validation',
                null,
                new Date(),
                'brouillon'
            ]);

            const recordId = result.rows[0].id;
            log.success(`INSERT TEST réussi! Record ID: ${recordId}`);
            log.info(`Coordonnées UTM: X=${result.rows[0].coordonnee_x}, Y=${result.rows[0].coordonnee_y}`);
            testsPassed++;

            // Nettoyer le test record
            await pool.query('DELETE FROM collectes_donnees WHERE partenaire = $1', ['TEST_SONAGED']);
            log.info('Enregistrement de test supprimé');
        } catch (error) {
            log.error(`INSERT TEST ÉCHOUÉ: ${error.message}`);
            log.error(`Code erreur: ${error.code}`);
            testsFailed++;
        }

        // Résumé
        log.section('📊 RÉSUMÉ DES TESTS');
        const total = testsPassed + testsFailed;
        const percentage = Math.round((testsPassed / total) * 100);
        
        log.info(`Tests réussis: ${testsPassed}/${total} (${percentage}%)`);
        
        if (testsFailed === 0) {
            log.success('\n✨ BASE DE DONNÉES VALIDÉE - PRÊTE À L\'UTILISATION ✨\n');
        } else if (percentage >= 80) {
            log.warning(`\n⚠️ Base de données partiellement compatible (${percentage}%)`);
            log.warning('Des colonnes ou indices manquent.\n');
        } else {
            log.error(`\n🚨 Base de données NON COMPATIBLE (${percentage}%)`);
            log.error('Migration URGENTE requise!\n');
        }

    } catch (error) {
        log.error(`Erreur générale: ${error.message}`);
    } finally {
        await pool.end();
        process.exit(testsFailed === 0 ? 0 : 1);
    }
}

// Lancer la validation
validateDatabase();
