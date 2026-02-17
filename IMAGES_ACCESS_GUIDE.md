# 🖼️ GUIDE D'ACCÈS AUX IMAGES COLLECTÉES

## 📸 Images Réelles Collectées

Vous disposez de **8 images réelles** des sites de collecte dans la région de Ziguinchor.

### 📍 Localisation des images

```
exports/export-2026-02-17T18-16-04/
├── collectes_donnees.csv          ← Données complètes
├── galerie.html                   ← Galerie interactive (ouvrir dans navigateur)
├── images_metadata.json           ← Métadonnées JSON complètes
├── images/                        ← Images brutes
│   ├── photo_12_1.jpg (26.57 KB) - Oussouye
│   ├── photo_11_2.jpg (37.83 KB) - Diembéring
│   ├── photo_10_3.jpg (21.96 KB) - Ziguinchor
│   ├── photo_9_4.jpg (15.34 KB)  - Niaguis
│   ├── photo_8_5.jpg (38.21 KB)  - Ziguinchor
│   ├── photo_7_6.jpg (41.54 KB)  - Ziguinchor
│   ├── photo_6_7.jpg (31.24 KB)  - Ziguinchor
│   └── photo_5_8.jpg (52.05 KB)  - Ziguinchor
└── images_organized/              ← Images organisées par région
    └── ziguinchor/
        ├── 12_Oussouye.jpg
        ├── 11_Diembéring.jpg
        ├── 10_Ziguinchor.jpg
        └── ... (8 images)
```

---

## 🎯 Accès aux Images

### Option 1️⃣: Galerie Interacive (Facile)

Ouvrez simplement le fichier HTML:

```bash
# Windows
start exports\export-2026-02-17T18-16-04\galerie.html

# Mac/Linux
open exports/export-2026-02-17T18-16-04/galerie.html
```

**Avantages:**
- ✅ Interface graphique belle
- ✅ Cliquez pour zoomer
- ✅ Voir toutes les infos (commune, région, partenaire)
- ✅ Pas besoin de terminal

---

### Option 2️⃣: Chemin Relatif (CSV + Images)

Dans le fichier `collectes_donnees.csv`:

```
Colonne "photo":
./images/photo_12_1.jpg
./images/photo_11_2.jpg
./images/photo_10_3.jpg
... etc
```

**Utilisation:**

**Python:**
```python
import pandas as pd
from PIL import Image

df = pd.read_csv('collectes_donnees.csv')

# Afficher la première image
img_path = df.iloc[0]['photo']  # ./images/photo_12_1.jpg
img = Image.open(img_path)
img.show()

# Ou sauvegarder
img.save(f"export_{df.iloc[0]['id']}.jpg")
```

**Excel/Google Sheets:**
```
1. Ouvrir collectes_donnees.csv
2. Copier le chemin de la colonne "photo"
   Ex: ./images/photo_12_1.jpg
3. Coller dans le navigateur de fichiers
4. Les images s'ouvrent directement
```

---

### Option 3️⃣: Chemin Absolu (Complet)

```
C:\DIMENSIONNEMENT\Redimensionnement-Project-ZIG\Redimensionnement-Project-SNG\exports\export-2026-02-17T18-16-04\images\photo_12_1.jpg
```

**Windows:**
```powershell
# Ouvrir une image
start "C:\...\exports\export-2026-02-17T18-16-04\images\photo_12_1.jpg"

# Afficher tout le dossier
explorer "C:\...\exports\export-2026-02-17T18-16-04\images"
```

**Python:**
```python
import os
from PIL import Image

image_path = r"C:\...\exports\export-2026-02-17T18-16-04\images\photo_12_1.jpg"
img = Image.open(image_path)
img.show()
```

---

### Option 4️⃣: Métadonnées JSON

Le fichier `images_metadata.json` contient:

```json
[
  {
    "id": "12",
    "chemin": "./images/photo_12_1.jpg",
    "commune": "Oussouye",
    "region": "ziguinchor",
    "departement": "oussouye-dept",
    "partenaire": "SENELEC",
    "type_activite": "Desherbage,Collecte",
    "latitude": "12.49055100",
    "longitude": "-16.54658500",
    "date_collecte": "Tue Feb 17 2026 15:25:36",
    "taille_kb": "26.57"
  },
  ...
]
```

**Accès:**
```python
import json

with open('images_metadata.json') as f:
    images = json.load(f)

# Filtrer par commune
for img in images:
    if img['commune'] == 'Ziguinchor':
        print(f"📸 {img['commune']}: {img['chemin']}")
```

