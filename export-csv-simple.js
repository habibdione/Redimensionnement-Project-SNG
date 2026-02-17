/**
 * EXPORT CSV SIMPLE - Sans Images
 * ================================
 * Exporte uniquement les données (sans les colonnes binaires)
 * Les images restent dans la base de données
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
 * Exporter les données en CSV sans les colonnes binaires
 */
async function exportSimpleCSV() {
    try {
        console.log('\n🚀 Démarrage de l\'export CSV simple (sans images)...\n');

        // Récupérer toutes les données
        const result = await pool.query('SELECT * FROM collectes_donnees ORDER BY date_collecte DESC;');
        
        if (result.rows.length === 0) {
            console.log('❌ Aucune donnée trouvée dans la base');
            await pool.end();
            return;
        }

        // Créer le dossier de destination
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const exportDir = path.join(__dirname, `exports/simple-export-${timestamp}`);
        
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        console.log(`📁 Dossier créé: ${exportDir}\n`);

        // Colonnes à exclure (binaires)
        const excludeColumns = ['photo'];
        
        // Obtenir l'en-tête
        const allHeaders = Object.keys(result.rows[0]);
        const headers = allHeaders.filter(h => !excludeColumns.includes(h));

        console.log(`📋 Colonnes exportées: ${headers.length}`);
        console.log(`   ✅ Colonnes incluses: ${headers.join(', ')}`);
        console.log(`   ❌ Colonnes exclues: ${excludeColumns.filter(c => allHeaders.includes(c)).join(', ')}\n`);

        // Construire le CSV
        const csvHeaders = headers.map(h => `"${h}"`).join(',');

        const csvRows = result.rows.map(row => {
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
        console.log(`   Lignes: ${result.rows.length}`);
        console.log(`   Taille: ${(csvContent.length / 1024).toFixed(2)} KB\n`);

        // Créer un fichier d'information
        const infoPath = path.join(exportDir, 'INFO.txt');
        const infoContent = `EXPORT CSV SIMPLE - INFORMATION
==================================

Date d'export: ${new Date().toLocaleString('fr-FR')}
Nombre de lignes: ${result.rows.length}
Nombre de colonnes: ${headers.length}

Colonnes incluses:
${headers.map((h, i) => `  ${i + 1}. ${h}`).join('\n')}

Colonnes EXCLUES (images dans la base de données):
${excludeColumns.filter(c => allHeaders.includes(c)).map(c => `  - ${c}`).join('\n')}

UTILISATION:
- Ouvrir le fichier dans Excel, Google Sheets, LibreOffice, etc.
- Les données sont prêtes à être analysées
- Les images restent dans la base de données PostgreSQL
- Pour exporter les images, utilisez: node export-with-images.js

COMPATIBILITÉ:
✅ Excel 2010+
✅ Google Sheets
✅ LibreOffice Calc
✅ Python (pandas)
✅ JavaScript
✅ R (read.csv)
`;
        fs.writeFileSync(infoPath, infoContent, 'utf-8');

        // Créer un exemple Python pour charger le CSV
        const pythonExamplePath = path.join(exportDir, 'load_example.py');
        const pythonContent = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Exemple: Charger et utiliser le CSV
"""

import pandas as pd
import os

# Chemin du fichier
csv_file = 'collectes_donnees.csv'

# Vérifier que le fichier existe
if not os.path.exists(csv_file):
    print(f"❌ Fichier non trouvé: {csv_file}")
    exit(1)

# Charger le CSV
print(f"📖 Chargement de {csv_file}...")
df = pd.read_csv(csv_file)

# Afficher les premières lignes
print(f"\\n✅ Données chargées! Shape: {df.shape}")
print(f"\\nPremières lignes:")
print(df.head())

# Statistiques
print(f"\\n📊 Statistiques:")
print(f"  - Régions: {df['region'].nunique()}")
print(f"  - Départements: {df['departement'].nunique()}")
print(f"  - Communes: {df['commune'].nunique()}")
print(f"  - Partenaires: {df['partenaire'].nunique()}")

# Exemple: Filtrer par région
if 'region' in df.columns:
    regions = df['region'].unique()
    print(f"\\n🗺️  Régions disponibles:")
    for region in regions:
        count = len(df[df['region'] == region])
        print(f"  - {region}: {count} collectes")

# Sauvegarder un subset
print(f"\\n💾 Exemples d'export:")
print(f"  # Export par région")
print(f"  df[df['region'] == 'Dakar'].to_csv('export_dakar.csv', index=False)")
print(f"\\n  # Export par partenaire")
print(f"  df[df['partenaire'] == 'ONG'].to_csv('export_ong.csv', index=False)")
print(f"\\n  # Export des statistiques")
print(f"  df.groupby('region').size().to_csv('stats_by_region.csv')")
`;
        fs.writeFileSync(pythonExamplePath, pythonContent, 'utf-8');

        // Résumé final
        console.log('═'.repeat(60));
        console.log('✅ EXPORT CSV SIMPLE COMPLÉTÉ');
        console.log('═'.repeat(60));
        console.log(`\n📊 Résumé:`);
        console.log(`   📁 Dossier d'export: ${exportDir}`);
        console.log(`   📄 Fichier créé: collectes_donnees.csv`);
        console.log(`   📝 Lignes: ${result.rows.length}`);
        console.log(`   🔢 Colonnes: ${headers.length}`);
        console.log(`   💾 Taille: ${(csvContent.length / 1024).toFixed(2)} KB`);
        console.log(`   📖 Info: INFO.txt`);
        console.log(`   🐍 Exemple Python: load_example.py`);
        console.log(`\n💡 Prochaines étapes:`);
        console.log(`   1. Ouvrir collectes_donnees.csv dans Excel ou Google Sheets`);
        console.log(`   2. Les images sont stockées dans PostgreSQL`);
        console.log(`   3. Pour exporter aussi les images: node export-with-images.js`);
        console.log(`\n🐍 Utilisation Python:`);
        console.log(`   python3 load_example.py`);
        console.log('\n');

    } catch (error) {
        console.error('❌ Erreur lors de l\'export:', error);
    } finally {
        await pool.end();
    }
}

// Lancer l'export
exportSimpleCSV();
