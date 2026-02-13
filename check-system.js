#!/usr/bin/env node

/**
 * ✅ VÉRIFICATION RAPIDE - État du Système
 * Exécutez ce script pour diagnostiquer les problèmes
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

console.log('\n' + '='.repeat(70));
console.log('🔍 DIAGNOSTIC DU SYSTÈME - DIMENSIONNEMENT SONAGED');
console.log('='.repeat(70));

let nombreErreurs = 0;
let nombreAvertissements = 0;

function test(titre, condition, messageErreur = '') {
    if (condition) {
        console.log(`✅ ${titre}`);
    } else {
        console.log(`❌ ${titre}`);
        nombreErreurs++;
        if (messageErreur) {
            console.log(`   💡 ${messageErreur}`);
        }
    }
}

function avertissement(titre, condition, messageAvertissement = '') {
    if (condition) {
        console.log(`⚠️  ${titre}`);
        nombreAvertissements++;
        if (messageAvertissement) {
            console.log(`   💡 ${messageAvertissement}`);
        }
    }
}

// ============================================
console.log('\n📁 FICHIERS REQUIS:');
console.log('-'.repeat(70));

const fichiersRequis = [
    { nom: 'index.html', chemin: 'index.html' },
    { nom: 'server.js', chemin: 'server.js' },
    { nom: 'db.js', chemin: 'db.js' },
    { nom: 'package.json', chemin: 'package.json' },
    { nom: '.env', chemin: '.env' }
];

fichiersRequis.forEach(f => {
    const existe = fs.existsSync(path.join(__dirname, f.chemin));
    test(`${f.nom}`, existe, 
        existe ? '' : `Créer le fichier: ${f.chemin}`);
});

// ============================================
console.log('\n📦 DÉPENDANCES NPM:');
console.log('-'.repeat(70));

try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    const deps = packageJson.dependencies || {};
    
    test('express', 'express' in deps, 'npm install express');
    test('pg', 'pg' in deps, 'npm install pg');
    test('cors', 'cors' in deps, 'npm install cors');
    test('dotenv', 'dotenv' in deps, 'npm install dotenv');
} catch (e) {
    console.log('❌ Impossible de lire package.json');
    nombreErreurs++;
}

// ============================================
console.log('\n🗄️  CONFIGURATION POSTGRESQL:');
console.log('-'.repeat(70));

try {
    const envFile = path.join(__dirname, '.env');
    if (fs.existsSync(envFile)) {
        const env = {};
        fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) env[key.trim()] = value.trim();
        });
        
        test('DB_HOST', !!env.DB_HOST, 'Ajouter DB_HOST dans .env');
        test('DB_USER', !!env.DB_USER, 'Ajouter DB_USER dans .env');
        test('DB_PASSWORD', !!env.DB_PASSWORD, 'Ajouter DB_PASSWORD dans .env');
        test('DB_NAME', !!env.DB_NAME, 'Ajouter DB_NAME dans .env');
        test('DB_PORT', !!env.DB_PORT, 'Ajouter DB_PORT dans .env');
    } else {
        console.log('⚠️  Fichier .env non trouvé');
        nombreAvertissements++;
        console.log('    Créer un fichier .env avec les variables d\'environnement');
    }
} catch (e) {
    console.log(`⚠️  Erreur lecture .env: ${e.message}`);
    nombreAvertissements++;
}

// ============================================
console.log('\n🚀 SERVEUR:');
console.log('-'.repeat(70));

function testerServeur(url, nom) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const timeout = setTimeout(() => {
            console.log(`❌ ${nom} - Impossible de se connecter`);
            console.log(`    Vérifiez que le serveur est lancé: npm start`);
            nombreErreurs++;
            resolve(false);
        }, 5000);

        const urlObj = new URL(url + '/api/health');
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: '/api/health',
            method: 'GET'
        };

        const req = client.request(options, (res) => {
            clearTimeout(timeout);
            if (res.statusCode === 200) {
                console.log(`✅ ${nom} - Accessible (${res.statusCode})`);
                resolve(true);
            } else {
                console.log(`⚠️  ${nom} - Retourne ${res.statusCode}`);
                nombreAvertissements++;
                resolve(false);
            }
        });

        req.on('error', (err) => {
            clearTimeout(timeout);
            console.log(`❌ ${nom} - Erreur: ${err.message}`);
            nombreErreurs++;
            resolve(false);
        });

        req.end();
    });
}

(async () => {
    await testerServeur('http://localhost:3001', 'Serveur Local');
    
    // ============================================
    console.log('\n🌐 FRONTEND:');
    console.log('-'.repeat(70));
    
    test('index.html existe', fs.existsSync(path.join(__dirname, 'index.html')));
    
    // Vérifier si index.html contient la configuration API
    const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    test('Configuration API présente', indexHtml.includes('API_BASE_URL'), 
        'Vérifier que index.html a la fonction detecterURLServeur()');
    test('Validation du formulaire', indexHtml.includes('validerFormulaire'), 
        'Vérifier que index.html a les fonctions de validation');
    
    // ============================================
    console.log('\n📊 RÉSUMÉ:');
    console.log('-'.repeat(70));
    
    if (nombreErreurs === 0 && nombreAvertissements === 0) {
        console.log('✅ TOUT EST OK! Le système est prêt à être utilisé.');
        console.log('\n💡 Prochaines étapes:');
        console.log('   1. npm start (lancer le serveur)');
        console.log('   2. Ouvrir http://localhost:8000');
        console.log('   3. Remplir le formulaire');
        console.log('   4. Cliquer "Sauvegarder les Données"');
    } else {
        console.log(`\n⚠️  ${nombreErreurs} erreur(s) trouvée(s)`);
        console.log(`⚠️  ${nombreAvertissements} avertissement(s)`);
        console.log('\n📖 Consultez GUIDE_SAUVEGARDE_BD.md pour plus d\'aide');
    }
    
    console.log('\n' + '='.repeat(70) + '\n');
    
    process.exit(nombreErreurs > 0 ? 1 : 0);
})();
