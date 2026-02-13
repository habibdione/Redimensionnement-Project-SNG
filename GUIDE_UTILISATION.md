# 🗺️ Guide d'utilisation - Collecte de Données SONAGED

## Étape 1️⃣ - Remplir le formulaire obligatoire

Avant de sauvegarder les données, vous **DEVEZ** remplir ces champs:

### ✅ Champs obligatoires:

1. **🗺️ Région** - Sélectionnez une région dans le dropdown
   - Cliquez sur le menu "-- Sélectionner une région --"
   - Choisissez parmi: Dakar, Thiès, Saint-Louis, Ziguinchor, etc.

2. **📍 Département** - Sélectionnez un département
   - Après avoir choisi une région, le menu "Département" se remplira automatiquement
   - Sélectionnez le département correspondant

3. **🏘️ Commune** - Sélectionnez une commune
   - Après avoir choisi un département, le menu "Commune" se remplira automatiquement
   - Sélectionnez la commune

4. **🏢 Partenaire** - Entrez le nom du partenaire
   - Ex: SONAGED, ONG, etc.

5. **📍 Adresse** - Entrez l'adresse complète
   - Ex: Rue de la Paix, Ziguinchor

6. **📏 Superficie** - Entrez la superficie en hectares
   - Ex: 2.81

7. **👤 Besoin en Personnel** - Nombre de personnes
   - Ex: 5

## Étape 2️⃣ - Capturer la position GPS

- Cliquez sur le bouton **"📡 Obtenir Position GPS"**
- Attendez 5-10 secondes pour que le GPS se connecte
- La position s'affichera dans la zone "Coordonnées actuelles"

> ⚠️ **Les coordonnées GPS sont OBLIGATOIRES pour sauvegarder!**

## Étape 3️⃣ - Remplir les autres données (optionnel)

- Type d'activité
- Dispositif déployé
- Infrastructure de gestion
- Fréquence de collecte
- Etc.

## Étape 4️⃣ - Sauvegarder

1. Cliquez sur **"👁️ Voir le Résumé"** pour vérifier toutes les données
2. Cliquez sur **"💾 Sauvegarder les Données"**
3. Vérifiez la fenêtre de confirmation
4. Cliquez "OK" pour confirmer

## ❌ Dépannage - Les données ne s'enregistrent pas

### Erreur: "Veuillez remplir les champs obligatoires"

**Cause**: Vous avez oublié de sélectionner:
- ✓ Région
- ✓ Département  
- ✓ Commune
- ✓ Partenaire
- ✓ Adresse
- ✓ Superficie
- ✓ Personnel

**Solution**: 
1. Vérifiez que TOUS les champs en ROUGE sont complétés
2. Utilisez les menus déroulants (dropdowns)
3. Vérifiez que vous n'avez pas laissé les champs vides

### Erreur: "Les coordonnées GPS sont obligatoires"

**Cause**: Vous n'avez pas capturé la position GPS

**Solution**:
1. Cliquez sur **"📡 Obtenir Position GPS"**
2. Acceptez la permission de géolocalisation quand le navigateur demande
3. Attendez quelques secondes
4. Les coordonnées apparaîtront automatiquement

### Erreur: "Erreur serveur"

**Cause**: Le serveur n'est pas disponible

**Solution**:
1. Vérifiez que `npm start` est lancé dans le terminal
2. La page doit être accessible à: http://localhost:3001
3. Attendez 2-3 secondes après le redémarrage du serveur

## 📋 Exemple d'une collecte complète

```
🗺️ Région: Ziguinchor
📍 Département: Ziguinchor
🏘️ Commune: Ziguinchor
🏢 Partenaire: SONAGED
📍 Adresse: Rue de l'Indépendance, Ziguinchor
📏 Superficie: 2.81 ha
👤 Personnel: 5 personnes
📡 GPS: (13.1939°, -15.5277°)
```

## ✅ Comment vérifier que ça fonctionne

1. Ouvrez la **Console du navigateur** (Appuyez sur **F12**)
2. Allez à l'onglet **"Console"**
3. Remplissez le formulaire et cliquez "Sauvegarder"
4. Vous devriez voir des logs de débogage comme:
   - ✅ Région sélectionnée: "ziguinchor"
   - ✅ 3 départements trouvés
   - ✅ 20 communes trouvées
   - ✅ Données envoyées

Si vous voyez `❌ région est VIDE`, c'est que le dropdown n'a pas de sélection!

---

Pour toute question, vérifiez la **Console (F12)** pour les messages de diagnostic.
