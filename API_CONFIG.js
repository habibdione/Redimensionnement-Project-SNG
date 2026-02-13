// 🔧 CONFIGURATION DU SERVEUR API
// Ce fichier montre comment configurer l'URL du serveur API pour différents contextes

// ==================================================
// ✅ CONFIGURATION AUTOMATIQUE (Déjà implémentée)
// ==================================================

// Le frontend détecte AUTOMATIQUEMENT:
// ✓ localhost → http://localhost:3001
// ✓ devtunnels.ms → https://xyz123-3001.euw.devtunnels.ms
// ✓ github.io → https://votre-tunnel-ici

// No action required!

// ==================================================
// 📝 SI VOUS DEVEZ FORCER UNE URL SPÉCIFIQUE
// ==================================================

// 1. Ouvrez index.html dans un éditeur

// 2. Recherchez la fonction detecterURLServeur() (~ligne 800)

// 3. Vous verrez ce code:

/*
if (hostname.includes('github.io')) {
    API_BASE_URL = 'https://4mkdbs2k-3001.euw.devtunnels.ms';
    console.log('✅ Mode GitHub Pages - Serveur: ' + API_BASE_URL);
}
*/

// 4. Remplacez l'URL par la VÔTRE:

// Example:
// API_BASE_URL = 'https://ABC123-3001.euw.devtunnels.ms';
// API_BASE_URL = 'https://xyz456.ngrok.io';
// API_BASE_URL = 'https://votre-domaine.com';

// ==================================================
// 🚀 COMMENT OBTENIR VOTRE DEV TUNNEL URL
// ==================================================

// Option 1: VS Code Tunnels (Recommandé)
// ────────────────────────────────────────
// 1. Dans VS Code, ouvrez Command Palette (Ctrl+Shift+P)
// 2. Tapez: "Ports: Focus on Ports View"
// 3. Lancez votre serveur: npm start
// 4. Le port 3001 devrait être listé
// 5. Right-click sur le port → "Make Public" (si nécessaire)
// 6. Copier l'URL du tunnel (exemple: https://4mkdbs2k-3001.euw.devtunnels.ms/)

// Option 2: ngrok (Alternative)
// ────────────────────────────────
// 1. Installer ngrok: https://ngrok.com/download
// 2. Lancer: ngrok http 3001
// 3. Copier l'URL publique (exemple: https://abc123.ngrok.io)
// 4. URL API: https://abc123.ngrok.io/api/collecte

// ==================================================
// 📋 CHECKLIST DE CONFIGURATION
// ==================================================

// [ ] Serveur Node.js lancé: npm start
// [ ] Accès à http://localhost:3001/api/health (200 OK)
// [ ] Dev tunnel créé et actif (si nécessaire)
// [ ] Frontend déployé sur GitHub Pages (si nécessaire)
// [ ] URL du tunnel mise à jour dans index.html
// [ ] Console du navigateur montre: 🔗 API_BASE_URL configuré à: ...
// [ ] PostgreSQL lancé et fonctionnel
// [ ] Formulaire rempli et envoyé
// [ ] Données visibles en base de données

// ==================================================
// 🧪 TEST RAPIDE
// ==================================================

// Pour tester, ouvrez la console du navigateur (F12)
// et tapez:

// console.log(API_BASE_URL);
// → Affiche l'URL actuellement utilisée

// fetch(API_BASE_URL + '/api/health')
//   .then(r => r.json())
//   .then(d => console.log(d))
// → Teste la connexion au serveur

// ==================================================
// 📊 VÉRIFIER LES DONNÉES SAUVEGARDÉES
// ==================================================

// Via curl:
// curl http://localhost:3001/api/statistiques

// Ou depuis pgAdmin:
// SELECT * FROM collectes_donnees;

// ==================================================
// 🆘 SUPPORT
// ==================================================

// Si vous avez des problèmes:
// 1. Vérifiez la Console du navigateur (F12)
// 2. Vérifiez les logs du serveur: npm start
// 3. Vérifiez la connectivité: curl http://localhost:3001/api/health
// 4. Vérifiez PostgreSQL: psql -U postgres -d senelec_dimensionnement

console.log('✅ Configuration API chargée');
console.log('📍 URL du serveur: ' + (typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'Non configurée'));
