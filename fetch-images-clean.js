const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Charger les variables d'environnement
require('dotenv').config();

const pool = new Pool({
    user: String(process.env.DB_USER || 'postgres'),
    password: String(process.env.DB_PASSWORD || 'postgres'),
    host: String(process.env.DB_HOST || 'localhost'),
    port: parseInt(process.env.DB_PORT) || 5432,
    database: String(process.env.DB_NAME || 'dimentionnement_SNG')
});

async function fetchLatestImages() {
    try {
        console.log('🔄 Connexion à PostgreSQL...');
        
        const query = `
            SELECT id, partenaire, region, commune, sites_concernes as site,
                   photo, date_collecte, date_modification, latitude, longitude
            FROM collectes_donnees 
            WHERE photo IS NOT NULL
            ORDER BY date_modification DESC 
            LIMIT 20
        `;
        
        const result = await pool.query(query);
        
        const images = result.rows.map((row, index) => {
            // Convertir les données bytea en base64 pour créer une data URI
            let photoDataUri = './assets/placeholder.jpg';
            
            if (row.photo) {
                try {
                    // Convertir les données binaires en base64
                    const buffer = Buffer.isBuffer(row.photo) ? row.photo : Buffer.from(row.photo, 'binary');
                    photoDataUri = `data:image/jpeg;base64,${buffer.toString('base64')}`;
                } catch (e) {
                    console.warn(`⚠️ Erreur conversion image ${row.id}:`, e.message);
                }
            }
            
            return {
                id: row.id,
                index: index,
                photo: photoDataUri,
                thumbnail: photoDataUri, // Même URI, sera ré-dimensionnée par CSS
                partenaire: row.partenaire,
                commune: row.commune,
                site: row.site,
                region: row.region,
                latitude: parseFloat(row.latitude) || 0,
                longitude: parseFloat(row.longitude) || 0,
                date: new Date(row.date_modification).toLocaleString('fr-FR'),
                timestamp: new Date(row.date_modification).getTime()
            };
        });
        
        console.log(`✅ ${images.length} images trouvées`);
        
        // Statistiques
        const communes = new Set(images.map(i => i.commune));
        const partenaires = new Set(images.map(i => i.partenaire));
        
        console.log(`📍 Communes: ${Array.from(communes).slice(0, 8).join(', ')}`);
        console.log(`📦 Partenaires: ${Array.from(partenaires).join(', ')}`);
        console.log(`💾 Fichier: latest-images.json`);
        
        console.log('\n📸 Images récentes:');
        images.slice(0, 5).forEach(img => {
            console.log(`   • ${img.commune} - ${img.site} (${img.date})`);
        });
        
        // Sauvegarder en JSON propre (métadonnées uniquement)
        const output = {
            count: images.length,
            lastUpdate: new Date().toISOString(),
            communes: Array.from(communes),
            partenaires: Array.from(partenaires),
            images: images
        };
        
        fs.writeFileSync('latest-images.json', JSON.stringify(output, null, 2));
        console.log('\n✅ Galerie mise à jour avec succès!');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

fetchLatestImages();