---

### Option 5️⃣: Structure Organisée par Région

Les images sont aussi copiées organisées:

```
images_organized/
└── ziguinchor/
    ├── 12_Oussouye.jpg
    ├── 11_Diembéring.jpg
    ├── 10_Ziguinchor.jpg
    ├── 9_Niaguis.jpg
    ├── 8_Ziguinchor.jpg
    ├── 7_Ziguinchor.jpg
    ├── 6_Ziguinchor.jpg
    └── 5_Ziguinchor.jpg
```

**Facile à naviguer:** `images_organized/[region]/[id]_[commune].jpg`

---

## 🗺️ Détails des Images

### Image 1: Oussouye
- **ID:** 12
- **Commune:** Oussouye
- **Région:** Ziguinchor
- **Département:** oussouye-dept
- **Partenaire:** SENELEC
- **Type:** Desherbage, Collecte
- **Taille:** 26.57 KB
- **Chemin:** `./images/photo_12_1.jpg`
- **Coordonnées:** 12.49°N, 16.54°O

### Image 2: Diembéring
- **ID:** 11
- **Commune:** Diembéring
- **Région:** Ziguinchor
- **Département:** oussouye-dept
- **Partenaire:** SENELEC
- **Type:** Desherbage, Collecte
- **Taille:** 37.83 KB
- **Chemin:** `./images/photo_11_2.jpg`
- **Coordonnées:** 12.37°N, 16.72°O

### Image 3: Ziguinchor (Bureau commercial)
- **ID:** 10
- **Commune:** Ziguinchor
- **Site:** Bureau commercial de Boutoute
- **Région:** Ziguinchor
- **Type:** Collecte
- **Taille:** 21.96 KB
- **Chemin:** `./images/photo_10_3.jpg`

### Image 4: Niaguis (Centrale électrique)
- **ID:** 9
- **Commune:** Niaguis
- **Site:** Centrale électrique de Boutoute
- **Région:** Ziguinchor
- **Type:** Levé déchets verts, Désherbage, Mécanisation, Collecte
- **Personnel:** 150 personnes
- **Équipement:** Pelle Chargeur, Camion BTP, Benne tasseuse
- **Taille:** 15.34 KB
- **Chemin:** `./images/photo_9_4.jpg`

### Images 5-8: Autres sites Ziguinchor
- Voir galerie.html pour les détails complets
- Taille totale: ~264 KB

---

## 💡 Recommandations

### Pour l'analyse
```bash
# 1. Ouvrir la galerie HTML
start exports\export-2026-02-17T18-16-04\galerie.html

# 2. Charger les métadonnées en Python
python3 -c "import json; print(json.load(open('images_metadata.json')))" | more
```

### Pour l'automatisation
```python
import json
import shutil
from pathlib import Path

# Lire les métadonnées
with open('images_metadata.json') as f:
    for img in json.load(f):
        src = img['chemin']
        dst = f"processed/{img['commune']}.jpg"
        shutil.copy(src, dst)
```

### Pour le web
```javascript
// Charger les métadonnées et afficher les images
fetch('images_metadata.json')
    .then(r => r.json())
    .then(images => {
        images.forEach(img => {
            document.body.innerHTML += `
                <div>
                    <h3>${img.commune}</h3>
                    <img src="${img.chemin}">
                    <p>${img.type_activite}</p>
                </div>
            `;
        });
    });
```

---

## 📊 Commandes Utiles

### Afficher les images par chemin
```bash
node images-by-path.js
```

### Organiser les images (déjà fait)
```bash
node images-by-path.js organize
```

### Exporter les métadonnées (déjà fait)
```bash
node images-by-path.js metadata
```

### Filtrer par région
```bash
node images-by-path.js filter ziguinchor
```

---

## ❓ Questions Fréquentes

**Q: Où sont exactement les images?**
A: Dans: `exports/export-2026-02-17T18-16-04/images/`

**Q: Quel format ont les images?**
A: JPEG (.jpg) - 8 images de 15 à 52 KB chacune

**Q: Puis-je les télécharger?**
A: Elles sont déjà sur votre ordinateur! Copiez simplement le dossier `exports/export-2026-02-17T18-16-04/`

**Q: Comment les partager?**
A: Compressez le dossier `exports/export-2026-02-17T18-16-04/` en ZIP

**Q: Les coordonnées GPS fonctionnent?**
A: Oui! Latitude/Longitude sont dans le CSV et les métadonnées

---

**Dernière mise à jour:** 17 février 2026
