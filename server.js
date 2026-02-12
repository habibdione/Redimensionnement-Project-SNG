/**
 * SERVEUR BACKEND - DIMENSIONNEMENT SENELEC
 * ============================================
 * Serveur Express pour la gestion des données avec PostgreSQL
 * 
 * Installation des dépendances:
 * npm install express cors dotenv pg multer
 * 
 * Variables d'environnement requises (.env):
 * DB_USER=postgres
 * DB_PASSWORD=votre_mot_de_passe
 * DB_HOST=localhost
 * DB_PORT=5432
 * DB_NAME=senelec_dimensionnement
 * PORT=3001
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Configuration multer pour les téléchargements d'images
const upload = multer({
    dest: path.join(__dirname, 'uploads'),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        // Accepter seulement les images
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Format d\'image non accepté'));
        }
    }
});

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
}

// Import de la base de données
const { pool, initDatabase } = require('./db');

/**
 * ============================================
 * ROUTES API
 * ============================================
 */

/**
 * POST /api/collecte
 * Sauvegarder une nouvelle collecte de données
 */
app.post('/api/collecte', async (req, res) => {
    try {
        const {
            partenariat,
            region,
            departement,
            commune,
            typeActivite,
            siteConcerne,
            adresse,
            superficie,
            besoinPersonnel,
            dispositifDeploy,
            nombreRotation,
            infrastructureGestion,
            prnPp,
            frequenceCollecte,
            bacs240,
            caissePolybene,
            bacs660,
            accessibilite,
            latitude,
            longitude,
            precision,
            observation,
            image1
        } = req.body;

        const query = `
            INSERT INTO collectes_donnees (
                partenariat, region, departement, commune, type_activite,
                site_concerne, adresse, superficie, besoin_personnel,
                dispositif_deploye, nombre_rotation, infrastructure_gestion,
                prn_pp, frequence_collecte, bacs_240l, caisse_polybene,
                bacs_660l, accessibilite, latitude, longitude, precision,
                observation, image_1, date_collecte
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
                $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW()
            ) RETURNING id, date_collecte;
        `;

        const values = [
            partenariat,
            region,
            departement,
            commune,
            Array.isArray(typeActivite) ? typeActivite.join(', ') : typeActivite,
            siteConcerne,
            adresse,
            parseFloat(superficie),
            parseInt(besoinPersonnel),
            Array.isArray(dispositifDeploy) ? dispositifDeploy.join(', ') : dispositifDeploy,
            parseInt(nombreRotation),
            infrastructureGestion,
            prnPp,
            frequenceCollecte,
            parseInt(bacs240),
            parseInt(caissePolybene),
            parseInt(bacs660),
            accessibilite,
            parseFloat(latitude),
            parseFloat(longitude),
            parseFloat(precision),
            observation,
            image1 || null
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
            success: true,
            message: 'Données sauvegardées avec succès',
            data: {
                id: result.rows[0].id,
                dateCollecte: result.rows[0].date_collecte
            }
        });

    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la sauvegarde des données',
            details: error.message
        });
    }
});

/**
 * GET /api/collecte/:id
 * Récupérer une collecte spécifique
 */
app.get('/api/collecte/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'SELECT * FROM collectes_donnees WHERE id = $1;';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Collecte non trouvée'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Erreur lors de la lecture:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la lecture des données'
        });
    }
});

/**
 * GET /api/collectes
 * Récupérer toutes les collectes (avec pagination)
 */
app.get('/api/collectes', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Récupérer les données
        const dataQuery = `
            SELECT * FROM collectes_donnees
            ORDER BY date_collecte DESC
            LIMIT $1 OFFSET $2;
        `;

        // Récupérer le nombre total
        const countQuery = 'SELECT COUNT(*) as total FROM collectes_donnees;';

        const [dataResult, countResult] = await Promise.all([
            pool.query(dataQuery, [limit, offset]),
            pool.query(countQuery)
        ]);

        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages
            },
            data: dataResult.rows
        });

    } catch (error) {
        console.error('Erreur lors de la lecture:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la lecture des données'
        });
    }
});

/**
 * GET /api/collectes/partenariat/:partenariat
 * Récupérer les collectes par partenariat
 */
