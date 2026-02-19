require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

const pool = new Pool({
    user: String(process.env.DB_USER || 'postgres'),
    password: String(process.env.DB_PASSWORD || 'postgres'),
    host: String(process.env.DB_HOST || 'localhost'),
    port: parseInt(process.env.DB_PORT) || 5432,
    database: String(process.env.DB_NAME || 'dimentionnement_SNG')
});

// API: Récupérer tous les métadonnées des images (sans les données binaires)
app.get('/api/images', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, partenaire, region, commune, sites_concernes as site,
                   date_collecte, date_modification, latitude, longitude
            FROM collectes_donnees 
            WHERE photo IS NOT NULL
            ORDER BY date_modification DESC 
            LIMIT 20
        `);
        
        const images = result.rows.map((row, index) => ({
            id: row.id,
            index: index,
            partenaire: row.partenaire,
            commune: row.commune,
            site: row.site,
            region: row.region,
            latitude: parseFloat(row.latitude) || 0,
            longitude: parseFloat(row.longitude) || 0,
            date: new Date(row.date_collecte).toLocaleDateString('fr-FR'),
            timestamp: new Date(row.date_modification).toLocaleString('fr-FR')
        }));
        
        // Déterminer les communes et partenaires uniques
        const communes = [...new Set(images.map(i => i.commune))];
        const partenaires = [...new Set(images.map(i => i.partenaire))];
        
        res.json({
            count: images.length,
            lastUpdate: new Date().toISOString(),
            communes: communes,
            partenaires: partenaires,
            images: images
        });
        
    } catch (err) {
        console.error('Erreur /api/images:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// API: Récupérer une image spécifique par ID
app.get('/api/image/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'SELECT photo FROM collectes_donnees WHERE id = $1 AND photo IS NOT NULL',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Image non trouvée' });
        }
        
        const photo = result.rows[0].photo;
        res.set('Content-Type', 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=31536000'); // 1 an de cache
        res.send(photo);
        
    } catch (err) {
        console.error('Erreur /api/image:', err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.API_PORT || 3003;
app.listen(PORT, () => {
    console.log(`✅ API Images en cours d'exécution sur le port ${PORT}`);
    console.log(`   GET /api/images - Récupérer tous les métadonnées`);
    console.log(`   GET /api/image/:id - Récupérer une image spécifique`);
});
