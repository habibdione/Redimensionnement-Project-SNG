#!/usr/bin/env node

/**
 * SCRIPT DE SYNCHRONISATION - LOCAL ↔ SERVEUR
 * Synchronise les données locales (localStorage) avec le serveur PostgreSQL
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const API_URL = `http://localhost:${process.env.PORT || 3001}/api`;

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║   SYNCHRONISATION LOCAL ↔ POSTGRESQL              ║');
console.log('╚════════════════════════════════════════════════════╝\n');

/**
 * Charger les données locals depuis un fichier JSON
 */
function chargerDonneesLocales() {
    const fichierLocal = path.join(__dirname, 'donnees_locales.json');
    
    if (!fs.existsSync(fichierLocal)) {
        console.log('ℹ️  Pas de fichier de données locales trouvé');
        return [];
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(fichierLocal, 'utf8'));
        console.log(`✅ Fichier local chargé: ${data.length} enregistrement(s)`);
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error('❌ Erreur lors de la lecture du fichier local:', e.message);
        return [];
    }
}

/**
 * Appeler l'API pour obtenir les données du serveur
 */
async function obtenirDonneesServeur() {
    try {
        console.log('\n📡 Récupération des données du serveur...');
        const response = await fetch(`${API_URL}/collectes`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const collectes = data.data || [];
        
        console.log(`✅ Serveur: ${collectes.length} enregistrement(s) trouvé(s)`);
        return collectes;
        
    } catch (error) {
        console.error('❌ ERREUR: Impossible de récupérer les données du serveur');
        console.error(`   Vérifiez que le serveur est lancé: npm start`);
        console.error(`   URL: ${API_URL}/collectes\n`);
        return [];
    }
}

/**
 * Comparer les données locales et serveur
 */
function comparerDonnees(locales, serveur) {
    console.log('\n📊 COMPARAISON:');
    console.log(`   Locales: ${locales.length} enregistrement(s)`);
    console.log(`   Serveur: ${serveur.length} enregistrement(s)`);
    
    const dateisSynced = locales.length === serveur.length;
    
    if (dateisSynced) {
        console.log('   ✅ En synchronisation!');
    } else {
        const difference = Math.abs(locales.length - serveur.length);
        console.log(`   ⚠️  Différence: ${difference} enregistrement(s)`);
    }
    
    return dateisSynced;
}

/**
 * Synchroniser les données locales vers le serveur
 */
async function synchroniserVersServeur(donneesLocales) {
    if (donneesLocales.length === 0) {
        console.log('\nℹ️  Rien à synchroniser (pas de données locales)');
        return 0;
    }
    
    console.log('\n🔄 SYNCHRONISATION des données locales vers le serveur...');
    
    let nombreSynchro = 0;
    
    for (const donnee of donneesLocales) {
        try {
            // Ne pas renvoyer les données déjà sauvegardées (id existant)
            if (donnee.id) {
                console.log(`   ⏭️  Enregistrement ${donnee.id} déjà sauvegardé, ignoré`);
                continue;
            }
            
            console.log(`   📤 Envoi: ${donnee.partenaire || 'Sans partenaire'}...`);
            
            const response = await fetch(`${API_URL}/collecte`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donnee)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `HTTP ${response.status}`);
            }
            
            const result = await response.json();
            console.log(`      ✅ Sauvegardé avec ID: ${result.data.id}`);
            nombreSynchro++;
            
            // Pause pour éviter de surcharger le serveur
            await new Promise(r => setTimeout(r, 500));
            
        } catch (error) {
            console.error(`      ❌ Erreur: ${error.message}`);
        }
    }
    
    return nombreSynchro;
}

/**
 * Exporter les données du serveur
 */
function exporterDonnees(donnees, format = 'json') {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `export_collectes_${timestamp}.${format}`;
    
    try {
        if (format === 'json') {
            fs.writeFileSync(filename, JSON.stringify(donnees, null, 2));
        } else if (format === 'csv') {
            const headers = Object.keys(donnees[0] || {});
            const csv = [
                headers.join(','),
                ...donnees.map(row => 
                    headers.map(h => {
                        const val = row[h];
                        return typeof val === 'string' && val.includes(',') 
                            ? `"${val}"` 
                            : val;
                    }).join(',')
                )
            ].join('\n');
            fs.writeFileSync(filename, csv);
        }
        
        console.log(`✅ Données exportées: ${filename}`);
    } catch (error) {
        console.error('❌ Erreur export:', error.message);
    }
}

/**
 * Afficher un résumé
 */
function afficherResume(locales, serveur) {
    console.log('\n' + '═'.repeat(50));
    console.log('\n📊 RÉSUMÉ');
    console.log(`   Données locales:  ${locales.length} enregistrement(s)`);
    console.log(`   Données serveur:  ${serveur.length} enregistrement(s)`);
    
    if (serveur.length > 0) {
        const derniere = new Date(serveur[0].date_collecte);
        console.log(`   Dernière collecte: ${derniere.toLocaleString('fr-FR')}`);
    }
    
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  ✅ SYNCHRONISATION COMPLÈTEMENT OPÉRATIONNELLE   ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
}

/**
 * Fonction principale
 */
async function executerSynchronisation() {
    try {
        // Charger les données
        const donneesLocales = chargerDonneesLocales();
        const donneeServeur = await obtenirDonneesServeur();
        
        // Comparer
        comparerDonnees(donneesLocales, donneeServeur);
        
        // Synchroniser
        const nombreSynchro = await synchroniserVersServeur(donneesLocales);
        
        if (nombreSynchro > 0) {
            console.log(`\n✅ ${nombreSynchro} enregistrement(s) synchronisé(s)`);
        }
        
        // Exporter
        if (donneeServeur.length > 0) {
            console.log('\n💾 Export des données...');
            exporterDonnees(donneeServeur, 'json');
            exporterDonnees(donneeServeur, 'csv');
        }
        
        // Résumé
        afficherResume(donneesLocales, donneeServeur);
        
    } catch (error) {
        console.error('\n❌ ERREUR FATALE:', error.message);
        process.exit(1);
    }
}

// Exécuter
executerSynchronisation();
