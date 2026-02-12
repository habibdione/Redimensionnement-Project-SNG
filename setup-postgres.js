#!/usr/bin/env node

/**
 * SCRIPT DE CONFIGURATION POSTGRESQL
 * ===================================
 * Crée automatiquement l'utilisateur et la base de données
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement
require('dotenv').config();

const config = {
    // Connexion au serveur PostgreSQL (avec user postgres)
    admin: {
        user: 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'jtmmaman96',
        host: 'localhost',
        port: 5432,
        database: 'postgres' // DB système
    },
    // Nouvelles credentials pour l'utilisateur de l'app
    appUser: process.env.DB_USER || 'dimentionnement_SNG',
    appPassword: process.env.DB_PASSWORD || 'jtmmaman96',
    appDatabase: process.env.DB_NAME || 'dimentionnement_SNG'
};

console.log('🔧 CONFIGURATION POSTGRESQL - SENELEC DIMENSIONNEMENT');
console.log('=====================================================\n');

async function setupPostgreSQL() {
    let adminClient = null;
    let appClient = null;

    try {
        // Étape 1: Connexion comme administrateur
        console.log('📍 Étape 1: Connexion en tant qu\'administrateur PostgreSQL...');
        adminClient = new Client(config.admin);
        
        await adminClient.connect();
        console.log('✅ Connecté en tant que postgres\n');

        // Étape 2: Vérifier/Créer l'utilisateur
        console.log(`📍 Étape 2: Vérifier/Créer l'utilisateur "${config.appUser}"...`);
        
        try {
            // Vérifier si l'utilisateur existe
            const userCheck = await adminClient.query(
                `SELECT 1 FROM pg_user WHERE usename = $1`,
                [config.appUser]
            );

            if (userCheck.rows.length > 0) {
                console.log(`✅ L'utilisateur "${config.appUser}" existe déjà`);
                
                // Réinitialiser le mot de passe
                await adminClient.query(
                    `ALTER USER ${config.appUser} WITH PASSWORD $1`,
                    [config.appPassword]
                );
                console.log(`✅ Mot de passe mis à jour\n`);
            } else {
                // Créer l'utilisateur
                await adminClient.query(
                    `CREATE USER ${config.appUser} WITH PASSWORD $1`,
                    [config.appPassword]
                );
                console.log(`✅ Utilisateur "${config.appUser}" créé\n`);
            }
        } catch (err) {
            console.error(`❌ Erreur lors de la gestion de l'utilisateur:`, err.message);
            throw err;
        }

        // Étape 3: Donner les permissions
        console.log(`📍 Étape 3: Configuration des permissions...`);
        
        try {
            await adminClient.query(`ALTER USER ${config.appUser} WITH CREATEDB SUPERUSER`);
            console.log(`✅ Permissions CREATEDB et SUPERUSER attribuées\n`);
        } catch (err) {
            console.error(`❌ Erreur lors de l'attribution des permissions:`, err.message);
            throw err;
        }

        // Étape 4: Vérifier/Créer la base de données
        console.log(`📍 Étape 4: Vérifier/Créer la base de données "${config.appDatabase}"...`);
        
        try {
            const dbCheck = await adminClient.query(
                `SELECT 1 FROM pg_database WHERE datname = $1`,
                [config.appDatabase]
            );

            if (dbCheck.rows.length > 0) {
                console.log(`✅ La base de données "${config.appDatabase}" existe déjà`);
                
                // Changer le propriétaire
                await adminClient.query(
                    `ALTER DATABASE ${config.appDatabase} OWNER TO ${config.appUser}`
                );
                console.log(`✅ Propriétaire changé vers "${config.appUser}"\n`);
            } else {
                // Créer la base de données
                await adminClient.query(
                    `CREATE DATABASE ${config.appDatabase} OWNER ${config.appUser} ENCODING UTF8 LC_COLLATE 'C' LC_CTYPE 'C'`
                );
                console.log(`✅ Base de données "${config.appDatabase}" créée\n`);
            }
        } catch (err) {
            console.error(`❌ Erreur lors de la gestion de la base de données:`, err.message);
            throw err;
        }

        // Étape 5: Tester la connexion avec le nouvel utilisateur
        console.log(`📍 Étape 5: Test de connexion avec le nouvel utilisateur...`);
        
        try {
            appClient = new Client({
                user: config.appUser,
                password: config.appPassword,
                host: 'localhost',
                port: 5432,
                database: config.appDatabase
            });

            await appClient.connect();
            
            const result = await appClient.query('SELECT NOW() as current_time');
            console.log(`✅ Connexion réussie!\n`);
            console.log(`   Heure serveur: ${result.rows[0].current_time}\n`);
            
            await appClient.end();
        } catch (err) {
            console.error(`❌ Erreur lors du test de connexion:`, err.message);
            throw err;
        }

        // Afficher le résumé
        console.log('\n✅ CONFIGURATION COMPLÉTÉE AVEC SUCCÈS!\n');
        console.log('📋 Résumé:');
        console.log(`   Utilisateur: ${config.appUser}`);
        console.log(`   Mot de passe: ${config.appPassword}`);
        console.log(`   Base de données: ${config.appDatabase}`);
        console.log(`   Host: localhost:5432\n`);
        
        console.log('🚀 Vous pouvez maintenant exécuter:\n');
        console.log('   npm start\n');

    } catch (error) {
        console.error('\n❌ ERREUR FATALE:', error.message);
        console.error('\n💡 SOLUTIONS POSSIBLES:');
        console.error('   1. Vérifier que PostgreSQL est actif');
        console.error('   2. Vérifier le mot de passe administrateur PostgreSQL');
        console.error('   3. Modifier POSTGRES_ADMIN_PASSWORD dans le script si le mot de passe change\n');
        process.exit(1);
    } finally {
        // Fermer les connexions
        if (adminClient) {
            try {
                await adminClient.end();
            } catch (err) {
                console.warn('Erreur lors de la fermeture de la connexion admin');
            }
        }
        if (appClient) {
            try {
                await appClient.end();
            } catch (err) {
                console.warn('Erreur lors de la fermeture de la connexion app');
            }
        }
    }
}

// Exécuter le setup
setupPostgreSQL().catch(err => {
    console.error('Erreur non gérée:', err);
    process.exit(1);
});
