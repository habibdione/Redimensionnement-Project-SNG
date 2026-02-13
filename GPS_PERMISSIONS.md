# 📍 Guide de Configuration des Permissions GPS

## 🔴 Erreur: "Accès à la géolocalisation refusé"

Si vous recevez cette erreur, suivez les étapes ci-dessous selon votre navigateur.

---

## 🌐 Google Chrome / Chromium / Edge

### Option 1: Via l'icône Paramètres (le plus simple)
1. Cliquez sur le cadenas 🔒 dans la barre d'URL (près de `http://localhost:3001`)
2. Cherchez "Localisation" 
3. Changez le paramètre de "Bloquer" à "Autoriser"
4. Rafraîchissez la page (F5)
5. Cliquez à nouveau sur "📡 Obtenir Position GPS"

### Option 2: Via Paramètres
1. **Paramètres** (⋮ menu en haut à droite)
2. Catégories → **Confidentialité et sécurité** → **Paramètres des sites**
3. Sélectionnez **Localisation**
4. Localisez `http://localhost:3001`
5. Changez la permission à "**Autoriser**"

---

## 🦊 Mozilla Firefox

1. Paramètres → **Confidentialité & sécurité**
2. Descendez jusqu'à **Permissions**
3. Cliquez sur le bouton **Paramètres** à côté de "Localisation"
4. Cherchez `http://localhost:3001`
5. Changez en **Autoriser**
6. Rafraîchissez la page et réessayez

---

## 🍎 Safari (macOS)

1. **Safari** → **Préférences**
2. Onglet **Sécurité**
3. Activez **"Autoriser la localisation"**
4. Onglet **Confidentialité**
5. Cherchez `localhost:3001` et changez l'accès à **Autoriser**

---

## 🪟 Windows 11 - Paramètres Système

Si le GPS ne fonctionne toujours pas, vérifiez les paramètres Windows:

1. **Paramètres** (Win + I)
2. **Confidentialité & sécurité**
3. **Localisation**
4. Vérifiez que "Localisation" est **ACTIVÉE** (toggle bleu)
5. Descendez et vérifiez que votre navigateur a l'autorisation d'accès

---

## 📱 Pour une Meilleure Réception GPS

- **En extérieur**: Le GPS fonctionne mieux à l'extérieur (min 15-30 secondes)
- **Près d'une fenêtre**: Si en intérieur, approchez une fenêtre
- **Pas de VPN**: Désactivez tout VPN ou proxy
- **GPS activé**: Sur Windows, vérifiez que le service de localisation est activé
- **Patientez**: La première acquisition GPS peut prendre 10-30 secondes

---

## 🧪 Pour Tester Sans GPS Réel

Vous pouvez injecter manuellement les coordonnées:

1. Ouvrez la **Console (F12)** dans votre navigateur
2. Collez ce code:
```javascript
donnees.latitude = 13.6656;
donnees.longitude = -14.2235;
donnees.precision = 30;

// Mettez à jour l'affichage
document.getElementById('lat').textContent = '13.6656';
document.getElementById('lon').textContent = '-14.2235';
document.getElementById('accuracy').textContent = '30';
```
3. Appuyez sur **Entrée**

---

## 🔍 Vérifier les Permissions Actuelles

Ouvrez la Console (F12) et tapez:
```javascript
navigator.geolocation.getCurrentPosition(
    pos => console.log('✅ GPS Autorisé:', pos),
    err => console.error('❌ GPS Refusé:', err.code, err.message)
);
```

---

## 📞 Besoin d'Aide?

- **Console F12**: Ouvrez la console pour voir les messages d'erreur détaillés
- **Refresh F5**: Rafraîchissez après avoir changé les permissions
- **Navigateur différent**: Essayez Chrome ou Firefox pour isoler le problème
- **Incognito**: Testez en mode incognito (les permissions y sont réinitialisées)

