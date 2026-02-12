# 🧪 GUIDE DE TEST API - Dimensionnement SENELEC

## Prérequis

- Backend lancé: `npm start`
- PostgreSQL en cours d'exécution
- curl installé (Windows: https://curl.se/download/)

---

## 🔍 1. VÉRIFICATION DE L'ÉTAT

### Test de Santé

```bash
curl http://localhost:3001/api/health
```

**Réponse attendue:**
```json
{
  "success": true,
  "status": "OK",
  "database": "connected",
  "timestamp": "2026-02-12T10:30:45.000Z"
}
```

---

## ✨ 2. CRÉER UNE COLLECTE

### Requête Simple

```bash
curl -X POST http://localhost:3001/api/collecte \
  -H "Content-Type: application/json" \
  -d '{
    "partenariat": "SONAGED",
    "region": "Ziguinchor",
    "departement": "Ziguinchor",
    "commune": "Ziguinchor",
    "typeActivite": "Collecte, Desherbage",
    "siteConcerne": "Agence principal de Ziguinchor",
    "adresse": "Rue du Commerce, Ziguinchor",
    "superficie": 2.81,
    "besoinPersonnel": 5,
    "dispositifDeploy": "Camion BTP, Pelle Chargeur",
    "nombreRotation": 3,
    "infrastructureGestion": "PRN",
    "prnPp": "PRN",
    "frequenceCollecte": "F1",
    "bacs240": 10,
    "caissePolybene": 5,
    "bacs660": 3,
    "accessibilite": "Facile",
    "latitude": 13.1939,
    "longitude": -15.5277,
    "precision": 8.5,
    "observation": "Site en bon état, accès facile"
  }'
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Données sauvegardées avec succès",
  "data": {
    "id": 1,
    "dateCollecte": "2026-02-12T10:35:00.000Z"
  }
}
```

### Requête avec Image (Base64)

```bash
# Ajouter 'image1': 'data:image/jpeg;base64,...' dans le JSON
```

---

## 📖 3. RÉCUPÉRER LES COLLECTES

### Toutes les Collectes (Avec Pagination)

```bash
curl "http://localhost:3001/api/collectes?page=1&limit=10"
```

**Réponse:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  },
  "data": [...]
}
```

### Une Collecte Spécifique

```bash
curl http://localhost:3001/api/collecte/1
```

### Collectes d'un Partenariat

```bash
curl http://localhost:3001/api/collectes/partenariat/SONAGED
```

**Réponse:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {...},
    {...}
  ]
}
```

---

## ✏️ 4. MODIFIER UNE COLLECTE

```bash
curl -X PUT http://localhost:3001/api/collecte/1 \
  -H "Content-Type: application/json" \
  -d '{
    "partenariat": "SONAGED Modifié",
    "region": "Ziguinchor",
    "departement": "Ziguinchor",
    "commune": "Ziguinchor",
    "typeActivite": "Collecte, Mecanisation",
    "siteConcerne": "Agence principal de Ziguinchor",
    "adresse": "Rue du Commerce, Ziguinchor",
    "superficie": 3.5,
    "besoinPersonnel": 7,
    "dispositifDeploy": "Camion BTP",
    "nombreRotation": 4,
    "infrastructureGestion": "PP",
    "prnPp": "PP",
    "frequenceCollecte": "F2",
    "bacs240": 15,
    "caissePolybene": 8,
    "bacs660": 4,
    "accessibilite": "Difficile",
    "latitude": 13.1939,
    "longitude": -15.5277,
    "precision": 10.2,
    "observation": "Mise à jour after inspection"
  }'
```

---

## 🗑️ 5. SUPPRIMER UNE COLLECTE

```bash
curl -X DELETE http://localhost:3001/api/collecte/1
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Collecte supprimée avec succès"
}
```

---

## 📊 6. STATISTIQUES

```bash
curl http://localhost:3001/api/statistiques
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "total_collectes": 42,
    "nombre_partenariats": 3,
    "nombre_departements": 3,
    "nombre_communes": 8,
    "superficie_totale": "125.45",
    "personnel_total": 156,
    "total_bacs_240": 420,
    "total_caisses": 210
  }
}
```

---

## 💻 7. TESTS AVANCÉS

### Script Bash - Créer 5 Collectes

```bash
#!/bin/bash

for i in {1..5}; do
    echo "Création collecte $i..."
    curl -X POST http://localhost:3001/api/collecte \
      -H "Content-Type: application/json" \
      -d "{
        \"partenariat\": \"SONAGED\",
        \"region\": \"Ziguinchor\",
        \"departement\": \"Ziguinchor\",
        \"commune\": \"Ziguinchor\",
        \"typeActivite\": \"Collecte\",
        \"siteConcerne\": \"Site $i\",
        \"adresse\": \"Adresse $i\",
        \"superficie\": $((i + 1)).5,
        \"besoinPersonnel\": $((i + 4)),
        \"dispositifDeploy\": \"Camion\",
        \"nombreRotation\": $i,
        \"infrastructureGestion\": \"PRN\",
        \"prnPp\": \"PRN\",
        \"frequenceCollecte\": \"F1\",
        \"bacs240\": $((i * 10)),
        \"caissePolybene\": $((i * 5)),
        \"bacs660\": $i,
        \"accessibilite\": \"Facile\",
        \"latitude\": 13.1939,
        \"longitude\": -15.5277,
        \"precision\": 8.5,
        \"observation\": \"Test collecte $i\"
      }"
    sleep 1
done

echo "✅ 5 collectes créées"
```

