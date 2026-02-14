/**
 * VÉRIFIER LES DONNÉES D'AUJOURD'HUI
 * ==================================
 * Script pour diagnostiquer les données reçues aujourd'hui
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Configuration de la base de données
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'senelec_dimensionnement'
});

async function checkTodayData() {
    const client = await pool.connect();

    try {
        console.log('\n🔍 DIAGNOSTIC DES DONNÉES D\'AUJOURD\'HUI');
        console.log('=' .repeat(50));
        console.log(`Heure: ${new Date().toLocaleString('fr-FR')}`);

        // 1. Vérifier la connexion
        const pingResult = await client.query('SELECT NOW() as current_time;');
        console.log('\n✅ Connexion PostgreSQL active');
        console.log(`   Serveur heure: ${pingResult.rows[0].current_time}`);

        // 2. Compter total des données
        const totalResult = await client.query(
            'SELECT COUNT(*) as total_count FROM collectes_donnees;'
        );
        console.log(`\n📊 Total données en base: ${totalResult.rows[0].total_count}`);

        // 3. Données d'aujourd'hui
        const todayResult = await client.query(`
            SELECT 
                COUNT(*) as count_today,
                MAX(date_collecte) as dernière_entrée
            FROM collectes_donnees
            WHERE DATE(date_collecte) = CURRENT_DATE;
        `);
        
        const todayCount = todayResult.rows[0].count_today;
        console.log(`\n📅 Données AUJOURD'HUI: ${todayCount} entrées`);
        if (todayCount > 0) {
            console.log(`   Dernière: ${todayResult.rows[0].dernière_entrée}`);
        }

        // 4. Données de cette semaine
        const weekResult = await client.query(`
            SELECT COUNT(*) as count_week
            FROM collectes_donnees
            WHERE date_collecte >= NOW() - INTERVAL '7 days';
        `);
        console.log(`\n📈 Cette semaine: ${weekResult.rows[0].count_week} entrées`);

        // 5. Détail des données d'aujourd'hui
        if (todayCount > 0) {
            console.log(`\n📋 DÉTAIL des données d'aujourd'hui:`);
            const detailResult = await client.query(`
                SELECT 
                    id,
                    partenaire,
                    region,
                    commune,
                    type_activite,
                    date_collecte
                FROM collectes_donnees
                WHERE DATE(date_collecte) = CURRENT_DATE
                ORDER BY date_collecte DESC;
            `);

            detailResult.rows.forEach((row, index) => {
                console.log(`\n   ${index + 1}. ID: ${row.id}`);
                console.log(`      Partenaire: ${row.partenaire || 'N/A'}`);
                console.log(`      Région: ${row.region || 'N/A'}`);
                console.log(`      Commune: ${row.commune || 'N/A'}`);
                console.log(`      Activité: ${row.type_activite || 'N/A'}`);
                console.log(`      Date: ${new Date(row.date_collecte).toLocaleString('fr-FR')}`);
            });
        } else {
            console.log('\n⚠️  AUCUNE DONNÉE ENREGISTRÉE AUJOURD\'HUI');
        }

        // 6. Vérifier les erreurs possibles
        console.log(`\n🔧 DIAGNOSTIQUE:`);
        
        // Vérifier la table
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_name = 'collectes_donnees'
            ) as exists;
        `);
        
        if (tableCheck.rows[0].exists) {
            console.log('   ✅ Table collectes_donnees existe');
        } else {
            console.log('   ❌ Table collectes_donnees N\'EXISTE PAS');
        }

        // Dernières 5 données (toutes)
        console.log(`\n📌 Les 5 DERNIÈRES données (peu importe la date):`);
        const lastResult = await client.query(`
            SELECT 
                id,
                date_collecte,
                partenaire,
                region
            FROM collectes_donnees
            ORDER BY id DESC
            LIMIT 5;
        `);

        if (lastResult.rows.length === 0) {
            console.log('   ⚠️  Aucune donnée en base');
        } else {
            lastResult.rows.forEach((row, index) => {
                console.log(`   ${index + 1}. ID ${row.id} - ${new Date(row.date_collecte).toLocaleString('fr-FR')}`);
            });
        }

        console.log('\n' + '='.repeat(50));

    } catch (error) {
        console.error('❌ ERREUR:', error.message);
        console.error('\n⚠️  SOLUTIONS À VÉRIFIER:');
        console.error('1. PostgreSQL est-il démarré?');
        console.error('2. Variables d\'environnement .env correctes?');
        console.error('3. Base de données "senelec_dimensionnement" existe?');
        console.error('4. L\'utilisateur PostgreSQL a-t-il les permissions?');
    } finally {
        await client.end();
    }
}

// Exécuter
checkTodayData();
