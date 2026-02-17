# 📊 GUIDE COMPLET - EXPORT DONNÉES & IMAGES

## 🎯 Vue d'ensemble

Vous avez 3 options pour exporter vos données de collecte avec les photos stockées en base de données:

| Option | Format | Images | Taille | Utilisation |
|--------|--------|--------|--------|-------------|
| **Fichiers Séparés** | CSV + dossier ./images | JPG séparés | ⭐⭐ Petite | ✅ **RECOMMANDÉE** |
| **Base64** | CSV unique | Encodées en texte | ⭐⭐⭐⭐⭐ Énorme | Articles, bases données |
| **CSV Simple** | CSV | Aucune (BD) | ⭐ Très petite | Analyse de données |

---

## 🚀 Démarrage Rapide

### Option 1️⃣ : Fichiers Séparés (Recommandée)

Les photos sont extraites en fichiers `.jpg` et le CSV contient les chemins.

```bash
# Lancer l'export
node export-with-images.js

# Résultat:
# exports/export-2026-02-17-14-30-45/
# ├── collectes_donnees.csv (contient les chemins)
# ├── images/
# │   ├── image_1_1.jpg
# │   ├── image_2_2.jpg
# │   └── ...
# ├── README.md (instructions)
# └── image_mapping.json (index des images)
```

**Avantages:**
- ✅ Fichiers faciles à manipuler
- ✅ Chemins utilisables directement dans Excel
- ✅ Compatible avec tous les outils
- ✅ Taille fichier raisonnée

**Utilisation en Excel/Sheets:**
```
1. Ouvrir collectes_donnees.csv
2. Copier-coller les chemins (colonne photo) dans un navigateur de fichiers
3. Ou ouvrir avec Excel: formule =IMAGE("./images/photo_1_1.jpg")
```

**Utilisation en Python:**
```python
import pandas as pd
from PIL import Image

df = pd.read_csv('collectes_donnees.csv')
# Ouvrir la première image
img = Image.open(df.iloc[0]['image_1'])
img.show()
```

---

### Option 2️⃣ : Base64 (Alternative)

Tout dans un seul fichier CSV - images encodées en base64.

```bash
node export-base64.js

# Résultat:
# exports/base64-export-2026-02-17-14-30-45/
# ├── collectes_donnees_base64.csv (⚠️ TRÈS VOLUMINEUX)
# ├── collectes_donnees_sans_images.csv (petit)
# └── FORMAT_BASE64.md
```

**Avantages:**
- ✅ Tout dans un seul fichier
- ✅ Peut être importé dans une base de données

**Inconvénients:**
- ❌ Fichier très volumineux (plusieurs GB possible)
- ❌ Difficile à ouvrir dans Excel
- ❌ Non recommandé pour la plupart des cas

**Utilisation en Python:**
```python
import pandas as pd
import base64
from PIL import Image
from io import BytesIO

df = pd.read_csv('collectes_donnees_base64.csv')

# Décoder une image base64
base64_str = df.iloc[0]['image_1_base64']
base64_str = base64_str.replace('data:image/jpeg;base64,', '')

image_data = base64.b64decode(base64_str)
img = Image.open(BytesIO(image_data))
img.show()
```

---

### Option 3️⃣ : CSV Simple (Sans images)

Juste les données, images restent dans PostgreSQL.

```bash
node export-csv-simple.js

# Résultat:
# exports/simple-export-2026-02-17-14-30-45/
# ├── collectes_donnees.csv (petit)
# ├── INFO.txt
# └── load_example.py
```

**Avantages:**
- ✅ Fichier très petit
- ✅ Compatible avec tous les outils
- ✅ Facile à analyser

**Inconvénients:**
- ❌ Pas d'accès aux images
- ❌ Besoin de la base de données pour les images

---

## 🎮 Menu Interactif

Vous pouvez utiliser le menu pour choisir l'option:

```bash
node export-menu.js
```

