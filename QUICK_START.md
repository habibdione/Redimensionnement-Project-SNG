# 📱 GUIDE DE DÉMARRAGE RAPIDE - SAUVEGARDE AVEC PHOTO

## ✅ Vérification rapide (2 minutes)

```bash
# Terminal dans VS Code (Ctrl+`)
cd "c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"

# 1. Vérifier la configuration
node verify-setup.js
# Résultat attendu: ✅ 27/27 tests réussis

# 2. Vérifier l'API
node test-save-with-photo.js
# Résultat attendu: ✅ TEST RÉUSSI - Record ID: 3

# 3. Lancer le serveur
npm start
# Résultat attendu: Serveur lancé sur port 3001
```

---

## 🚀 Utiliser l'application

### 1. Accéder à l'application

**Options:**
```
Option A: GitHub Pages (en ligne)
URL: https://habibdione.github.io/Redimensionnement-Project-SNG/

Option B: Localhost (développement)
URL: http://localhost:5000 ou http://localhost:3000
(Selon où votre PWA est servie)

Option C: Direct depuis fichier
Ouvrir: c:\DIMENSIONNEMENT\...\index.html dans le navigateur
```

### 2. Capturer une photo

1. **Cliquer le bouton**: "📷 Capturer la photo"
2. **Autoriser la caméra**: Si demandé (iOS/Android)
3. **Ajuster la vue**: Cadrer le sujet
4. **Capturer**: Bouton "Take Photo" ou équivalent
5. **Accepter**: Cliquer "Use Photo"

**Important:** Dans la console du navigateur (F12), vous devez voir:
```
✅ Photo capturée (150KB)
```

### 3. Remplir le formulaire

Remplissez tous les champs:
- **Partenaire**: ex "SONAGED"
- **Région**: Sélectionner dans la liste
- **Département**: Auto-rempli selon région
- **Commune**: Auto-rempli selon département
- **Type d'activité**: Plusieurs choix possibles
- **Adresse**: Texte libre
- **Autres champs**: Selon votre besoin

**Note**: Les champs Latitude/Longitude se remplissent automatiquement
```
Cliquer le bouton: 🗺️ Obtenir ma géolocalisation
ou
💡 Utiliser GPS du navigateur
```

### 4. Afficher le résumé

Après avoir rempli tous les champs:
1. **Cliquer**: "📋 Afficher le résumé"
2. **Vérifier**: Les données affichées (dont la photo)
3. **Corriger**: Si besoin, cliquer "Éditer"

**Format du résumé:**
```
📍 Localisation:      Latitude, Longitude, Précision
🏙️  Lieu:              Région, Département, Commune
📦 Gestion des déchets: Bacs 240L, Bacs 660L, etc.
👥 Ressources:        Personnel, Équipements
📅 Collecte:          Fréquence, Rotation
📝 Observations:      Texte libre
📷 Photo:             [Affichée en aperçu]
```

### 5. Sauvegarder

1. **Vérifier** le résumé est correct
2. **Cliquer**: "💾 Sauvegarder en base de données"
3. **Attendre**: Les logs de la console montrent:
   ```
   📨 Données formatées pour envoi (photo size: 150 KB)
   📦 Taille totale à envoyer: 0.2 MB
   ✅ Taille acceptée
   📡 Réponse serveur status: 201
   ✅ Réponse du serveur: {"success": true}
   ```
4. **Succès**: Message "✅ Données sauvegardées en base de données avec succès!"

---

## 📊 Ce qu'il se passe derrière

### Côté navigateur (Frontend):

```
1. Capturer photo via caméra
   ↓
2. Canvas redimensionne à max 800x600 pixels
   ↓
3. Compresse en JPEG 70% de qualité
   ↓
4. Conversion en base64 (texte)
   ↓
5. Taille: 100-200 KB typiquement
   ↓
6. Inclure dans objet JSON avec autres données
   ↓
7. Envoyer via fetch() POST à http://localhost:3001/api/collecte
```

### Côté serveur (Backend):

```
1. Recevoir requête POST
   ↓
2. Logger: "📨 POST /api/collecte reçue"
   ↓
3. Extraire base64 de la photo
   ↓
4. Convertir base64 → Buffer binaire
   ↓
5. Compiler les données SQL
   ↓
6. Insérer dans PostgreSQL table "collectes_donnees"
   ↓
7. La colonne "photo" (BYTEA) reçoit le buffer binaire
   ↓
