/**
 * Export Automatique vers Excel DIMENSIONNEMENT.xlsx
 * Synchronise les nouvelles collectes avec le support Excel des Partenaires
 */

const xlsx = require('xlsx');
const db = require('./db');
const path = require('path');
const fs = require('fs');

const EXCEL_PATH = 'c:\\Users\\30100-23-SNG\\OneDrive - sonaged\\ESPACE DE TRAVAIL\\SONAGED\\COMMUNES D\'INTERVENTION\\SUPPORT\\DOSSIER DR\\DIMENSIONNEMENT\\DIMENSIONNEMENT.xlsx';

/**
 * Colonnes mappées entre la base de données et Excel
 */
const COLUMN_MAPPING = {
    'Région': 'region',
    'Département': 'dept',
    'Commune': 'commune',
    'Type d\'activité': 'activites',
    'Site Concerné': 'site',
    'Superficie (ha)': 'superficie',
    'Besoin en Personnel': 'personnel',
    'Dispositif Déployé': 'dispositifs',
    'Nombre de Rotation': 'nombre_rotation',
    'Infrastructure de Gestion': 'infrastructure_gestion',
    'Fréquence de Collecte': 'frequence',
    'Bacs 240L': 'bacs_240l',
    'Caisse Polybene': 'caisse_polybene',
    'Bacs 660L': 'bacs_660l',
    'Accessibilité': 'accessibilite',
    'Latitude': 'latitude',
    'Longitude': 'longitude',
    'Précision (m)': 'precision',
    'Coordonnées X': 'coord_x',
    'Coordonnées Y': 'coord_y',
    'Observation': 'observation',
    'Image 1': 'photo_path'
};

/**
 * Format les données pour Excel
 */
function formatDataForExcel(row) {
    const formatted = {};
    
    Object.keys(COLUMN_MAPPING).forEach(excelCol => {
        const dbField = COLUMN_MAPPING[excelCol];
        let value = row[dbField];
        
        // Convertir en string si c'est null/undefined
        if (value === null || value === undefined) {
            value = '';
        } else if (typeof value !== 'string') {
            value = String(value);
        }
        
        // Limiter la longueur pour Excel (max 32767)
        if (value.length > 32767) {
            value = value.substring(0, 32760) + '...';
        }
        
        // Formater les données spéciales
        if (excelCol === 'Image 1' && value && value !== '') {
            // Si c'est une photo, garder le chemin
            if (!value.startsWith('./') && !value.startsWith('photo_')) {
                value = `./exports/${value}`;
            }
        }
        
        if (excelCol === 'Superficie (ha)' && value !== '') {
            try {
                value = parseFloat(value).toFixed(2);
            } catch (e) {
                value = '';
            }
        }
        
        formatted[excelCol] = value;
    });
    
    return formatted;
}

/**
 * Lit le fichier Excel existant
 */
function readExcelFile() {
    try {
        if (!fs.existsSync(EXCEL_PATH)) {
            console.log('⚠️  Fichier Excel non trouvé, création d\'un nouveau...');
            return {
                headers: Object.keys(COLUMN_MAPPING),
                data: []
            };
        }
        
        const workbook = xlsx.readFile(EXCEL_PATH);
        const sheet = workbook.Sheets['DIMENSIONNEMENT'];
        const data = xlsx.utils.sheet_to_json(sheet);
        
        return {
            headers: Object.keys(COLUMN_MAPPING),
            data: data
        };
    } catch (error) {
        console.error('❌ Erreur lors de la lecture Excel:', error.message);
        return {
            headers: Object.keys(COLUMN_MAPPING),
            data: []
        };
    }
}

/**
 * Écrit les données dans le fichier Excel
 */
function writeExcelFile(excelData) {
    try {
        const ws = xlsx.utils.json_to_sheet(excelData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'DIMENSIONNEMENT');
        
        // Appliquer largeur automatique aux colonnes
        const colWidths = Object.keys(COLUMN_MAPPING).map(col => ({ wch: 18 }));
        ws['!cols'] = colWidths;
        
        xlsx.writeFile(wb, EXCEL_PATH);
        console.log('✅ Fichier Excel mis à jour avec succès');
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de l\'écriture Excel:', error.message);
        return false;
    }
}

/**
 * Ajoute une nouvelle collecte au fichier Excel
 */
async function addCollecteToExcel(collecteData) {
    try {
        console.log(`📊 Ajout de collecte à Excel: ${collecteData.site}`);
        
        // Lire le fichier existant
        const excelData = readExcelFile();
        
        // Vérifier si cette collecte existe déjà
        const exists = excelData.data.some(row => 
            row['Site Concerné'] === collecteData.site && 
            row['Commune'] === collecteData.commune
        );
        
        if (exists) {
            console.log('⚠️  Cette collecte existe déjà dans Excel');
            return false;
        }
        
        // Formater les données
        const formattedData = formatDataForExcel(collecteData);
        
        // Ajouter à la liste
        excelData.data.push(formattedData);
        
        // Écrire dans Excel
        const success = writeExcelFile(excelData.data);
        
        if (success) {
            console.log(`✨ Collecte "${collecteData.site}" ajoutée à Excel`);
        }
        
        return success;
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout à Excel:', error.message);
        return false;
    }
}

