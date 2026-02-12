/**
 * 🗺️ Exemples d'utilisation des données géographiques
 * Fichier: SENEGAL_REGIONS_EXAMPLES.js
 * 
 * Montre comment utiliser les données des régions, départements et communes
 * dans votre application
 */

// ============================================
// EXEMPLE 1: Utiliser data-senegal.js côté client
// ============================================

// Dans un fichier HTML/JavaScript côté client:

function loadRegionsDropdown() {
    const regionSelect = document.getElementById('region');
    
    // Utiliser les données de data-senegal.js
    SENEGAL_DATA.regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region.id;
        option.textContent = region.nom;
        regionSelect.appendChild(option);
    });
}

function loadDepartementsDropdown(regionId) {
    const deptSelect = document.getElementById('departement');
    deptSelect.innerHTML = '<option value="">-- Sélectionnez un département --</option>';
    
    const departements = SENEGAL_DATA.getDepartements(regionId);
    departements.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.nom;
        deptSelect.appendChild(option);
    });
}

function loadCommunesDropdown(regionId, deptId) {
    const communeSelect = document.getElementById('commune');
    communeSelect.innerHTML = '<option value="">-- Sélectionnez une commune --</option>';
    
    const communes = SENEGAL_DATA.getCommunes(regionId, deptId);
    communes.forEach(commune => {
        const option = document.createElement('option');
        option.value = commune;
        option.textContent = commune;
        communeSelect.appendChild(option);
    });
}

// Exemple d'utilisation:
/*
<script src="data-senegal.js"></script>
<script>
    window.addEventListener('DOMContentLoaded', function() {
        loadRegionsDropdown();
        
        document.getElementById('region').addEventListener('change', function(e) {
            loadDepartementsDropdown(e.target.value);
        });
        
        document.getElementById('departement').addEventListener('change', function(e) {
            const regionId = document.getElementById('region').value;
            loadCommunesDropdown(regionId, e.target.value);
        });
    });
</script>
*/

// ============================================
// EXEMPLE 2: API Backend pour récupérer les données
// ============================================

// Dans server.js ou un fichier d'API:

