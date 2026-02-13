#!/usr/bin/env node
/**
 * 🗺️ Script d'insertion des données géographiques du Sénégal
 * Exécute: node setup-senegal-data.js
 * 
 * Ce script insère:
 * - 14 Régions
 * - 45 Départements
 * - 45+ Communes
 */

const { Pool } = require('pg');
const SENEGAL_DATA = require('./data-senegal.js');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'dimentionnement_SNG'
});

async function insertSenegalData() {
    const client = await pool.connect();
    
    try {
        console.log('🗺️  Insertion des données géographiques du Sénégal...\n');
        
        // Transaction
        await client.query('BEGIN');
        
        // 1️⃣ Insérer les régions
        console.log('1️⃣ Insertion des régions...');
        let regionCount = 0;
        
        for (const region of SENEGAL_DATA.regions) {
            const nomSansEmoji = region.nom.replace(/^[^\s]+ /, '');
            
            await client.query(
                `INSERT INTO regions (code, nom, emoji, description) 
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (code) DO NOTHING`,
                [
                    region.code,
                    nomSansEmoji,
                    region.nom.split(' ')[0],  // emoji
                    `Région de ${nomSansEmoji}`
                ]
            );
            regionCount++;
        }
        console.log(`   ✅ ${regionCount} régions insérées\n`);
        
        // 2️⃣ Insérer les départements
        console.log('2️⃣ Insertion des départements...');
        let deptCount = 0;
        
        for (const region of SENEGAL_DATA.regions) {
            const regionRow = await client.query(
                'SELECT id FROM regions WHERE code = $1',
                [region.code]
            );
            
            if (regionRow.rows.length > 0) {
                const regionId = regionRow.rows[0].id;
                
                for (const dept of region.departements) {
                    await client.query(
                        `INSERT INTO departements (region_id, nom, code) 
                         VALUES ($1, $2, $3)
                         ON CONFLICT (region_id, nom) DO NOTHING`,
                        [
                            regionId,
                            dept.nom,
                            `${region.code}-${dept.id.toUpperCase()}`
                        ]
                    );
                    deptCount++;
                }
            }
        }
        console.log(`   ✅ ${deptCount} départements insérés\n`);
        
        // 3️⃣ Insérer les communes
        console.log('3️⃣ Insertion des communes...');
        let communeCount = 0;
        
        for (const region of SENEGAL_DATA.regions) {
            const regionRow = await client.query(
                'SELECT id FROM regions WHERE code = $1',
                [region.code]
            );
            
            if (regionRow.rows.length > 0) {
                const regionId = regionRow.rows[0].id;
                
                for (const dept of region.departements) {
                    const deptRow = await client.query(
                        `SELECT id FROM departements 
                         WHERE region_id = $1 AND nom = $2`,
                        [regionId, dept.nom]
                    );
                    
                    if (deptRow.rows.length > 0) {
                        const deptId = deptRow.rows[0].id;
                        
                        for (const commune of dept.communes) {
                            await client.query(
                                `INSERT INTO communes (departement_id, region_id, nom, code) 
                                 VALUES ($1, $2, $3, $4)
                                 ON CONFLICT (departement_id, nom) DO NOTHING`,
                                [
                                    deptId,
                                    regionId,
                                    commune,
                                    `${region.code}-${dept.id.toUpperCase()}-${commune.substring(0, 2).toUpperCase()}`
                                ]
                            );
                            communeCount++;
                        }
                    }
                }
            }
        }
        console.log(`   ✅ ${communeCount} communes insérées\n`);
        
        // 4️⃣ Vérifier les statistiques
        console.log('4️⃣ Vérification des statistiques...\n');
        
        const statsResult = await client.query(`
            SELECT 
                (SELECT COUNT(*) FROM regions) as regions,
                (SELECT COUNT(*) FROM departements) as departements,
                (SELECT COUNT(*) FROM communes) as communes
        `);
        
        const stats = statsResult.rows[0];
        console.log(`   📊 Régions: ${stats.regions}`);
        console.log(`   📊 Départements: ${stats.departements}`);
        console.log(`   📊 Communes: ${stats.communes}\n`);
        
        // Commit la transaction
        await client.query('COMMIT');
        
        console.log('✅ SUCCÈS! Les données géographiques du Sénégal sont maintenant en base de données!\n');
        console.log('📍 Exemple d\'utilisation SQL:');
        console.log('   SELECT * FROM regions;');
        console.log('   SELECT * FROM departements WHERE region_id = 1;');
        console.log('   SELECT * FROM communes WHERE region_id = 1;\n');
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ ERREUR:', error.message);
        console.error('\n📋 Troubleshooting:');
        console.error('   - Assurez-vous que PostgreSQL est lancé');
        console.error('   - Vérifiez la base de données: dimentionnement_SNG');
        console.error('   - Vérifiez que les tables existent: regions, departements, communes');
        console.error('   - Lancez d\'abord: node setup-db.js\n');
    } finally {
        client.release();
        await pool.end();
    }
}

insertSenegalData();
