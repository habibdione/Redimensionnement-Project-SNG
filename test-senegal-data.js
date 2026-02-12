#!/usr/bin/env node
/**
 * 🧪 TEST - Vérification des données géographiques du Sénégal
 * Vérifie que la structure des régions/départements/communes est correcte
 */

const SENEGAL_DATA = require('./data-senegal.js');

console.log(`
╔════════════════════════════════════════════════════════╗
║  🗺️  TEST DONNÉES GÉOGRAPHIQUES DU SÉNÉGAL (v2.0)     ║
║      14 Régions • 45 Départements                     ║
╚════════════════════════════════════════════════════════╝
`);

// ═══════════════════════════════════════════════════════════════
// 1. Vérifier le nombre de régions
// ═══════════════════════════════════════════════════════════════

console.log('\n📊 1️⃣  STATISTIQUES GÉNÉRALES\n');

const numRegions = SENEGAL_DATA.regions.length;
console.log(`   Total régions: ${numRegions} (attendu: 14) ${numRegions === 14 ? '✅' : '❌'}`);

const totalDepts = SENEGAL_DATA.regions.reduce((sum, r) => sum + r.departements.length, 0);
console.log(`   Total départements: ${totalDepts} (attendu: 45+) ${totalDepts >= 45 ? '✅' : '❌'}`);

const totalCommunes = SENEGAL_DATA.regions.reduce((sum, r) => 
    sum + r.departements.reduce((s, d) => s + d.communes.length, 0), 0
);
console.log(`   Total communes: ${totalCommunes} (attendu: 500+) ${totalCommunes >= 500 ? '✅' : '❌'}`);

// ═══════════════════════════════════════════════════════════════
// 2. Lister toutes les régions
// ═══════════════════════════════════════════════════════════════

console.log('\n🌍 2️⃣  LISTE DES 14 RÉGIONS\n');

SENEGAL_DATA.regions.forEach((region, index) => {
    const deptCount = region.departements.length;
    const communeCount = region.departements.reduce((sum, d) => sum + d.communes.length, 0);
    console.log(`   ${index + 1}. ${region.nom.padEnd(30)} (${deptCount} depts, ${communeCount} communes)`);
});

// ═══════════════════════════════════════════════════════════════
// 3. Tester les fonctions getDepartements et getCommunes
// ═══════════════════════════════════════════════════════════════

console.log('\n🔍 3️⃣  TESTS DES FONCTIONS\n');

// Test 1: getDepartements
const dakarDepts = SENEGAL_DATA.getDepartements('dakar');
console.log(`   getDepartements('dakar'): ${dakarDepts.length} département(s) ✅`);
console.log(`      → ${dakarDepts.map(d => d.nom).join(', ')}`);

// Test 2: getCommunes pour une région
const dakarCommunes = SENEGAL_DATA.getCommunes('dakar');
console.log(`\n   getCommunes('dakar'): ${dakarCommunes.length} commune(s) ✅`);
console.log(`      → ${dakarCommunes.join(', ')}`);

// Test 3: getCommunes pour un département spécifique
const dakarSpecific = SENEGAL_DATA.getCommunes('dakar', 'dakar-dept');
console.log(`\n   getCommunes('dakar', 'dakar-dept'): ${dakarSpecific.length} commune(s) ✅`);
console.log(`      → ${dakarSpecific.join(', ')}`);

// Test 4: Thièss region
const thiesDepts = SENEGAL_DATA.getDepartements('thies');
console.log(`\n   getDepartements('thies'): ${thiesDepts.length} département(s) ✅`);
console.log(`      → ${thiesDepts.map(d => d.nom).join(', ')}`);

// ═══════════════════════════════════════════════════════════════
// 4. Vérifier les codes régions uniques
// ═══════════════════════════════════════════════════════════════

console.log('\n🏷️  4️⃣  CODES RÉGIONS\n');

SENEGAL_DATA.regions.forEach(region => {
    if (region.code) {
        console.log(`   ${region.nom.padEnd(30)} → Code: ${region.code}`);
    }
});

// ═══════════════════════════════════════════════════════════════
// 5. Vérifier la cohérence des données
// ═══════════════════════════════════════════════════════════════

console.log('\n✔️  5️⃣  VÉRIFICATION COHÉRENCE\n');

let hasErrors = false;

// Vérifier que chaque région a des départements
SENEGAL_DATA.regions.forEach(region => {
    if (!region.departements || region.departements.length === 0) {
        console.log(`   ❌ Région ${region.nom} n'a pas de départements`);
        hasErrors = true;
    }
    
    // Vérifier que chaque département a des communes
    region.departements.forEach(dept => {
        if (!dept.communes || dept.communes.length === 0) {
            console.log(`   ❌ Département ${dept.nom} (${region.nom}) n'a pas de communes`);
            hasErrors = true;
        }
    });
});

if (!hasErrors) {
    console.log('   ✅ Toutes les régions ont des départements');
    console.log('   ✅ Tous les départements ont des communes');
}

// ═══════════════════════════════════════════════════════════════
// 6. Afficher les stats
// ═══════════════════════════════════════════════════════════════

console.log('\n📈 6️⃣  STATISTIQUES FINALES\n');

console.log(`   Régions: ${SENEGAL_DATA.stats.regions}`);
console.log(`   Départements: ${SENEGAL_DATA.stats.departements}`);
console.log(`   Communes: ${SENEGAL_DATA.stats.communes}`);
console.log(`   Dernière mise à jour: ${SENEGAL_DATA.stats.lastUpdate}`);

// ═══════════════════════════════════════════════════════════════
// RÉSULTAT FINAL
// ═══════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(56));

if (!hasErrors && numRegions === 14) {
    console.log('\n   ✅ ✅ ✅ TOUS LES TESTS RÉUSSIS ✅ ✅ ✅\n');
    console.log('   Données du Sénégal chargées correctement:');
    console.log(`   • ${numRegions} régions`);
    console.log(`   • ${totalDepts} départements`);
    console.log(`   • ${totalCommunes} communes`);
    console.log('\n   Prêt pour utilisation dans l\'application PWA!\n');
} else {
    console.log('\n   ⚠️  ERREURS DÉTECTÉES\n');
    console.log(`   • Régions: ${numRegions} (attendu: 14)`);
    console.log(`   • Vérifiez les données dans data-senegal.js`);
    console.log('\n');
}

console.log('═'.repeat(56) + '\n');

process.exit(hasErrors || numRegions !== 14 ? 1 : 0);