// Endpoint: GET /api/regions
app.get('/api/regions', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, code, nom, emoji FROM regions ORDER BY code'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: GET /api/regions/:regionId/departements
app.get('/api/regions/:regionId/departements', async (req, res) => {
    try {
        const { regionId } = req.params;
        const result = await pool.query(
            'SELECT id, nom, code FROM departements WHERE region_id = $1 ORDER BY nom',
            [regionId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: GET /api/departements/:deptId/communes
app.get('/api/departements/:deptId/communes', async (req, res) => {
    try {
        const { deptId } = req.params;
        const result = await pool.query(
            'SELECT id, nom, code FROM communes WHERE departement_id = $1 ORDER BY nom',
            [deptId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: GET /api/regions/byCode/:code
app.get('/api/regions/byCode/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const result = await pool.query(
            'SELECT * FROM regions WHERE code = $1',
            [code.toUpperCase()]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// EXEMPLE 3: Frontend utilisant les APIs
// ============================================

// Charger les régions au chargement
async function initRegions() {
    const regions = await fetch('/api/regions').then(r => r.json());
    const regionSelect = document.getElementById('region');
    
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region.id;
        option.textContent = region.nom;
        regionSelect.appendChild(option);
    });
}

// Charger les départements quand une région est sélectionnée
async function onRegionChange(regionId) {
    if (!regionId) return;
    
    const depts = await fetch(`/api/regions/${regionId}/departements`)
        .then(r => r.json());
    
    const deptSelect = document.getElementById('departement');
    deptSelect.innerHTML = '<option value="">-- Sélectionnez un département --</option>';
    
    depts.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.nom;
        deptSelect.appendChild(option);
    });
}

// Charger les communes quand un département est sélectionné
async function onDeptChange(deptId) {
    if (!deptId) return;
    
    const communes = await fetch(`/api/departements/${deptId}/communes`)
        .then(r => r.json());
    
    const communeSelect = document.getElementById('commune');
    communeSelect.innerHTML = '<option value="">-- Sélectionnez une commune --</option>';
    
    communes.forEach(commune => {
        const option = document.createElement('option');
        option.value = commune.id;
        option.textContent = commune.nom;
        communeSelect.appendChild(option);
    });
}

// ============================================
// EXEMPLE 4: Validation des données
// ============================================

// Vérifier qu'une région existe
async function isValidRegion(regionCode) {
    const result = await pool.query(
        'SELECT id FROM regions WHERE code = $1',
        [regionCode.toUpperCase()]
    );
    return result.rows.length > 0;
}

// Vérifier qu'un département appartient à la région
async function isDeptInRegion(deptId, regionId) {
    const result = await pool.query(
        'SELECT id FROM departements WHERE id = $1 AND region_id = $2',
        [deptId, regionId]
    );
    return result.rows.length > 0;
}

// Vérifier qu'une commune appartient au département
async function isCommuneInDept(communeId, deptId) {
    const result = await pool.query(
        'SELECT id FROM communes WHERE id = $1 AND departement_id = $2',
        [communeId, deptId]
    );
    return result.rows.length > 0;
}

// ============================================
// EXEMPLE 5: Insertion de données avec validation
// ============================================

// Avant d'insérer dans collectes_donnees, valider les références
async function insertWithValidation(data) {
    try {
        // 1. Vérifier que la région existe
        const regionExist = await pool.query(
            'SELECT id FROM regions WHERE nom = $1',
            [data.region]
        );
        if (regionExist.rows.length === 0) {
            throw new Error(`Région invalide: ${data.region}`);
        }
        const regionId = regionExist.rows[0].id;
        
        // 2. Vérifier que le département existe et appartient à la région
        const deptExist = await pool.query(
            'SELECT id FROM departements WHERE nom = $1 AND region_id = $2',
            [data.departement, regionId]
        );
        if (deptExist.rows.length === 0) {
            throw new Error(`Département invalide: ${data.departement}`);
        }
        const deptId = deptExist.rows[0].id;
        
        // 3. Vérifier que la commune existe et appartient au département
        const communeExist = await pool.query(
            'SELECT id FROM communes WHERE nom = $1 AND departement_id = $2',
            [data.commune, deptId]
        );
        if (communeExist.rows.length === 0) {
            throw new Error(`Commune invalide: ${data.commune}`);
        }
        
        // 4. Insérer les données
        const result = await pool.query(
            `INSERT INTO collectes_donnees (
                partenaire, region, departement, commune, 
                type_activite, site_concerne, statut
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`,
            [
                data.partenaire,
                data.region,
                data.departement,
                data.commune,
                data.type_activite,
                data.site_concerne,
                'brouillon'
            ]
        );
        
        return { success: true, id: result.rows[0].id };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// EXEMPLE 6: Recherche/Filtrage
// ============================================

// Récupérer toutes les collectes d'une région
async function getByRegion(regionName) {
    const result = await pool.query(
        `SELECT cd.* FROM collectes_donnees cd
         WHERE cd.region = $1 AND cd.statut = 'actif'
         ORDER BY cd.date_collecte DESC`,
        [regionName]
    );
    return result.rows;
}

// Récupérer toutes les collectes d'un département
async function getByDept(deptName) {
    const result = await pool.query(
        `SELECT cd.* FROM collectes_donnees cd
         WHERE cd.departement = $1 AND cd.statut = 'actif'
         ORDER BY cd.date_collecte DESC`,
        [deptName]
    );
    return result.rows;
}

// Récupérer toutes les collectes d'une commune
async function getByCommune(communeName) {
    const result = await pool.query(
        `SELECT cd.* FROM collectes_donnees cd
         WHERE cd.commune = $1 AND cd.statut = 'actif'
         ORDER BY cd.date_collecte DESC`,
        [communeName]
    );
    return result.rows;
}

// ============================================
// EXEMPLE 7: Rapport par région
// ============================================

async function getReportByRegion() {
    const result = await pool.query(
        `SELECT 
            r.nom as region,
            COUNT(cd.id) as nombre_collectes,
            COUNT(DISTINCT cd.partenaire) as nb_partenaires
         FROM regions r
         LEFT JOIN collectes_donnees cd ON r.nom = cd.region AND cd.statut = 'actif'
         GROUP BY r.id, r.nom
         ORDER BY r.code`
    );
    return result.rows;
}

// ============================================
// EXEMPLE 8: Exporter les données
// ============================================

async function exportDataToCSV() {
    const result = await pool.query(
        `SELECT 
            r.nom as region,
            d.nom as departement,
            c.nom as commune
         FROM communes c
         JOIN departements d ON c.departement_id = d.id
         JOIN regions r ON d.region_id = r.id
         ORDER BY r.code, d.nom, c.nom`
    );
    
    // Convertir en CSV
    let csv = 'Région,Département,Commune\n';
    result.rows.forEach(row => {
        csv += `"${row.region}","${row.departement}","${row.commune}"\n`;
    });
    
    return csv;
}

// ============================================
// Utilisation
// ============================================

/*
// Côté serveur:
const { Pool } = require('pg');
const pool = new Pool({...});

// Côté frontend:
<script src="data-senegal.js"></script>
<script>
    // Option 1: Utiliser data-senegal.js directement
    loadRegionsDropdown();
    
    // Option 2: Utiliser les APIs
    initRegions();
</script>
*/

module.exports = {
    isValidRegion,
    isDeptInRegion,
    isCommuneInDept,
    insertWithValidation,
    getByRegion,
    getByDept,
    getByCommune,
    getReportByRegion,
    exportDataToCSV
};