/**
 * Synchronise toutes les collectes de la base de données vers Excel
 */
async function syncAllCollectes() {
    try {
        console.log('🔄 Synchronisation des collectes...');
        
        // Ne pas sélectionner la colonne "photo" (binaire) directement
        // utiliser le chemin de fichier à la place
        const query = `
            SELECT 
                id, region, departement as dept, commune, type_activite as activites, 
                sites_concernes as site, superficie, besoin_personnel as personnel, 
                dispositif_deploye as dispositifs, nombre_rotation, infrastructure_gestion,
                frequence_collecte as frequence, bacs_240l, caisse_polybene, bacs_660l, 
                accessibilite, latitude, longitude, precision, coordonnee_x as coord_x, 
                coordonnee_y as coord_y, observation,
                CASE 
                    WHEN photo IS NOT NULL THEN 'photo_' || id || '.jpg'
                    ELSE NULL
                END as photo_path
            FROM collectes_donnees
            ORDER BY date_collecte DESC
        `;
        
        const result = await db.pool.query(query);
        const collectes = result.rows;
        
        console.log(`📌 ${collectes.length} collectes trouvées en base`);
        
        // Formater toutes les données
        const excelData = collectes.map(row => formatDataForExcel(row));
        
        // Écrire dans Excel
        const success = writeExcelFile(excelData);
        
        if (success) {
            console.log(`✨ ${collectes.length} collectes synchronisées`);
        }
        
        return success;
    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation:', error.message);
        return false;
    }
}

/**
 * Exporte une collecte spécifique
 */
async function exportCollecte(collecteId) {
    try {
        console.log(`📤 Export de la collecte #${collecteId}`);
        
        const query = `
            SELECT 
                id, region, departement as dept, commune, type_activite as activites, 
                sites_concernes as site, superficie, besoin_personnel as personnel, 
                dispositif_deploye as dispositifs, nombre_rotation, infrastructure_gestion,
                frequence_collecte as frequence, bacs_240l, caisse_polybene, bacs_660l, 
                accessibilite, latitude, longitude, precision, coordonnee_x as coord_x, 
                coordonnee_y as coord_y, observation, photo as photo_path
            FROM collectes_donnees
            WHERE id = $1
        `;
        
        const result = await db.pool.query(query, [collecteId]);
        
        if (result.rows.length === 0) {
            console.log('⚠️  Collecte non trouvée');
            return false;
        }
        
        const collecte = result.rows[0];
        return await addCollecteToExcel(collecte);
    } catch (error) {
        console.error('❌ Erreur lors de l\'export:', error.message);
        return false;
    }
}

/**
 * Mise à jour d'une collecte dans Excel
 */
async function updateCollecteInExcel(collecteId, updatedData) {
    try {
        console.log(`🔄 Mise à jour de la collecte #${collecteId}`);
        
        const excelData = readExcelFile();
        
        // Trouver et mettre à jour
        const index = excelData.data.findIndex(row =>
            row['Site Concerné'] === updatedData.site &&
            row['Commune'] === updatedData.commune
        );
        
        if (index === -1) {
            console.log('⚠️  Collecte non trouvée dans Excel, ajout...');
            return await addCollecteToExcel(updatedData);
        }
        
        const formattedData = formatDataForExcel(updatedData);
        excelData.data[index] = formattedData;
        
        const success = writeExcelFile(excelData.data);
        
        if (success) {
            console.log(`✨ Collecte mise à jour dans Excel`);
        }
        
        return success;
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error.message);
        return false;
    }
}

/**
 * Vérifie la connexion au fichier Excel
 */
function checkExcelConnection() {
    try {
        if (!fs.existsSync(EXCEL_PATH)) {
            console.log('❌ Chemin Excel non accessible:');
            console.log(`   ${EXCEL_PATH}`);
            return false;
        }
        
        // Essayer de lire
        const workbook = xlsx.readFile(EXCEL_PATH);
        console.log('✅ Connexion Excel établie');
        console.log(`   Feuille: DIMENSIONNEMENT`);
        console.log(`   Lignes: ${workbook.Sheets['DIMENSIONNEMENT']['!ref']}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur de connexion Excel:', error.message);
        return false;
    }
}

module.exports = {
    addCollecteToExcel,
    syncAllCollectes,
    exportCollecte,
    updateCollecteInExcel,
    checkExcelConnection,
    formatDataForExcel
};

// Exécution si appellé directement
if (require.main === module) {
    (async () => {
        console.log('🚀 Export Excel - Mode Direct\n');
        
        if (!checkExcelConnection()) {
            console.log('\n❌ Impossible de se connecter à Excel');
            process.exit(1);
        }
        
        console.log('\n');
        await syncAllCollectes();
        
        console.log('\n✅ Synchronisation terminée');
        process.exit(0);
    })();
}
