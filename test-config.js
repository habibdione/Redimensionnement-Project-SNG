#!/usr/bin/env node

/**
 * TEST COMPLET TUNNEL - Validation de la configuration
 * ====================================================
 * Teste que tous les fichiers sont correctement mis à jour
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '═'.repeat(70));
console.log('✅ TEST COMPLET TUNNEL - VALIDATION DE LA CONFIGURATION');
console.log('═'.repeat(70) + '\n');

const tests = [];

/**
 * Test 1: Vérifier que tunnel-config.js existe
 */
console.log('1️⃣  Vérification des fichiers');
console.log('─'.repeat(70));

const tunnelConfigExists = fs.existsSync(path.join(__dirname, 'tunnel-config.js'));
console.log(`${tunnelConfigExists ? '✅' : '❌'} tunnel-config.js`);
tests.push({ name: 'tunnel-config.js', result: tunnelConfigExists });

/**
 * Test 2: Vérifier que config.js inclut la configuration tunnel
 */
const configPath = path.join(__dirname, 'config.js');
const configContent = fs.readFileSync(configPath, 'utf8');
const hasTunnelConfig = configContent.includes('tunnel:');
console.log(`${hasTunnelConfig ? '✅' : '❌'} config.js contient "tunnel:"`);
tests.push({ name: 'config.js tunnel', result: hasTunnelConfig });

/**
 * Test 3: Vérifier que api-client.js importe tunnel-config
 */
const apiClientPath = path.join(__dirname, 'api-client.js');
const apiClientContent = fs.readFileSync(apiClientPath, 'utf8');
const hasTunnelImport = apiClientContent.includes('TUNNEL_CONFIG');
const hasRetryLogic = apiClientContent.includes('faireRequete');
console.log(`${hasTunnelImport ? '✅' : '❌'} api-client.js détecte TUNNEL_CONFIG`);
console.log(`${hasRetryLogic ? '✅' : '❌'} api-client.js a la logique de retry`);
tests.push({ name: 'api-client tunnel', result: hasTunnelImport && hasRetryLogic });

/**
 * Test 4: Vérifier que index.html charge tunnel-config
 */
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const loadsTunnelConfig = htmlContent.includes('tunnel-config.js');
const loadsOrder = htmlContent.indexOf('tunnel-config.js') < htmlContent.indexOf('config.js');
console.log(`${loadsTunnelConfig ? '✅' : '❌'} index.html charge tunnel-config.js`);
console.log(`${loadsOrder ? '✅' : '❌'} Ordre correct (tunnel-config avant config)`);
tests.push({ name: 'index.html order', result: loadsTunnelConfig && loadsOrder });

/**
 * Test 5: Vérifier le format du tunnel-config
 */
const tunnelConfigContent = fs.readFileSync(path.join(__dirname, 'tunnel-config.js'), 'utf8');
const hasCorrectTunnelUrl = tunnelConfigContent.includes('4mkdbs2k-3001.euw.devtunnels.ms');
const hasActivationLogic = tunnelConfigContent.includes('activerTunnel');
console.log(`${hasCorrectTunnelUrl ? '✅' : '❌'} tunnel-config.js a la bonne URL`);
console.log(`${hasActivationLogic ? '✅' : '❌'} tunnel-config.js a la logique d'activation`);
tests.push({ name: 'tunnel-config format', result: hasCorrectTunnelUrl && hasActivationLogic });

/**
 * Test 6: Vérifier la présence de diagnostic.js et test-tunnel.js
 */
const diagExists = fs.existsSync(path.join(__dirname, 'diagnostic.js'));
const testTunnelExists = fs.existsSync(path.join(__dirname, 'test-tunnel.js'));
console.log(`${diagExists ? '✅' : '❌'} diagnostic.js`);
console.log(`${testTunnelExists ? '✅' : '❌'} test-tunnel.js`);
tests.push({ name: 'diagnostic tools', result: diagExists && testTunnelExists });

/**
 * Test 7: Vérifier package.json
 */
const pkgPath = path.join(__dirname, 'package.json');
const pkgContent = fs.readFileSync(pkgPath, 'utf8');
const hasTunnelScript = pkgContent.includes('test:tunnel');
console.log(`${hasTunnelScript ? '✅' : '❌'} package.json a "test:tunnel"`);
tests.push({ name: 'package.json scripts', result: hasTunnelScript });

/**
 * Résumé
 */
console.log('\n' + '═'.repeat(70));
console.log('📊 RÉSUMÉ');
console.log('═'.repeat(70) + '\n');

const allPassed = tests.every(t => t.result);
let passedCount = 0;

tests.forEach(test => {
    const icon = test.result ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
    if (test.result) passedCount++;
});

console.log(`\n${passedCount}/${tests.length} tests réussis\n`);

if (allPassed) {
    console.log('🎉 TOUT EST CORRECTEMENT CONFIGURÉ POUR LE TUNNEL!\n');
    console.log('Prochaines étapes:');
    console.log('  1. Vérifiez que le tunnel est PUBLIC (devtunnel update 4mkdbs2k --allow-anonymous)');
    console.log('  2. Lancez le serveur: npm start');
    console.log('  3. Accédez à: http://localhost:5000?env=tunnel');
    console.log('  4. Testez la sauvegarde\n');
} else {
    console.log('⚠️  CERTAINS FICHIERS NE SONT PAS À JOUR\n');
    console.log('Veuillez exécuter les mises à jour mentionnées.\n');
}

console.log('═'.repeat(70) + '\n');
