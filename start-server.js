#!/usr/bin/env node
/**
 * Starter Node.js intelligent - Gère le port 3001
 * Usage: node start-server.js
 */

const { exec, spawn } = require('child_process');
const http = require('http');
const os = require('os');

const PORT = 3001;
const MAX_RETRIES = 3;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isPortInUse(port) {
    return new Promise((resolve) => {
        const server = http.createServer();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(true);
            } else {
                resolve(false);
            }
        });
        server.once('listening', () => {
            server.close();
            resolve(false);
        });
        server.listen(port);
    });
}

async function killPortProcess(port) {
    return new Promise((resolve) => {
        if (os.platform() === 'win32') {
            // Windows
            exec(`For /F "tokens=5" %a in ('netstat -aon ^| find ":${port}" ^| find "LISTENING"') do taskkill /PID %a /F`, 
                (err) => {
                    console.log('   ⏹️  Processus Windows arrêté');
                    resolve();
                }
            );
        } else {
            // Linux/Mac
            exec(`lsof -ti :${port} | xargs kill -9 2>/dev/null || true`, (err) => {
                console.log('   ⏹️  Processus Unix arrêté');
                resolve();
            });
        }
    });
}

async function startServer() {
    console.log('\n╔═══════════════════════════════════════════════╗');
    console.log('║   SONAGED - Dimensionnement SNG              ║');
    console.log('║   Démarrage Intelligent du Serveur           ║');
    console.log('╚═══════════════════════════════════════════════╝\n');

    // 1️⃣ Vérifier si le port est libre
    console.log('1️⃣  Vérification du port 3001...');
    let portInUse = await isPortInUse(PORT);
    
    if (portInUse) {
        console.log(`   ⚠️  Le port ${PORT} est occupé`);
        console.log('   ' .repeat(20));
        
        for (let retries = 0; retries < MAX_RETRIES; retries++) {
            console.log(`\n   Tentative ${retries + 1}/${MAX_RETRIES}: Libération du port...`);
            await killPortProcess(PORT);
            await sleep(1000);
            
            portInUse = await isPortInUse(PORT);
            if (!portInUse) {
                console.log('   ✅ Port libéré avec succès!');
                break;
            }
        }
        
        if (portInUse) {
            console.error(`\n   ❌ Impossible de libérer le port ${PORT}`);
            console.error(`\n   💡 Solutions alternatives:`);
            console.error(`      - Redémarrez votre ordinateur`);
            console.error(`      - Changez le port dans .env (PORT=3002)`);
            console.error(`      - Changez le port dans package.json\n`);
            process.exit(1);
        }
    } else {
        console.log('   ✅ Port disponible\n');
    }

    // 2️⃣ Démarrer le serveur
    console.log('2️⃣  Démarrage du serveur...\n');
    console.log('   🚀 npm start\n');

    const npm = spawn('npm', ['start'], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd()
    });

    npm.on('close', (code) => {
        console.log(`\n   Serveur arrêté (code: ${code})`);
        process.exit(code);
    });

    npm.on('error', (err) => {
        console.error('   ❌ Erreur:', err.message);
        process.exit(1);
    });
}

// Lancer
startServer().catch(err => {
    console.error('❌ Erreur:', err);
    process.exit(1);
});
