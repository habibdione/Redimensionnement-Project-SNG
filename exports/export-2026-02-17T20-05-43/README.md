# Export des Données de Collecte

## 📊 Informations d'export
- **Date**: 17/02/2026 20:05:43
- **Nombre de collectes**: 8
- **Nombre d'images**: 8

## 📁 Fichiers inclus
- `collectes_donnees.csv` - Toutes les données (CSV)
- `images/` - Dossier contenant les images extraites (.jpg)

## 🖼️ Utilisation des images

### 📍 Chemins des images
Dans le CSV, la colonne `image_1` contient les chemins relatifs des images:
```
./images/image_1_1.jpg
./images/image_2_2.jpg
```

### 💻 Accéder aux images en Python:
```python
import pandas as pd
from PIL import Image

# Charger le CSV
df = pd.read_csv('collectes_donnees.csv')

# Ouvrir une image
img = Image.open(df.loc[0, 'image_1'])
img.show()
```

### 🌐 Accéder aux images en JavaScript:
```javascript
// L'image est directement utilisable
function afficherImage(imagePath) {
    const img = new Image();
    img.src = imagePath;
    document.body.appendChild(img);
}

// Charger depuis le CSV
const csvData = await fetch('collectes_donnees.csv').then(r => r.text());
const rows = csvData.split('\n');
const imagePath = rows[1].split(',')[imageColumnIndex];
afficherImage(imagePath);
```

### 🗂️ Réorganiser les images
Pour garder les images avec le CSV:
```
export/
├── collectes_donnees.csv
└── images/
    ├── image_1_1.jpg
    ├── image_2_2.jpg
    └── ...
```

## 📋 Colonnes du CSV
1. `id`
2. `partenaire`
3. `region`
4. `departement`
5. `commune`
6. `type_activite`
7. `sites_concernes`
8. `superficie`
9. `besoin_personnel`
10. `dispositif_deploye`
11. `nombre_rotation`
12. `infrastructure_gestion`
13. `frequence_collecte`
14. `bacs_240l`
15. `caisse_polybene`
16. `bacs_660l`
17. `accessibilite`
18. `latitude`
19. `longitude`
20. `precision`
21. `coordonnee_x`
22. `coordonnee_y`
23. `observation`
24. `photo`
25. `date_collecte`
26. `date_modification`
27. `statut`
28. `created_at`
29. `updated_at`

## ⚙️ Conversion Base64 (alternative)
Si vous avez besoin d'intégrer les images directement dans le CSV en base64:
```bash
node export-base64.js
```

## 📧 Support
Pour toute question, consultez la documentation principale.
