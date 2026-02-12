/**
 * 🗺️ DONNÉES GÉOGRAPHIQUES DU SÉNÉGAL
 * ====================================
 * Régions, Départements et Communes
 * Mise à jour: 12 Février 2026
 */

const SENEGAL_DATA = {
    regions: [
        {
            id: 'dakar',
            nom: '🏛️ Dakar',
            departements: [
                {
                    id: 'dakar-dept',
                    nom: 'Dakar',
                    communes: [
                        'Dakar',
                        'Guédiawaye',
                        'Parcelles Assainies',
                        'Pikine',
                        'Rufisque',
                        'Thiaroye',
                        'Thiaroye sur Mer',
                        'Cambérène'
                    ]
                }
            ]
        },
        {
            id: 'thiès',
            nom: '🏘️ Thiès',
            departements: [
                {
                    id: 'thiès-dept',
                    nom: 'Thiès',
                    communes: [
                        'Thiès',
                        'Khimps',
                        'Koupentoum',
                        'Mékhé',
                        'Pire',
                        'Taïba Ndiaye'
                    ]
                },
                {
                    id: 'tivaouane-dept',
                    nom: 'Tivaouane',
                    communes: [
                        'Tivaouane',
                        'Chérif Lô',
                        'Gané',
                        'Kébémer',
                        'Mboula',
                        'Méckhé',
                        'Meïssa Boubacar',
                        'Ogo',
                        'Thioupane',
                        'Trébane'
                    ]
                },
                {
                    id: 'mbour-dept',
                    nom: 'Mbour',
                    communes: [
                        'Mbour',
                        'Joal-Fadiouth',
                        'Malicounda',
                        'Mboro',
                        'Niakhar',
                        'Popenguine',
                        'Saly',
                        'Sandiara'
                    ]
                }
            ]
        },
        {
            id: 'kaolack',
            nom: '🌾 Kaolack',
            departements: [
                {
                    id: 'kaolack-dept',
                    nom: 'Kaolack',
                    communes: [
                        'Kaolack',
                        'Guinguinéo',
                        'Makacoulibantang',
                        'Ndiédieng',
                        'Sibassor'
                    ]
                },
                {
                    id: 'nioro-dept',
                    nom: 'Nioro du Rip',
                    communes: [
                        'Nioro du Rip',
                        'Dahra Djolof',
                        'Kael',
                        'Kayar',
                        'Mbadakhoune',
                        'Merina Peul',
                        'Thieumbadane'
                    ]
                }
            ]
        },
        {
            id: 'indépendance',
            nom: '⚡ Région de l\'Indépendance',
            departements: [
                {
                    id: 'karang-dept',
                    nom: 'Karang',
                    communes: [
                        'Karang',
                        'Baba Garage',
                        'Diamniadio',
                        'Diourbelé',
                        'Kaffrine',
                        'Malème Jedé',
                        'Sèdhiou'
                    ]
                }
            ]
        },
        {
            id: 'kaffrine',
            nom: '🌾 Kaffrine',
            departements: [
                {
                    id: 'kaffrine-dept',
                    nom: 'Kaffrine',
                    communes: [
                        'Kaffrine',
                        'Birkelane',
                        'Guelémendé',
                        'Katiacou',
                        'Keur Samba Kane',
                        'Médina Chérif',
                        'Ndiobène Saré'
                    ]
                },
                {
                    id: 'tambacounda-ouest-dept',
                    nom: 'Tambacounda (Ouest)',
                    communes: [
                        'Koumpentoum',
                        'Goudiry',
                        'Kolda',
                        'Vélingara'
                    ]
                }
            ]
        },
        {
            id: 'fatick',
            nom: '🐟 Fatick',
            departements: [
                {
                    id: 'fatick-dept',
                    nom: 'Fatick',
                    communes: [
                        'Fatick',
                        'Dioffior',
                        'Diaoulé',
                        'Kaoutal',
                        'Keur Saloum Diane',
                        'Missirah',
                        'Ndioup',
                        'Ouadioiré',
                        'Sibassor'
                    ]
                },
                {
                    id: 'foundiougne-dept',
                    nom: 'Foundiougne',
                    communes: [
                        'Foundiougne',
                        'Fimela',
                        'Karang Poste',
                        'Nioro Alioune Tall',
                        'Passe',
                        'Rip'
                    ]
                }
            ]
        },
        {
            id: 'kolda',
            nom: '🌳 Kolda',
            departements: [
                {
                    id: 'kolda-dept',
                    nom: 'Kolda',
                    communes: [
                        'Kolda',
                        'Dialacoto',
                        'Guédé Village',
                        'Mampatim',
                        'Médina Chérif',
                        'Sandougou',
                        'Saroula',
                        'Sylla',
                        'Taïba',
                        'Tankanto Tassere'
                    ]
                },
                {
                    id: 'velingara-dept',
                    nom: 'Vélingara',
                    communes: [
                        'Vélingara',
                        'Bonconto',
                        'Dialambéré',
                        'Diattacounda',
                        'Karantaba',
                        'Koussanar',
                        'Niaguis',
                        'Oubadji'
                    ]
                }
            ]
        },
        {
            id: 'ziguinchor',
            nom: '🌴 Ziguinchor',
            departements: [
                {
                    id: 'ziguinchor-dept',
                    nom: 'Ziguinchor',
                    communes: [
                        'Ziguinchor',
                        'Enampore',
                        'Niaguis',
                        'Sédimot',
                        'Tendouck'
                    ]
                },
                {
                    id: 'bignona-dept',
                    nom: 'Bignona',
                    communes: [
                        'Bignona',
                        'Djioulou',
                        'Kafountine',
                        'Kabrousse',
                        'Thionck-Essyl',
                        'Mpack'
                    ]
                },
                {
                    id: 'oussouye-dept',
                    nom: 'Oussouye',
                    communes: [
                        'Oussouye',
                        'Ascou',
                        'Cap Skirring',
                        'Diembereng',
                        'Elinkine',
                        'Kartiack',
                        'Kaguit',
                        'Pointe Saint-Georges'
                    ]
                }
            ]
        },
        {
            id: 'sédhiou',
            nom: '🏞️ Sédhiou',
            departements: [
                {
                    id: 'sédhiou-dept',
                    nom: 'Sédhiou',
                    communes: [
                        'Sédhiou',
                        'Bounkiling',
                        'Goudomp',
                        'Inor',
                        'Madina Gounass',
                        'Medina Chérif',
                        'Timbi Madina',
                        'Touba'
                    ]
                }
            ]
        },
        {
            id: 'tambacounda',
            nom: '🏜️ Tambacounda',
            departements: [
                {
                    id: 'tambacounda-dept',
                    nom: 'Tambacounda',
                    communes: [
                        'Tambacounda',
                        'Aéré Lao',
                        'Dahra Salam Alioune Tall',
                        'Hamady Adjahé',
                        'Massakouré',
                        'Mbemba',
                        'Mbarki',
                        'Mborona',
                        'Ndiamtoucouba',
                        'Samenti',
                        'Taibéla',
                        'Wouro Ndiaye'
                    ]
                },
                {
                    id: 'goudiry-dept',
                    nom: 'Goudiry',
                    communes: [
                        'Goudiry',
                        'Bamedji',
                        'Bouda',
                        'Gourbassi',
                        'Kaléséya',
                        'Sénoudébou',
                        'Stilikélé'
                    ]
                },
                {
                    id: 'matam-dept',
                    nom: 'Matam',
                    communes: [
                        'Matam',
                        'Araouane',
                        'Gourbassi',
                        'Kanel',
                        'Léor',
                        'Ounane',
                        'Ourossogui',
                        'Ranérou'
                    ]
                }
            ]
        },
        {
            id: 'saint-louis',
            nom: '🏛️ Saint-Louis',
            departements: [
                {
                    id: 'saint-louis-dept',
                    nom: 'Saint-Louis',
                    communes: [
                        'Saint-Louis',
                        'Dagana',
                        'Gandon',
                        'Guet Ndar',
                        'Leybar',
                        'Ndiébène Peul',
                        'Thiougoune',
                        'Yèguere'
                    ]
                },
                {
                    id: 'podor-dept',
                    nom: 'Podor',
                    communes: [
                        'Podor',
                        'Aéré Lao',
                        'Made',
                        'Mboula',
                        'Orkadiéré',
                        'Ross Béthio',
                        'Seck'
                    ]
                }
            ]
        },
        {
            id: 'louga',
            nom: '🌆 Louga',
            departements: [
                {
                    id: 'louga-dept',
                    nom: 'Louga',
                    communes: [
                        'Louga',
                        'Gimbéoty',
                        'Guet Ndar',
                        'Kébémer',
                        'Mboula',
                        'Nguidilé',
                        'Samba Dia',
                        'Tégounga',
                        'Youkoulountou'
                    ]
                },
                {
                    id: 'linguere-dept',
                    nom: 'Linguère',
                    communes: [
                        'Linguère',
                        'Dekhlé',
                        'Kamb',
                        'Labgar',
                        'Labé',
                        'Meïssa Boubacar',
                        'Widou Thiengoli',
                        'Yanégol'
                    ]
                }
            ]
        },
        {
            id: 'diourbel',
            nom: '🕌 Diourbel',
            departements: [
                {
                    id: 'diourbel-dept',
                    nom: 'Diourbel',
                    communes: [
                        'Diourbel',
                        'Bambey',
                        'Gueoul',
                        'Mbassi',
                        'Ngoye',
                        'Patsyndé',
                        'Pout',
                        'Taïba Ndiaye',
                        'Thérèigne'
                    ]
                },
                {
                    id: 'mbacké-dept',
                    nom: 'Mbacké',
                    communes: [
                        'Mbacké',
                        'Dara',
                        'Darou Mousty',
                        'Darou Sarham',
                        'Madaméya',
                        'Médina Yacine',
                        'Sare Thiandioun',
                        'Touba',
                        'Waliwaré'
                    ]
                }
            ]
        },
        {
            id: 'kaolack-région',
            nom: '🏴 Kaolack (Région)',
            departements: [
                {
                    id: 'kaolack-région-dept',
                    nom: 'Kaolack',
                    communes: [
                        'Kaolack',
                        'Guinguinéo',
                        'Mampatim',
                        'Ndiobène Saré',
                        'Sibassor',
                        'Taïba',
                        'Tankanto Tassere'
                    ]
                },
                {
                    id: 'sokone-dept',
                    nom: 'Sokone',
                    communes: [
                        'Sokone',
                        'Dioffior',
                        'Kaoutal',
                        'Missirah',
                        'Ouadioiré'
                    ]
                }
            ]
        }
    ]
};

/**
 * Fonction pour obtenir les départements d'une région
 */
function getDepartements(regionId) {
    const region = SENEGAL_DATA.regions.find(r => r.id === regionId);
    return region ? region.departements : [];
}

/**
 * Fonction pour obtenir les communes d'un département
 */
function getCommunes(regionId, departementId) {
    const region = SENEGAL_DATA.regions.find(r => r.id === regionId);
    if (!region) return [];
    
    const departement = region.departements.find(d => d.id === departementId);
    return departement ? departement.communes : [];
}

/**
 * Fonction pour obtenir toutes les régions
 */
function getRegions() {
    return SENEGAL_DATA.regions.map(r => ({
        id: r.id,
        nom: r.nom
    }));
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SENEGAL_DATA,
        getRegions,
        getDepartements,
        getCommunes
    };
}
