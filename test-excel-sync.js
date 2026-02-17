/**
 * Test d'Export Automatique vers Excel
 * Vérifie que la synchronisation fonctionne correctement
 */

const excelSync = require('./export-excel-sync');
const db = require('./db');

async function runTests() {
    console.log('🧪 TEST D\'EXPORT AUTOMATIQUE VERS EXCEL\n');
    
    try {
        // Test 1: Vérifier la connexion Excel
        console.log('📋 TEST 1: Connexion Excel');
        console.log('='.repeat(60));
        const connected = excelSync.checkExcelConnection();
        console.log();
        
        if (!connected) {
            console.error('❌ Test échoué: Impossible de se connecter à Excel');
            process.exit(1);
        }
        
        // Attendre que COM Object soit complètement fermé
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 2: Synchroniser les données existantes
        console.log('\n📋 TEST 2: Synchronisation des données');
        console.log('='.repeat(60));
        
        const query = `
            SELECT COUNT(*) as total FROM collectes_donnees;
        `;
        const result = await db.pool.query(query);
        const totalCollectes = parseInt(result.rows[0].total);
        
        console.log(`📊 Nombre de collectes en base: ${totalCollectes}`);
        
        if (totalCollectes === 0) {
            console.log('⚠️  Aucune collecte en base de données');
        } else {
            console.log('\n🔄 Synchronisation en cours...');
            const syncSuccess = await excelSync.syncAllCollectes();
            
            if (syncSuccess) {
                console.log('✅ Synchronisation réussie !');
            } else {
                console.warn('⚠️  Problème lors de la synchronisation');
            }
        }
        
        // Attendre que le fichier soit fermé
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test 3: Vérifier le fichier Excel généré
        console.log('\n📋 TEST 3: Vérification du fichier Excel');
        console.log('='.repeat(60));
        
        const path = require('path');
        const xlsx = require('xlsx');
        const fs = require('fs');
        
        const excelPath = 'c:\\Users\\30100-23-SNG\\OneDrive - sonaged\\ESPACE DE TRAVAIL\\SONAGED\\COMMUNES D\'INTERVENTION\\SUPPORT\\DOSSIER DR\\DIMENSIONNEMENT\\DIMENSIONNEMENT.xlsx';
        
        if (fs.existsSync(excelPath)) {
            try {
                const workbook = xlsx.readFile(excelPath);
                const sheet = workbook.Sheets['DIMENSIONNEMENT'];
                const data = xlsx.utils.sheet_to_json(sheet);
                
                console.log(`✅ Fichier Excel accessible`);
                console.log(`   Feuille: DIMENSIONNEMENT`);
                console.log(`   Lignes: ${data.length}`);
                console.log(`   Colonnes: ${Object.keys(sheet).filter(k => !k.startsWith('!')).length}`);
                
                if (data.length > 0) {
                    console.log('\n📌 Aperçu des 2 premières lignes:');
                    data.slice(0, 2).forEach((row, idx) => {
                        console.log(`\n   Ligne ${idx + 1}:`);
                        console.log(`     Commune: ${row['Commune']}`);
                        console.log(`     Site: ${row['Site Concerné']}`);
                        console.log(`     Région: ${row['Région']}`);
                    });
                }
            } catch (err) {
                console.error(`❌ Erreur lors de la lecture Excel: ${err.message}`);
            }
        } else {
            console.warn('⚠️  Fichier Excel non trouvé');
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ TESTS TERMINÉS\n');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

// Exécuter les tests
runTests();
