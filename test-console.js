/**
 * Test - Vérifier les erreurs console et l'exécution
 */

const puppeteer = require('puppeteer');

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Capturer les messages console
        page.on('console', msg => {
            const type = msg.type().toUpperCase();
            const args = msg.args();
            console.log(`[${type}] ${msg.text()}`);
        });

        // Capturer les erreurs
        page.on('error', err => {
            console.error('❌ PAGE ERROR:', err);
        });

        page.on('pageerror', err => {
            console.error('❌ UNCAUGHT ERROR:', err);
        });

        console.log('Chargement de la page...\n');
        
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 10000 });

        // Attendre un peu pour les logs console
        await page.waitForTimeout(2000);

        console.log('\n✅ Test terminé');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        if (browser) await browser.close();
    }
})();
