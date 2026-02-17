
# 🖼️ EXPORT PHOTOS & DONNÉES - DÉMARRAGE RAPIDE

## ⚡ En 3 étapes

### 1️⃣ Vérifier que tout fonctionne
```bash
node test-export-setup.js
```

### 2️⃣ Choisir votre format d'export

**Option A: Fichiers Séparés** ✅ **RECOMMANDÉE**
```bash
node export-with-images.js
```
→ CSV + dossier images/ (le meilleur choix!)

**Option B: Base64** (tout dans le CSV)
```bash
node export-base64.js
```
→ ⚠️ Fichier très volumineux

**Option C: CSV Simple** (sans images)
```bash
node export-csv-simple.js
```
→ Données seules, fichier petit

**Option D: Menu Interactif**
```bash
node export-menu.js
```
→ Choisir l'option dans un menu

### 3️⃣ Utiliser vos données

Les fichiers sont créés dans `exports/export-TIMESTAMP/`

---

## 🎯 Répondre à votre question

### Vous aviez: "binary data" dans le CSV

**Problème:** Les photos BYTEA deviennent "binary data" en CSV

**Solutions:**

| Solution | Comment | Photos |
|----------|---------|--------|
| **Fichiers Séparés** | `node export-with-images.js` | Fichiers JPG |
| **Base64** | `node export-base64.js` | Texte encodé |
| **Sans images** | `node export-csv-simple.js` | Aucune |

---

## 📊 Exemple: Fichiers Séparés

Voici ce qui se passe:

```
AVANT:
├── collectes_donnees (table PostgreSQL)
│   ├── id: 1
│   ├── commune: "Dakar"
│   └── image_1: [BYTEA - 500 KB] ← BINAIRE!

APRÈS (export-with-images.js):
├── exports/export-2026-02-17/
│   ├── collectes_donnees.csv ← Chemin de l'image
│   ├── images/
│   │   └── image_1_1.jpg ← Image extraite!
│   └── README.md
```

**Dans le CSV:**
```
id,commune,image_1
1,Dakar,./images/image_1_1.jpg ← Utilisable!
```

---

## ✨ Prochaines étapes

1. Exécuter: `node test-export-setup.js`
2. Choisir l'export (probablement Option A)
3. Ouvrir le CSV dans Excel/Sheets
4. Lire EXPORT_GUIDE.md pour plus de détails

---

## 📚 Fichiers importants

- `EXPORT_GUIDE.md` - Guide complet (55 pages)
- `export-with-images.js` - Export fichiers séparés (RECOMMANDÉ)
- `export-base64.js` - Export base64
- `export-csv-simple.js` - Export sans images
- `export-menu.js` - Menu interactif
- `test-export-setup.js` - Vérifier le setup

---

## ❓ FAQ Rapide

**Q: Dois-je utiliser les fichiers séparées?**
A: ✅ OUI, c'est le meilleur choix.

**Q: Les images seront perdues?**
A: ❌ NON, elles restent dans PostgreSQL et sont copiées en fichiers.

**Q: Mon CSV reste énorme?**
A: ✅ Utilisez "Fichiers séparés", pas base64.

**Q: Je peux ouvrir dans Excel?**
A: ✅ OUI, le CSV s'ouvre normalement dans Excel.

**Q: Les chemins des images marchent?**
A: ✅ OUI, les fichiers sont dans le même dossier que le CSV.

---

## 🚀 COMMANDE UNIQUE POUR DÉMARRER

```bash
# 1. Vérifier
node test-export-setup.js

# 2. Exporter
node export-with-images.js

# 3. Utiliser
# Ouvrir: exports/export-TIMESTAMP/collectes_donnees.csv
```

---

**Version:** 1.0 - 17 février 2026
