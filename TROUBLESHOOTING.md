# 🛠️ GUIDE DE DÉPANNAGE - Erreur JSON et Sauvegarde Photo

## 🚨 Symptôme: "Erreur: Unexpected token 'R', Ressource not valid JSON"

### Qu'est-ce que cela signifie?
Le serveur a reçu la requête, mais il a rejeté avec une erreur (400/500/etc.), et il a **renvoyé du HTML au lieu du JSON**. Le navigateur essaie de parser cet HTML comme du JSON, ce qui échoue au premier caractère 'R' (probablement "Ressource" ou "Route").

### 🔍 Diagnostic rapide

**Étape 1: Ouvrir la console du navigateur**
```
Windows/Linux: F12 ou Ctrl+Shift+I
Mac: Cmd+Option+I
Safari: Développement → Console
```

**Étape 2: Onglet "Console"**
- Chercher les messages de log 📊 (bleu et gris)
- Noter les valeurs exactes de taille

**Étape 3: Onglet "Network"**
- Lancer une sauvegarde
- Chercher requête "collecte"
- Cliquer dessus → onglet "Response"
- Vérifier le contenu (doit être JSON, pas HTML)

---

## ✅ Solution: Appliquer la compression photo

### Vérification rapide

**Dans la console du navigateur, après avoir capturé une photo:**
```javascript
// Vous devez voir:
✅ Photo capturée (150KB)
// OU
✅ Photo capturée (180KB)
// NON PAS:
❌ Erreur: Canvas not supported
❌ Photo capturée (5300KB)  // Trop grand!
```

**Avant de sauvegarder:**
```javascript
// Vous devez voir:
📦 Taille totale à envoyer: 0.2 MB
// ET:
✅ Taille acceptée
```

### Si vous voyez ces erreurs:

#### Erreur 1: "Les données sont trop volumineuses"
```
❌ Erreur: Les données sont trop volumineuses: 25.3MB
```
**Cause**: La photo n'est pas compressée
**Solution**: 
1. Vérifier que `capturerPhoto()` appelle `toDataURL('image/jpeg', 0.7)`
2. Recharger la page: `Ctrl+Shift+R`
3. Retester: Capturer photo → Console doit montrer ~150KB

#### Erreur 2: "Canvas not supported"
```
❌ Erreur: Canvas not supported by this browser
```
**Cause**: Navigateur très ancien ou JS d'erreur
**Solution**:
1. Utiliser navigateur moderne (Chrome 90+, Safari 14+, Firefox 88+)
2. Sur iPhone: Utiliser Safari (pas Chrome)
3. Sur Android: Utiliser Chrome (pas Firefox)

#### Erreur 3: Pas de message "Photo capturée"
```
// Rien ne s'affiche après capture
```
**Cause**: Permissions de caméra refusées
**Solution**:
1. Vérifier les permissions:
   ```
   iPhone: Réglages → Confidentialité → Caméra → [App]
   Android: Réglages → Applications → [App] → Permissions → Caméra
   ```
2. Autoriser via popup du navigateur
3. Relancer app

---

## 🔧 Diagnostiquer le serveur

### Vérifier que le serveur démarre

**Étape 1: Terminal** (ouvrir dans VS Code)
```
Ctrl+` (backtick)
OU
Terminal → New Terminal
```

**Étape 2: Aller au dossier**
```bash
cd "c:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG"
```

**Étape 3: Lancer le serveur**
```bash
npm start
```

**Étape 4: Vérifier le démarrage**
```
✅ Correct: 
   Serveur lancé sur port 3001
   Connecté à PostgreSQL
   
❌ Erreur "EADDRINUSE": 
   Port 3001 déjà utilisé
   → Exécuter: npm run kill-port
   → Relancer: npm start
   
❌ Erreur "connection refused":
   PostgreSQL non lancé
   → Vérifier: services.msc → PostgreSQL doit être "Running"
   → Ou: psql -U postgres (doit ouvrir Terminal PostgreSQL)
```

### Tester l'API directement

**Étape 1: Nouveau terminal**

**Étape 2: Exécuter le test**
```bash
node test-save-with-photo.js
```

**Étape 3: Vérifier le résultat**
```
✅ SUCCÈS:
   Status: 201 Created
   JSON valide avec "id": "X"

❌ ERREUR:
   Status: 400/500
   Logs du serveur montrent l'erreur exacte
```

---

## 📊 Vérifier les tailles

### Pour voir exactement ce qui est envoyé

**Navigateur (Console)**
```javascript
// Au moment de sauvegarder, vous verrez:
📨 Données formatées pour envoi (photo size: 180 KB)
📦 Taille totale à envoyer: 0.2 MB
```

**Serveur (Terminal)**
```
Lors de la réception:
📨 POST /api/collecte reçue
📦 Content-Length: 0.2 MB
📷 Photo convertie en buffer: 136 KB
```

### Plus c'est petit, mieux c'est:
- **< 1 MB**: Parfait ✅
- **1-5 MB**: Acceptable
- **5-10 MB**: Risqué (peut timeout sur 4G)
- **> 10 MB**: ❌ Va échouer

---

## 🌐 Problèmes de réseau

### Symptôme: "Failed to fetch"
```
❌ Erreur: Failed to fetch
```

**Causes possibles:**
1. **Serveur pas lancé** → `npm start`
2. **URL incorrecte** → Vérifier qu'elle commence par `http://localhost:3001`
3. **WiFi Down** → Vérifier accès Internet
4. **CORS bloqué** → Vérifier serveur répond (test-save-with-photo.js)

