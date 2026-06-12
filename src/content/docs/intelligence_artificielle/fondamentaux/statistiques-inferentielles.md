---
title: "Statistiques inférentielles"
description: Tirer des conclusions sur une population à partir d'un échantillon. Échantillonnage, estimation, intervalles de confiance, tests d'hypothèses et applications en IA.
sidebar:
  label: "Statistiques inférentielles"
---

Les statistiques descriptives résument des données existantes. Les statistiques inférentielles vont plus loin : elles permettent de **faire des prédictions et des tests** à partir d'un échantillon pour tirer des conclusions sur l'ensemble de la population.

## Échantillonnage

**Population :** l'ensemble complet des données d'intérêt (ex : tous les clients d'une entreprise).

**Échantillon :** le sous-ensemble utilisé pour l'analyse. L'objectif est qu'il soit représentatif pour minimiser le biais.

| Type d'échantillonnage | Description |
|---|---|
| **Aléatoire simple** | Chaque individu a la même probabilité d'être sélectionné |
| **Stratifié** | La population est découpée en sous-groupes, puis échantillonnée dans chacun |
| **Par grappes** | Des groupes entiers sont tirés au sort |
| **Systématique** | On sélectionne un individu tous les k éléments |

## Estimation ponctuelle

L'estimation ponctuelle consiste à utiliser une statistique calculée sur l'échantillon pour estimer un paramètre inconnu de la population.

| Statistique échantillon | Estime |
|---|---|
| Moyenne échantillon x̄ | Moyenne population μ |
| Proportion échantillon p̂ | Proportion population p |

## Intervalle de confiance

L'estimation ponctuelle donne un seul chiffre mais ne quantifie pas l'incertitude. L'**intervalle de confiance** fournit une plage plausible pour le paramètre avec un certain niveau de confiance (95 %, 99 %, etc.).

Interprétation : «Nous sommes 95 % confiants que μ est dans cet intervalle.»

## Erreur type et taille d'échantillon

L'**erreur type (SE)** mesure la variabilité de la moyenne échantillon d'un tirage à l'autre :

```
SE = σ / √n
```

Plus l'échantillon est grand, plus SE est petit et l'estimation précise. La taille d'échantillon à choisir dépend de trois facteurs :

- Niveau de confiance souhaité
- Précision désirée (marge d'erreur)
- Variabilité de la population (σ)

## Tests d'hypothèses

Un test d'hypothèse vérifie si une affirmation sur la population est compatible avec les données de l'échantillon.

**Étapes :**

1. Formuler H0 (hypothèse nulle) et H1 (hypothèse alternative)
2. Choisir le test statistique approprié
3. Calculer la statistique de test
4. Déterminer la valeur-p
5. Accepter ou rejeter H0

## Valeur-p

La valeur-p est la probabilité d'obtenir un résultat aussi extrême que celui observé, si H0 est vraie.

```
p < 0,05  →  rejeter H0 (résultat statistiquement significatif)
p ≥ 0,05  →  pas de preuve suffisante pour rejeter H0
```

Le seuil 0,05 est conventionnel. Certains domaines utilisent 0,01 ou 0,001 pour exiger une preuve plus solide.

## Erreurs de décision

| Erreur | Définition | Notation |
|---|---|---|
| **Erreur de type I (α)** | Rejeter H0 alors qu'elle est vraie (fausse alerte) | α = seuil du test |
| **Erreur de type II (β)** | Ne pas rejeter H0 alors qu'elle est fausse | β |
| **Puissance du test** | Probabilité de détecter un effet réel | 1 − β |

Réduire α augmente β : il y a toujours un compromis entre les deux types d'erreurs.

## Tests courants

| Test | Usage |
|---|---|
| **Test Z** | Comparer une moyenne population connue, grande taille d'échantillon |
| **Test t de Student** | Comparer des moyennes sur un ou deux groupes, petits échantillons |
| **Test du Khi-deux** | Tester l'indépendance entre deux variables qualitatives |
| **ANOVA** | Comparer les moyennes de plusieurs groupes simultanément |

## Estimation par maximum de vraisemblance (MLE)

Le principe du maximum de vraisemblance (MLE, Maximum Likelihood Estimation) consiste à choisir les paramètres d'un modèle qui maximisent la probabilité d'avoir obtenu les données observées.

Formellement, on cherche θ* tel que :

```
θ* = argmax L(θ | données)
```

La régression logistique et de nombreux modèles de deep learning s'entraînent en minimisant la log-vraisemblance négative, ce qui revient à maximiser la vraisemblance.

## Applications en IA

| Application | Rôle des statistiques inférentielles |
|---|---|
| **Inférence bayésienne** | Met à jour les probabilités a priori avec de nouvelles données (théorème de Bayes) |
| **Apprentissage supervisé** | Évalue la performance sur un échantillon test pour inférer la généralisation |
| **Sélection de modèles** | Tests statistiques pour comparer significativement deux modèles |
| **A/B Testing** | Tests d'hypothèses pour valider qu'un changement produit un effet réel |
