#!/usr/bin/env node
/**
 * Script interactif d'initialisation PostgreSQL
 * Exécute: node setup-db-interactive.js
 */

const readline = require('readline');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

async function initDatabase() {
    try {
        console.log('\n🔧 Configuration PostgreSQL Interactive\n');
        console.log('Appuyez sur ENTRÉE pour utiliser les valeurs par défaut entre [crochets]\n');

        // Demander les identifiants
        const user = await question('👤 Utilisateur PostgreSQL [postgres]: ') || 'postgres';
        const password = await question('🔐 Mot de passe [postgres]: ') || 'postgres';
        const host = await question('🖥️  Hôte [localhost]: ') || 'localhost';
        const port = await question('🔌 Port [5432]: ') || '5432';
        const database = 'dimentionnement_SNG';

        console.log('\n🔄 Connexion à PostgreSQL...');

        // Connexion à postgres (BD par défaut)
        const pool = new Pool({
            user,
            password,
            host,
            port: parseInt(port),
            database: 'postgres'
        });

        // 1️⃣ Créer la base
        console.log('\n1️⃣ Création de la base "dimentionnement_SNG"...');
        try {
            await pool.query('CREATE DATABASE dimentionnement_SNG');
            console.log('✅ Base créée');
        } catch (e) {
            if (e.code === '42P04') {
                console.log('ℹ️  Base déjà existante');
            } else {
                throw e;
            }
        }

        // 2️⃣ Se connecter à la nouvelle base
        const dbPool = new Pool({
            user,
            password,
            host,
            port: parseInt(port),
            database: 'dimentionnement_SNG'
        });

        // 3️⃣ Exécuter le script SQL
        console.log('\n2️⃣ Lecture et exécution de CREATE_TABLES.sql...');
        const sqlFile = path.join(__dirname, 'CREATE_TABLES.sql');
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');
        await dbPool.query(sqlContent);
        console.log('✅ Tables créées\n');

        // 4️⃣ Vérifier
        console.log('3️⃣ Vérification des colonnes...');
        const result = await dbPool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'collectes_donnees'
            ORDER BY ordinal_position;
        `);

        console.log('\n📋 Colonnes créées:');
        result.rows.forEach((row, i) => {
            console.log(`   ${String(i + 1).padStart(2, '0')}. ${row.column_name.padEnd(20)} → ${row.data_type}`);
        });

        console.log(`\n✅ Total: ${result.rows.length} colonnes\n`);

        // Sauvegarder les identifiants dans .env
        console.log('4️⃣ Sauvegarde de la configuration...');
        const envContent = `# Configuration PostgreSQL
DB_USER=${user}
DB_PASSWORD=${password}
DB_HOST=${host}
DB_PORT=${port}
DB_NAME=${database}
PORT=3001
NODE_ENV=development
`;
        fs.writeFileSync(path.join(__dirname, '.env'), envContent);
        console.log('✅ Fichier .env créé\n');

        console.log('🎉 ========================================');
        console.log('   ✅ INITIALISATION TERMINÉE AVEC SUCCÈS!');
        console.log('   ========================================\n');
        console.log('🚀 Prochaines étapes:');
        console.log('   1. Lancez le serveur:  npm start');
        console.log('   2. Ouvrez l\'application: http://localhost:3001');
        console.log('   3. Testez la sauvegarde des données\n');

        await dbPool.end();
        await pool.end();
        rl.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
        console.error('\n💡 Solutions possibles:');
        console.error('   1. Assurez-vous que PostgreSQL est lancé');
        console.error('   2. Vérifiez les identifiants (user/password)');
        console.error('   3. Vérifiez que PostgreSQL écoute sur localhost:5432');
        console.error('   4. Réessayez: node setup-db-interactive.js\n');

        rl.close();
        process.exit(1);
    }
}

initDatabase();
