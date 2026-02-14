#!/bin/bash
# Fichier README pour la synchronisation serveur local
# Pour Windows, utilisez PowerShell ou CMD

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   📱 DIMENSIONNEMENT SONAGED - SYNCHRONISATION SERVEUR LOCAL               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│ 🎯 OBJECTIF: Synchroniser vos données locales ↔ PostgreSQL Backend          │
└──────────────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 📋 PRÉREQUIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Node.js v14+ installé
  ✅ PostgreSQL installé et actif
  ✅ npm/yarn disponible
  ✅ Fichier .env configuré

  Vérifier:
  $ node --version
  $ npm --version
  $ psql --version

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🚀 DÉMARRAGE RAPIDE (3 étapes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1️⃣  LANCER LE SERVEUR
  ═════════════════════════════════════════════════════════════════════════

      PowerShell:
      $ .\sync-server.ps1
      
      npm:
      $ npm start
      
      Node direct:
      $ node server.js

      ✅ Vous verrez:
         ┌────────────────────────────────────────────┐
         │ ✅ Base de données initialisée             │
         │ ✅ Connexion PostgreSQL réussie            │
         │ ✅ SERVEUR DIMENSIONNEMENT SONAGED ACTIF   │
         │    Port: 3001                              │
         │    URL: http://localhost:3001              │
         └────────────────────────────────────────────┘


  2️⃣  OUVRIR L'APPLICATION
  ═════════════════════════════════════════════════════════════════════════

      Naviguer vers:
      → http://localhost:3001
      
      Vous verrez le formulaire de collecte


  3️⃣  SAUVEGARDER LES DONNÉES
  ═════════════════════════════════════════════════════════════════════════

      1. Remplir le formulaire
      2. Activer le GPS
      3. Prendre une photo (optionnel)
      4. Cliquer "💾 Sauvegarder"
      
      ✅ Résultat:
         Les données vont directement → PostgreSQL
         
         Message confirmation:
         "✅ DONNÉES SAUVEGARDÉES DANS POSTGRESQL!
          🆔 ID: 22
          📅 Date: 14/02/2026 21:52"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ✅ VÉRIFICATION DE LA SYNCHRONISATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  TEST 1: Vérifier PostgreSQL
  $ node test-db.js
  ✅ Affichera: Tables, colonnes, état de connexion

  TEST 2: Tester sauvegarde complète
  $ npm run test:save
  ✅ Affichera: Données envoyées, ID reçu, vérification en base

  TEST 3: Synchroniser données locales
  $ npm run sync
  ✅ Affichera: Données du navigateur → Serveur

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 📊 VOIR LES DONNÉES SYNCHRONISÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  VIA L'API:
  $ Invoke-WebRequest http://localhost:3001/api/collectes | ConvertFrom-Json
  
  VIA POSTGRESQL:
  $ psql -U postgres -d dimentionnement_SNG
  $ SELECT * FROM collectes_donnees ORDER BY date_collecte DESC LIMIT 5;
  
  VIA LE NAVIGATEUR:
  → http://localhost:3001/api/collectes
  → http://localhost:3001/api/stats

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🔄 ARCHITECTURE DE SYNCHRONISATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  SCÉNARIO 1: ONLINE (Avec Internet)
  ──────────────────────────────────────────────────────

    Formulaire
        ↓
    Validation
        ↓
    POST /api/collecte
        ↓
    Backend Express (server.js) - Port 3001
        ↓
    INSERT INTO collectes_donnees
        ↓
    PostgreSQL
        ↓
    ✅ Confirmation: "Données sauvegardées dans PostgreSQL!"

  SCÉNARIO 2: OFFLINE (Sans Internet)
  ──────────────────────────────────────────────────────

    Formulaire
        ↓
    localStorage
        ↓ (quand Internet revient)
    Synchronisation Auto
        ↓
    POST /api/collecte
        ↓
    PostgreSQL
        ↓
    ✅ Confirmation: "Données synchronisées!"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 📡 API ENDPOINTS DISPONIBLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Tableau:

  Endpoint                          | Méthode | Description
  ─────────────────────────────────┬─────────┬──────────────────────────────
  /api/health                       | GET     | Voir état du serveur
  /api/collectes                    | GET     | Voir toutes les collectes
  /api/collecte/:id                 | GET     | Voir une collecte spécifique
  /api/collecte                     | POST    | Créer une nouvelle collecte
  /api/collecte/:id                 | PUT     | Mettre à jour une collecte
  /api/stats                        | GET     | Voir les statistiques
  ─────────────────────────────────┴─────────┴──────────────────────────────

  Exemples:
  $ curl http://localhost:3001/api/health
  $ curl http://localhost:3001/api/collectes
  $ curl http://localhost:3001/api/stats

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🛠️ SCRIPTS NPM DISPONIBLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  $ npm start              → Lancer le serveur
  $ npm run test:db       → Tester connexion PostgreSQL
  $ npm run test:save     → Tester sauvegarde complète
  $ npm run test:sync     → Tester synchronisation locale
  $ npm run test          → Tous les tests
  $ npm run sync          → Synchroniser données locales

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🚨 TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  PROBLÈME: "Cannot connect to localhost:3001"
  ──────────────────────────────────────────
  SOLUTION: 
    1. Vérifier: npm start fonctionne
    2. Vérifier: Navigateur → http://localhost:3001
    3. Vérifier port 3001 : Get-NetTCPConnection -LocalPort 3001
    4. Tuer processus: Stop-Process -Name node -Force

  PROBLÈME: "PostgreSQL connection refused"
  ──────────────────────────────────────────
  SOLUTION:
    1. Ouvrir Services Windows
    2. Trouver postgresql-x64-15
    3. Cliquer → Démarrer
    4. Ou: net start postgresql-x64-15

  PROBLÈME: "Table does not exist"
  ──────────────────────────────────────────
  SOLUTION:
    1. Relancer: npm start (création auto)
    2. Ou manuellement: psql -U postgres -f CREATE_TABLES.sql
    3. Vérifier: node test-db.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  📖 Guides disponibles:
    • SYNC_GUIDE.md                 ← Guide complet de synchronisation
    • SYNC_COMMANDES.md             ← Commandes essentielles
    • POSTGRESQL_SETUP_GUIDE.md     ← Configuration PostgreSQL
    • README.md                     ← Documentation générale

  📡 Serveur:
    • server.js                     ← Backend Express
    • db.js                         ← Connexion PostgreSQL

  🧪 Tests:
    • test-db.js                    ← Test base de données
    • test-save.js                  ← Test sauvegarde
    • sync-local-server.js          ← Synchronisation manuelle

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ✨ PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Configurer .env
  ✅ Lancer le backend: npm start
  ✅ Ouvrir l'app: http://localhost:3001
  ✅ Remplir et sauvegarder un formulaire
  ✅ Vérifier les données en base
  ✅ Exporter les données (CSV/JSON)
  ✅ Déployer en production (Railway/Heroku)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 SUPPORT & QUESTIONS:
   Consultez les fichiers .md ou contactez l'équipe SENELEC

🎉 Vous êtes prêt! Lancez: npm start

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dernière mise à jour: 14 février 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF
