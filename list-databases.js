#!/usr/bin/env node

/**
 * LISTER TOUTES LES BASES DE DONNÉES
 */

const { Pool } = require('pg');

async function listDatabases() {
    // Connexion SANS spécifier une base (connexion au serveur postgres)
    const pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres'  // ← Connexion au serveur, pas une base
    });

    try {
        console.log('\n🗄️  BASES DE DONNÉES DISPONIBLES:\n');
        
        const result = await pool.query(`
            SELECT datname
            FROM pg_database
            ORDER BY datname
        `);
        
        result.rows.forEach(db => {
            console.log(`  • ${db.datname}`);
        });
        
        // Chercher les tables dans chaque base
        console.log('\n' + '='.repeat(60));
        console.log('🔍 CHERCHANT "collectes_donnees" DANS TOUTES LES BASES:\n');
        
        for (const db of result.rows) {
            if (db.datname === 'template0' || db.datname === 'template1') continue;
            
            const dbPool = new Pool({
                user: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'password',
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                database: db.datname
            });
            
            try {
                const tableResult = await dbPool.query(`
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_name = 'collectes_donnees'
                `);
                
                if (tableResult.rows.length > 0) {
                    console.log(`  ✅ Base: ${db.datname}`);
                    console.log(`     Table: collectes_donnees EXISTS`);
                    
                    // Compter les enregistrements
                    const countResult = await dbPool.query('SELECT COUNT(*) FROM collectes_donnees');
                    console.log(`     Records: ${countResult.rows[0].count}`);
                }
            } catch (err) {
                // Ignorer les erreurs connexion
            } finally {
                await dbPool.end();
            }
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

require('dotenv').config();
listDatabases();