Cela ouvrira un menu interactif:
```
═══════════════════════════════════════════════════════
📊 OUTILS D'EXPORT - DONNÉES & IMAGES
═══════════════════════════════════════════════════════

🔤 SÉLECTIONNEZ UNE OPTION:

  1️⃣  Export Fichiers Séparés (RECOMMANDÉ)
  2️⃣  Export Base64
  3️⃣  Export CSV Simple
  4️⃣  Voir les exports précédents
  5️⃣  Importer des images
  0️⃣  Quitter
```

---

## 📖 Cas d'Usage Détaillés

### 💼 Cas 1: Analyser les données dans Excel

**Solution:** Export Fichiers Séparés

```bash
node export-with-images.js
```

1. Ouvrir `collectes_donnees.csv` dans Excel
2. La colonne `image_1` contient les chemins: `./images/image_1_1.jpg`
3. Dans Excel, créer une colonne avec: `=LIEN("./images/image_1_1.jpg")`
4. Ou utiliser: `=IMAGE("./images/image_1_1.jpg")`

---

### 🐍 Cas 2: Analyser en Python avec Pandas

**Solution:** CSV Simple (plus rapide) OU Fichiers Séparés (avec images)

```python
import pandas as pd
from PIL import Image
import os

# Charger les données
df = pd.read_csv('collectes_donnees.csv')

# Afficher les statistiques
print(f"Total de collectes: {len(df)}")
print(f"Régions: {df['region'].unique()}")

# Filtrer
df_dakar = df[df['region'] == 'Dakar']
print(f"Collectes à Dakar: {len(df_dakar)}")

# Afficher une image si elle existe
if pd.notna(df_dakar.iloc[0]['image_1']):
    img_path = df_dakar.iloc[0]['image_1']
    if os.path.exists(img_path):
        img = Image.open(img_path)
        img.show()
```

---

### 🗄️ Cas 3: Importer dans une base de données

**Solution 1:** Base64 (pour les BDs qui supportent BYTEA)
```bash
node export-base64.js
```

**Solution 2:** Fichiers Séparés + Lignes de commande
```bash
node export-with-images.js
psql -U postgres -d ma_bd -f import_script.sql
```

---

### 🌐 Cas 4: Créer un site web avec les photos

**Solution:** Fichiers Séparés

```html
<!DOCTYPE html>
<html>
<head>
    <title>Galerie de Collectes</title>
</head>
<body>
    <h1>📊 Collectes</h1>
    <div id="gallery"></div>
    
    <script>
        // Charger le CSV (avec papa-parse)
        Papa.parse('collectes_donnees.csv', {
            download: true,
            header: true,
            complete: function(results) {
                const gallery = document.getElementById('gallery');
                
                results.data.forEach(row => {
                    if (row.image_1) {
                        const img = document.createElement('img');
                        img.src = row.image_1; // Chemin relatif!
                        img.alt = row.commune;
                        gallery.appendChild(img);
                    }
                });
            }
        });
    </script>
</body>
</html>
```

---

### 📱 Cas 5: Excel avec images intégrées

**Meilleure approche:** Créer un script Excel VBA

```vba
' VBA Excel - Lier les images
Sub InsertImages()
    Dim row As Integer
    Dim imagePath As String
    Dim cell As Range
    
    row = 2 ' Commencer ligne 2 (après headers)
    Do Until Cells(row, 1).Value = ""
        imagePath = Cells(row, 11).Value ' Colonne K (image_1)
        Set cell = Cells(row, 12)
        
        If Dir(imagePath) <> "" Then
            ActiveSheet.Pictures.Insert(imagePath).Top = cell.Top
        End If
        row = row + 1
    Loop
End Sub
```

---

## 🔧 Configuration Avancée

### Exclure certaines colonnes de l'export

Éditer `export-with-images.js` ligne ~90:
```javascript
const excludeColumns = []; // Ajouter les colonnes à exclure
```

