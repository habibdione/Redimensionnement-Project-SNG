const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'senelec_dimensionnement'
});

async function verifyLatestData() {
    try {
        console.log('📊 Vérification des données les plus récentes...\n');
        
        const result = await pool.query(`
            SELECT 
                id, 
                partenaire, 
                region, 
                departement, 
                commune, 
                adresse, 
                superficie, 
                besoin_personnel,
                type_activite,
                latitude, 
                longitude,
                precision,
                date_collecte
            FROM collectes_donnees 
            ORDER BY id DESC 
            LIMIT 5
        `);
        
        if (result.rows.length === 0) {
            console.log('❌ Aucune donnée trouvée');
            return;
        }
        
        console.log('✅ Dernières 5 entrées:\n');
        result.rows.forEach((row, idx) => {
            console.log(`\n📌 Entrée #${idx + 1} (ID: ${row.id})`);
            console.log('==========================================');
            console.log(`  Partenaire:      ${row.partenaire || '❌ VIDE'}`);
            console.log(`  Région:          ${row.region || '❌ VIDE'}`);
            console.log(`  Département:     ${row.departement || '❌ VIDE'}`);
            console.log(`  Commune:         ${row.commune || '❌ VIDE'}`);
            console.log(`  Adresse:         ${row.adresse || '❌ VIDE'}`);
            console.log(`  Superficie:      ${row.superficie || '❌ VIDE'}`);
            console.log(`  Besoin Personnel: ${row.besoin_personnel || '❌ VIDE'}`);
            console.log(`  Type Activité:   ${row.type_activite || '❌ VIDE'}`);
            console.log(`  Latitude:        ${row.latitude || '❌ VIDE'}`);
            console.log(`  Longitude:       ${row.longitude || '❌ VIDE'}`);
            console.log(`  Précision:       ${row.precision || '❌ VIDE'}`);
            console.log(`  Date:            ${row.date_collecte}`);
        });
        
        console.log('\n');
        
        // Count empty fields
        const lastRow = result.rows[0];
        const emptyFields = [];
        if (!lastRow.partenaire) emptyFields.push('partenaire');
        if (!lastRow.region) emptyFields.push('region');
        if (!lastRow.departement) emptyFields.push('departement');
        if (!lastRow.commune) emptyFields.push('commune');
        if (!lastRow.adresse) emptyFields.push('adresse');
        if (!lastRow.type_activite) emptyFields.push('type_activite');
        
        if (emptyFields.length === 0) {
            console.log('✅ EXCELLENT! Tous les champs principales sont remplis!');
            console.log('✅ Le problème de transfert de données est RÉSOLU!\n');
        } else {
            console.log(`❌ Les champs suivants sont vides: ${emptyFields.join(', ')}\n`);
        }
        
    } catch (err) {
        console.error('❌ Erreur:', err.message);
    } finally {
        await pool.end();
    }
}

verifyLatestData();