app.get('/api/collectes/partenariat/:partenariat', async (req, res) => {
    try {
        const { partenariat } = req.params;

        const query = `
            SELECT * FROM collectes_donnees
            WHERE partenariat = $1
            ORDER BY date_collecte DESC;
        `;

        const result = await pool.query(query, [partenariat]);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la lecture des données'
        });
    }
});

/**
 * PUT /api/collecte/:id
 * Mettre à jour une collecte
 */
app.put('/api/collecte/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            partenariat,
            region,
            departement,
            commune,
            typeActivite,
            siteConcerne,
            adresse,
            superficie,
            besoinPersonnel,
            dispositifDeploy,
            nombreRotation,
            infrastructureGestion,
            prnPp,
            frequenceCollecte,
            bacs240,
            caissePolybene,
            bacs660,
            accessibilite,
            latitude,
            longitude,
            precision,
            observation,
            image1
        } = req.body;

        const query = `
            UPDATE collectes_donnees SET
                partenariat = $1,
                region = $2,
                departement = $3,
                commune = $4,
                type_activite = $5,
                site_concerne = $6,
                adresse = $7,
                superficie = $8,
                besoin_personnel = $9,
                dispositif_deploye = $10,
                nombre_rotation = $11,
                infrastructure_gestion = $12,
                prn_pp = $13,
                frequence_collecte = $14,
                bacs_240l = $15,
                caisse_polybene = $16,
                bacs_660l = $17,
                accessibilite = $18,
                latitude = $19,
                longitude = $20,
                precision = $21,
                observation = $22,
                image_1 = $23
            WHERE id = $24
            RETURNING *;
        `;

        const values = [
            partenariat, region, departement, commune,
            Array.isArray(typeActivite) ? typeActivite.join(', ') : typeActivite,
            siteConcerne, adresse, parseFloat(superficie),
            parseInt(besoinPersonnel),
            Array.isArray(dispositifDeploy) ? dispositifDeploy.join(', ') : dispositifDeploy,
            parseInt(nombreRotation), infrastructureGestion, prnPp,
            frequenceCollecte, parseInt(bacs240), parseInt(caissePolybene),
            parseInt(bacs660), accessibilite, parseFloat(latitude),
            parseFloat(longitude), parseFloat(precision), observation,
            image1 || null, id
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Collecte non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Collecte mise à jour avec succès',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour'
        });
    }
});

/**
 * DELETE /api/collecte/:id
 * Supprimer une collecte
 */
app.delete('/api/collecte/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM collectes_donnees WHERE id = $1 RETURNING id;';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Collecte non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Collecte supprimée avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression'
        });
    }
});

/**
 * GET /api/statistiques
 * Obtenir les statistiques des collectes
 */
app.get('/api/statistiques', async (req, res) => {
    try {
        const query = `
            SELECT
                COUNT(*) as total_collectes,
                COUNT(DISTINCT partenariat) as nombre_partenariats,
                COUNT(DISTINCT departement) as nombre_departements,
                COUNT(DISTINCT commune) as nombre_communes,
                SUM(CAST(superficie AS FLOAT)) as superficie_totale,
                SUM(besoin_personnel) as personnel_total,
                SUM(bacs_240l) as total_bacs_240,
                SUM(caisse_polybene) as total_caisses
            FROM collectes_donnees;
        `;

        const result = await pool.query(query);

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des statistiques'
        });
    }
});

/**
 * GET /api/health
 * Vérifier l'état du serveur
 */
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            success: true,
            status: 'OK',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'ERROR',
            database: 'disconnected',
            error: error.message
        });
    }
});

/**
 * Initialisation du serveur
 */
async function startServer() {
    try {
        // Initialiser la base de données
        await initDatabase();
        console.log('✅ Base de données initialisée');

        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════╗
║   SERVEUR DIMENSIONNEMENT SENELEC ACTIF       ║
╠═══════════════════════════════════════════════╣
║   Port: ${PORT}
║   URL: http://localhost:${PORT}
║   API: http://localhost:${PORT}/api
║   Health: http://localhost:${PORT}/api/health
╚═══════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error);
        process.exit(1);
    }
}

// Gestion des erreurs non attrapées
process.on('unhandledRejection', (reason, promise) => {
    console.error('Rejection non gérée:', reason);
});

// Démarrer le serveur
if (require.main === module) {
    startServer();
}

module.exports = app;
