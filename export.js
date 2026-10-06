/**
 * Profilage Statistique Citoyen, Exports Multi-Formats & Générateur R (DGCT / INSEA)
 * Convertit les réponses en profil d'électeur, export JSON/CSV et script d'analyse économétrique R.
 */

class StatisticalProfiler {
    static generateProfile(answers) {
        const isIneligible = answers["q8_inscription"] === "ineligible" || answers["q8_inscription"] === "INELIGIBLE";
        const isMre = answers["q5_residence"] === "mre" || answers["q8_inscription"] === "non_inscrit_mre" || answers["q12_raison_abstention"] === "eloignement_mre";
        const vote = answers["q9_vote"];
        const confiance = parseInt(answers["q15_confiance"] || 3, 10);
        const comprehension = parseInt(answers["q14_comprehension"] || 3, 10);
        const situationPro = answers["q3_situation_pro"] || "etudiant";
        const age = parseInt(answers["q1_age"] || 24, 10);

        let title = "Le Citoyen Réfléchi 📊";
        let subtitle = "Profil d'engagement civique modéré";
        let quote = "« La démocratie est un processus d'agrégation des préférences qui nécessite une confiance mutuelle entre citoyens et institutions. »";
        let badge = "Indicateur Composite Équilibré";
        let icon = "award";
        let color = "emerald";

        if (isIneligible) {
            title = "Statut Non-Éligible au Vote 🛡️";
            subtitle = "Militaires, Forces de l'ordre ou statuts d'incompatibilité légale";
            quote = "« L'exercice de missions régaliennes implique la neutralité électorale, tout en maintenant une contribution citoyenne sur la perception des politiques publiques. »";
            badge = "Non-Éligibilité Légale";
            color = "amber";
            icon = "shield";

            return {
                title,
                subtitle,
                quote,
                badge,
                icon,
                color,
                probaPercent: 0,
                logitScore: "N/A (Exclu du GLM)",
                isIneligible: true
            };
        }

        if (isMre && vote !== "oui") {
            title = "Le Citoyen de la Diaspora (MRE) ✈️";
            subtitle = "Attachement national & contraintes logistiques d'éloignement";
            quote = "« La distance géographique ne diminue pas l'intérêt pour les politiques publiques marocaines et le développement des territoires. »";
            badge = "Diaspora MRE";
            color = "mint";
            icon = "plane";
        } else if (vote === "oui") {
            if (confiance >= 4 && comprehension >= 4) {
                title = "Le Citoyen Engagé & Éclairé 🏛️";
                subtitle = "Participation active fondée sur une solide compréhension des institutions";
                quote = "« Voter est à la fois un devoir civique et un outil d'orientation démocratique de l'action publique. »";
                badge = "Civisme & Confiance Élevés";
                color = "emerald";
                icon = "check-circle-2";
            } else if (answers["q10_raison_vote"] === "devoir_civique") {
                title = "Le Pilier Civique Fondamental 🇲🇦";
                subtitle = "Attachement indéfectible à la citoyenneté et au vote républicain";
                quote = "« Même dans l'incertitude, le suffrage demeure le socle irremplaçable de la cohésion nationale. »";
                badge = "Devoir Civique";
                color = "emerald";
                icon = "landmark";
            } else {
                title = "L'Électeur Pragmatique ⚖️";
                subtitle = "Participation orientée vers l'efficacité des choix de gouvernance";
                quote = "« Participer permet de peser concrètement sur les équilibres politiques et socio-économiques. »";
                badge = "Vote Stratégique";
                color = "mint";
                icon = "compass";
            }
        } else if (vote === "non") {
            if (answers["q12_raison_abstention"] === "eloignement_mre") {
                title = "Le Citoyen de la Diaspora (MRE) ✈️";
                subtitle = "Abstention contrainte par la distance et la logistique transfrontalière";
                quote = "« La participation des MRE nécessite des mécanismes consulaires simplifiés et accessibles. »";
                badge = "Diaspora MRE";
                color = "teal";
                icon = "plane";
            } else if (answers["q12_raison_abstention"] === "offre_politique") {
                title = "Le Critique de l'Offre Politique 📉";
                subtitle = "Abstention motivée par une attente de renouveau programmatique";
                quote = "« Mon abstention est un signal d'exigence : l'offre politique doit gagner en clarté et en représentativité. »";
                badge = "Exigence Démocratique";
                color = "amber";
                icon = "alert-circle";
            } else if (answers["q12_raison_abstention"] === "indisponibilite") {
                title = "Le Citoyen sous Contrainte de Mobilité 🚗";
                subtitle = "Frein logistique ou contrainte temporelle lors du scrutin";
                quote = "« L'accessibilité spatiale des bureaux de vote et la flexibilité sont des facteurs déterminants pour ma participation. »";
                badge = "Friction Spatiale";
                color = "teal";
                icon = "map-pin";
            } else if (answers["q13_counterfactual"] >= "3") {
                title = "L'Électeur Information-Dépendant 💡";
                subtitle = "Forte sensibilité aux campagnes de vulgarisation et de pédagogie";
                quote = "« Une meilleure visibilité des bilans et des programmes est le levier clé qui m'inciterait à voter. »";
                badge = "Levier Informationnel";
                color = "mint";
                icon = "sparkles";
            } else {
                title = "L'Observateur Sceptique 🛡️";
                subtitle = "Défiance vis-à-vis de l'impact réel de la décision électorale";
                quote = "« Le rétablissement de la confiance nécessite des engagements chiffrés et des résultats tangibles. »";
                badge = "Défiance Structurelle";
                color = "rose";
                icon = "shield-alert";
            }
        } else {
            title = "Le Répondant Confidentiel 🔒";
            subtitle = "Position électorale non divulguée";
            quote = "« Le secret du vote et de l'opinion politique est une composante essentielle de la liberté individuelle. »";
            badge = "Donnée Non-Divulguée";
            color = "amber";
            icon = "eye-off";
        }

        // Logistic Econometric Estimation
        let logitScore = -0.65;
        logitScore += (age - 25) * 0.04;
        if (answers["q8_inscription"] === "inscrit") logitScore += 2.1;
        if (answers["q7_bureau_vote"] === "exact") logitScore += 1.1;
        if (confiance >= 4) logitScore += 0.85;
        if (comprehension >= 4) logitScore += 0.65;
        if (answers["q17_norme_sociale"] >= 4) logitScore += 0.95;
        if (situationPro === "public" || situationPro === "retraite") logitScore += 0.5;
        if (answers["q5_residence"] === "mre") logitScore -= 0.8; // Distance friction

        const probaTheoretical = 1 / (1 + Math.exp(-logitScore));
        const probaPercent = Math.min(99, Math.max(1, Math.round(probaTheoretical * 100)));

        return {
            title,
            subtitle,
            quote,
            badge,
            icon,
            color,
            probaPercent,
            logitScore: logitScore.toFixed(2),
            isIneligible: false
        };
    }

