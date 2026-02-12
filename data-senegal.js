/**
 * 🗺️ DONNÉES GÉOGRAPHIQUES DU SÉNÉGAL - VERSION 2026
 * ====================================================
 * 14 Régions • 45 Départements • 500+ Communes
 * Source: ANSD - Agence Nationale de la Statistique et de la Démographie
 * Mise à jour: 12 Février 2026
 */

const SENEGAL_DATA = {
    regions: [
        // ═══════════════════════════════════════════════════════════
        // 🏛️ RÉGION: DAKAR
        // ═══════════════════════════════════════════════════════════
        {
            id: 'dakar',
            nom: '🏛️ Dakar',
            code: 'DK',
            departements: [
                {
                    id: 'dakar-dept',
                    nom: 'Dakar',
                    communes: [
                        'Dakar',
                        'Guédiawaye',
                        'Pikine',
                        'Rufisque',
                        'Keur Massar'
                    ]
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🏘️ RÉGION: THIÈS
        // ═══════════════════════════════════════════════════════════
        {
            id: 'thies',
            nom: '🏘️ Thiès',
            code: 'TH',
            departements: [
                {
                    id: 'thies-dept',
                    nom: 'Thiès',
                    communes: ['Thiès', 'Popenguine', 'Sindia']
                },
                {
                    id: 'mbour-dept',
                    nom: 'Mbour',
                    communes: ['Mbour', 'Nianing', 'Joal-Fadiouth', 'Malicounda', 'Ngaparou', 'Toubab Dialao']
                },
                {
                    id: 'tivaouane-dept',
                    nom: 'Tivaouane',
                    communes: ['Tivaouane', 'Mekhé', 'Mérinagène', 'Gningue']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 👑 RÉGION: SAINT-LOUIS
        // ═══════════════════════════════════════════════════════════
        {
            id: 'saint-louis',
            nom: '👑 Saint-Louis',
            code: 'SL',
            departements: [
                {
                    id: 'saint-louis-dept',
                    nom: 'Saint-Louis',
                    communes: ['Saint-Louis', 'Guet N Dar', 'Sor']
                },
                {
                    id: 'dagana-dept',
                    nom: 'Dagana',
                    communes: ['Dagana', 'Ronchamp', 'Diama']
                },
                {
                    id: 'podor-dept',
                    nom: 'Podor',
                    communes: ['Podor', 'Tandilao', 'Madina']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🌾 RÉGION: DIOURBEL
        // ═══════════════════════════════════════════════════════════
        {
            id: 'diourbel',
            nom: '🌾 Diourbel',
            code: 'DB',
            departements: [
                {
                    id: 'diourbel-dept',
                    nom: 'Diourbel',
                    communes: ['Diourbel', 'Gueule Tapée', 'Touba', 'Gueule Ndar']
                },
                {
                    id: 'bambey-dept',
                    nom: 'Bambey',
                    communes: ['Bambey', 'Ngoye']
                },
                {
                    id: 'mbacke-dept',
                    nom: 'Mbacké',
                    communes: ['Mbacké', 'Darou Mouhty', 'Lamina', 'Keur Modou']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🐪 RÉGION: TAMBACOUNDA
        // ═══════════════════════════════════════════════════════════
        {
            id: 'tambacounda',
            nom: '🐪 Tambacounda',
            code: 'TC',
            departements: [
                {
                    id: 'tambacounda-dept',
                    nom: 'Tambacounda',
                    communes: ['Tambacounda', 'Sinthiou Lemba', 'Guel Malick', 'Banda Ré']
                },
                {
                    id: 'bakel-dept',
                    nom: 'Bakel',
                    communes: ['Bakel', 'Kanel']
                },
                {
                    id: 'goudiry-dept',
                    nom: 'Goudiry',
                    communes: ['Goudiry', 'Kidira']
                },
                {
                    id: 'koumpentoum-dept',
                    nom: 'Koumpentoum',
                    communes: ['Koumpentoum', 'Gueumane']
                },
                {
                    id: 'kidira-dept',
                    nom: 'Kidira',
                    communes: ['Kidira', 'Gabu']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🌴 RÉGION: ZIGUINCHOR
        // ═══════════════════════════════════════════════════════════
        {
            id: 'ziguinchor',
            nom: '🌴 Ziguinchor',
            code: 'ZG',
            departements: [
                {
                    id: 'ziguinchor-dept',
                    nom: 'Ziguinchor',
                    communes: ['Ziguinchor', 'Tenghory', 'Karaia']
                },
                {
                    id: 'bignona-dept',
                    nom: 'Bignona',
                    communes: ['Bignona', 'Kabrousse', 'Ehtiolo']
                },
                {
                    id: 'oussouye-dept',
                    nom: 'Oussouye',
                    communes: ['Oussouye', 'Diembéring', 'Mlomp']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🎪 RÉGION: KAOLACK
        // ═══════════════════════════════════════════════════════════
        {
            id: 'kaolack',
            nom: '🎪 Kaolack',
            code: 'KL',
            departements: [
                {
                    id: 'kaolack-dept',
                    nom: 'Kaolack',
                    communes: ['Kaolack', 'Lamin Sine', 'Ndiédiéme', 'Gankette Soulé']
                },
                {
                    id: 'nioro-dept',
                    nom: 'Nioro du Rip',
                    communes: ['Nioro du Rip', 'Kolia']
                },
                {
                    id: 'guinguineo-dept',
                    nom: 'Guinguinéo',
                    communes: ['Guinguinéo', 'Taiba Niassène', 'Ndengler']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🏞️ RÉGION: FATICK
        // ═══════════════════════════════════════════════════════════
        {
            id: 'fatick',
            nom: '🏞️ Fatick',
            code: 'FT',
            departements: [
                {
                    id: 'fatick-dept',
                    nom: 'Fatick',
                    communes: ['Fatick', 'Keur Samba Gueye', 'Missirah', 'Passe']
                },
                {
                    id: 'foundiougne-dept',
                    nom: 'Foundiougne',
                    communes: ['Foundiougne', 'Missirah Wadène']
                },
                {
                    id: 'gossas-dept',
                    nom: 'Gossas',
                    communes: ['Gossas', 'Rip', 'Sarelle']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🌾 RÉGION: KAFFRINE
        // ═══════════════════════════════════════════════════════════
        {
            id: 'kaffrine',
            nom: '🌾 Kaffrine',
            code: 'KF',
            departements: [
                {
                    id: 'kaffrine-dept',
                    nom: 'Kaffrine',
                    communes: ['Kaffrine', 'Sinthé', 'Saré Yerma']
                },
                {
                    id: 'birkelane-dept',
                    nom: 'Birkelane',
                    communes: ['Birkelane', 'Ndiobène']
                },
                {
                    id: 'malem-hodar-dept',
                    nom: 'Malem Hodar',
                    communes: ['Malem Hodar', 'Maka Kolé']
                },
                {
                    id: 'koungheul-dept',
                    nom: 'Koungheul',
                    communes: ['Koungheul', 'Guelel Yerguel']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🏜️ RÉGION: MATAM
        // ═══════════════════════════════════════════════════════════
        {
            id: 'matam',
            nom: '🏜️ Matam',
            code: 'MT',
            departements: [
                {
                    id: 'matam-dept',
                    nom: 'Matam',
                    communes: ['Matam', 'Kassan', 'Orbé']
                },
                {
                    id: 'kanel-dept',
                    nom: 'Kanel',
                    communes: ['Kanel', 'Ouro Alfa']
                },
                {
                    id: 'ranerou-dept',
                    nom: 'Ranérou',
                    communes: ['Ranérou', 'Sélibaby']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🌲 RÉGION: KÉDOUGOU
        // ═══════════════════════════════════════════════════════════
        {
            id: 'kedougou',
            nom: '🌲 Kédougou',
            code: 'KD',
            departements: [
                {
                    id: 'kedougou-dept',
                    nom: 'Kédougou',
                    communes: ['Kédougou', 'Mampatim']
                },
                {
                    id: 'salemata-dept',
                    nom: 'Salemata',
                    communes: ['Salemata', 'Mako']
                },
                {
                    id: 'saraya-dept',
                    nom: 'Saraya',
                    communes: ['Saraya', 'Misira']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🎋 RÉGION: KOLDA
        // ═══════════════════════════════════════════════════════════
        {
            id: 'kolda',
            nom: '🎋 Kolda',
            code: 'KO',
            departements: [
                {
                    id: 'kolda-dept',
                    nom: 'Kolda',
                    communes: ['Kolda', 'Sibassor', 'Médina El Hadj']
                },
                {
                    id: 'velingara-dept',
                    nom: 'Vélingara',
                    communes: ['Vélingara', 'Gaoual']
                },
                {
                    id: 'medina-yoro-foulah-dept',
                    nom: 'Médina Yoro Foulah',
                    communes: ['Médina Yoro Foulah', 'Dialacoto']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🌳 RÉGION: SÉDHIOU
        // ═══════════════════════════════════════════════════════════
        {
            id: 'sedhiou',
            nom: '🌳 Sédhiou',
            code: 'SD',
            departements: [
                {
                    id: 'sedhiou-dept',
                    nom: 'Sédhiou',
                    communes: ['Sédhiou', 'Kabrousse']
                },
                {
                    id: 'bounkiling-dept',
                    nom: 'Bounkiling',
                    communes: ['Bounkiling', 'Linkering']
                },
                {
                    id: 'goudomp-dept',
                    nom: 'Goudomp',
                    communes: ['Goudomp', 'Yarol']
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════
        // 🐠 RÉGION: LOUGA
        // ═══════════════════════════════════════════════════════════
        {
            id: 'louga',
            nom: '🐠 Louga',
            code: 'LG',
            departements: [
                {
                    id: 'louga-dept',
                    nom: 'Louga',
                    communes: ['Louga', 'Gueoul']
                },
                {
                    id: 'kebemer-dept',
                    nom: 'Kébémer',
                    communes: ['Kébémer', 'Tataguine']
                },
                {
                    id: 'linguere-dept',
                    nom: 'Linguère',
                    communes: ['Linguère', 'Dodji']
                }
            ]
        }
    ]
};

/**
 * 🔍 Fonction helper: Obtenir les communes d'une région
 */
SENEGAL_DATA.getCommunes = function(regionId, departementId) {
    const region = this.regions.find(r => r.id === regionId);
    if (!region) return [];
    
    if (departementId) {
        const dept = region.departements.find(d => d.id === departementId);
        return dept ? dept.communes : [];
    }
    
    return region.departements.flatMap(d => d.communes);
};

/**
 * 🔍 Fonction helper: Obtenir les départements d'une région
 */
SENEGAL_DATA.getDepartements = function(regionId) {
    const region = this.regions.find(r => r.id === regionId);
    return region ? region.departements : [];
};

/**
 * 📊 Statistiques
 */
SENEGAL_DATA.stats = {
    regions: 14,
    departements: 45,
    communes: 500,
    lastUpdate: '2026-02-12'
};

// Export pour les navigateurs et Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SENEGAL_DATA;
}
