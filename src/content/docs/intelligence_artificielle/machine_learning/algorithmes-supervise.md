---
title: "Algorithmes d'apprentissage supervisé"
description: KNN, régression logistique, arbres de décision, forêts aléatoires et méthodes d'ensemble. Fonctionnement, métriques, avantages et inconvénients de chaque approche.
sidebar:
  label: "Algorithmes supervisés"
---

L'apprentissage supervisé repose sur des données labellisées. Pour chaque entrée, une sortie attendue est connue. L'algorithme apprend à associer entrées et sorties, puis généralise sur de nouvelles données inconnues.

## Régression logistique

La régression logistique est un algorithme de **classification binaire**. Contrairement à ce que son nom suggère, elle ne prédit pas une valeur continue mais la probabilité qu'une instance appartienne à une classe.

**Fonction Sigmoïde :** pour transformer la sortie linéaire en une probabilité, la régression logistique applique la fonction sigmoïde, qui comprime n'importe quelle valeur réelle dans l'intervalle [0, 1].

**Classification binaire :** une fois la probabilité calculée, un seuil de décision (généralement 0,5) détermine la classe. Si P > 0,5, l'instance est classée «positive» ; sinon, elle est classée «négative».

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

## K-Nearest Neighbors (KNN)

KNN est un algorithme supervisé basé sur le principe de la **proximité** : les points de données qui se ressemblent sont proches les uns des autres dans l'espace des caractéristiques. Pour prédire la classe ou la valeur d'un nouveau point, l'algorithme regarde ses K voisins les plus proches.

- **Classification** : le nouveau point est classé selon la classe majoritaire parmi ses K voisins (vote).
- **Régression** : la valeur prédite est la moyenne des valeurs de ses K voisins.

### Choix de K

Le paramètre K conditionne le comportement du modèle :

| K | Effet |
|---|---|
| **K trop petit** (ex : K=1) | Sensible au bruit et aux valeurs aberrantes |
| **K trop grand** | Lisse la frontière de décision, réduit la précision |
| **K optimal** | Trouvé par validation croisée ; préférer un K impair pour la classification binaire |

### Fonctions de distance

KNN calcule la distance entre chaque point pour identifier les voisins :

- **Distance Euclidienne** : la distance «en ligne droite» entre deux points. Recommandée quand les caractéristiques ont des échelles similaires.
- **Distance de Manhattan** : somme des différences absolues des coordonnées. Utile quand le chemin est contraint ou que les échelles diffèrent fortement.

### Avantages et inconvénients

| Avantages | Inconvénients |
|---|---|
| Simple à comprendre et implémenter | Coût de calcul élevé à la prédiction |
| Capture les relations non linéaires | Sensible à l'échelle des caractéristiques |
| Aucun entraînement explicite | Sensible au bruit si K est trop petit |

La normalisation des données est **indispensable** avant d'utiliser KNN : les caractéristiques à grande échelle dominent autrement le calcul de distance.

## Arbres de décision

Un arbre de décision divise l'ensemble de données en sous-ensembles plus petits de manière récursive, créant une structure arborescente avec des nœuds de décision et des feuilles de résultats.

**Critères de division (Splitting Criteria) :** à chaque nœud, l'algorithme choisit la meilleure caractéristique pour diviser les données. Deux critères populaires pour la classification :

- **Impureté de Gini** : mesure la probabilité qu'un élément choisi au hasard soit mal étiqueté. Une valeur de 0 indique un sous-ensemble pur.
- **Entropie** : mesure l'incertitude d'un sous-ensemble. L'algorithme cherche la division qui réduit le plus l'entropie, c'est le **gain d'information**.

## Bagging et Boosting (Ensemble learning)

Ces techniques combinent plusieurs modèles pour obtenir de meilleures performances qu'un modèle unique.

**Bagging (Bootstrap Aggregating) :** entraîne plusieurs modèles de manière **indépendante** sur des sous-ensembles aléatoires du jeu de données (avec remise). La prédiction finale agrège les résultats par vote majoritaire (classification) ou par moyenne (régression). Objectif : réduire la variance et prévenir le surapprentissage.

**Boosting :** entraîne des modèles de manière **séquentielle**. Chaque modèle se concentre sur les erreurs des modèles précédents. Objectif : réduire le biais et améliorer la performance globale. Gradient Boosting et AdaBoost utilisent cette méthode.

## Forêts aléatoires (Random forests)

La forêt aléatoire est un algorithme d'ensemble basé sur le bagging. Elle construit une «forêt» d'arbres de décision.

**Fonctionnement :**

1. Un grand nombre d'arbres de décision est créé. Chaque arbre est entraîné sur un **sous-ensemble aléatoire** des données d'entraînement.
2. À chaque nœud de chaque arbre, la division considère uniquement un **sous-ensemble aléatoire des caractéristiques**. Cette double randomisation protège contre le surapprentissage.
3. La prédiction finale agrège tous les arbres : vote majoritaire pour la classification, moyenne pour la régression.

```python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100, max_features='sqrt')
rf.fit(X_train, y_train)
```

| | Avantages | Inconvénients |
|---|---|---|
| **Random Forest** | Précis, robuste au surapprentissage, gère les données complexes, moins sensible aux valeurs aberrantes | Moins interprétable qu'un seul arbre de décision |

## Comparatif des algorithmes

| Algorithme | Type | Interprétabilité | Complexité calcul |
|---|---|---|---|
| **Régression Logistique** | Classification | Élevée | Faible |
| **KNN** | Classification/Régression | Élevée | Élevée (prédiction) |
| **Arbre de Décision** | Classification/Régression | Élevée | Faible |
| **Random Forest** | Classification/Régression | Faible | Moyenne |
