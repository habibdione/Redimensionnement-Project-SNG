require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: String(process.env.DB_USER || 'postgres'),
  password: String(process.env.DB_PASSWORD || 'postgres'),
  host: String(process.env.DB_HOST || 'localhost'),
  port: parseInt(process.env.DB_PORT || '5432'),
  database: String(process.env.DB_NAME || 'dimentionnement_SNG')
});

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'collectes_donnees'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Schéma de collectes_donnees:');
    res.rows.forEach(r => {
      console.log(`  ${r.column_name.padEnd(20)} : ${r.data_type} ${r.udt_name ? `(${r.udt_name})` : ''}`);
    });
    
    // Vérifier un enregistrement pour voir le type de donnée
    const sample = await pool.query(`
      SELECT id, photo::text, LENGTH(photo::bytea) as photo_size
      FROM collectes_donnees 
      WHERE photo IS NOT NULL 
      LIMIT 1
    `);
    
    if (sample.rows.length > 0) {
      const row = sample.rows[0];
      console.log('\n📸 Sample d\'une image:');
      console.log(`  ID: ${row.id}`);
      console.log(`  Taille: ${row.photo_size} bytes`);
      console.log(`  Premier 100 chars: ${(row.photo || '').substring(0, 100)}...`);
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
