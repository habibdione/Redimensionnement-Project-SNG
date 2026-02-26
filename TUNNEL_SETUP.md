# 🌐 TEST AVEC LE TUNNEL HTTPS

## Configuration du tunnel Dev Tunnels

L'application est maintenant configurée pour fonctionner avec le tunnel HTTPS:
```
https://4mkdbs2k-3001.euw.devtunnels.ms
```

---

## 🔗 Accès au tunnel

### Option 1: Détection Automatique
Si vous déployez l'application sur le tunnel, la détection automatique activera la configuration tunnel.

### Option 2: Forcer le tunnel via paramètre URL
Vous pouvez forcer manuellement l'utilisation du tunnel en ajoutant `?env=tunnel` à l'URL:

```
http://localhost:5000?env=tunnel
```

Ou depuis le tunnel:
```
https://4mkdbs2k-3001.euw.devtunnels.ms?env=tunnel
```

---

## ⚙️ Configuration actuelle

**Environnement**: `tunnel`
**API URL**: `https://4mkdbs2k-3001.euw.devtunnels.ms/api`
**CORS**: Activé sur le backend (origin: '*')

---

## 🧪 Test rapide

1. Ouvrez la console du navigateur (F12)
2. Allez sur: `http://localhost:5000?env=tunnel`
3. Collez ce code:

```javascript
// Test direct du tunnel
fetch('https://4mkdbs2k-3001.euw.devtunnels.ms/api/health')
    .then(r => r.json())
    .then(d => console.log('✅ Tunnel fonctionnel:', d))
    .catch(e => console.error('❌ Erreur tunnel:', e.message));
```

---

## 🔑 Points importants

- **SSL**: Le tunnel utilise HTTPS (certificats autosignés acceptés)
- **CORS**: Le backend accepte tous les domaines (`origin: '*'`)
- **Authentification**: Le tunnel peut nécessiter une authentification Dev Tunnels
- **Public**: Vérifiez que le tunnel est configuré comme **public** et pas **private**

---

## ✅ Checklist de déploiement

- [ ] Tunnel Dev Tunnels créé et lancé
- [ ] URL du tunnel: `https://4mkdbs2k-3001.euw.devtunnels.ms`
- [ ] Backend Node.js écoute sur port 3001
- [ ] PostgreSQL connecté au backend
- [ ] Tunnel configuré comme **PUBLIC** (pas private)
- [ ] CORS activé sur le backend
- [ ] Tester avec: `?env=tunnel`

---

## 📊 URLs de test disponibles

| Endpoint | URL | Description |
|----------|-----|-------------|
| Health | `https://4mkdbs2k-3001.euw.devtunnels.ms/api/health` | État du serveur |
| Collectes | `https://4mkdbs2k-3001.euw.devtunnels.ms/api/collectes` | Toutes les collectes |
| Créer | `https://4mkdbs2k-3001.euw.devtunnels.ms/api/collecte` | Créer une collecte (POST) |

---

## 🐛 Dépannage

### Le tunnel retourne une page GitHub
**Cause**: Le tunnel n'est pas public ou l'authentification est requise
**Solution**: Vérifiez les paramètres Dev Tunnels pour rendre le tunnel PUBLIC

### Erreur CORS
**Cause**: L'origin n'est pas acceptée
**Solution**: Vérifier que le backend a `cors({origin: '*'})` activé

### Certificat invalide
**Cause**: Certificat autosigné du tunnel
**Solution**: Les navigateurs modernes acceptent les certificats autosignés pour les tunnels

---

Pour plus d'infos sur Dev Tunnels: https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/
