---
title: "Probabilités pour l'IA"
description: Fondamentaux des probabilités. Espaces d'événements, axiomes, probabilité conditionnelle, indépendance, espérance, variance et lois de probabilités classiques.
sidebar:
  label: "Probabilités"
---

La probabilité mesure la chance qu'un événement se produise. Elle fournit le cadre formel pour raisonner sous incertitude, ce qui est omniprésent en IA : un modèle ne prédit jamais avec certitude absolue, il attribue des probabilités aux différentes classes ou valeurs possibles.

## L'univers et les événements

**Univers (Ω) :** ensemble de toutes les issues possibles d'une expérience aléatoire.

Exemple : lancer un dé → Ω = {1, 2, 3, 4, 5, 6}

Les événements se classifient selon leur nature :

| Type d'événement | Définition |
|---|---|
| **Élémentaire** | Contient un seul résultat de l'univers |
| **Certain** | Se produit toujours ; correspond à Ω ; P = 100 % |
| **Impossible** | Ne peut pas se produire ; P = 0 % |
| **Possible (probable)** | Sous-ensemble non vide de Ω ; 0 % < P < 100 % |
| **Compatibles** | Ont au moins un cas favorable en commun |
| **Incompatibles** | N'ont aucun cas favorable en commun |
| **Complémentaires** | Incompatibles dont l'union = Ω |

## Opérations sur les événements

