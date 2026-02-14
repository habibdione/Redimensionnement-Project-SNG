## 🔍 Explication des Serveurs dans l'Application

### ⚙️ Les 3 serveurs expliqués :

#### 1. **🌐 Serveur Frontend (GitHub Pages)**
- **URL:** `https://habibdione.github.io/Redimensionnement-Project-SNG/`
- **Fonction:** Affiche le formulaire HTML/CSS/JavaScript
- **Port:** Aucun (serveur web, HTTPS)
- **Quoi:** C'est juste l'interface graphique

#### 2. **⚡ Serveur Backend API (Node.js/Express)**
- **URL:** `http://localhost:3001` (localement)
- **OU** `https://VOTRE_TUNNEL_ID-3001.euw.devtunnels.ms` (depuis GitHub Pages)
- **Fonction:** Reçoit les données du formulaire et les stocke
- **Port:** 3001
- **Quoi:** Le cerveau de l'application

#### 3. **🗄️ Serveur Base de Données (PostgreSQL)**
- **URL:** Interne (localhost:5432)
- **Fonction:** Stocke les données de manière permanente
- **Port:** 5432
- **Quoi:** L'entrepôt de données

---

### 📊 Comment ça marche ensemble ?

```
[Formulaire HTML]
      ↓
[JavaScript collecte les données du formulaire]
      ↓
[Envoie les données au SERVEUR BACKEND]
      ↓
[Le backend reçoit et valide les données]
      ↓
[Insère dans PostgreSQL]
      ↓
✅ SUCCÈS: "Données sauvegardées avec succès!"
```

---

### ⚠️ Message "Données sauvegardées localement..."

**Que cela veut dire :**
- Le serveur Backend (**http://localhost:3001** ou le tunnel) n'était pas accessible
- Les données ont été sauvegardées sur VOTRE ORDINATEUR (localStorage)
- Dès que le Backend sera de nouveau online, les données seront synchronisées

---

### ✅ Comment vérifier quel serveur est actif ?

**1. Vérifier le backend :**
```powershell
curl http://localhost:3001/api/health
# Si vous voyez "status": "OK" → Backend OK ✅
```

**2. Vérifier les données sauvegardées :**
```
F12 → Onglet "Application" → "Local Storage"
→ Cherchez "collectes_donnees" pour voir les données en cache
```

**3. Vérifier la base de données :**
```powershell
node check-today-data.js
# Voir toutes les données enregistrées
```

---

### 🚀 Résumé rapide

| Élément | Rôle | Comment vérifier |
|---------|------|------------------|
| **Formulaire** | Affiche pour saisir données | Vous le voyez sur l'écran |
| **Backend (3001)** | Reçoit et valide données | `curl http://localhost:3001/api/health` |
| **PostgreSQL** | Stocke données permanent | `node check-today-data.js` |

**Si vous voyez "Données sauvegardées localement"** = Le backend n'est pas accessible
**Solution:** `npm start` pour démarrer le backend sur le port 3001
