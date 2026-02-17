📋 GUIDE DE CONFIGURATION - SYNCHRONISATION EXCEL
═════════════════════════════════════════════════════════════════════════════════

## 🎯 RÉSUMÉ RAPIDE

Vos nouvelles collectes s'insèrent AUTOMATIQUEMENT dans:
1. ✅ La base de données PostgreSQL
2. ✅ Le fichier Excel DIMENSIONNEMENT.xlsx des Partenaires

Pas d'action manuelle requise !

═════════════════════════════════════════════════════════════════════════════════

## 📦 INSTALLATION (DÉJÀ FAIT ✓)

Les packages suivants ont été installés:
├── xlsx@0.18.5+         (Gestion des fichiers Excel)
├── express              (Déjà installé)
├── pg                   (PostgreSQL, déjà installé)
└── dotenv               (Déjà installé)

Vérifier l'installation:
```bash
npm list xlsx
```

═════════════════════════════════════════════════════════════════════════════════

## 🚀 DÉMARRAGE

### Option 1: Clic Double (Plus Simple)
Double-cliquez sur: `START_WITH_EXCEL_SYNC.bat`

Résultat:
✅ Le serveur démarre
✅ Excel est surveillé
✅ Toutes les collectes se synchronisent automatiquement

### Option 2: Terminal (Plus de Contrôle)
```powershell
npm start
```

### Option 3: Mode Debug
```powershell
npm run start:debug
```

═════════════════════════════════════════════════════════════════════════════════

## 🔄 SYNCHRONISATION MANUELLE

Si besoin de forcer une synchronisation:

### Une nouvelle collecte spécifique:
```javascript
// Dans index.html, après la sauvegarde
const collecte = {
    region: "Ziguinchor",
    commune: "Oussouye",
    site: "Bureau",
    // ... autres champs
};
// Synchronisation automatique ✅ (pas besoin de code)
```

### Toutes les collectes (base vers Excel):
```bash
npm run sync:excel
```

ou

```bash
node export-excel-sync.js
```

### Tester le système:
```bash
npm run test:excel
```

═════════════════════════════════════════════════════════════════════════════════

## 📍 LOCALISATION DU FICHIER EXCEL

Chemin OneDrive:
```
c:\Users\30100-23-SNG\OneDrive - sonaged\ESPACE DE TRAVAIL\SONAGED\
COMMUNES D'INTERVENTION\SUPPORT\DOSSIER DR\DIMENSIONNEMENT\
DIMENSIONNEMENT.xlsx
```

✅ Si vous modifiez ce chemin → Mettre à jour `export-excel-sync.js` ligne 10

═════════════════════════════════════════════════════════════════════════════════

## 📊 FLUX EN TEMPS RÉEL

Quand l'userId sauvegarde:

┌─────────────────────────────────────────┐
│ 1. Utilisateur clique "SAUVEGARDER"     │
└────────────────┬────────────────────────┘
                 │ POST /api/collecte
                 ▼
┌─────────────────────────────────────────┐
│ 2. Données + Photo envoyées             │
└────────────────┬────────────────────────┘
                 │ INSERT collectes_donnees
                 ▼
┌─────────────────────────────────────────┐
│ 3. Stored in PostgreSQL ✅              │
└────────────────┬────────────────────────┘
                 │ Appel async
                 ▼
┌─────────────────────────────────────────┐
│ 4. Réponse 201 au navigateur (RAPIDE)   │
└────────────────┬────────────────────────┘
                 │ (parallèlement)
                 ▼
┌─────────────────────────────────────────┐
│ 5. Synced to Excel (arrière-plan)       │
│    - Lecture du fichier                 │
│    - Ajout nouvelle ligne               │
│    - Écriture dans Excel                │
└─────────────────────────────────────────┘
           Résultat: ✅ Ligne Excel

═════════════════════════════════════════════════════════════════════════════════

## 🔍 MONITORING

### Voir les logs du serveur:
```bash
# Démarrer
npm start

# Logs attendus:
✅ Base de données initialisée
✅ Service de synchronisation Excel activé
✅ Synchronisation périodique activée (1 heure)
```

### Vérifier les collectes en base:
```bash
# Dans pgAdmin ou psql:
SELECT COUNT(*) FROM collectes_donnees;
```

### Vérifier le fichier Excel:
```bash
# Ouvrir le fichier (OneDrive)
# Vérifier que les dernières collectes y sont
```

═════════════════════════════════════════════════════════════════════════════════