### Exécuter le Script

```bash
chmod +x test-collectes.sh
./test-collectes.sh
```

---

## 🔍 8. TESTS AVEC POSTMAN

### Importer la Collection

Créez une collection Postman avec ces requêtes:

**1. GET /api/health**
```
Method: GET
URL: http://localhost:3001/api/health
```

**2. POST /api/collecte**
```
Method: POST
URL: http://localhost:3001/api/collecte
Body: JSON (voir exemples ci-dessus)
```

**3. GET /api/collectes**
```
Method: GET
URL: http://localhost:3001/api/collectes?page=1&limit=10
```

**4. GET /api/collectes/partenariat/SONAGED**
```
Method: GET
URL: http://localhost:3001/api/collectes/partenariat/SONAGED
```

---

## 🐛 9. DÉBOGAGE

### Vérifier les Logs du Serveur

```bash
# Le serveur affiche:
# - Requêtes entrantes
# - Erreurs de base de données
# - Messages d'initialisation
```

### Vérifier la Base de Données

```bash
# Se connecter
psql -U senelec_user -d senelec_dimensionnement

# Lister les collectes
SELECT * FROM collectes_donnees;

# Compter les collectes
SELECT COUNT(*) FROM collectes_donnees;

# Voir les partenaires uniques
SELECT DISTINCT partenariat FROM collectes_donnees;

# Quitter
\q
```

### Tests d'Erreur

```bash
# 404 - Collecte inexistante
curl http://localhost:3001/api/collecte/99999

# 400 - Données invalides (test)
curl -X POST http://localhost:3001/api/collecte \
  -H "Content-Type: application/json" \
  -d '{"partenariat": "TEST"}'

# 500 - Erreur serveur
# Vérifier les logs du serveur
```

---

## 📈 10. TESTS DE PERFORMANCE

### Mesure du Temps de Réponse

```bash
# Créer une collecte et mesurer le temps
time curl -X POST http://localhost:3001/api/collecte \
  -H "Content-Type: application/json" \
  -d '{...}'

# Récupérer de grandes quantités
curl "http://localhost:3001/api/collectes?page=1&limit=1000"
```

### Charge Test (Apache Bench)

```bash
# Installer: apt install apache2-utils (Linux)
#            brew install httpd (macOS)
#            Windows: choco install ab (si Chocolatey)

# Test simple
ab -n 100 -c 10 http://localhost:3001/api/health

# Rapport: réq/sec, temps moyen, etc.
```

---

## ✅ 11. CHECKLIST DE TEST COMPLET

- [ ] Health check réussit
- [ ] Créer une collecte réussit
- [ ] Récupérer une collecte fonctionne
- [ ] Lister toutes les collectes fonctionne
- [ ] Filtrer par partenariat fonctionne
- [ ] Modifier une collecte fonctionne
- [ ] Supprimer une collecte fonctionne
- [ ] Statistiques s'affichent
- [ ] Messages d'erreur appropriés
- [ ] PostgreSQL sauvegarde les données

---

## 🚨 12. COMMON ERRORS

### 400 Bad Request

**Cause:** Données invalides ou manquantes

**Solution:** Vérifier les types de données
```json
{
  "superficie": 2.81,      // DECIMAL
  "besoinPersonnel": 5,    // INTEGER
  "latitude": 13.1939      // DECIMAL
}
```

### 500 Internal Server Error

**Cause:** PostgreSQL non connecté ou erreur serveur

**Solution:**
1. Vérifier PostgreSQL: `psql -U senelec_user`
2. Vérifier les logs: `npm start` affiche l'erreur
3. Redémarrer le serveur

### Connection Refused

**Cause:** Serveur backend non lancé

**Solution:** `npm start` dans un terminal

---

## 📝 13. EXPORT DES CAS D'USAGE

### Exporter tous les tests en Postman

```bash
# Exporter la collection JSON
# Postman → Collection → Export → Format v2.1
```

### Générer une documentation Swagger

```bash
# À ajouter: Documentation OpenAPI pour l'API
```

---

## 📚 RESSOURCES

- [API Documentation](#api-endpoints)
- [PostgreSQL SETUP](POSTGRESQL_SETUP.md)
- [Usage Guide](USAGE_GUIDE.md)

---

**Dernière mise à jour:** 12 Février 2026  
**Version:** 1.0.0
