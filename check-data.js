require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

pool.query('SELECT id, partenaire, region, departement, commune, latitude, longitude, created_at FROM collectes_donnees ORDER BY id DESC LIMIT 5', (err, res) => {
    if (err) {
        console.error('❌ Erreur:', err.message);
    } else {
        console.log('\n📊 DERNIÈRES COLLECTES (5 dernières):');
        console.log('═'.repeat(100));
        console.log('ID    | Partenaire       | Région       | Département | Commune       | Latitude  | Longitude | Date');
        console.log('═'.repeat(100));
        res.rows.forEach(row => {
            const date = new Date(row.created_at).toLocaleString('fr-FR');
            console.log(`${String(row.id).padEnd(5)} | ${String(row.partenaire || '(vide)').padEnd(16)} | ${String(row.region || '(vide)').padEnd(12)} | ${String(row.departement || '(vide)').padEnd(11)} | ${String(row.commune || '(vide)').padEnd(13)} | ${String(row.latitude || '').padEnd(9)} | ${String(row.longitude || '').padEnd(9)} | ${date}`);
        });
        console.log('═'.repeat(100));
        console.log(`\n✅ Total de collectes dans la BD: ${res.rowCount}`);
    }
    pool.end();
});