    static getFormattedAnswers(answers) {
        const formatted = { ...answers };

        // Normalisation Residence MRE
        if (formatted["q5_residence"] === "mre") {
            formatted["Residence"] = "MRE";
            formatted["q5_residence"] = "MRE";
        }

        // Normalisation Inscription
        if (formatted["q8_inscription"] === "ineligible") {
            formatted["Inscription"] = "INELIGIBLE";
            formatted["q8_inscription"] = "INELIGIBLE";
        } else if (formatted["q8_inscription"] === "non_inscrit_mre") {
            formatted["Inscription"] = "NON_INSCRIT_MRE";
            formatted["q8_inscription"] = "NON_INSCRIT_MRE";
        }

        // Normalisation Motif Abstention
        if (formatted["q12_raison_abstention"] === "eloignement_mre") {
            formatted["Motif_Abstention"] = "ELOIGNEMENT_MRE";
            formatted["q12_raison_abstention"] = "ELOIGNEMENT_MRE";
        }

        return formatted;
    }

    static exportJSON(answers) {
        const formattedAnswers = this.getFormattedAnswers(answers);
        const payload = {
            metadata: {
                survey: "Enquête Nationale sur la Participation Électorale - Législatives 2026",
                framework: "Projet INSEA (Module Enquêtes Statistiques) / Simulation DGCT",
                timestamp: new Date().toISOString(),
                version: "2.2.0",
                format: "INSEA-DGCT-JSON-Dataset",
                methodology_note: "Inclut la codification normalisée pour les répondants MRE (Residence='MRE', Motif_Abstention='ELOIGNEMENT_MRE') et statuts régaliens (Inscription='INELIGIBLE')."
            },
            respondent_data: formattedAnswers,
            profile: this.generateProfile(answers)
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `enquete_participation_legislatives_2026_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    static exportCSV(answers) {
        const formattedAnswers = this.getFormattedAnswers(answers);
        const headers = Object.keys(formattedAnswers);
        const values = headers.map(h => {
            const val = String(formattedAnswers[h] || "").replace(/"/g, '""');
            return `"${val}"`;
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), values.join(',')].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `dataset_participation_elections_2026_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    static generateRScript(answers) {
        const rCode = `# ==============================================================================
# ENQUÊTE NATIONALE PARTICIPATION ÉLECTORALE — LÉGISLATIVES 2026
# ÉTUDE STATISTIQUE INSEA POUR LA DIRECTION GÉNÉRALE DES COLLECTIVITÉS TERRITORIALES (DGCT)
# SCRIPT D'ESTIMATION ÉCONOMÉTRIQUE & ANALYSE BIVARIÉE (INCLUANT MODULE MRE)
# ==============================================================================

# 1. Chargement des bibliothèques nécessaires
suppressPackageStartupMessages({
  library(tidyverse)  # Manipulation des données et graphiques ggplot2
  library(broom)      # Tableaux de régression au format tidy
  library(knitr)      # Tableaux formatés
  library(margins)    # Calcul des effets marginaux
})

# 2. Simulation d'un échantillon représentatif national + diaspora MRE (N = 700 observations)
set.seed(2026)
n <- 700

df_elections <- tibble(
  id = 1:n,
  age = pmax(18, round(rnorm(n, mean = 34, sd = 14))),
  sexe = sample(c("F", "H"), n, replace = TRUE, prob = c(0.50, 0.50)),
  situation_pro = sample(
    c("etudiant", "public", "prive", "independant", "chercheur", "chomage", "retraite", "foyer", "autre"),
    n, replace = TRUE, prob = c(0.20, 0.15, 0.25, 0.15, 0.05, 0.08, 0.06, 0.04, 0.02)
  ),
  niveau_etudes = sample(
    c("secondaire_ou_moins", "bac", "bac_plus_2_3", "bac_plus_5", "doctorat"),
    n, replace = TRUE, prob = c(0.25, 0.30, 0.25, 0.16, 0.04)
  ),
  # Milieu de résidence : Urbain, Périurbain, Rural, et MRE (Diaspora à l'étranger)
  milieu_residence = sample(c("urbain", "periurbain", "rural", "MRE"), n, replace = TRUE, prob = c(0.54, 0.18, 0.18, 0.10)),
  niveau_vie = sample(c("modeste", "moyen", "confortable"), n, replace = TRUE, prob = c(0.35, 0.45, 0.20)),
  bureau_vote_connu = sample(c(1, 0), n, replace = TRUE, prob = c(0.68, 0.32)),
  # Inscription : 1 = Inscrit, 0 = Non-Inscrit, "NON_INSCRIT_MRE" = Non-inscrit étranger, "INELIGIBLE" = Statut régalien
  inscrit = sample(c("1", "0", "NON_INSCRIT_MRE", "INELIGIBLE"), n, replace = TRUE, prob = c(0.68, 0.20, 0.07, 0.05)),
  comprehension_enjeux = sample(1:5, n, replace = TRUE, prob = c(0.12, 0.22, 0.34, 0.22, 0.10)),
  confiance_transparence = sample(1:5, n, replace = TRUE, prob = c(0.15, 0.25, 0.32, 0.18, 0.10)),
  prise_en_compte_citoyens = sample(1:5, n, replace = TRUE, prob = c(0.25, 0.35, 0.24, 0.12, 0.04)),
  norme_sociale_entourage = sample(1:5, n, replace = TRUE, prob = c(0.18, 0.28, 0.28, 0.18, 0.08))
)

# 3. Traitement méthodologique : Filtrage de la population éligible
df_electorat <- df_elections %>%
  filter(inscrit != "INELIGIBLE") %>%
  mutate(
    est_inscrit = if_else(inscrit == "1", 1, 0),
    est_mre = if_else(milieu_residence == "MRE", 1, 0),
    z_latent = -2.8 + 
               0.035 * (age - 18) + 
               1.95 * est_inscrit + 
               0.75 * bureau_vote_connu + 
               0.45 * confiance_transparence + 
               0.30 * comprehension_enjeux + 
               0.40 * (norme_sociale_entourage >= 4) + 
               0.35 * (milieu_residence == "rural") - 
               0.85 * est_mre + 
               rlogis(n()),
    proba_vote = 1 / (1 + exp(-z_latent)),
    vote = if_else(proba_vote > 0.5, 1, 0)
  )

cat("=========================================================\\n")
cat("RAPPORT DE SIMULATION — ÉLECTIONS LÉGISLATIVES 2026\\n")
cat("Observations totales N :", nrow(df_elections), "\\n")
cat("Échantillon MRE (Diaspora) N :", sum(df_elections$milieu_residence == "MRE"), "\\n")
cat("Taux de participation éligible global :", round(mean(df_electorat$vote) * 100, 1), "%\\n")
cat("=========================================================\\n\\n")

# 4. Analyse Bivariée : Taux de participation selon le Milieu de Résidence (MRE vs National)
cat("=== ANALYSE BIVARIÉE : PARTICIPATION SELON LE MILIEU DE RÉSIDENCE ===\\n")
tab_residence <- df_electorat %>%
  group_by(milieu_residence) %>%
  summarise(
    Effectif = n(),
    Taux_Participation_Pct = round(mean(vote) * 100, 1),
    Confiance_Moyenne = round(mean(confiance_transparence), 2),
    Comprehension_Moyenne = round(mean(comprehension_enjeux), 2)
  )
print(tab_residence)

# 5. Ajustement du Modèle Linéaire Généralisé (GLM Logit)
modele_participation <- glm(
  vote ~ age + sexe + situation_pro + niveau_etudes + milieu_residence + 
         est_inscrit + bureau_vote_connu + confiance_transparence + comprehension_enjeux + norme_sociale_entourage,
  data = df_electorat,
  family = binomial(link = "logit")
)

# 6. Table des Odds Ratios & Intervalles de Confiance à 95%
cat("\\n=== ESTIMATION DU MODÈLE LOGIT (ODDS RATIOS) ===\\n")
resultats_or <- tidy(modele_participation, exponentiate = TRUE, conf.int = TRUE)
print(resultats_or)

# 7. Visualisation graphique ggplot2 (Thème Vert Foncé Émeraude)
p_graph <- ggplot(df_electorat, aes(x = confiance_transparence, y = proba_vote, color = milieu_residence)) +
  geom_point(alpha = 0.35, position = position_jitter(width = 0.18, height = 0.02)) +
  geom_smooth(method = "glm", method.args = list(family = "binomial"), se = FALSE, linewidth = 1.2) +
  scale_color_manual(values = c("urbain" = "#34d399", "periurbain" = "#06b6d4", "rural" = "#f59e0b", "MRE" = "#a7f3d0")) +
  labs(
    title = "Participation Électorale 2026 — Analyse Prédictive Logit (DGCT / INSEA)",
    subtitle = "Probabilité estimée P(Vote = 1) selon la confiance et le milieu de résidence (incluant MRE)",
    x = "Niveau de Confiance dans la Transparence (1 à 5)",
    y = "Probabilité de Participation Estimée",
    color = "Milieu de Résidence"
  ) +
  theme_minimal(base_size = 13) +
  theme(
    plot.background = element_rect(fill = "#06140d", color = NA),
    panel.background = element_rect(fill = "#0b1a12", color = NA),
    text = element_text(color = "#f3f4f6"),
    axis.text = element_text(color = "#a7f3d0"),
    panel.grid.major = element_line(color = "#1d3e2e"),
    panel.grid.minor = element_line(color = "#12281d"),
    legend.position = "top",
    legend.background = element_rect(fill = "#0b1a12", color = NA)
  )

print(p_graph)
cat("\\nScript exécuté avec succès. Les analyses bivariées et le modèle logit intègrent la variable MRE.\\n");
`;

        const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(rCode);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `analyse_econometrique_participation_2026_dgct.R`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }
}

window.StatisticalProfiler = StatisticalProfiler;
