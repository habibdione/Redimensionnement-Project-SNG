/**
 * EXPORT BASE64 - Alternative
 * ============================
 * Exporte les données avec images encodées en base64 directement dans le CSV
 * ⚠️ Attention: le fichier CSV peut être très volumineux
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
 * Exporter les données avec images en base64 dans le CSV
 */
async function exportWithBase64() {
    try {
        console.log('\n🚀 Démarrage de l\'export Base64 (images dans le CSV)...\n');

        // Récupérer toutes les données
        const result = await pool.query('SELECT * FROM collectes_donnees ORDER BY date_collecte DESC;');
        
        if (result.rows.length === 0) {
            console.log('❌ Aucune donnée trouvée dans la base');
            await pool.end();
            return;
        }

        // Créer le dossier de destination
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const exportDir = path.join(__dirname, `exports/base64-export-${timestamp}`);
        
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        console.log(`📁 Dossier créé: ${exportDir}\n`);

        // Traiter chaque ligne et convertir les images en base64
        let imageCount = 0;
        const processedRows = result.rows.map((row) => {
            const processedRow = { ...row };
            
            // Convertir photo en base64
            if (row.photo && Buffer.isBuffer(row.photo)) {
                const base64Image = row.photo.toString('base64');
                const sizeKB = (row.photo.length / 1024).toFixed(2);
                processedRow.photo_base64 = `data:image/jpeg;base64,${base64Image}`;
                processedRow.photo = ''; // Supprimer la colonne binaire originale
                imageCount++;
                console.log(`✅ Image #${imageCount} convertie en base64 (${sizeKB} KB)`);
            } else {
                processedRow.photo = '';
            }
            
            return processedRow;
        });

        console.log(`\n📸 Total d'images converties: ${imageCount}\n`);

        // Créer le CSV
        const headers = Object.keys(processedRows[0]);
        const csvHeaders = headers.map(h => `"${h}"`).join(',');

        const csvRows = processedRows.map(row => {
            return headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined) {
                    return '""';
                }
                // Limiter la longueur affichée pour base64
                let stringValue = String(value);
                if (header === 'photo_base64' && stringValue.length > 100) {
                    stringValue = stringValue.substring(0, 100) + '...(image binaire)';
                }
                stringValue = stringValue.replace(/"/g, '""');
                return `"${stringValue}"`;
            }).join(',');
        });

        const csvContent = [csvHeaders, ...csvRows].join('\n');
        const csvPath = path.join(exportDir, 'collectes_donnees_base64.csv');
        fs.writeFileSync(csvPath, csvContent, 'utf-8');

        console.log(`📄 Fichier CSV créé: collectes_donnees_base64.csv`);
        console.log(`   Lignes: ${processedRows.length}`);
        console.log(`   Taille estimée: ${(csvContent.length / 1024 / 1024).toFixed(2)} MB\n`);

        // Créer aussi la version "normale" des données (sans images)
        const normalizedRows = processedRows.map(row => {
            const normalized = { ...row };
            delete normalized.photo_base64;
            return normalized;
        });

        const normalHeaders = Object.keys(normalizedRows[0]);
        const normalCsvHeaders = normalHeaders.map(h => `"${h}"`).join(',');
        
        const normalCsvRows = normalizedRows.map(row => {
            return normalHeaders.map(header => {
                const value = row[header];
                if (value === null || value === undefined) {
                    return '""';
                }
                // Limiter l'affichage du base64
                let stringValue = String(value);
                if (header === 'photo_base64' && stringValue.length > 100) {
                    stringValue = stringValue.substring(0, 100) + '...(binaire)';
                }
                stringValue = stringValue.replace(/"/g, '""');
                return `"${stringValue}"`;
            }).join(',');
        });

        const normalCsvContent = [normalCsvHeaders, ...normalCsvRows].join('\n');
        const normalCsvPath = path.join(exportDir, 'collectes_donnees_sans_images.csv');
        fs.writeFileSync(normalCsvPath, normalCsvContent, 'utf-8');

        console.log(`📄 Fichier CSV (données seules) créé: collectes_donnees_sans_images.csv\n`);

        // Créer un guide d'utilisation
        const guidePath = path.join(exportDir, 'FORMAT_BASE64.md');
        const guideContent = `# Format Base64 - Utilisation des Images

## 📌 Qu'est-ce que Base64?

Base64 est un encodage qui convertit les données binaires en texte.
- ✅ Avantage: Tout dans 1 seul fichier CSV
- ❌ Inconvénient: Le fichier est très volumineux

## 📊 Fichiers inclus

1. **collectes_donnees_base64.csv** - CSV avec images en base64
2. **collectes_donnees_sans_images.csv** - CSV sans les images
3. **FORMAT_BASE64.md** - Ce fichier

## 🖼️ Utiliser les images en Base64

### Python
\`\`\`python
import pandas as pd
from PIL import Image
from io import BytesIO
import base64

# Charger le CSV
df = pd.read_csv('collectes_donnees_base64.csv')

# Extraire et afficher une image
base64_data = df.loc[0, 'photo_base64']

# Supprimer le préfixe data:image/jpeg;base64,
if base64_data.startswith('data:image'):
    base64_data = base64_data.split(',')[1]

# Décoder et afficher
image_data = base64.b64decode(base64_data)
img = Image.open(BytesIO(image_data))
img.show()

# Ou sauvegarder en fichier
with open('extracted_image.jpg', 'wb') as f:
    f.write(image_data)
\`\`\`

### JavaScript / NodeJS
\`\`\`javascript
// Charger le CSV (avec une librairie comme papaparse)
Papa.parse('collectes_donnees_base64.csv', {
    complete: function(results) {
        const row = results.data[1]; // Première ligne de données
        const base64Image = row.photo_base64;
        
        // Afficher dans une image HTML
        const img = document.createElement('img');
        img.src = base64Image;
        document.body.appendChild(img);
    }
});
\`\`\`

### Excel / LibreOffice
⚠️ Les images en base64 ne s'affichent pas directement dans Excel.
Solution:
1. Copiez la colonne photo_base64
2. Utilisez un outil en ligne pour convertir base64 → image
3. Ou utilisez la version "Fichiers séparés" pour plus de facilité

## 🔄 Convertir vers des fichiers

Pour convertir les images base64 en fichiers .jpg séparés:

\`\`\`python
import pandas as pd
import base64
import os

df = pd.read_csv('collectes_donnees_base64.csv')
os.makedirs('images', exist_ok=True)

for idx, row in df.iterrows():
    base64_data = row['photo_base64']
    if pd.notna(base64_data) and base64_data.startswith('data:image'):
        base64_data = base64_data.split(',')[1]
        image_data = base64.b64decode(base64_data)
        
        filename = f"images/image_{row['id']}.jpg"
        with open(filename, 'wb') as f:
            f.write(image_data)
        print(f"✅ Sauvegardé: {filename}")
\`\`\`

## 📊 Taille des fichiers

- \`collectes_donnees_base64.csv\` - GROS (contient les images)
- \`collectes_donnees_sans_images.csv\` - PETIT (données seules)

## 💡 Recommandations

**Pour la plupart des cas** ➜ Utilisez l'export "Fichiers séparés"
**Pour les bases de données** ➜ Utilisez le base64 et stockez dans une colonne BYTEA

## ❓ Questions fréquentes

**Q: Le CSV base64 n'ouvre pas dans Excel?**
A: Excel a une limite de taille (1 million de cellules). Utilisez LibreOffice ou un script.

**Q: Comment récupérer juste une image base64?**
A: Voir le script Python ci-dessus.

**Q: Je veux faire l'inverse (fichier → base64)?**
A: Voir le script d'import correspondant.
`;
        fs.writeFileSync(guidePath, guideContent, 'utf-8');

        // Résumé final
        console.log('═'.repeat(60));
        console.log('✅ EXPORT BASE64 COMPLÉTÉ');
        console.log('═'.repeat(60));
        console.log(`\n📊 Résumé:`);
        console.log(`   📁 Dossier d'export: ${exportDir}`);
        console.log(`   📄 Fichiers CSV créés:`);
        console.log(`      • collectes_donnees_base64.csv (VOLUMINEUX - avec images)`);
        console.log(`      • collectes_donnees_sans_images.csv (petit - données seules)`);
        console.log(`   🖼️  Images encodées: ${imageCount}`);
        console.log(`   📝 Lignes: ${processedRows.length}`);
        console.log(`   📖 Guide: FORMAT_BASE64.md`);
        console.log(`\n⚠️  ATTENTION:`);
        console.log(`   Le fichier CSV avec base64 peut être très volumineux.`);
        console.log(`   Fichier taille estimée: ${(csvContent.length / 1024 / 1024).toFixed(2)} MB`);
        console.log(`\n💡 Recommandation:`);
        console.log(`   Pour la plupart des cas, utilisez plutôt:`);
        console.log(`   node export-with-images.js`);
        console.log('\n');

    } catch (error) {
        console.error('❌ Erreur lors de l\'export:', error);
    } finally {
        await pool.end();
    }
}

// Lancer l'export
exportWithBase64();