Exemple:
```javascript
const excludeColumns = ['observation', 'precision']; // Exclure ces colonnes
```

### Limiter à une région/partenaire

Éditer la requête SQL dans les scripts:
```javascript
// Au lieu de:
const result = await pool.query('SELECT * FROM collectes_donnees...');

// Faire:
const result = await pool.query(`
    SELECT * FROM collectes_donnees 
    WHERE region = 'Dakar'
    ORDER BY date_collecte DESC
`);
```

### Changer le format des images

Dans `export-with-images.js`, modifier:
```javascript
const imageFilename = `image_${row.id}_${++imageCount}.jpg`;
// Vers:
const imageFilename = `${row.commune}_${row.partenaire}.jpg`;
```

---

## 🐛 Dépannage

### ❌ "Aucune donnée trouvée"
- Vérifier que la base de données est remplie
- Vérifier la connexion PostgreSQL
- Vérifier les variables `DB_*` dans `.env`

### ❌ "Images non trouvées en CSV"
- Les images peuvent être NULL dans la BD
- Vérifier avec: `SELECT COUNT(*) FROM collectes_donnees WHERE image_1 IS NOT NULL`
- Les images vides sont remplacées par `''` ou `[Pas d'image]`

### ❌ "Fichier CSV très volumineux"
- Vous utilisez probablement l'export Base64
- Utiliser plutôt: `node export-with-images.js`
- Ou limiter à une région: Voir section "Configuration Avancée"

### ❌ "Erreur de permission fichier"
- Vérifier les droits: `chmod 755 export-*.js` (Linux/Mac)
- Relancer dans cmd (Windows): `node export-with-images.js`

---

## 📊 Fichiers Créés

Chaque export crée un dossier avec:

```
exports/export-2026-02-17-14-30-45/
├── collectes_donnees.csv          ← Fichier principal
├── README.md                       ← Explications
├── image_mapping.json              ← Index des images
├── images/                         ← Dossier des images
│   ├── image_1_1.jpg
│   ├── image_2_2.jpg
│   └── ...
└── [autres fichiers d'info]
```

---

## 🔐 Sécurité & Confidentialité

- **Ne partagez pas les fichiers avec des adresses personnelles**
- **Attention aux mots de passe** dans `.env` - Ne pas commiter!
- **RGPD**: Si vous avez des données sensibles, restreindre l'accès
- **Backup**: Les exports ne modifient pas la BD, c'est sûr

---

## 💡 Bonnes Pratiques

1. ✅ **Toujours exporter avant modification** - Avoir une sauvegarde
2. ✅ **Tester d'abord** - Exporter 10 lignes avant d'exporter tout
3. ✅ **Nommer les exports** - Ajouter la date dans le nom
4. ✅ **Documenter** - Garder le README.md avec les données
5. ✅ **Versionner** - Si possible, garder les dossiers export anciens

---

## ❓ Questions Fréquentes

**Q: Les images sont dans PostgreSQL, comment les retrouver?**
A: Utiliser `SELECT image_1 FROM collectes_donnees LIMIT 1` - Si NULL, pas d'image.

**Q: Puis-je exporter que'certaines colonnes?**
A: Éditer le SQL dans les scripts - Voir "Configuration Avancée"

**Q: Exporter directement depuis PostgreSQL?**
A: Utiliser pgAdmin: `\COPY (SELECT ...) TO 'fichier.csv'`

**Q: Importer à nouveau dans la BD?**
A: Voir `import-*.js` (à créer)

**Q: Comment ouvrir les fichiers sur Mac/Linux?**
A: Même chose: `node export-with-images.js` fonctionne partout

---

## 📞 Support

Pour toute question:
1. Consulter les fichiers README.md dans les dossiers d'export
2. Vérifier le `.env` et les connexions BD
3. Vérifier que PostgreSQL est en cours d'exécution

---

**Dernière mise à jour:** 17 février 2026