## ⚠️ TROUBLESHOOTING

### Problème: "Port 3001 déjà utilisé"
```bash
# Solution: Attendre 30s et relancer
# Ou: changer le port dans .env
PORT=3002
npm start
```

### Problème: "Fichier Excel introuvable"
```bash
✅ Vérifier le chemin OneDrive
✅ Vérifier que OneDrive est synchronisé
✅ Mettre à jour EXCEL_PATH dans export-excel-sync.js
```

### Problème: "PostgreSQL non accessible"
```bash
✅ Vérifier que PostgreSQL est en cours d'exécution
✅ Vérifier les identifiants dans .env
✅ Exécuter: pgAdmin pour tester
```

### Problème: "Excel verrouillé lors de la synchro"
```bash
✅ Fermer le fichier Excel avant
✅ Attendre que la synchro finisse (2-3s)
```

### Logs: Voir détails de chaque sync
```bash
# Terminal pendant que serveur tourne:
# [Vous verrez]:
# 📊 Nouvelle collecte créée: Bureau Commercial
# ✅ Synchronisée vers Excel
```

═════════════════════════════════════════════════════════════════════════════════

## 📋 FICHIERS MODIFIÉS

✅ export-excel-sync.js      → Module de synchronisation (CRÉÉ)
✅ sync-service.js            → Service d'intégration (CRÉÉ)
✅ test-excel-sync.js         → Tests (CRÉÉ)
✅ server.js                  → Intégration automate (MODIFIÉ)
✅ package.json               → Scripts npm (MODIFIÉ)
✅ START_WITH_EXCEL_SYNC.bat → Démarrage rapide (CRÉÉ)

═════════════════════════════════════════════════════════════════════════════════

## 🎓 COMPRENDRE LE SYSTÈME

### Architecture

```
App Web (index.html)
    ↓ POST /api/collecte (données + photo)
    ↓
PostgreSQL (collectes_donnees)
    ↓ ← Auto-triggered
    ↓
sync-service.js (onCollecteCreated)
    ↓
export-excel-sync.js
    ├─ formatDataForExcel()  → Convertir format
    ├─ readExcelFile()       → Lire feuille
    ├─ writeExcelFile()      → Écrire fichier
    └─ addCollecteToExcel()
    ↓
DIMENSIONNEMENT.xlsx (OneDrive)
```

### Pourquoi automatique?

1. **Pas d'oublis** - Les données se synchro toujours
2. **Temps réel** - Chaque nouvelle entrée s'ajoute immédiatement
3. **Zéro intervention** - Aucune action utilisateur requise
4. **Transparent** - L'utilisateur ne voit rien (ça se fait en arrière-plan)

═════════════════════════════════════════════════════════════════════════════════

## 🔧 CONFIGURATION AVANCÉE (OPTIONNEL)

### Changer l'intervalle de synchronisation périodique:

Dans `server.js`, chercher:
```javascript
syncService.startPeriodicSync(3600000); // 1 heure
```

Valeurs courantes:
- 60000      = 1 minute
- 300000     = 5 minutes
- 3600000    = 1 heure (par défaut)
- 86400000   = 1 jour

### Désactiver la synchronisation périodique:

Commentez la ligne dans `server.js`:
```javascript
// syncService.startPeriodicSync(3600000);
```

### Exporter aussi les photos:

Modifiez `export-excel-sync.js` pour inclure les chemins d'image:
```javascript
photo_path: value.photoPath || `./exports/photo_${value.id}.jpg`
```

═════════════════════════════════════════════════════════════════════════════════

## ✅ CHECKLIST DE PRODUCTION

- [x] xlsx installé
- [x] export-excel-sync.js créé
- [x] sync-service.js créé
- [x] server.js modifié (auto-sync)
- [x] Test réussi (test-excel-sync.js)
- [x] 8 collectes synchronisées dans Excel ✅
- [x] Scripts npm ajoutés
- [x] Batch de démarrage créé
- [x] Documentation complète

Statut: ✨ PRÊT POUR PRODUCTION

═════════════════════════════════════════════════════════════════════════════════

## 📞 SUPPORT

En cas de problème:

1. Vérifier les logs du serveur (npm start)
2. Lancer le test: npm run test:excel
3. Consulter: EXCEL_SYNC_README.md (documentation détaillée)
4. Vérifier: CONFIGURATION_EXCEL.md (ce fichier)

═════════════════════════════════════════════════════════════════════════════════

Created: 2026-02-17
Version: 1.0.0 - Production Ready ✅
