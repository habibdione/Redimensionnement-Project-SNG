/**
 * Test de l'API DTM pour vérifier les chemins des images
 */

fetch('http://localhost:3002/api/dtm-data')
    .then(res => res.json())
    .then(data => {
        console.log('\n✅ Réponse API reçue');
        console.log(`📊 Nombre d\'images: ${data.count}`);
        console.log(`✅ Succès: ${data.success}`);
        
        if (data.data && data.data.length > 0) {
            console.log('\n🖼️ Premières images:');
            data.data.slice(0, 3).forEach(item => {
                console.log(`  ID ${item.id}: ${item.commune} → ${item.photo}`);
            });
        }
        
        console.log(`\n✨ Total: ${data.count} images disponibles\n`);
    })
    .catch(err => console.error('❌ Erreur:', err.message));
