/**
 * EXPORT AVANCÉ - Données + Images
 * ================================
 * Exporte les données en CSV et les images comme fichiers .jpg séparés
 * Les chemins des images sont inclus dans le CSV
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'senelec_dimensionnement'
});

/**
 * Exporter les données avec images en fichiers séparés
 */
async function exportWithImages() {
    try {
        console.log('\n🚀 Démarrage de l\'export des données avec images...\n');

        // Récupérer toutes les données
        const result = await pool.query('SELECT * FROM collectes_donnees ORDER BY date_collecte DESC;');
        
        if (result.rows.length === 0) {
            console.log('❌ Aucune donnée trouvée dans la base');
            await pool.end();
            return;
        }

        // Créer les dossiers de destination
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const exportDir = path.join(__dirname, `exports/export-${timestamp}`);
        const imagesDir = path.join(exportDir, 'images');
        
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        console.log(`📁 Dossiers créés: ${exportDir}\n`);

        // Traiter chaque ligne et extraire les images
        let imageCount = 0;
        const processedRows = result.rows.map((row, rowIndex) => {
            const processedRow = { ...row };
            
            // Traiter la colonne photo
            if (row.photo && Buffer.isBuffer(row.photo)) {
                const imageFilename = `photo_${row.id}_${++imageCount}.jpg`;
                const imagePath = path.join(imagesDir, imageFilename);
                
                // Sauvegarder l'image
                fs.writeFileSync(imagePath, row.photo);
                console.log(`✅ Image #${imageFilename} sauvegardée (${(row.photo.length / 1024).toFixed(2)} KB)`);
                
                // Remplacer la valeur binaire par le chemin
                processedRow.photo = `./images/${imageFilename}`;
            } else if (row.photo) {
                processedRow.photo = '[Pas d\'image]';
            } else {
                processedRow.photo = '';
            }
            
            return processedRow;
        });

        console.log(`\n📸 Total d'images exportées: ${imageCount}\n`);

        // Créer le CSV
        const headers = Object.keys(processedRows[0]);
        const csvHeaders = headers.map(h => `"${h}"`).join(',');

        const csvRows = processedRows.map(row => {
            return headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined) {
                    return '""';
                }
                const stringValue = String(value).replace(/"/g, '""');
                return `"${stringValue}"`;
            }).join(',');
        });

        const csvContent = [csvHeaders, ...csvRows].join('\n');
        const csvPath = path.join(exportDir, 'collectes_donnees.csv');
        fs.writeFileSync(csvPath, csvContent, 'utf-8');

        console.log(`📄 Fichier CSV créé: collectes_donnees.csv`);
        console.log(`   Lignes: ${processedRows.length}\n`);

        // Créer un fichier README
        const readmePath = path.join(exportDir, 'README.md');
        const readmeContent = `# Export des Données de Collecte

## 📊 Informations d'export
- **Date**: ${new Date().toLocaleString('fr-FR')}
- **Nombre de collectes**: ${processedRows.length}
- **Nombre d'images**: ${imageCount}

## 📁 Fichiers inclus
- \`collectes_donnees.csv\` - Toutes les données (CSV)
- \`images/\` - Dossier contenant les images extraites (.jpg)

## 🖼️ Utilisation des images

### 📍 Chemins des images
Dans le CSV, la colonne \`image_1\` contient les chemins relatifs des images:
\`\`\`
./images/image_1_1.jpg
./images/image_2_2.jpg
\`\`\`

### 💻 Accéder aux images en Python:
\`\`\`python
import pandas as pd
from PIL import Image

# Charger le CSV
df = pd.read_csv('collectes_donnees.csv')

# Ouvrir une image
img = Image.open(df.loc[0, 'image_1'])
img.show()
\`\`\`

### 🌐 Accéder aux images en JavaScript:
\`\`\`javascript
// L'image est directement utilisable
function afficherImage(imagePath) {
    const img = new Image();
    img.src = imagePath;
    document.body.appendChild(img);
}

// Charger depuis le CSV
const csvData = await fetch('collectes_donnees.csv').then(r => r.text());
const rows = csvData.split('\\n');
const imagePath = rows[1].split(',')[imageColumnIndex];
afficherImage(imagePath);
\`\`\`

### 🗂️ Réorganiser les images
Pour garder les images avec le CSV:
\`\`\`
export/
├── collectes_donnees.csv
└── images/
    ├── image_1_1.jpg
    ├── image_2_2.jpg
    └── ...
\`\`\`

## 📋 Colonnes du CSV
${headers.map((h, i) => `${i + 1}. \`${h}\``).join('\n')}

## ⚙️ Conversion Base64 (alternative)
Si vous avez besoin d'intégrer les images directement dans le CSV en base64:
\`\`\`bash
node export-base64.js
\`\`\`

## 📧 Support
Pour toute question, consultez la documentation principale.
`;
        fs.writeFileSync(readmePath, readmeContent, 'utf-8');

        // Créer un fichier de mapping images
        const mappingPath = path.join(exportDir, 'image_mapping.json');
        const mapping = processedRows.map(row => ({
            id: row.id,
            image_path: row.image_1,
            partenaire: row.partenaire,
            commune: row.commune,
            date_collecte: row.date_collecte
        })).filter(item => item.image_path && item.image_path.startsWith('./'));

        fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf-8');

        // Résumé final
        console.log('\n' + '═'.repeat(60));
        console.log('✅ EXPORT COMPLÉTÉ AVEC SUCCÈS');
        console.log('═'.repeat(60));
        console.log(`\n📊 Résumé:`);
        console.log(`   📁 Dossier d'export: ${exportDir}`);
        console.log(`   📄 Fichier CSV: collectes_donnees.csv`);
        console.log(`   🖼️  Images exportées: ${imageCount} fichiers`);
        console.log(`   📝 Total de lignes: ${processedRows.length}`);
        console.log(`   📋 README: README.md (instructions d'utilisation)`);
        console.log(`   🔗 Mapping JSON: image_mapping.json`);
        console.log(`\n📍 Localisation:`);
        console.log(`   Windows: ${exportDir}`);
        console.log(`   Raccourci: ./exports/export-${timestamp}/`);
        console.log('\n💡 Prochaines étapes:');
        console.log('   1. Ouvrir le CSV dans Excel, Google Sheets ou LibreOffice');
        console.log('   2. Les chemins des images sont dans la colonne "image_1"');
        console.log('   3. Les images se trouvent dans le sous-dossier "images/"');
        console.log('   4. Lire README.md pour des exemples d\'utilisation');
        console.log('\n');

    } catch (error) {
        console.error('❌ Erreur lors de l\'export:', error);
    } finally {
        await pool.end();
    }
}

// Lancer l'export
exportWithImages();
