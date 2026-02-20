/**
 * Script serveur pour lire le DTM.csv et fournir les données via API
 * Utilisation : node read-dtm-csv.js
 * API endpoint: http://localhost:3002/api/dtm-data
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques depuis le dossier assets
const ASSETS_DIR = path.join(__dirname, 'assets');
app.use('/assets', express.static(ASSETS_DIR));

// Chemin vers le DTM.csv
const DTM_PATH = 'c:\\Users\\30100-23-SNG\\OneDrive - sonaged\\Bureau\\DTM.csv';

/**
 * Parser CSV manuellement (sans dépendance externe)
 */
function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    // Extraire l'en-tête
    const headers = parseCSVLine(lines[0]);
    const records = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const record = {};
        headers.forEach((header, idx) => {
            record[header] = values[idx] || '';
        });
        records.push(record);
    }

    return records;
}

/**
 * Parser une ligne CSV en tenant compte des guillemets
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

/**
 * Lire et parser le DTM.csv
 */
function readDTMData(includeFullUrl = true) {
    try {
        if (!fs.existsSync(DTM_PATH)) {
            console.error(`❌ Fichier DTM non trouvé: ${DTM_PATH}`);
            return [];
        }

        const fileContent = fs.readFileSync(DTM_PATH, 'utf-8');
        const records = parseCSV(fileContent);

        // Mapper les données avec chemins des images depuis assets/
        return records.map(record => {
            let photoPath = '';
            if (record.id) {
                const relativePath = `/assets/collecte-${record.id}.jpg`;
                // Retourner URL complète si nécessaire (pour browser depuis autre serveur)
                photoPath = includeFullUrl ? `http://localhost:3002${relativePath}` : relativePath;
            }

            return {
                id: parseInt(record.id) || 0,
                partenaire: record.partenaire || '',
                region: record.region || 'Ziguinchor',
                commune: record.commune || '',
                site: `${record.commune} - ${record.sites_concernes || 'Site de collecte'}`,
                latitude: parseFloat(record.latitude) || 12.9,
                longitude: parseFloat(record.longitude) || -16.0,
                photo: photoPath,
                date_collecte: record.date_collecte || new Date().toISOString(),
                type_activite: record.type_activite || '',
                observation: record.observation || ''
            };
        }).filter(r => r.id > 0); // Filtrer les lignes vides
    } catch (error) {
        console.error('❌ Erreur lecture DTM.csv:', error.message);
        return [];
    }
}

/**
 * API endpoint pour récupérer les données DTM
 */
app.get('/api/dtm-data', (req, res) => {
    try {
        const data = readDTMData();
        if (data.length === 0) {
            console.warn('⚠️ Aucune donnée DTM trouvée');
        }
        res.json({
            success: true,
            count: data.length,
            data: data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * API endpoint pour récupérer une image via ID
 */
app.get('/api/dtm-image/:id', (req, res) => {
    try {
        const data = readDTMData();
        const record = data.find(r => r.id === parseInt(req.params.id));
        
        if (!record || !record.photo) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json({
            success: true,
            id: record.id,
            photoPath: record.photo,
            commune: record.commune,
            partenaire: record.partenaire
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * API health check
 */
app.get('/api/health', (req, res) => {
    const data = readDTMData();
    res.json({
        status: 'ok',
        service: 'dtm-csv-server',
        records: data.length,
        dtmPath: DTM_PATH,
        dtmExists: fs.existsSync(DTM_PATH)
    });
});

// Démarrer le serveur
const PORT = process.env.DTM_PORT || 3002;
app.listen(PORT, () => {
    console.log(`\n✅ Serveur DTM démarré sur http://localhost:${PORT}`);
    console.log(`📊 Endpoint API: http://localhost:${PORT}/api/dtm-data`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📁 Chemin DTM.csv: ${DTM_PATH}`);
    console.log(`📦 Fichier existe: ${fs.existsSync(DTM_PATH) ? 'OUI ✅' : 'NON ❌'}\n`);
});
