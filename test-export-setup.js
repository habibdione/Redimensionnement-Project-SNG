/**
 * TEST PRÉALABLE - Vérification avant Export
 * ===========================================
 */

const { Pool } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'senelec_dimensionnement'
});

async function testSetup() {
    try {
        console.log('\n' + '═'.repeat(60));
        console.log('🔍 TEST PRÉALABLE - VÉRIFICATION AVANT EXPORT');
        console.log('═'.repeat(60) + '\n');

        // 1. Test connexion BD
        console.log('1️⃣  Test de connexion PostgreSQL...');
        try {
            const result = await pool.query('SELECT NOW()');
            console.log('   ✅ Connexion réussie');
            console.log(`   ✓ Serveur: ${process.env.DB_HOST || 'localhost'}`);
            console.log(`   ✓ Base de données: ${process.env.DB_NAME || 'senelec_dimensionnement'}`);
            console.log(`   ✓ Heure du serveur: ${result.rows[0].now}\n`);
        } catch (error) {
            console.error('   ❌ Erreur de connexion:');
            console.error(`   ${error.message}\n`);
            throw error;
        }

        // 2. Test table existante
        console.log('2️⃣  Vérification de la table collectes_donnees...');
        try {
            const tableResult = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'collectes_donnees'
                );
            `);
            
            if (tableResult.rows[0].exists) {
                console.log('   ✅ Table collectes_donnees existe\n');
            } else {
                console.log('   ❌ Table collectes_donnees NON TROUVÉE\n');
                console.log('   Action: Exécuter create-db.js ou setup-db.js\n');
                throw new Error('Table manquante');
            }
        } catch (error) {
            console.error(`   ❌ Erreur: ${error.message}\n`);
            throw error;
        }

        // 3. Compter les lignes
        console.log('3️⃣  Nombre de collectes...');
        try {
            const countResult = await pool.query('SELECT COUNT(*) as count FROM collectes_donnees');
            const count = countResult.rows[0].count;
            console.log(`   ✅ ${count} collectes trouvées\n`);
            
            if (count === 0) {
                console.log('   ⚠️  ATTENTION: La base est vide!');
                console.log('   Vous devez charger des données avant d\'exporter.\n');
            }
        } catch (error) {
            console.error(`   ❌ Erreur: ${error.message}\n`);
            throw error;
        }

        // 4. Vérifier les colonnes
        console.log('4️⃣  Vérification des colonnes...');
        try {
            const columnsResult = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'collectes_donnees'
                ORDER BY ordinal_position;
            `);
            
            console.log(`   ✅ ${columnsResult.rows.length} colonnes trouvées:\n`);
            columnsResult.rows.forEach((col, idx) => {
                console.log(`      ${idx + 1}. ${col.column_name.padEnd(25)} (${col.data_type})`);
            });
            console.log();
        } catch (error) {
            console.error(`   ❌ Erreur: ${error.message}\n`);
            throw error;
        }

        // 5. Vérifier les images
        console.log('5️⃣  Vérification des images (BYTEA)...');
        try {
            const hasImageColumn = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'collectes_donnees' 
                    AND column_name = 'image_1'
                );
            `);
            
            if (hasImageColumn.rows[0].exists) {
                const imageResult = await pool.query(`
                    SELECT 
                        COUNT(*) as total,
                        COUNT(CASE WHEN image_1 IS NOT NULL THEN 1 END) as with_images,
                        AVG(OCTET_LENGTH(image_1)) as avg_size,
                        MAX(OCTET_LENGTH(image_1)) as max_size
                    FROM collectes_donnees;
                `);
                
                const stats = imageResult.rows[0];
                console.log(`   ✅ Colonne image_1 trouvée\n`);
                console.log(`      Total d'enregistrements: ${stats.total}`);
                console.log(`      Avec images: ${stats.with_images}`);
                
                if (stats.with_images > 0) {
                    const avgSizeKB = (stats.avg_size / 1024).toFixed(2);
                    const maxSizeKB = (stats.max_size / 1024).toFixed(2);
                    console.log(`      Taille moyenne: ${avgSizeKB} KB`);
                    console.log(`      Taille max: ${maxSizeKB} KB\n`);
                } else {
                    console.log(`      ⚠️  Aucune image trouvée!\n`);
                }
            } else {
                console.log('   ⚠️  Colonne image_1 NON TROUVÉE\n');
            }
        } catch (error) {
            console.error(`   ❌ Erreur: ${error.message}\n`);
        }

        // 6. Tester requête SELECT
        console.log('6️⃣  Test de requête SELECT...');
        try {
            const testResult = await pool.query(`
                SELECT * FROM collectes_donnees LIMIT 1;
            `);
            console.log(`   ✅ Requête réussie`);
            console.log(`   Colonnes retournées: ${Object.keys(testResult.rows[0] || {}).length}\n`);
        } catch (error) {
            console.error(`   ❌ Erreur: ${error.message}\n`);
            throw error;
        }

        // 7. Vérifier les dossiers d'export
        console.log('7️⃣  Vérification des dossiers d\'export...');
        try {
            const exportsPath = './exports';
            if (!fs.existsSync(exportsPath)) {
                fs.mkdirSync(exportsPath, { recursive: true });
                console.log(`   ✅ Dossier d'export créé: ${exportsPath}\n`);
            } else {
                const exports = fs.readdirSync(exportsPath);
                console.log(`   ✅ Dossier d'export existant`);
                console.log(`   Exports précédents: ${exports.length}\n`);
            }
        } catch (error) {
            console.error(`   ❌ Erreur: ${error.message}\n`);
            throw error;
        }

        // Résumé final
        console.log('═'.repeat(60));
        console.log('✅ VÉRIFICATION COMPLÈTE - TOUS LES TESTS RÉUSSIS!');
        console.log('═'.repeat(60) + '\n');
        
        console.log('✨ Vous pouvez maintenant exporter vos données:\n');
        console.log('   Option 1 (Recommandée)  → node export-with-images.js');
        console.log('   Option 2 (Alternative)  → node export-base64.js');
        console.log('   Option 3 (Simple)       → node export-csv-simple.js');
        console.log('   Menu Interactif         → node export-menu.js\n');
        console.log('📖 Lire le guide complet: EXPORT_GUIDE.md\n');

    } catch (error) {
        console.log('\n' + '═'.repeat(60));
        console.log('❌ ERREUR LORS DE LA VÉRIFICATION');
        console.log('═'.repeat(60) + '\n');
        
        console.log('💡 Actions recommandées:\n');
        console.log('   1. Vérifier que PostgreSQL est en cours d\'exécution');
        console.log('   2. Vérifier le fichier .env:');
        console.log(`      - DB_HOST=${process.env.DB_HOST || 'localhost'}`);
        console.log(`      - DB_USER=${process.env.DB_USER || 'postgres'}`);
        console.log(`      - DB_NAME=${process.env.DB_NAME || 'senelec_dimensionnement'}`);
        console.log('   3. Exécuter: node create-db.js (pour créer la BD)');
        console.log('   4. Exécuter: node setup-db.js (pour charger les données)');
        console.log('\n');

    } finally {
        await pool.end();
    }
}

// Lancer les tests
testSetup();
