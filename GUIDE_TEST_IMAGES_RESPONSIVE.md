# 🎨 Guide de Test - Adaptation Responsive des Images

## 📋 Comment Tester les Modifications

### 1. Ouvrir l'Application

Ouvrez `index.html` dans votre navigateur:
```bash
# Option 1: Double-clic sur le fichier
# Option 2: Accédez via serveur local
# Option 3: Live Server VSCode (Extension)
```

### 2. Vérifier sur Different Appareils

#### 📱 Mobile (< 480px)
- Ouvrez avec Devtools (F12 ou Cmd+Opt+I)
- Sélectionnez "Toggle device toolbar" ou Ctrl+Shift+M
- Testez avec: iPhone, Samsung Galaxy, Pixel

**Points à vérifier:**
- ✅ Les images n'ont pas de bordures blanches/crop
- ✅ Contenu complet visible dans chaque image
- ✅ Proportions maintenues sans distorsion
- ✅ Pas de dépassement du conteneur

#### 💻 Tablette (480px - 768px)
- Devtools: iPad, Nexus 7, iPad Mini

**Points à vérifier:**
- ✅ Images affichent legèrement plus grands
- ✅ Galeries 4-colonnes → 2 colonnes
- ✅ Contenu de l'image toujours visible

#### 🖥️ Desktop (≥ 1000px)
- Navigateur normal en plein écran

**Points à vérifier:**
- ✅ Images maximum taille optimale
- ✅ Grilles 4-colonnes complètes
- ✅ Aspect beau et lisible

### 3. Points de Contrôle Spécifiques

#### Section Actualités (2 colonnes)
```
[Image Directeur]  [Image DG Convention]
  140px → 120px      140px → 120px (mobile)
  ↓
140px → 180px (desktop)
```
- Ratio: 1.4:1
- Vérifier que le visage est complet et centré

#### Section Acteurs (3 colonnes)
```
[Région]  [Département]  [Chef]
  100px →   100px      →  100px (mobile: 1 col)
  ↓
120px (desktop)
```
- Ratio: 1:1 (carré)
- Vérifier que les têtes ne sont pas coupées

#### Galeries 4 colonnes
```
[1]  [2]  [3]  [4]  →  [1]  [2]  (768px) → [1] (480px)
  auto-height           auto-height       auto-height
```
- Ratio: 1:0.85
- Vérifier proportions constantes

### 4. Tests Interactifs

#### Test de Redimensionnement
1. Ouvrez Devtools (F12)
2. Cliquez sur les dimensions (ex: iPhone 12)
3. Glissez le coin pour redimensionner
4. Observez les images qui s'adaptent en temps réel

**Attendu:**
- Images qui se redimensionnent fluidement
- Pas de sauts/flickering
- Pas de crop de contenu

#### Test du Mode Portrait/Paysage
1. Devtools toujours ouvert
2. Cliquez sur l'icône portrait/paysage
3. Les images doivent s'adapter

**Attendu:**
- Portrait: images plus compactes
- Paysage: images plus larges
- Contenu toujours visible

### 5. Vérifier les Vidéos/Canvas

Les vidéos et canvas doivent aussi s'adapter:

```
Mobile:    max-height: 200px
Tablette:  max-height: 250px
Desktop:   max-height: 350px
```

## 🔍 Diagnostic - Cas Problématique

Si les images ne s'adaptent pas correctement:

### ❌ Problème: Image crop/coupée
```css
/* MAUVAIS */
img { height: 140px; }

/* BON */
img { 
    height: auto;
    max-height: 140px;
    aspect-ratio: 1.4 / 1;
}
```

### ❌ Problème: Dépassement du conteneur
```css
/* MAUVAIS */
img { width: 150px; }

/* BON */
img { 
    max-width: 100%;
    width: 100%;
}
```

### ❌ Problème: Distorsion des proportions
```css
/* MAUVAIS */
img { width: 200px; height: 100px; }

/* BON */
img { 
    width: 100%;
    height: auto;
    aspect-ratio: 2 / 1;
}
```

## 📊 Résumé des Hauteurs CSS

### Galeries 2-colonnes (Actualités)
| Taille | Hauteur | Ratio |
|--------|---------|-------|
| Mobile | 120px | 1.4:1 |
| Tablet | 150px | 1.4:1 |
| Desktop | 180px | 1.4:1 |

### Galeries 3-colonnes (Acteurs)
| Taille | Hauteur | Ratio |
|--------|---------|-------|
| Mobile | 90px | 1:1 |
| Tablet | 90px | 1:1 |
| Desktop | 120px | 1:1 |

### Galeries 4-colonnes
| Taille | Hauteur | Ratio |
|--------|---------|-------|
| Mobile | 100px | 1:0.85 |
| Tablet | 120px | 1:0.85 |
| Desktop | 160px | 1:0.85 |

### Vidéos/Canvas
| Taille | Hauteur |
|--------|---------|
| Mobile | 200px |
| Tablet | 250px |
| Desktop | 350px |

## 🧪 Checklist de Validation

- [ ] Images mobile affichent le contenu complet
- [ ] Pas de crop/coupure des bords
- [ ] Pas de distorsion de proportions
- [ ] Transition fluide entre breakpoints
- [ ] Images desktop utilisent l'espace optimal
- [ ] Vidéos/canvas aussi responsive
- [ ] Pas d'erreur console
- [ ] Pas de flickering
- [ ] Performance acceptable

## 🚀 Browser Support

✅ Tous les navigateurs modernes:
- Chrome 76+
- Firefox 75+
- Safari 13+
- Edge 79+
- iOS Safari 13+
- Android Chrome 76+

## 📞 Support

Si vous trouvez des problèmes:
1. Vérifiez la console (F12 → Console)
2. Vérifiez les media queries actifs (F12 → Styles)
3. Consultez `ADAPTATION_IMAGES_RESPONSIVE.md` pour détalles

---

**Guide créé:** 18 février 2026  
**Dernière mise à jour:** 18 février 2026
