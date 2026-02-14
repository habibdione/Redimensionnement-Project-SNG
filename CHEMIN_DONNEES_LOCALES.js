/**
 * 📍 LOCALISATION DES DONNÉES LOCALES
 * ===================================
 * Ce script montre où et comment les données sont stockées localement
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  📍 LOCALISATION DES DONNÉES SAUVEGARDÉES LOCALEMENT           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

console.log(`
🔹 STOCKAGE: LocalStorage du Navigateur
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    📁 Emplacement: C:\\Users\\[VotreNomUtilisateur]\\AppData\\Local\\[Navigateur]\\
    
    Par navigateur:
    ├─ Chrome:     AppData\\Local\\Google\\Chrome\\User Data\\Default\\Local Storage\\
    ├─ Firefox:    AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\[hash].default-release\\
    ├─ Edge:       AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Local Storage\\
    └─ Safari:     ~/Library/Safari/LocalStorage/

    💾 CLE: "collectes_donnees"
    📊 FORMAT: JSON (texte lisible)

`);

console.log(`
🔹 ACCÈS FACILE DEPUIS LE NAVIGATEUR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    1️⃣  Ouvrez le formulaire: https://habibdione.github.io/Redimensionnement-Project-SNG/
    
    2️⃣  Appuyez sur F12 (DevTools)
    
    3️⃣  Allez à: Application → Local Storage → [URL du site]
    
    4️⃣  Recherchez la clé: "collectes_donnees"
    
    5️⃣  Visualisez les données en JSON

`);

console.log(`
🔹 VISUALISER LES DONNÉES DANS LA CONSOLE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Dans la console du navigateur (F12), tapez:
    
    ┌─────────────────────────────────────────────────┐
    │ const data = JSON.parse(localStorage.getItem('collectes_donnees')); │
    │ console.table(data);                            │
    └─────────────────────────────────────────────────┘
    
    Ou simplement:
    ┌─────────────────────────────────────────────────┐
    │ localStorage                                    │
    └─────────────────────────────────────────────────┘

`);

console.log(`
🔹 STRUCTURE DES DONNÉES STOCKÉES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    localStorage.collectes_donnees = [
        {
            "partenaire": "Votre saisie",
            "region": "Dakar",
            "departement": "Dakar",
            "commune": "Plateau",
            "adresse": "Rue de la Paix, Dakar",
            "typeActivite": ["..."],
            "latitude": 14.6745,
            "longitude": -17.0555,
            "photo": "data:image/jpeg;base64,..." ← TRÈS VOLUMINEUX
            "dateCollecte": "2026-02-14T20:38:46.785Z"
        },
        { ... autres données ... }
    ]

`);

console.log(`
🔹 QUAND LES DONNÉES SONT SYNCHRONISÉES?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ✅ Le serveur backend (3001) est actif
       → Données envoyées à PostgreSQL immédiatement
    
    ❌ Le serveur backend (3001) n'est pas actif
       → Données restent dans localStorage
       → Automatiquement envoyées au redémarrage du serveur

`);

console.log(`
🔹 VIDER LE LOCALSTORAGE (Si besoin):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Dans la console (F12):
    
    ┌─────────────────────────────────────────────────┐
    │ localStorage.removeItem('collectes_donnees');   │
    │ console.log('✅ Données locales supprimées');   │
    └─────────────────────────────────────────────────┘

`);

console.log(`
🔹 RÉSUMÉ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    📦 OÙ?        → LocalStorage du navigateur
    🔑 CLE?       → "collectes_donnees"
    📊 FORMAT?    → JSON (tableau d'objets)
    🔍 ACCÈS?     → F12 → Application → Local Storage
    ⏰ QUAND?     → Quand le serveur backend n'est pas accessible
    🔄 SYNC?      → Automatiquement au redémarrage du serveur

`);

console.log(`
════════════════════════════════════════════════════════════════

`);
