#!/usr/bin/env node

/**
 * TEST D'INSERTION MANUELLE
 * Insérer une donnée directement et vérifier si elle persiste
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'dimentionnement_SNG'
});

async function testInsert() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║          TEST D\'INSERTION MANUELLE                    ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    try {
        // 1. Compter avant
        const beforeCount = await pool.query('SELECT COUNT(*) FROM collectes_donnees');
        console.log(`📊 Enregistrements AVANT: ${beforeCount.rows[0].count}`);
        
        // 2. Insérer une donnée test
        console.log('\n🔄 Insertion d\'une donnée test...\n');
        
        const insertQuery = `
            INSERT INTO collectes_donnees (
                partenaire, region, departement, commune,
                sites_concernes, latitude, longitude,
                observation, statut
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9
            ) RETURNING id, date_collecte
        `;
        
        const values = [
            'Test Direct',
            'Dakar',
            'Dakar',
            'Plateau',
            'Site Test',
            14.6928,
            -17.0467,
            'Données insérées directement par test-insert.js',
            'actif'
        ];
        
        const result = await pool.query(insertQuery, values);
        
        console.log(`✅ Insertion réussie!`);
        console.log(`   ID: ${result.rows[0].id}`);
        console.log(`   Date: ${result.rows[0].date_collecte}\n`);
        
        // 3. Compter après
        const afterCount = await pool.query('SELECT COUNT(*) FROM collectes_donnees');
        console.log(`📊 Enregistrements APRÈS: ${afterCount.rows[0].count}`);
        
        if (parseInt(afterCount.rows[0].count) > parseInt(beforeCount.rows[0].count)) {
            console.log(`\n✅ SUCCÈS! Les données PERSISTENT bien!`);
        } else {
            console.log(`\n❌ PROBLÈME! Les données n'ont pas été sauvegardées!`);
        }
        
        // 4. Afficher le nouvel enregistrement
        console.log('\n📋 Dernier enregistrement:');
        const lastRecord = await pool.query(
            'SELECT * FROM collectes_donnees ORDER BY id DESC LIMIT 1'
        );
        if (lastRecord.rows.length > 0) {
            const rec = lastRecord.rows[0];
            console.log(`   ID: ${rec.id}`);
            console.log(`   Partenaire: ${rec.partenaire}`);
            console.log(`   Région: ${rec.region}`);
            console.log(`   Coords: ${rec.latitude}, ${rec.longitude}`);
            console.log(`   Statut: ${rec.statut}`);
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        console.error(error);
    } finally {
        await pool.end();
    }
}

testInsert();
