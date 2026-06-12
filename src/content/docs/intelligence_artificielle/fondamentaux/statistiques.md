---
title: "Statistiques et probabilités pour l'IA"
description: Les bases statistiques indispensables pour comprendre le machine learning. Données, distributions, tendances centrales, dispersion, corrélation et détection des valeurs aberrantes.
sidebar:
  label: "Statistiques et probabilités"
---

L'IA repose sur des données bruitées, partielles et incertaines. Les statistiques permettent de résumer, interpréter et fiabiliser ces données avant d'entraîner un modèle. Les probabilités fournissent un cadre formel pour raisonner dans l'incertitude.

Le Machine Learning produit des **modèles probabilistes**. Le Deep Learning modélise des **distributions cachées**. Sans base statistique solide, l'interprétation des résultats d'un modèle reste fragile.

## Définitions fondamentales

| Terme | Définition |
|---|---|
| **Population** | Ensemble complet des éléments étudiés |
| **Échantillon** | Sous-ensemble de la population sur lequel on travaille |
| **Variable aléatoire** | Grandeur dont la valeur dépend du hasard |
| **Événement** | Résultat particulier ou ensemble de résultats possibles |

## Types de données

La nature des données conditionne le choix des méthodes statistiques et des algorithmes.

**Variables qualitatives :**

- **Nominale** : pas d'ordre entre les valeurs (couleur, pays, type de produit)
- **Ordinale** : ordre défini mais sans échelle numérique (niveau de satisfaction, rang)

**Variables quantitatives :**

- **Discrète** : valeurs entières dénombrables (nombre d'enfants, nombre de clics)
- **Continue** : valeurs réelles dans un intervalle (taille, poids, température)

## Statistique descriptive

La statistique descriptive résume un jeu de données sans en tirer de conclusions générales. Elle se décline en trois axes : tendance centrale, dispersion et forme de distribution.

### Tendances centrales

Trois mesures synthétisent «où se situent» les données :

- **Moyenne** : somme des valeurs divisée par le nombre d'observations. Sensible aux valeurs extrêmes.
- **Médiane** : valeur centrale qui sépare les données en deux parties égales. Robuste aux valeurs aberrantes.
- **Mode** : valeur la plus fréquente dans l'échantillon.

### Mesures de dispersion

Ces mesures quantifient l'écart entre les valeurs :

- **Étendue** : différence entre la valeur maximale et la valeur minimale.
- **Variance** : moyenne des carrés des écarts à la moyenne.
- **Écart-type** : racine carrée de la variance. Exprimé dans la même unité que les données.
- **Coefficient de variation** : rapport entre l'écart-type et la moyenne. Permet de comparer la dispersion de deux distributions d'unités différentes.

### Forme de distribution

La forme d'une distribution s'analyse avec deux indicateurs :

**Asymétrie (skewness)** : indique si la distribution est penchée à gauche (asymétrie négative) ou à droite (asymétrie positive). Une distribution symétrique a un skewness de zéro.

**Aplatissement (kurtosis)** : indique si la distribution est plus pointue ou plus aplatie qu'une loi normale. Un kurtosis élevé signale des queues lourdes, donc un risque de valeurs très extrêmes.

## Quantiles et boîte à moustaches

Les **quantiles** positionnent une observation dans la distribution :

- **Quartiles** : Q1 (25 %), Q2 (médiane, 50 %), Q3 (75 %)
- **Déciles** : divisent en 10 parties
- **Centiles** : divisent en 100 parties

La **boîte à moustaches (boxplot)** visualise la dispersion et les valeurs extrêmes en cinq indicateurs : Q1, Q2, Q3, et les deux moustaches qui représentent les bornes hors valeurs aberrantes.

## Valeurs aberrantes

Une valeur aberrante (outlier) est une donnée très éloignée du reste. Elle peut provenir d'une erreur de saisie ou représenter un phénomène rare et informatif.

**Score Z** : mesure combien d'écarts-types une valeur est éloignée de la moyenne.

```
z = (x - μ) / σ
```

Une valeur avec z > 3 ou z < -3 est généralement considérée comme aberrante. Les boxplots servent également à les identifier visuellement.

## Corrélation

La corrélation mesure la force et la direction de la relation **linéaire** entre deux variables.

- **Covariance** : mesure de la variation conjointe entre deux variables (sensible aux unités).
- **Corrélation (r)** : version normalisée de la covariance, toujours comprise entre -1 et 1.

| Valeur de r | Interprétation |
|---|---|
| **r = 1** | Corrélation positive parfaite |
| **r = -1** | Corrélation négative parfaite |
| **r = 0** | Absence de relation linéaire |

La **matrice de corrélation** étend ce calcul à toutes les paires de variables d'un jeu de données. Elle s'examine systématiquement avant toute modélisation : une forte corrélation entre deux variables explicatives (multicolinéarité) peut dégrader la performance du modèle.

## Visualisations utiles

| Graphique | Usage |
|---|---|
| **Histogramme** | Distribution d'une variable continue |
| **Diagramme en barres** | Fréquences d'une variable qualitative |
| **Boxplot** | Dispersion et valeurs aberrantes |
| **Nuage de points (scatter plot)** | Relation entre deux variables numériques |
| **Matrice de corrélation (heatmap)** | Relations entre toutes les paires de variables |
