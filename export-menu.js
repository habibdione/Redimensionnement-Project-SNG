/**
 * EXPORT UTILITIES - Menu Principal
 * ==================================
 * Menu interactif pour exporter les données et images
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Créer interface readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction pour afficher le menu
function showMenu() {
    console.clear();
    console.log('\n' + '═'.repeat(60));
    console.log('📊 OUTILS D\'EXPORT - DONNÉES & IMAGES');
    console.log('═'.repeat(60));
    console.log('\n🔤 SÉLECTIONNEZ UNE OPTION:\n');
    console.log('  1️⃣  Export Fichiers Séparés (RECOMMANDÉ)');
    console.log('     → Images en fichiers .jpg + chemins dans CSV');
    console.log('     → ✅ Facile à utiliser\n');
    
    console.log('  2️⃣  Export Base64 (Alternative)');
    console.log('     → Tout dans le CSV en base64');
    console.log('     → ⚠️  Fichier volumineux\n');
    
    console.log('  3️⃣  Export CSV Simple (Sans Images)');
    console.log('     → Données uniquement, images dans la BD');
    console.log('     → ✅ Fichier petit\n');
    
    console.log('  4️⃣  Voir les exports précédents');
    console.log('     → Liste les dossiers d\'export\n');
    
    console.log('  5️⃣  Importer des images (fichiers → BD)');
    console.log('     → Charger des images JPG dans la base\n');
    
    console.log('  0️⃣  Quitter\n');
    console.log('═'.repeat(60) + '\n');
}

// Demander l'action
function askForAction() {
    rl.question('✏️  Entrez le numéro de votre choix (0-5): ', async (choice) => {
        switch(choice) {
            case '1':
                console.log('\n⏳ Lancement de l\'export avec fichiers séparés...\n');
                try {
                    execSync('node export-with-images.js', { stdio: 'inherit' });
                } catch (error) {
                    console.error('❌ Erreur lors de l\'export:', error.message);
                }
                askToContinue();
                break;
                
            case '2':
                console.log('\n⏳ Lancement de l\'export base64...\n');
                try {
                    execSync('node export-base64.js', { stdio: 'inherit' });
                } catch (error) {
                    console.error('❌ Erreur lors de l\'export:', error.message);
                }
                askToContinue();
                break;
                
            case '3':
                console.log('\n⏳ Lancement de l\'export CSV simple...\n');
                try {
                    execSync('node export-csv-simple.js', { stdio: 'inherit' });
                } catch (error) {
                    console.error('❌ Erreur lors de l\'export:', error.message);
                }
                askToContinue();
                break;
                
            case '4':
                showExports();
                askToContinue();
                break;
                
            case '5':
                console.log('\n⏳ Lancement de l\'outil d\'import...\n');
                console.log('ℹ️  Cette fonctionnalité sera bientôt disponible.');
                console.log('   En attendant, utilisez export-with-images.js\n');
                askToContinue();
                break;
                
            case '0':
                console.log('\n✅ Au revoir!\n');
                rl.close();
                process.exit(0);
                break;
                
            default:
                console.log('❌ Choix invalide. Veuillez entrer 0-5.\n');
                askForAction();
        }
    });
}

// Continuer ou revenir au menu
function askToContinue() {
    rl.question('\n📋 Appuyez sur Entrée pour retourner au menu...', () => {
        showMenu();
        askForAction();
    });
}

// Afficher les exports précédents
function showExports() {
    const exportsDir = path.join(__dirname, 'exports');
    
    if (!fs.existsSync(exportsDir)) {
        console.log('\n❌ Aucun dossier d\'exports trouvé.\n');
        return;
    }
    
    const exports = fs.readdirSync(exportsDir)
        .filter(f => fs.statSync(path.join(exportsDir, f)).isDirectory())
        .sort()
        .reverse();
    
    if (exports.length === 0) {
        console.log('\n❌ Aucun export trouvé dans ./exports/\n');
        return;
    }
    
    console.log('\n📁 Exports précédents:\n');
    
    exports.forEach((exp, idx) => {
        const expPath = path.join(exportsDir, exp);
        const files = fs.readdirSync(expPath);
        const hasImages = fs.existsSync(path.join(expPath, 'images'));
        
        console.log(`${idx + 1}. 📂 ${exp}`);
        console.log(`   Fichiers: ${files.length}`);
        if (hasImages) {
            const imageCount = fs.readdirSync(path.join(expPath, 'images')).length;
            console.log(`   Images: ${imageCount} fichiers`);
        }
        console.log(`   Chemin: ${expPath}\n`);
    });
}

// Démarrer
console.log('\n🚀 Démarrage de l\'application...\n');
showMenu();
askForAction();

// Gérer le CTRL+C
process.on('SIGINT', () => {
    console.log('\n\n❌ Interruption par l\'utilisateur.');
    console.log('✅ À bientôt!\n');
    rl.close();
    process.exit(0);
});
