// 📸 Script pour récupérer les images les plus récentes de la base de données
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Configuration PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'dimentionnement_SNG',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'jtmmaman96'
});

async function fetchLatestImages() {
    try {
        console.log('🔄 Connexion à PostgreSQL...');
        
        // Récupérer les 20 images les plus récentes avec photos
        const query = `
            SELECT 
                id, 
                partenaire, 
                region, 
                commune, 
                sites_concernes as site,
                photo, 
                date_collecte,
                date_modification,
                latitude,
                longitude
            FROM collectes_donnees 
            WHERE photo IS NOT NULL AND photo != ''
            ORDER BY date_modification DESC 
            LIMIT 20
        `;
        
        const result = await pool.query(query);
        
        console.log(`✅ ${result.rows.length} images trouvées`);
        
        if (result.rows.length === 0) {
            console.log('⚠️ Aucune image avec photo trouvée');
            process.exit(0);
        }
        
        // Transformer les données pour la galerie
        const gallerieData = {
            count: result.rows.length,
            lastUpdate: new Date().toISOString(),
            images: result.rows.map((row, index) => {
                const photo = String(row.photo || '');
                return {
                    id: row.id,
                    index: index,
                    photo: photo.startsWith('./') || photo.startsWith('/') ? photo : `./exports/${photo}`,
                    partenaire: row.partenaire,
                    commune: row.commune,
                    site: row.site,
                    region: row.region,
                    latitude: parseFloat(row.latitude),
                    longitude: parseFloat(row.longitude),
                    date: new Date(row.date_modification).toLocaleString('fr-FR')
                };
            })
        };
        
        // Sauvegarder en JSON
        fs.writeFileSync(
            path.join(__dirname, 'latest-images.json'),
            JSON.stringify(gallerieData, null, 2)
        );
        
        console.log('📸 Galerie mise à jour:');
        console.log(`   📍 Communes: ${[...new Set(result.rows.map(r => r.commune))].join(', ')}`);
        console.log(`   📦 Partenaires: ${[...new Set(result.rows.map(r => r.partenaire))].join(', ')}`);
        console.log(`   💾 Fichier: latest-images.json`);
        
        // Afficher les images trouvées
        console.log('\n📸 Images récentes:');
        result.rows.slice(0, 5).forEach(row => {
            console.log(`   • ${row.commune} - ${row.site} (${new Date(row.date_modification).toLocaleDateString('fr-FR')})`);
        });
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        console.error('\n💡 Solutions:');
        console.error('   1. PostgreSQL en cours d\'exécution');
        console.error('   2. Variables d\'environnement correctes (.env):');
        console.error('      - DB_HOST (défaut: localhost)');
        console.error('      - DB_PORT (défaut: 5432)');
        console.error('      - DB_NAME (défaut: senelec_dimensionnement)');
        console.error('      - DB_USER (défaut: postgres)');
        console.error('      - DB_PASSWORD (défaut: postgres)');
        process.exit(1);
    } finally {
        await pool.end();
    }
}

fetchLatestImages();
