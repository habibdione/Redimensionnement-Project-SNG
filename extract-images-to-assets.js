#!/usr/bin/env node
/**
 * Script pour extraire les images depuis DTM.csv (stockées en JSON Buffer)
 * et les sauvegarder dans le dossier assets/
 */

const fs = require('fs');
const path = require('path');

const DTM_PATH = 'c:\\Users\\30100-23-SNG\\OneDrive - sonaged\\Bureau\\DTM.csv';
const ASSETS_DIR = path.join(__dirname, 'assets');

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
 * Parser CSV manuellement
 */
function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

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
 * Convertir JSON Buffer en image JPEG et sauvegarder
 */
function extractAndSaveImage(bufferJson, filename) {
    try {
        if (!bufferJson || typeof bufferJson !== 'string') {
            return null;
        }

        const parsed = JSON.parse(bufferJson);
        if (parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
            const buffer = Buffer.from(parsed.data);
            const filepath = path.join(ASSETS_DIR, filename);
            fs.writeFileSync(filepath, buffer);
            return filepath;
        }
        return null;
    } catch (err) {
        console.warn(`⚠️ Erreur extraction image ${filename}:`, err.message);
        return null;
    }
}

/**
 * Main - Extraire toutes les images
 */
async function main() {
    try {
        if (!fs.existsSync(DTM_PATH)) {
            console.error(`❌ DTM.csv non trouvé à: ${DTM_PATH}`);
            process.exit(1);
        }

        if (!fs.existsSync(ASSETS_DIR)) {
            fs.mkdirSync(ASSETS_DIR, { recursive: true });
        }

        console.log(`\n📁 Extraction des images depuis DTM.csv...`);
        console.log(`📍 Destination: ${ASSETS_DIR}\n`);

        const fileContent = fs.readFileSync(DTM_PATH, 'utf-8');
        const records = parseCSV(fileContent);

        let successCount = 0;
        let errorCount = 0;

        records.forEach((record, idx) => {
            if (record.id && record.photo) {
                const filename = `collecte-${record.id}.jpg`;
                const result = extractAndSaveImage(record.photo, filename);
                
                if (result) {
                    console.log(`✅ Image ${record.id}: ${filename}`);
                    successCount++;
                } else {
                    console.log(`❌ Erreur image ${record.id}`);
                    errorCount++;
                }
            }
        });

        console.log(`\n📊 Résultats:`);
        console.log(`✅ Images extraites: ${successCount}`);
        console.log(`❌ Erreurs: ${errorCount}`);
        console.log(`📁 Dossier assets: ${ASSETS_DIR}\n`);

        if (successCount > 0) {
            console.log(`✨ Toutes les images ont été sauvegardées dans le dossier assets/`);
        }

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

main();