| Opération | Notation | Signification |
|---|---|---|
| **Union** | A ∪ B | «A ou B se réalise» |
| **Intersection** | A ∩ B | «A et B se réalisent» |
| **Différence** | A \ B | «A sans B» |
| **Incompatibilité** | A ∩ B = ∅ | Aucun résultat en commun |
| **Lois de De Morgan** | (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ | Complément d'une union |

## Axiomes des probabilités

Toute théorie des probabilités repose sur trois axiomes fondamentaux :

1. **P(Ω) = 1** : la probabilité de l'univers entier vaut 1.
2. **1 ≥ P(A) ≥ 0** pour tout événement A.
3. **Si A et B sont incompatibles : P(A ∪ B) = P(A) + P(B)**.

**Calcul de la probabilité :** si toutes les issues sont équiprobables, P(A) = |A| / |Ω|.

Exemple : lancer un dé → P({2, 4, 6}) = 3/6 = 1/2.

## Probabilité conditionnelle

La probabilité conditionnelle P(A|B) est la probabilité que A se produise, sachant que B est réalisé :

```
P(A|B) = P(A ∩ B) / P(B),  si P(B) > 0
```

Exemple avec un dé :
- A = «obtenir un nombre pair» = {2, 4, 6}
- B = «obtenir > 3» = {4, 5, 6}
- P(A|B) = P({4, 6}) / P({4, 5, 6}) = (2/6) / (3/6) = 2/3

## Indépendance des événements

A et B sont **indépendants** si la réalisation de l'un n'affecte pas la probabilité de l'autre :

```
P(A ∩ B) = P(A) × P(B)
```

Exemple : lancer deux dés indépendants. Le résultat du premier n'influence pas le résultat du second.

## Espérance et variance d'une variable aléatoire

**Espérance mathématique E[X] :** la moyenne pondérée des valeurs possibles d'une variable aléatoire discrète.

```
E[X] = Σ xᵢ · P(X = xᵢ)
```

Exemple : dé équilibré → E[X] = (1+2+3+4+5+6)/6 = 3,5

**Variance Var(X) :** mesure la dispersion autour de la moyenne.

```
Var(X) = E[(X - E[X])²] = E[X²] - (E[X])²
σ(X) = √Var(X)
```

Exemple : dé équilibré → Var(X) ≈ 2,92 ; σ ≈ 1,71

**Loi des grands nombres :** plus on répète une expérience aléatoire, plus la fréquence observée d'un événement se rapproche de sa probabilité théorique. Lancer une pièce équilibrée 10 000 fois → fréquence de «pile» ≈ 0,5.

## Lois de probabilités

### Lois discrètes

**Loi uniforme discrète :** chaque issue a la même probabilité P(X = xᵢ) = 1/n.

```
E[X] = (a + b)/2
Var(X) = ((b - a + 1)² - 1) / 12
```

**Loi de Bernoulli :** variable X prenant 1 (succès) avec probabilité p, et 0 (échec) avec probabilité 1−p.

```
E[X] = p
Var(X) = p(1−p)
```

Exemple : pile ou face équilibré → p = 0,5.

**Loi binomiale B(n, p) :** modélise le nombre de succès dans n expériences indépendantes de Bernoulli.

```
P(X = k) = C(n, k) · pᵏ · (1−p)^(n−k)
E[X] = np
Var(X) = np(1−p)
```

Exemples : nombre de réussites sur 10 essais, contrôle qualité de production.

**Loi géométrique :** modélise le nombre d'essais nécessaires avant le premier succès.

```
P(X = k) = (1−p)^(k−1) · p
E[X] = 1/p
Var(X) = (1−p)/p²
```

Exemple : nombre de tirages avant de sortir un 6 au dé.

**Loi de Poisson :** modélise le nombre d'événements rares dans un intervalle de temps ou d'espace.

```
P(X = k) = e^(−λ) · λᵏ / k!
E[X] = Var(X) = λ
```

Exemples : nombre d'appels reçus par minute, nombre de pannes par jour.

### Lois continues

Pour une variable continue, la probabilité de tomber sur une valeur exacte est nulle. On parle de **densité de probabilité** f(x).

**Loi uniforme continue :** toutes les valeurs dans [a, b] sont équiprobables.

```
f(x) = 1 / (b−a)  pour x ∈ [a, b]
E[X] = (a + b)/2
Var(X) = (b−a)² / 12
```

Exemple : durée d'attente entre 0 et 10 secondes uniformément répartie.

**Loi exponentielle :** modélise le temps entre deux événements dans un processus de Poisson.

```
f(x) = λ · e^(−λx),  pour x ≥ 0
E[X] = 1/λ
Var(X) = 1/λ²
```

Propriété remarquable : **sans mémoire** → P(X > s+t | X > s) = P(X > t).

**Loi normale (gaussienne) :** la loi continue la plus répandue en statistiques et en IA. Sa densité produit la célèbre courbe en cloche.

```
f(x) = (1 / (σ√(2π))) · e^{−(x−μ)² / (2σ²)}
E[X] = μ    Var(X) = σ²
```

Propriété remarquable : ≈ 68 % des valeurs se situent dans [μ−σ, μ+σ].  
Usage IA : modélisation du bruit, des erreurs de mesure, des scores de sortie.

**Loi normale centrée réduite (Z) :** cas particulier avec μ = 0 et σ = 1. Toute variable normale se ramène à cette forme via la transformation Z = (X − μ)/σ, ce qui permet de lire les probabilités dans des tables standardisées.

```
Exemple : P(Z < 1,96) ≈ 0,975  →  intervalle de confiance à 95 %
```

**Loi du Khi-deux χ² :** utilisée pour tester l'indépendance entre deux variables qualitatives, et pour comparer une distribution observée à une distribution théorique. Si X₁, …, Xₖ ~ N(0,1), alors ΣXᵢ² ~ χ²(k).

**Loi de Student (t) :** remplace la loi normale pour comparer des moyennes sur de petits échantillons (n < 30). Elle approche la loi normale quand le degré de liberté ν tend vers l'infini.

**Loi de Fisher (F) :** utilisée pour comparer des variances entre deux groupes ou pour évaluer la significativité globale d'un modèle de régression.

## Lois des probabilités — règles de calcul

**Loi de l'addition (union) :** pour deux événements quelconques :

```
P(A ∪ B) = P(A) + P(B) − P(A ∩ B)
```

Si A et B sont incompatibles (A ∩ B = ∅), la formule se simplifie en P(A ∪ B) = P(A) + P(B).

**Loi de la multiplication (intersection) :** si A et B sont indépendants :

```
P(A ∩ B) = P(A) × P(B)
```

## Théorème de Bayes

Le théorème de Bayes exprime la probabilité de A sachant B en fonction de la probabilité inverse :

```
P(A|B) = P(B|A) × P(A) / P(B)
```

Il permet de **mettre à jour une croyance** à la lumière de nouvelles données. C'est le fondement de l'inférence bayésienne : P(A) est la probabilité a priori, P(A|B) est la probabilité a posteriori après observation de B.

## Récapitulatif des lois

| Loi | Type | Usage typique |
|---|---|---|
| **Uniforme discrète** | Discrète | Dé équilibré, tirage au sort |
| **Bernoulli** | Discrète | Succès/échec unique |
| **Binomiale** | Discrète | k succès en n essais |
| **Géométrique** | Discrète | Attente du premier succès |
| **Poisson** | Discrète | Événements rares par intervalle |
| **Uniforme continue** | Continue | Valeur aléatoire dans un intervalle |
| **Exponentielle** | Continue | Temps entre deux événements |
| **Normale** | Continue | Variables centrées, bruit, erreurs |
| **Student (t)** | Continue | Comparaison de moyennes, petits échantillons |
| **Khi-deux χ²** | Continue | Test d'indépendance, ajustement de distribution |
| **Fisher (F)** | Continue | Comparaison de variances |

**Règle de choix :** événements comptables (succès, pannes) → lois discrètes. Phénomènes mesurables (temps, erreurs, scores) → lois continues. Petits échantillons → Student plutôt que Normale.
