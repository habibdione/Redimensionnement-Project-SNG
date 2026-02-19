// 📸 Script pour mettre à jour le dernier export dans la galerie
const fs = require('fs');
const path = require('path');

// Lire le dossier exports
const exportsDir = path.join(__dirname, 'exports');

try {
    const files = fs.readdirSync(exportsDir);
    
    // Filtrer les dossiers et les trier par date
    const exportFolders = files
        .filter(file => {
            const fullPath = path.join(exportsDir, file);
            return fs.statSync(fullPath).isDirectory();
        })
        .sort()
        .reverse(); // Plus récent en premier
    
    if (exportFolders.length === 0) {
        console.warn('⚠️ Aucun dossier export trouvé');
        process.exit(0);
    }
    
    const latestExportName = exportFolders[0];
    const latestExportPath = `./exports/${latestExportName}`;
    
    // Créer le fichier JSON
    const latestExportInfo = {
        name: latestExportName,
        path: latestExportPath,
        timestamp: new Date().toISOString(),
        updated: new Date().toLocaleString('fr-FR')
    };
    
    // Sauvegarder le fichier
    const outputPath = path.join(__dirname, 'get-latest-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(latestExportInfo, null, 2));
    
    console.log(`✅ Dernier export: ${latestExportName}`);
    console.log(`📁 Chemin: ${latestExportPath}`);
    console.log(`💾 Fichier JSON créé: ${outputPath}`);
    
} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}
