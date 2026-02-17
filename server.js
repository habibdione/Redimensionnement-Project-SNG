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

// Middleware de logging détaillé pour les requêtes
app.use((req, res, next) => {
    const contentLength = req.headers['content-length'] || 0;
    console.log(`\n📨 [${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    console.log(`   📦 Content-Length: ${(contentLength/1024/1024).toFixed(2)}MB`);
    console.log(`   📍 Headers: Content-Type: ${req.headers['content-type'] || 'N/A'}`);
    
    // Capturer les erreurs de parsing JSON
    const originalJson = express.json({ limit: '25mb' });
    next();
});

// Gestionnaire d'erreurs de parsing JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('❌ Erreur parsing JSON:', err.message);
        return res.status(400).json({
            success: false,
            message: 'Erreur de format JSON',
            details: err.message
        });
    }
    next();
});

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

// ============================================
// FICHIERS STATIQUES
// ============================================
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'uploads')));

// Route pour index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * ============================================
 * ROUTES API
 * ============================================
 */

/**
 * POST /api/collecte
 * Sauvegarder une nouvelle collecte de données (VERSION MISE À JOUR)
 */
app.post('/api/collecte', async (req, res) => {
    try {
        console.log('\n' + '='.repeat(80));
        console.log('📥 NOUVELLE REQUÊTE POST /api/collecte reçue');
        console.log('='.repeat(80));
        
        console.log('📊 Champs reçus du client:', Object.keys(req.body).join(', '));
        console.log('\n📋 DÉTAILS DES DONNÉES REÇUES:');
        console.log('   Partenaire:', req.body.partenaire || '(VIDE)');
        console.log('   Région:', req.body.region || '(VIDE)');
        console.log('   Département:', req.body.departement || '(VIDE)');
        console.log('   Commune:', req.body.commune || '(VIDE)');
        console.log('   Sites Concernés:', req.body.sites_concernes || '(VIDE)');
        console.log('   Latitude:', req.body.latitude);
        console.log('   Longitude:', req.body.longitude);
        
        // Destructurer ET nettoyer les données
        let {
            partenaire,
            region,
            departement,
            commune,
            typeActivite,
            sites_concernes,
            superficie,
            besoinPersonnel,
            dispositifDeploy,
            nombreRotation,
            infrastructureGestion,
            frequenceCollecte,
            bacs240,
            caissePolybene,
            bacs660,
            accessibilite,
            latitude,
            longitude,
            precision,
            coordonneeX,
            coordonneeY,
            observation,
            photo,  // Base64 JPEG
            dateCollecte
        } = req.body;

        // 🔴 TRIM todas las strings
        partenaire = typeof partenaire === 'string' ? partenaire.trim() : partenaire;
        region = typeof region === 'string' ? region.trim() : region;
        departement = typeof departement === 'string' ? departement.trim() : departement;
        commune = typeof commune === 'string' ? commune.trim() : commune;
        sites_concernes = typeof sites_concernes === 'string' ? sites_concernes.trim() : sites_concernes;

        console.log('\n✅ APRÈS TRIM - Valeurs finales:');
        console.log('   Partenaire:', partenaire || '❌ VIDE');
        console.log('   Région:', region || '❌ VIDE');
        console.log('   Département:', departement || '❌ VIDE');
        console.log('   Commune:', commune || '❌ VIDE');
        console.log('   Sites Concernés:', sites_concernes || '❌ VIDE');

        // ✅ VALIDATION GPS OBLIGATOIRE SEULEMENT
        if (!latitude || !longitude) {
            console.error('❌ GPS MANQUANTS!');
            return res.status(400).json({
                success: false,
                error: 'Coordonnées GPS obligatoires'
            });
        }

        // Convertir la photo base64 en buffer si présente
        let photoBinary = null;
        if (photo) {
            console.log('📷 Photo reçue - Type:', typeof photo, '- Longueur:', photo.length, 'caractères');
            
            if (typeof photo === 'string' && photo.startsWith('data:image')) {
                try {
                    const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
                    photoBinary = Buffer.from(base64Data, 'base64');
                    console.log('   ✅ Photo convertie en buffer:', (photoBinary.length/1024).toFixed(0), 'KB');
                    
                    // Vérifier la taille
                    if (photoBinary.length > 10 * 1024 * 1024) {
                        console.warn('⚠️ Photo très large:', (photoBinary.length/1024/1024).toFixed(2), 'MB');
                    }
                } catch (e) {
                    console.error('❌ Erreur conversion photo:', e.message);
                    return res.status(400).json({
                        success: false,
                        error: 'Erreur conversion de la photo',
                        details: e.message
                    });
                }
            } else if (typeof photo === 'string') {
                console.warn('⚠️ Photo ne commence pas par data:image/');
            }
        } else {
            console.log('ℹ️ Aucune photo fournie');
        }

        const query = `
            INSERT INTO collectes_donnees (
                partenaire, region, departement, commune, type_activite,
                sites_concernes, superficie, besoin_personnel,
                dispositif_deploye, nombre_rotation, infrastructure_gestion,
                frequence_collecte, bacs_240l, caisse_polybene,
                bacs_660l, accessibilite, latitude, longitude, precision,
                coordonnee_x, coordonnee_y, observation, photo,
                date_collecte, statut
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
                $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23,
                $24, $25
            ) RETURNING id, date_collecte;
        `;

        const values = [
            partenaire || '',
            region || '',
            departement || '',
            commune || '',
            Array.isArray(typeActivite) ? typeActivite.join(', ') : (typeActivite || ''),
            sites_concernes || '',
            parseFloat(superficie) || 0,
            parseInt(besoinPersonnel) || 0,
            Array.isArray(dispositifDeploy) ? dispositifDeploy.join(', ') : (dispositifDeploy || ''),
            parseInt(nombreRotation) || 0,
            infrastructureGestion || '',
            frequenceCollecte || '',
            parseInt(bacs240) || 0,
            parseInt(caissePolybene) || 0,
            parseInt(bacs660) || 0,
            accessibilite || '',
            parseFloat(latitude),
            parseFloat(longitude),
            parseFloat(precision) || 0,
            parseFloat(coordonneeX) || 0,
            parseFloat(coordonneeY) || 0,
            observation || '',
            photoBinary,
            new Date(dateCollecte || new Date()),
            'actif'
        ];

        console.log('\n📝 VALEURS À INSÉRER DANS LA BASE:');
        console.log('   $1 (partenaire):', values[0] || '❌ VIDE');
        console.log('   $2 (region):', values[1] || '❌ VIDE');
        console.log('   $3 (departement):', values[2] || '❌ VIDE');
        console.log('   $4 (commune):', values[3] || '❌ VIDE');
        console.log('   $5 (type_activite):', values[4] || '(optionnel)');
        console.log('   $6 (sites_concernes):', values[5] || '❌ VIDE');
        console.log('   $7 (superficie):', values[6]);
        console.log('   $17 (latitude):', values[16]);
        console.log('   $18 (longitude):', values[17]);
        console.log('   $19 (precision):', values[18]);

        console.log('\n🔄 Exécution requête SQL INSERT...');
        const result = await pool.query(query, values);

        console.log('\n✅ INSERTION RÉUSSIE!');
        console.log('   ID enregistrement:', result.rows[0].id);
        console.log('   Date collecte:', result.rows[0].date_collecte);
        console.log('='.repeat(80) + '\n');

        // 📊 Synchroniser automatiquement vers Excel en arrière-plan
        if (excelEnabled !== undefined) {
            const collecteData = {
                id: result.rows[0].id,
                region: values[1],
                dept: values[2],
                commune: values[3],
                activites: values[4],
                site: values[5],
                superficie: values[6],
                personnel: values[7],
                dispositifs: values[8],
                nombre_rotation: values[9],
                infrastructure_gestion: values[10],
                frequence: values[11],
                bacs_240l: values[12],
                caisse_polybene: values[13],
                bacs_660l: values[14],
                accessibilite: values[15],
                latitude: values[16],
                longitude: values[17],
                precision: values[18],
                coord_x: values[19],
                coord_y: values[20],
                observation: values[21],
                photo_path: null
            };
        }

        res.status(201).json({
            success: true,
            message: 'Données sauvegardées avec succès en base de données',
            data: {
                id: result.rows[0].id,
                dateCollecte: result.rows[0].date_collecte
            }
        });

    } catch (error) {
        console.error('❌ Erreur INSERT /api/collecte:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            detail: error.detail || 'Erreur lors de la sauvegarde'
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
 * GET /api/collectes/partenaire/:partenaire
 * Récupérer les collectes par partenaire
 */
app.get('/api/collectes/partenaire/:partenaire', async (req, res) => {
    try {
        const { partenaire } = req.params;

        const query = `
            SELECT * FROM collectes_donnees
            WHERE partenaire = $1
            ORDER BY date_collecte DESC;
        `;

        const result = await pool.query(query, [partenaire]);

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
            partenaire,
            region,
            departement,
            commune,
            typeActivite,
            siteConcerne,
            sites_concernes,
            superficie,
            besoinPersonnel,
            dispositifDeploy,
            nombreRotation,
            infrastructureGestion,
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
                partenaire = $1,
                region = $2,
                departement = $3,
                commune = $4,
                type_activite = $5,
                site_concerne = $6,
                sites_concernes = $7,
                superficie = $8,
                besoin_personnel = $9,
                dispositif_deploye = $10,
                nombre_rotation = $11,
                infrastructure_gestion = $12,
                frequence_collecte = $13,
                bacs_240l = $14,
                caisse_polybene = $15,
                bacs_660l = $16,
                accessibilite = $17,
                latitude = $18,
                longitude = $19,
                precision = $20,
                observation = $21,
                image_1 = $22
            WHERE id = $23
            RETURNING *;
        `;

        const values = [
            partenaire, region, departement, commune,
            Array.isArray(typeActivite) ? typeActivite.join(', ') : typeActivite,
            siteConcerne, sites_concernes, parseFloat(superficie),
            parseInt(besoinPersonnel),
            Array.isArray(dispositifDeploy) ? dispositifDeploy.join(', ') : dispositifDeploy,
            parseInt(nombreRotation), infrastructureGestion,
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
                COUNT(DISTINCT partenaire) as nombre_partenaires,
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

        const server = app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════╗
║   SERVEUR DIMENSIONNEMENT SONAGED ACTIF       ║
╠═══════════════════════════════════════════════╣
║   Port: ${PORT}
║   URL: http://localhost:${PORT}
║   API: http://localhost:${PORT}/api
║   Health: http://localhost:${PORT}/api/health
╚═══════════════════════════════════════════════╝
            `);
        });

        // Gestion des erreurs de port déjà utilisé
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`\n❌ ERREUR: Le port ${PORT} est déjà utilisé!`);
                console.error('\n💡 Solutions:');
                console.error(`   1. Attendez quelques secondes et relancez...`);
                console.error(`   2. Ou: Get-NetTCPConnection -LocalPort ${PORT} | Stop-Process -Force`);
                console.error(`   3. Ou: changez le port dans .env (PORT=3002)\n`);
                process.exit(1);
            } else {
                throw error;
            }
        });

    } catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error.message);
        if (error.message.includes('EADDRINUSE')) {
            console.error('\n🔧 Le port est occupé. Tentative de nettoyage...');
        }
        process.exit(1);
    }
}

// ============================================
// GESTIONNAIRE D'ERREUR GLOBAL (EXPRESS)
// ============================================
// IMPORTANT: Ce middleware DOIT être après toutes les autres routes
app.use((err, req, res, next) => {
    console.error('\n❌ ERREUR NON CAPTURÉE:', err.message);
    console.error('   Stack:', err.stack);
    
    // S'assurer de toujours envoyer du JSON, jamais du HTML
    if (!res.headersSent) {
        res.status(err.status || 500).json({
            success: false,
            error: err.message || 'Erreur interne du serveur',
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Route 404 - Doit aussi envoyer du JSON
app.use((req, res) => {
    console.warn(`⚠️ Route non trouvée: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        error: 'Route non trouvée',
        path: req.path,
        method: req.method
    });
});

// Gestion des erreurs non attrapées
process.on('unhandledRejection', (reason, promise) => {
    console.error('Rejection non gérée:', reason);
});

// Démarrer le serveur
if (require.main === module) {
    startServer();
}

module.exports = app;
