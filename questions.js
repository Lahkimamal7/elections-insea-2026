/**
 * INSEA / DGCT — Enquête Nationale sur la Participation Électorale (Législatives 2026)
 * Version Gamifiée, Pédagogique & Double Niveau de Lecture (Grand Public + Coin Méthodo INSEA)
 */

const SURVEY_DATA = {
    meta: {
        title: "Participation Électorale au Maroc – Législatives 2026 🗳️📊",
        framework: "Projet académique INSEA (Module Enquêtes Statistiques) · Simulation pour la DGCT",
        subtitle: "Aidez-nous à analyser les déterminants sociodémographiques, informationnels et perceptifs de la participation électorale.",
        badges: [
            { icon: "shield-check", text: "100% Anonyme & Confidentiel", color: "emerald" },
            { icon: "clock", text: "⏱️ 3-4 min chrono", color: "mint" },
            { icon: "sparkles", text: "Expérience Gamifiée & Ludique", color: "emerald" },
            { icon: "landmark", text: "Simulation DGCT / INSEA", color: "teal" }
        ]
    },

    // Stages for visual step progress
    stages: [
        { id: "profil", label: "1. Profil 👤", blocks: ["A"] },
        { id: "terrain", label: "2. Terrain 🗺️", blocks: ["B"] },
        { id: "choix", label: "3. Choix 🗳️", blocks: ["C", "D1", "D2"] },
        { id: "perceptions", label: "4. Idées 💡", blocks: ["E", "F"] },
        { id: "resultat", label: "5. Bilan 🎉", blocks: ["OUTRO"] }
    ],

    questions: {
        // ==============================================================================
        // BLOC A : CARACTÉRISTIQUES SOCIODÉMOGRAPHIQUES (Étape 1 · Profil 👤)
        // ==============================================================================
        "q1_age": {
            id: "q1_age",
            blockId: "A",
            blockName: "Étape 1 · Votre Profil Citoyen 👤",
            stageId: "profil",
            title: "Quel est votre âge ?",
            subtitle: "Faites glisser le curseur ou choisissez un raccourci rapide (18 à 85 ans)",
            type: "slider_number",
            min: 18,
            max: 85,
            default: 24,
            presets: [18, 22, 30, 45, 60, 70],
            commentary: (val) => {
                if (val <= 24) return "Jeune diplômé(e) ou étudiant(e) en plein rush ? 🎒 Bienvenue dans l'aventure !";
                if (val <= 35) return "Plein dynamisme de la trentaine : carrière et projets en pleine accélération ! 💼";
                if (val <= 55) return "La force de l'expérience et du recul citoyen sur l'évolution du pays ! 📈";
                return "La mémoire vive et la sagesse citoyenne de notre échantillon national ! 🏛️";
            },
            methodoTip: "🔬 Note INSEA : Variable continue X₁ servant au calage d'âge pour corriger le biais de non-réponse par repondération.",
            next: "q2_sexe"
        },

        "q2_sexe": {
            id: "q2_sexe",
            blockId: "A",
            blockName: "Étape 1 · Votre Profil Citoyen 👤",
            stageId: "profil",
            title: "Vous êtes...",
            subtitle: "Sélectionnez votre situation",
            type: "cards_single",
            gridCols: 3,
            options: [
                { value: "femme", label: "Une Femme", icon: "👩", desc: "Citoyenne", badge: "Femme" },
                { value: "homme", label: "Un Homme", icon: "👨", desc: "Citoyen", badge: "Homme" },
                { value: "secret", label: "Préfère garder le mystère", icon: "🎭", desc: "Réponse confidentielle", badge: "Secret" }
            ],
            commentary: (val) => {
                if (val === "femme") return "Strate féminine enregistrée ! Merci pour votre participation. ✨";
                if (val === "homme") return "Strate masculine enregistrée avec succès ! 📊";
                return "Le mystère est respecté avec le plus grand soin ! 🎭";
            },
            methodoTip: "🔬 Note INSEA : Variable binaire de stratification pour le calage sur marges HCP.",
            next: "q3_situation_pro"
        },

        "q3_situation_pro": {
            id: "q3_situation_pro",
            blockId: "A",
            blockName: "Étape 1 · Votre Profil Citoyen 👤",
            stageId: "profil",
            title: "Quelle est votre activité principale aujourd'hui ?",
            subtitle: "Pour situer votre rythme de vie au quotidien",
            type: "cards_single",
            gridCols: 3,
            options: [
                { value: "etudiant", label: "Étudiant(e)", icon: "🎒", desc: "Études supérieures, lycée, formation", badge: "Étudiant" },
                { value: "public", label: "Salarié(e) du public", icon: "🏛️", desc: "Administration, santé, éducation, fonction publique", badge: "Public" },
                { value: "prive", label: "Salarié(e) du privé", icon: "💼", desc: "Entreprise, PME, start-up, multinationales", badge: "Privé" },
                { value: "independant", label: "Indépendant / Entrepreneur", icon: "🚀", desc: "Profession libérale, artisan, commerçant", badge: "Pro / Freelance" },
                { value: "enseignant_chercheur", label: "Enseignant / Chercheur", icon: "🔬", desc: "Monde académique et recherche", badge: "Enseignement" },
                { value: "chomage", label: "En recherche d'emploi", icon: "🔍", desc: "En quête d'une nouvelle opportunité", badge: "Recherche" },
                { value: "retraite", label: "Retraité(e)", icon: "☕", desc: "Plein temps pour soi et pour la famille", badge: "Retraite" },
                { value: "foyer", label: "Au foyer", icon: "🏡", desc: "Gestion indispensable du foyer familial", badge: "Foyer" },
                { value: "autre", label: "Autre situation", icon: "🌐", desc: "Activités diverses ou saisonnières", badge: "Autre" }
            ],
            commentary: (val) => {
                if (val === "etudiant") return "Étudiant(e) : la génération montante qui façonnera les décisions de demain ! 🎒";
                if (val === "public" || val === "prive") return "Actif salarié : jongler entre boulot, transports et citoyenneté ! 💼";
                if (val === "independant") return "Entrepreneur / Indépendant : l'énergie créatrice du tissu économique ! 🚀";
                if (val === "retraite") return "Le temps mérité pour observer et conseiller les plus jeunes ! ☕";
                return "Situation bien enregistrée dans notre panel diversifié ! 📊";
            },
            methodoTip: "🔬 Note INSEA : Variable nominale à 9 modalités servant au calcul du coût d'opportunité civique.",
            next: "q4_niveau_etudes"
        },

        "q4_niveau_etudes": {
            id: "q4_niveau_etudes",
            blockId: "A",
            blockName: "Étape 1 · Votre Profil Citoyen 👤",
            stageId: "profil",
            title: "Votre parcours d'études le plus élevé",
            subtitle: "Quel diplôme ou niveau avez-vous atteint ?",
            type: "cards_single",
            gridCols: 2,
            options: [
                { value: "secondaire_ou_moins", label: "Secondaire ou équivalent", icon: "🏫", desc: "Collège, Lycée ou apprentissage pratique", badge: "≤ Bac" },
                { value: "bac", label: "Baccalauréat", icon: "📜", desc: "Le précieux sésame de fin de lycée", badge: "Bac" },
                { value: "bac_plus_2_3", label: "Bac +2 / Bac +3", icon: "🎓", desc: "Licence, BTS, DUT, classes prépas", badge: "Bac+2/3" },
                { value: "bac_plus_5", label: "Bac +5 (Master / Ingénieur)", icon: "🏆", desc: "Grande École, Master, Ingénierie", badge: "Bac+5" },
                { value: "doctorat", label: "Doctorat / Chercheur", icon: "🏛️", desc: "Thèse doctorale, recherche de pointe", badge: "Doctorat" }
            ],
            commentary: (val) => {
                return "Parcours validé ! Le niveau d'études est un classique pour mesurer la sensibilité aux programmes politiques. 🎓";
            },
            methodoTip: "🔬 Note INSEA : Test du lien d'association avec le sentiment de compétence politique.",
            next: "q5_residence"
        },

        "q5_residence": {
            id: "q5_residence",
            blockId: "A",
            blockName: "Étape 1 · Votre Profil Citoyen 👤",
            stageId: "profil",
            title: "Où vivez-vous principalement ?",
            subtitle: "Votre cadre de vie habituel",
            type: "cards_single",
            gridCols: 2,
            options: [
                { value: "urbain", label: "En Ville (Milieu Urbain)", icon: "🏙️", desc: "Casablanca, Rabat, Fès, Tanger, Marrakech...", badge: "Ville" },
                { value: "periurbain", label: "Périphérie Urbaine / Banlieue", icon: "🏘️", desc: "Zone périphérique, nouvelle ville, agglomération", badge: "Périurbain" },
                { value: "rural", label: "Campagne / Village (Milieu Rural)", icon: "🌄", desc: "Commune rurale, bourg, village", badge: "Rural" },
                { value: "mre", label: "Résident(e) à l'étranger (MRE)", icon: "✈️", desc: "Marocains Résidant à l'Étranger / Diaspora", badge: "MRE ✈️", theme: "emerald" }
            ],
            commentary: (val) => {
                if (val === "mre") return "La diaspora MRE en force ! Le décalage horaire ne coupe pas le lien avec le pays ✈️.";
                if (val === "rural") return "Le monde rural : des liens de proximité forts et une réalité locale concrète ! 🌄";
                if (val === "urbain") return "Le rythme urbain : une multitude d'idées et de débats au quotidien ! 🏙️";
                return "Cadre périurbain : la dynamique des villes nouvelles en pleine expansion ! 🏘️";
            },
            methodoTip: "🔬 Note INSEA : Variable spatiale clé pour évaluer la distance physique aux centres de vote.",
            next: "q6_niveau_vie"
        },

        "q6_niveau_vie": {
            id: "q6_niveau_vie",
            blockId: "A",
            blockName: "Étape 1 · Votre Profil Citoyen 👤",
            stageId: "profil",
            title: "Sur le plan financier, comment qualifieriez-vous votre quotidien ?",
            subtitle: "Une estimation en toute simplicité (sans aucun montant demandé)",
            type: "cards_single",
            gridCols: 2,
            options: [
                { value: "modeste", label: "Plutôt Modeste 🪙", icon: "🪙", desc: "Il faut bien calculer chaque dépense", badge: "Budget serré" },
                { value: "moyen", label: "Équilibré & Moyen ⚖️", icon: "⚖️", desc: "On s'en sort convenablement au mois le mois", badge: "Standard" },
                { value: "confortable", label: "Confortable & Serein 💎", icon: "💎", desc: "Capacité d'épargne et projets sereins", badge: "Confortable" },
                { value: "secret", label: "Préfère ne pas le dire 🔒", icon: "🔒", desc: "Jardin secret préservé", badge: "Privé" }
            ],
            commentary: (val) => {
                return "C'est noté ! Cette question permet d'évaluer si le pouvoir d'achat influence les priorités électorales. ⚖️";
            },
            methodoTip: "🔬 Note INSEA : Variable ordinale socio-économique pour tester l'élasticité de l'intérêt politique.",
            next: "q7_bureau_vote"
        },

        // ==============================================================================
        // BLOC B : EXPOSITION & INSCRIPTION (Étape 2 · Terrain 🗺️)
        // ==============================================================================
        "q7_bureau_vote": {
            id: "q7_bureau_vote",
            blockId: "B",
            blockName: "Étape 2 · L'Accès au Terrain 🗺️",
            stageId: "terrain",
            title: "Saviez-vous où voter le 23 septembre 2026 ?",
            subtitle: "Connaissiez-vous l'adresse de votre école, bureau de vote ou consulat ?",
            type: "cards_single",
            gridCols: 2,
            options: [
                { value: "exact", label: "Oui, lieu exact bien identifié ! 📍", icon: "🎯", desc: "Je savais exactement dans quelle salle ou école me rendre", badge: "Info Parfaite" },
                { value: "vague", label: "Je savais qu'il y avait vote, mais pas où 🧭", icon: "🧭", desc: "L'info du lieu précis m'a manqué", badge: "Flou spatial" },
                { value: "jour_j", label: "Découvert le jour même sur les réseaux 📱", icon: "📱", desc: "Une story ou un message m'a rappelé le vote", badge: "Dernière minute" },
                { value: "aucune", label: "Aucune information reçue 🙈", icon: "🚫", desc: "Pas au courant des détails pratiques", badge: "Zéro info" }
            ],
            commentary: (val) => {
                if (val === "exact") return "GPS citoyen au point ! Localisation maîtrisée à 100% 🎯.";
                if (val === "vague" || val === "aucune") return "Amnésie électorale détectée 🧠 ! C'est classique : sans SMS ou repère clair, l'info se perd.";
                return "Le coup de projecteur de dernière minute grâce aux réseaux sociaux ! 📱";
            },
            methodoTip: "🔬 Note INSEA : Variable de friction spatiale et coût informationnel d'accès au vote.",
            next: "q8_inscription"
        },

        "q8_inscription": {
            id: "q8_inscription",
            blockId: "B",
            blockName: "Étape 2 · L'Accès au Terrain 🗺️",
            stageId: "terrain",
            title: "Étiez-vous inscrit(e) sur les listes électorales officielles ?",
            subtitle: "La formalité indispensable pour pouvoir voter",
            type: "cards_single",
            gridCols: 2,
            options: [
                { value: "inscrit", label: "Oui, parfaitement inscrit(e) ✅", icon: "📋", desc: "Sur les listes générales ou consulaires", badge: "Inscrit(e)" },
                { value: "non_inscrit", label: "Non, pas inscrit(e) (Au Maroc) ❌", icon: "❌", desc: "Démarche d'inscription non effectuée", badge: "Non-inscrit" },
                { value: "non_inscrit_mre", label: "Non inscrit(e) car résident à l'étranger (MRE) ✈️", icon: "✈️", desc: "Éloignement géographique et démarches consulaires", badge: "MRE", theme: "teal" },
                { value: "incertain", label: "Je ne sais pas trop / Incertain(e) ❓", icon: "❓", desc: "Un doute sur la validité de l'inscription", badge: "Incertain" },
                { value: "ineligible", label: "Statut professionnel non éligible (Forces armées, Militaires, etc.) 🛡️", icon: "🛡️", desc: "Non-éligibilité légale au vote par fonction", badge: "Forces de l'ordre", theme: "amber" }
            ],
            commentary: (val) => {
                if (val === "ineligible") return "Au service de la patrie ! 🛡️ Redirection automatique vers vos perceptions citoyennes pour préserver la rigueur du modèle de vote 😉.";
                if (val === "non_inscrit_mre") return "La distance consulaire : une réalité bien connue pour nos concitoyens à l'étranger ✈️.";
                if (val === "inscrit") return "Feu vert électoral : vous étiez en règle pour voter le 23 septembre ! ✅";
                return "Pas d'inscription = pas de bulletin : le premier verrou de la participation citoyenne ! ❌";
            },
            methodoTip: "🔬 Note INSEA : Branchement automatique. Les non-éligibles sautent Q9 directement vers Bloc E.",
            next: (answers) => {
                if (answers["q8_inscription"] === "ineligible") {
                    return "q14_comprehension"; // Saut direct vers le Bloc E
                }
                return "q9_vote";
            }
        },

        // ==============================================================================
        // BLOC C : COMPORTEMENT ÉLECTORAL (Étape 3 · Le Choix 🗳️)
        // ==============================================================================
        "q9_vote": {
            id: "q9_vote",
            blockId: "C",
            blockName: "Étape 3 · Le Choix Électoral 🗳️",
            stageId: "choix",
            title: "Le 23 septembre 2026 : Avez-vous voté aux Législatives ?",
            subtitle: "Sans tabou et en toute franchise (rappel : l'enquête est 100% anonyme)",
            type: "branching_choice",
            options: [
                {
                    value: "oui",
                    label: "Oui, j'ai glissé mon bulletin dans l'urne ! 🗳️",
                    icon: "🗳️",
                    desc: "J'ai participé au scrutin du 23 septembre 2026",
                    badge: "Votant(e)",
                    target: "q10_raison_vote",
                    theme: "emerald"
                },
                {
                    value: "non",
                    label: "Non, je n'ai pas voté cette fois-ci 🛑",
                    icon: "🛑",
                    desc: "Abstention (choix délibéré, contrainte ou empêchement)",
                    badge: "Abstention",
                    target: "q12_raison_abstention",
                    theme: "rose"
                },
                {
                    value: "secret",
                    label: "Je garde le secret de l'isoloir 🤫",
                    icon: "🔒",
                    desc: "Secret personnel préservé",
                    badge: "Confidentiel",
                    target: "q14_comprehension",
                    theme: "amber"
                }
            ],
            commentary: (val) => {
                if (val === "oui") return "Bulletin dans l'urne ! Bravo pour votre acte citoyen 🗳️.";
                if (val === "non") return "C'est noté ! Comprendre les raisons du non-vote est capital pour faire progresser les institutions.";
                return "Le secret de l'isoloir est sacré ! Passage direct à vos avis généraux 🔒.";
            },
            methodoTip: "🔬 Note INSEA : Variable dépendante Y (0/1). Déclenche le sous-arbre D1 (Votants) ou D2 (Abstentionnistes).",
            next: (answers) => {
                const choice = answers["q9_vote"];
                if (choice === "oui") return "q10_raison_vote";
                if (choice === "non") return "q12_raison_abstention";
                return "q14_comprehension";
            }
        },

        // ==============================================================================
        // BLOC D1 : POUR LES VOTANTS (Si Oui à Q9)
        // ==============================================================================
        "q10_raison_vote": {
            id: "q10_raison_vote",
            blockId: "D1",
            blockName: "Étape 3 · Pourquoi avez-vous voté ? 🗳️",
            stageId: "choix",
            title: "Qu'est-ce qui vous a principalement motivé(e) à voter ?",
            subtitle: "Votre moteur personnel le 23 septembre",
            type: "cards_single",
            gridCols: 2,
            options: [
                { value: "devoir_civique", label: "Le Devoir Civique & Citoyen 🇲🇦", icon: "🏛️", desc: "Pour faire vivre notre démocratie et notre pays", badge: "Civisme" },
                { value: "choix_representants", label: "Choisir les bons représentants 🎯", icon: "🎯", desc: "Pour peser sur les lois et les élus de demain", badge: "Impact" },
                { value: "interets_socio_eco", label: "Défendre mes idées & mon quotidien 📈", icon: "💼", desc: "Soutenir un programme économique ou social précis", badge: "Projets" },
                { value: "habitude", label: "Une habitude bien ancrée 🔄", icon: "⏰", desc: "Je vote systématiquement à chaque élection", badge: "Habitude" },
                { value: "entourage", label: "Encouragé(e) par la famille & les amis 👥", icon: "🤝", desc: "L'effet d'entraînement des proches", badge: "Entourage" },
                { value: "autre", label: "Autre conviction personnelle 💡", icon: "✨", desc: "Raison propre ou vote d'expression", badge: "Autre" }
            ],
            commentary: (val) => {
                if (val === "devoir_civique") return "La flamme civique : le socle de base de toute société démocratique ! 🇲🇦";
                if (val === "choix_representants") return "Vouloir peser sur les choix : l'essence même du suffrage universel ! 🎯";
                return "Motivation enregistrée ! Voyons maintenant comment vous percevez l'impact de ce geste. 📊";
            },
            methodoTip: "🔬 Note INSEA : Facteur motivationnel dominant dans la fonction d'utilité espérée.",
            next: "q11_efficacite_politique"
        },

        "q11_efficacite_politique": {
            id: "q11_efficacite_politique",
            blockId: "D1",
            blockName: "Étape 3 · L'Impact de Votre Vote 🗳️",
            stageId: "choix",
            title: "« Pensez-vous que votre vote a un réel impact sur les décisions publiques ? »",
            subtitle: "Donnez votre ressenti sincère de 1 (Aucun impact) à 5 (Impact décisif)",
            type: "rating_stars",
            min: 1,
            max: 5,
            default: 3,
            labels: {
                1: "1 ★ — Aucun impact ressenti (Geste symbolique)",
                2: "2 ★ — Faible influence sur les décisions réelles",
                3: "3 ★ — Impact modéré (Une voix parmi d'autres)",
                4: "4 ★ — Forte influence sur les orientations publiques",
                5: "5 ★ — Impact décisif et direct sur l'avenir du pays !"
            },
            commentary: (val) => {
                if (val <= 2) return "Vous votez par principe tout en restant lucide et exigeant envers les résultats : respect ! ⚖️";
                if (val >= 4) return "Une confiance enthousiaste dans le pouvoir du bulletin de vote ! 🚀";
                return "Un regard pragmatique et équilibré sur le fonctionnement démocratique. 📊";
            },
            methodoTip: "🔬 Note INSEA : Mesure de l'efficacité politique interne/externe sur échelle de Likert.",
            next: "q14_comprehension"
        },

        // ==============================================================================
        // BLOC D2 : POUR LES ABSTENTIONNISTES (Si Non à Q9)
        // ==============================================================================
        "q12_raison_abstention": {
            id: "q12_raison_abstention",
            blockId: "D2",
            blockName: "Étape 3 · Comprendre l'Abstention 🛑",
            stageId: "choix",
            title: "Quelle a été la raison principale de votre abstention ?",
            subtitle: "Pour que les institutions comprennent les vrais freins",
            type: "cards_single",
            gridCols: 2,
            options: [
                { value: "eloignement_mre", label: "Éloignement géographique / Résidence à l'étranger (MRE) ✈️", icon: "✈️", desc: "Distance, absence de consulat proche ou contraintes de déplacement", badge: "MRE / Distance", theme: "teal" },
                { value: "offre_politique", label: "L'offre politique ne me convainc pas 📉", icon: "🥱", desc: "Programmes décevants, manque de renouveau ou de candidats inspirants", badge: "Offre" },
                { value: "manque_confiance", label: "Manque de confiance dans les promesses 🛡️", icon: "🛡️", desc: "Sentiment que les engagements pris ne seront pas tenus", badge: "Défiance" },
                { value: "manque_information", label: "Manque d'information claire sur les candidats 🗞️", icon: "🔍", desc: "Campagne illisible, propositions peu visibles", badge: "Info" },
                { value: "vote_inutile", label: "Sentiment que mon vote ne changera rien 🧮", icon: "📐", desc: "Une impression d'inutilité face au système", badge: "Inutilité" },
                { value: "indisponibilite", label: "Empêchement, travail ou raisons personnelles ⏳", icon: "🚗", desc: "Pas disponible le 23 septembre (travail, famille, imprévu)", badge: "Imprévu" },
                { value: "autre", label: "Autre raison personnelle 💡", icon: "✨", desc: "Une raison spécifique à ma situation", badge: "Autre" }
            ],
            commentary: (val) => {
                if (val === "eloignement_mre") return "La distance géographique : un frein bien réel qui mérite des solutions digitales ou consulaires adaptées ! ✈️";
                if (val === "offre_politique") return "Attente d'idées neuves et de visages inspirants : message clair reçu 5/5 ! 📉";
                if (val === "manque_confiance") return "Le besoin de preuves concrètes avant de s'engager : une exigence tout à fait saine. 🛡️";
                if (val === "indisponibilite") return "Le rush du quotidien et les imprévus du dimanche : c'est la vie ! ⏳";
                return "Votre retour est précieux pour documenter les pistes d'amélioration pour la DGCT. 🔍";
            },
            methodoTip: "🔬 Note INSEA : Typologie des motifs d'abstention (structurelle, informationnelle, ou frictionnelle).",
            next: "q13_counterfactual"
        },

        "q13_counterfactual": {
            id: "q13_counterfactual",
            blockId: "D2",
            blockName: "Étape 3 · Et si c'était à refaire ? 🛑",
            stageId: "choix",
            title: "Si les programmes étaient mieux expliqués et chiffrés, auriez-vous voté ?",
            subtitle: "Une question pour mesurer si l'information claire ferait la différence",
            type: "cards_single",
            gridCols: 2,
            options: [
                { value: "1", label: "Certainement pas 🛑", icon: "🛑", desc: "Mon abstention repose sur d'autres raisons de fond", badge: "Non" },
                { value: "2", label: "Peu probable 🤔", icon: "🤔", desc: "L'information seule n'aurait pas suffi à me déplacer", badge: "Faible" },
                { value: "3", label: "Probablement oui 💡", icon: "💡", desc: "Des propositions claires auraient facilité mon choix", badge: "Probable" },
                { value: "4", label: "Certainement oui 🚀", icon: "🚀", desc: "Une campagne transparente m'aurait motivé(e) !", badge: "Très probable" }
            ],
            commentary: (val) => {
                if (val >= "3") return "L'accès aux données et aux bilans : un levier majeur pour vous convaincre de participer ! 💡";
                return "C'est noté : le déclic du vote demandera des changements plus structurels. 🛡️";
            },
            methodoTip: "🔬 Note INSEA : Expérience contrefactuelle mesurant l'élasticité de la participation à la pédagogie publique.",
            next: "q14_comprehension"
        },

        // ==============================================================================
        // BLOC E : PERCEPTIONS & CONFIANCE (Étape 4 · Idées & Perceptions 💡)
        // ==============================================================================
        "q14_comprehension": {
            id: "q14_comprehension",
            blockId: "E",
            blockName: "Étape 4 · Votre Regard sur les Institutions 💡",
            stageId: "perceptions",
            title: "« Je comprends suffisamment le rôle et les enjeux des élections législatives. »",
            subtitle: "Évaluez votre niveau d'accord de 1 (Pas du tout) à 5 (Tout à fait)",
            type: "rating_stars",
            min: 1,
            max: 5,
            default: 3,
            labels: {
                1: "1 ★ — Pas du tout d'accord (C'est très flou pour moi)",
                2: "2 ★ — Plutôt pas d'accord (Connaissances très partielles)",
                3: "3 ★ — Moyennement d'accord (Je connais les grandes lignes)",
                4: "4 ★ — Plutôt d'accord (Bonne vision du rôle des députés)",
                5: "5 ★ — Tout à fait d'accord (Maîtrise parfaite des rouages parlementaires)"
            },
            commentary: (val) => {
                if (val <= 2) return "Pas de panique : la politique peut sembler complexe sans une bonne vulgarisation ! 📚";
                if (val >= 4) return "Un regard très affûté sur le rôle du Parlement et des lois ! 💡";
                return "Un niveau de compréhension dans la moyenne : les grands repères sont là. ⚖️";
            },
            methodoTip: "🔬 Note INSEA : Mesure du sentiment de compétence politique subjective.",
            next: "q15_confiance"
        },

        "q15_confiance": {
            id: "q15_confiance",
            blockId: "E",
            blockName: "Étape 4 · Votre Regard sur les Institutions 💡",
            stageId: "perceptions",
            title: "« Je fais confiance à la transparence du processus électoral. »",
            subtitle: "Votre confiance dans le déroulement et le dépouillement du scrutin (1 à 5)",
            type: "rating_stars",
            min: 1,
            max: 5,
            default: 3,
            labels: {
                1: "1 ★ — Pas du tout d'accord (Défiance importante)",
                2: "2 ★ — Plutôt pas d'accord (Plusieurs doutes)",
                3: "3 ★ — Moyennement d'accord (Confiance neutre)",
                4: "4 ★ — Plutôt d'accord (Bonne confiance dans le processus)",
                5: "5 ★ — Tout à fait d'accord (Confiance absolue dans l'intégrité du scrutin)"
            },
            commentary: (val) => {
                if (val <= 2) return "La confiance est le ciment démocratique : votre exigence de transparence est primordiale. 🛡️";
                if (val >= 4) return "Un signal positif de sérénité envers l'organisation électorale ! 🏛️";
                return "Score médian d'assurance dans le processus électoral. 📊";
            },
            methodoTip: "🔬 Note INSEA : Variable de confiance institutionnelle prédictive du vote.",
            next: "q16_preoccupations"
        },

        "q16_preoccupations": {
            id: "q16_preoccupations",
            blockId: "E",
            blockName: "Étape 4 · Votre Regard sur les Institutions 💡",
            stageId: "perceptions",
            title: "« Les préoccupations des citoyens sont suffisamment prises en compte. »",
            subtitle: "Pensez-vous que les décideurs écoutent vos priorités quotidiennes ? (1 à 5)",
            type: "rating_stars",
            min: 1,
            max: 5,
            default: 2,
            labels: {
                1: "1 ★ — Pas du tout d'accord (Sentiment de déconnexion totale)",
                2: "2 ★ — Plutôt pas d'accord (Écoute très insuffisante)",
                3: "3 ★ — Moyennement d'accord (Écoute partielle)",
                4: "4 ★ — Plutôt d'accord (Bonne prise en compte)",
                5: "5 ★ — Tout à fait d'accord (Priorités parfaitement alignées)"
            },
            commentary: (val) => {
                if (val <= 2) return "Une attente forte de proximité et de résultats tangibles sur le terrain ! 📈";
                return "Perception de réactivité institutionnelle enregistrée. 👥";
            },
            methodoTip: "🔬 Note INSEA : Mesure de la réactivité démocratique perçue (responsiveness).",
            next: "q17_norme_sociale"
        },

        "q17_norme_sociale": {
            id: "q17_norme_sociale",
            blockId: "E",
            blockName: "Étape 4 · L'Influence de Vos Proches 💡",
            stageId: "perceptions",
            title: "« Dans mon entourage proche (famille, amis, collègues), voter est fréquent. »",
            subtitle: "L'ambiance civique dans votre cercle relationnel (1 à 5)",
            type: "rating_stars",
            min: 1,
            max: 5,
            default: 3,
            labels: {
                1: "1 ★ — Presque personne ne vote autour de moi",
                2: "2 ★ — Très peu de proches participent",
                3: "3 ★ — C'est partagé à 50/50",
                4: "4 ★ — La majorité de mes proches va voter",
                5: "5 ★ — Tout le monde vote systématiquement dans mon cercle !"
            },
            commentary: (val) => {
                if (val >= 4) return "Un entourage très mobilisé : l'effet d'entraînement social à son maximum ! 🔥";
                if (val <= 2) return "L'abstention est partagée dans votre groupe : la dynamique collective compte énormément ! 🤝";
                return "Cercle relationnel équilibré et varié. 👥";
            },
            methodoTip: "🔬 Note INSEA : Effet de pairs (Peer effect) et norme sociale locale.",
            next: "q18_sources_info"
        },

        // ==============================================================================
        // BLOC F : CANAUX & QUESTION OUVERTE (Étape 4 · Idées & Recommandations 💡)
        // ==============================================================================
        "q18_sources_info": {
            id: "q18_sources_info",
            blockId: "F",
            blockName: "Étape 4 · Comment vous informez-vous ? 💡",
            stageId: "perceptions",
            title: "Votre principal canal pour suivre l'actualité électorale",
            subtitle: "D'où vous sont venues les principales informations ?",
            type: "cards_single",
            gridCols: 3,
            options: [
                { value: "reseaux_sociaux", label: "Réseaux Sociaux 📱", icon: "📱", desc: "Instagram, TikTok, Facebook, X, YouTube", badge: "Digital" },
                { value: "presse_en_ligne", label: "Presse en ligne & Web 🗞️", icon: "🗞️", desc: "Portails d'actualités, journaux en ligne", badge: "Presse Web" },
                { value: "tv_radio", label: "Télévision & Radio 📺", icon: "📺", desc: "Chaînes nationales, bulletins d'info", badge: "Classique" },
                { value: "proches_collegues", label: "Bouche-à-oreille & Proches ☕", icon: "☕", desc: "Famille, discussions au café, collègues", badge: "Proximité" },
                { value: "non_informe", label: "Diète informationnelle 🧘", icon: "🧘", desc: "Je ne suis pas du tout l'actualité politique", badge: "Sans filtre" }
            ],
            commentary: (val) => {
                if (val === "reseaux_sociaux") return "Le smartphone au cœur de l'information : immédiat et interactif ! 📱";
                if (val === "tv_radio") return "L'audiovisuel classique : les grands rendez-vous d'information ! 📺";
                if (val === "presse_en_ligne") return "La presse numérique : recherche d'analyses et de recul ! 🗞️";
                return "Canal d'information enregistré avec succès. 📡";
            },
            methodoTip: "🔬 Note INSEA : Vecteur de transmission de la campagne pour l'analyse des canaux DGCT.",
            next: "q19_question_ouverte"
        },

        "q19_question_ouverte": {
            id: "q19_question_ouverte",
            blockId: "F",
            blockName: "Étape 4 · Votre Proposition Clé 💡",
            stageId: "perceptions",
            title: "Selon vous, quelle mesure principale encouragerait les citoyens à voter ?",
            subtitle: "Votre idée ou proposition libre (même en quelques mots !)",
            type: "textarea_math",
            placeholder: "Ex: Permettre le vote électronique en ligne, rendre l'inscription automatique à 18 ans, organiser plus de débats télévisés directs, faciliter les démarches pour les MRE, rapprocher les bureaux de vote...",
            mathShortcuts: ["Vote en ligne 📲", "Inscription automatique 📋", "Débats télévisés 📺", "Transparence & Chiffres 📊", "Facilité pour les MRE ✈️", "Bureaux plus proches 📍"],
            commentary: (val) => {
                if (!val || val.length < 5) return "Même deux ou trois mots nous aideront à formuler les recommandations finales ! 📝";
                return "Idée géniale ! Votre proposition sera directement intégrée dans la synthèse qualitative. 🧠✨";
            },
            methodoTip: "🔬 Note INSEA : Donnée qualitative textuelle traitée par Topic Modeling et analyse sémantique NLP.",
            next: null // End!
        }
    },

    calculateProgress: (currentQuestionId, answers) => {
        const pathOrder = [
            "q1_age", "q2_sexe", "q3_situation_pro", "q4_niveau_etudes", "q5_residence", "q6_niveau_vie",
            "q7_bureau_vote", "q8_inscription"
        ];

        const isIneligible = answers["q8_inscription"] === "ineligible";

        if (!isIneligible) {
            pathOrder.push("q9_vote");
            const voteChoice = answers["q9_vote"];
            if (voteChoice === "oui") {
                pathOrder.push("q10_raison_vote", "q11_efficacite_politique");
            } else if (voteChoice === "non") {
                pathOrder.push("q12_raison_abstention", "q13_counterfactual");
            }
        }

        pathOrder.push(
            "q14_comprehension", "q15_confiance", "q16_preoccupations", "q17_norme_sociale",
            "q18_sources_info", "q19_question_ouverte"
        );

        const totalSteps = pathOrder.length;
        const index = pathOrder.indexOf(currentQuestionId);
        const currentStep = index >= 0 ? index + 1 : totalSteps;
        const percentage = Math.round((currentStep / totalSteps) * 100);
        const dofLeft = Math.max(0, totalSteps - currentStep);

        // Determine active stage
        const currentQ = SURVEY_DATA.questions[currentQuestionId];
        const activeStageId = currentQ ? currentQ.stageId : "profil";

        return {
            currentStep,
            totalSteps,
            percentage,
            dofLeft,
            activeStageId,
            label: `Étape ${currentStep} sur ${totalSteps} (${percentage}%)`
        };
    }
};

window.SURVEY_DATA = SURVEY_DATA;