### Symptôme: "NetworkError"
```
❌ Erreur: NetworkError when attempting to fetch resource
```

**Sur mobile (iPhone/Android):**
1. WiFi vs mobile data: Essayer WiFi
2. Vérifier que URL est accessible:
   - Si localhost: `http://192.168.x.x:3001` (IP du PC)
   - Si HTTPS en prod: Certificat valide

### Symptôme: Requête très lente ou timeout
```
// Attente longue...
❌ Erreur: [Pas de réponse après 30s]
```

**Causes:**
1. **Photo trop grande** → Compression résolue (vérifier size)
2. **Réseau lent** → Essayer WiFi 5GHz au lieu de 4G
3. **Base de données lente** → Vérifier serveur PostgreSQL (Performance tab)

---

## 🐘 Problèmes PostgreSQL

### Vérifier que PostgreSQL fonctionne

**Méthode 1: Services Windows**
```
Ctrl+R → services.msc
Chercher "postgresql-x64-XX"
Doit être "Running" et "Automatic"
```

**Méthode 2: Test directement**
```bash
psql -U postgres
# Doit retourner: postgres=#
# Sinon: "connection refused" = PostgreSQL arrêté
```

### Tester la base de données

**Terminal PostgreSQL**
```sql
\c dimentionnement_SNG
\dt
-- Doit montrer: "collectes_donnees" table
SELECT COUNT(*) FROM collectes_donnees;
-- Doit retourner: count = X
```

### Voir les données sauvegardées

**Si vous voulez voir les photos:**
```sql
-- Pour voir les IDs et dates
SELECT id, DATE(date_collecte), OCTET_LENGTH(photo) as photo_size
FROM collectes_donnees
ORDER BY date_collecte DESC
LIMIT 10;

-- Pour extraire une photo
\lo_list
-- Affiche toutes les "large objects"
SELECT photo FROM collectes_donnees WHERE id = 3 \g | xxd | head -5
-- Affiche les premiers bytes de la photo (doit commencer par FF D8 pour JPEG)
```

---

## ⚡ Troubleshooting rapide

| Symptôme | Cause | Solution |
|----------|-------|----------|
| "Unexpected token 'R'" | Photo trop grande | Vérifier "Photo capturée (XXX KB)" < 200KB |
| "Les données trop volumineuse" | Requête > 25MB | Réduire photo ou observation |
| "Failed to fetch" | Serveur pas là | `npm start` dans Terminal |
| "Aucune photo capturée" | Permissions | Vérifier caméra autorisée |
| JSON bonne réponse mais localStorage plein | Stockage local rempli | Vider localStorage (F12 → Application) |
| "Erreur serveur 500" | Erreur PostgreSQL | Voir logs du serveur avec 🔴 symboles |
| Pas de "Photo capturée" sur canvas | Canvas crashé | F12 → Console pour lire l'erreur |
| Requête prend 30+ secondes | Timeout réseau | Essayer WiFi au lieu de 4G |

---

## 📝 Fichiers de test utiles

### Pour tester sans app:
```bash
# Test photo compressée
node test-save-with-photo.js

# Test API brut
node test-api.js

# Plus tard: Vérifier taille photos
SELECT OCTET_LENGTH(photo) as size_bytes FROM collectes_donnees LIMIT 10;
```

---

## 🎯 Résumé: Commandes essentielles

```bash
# Redémarrer serveur
npm start

# Tester l'API
node test-save-with-photo.js

# Vérifier port 3001
netstat -ano | findstr ":3001"

# Voir logs PostgreSQL
SELECT * FROM collectes_donnees ORDER BY id DESC LIMIT 1;

# Effacer cache navigateur
## Firefox: Ctrl+Maj+Del
## Chrome: Ctrl+Maj+Suppr
## Safari: Développement → Vider les caches

# Hard refresh
## Windows: Ctrl+Maj+R
## Mac: Cmd+Maj+R
```

---

## 🆘 Si vous avez toujours un problème

**Collectez ces infos et montrez-les:**

1. **Message d'erreur exact** (F12 → Console)
2. **Tab Network → Request POST /api/collecte:**
   - Status code (200/201/400/500/etc.)
   - Headers → Content-Type
   - Response → Début du contenu
3. **Logs du serveur** (Terminal npm start) - les 5-10 dernières lignes
4. **Taille de la photo:** 
   - Message "Photo capturée (XXX KB)"
   - Ou: `(dataToSend.photo.length/1024).toFixed(0)` dans console
5. **Système d'exploitation et navigateur:**
   - Ex: "iPhone 12 / Safari", "Windows 10 / Chrome", etc.

**Avec ces infos, on pourra diagnostiquer instantanément!** 🔍

---

## ✅ Checklist avant de me contacter

- [ ] Vérifier "Photo capturée" affiche taille < 200KB
- [ ] Vérifier "Taille totale" < 20MB
- [ ] Tester: `node test-save-with-photo.js` → ID retourné?
- [ ] Terminal `npm start` → Aucune erreur rouge?
- [ ] PostgreSQL marche: `psql -U postgres`
- [ ] Cache navigateur vidé (Ctrl+Maj+R)
- [ ] Hard refresh de la PWA (Settings → Clear all data)
- [ ] Port 3001 libéré: `netstat -ano | findstr ":3001"`

Cochez tout ✅ et essayez à nouveau!