8. Retourner: 201 Created + JSON avec l'ID
```

### Côté base de données (PostgreSQL):

```
collectes_donnees
├── id: 3
├── partenaire: "SONAGED"
├── region: "Dakar"
├── ...
├── photo: [BYTEA - données binaires JPEG]
├── date_collecte: 2026-02-12T22:48:32Z
└── ...
```

---

## 🔍 Vérifier les données sauvegardées

### Via SQLTools (VS Code):

```sql
-- Voir les derniers enregistrements
SELECT id, date_collecte, partenaire, region
FROM collectes_donnees
ORDER BY id DESC
LIMIT 5;

-- Voir la taille des photos
SELECT id, LENGTH(photo) as photo_size_bytes
FROM collectes_donnees
WHERE photo IS NOT NULL
ORDER BY id DESC
LIMIT 5;

-- Exporter une photo (avancé)
\lo_list
-- Retourne les Object IDs des photos
```

### Via terminal psql:

```bash
psql -U postgres -d dimentionnement_SNG

# Afficher les colonnes
\d collectes_donnees

# Compter les enregistrements
SELECT COUNT(*) FROM collectes_donnees;

# Voir le dernier
SELECT * FROM collectes_donnees ORDER BY id DESC LIMIT 1;

# Quitter
\q
```

---

## ⚠️ Problèmes courants

### "❌ Les données sont trop volumineuses"
```
Cause: Photo non compressée
Solution: Recharger page (Ctrl+Maj+R) et retester
```

### "❌ Erreur: Unexpected token 'R'"
```
Cause: Photo trop grande avant compression
Solution: Vérifier console affiche "Photo capturée (150 KB)"
          Si > 1MB: hard refresh + relancer serveur
```

### "❌ Erreur de caméra"
```
Cause: Permissions non autorisées
Solution: 
  iPhone: Réglages → Confidentialité → Caméra → [App]
  Android: Réglages → Applications → [App] → Permissions
```

### "Pas de réponse du serveur"
```
Cause: Serveur pas lancé ou port occupé
Solution: 
  1. npm kill-port  (libérer le port si occupé)
  2. npm start      (relancer)
```

---

## 📋 Checklist avant de sauvegarder

- [ ] ✅ Photo capturée (XXX KB) - doit être < 200KB
- [ ] 📍 Localisation obtenue (latitude + longitude)
- [ ] 🏙️ Lieu sélectionné (région, département, commune)
- [ ] 📝 Description remplie (adresse, observations)
- [ ] 📊 Résumé affiché avec photo
- [ ] 💾 Serveur lancé (npm start)
- [ ] 🌍 Connexion Internet active (si en ligne)

---

## 🎯 Résumé des commandes essentielles

| Commande | Résultat |
|----------|----------|
| `npm start` | Lance serveur port 3001 |
| `npm run kill-port` | Libère port 3001 si bloqué |
| `node verify-setup.js` | Vérifie configuration complète |
| `node test-save-with-photo.js` | Teste API avec photo |
| `node test-api.js` | Teste API sans photo |
| `Ctrl+` ` | Ouvre terminal dans VS Code |
| `Ctrl+Shift+R` | Hard refresh navigateur |
| `F12` | Ouvre console navigateur |

---

## 💡 Optimisation performance

### Si la sauvegarde est lente:

1. **Vérifier la qualité de compression:**
   ```javascript
   // Dans index.html, fonction capturerPhoto
   // Réduire de 0.7 à 0.5 pour plus de compression
   canvas.toDataURL('image/jpeg', 0.5)  // Qualité 50%
   ```

2. **Vérifier la conexión réseau:**
   - Essayer WiFi au lieu de 4G
   - Vérifier vitesse: `speedtest.net`

3. **Vérifier PostgreSQL:**
   ```sql
   -- Voir les requêtes lentes
   SELECT query, calls, mean_time FROM pg_stat_statements 
   WHERE mean_time > 100 
   ORDER BY mean_time DESC;
   ```

---

## 🚀 Prochaines étapes

1. **✅ Vérifier:** `node verify-setup.js` → 27/27 tests
2. **✅ Tester:** `node test-save-with-photo.js` → ✅ TEST RÉUSSI
3. **✅ Lancer:** `npm start` → Serveur actif
4. **✅ Capturer:** Photo < 200KB
5. **✅ Sauvegarder:** Status 201 retourné
6. **✅ Vérifier:** Données en base de données
7. **✅ Tester sur iPhone:** Avec vraie caméra et GPS

---

## 📞 Support

Si vous avez des problèmes:

1. **Consulter:** `TROUBLESHOOTING.md` - Guide de dépannage complet
2. **Vérifier:** Console navigateur (F12) - Tous les logs détaillés
3. **Consulter:** Terminal serveur (`npm start`) - Logs backend
4. **Exécuter:** `node verify-setup.js` - Auto-diagnostic

**Bonne utilisation! 🎉**
