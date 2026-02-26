/**
 * CLIENT API - COMMUNICATION AVEC LE SERVEUR
 * ===========================================
 * 
 * Ce fichier gère la communication avec l'API PostgreSQL du backend
 * Il remplace l'export Excel par une sauvegarde en base de données
 * 
 * Configuration:
 * - URL de l'API: définie dans config.js (CONFIG.API_URL)
 * - Support multi-environnements: Dev/Staging/Production/Tunnel
 */

// Configuration de l'API (définie dans config.js ou par défaut en localhost)
let API_BASE_URL = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) 
    ? CONFIG.API_URL 
    : (process.env.API_URL || 'http://localhost:3001/api');

// Vérifier si tunnel est activé via tunnel-config.js
if (typeof TUNNEL_CONFIG !== 'undefined' && TUNNEL_CONFIG.TUNNEL_ENABLED) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('env') === 'tunnel' || window.location.hostname.includes('devtunnels.ms')) {
        API_BASE_URL = TUNNEL_CONFIG.TUNNEL_API;
        console.log('🌐 TUNNEL MODE: API URL changée vers', API_BASE_URL);
    }
}

console.log(`✅ API Client initialisé avec URL: ${API_BASE_URL}`);

/**
 * Classe pour gérer les appels API avec support Tunnel
 */
class APIClient {
    
    /**
     * Helper pour les requêtes avec retry sur tunnel
     */
    static async faireRequete(url, options = {}) {
        const isTunnel = API_BASE_URL.includes('devtunnels.ms');
        const maxRetries = isTunnel ? 3 : 1;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Ajouter mode CORS pour tunnel
                const fetchOptions = {
                    ...options,
                    mode: 'cors',
                    credentials: 'omit'
                };
                
                if (isTunnel) {
                    fetchOptions.headers = {
                        ...fetchOptions.headers,
                        'X-Requested-With': 'XMLHttpRequest'
                    };
                }
                
                const response = await fetch(url, fetchOptions);
                return response;
                
            } catch (error) {
                if (isTunnel && attempt < maxRetries) {
                    console.warn(`⚠️ Tentative ${attempt}/${maxRetries} échouée, nouvelle tentative dans 2s...`);
                    await new Promise(r => setTimeout(r, 2000));
                } else {
                    throw error;
                }
            }
        }
    }
    
    /**
     * Sauvegarder les données en base de données
     */
    static async sauvegarderEnBaseDonnees(donnees) {
        try {
            console.log('📝 Envoi des données vers la base de données...');
            console.log('   API:', API_BASE_URL);
            
            const response = await this.faireRequete(`${API_BASE_URL}/collecte`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    partenariat: donnees.partenaire,
                    region: donnees.region,
                    departement: donnees.departement,
                    commune: donnees.commune,
                    typeActivite: donnees.typeActivite,
                    siteConcerne: donnees.siteConcerne,
                    sites_concernes: donnees.sites_concernes,
                    superficie: donnees.superficie,
                    besoinPersonnel: donnees.besoinPersonnel,
                    dispositifDeploy: donnees.dispositifDeploy,
                    nombreRotation: donnees.nombreRotation,
                    infrastructureGestion: donnees.infrastructureGestion,
                    frequenceCollecte: donnees.frequenceCollecte,
                    bacs240: donnees.bacs240,
                    caissePolybene: donnees.caissePolybene,
                    bacs660: donnees.bacs660,
                    accessibilite: donnees.accessibilite,
                    latitude: donnees.latitude,
                    longitude: donnees.longitude,
                    precision: donnees.precision,
                    observation: donnees.observation,
                    image1: donnees.photo
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de la sauvegarde');
            }

            console.log('✅ Données sauvegardées avec succès, ID:', result.data.id);
            return {
                success: true,
                id: result.data.id,
                message: result.message
            };

        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
            throw error;
        }
    }

    /**
     * Récupérer une collecte spécifique
     */
    static async obtenirCollecte(id) {
        try {
            const response = await this.faireRequete(`${API_BASE_URL}/collecte/${id}`, {
                method: 'GET'
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error);
            }

            return result.data;
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }

    /**
     * Récupérer toutes les collectes
     */
    static async obtenirCollectes(page = 1, limit = 10) {
        try {
            const response = await this.faireRequete(`${API_BASE_URL}/collectes?page=${page}&limit=${limit}`, {
                method: 'GET'
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error);
            }

            return result;
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }

    /**
     * Récupérer les collectes par partenariat
     */
    static async obtenirCollecteParPartenariat(partenariat) {
        try {
            const response = await fetch(`${API_BASE_URL}/collectes/partenariat/${encodeURIComponent(partenariat)}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error);
            }

            return result;
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }

    /**
     * Mettre à jour une collecte
     */
    static async mettreAJourCollecte(id, donnees) {
        try {
            const response = await fetch(`${API_BASE_URL}/collecte/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    partenariat: donnees.partenaire,
                    region: donnees.region,
                    departement: donnees.departement,
                    commune: donnees.commune,
                    typeActivite: donnees.typeActivite,
                    siteConcerne: donnees.siteConcerne,
                    sites_concernes: donnees.sites_concernes,
                    superficie: donnees.superficie,
                    besoinPersonnel: donnees.besoinPersonnel,
                    dispositifDeploy: donnees.dispositifDeploy,
                    nombreRotation: donnees.nombreRotation,
                    infrastructureGestion: donnees.infrastructureGestion,
                    frequenceCollecte: donnees.frequenceCollecte,
                    bacs240: donnees.bacs240,
                    caissePolybene: donnees.caissePolybene,
                    bacs660: donnees.bacs660,
                    accessibilite: donnees.accessibilite,
                    latitude: donnees.latitude,
                    longitude: donnees.longitude,
                    precision: donnees.precision,
                    observation: donnees.observation,
                    image1: donnees.photo
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error);
            }

            console.log('✅ Collecte mise à jour avec succès');
            return {
                success: true,
                message: result.message
            };

        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour:', error);
            throw error;
        }
    }

    /**
     * Supprimer une collecte
     */
    static async supprimerCollecte(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/collecte/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error);
            }

            console.log('✅ Collecte supprimée avec succès');
            return {
                success: true,
                message: result.message
            };

        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            throw error;
        }
    }

    /**
     * Obtenir les statistiques
     */
    static async obtenirStatistiques() {
        try {
            const response = await this.faireRequete(`${API_BASE_URL}/statistiques`, {
                method: 'GET'
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error);
            }

            return result.data;
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }

    /**
     * Vérifier la connexion à l'API
     */
    static async verifierConnexion() {
        try {
            const response = await this.faireRequete(`${API_BASE_URL}/health`, {
                method: 'GET'
            });
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('❌ Impossible de se connecter à l\'API:', error);
            return false;
        }
    }

    /**
     * Exporter les données en CSV
     */
    static async exporterCSV() {
        try {
            console.log('📥 Préparation de l\'export CSV...');
            
            const donnees = await this.obtenirCollectes(1, 1000);

            if (!donnees.data || donnees.data.length === 0) {
                throw new Error('Pas de données à exporter');
            }

            // Créer le CSV
            const headers = [
                'ID', 'Partenariat', 'Région', 'Département', 'Commune',
                'Type d\'Activité', 'Site Concerné', 'Sites Concernés', 'Superficie',
                'Besoin Personnel', 'Dispositif Déployé', 'Nombre Rotation',
                'Infrastructure Gestion', 'Fréquence Collecte',
                'Bacs 240L', 'Caisse Polybene', 'Bacs 660L', 'Accessibilité',
                'Latitude', 'Longitude', 'Précision', 'Observation', 'Date'
            ];

            const rows = donnees.data.map(d => [
                d.id,
                d.partenariat,
                d.region,
                d.departement,
                d.commune,
                d.type_activite,
                d.site_concerne,
                d.sites_concernes,
                d.superficie,
                d.besoin_personnel,
                d.dispositif_deploye,
                d.nombre_rotation,
                d.infrastructure_gestion,
                d.frequence_collecte,
                d.bacs_240l,
                d.caisse_polybene,
                d.bacs_660l,
                d.accessibilite,
                d.latitude,
                d.longitude,
                d.precision,
                d.observation,
                new Date(d.date_collecte).toLocaleString('fr-FR')
            ]);

            // Formater en CSV
            const csvContent = [
                headers.map(h => `"${h}"`).join(','),
                ...rows.map(r => r.map(cell => `"${cell || ''}"`).join(','))
            ].join('\n');

            // Télécharger le fichier
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `collectes_${new Date().getTime()}.csv`);
            link.click();

            console.log('✅ Export CSV terminé');
            return true;

        } catch (error) {
            console.error('❌ Erreur lors de l\'export:', error);
            throw error;
        }
    }
}

