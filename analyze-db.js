/**
 * Test - Analyser les données sauvegardées en base de données
 */

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

async function analyzeData() {
    try {
        console.log('🔍 Analyse des données en base de données...\n');

        const result = await pool.query(`
            SELECT 
                id,
                partenaire,
                region,
                departement,
                commune,
                type_activite,
                adresse,
                superficie,
                besoin_personnel,
                latitude,
                longitude,
                precision,
                created_at
            FROM collectes_donnees
            ORDER BY id DESC
            LIMIT 10
        `);

        if (result.rows.length === 0) {
            console.log('❌ Aucune donnée trouvée dans la base');
            return;
        }

        console.log(`📊 Dernières ${result.rows.length} collectes:\n`);

        result.rows.forEach((row, index) => {
            console.log(`\n${'═'.repeat(60)}`);
            console.log(`📌 Collecte #${row.id}`);
            console.log(`${'═'.repeat(60)}`);
            console.log(`   Partenaire: "${row.partenaire || 'NULL'}" ${!row.partenaire ? '❌' : '✅'}`);
            console.log(`   Région:     "${row.region || 'NULL'}" ${!row.region ? '❌ VIDE!' : '✅'}`);
            console.log(`   Département: "${row.departement || 'NULL'}" ${!row.departement ? '❌ VIDE!' : '✅'}`);
            console.log(`   Commune:    "${row.commune || 'NULL'}" ${!row.commune ? '❌ VIDE!' : '✅'}`);
            console.log(`   Adresse:    "${row.adresse || 'NULL'}"`);
            console.log(`   Superficie: ${row.superficie || 'NULL'}`);
            console.log(`   Personnel: ${row.besoin_personnel || 'NULL'}`);
            console.log(`   Type:       "${row.type_activite || 'NULL'}"`);
            console.log(`   GPS:        (${row.latitude || 'NULL'}, ${row.longitude || 'NULL'}) ±${row.precision || 'NULL'}m`);
            console.log(`   Date:       ${row.created_at}`);
        });

        console.log(`\n${'═'.repeat(60)}`);
        console.log('\n📈 ANALYSE:\n');

        // Compter les valeurs vides
        let emptyRegion = 0, emptyDept = 0, emptyCommune = 0;
        result.rows.forEach(row => {
            if (!row.region) emptyRegion++;
            if (!row.departement) emptyDept++;
            if (!row.commune) emptyCommune++;
        });

        console.log(`   Régions vides: ${emptyRegion}/${result.rows.length}`);
        console.log(`   Départements vides: ${emptyDept}/${result.rows.length}`);
        console.log(`   Communes vides: ${emptyCommune}/${result.rows.length}`);

        if (emptyRegion > 0 || emptyDept > 0 || emptyCommune > 0) {
            console.log(`\n❌ PROBLÈME DÉTECTÉ: Les données géographiques ne sont pas collectées!`);
            console.log(`\n   CAUSES POSSIBLES:`);
            console.log(`   1. Les dropdowns ne sont pas remplis au chargement`);
            console.log(`   2. L'utilisateur n'a pas sélectionné les éléments`);
            console.log(`   3. Les valeurs ne sont pas lues correctement du formulaire`);
        } else {
            console.log(`\n✅ Toutes les données sont correctement enregistrées!`);
        }

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        pool.end();
    }
}

analyzeData();
