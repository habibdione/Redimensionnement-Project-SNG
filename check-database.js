#!/usr/bin/env node

/**
 * VÉRIFIER LES DONNÉES DANS POSTGRESQL
 * Exécution: node check-database.js
 */

const { pool } = require('./db');

async function checkDatabase() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║        VÉRIFICATION DE LA BASE DE DONNÉES              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    try {
        // 1. Compter les enregistrements
        const countResult = await pool.query('SELECT COUNT(*) as total FROM collectes_donnees');
        const total = parseInt(countResult.rows[0].total);
        console.log(`📊 Total d'enregistrements: ${total}`);
        
        if (total === 0) {
            console.log('   ⚠️  LA TABLE EST VIDE!');
        }
        
        // 2. Afficher les 10 derniers
        console.log('\n📋 Les 10 derniers enregistrements:\n');
        
        const result = await pool.query(`
            SELECT 
                id,
                partenaire,
                region,
                departement,
                commune,
                latitude,
                longitude,
                date_collecte,
                statut
            FROM collectes_donnees
            ORDER BY id DESC
            LIMIT 10
        `);
        
        if (result.rows.length === 0) {
            console.log('   aucune donnée');
        } else {
            result.rows.forEach((row, idx) => {
                console.log(`${idx + 1}. ID ${row.id} - ${row.partenaire}`);
                console.log(`   📍 ${row.region}/${row.departement}/${row.commune}`);
                console.log(`   🌍 ${row.latitude}, ${row.longitude}`);
                console.log(`   📅 ${row.date_collecte}`);
                console.log(`   ✅ ${row.statut}`);
                console.log('');
            });
        }
        
        // 3. Afficher structure de table
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📝 Colonnes disponibles dans la table:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        const infoResult = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'collectes_donnees'
            ORDER BY ordinal_position
        `);
        
        if (infoResult.rows.length > 0) {
            infoResult.rows.forEach(col => {
                console.log(`   • ${col.column_name.padEnd(25)} (${col.data_type})`);
            });
        }
        
        console.log('\n✅ Vérification terminée.\n');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

checkDatabase();