/**
 * Wrapper pour la sauvegarde en base de données
 * Appelée à partir du formulaire HTML
 */
async function sauvegarderDonneesBD() {
    try {
        // Utiliser la variable donnees du formulaire HTML
        if (typeof donnees === 'undefined') {
            showAlert('error', '❌ Les données ne sont pas initialisées');
            return;
        }

        showAlert('info', '⏳ Sauvegarde en cours...');

        // Appeler l'API
        const result = await APIClient.sauvegarderEnBaseDonnees(donnees);

        if (result.success) {
            showAlert('success', `✅ ${result.message} (ID: ${result.id})`);
            
            // Stocker l'ID dans le localStorage
            const collecteIds = JSON.parse(localStorage.getItem('collecteIds') || '[]');
            collecteIds.push(result.id);
            localStorage.setItem('collecteIds', JSON.stringify(collecteIds));

            // Réinitialiser le formulaire après 2 secondes
            setTimeout(() => {
                document.getElementById('formulaire').reset();
                donnees = {};
            }, 2000);
        }

    } catch (error) {
        console.error('Erreur:', error);
        showAlert('error', `❌ Erreur: ${error.message}`);
    }
}

/**
 * Vérifier la connexion au démarrage
 */
document.addEventListener('DOMContentLoaded', async () => {
    const isConnected = await APIClient.verifierConnexion();
    
    if (isConnected) {
        console.log('✅ Connecté à l\'API PostgreSQL');
        showAlert('info', '✅ Connexion à la base de données établie');
    } else {
        console.warn('⚠️ Impossible de se connecter à l\'API');
        showAlert('error', '⚠️ Impossible de se connecter au serveur. Assurez-vous que le serveur est lancé. (npm start)');
    }
});

// Exporter pour utilisation globale
if (typeof window !== 'undefined') {
    window.APIClient = APIClient;
    window.sauvegarderDonneesBD = sauvegarderDonneesBD;
}
