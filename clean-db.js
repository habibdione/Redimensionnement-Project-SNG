#!/usr/bin/env node

/**
 * Nettoyage de la Base de Données
 * Supprime les enregistrements incomplets (sans données géographiques)
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
    database: process.env.DB_NAME || 'senelec_dimensionnement'
});

// Interface pour les prompts
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function cleanDatabase() {
    try {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║             NETTOYAGE DE LA BASE DE DONNÉES                  ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        const client = await pool.connect();

        // Identifier les enregistrements incomplets
        console.log('🔍 Recherche des enregistrements incomplets...\n');

        const findIncomplete = await client.query(`
            SELECT id, partenaire, region, departement, commune, created_at
            FROM collectes_donnees
            WHERE region IS NULL OR region = ''
               OR departement IS NULL OR departement = ''
               OR commune IS NULL OR commune = ''
            ORDER BY id ASC
        `);

        if (findIncomplete.rows.length === 0) {
            console.log('✅ Aucun enregistrement incomplet trouvé!');
            console.log('   Tous les enregistrements ont les données géographiques.\n');
            await client.end();
            rl.close();
            return;
        }

        console.log(`⚠️  ${findIncomplete.rows.length} enregistrement(s) incomplet(s) détecté(s):\n`);

        findIncomplete.rows.forEach(row => {
            console.log(`   ID #${row.id}:`);
            console.log(`      Partenaire: "${row.partenaire || 'NULL'}"`);
            console.log(`      Région: "${row.region || 'VIDE'}"`);
            console.log(`      Département: "${row.departement || 'VIDE'}"`);
            console.log(`      Commune: "${row.commune || 'VIDE'}"`);
            console.log(`      Date: ${row.created_at}\n`);
        });

        // Demander confirmation
        const confirm = await question('❓ Voulez-vous supprimer ces enregistrements? (oui/NON): ');

        if (confirm.toLowerCase() !== 'oui') {
            console.log('\n❌ Suppression annulée.');
            await client.end();
            rl.close();
            return;
        }

        // Supprimer les enregistrements
        const result = await client.query(`
            DELETE FROM collectes_donnees
            WHERE region IS NULL OR region = ''
               OR departement IS NULL OR departement = ''
               OR commune IS NULL OR commune = ''
        `);

        console.log(`\n✅ ${result.rowCount} enregistrement(s) supprimé(s)\n`);

        // Afficher les enregistrements restants
        console.log('📊 Enregistrements restants:\n');

        const remaining = await client.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN region IS NOT NULL AND region != '' THEN 1 END) as complets
            FROM collectes_donnees
        `);

        const stats = remaining.rows[0];
        console.log(`   Total: ${stats.total}`);
        console.log(`   Complets: ${stats.complets}\n`);

        // Afficher les enregistrements complets
        const validRecords = await client.query(`
            SELECT id, partenaire, region, departement, commune, created_at
            FROM collectes_donnees
            WHERE region IS NOT NULL AND region != ''
               AND departement IS NOT NULL AND departement != ''
               AND commune IS NOT NULL AND commune != ''
            ORDER BY id ASC
        `);

        if (validRecords.rows.length > 0) {
            console.log('✅ Enregistrements valides:\n');
            validRecords.rows.forEach(row => {
                console.log(`   ID #${row.id}: ${row.partenaire || 'SANS PARTENAIRE'}`);
                console.log(`      📍 ${row.region} > ${row.departement} > ${row.commune}`);
                console.log(`      📅 ${row.created_at}\n`);
            });
        }

        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                    NETTOYAGE TERMINÉ                       ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        await client.end();

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        rl.close();
        await pool.end();
    }
}

cleanDatabase();
