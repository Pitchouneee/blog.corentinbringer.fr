---
title: "Évaluation et fiabilité des modèles"
description: Métriques d'évaluation, fonction de coût, descente de gradient, validation croisée et problèmes de sur- et sous-apprentissage.
sidebar:
  label: "Évaluation des modèles"
---

Entraîner un modèle ne suffit pas. Il faut mesurer sa capacité à généraliser sur des données nouvelles, comprendre pourquoi il se trompe, et détecter quand il mémorise plutôt qu'il apprend.

## Fonction de coût

La fonction de coût mesure l'erreur entre les valeurs prédites par le modèle et les valeurs réelles. L'objectif de l'entraînement est de **minimiser cette fonction**.

Pour la régression, on utilise couramment l'**Erreur Quadratique Moyenne (MSE)** : la moyenne des carrés des différences entre valeurs prédites et valeurs réelles. Le carré pénalise davantage les grandes erreurs.

```python
def mse_manuelle(valeurs_reelles, valeurs_predites):
    n = len(valeurs_reelles)
    somme_carres_erreurs = 0
    for i in range(n):
        erreur = valeurs_reelles[i] - valeurs_predites[i]
        somme_carres_erreurs += erreur**2
    return somme_carres_erreurs / n

y_reelles   = [3, -0.5, 2, 7]
y_predites  = [2.5, 0.0, 2, 8]
print(f"MSE : {mse_manuelle(y_reelles, y_predites)}")
```

## Descente de gradient

La descente de gradient est l'algorithme d'optimisation qui ajuste les paramètres du modèle pour minimiser la fonction de coût.

**Principe :**

1. **Initialisation** : les paramètres (poids et biais) démarrent avec des valeurs aléatoires.
2. **Calcul du gradient** : le gradient indique la direction de la plus forte pente de la fonction de coût.
3. **Mise à jour** : les paramètres se déplacent dans la direction **opposée** au gradient, avec une amplitude contrôlée par le **taux d'apprentissage** (learning rate).
4. **Itération** : le processus se répète jusqu'à convergence vers un minimum.

Un taux d'apprentissage trop grand fait «sauter» le minimum optimal. Un taux trop petit rend l'apprentissage très lent.

## Métriques d'évaluation pour la classification

La base est la **matrice de confusion**, qui résume les prédictions correctes et incorrectes d'un modèle de classification.

| | Prédit positif | Prédit négatif |
|---|---|---|
| **Réel positif** | Vrai Positif (VP) | Faux Négatif (FN) |
| **Réel négatif** | Faux Positif (FP) | Vrai Négatif (VN) |

À partir de cette matrice, on dérive quatre métriques :

**Précision** : parmi toutes les prédictions positives, quelle proportion était correcte ?

```
Précision = VP / (VP + FP)
```

**Rappel** : parmi tous les vrais positifs, quelle proportion a été identifiée ?

```
Rappel = VP / (VP + FN)
```

**F1-score** : moyenne harmonique de la précision et du rappel. Utile quand les classes sont déséquilibrées.

```
F1 = 2 × (Précision × Rappel) / (Précision + Rappel)
```

**RMSE** (Root Mean Squared Error) : métrique pour la régression, racine carrée du MSE. Une valeur plus faible indique des prédictions plus précises.

## Validation croisée (k-fold)

La validation croisée évalue la performance d'un modèle de manière plus fiable qu'une simple division train/test.

**Fonctionnement :**

1. Le jeu de données est divisé en **k** parties égales (typiquement 5 ou 10).
2. Le modèle est entraîné k fois. À chaque itération, une partie différente sert de jeu de test, les k-1 parties restantes servent d'entraînement.
3. La performance finale est la moyenne des k évaluations.

Cette approche donne une estimation moins biaisée de la performance réelle, car chaque exemple sert une fois de données de test.

## Overfitting et underfitting

Ces deux pathologies décrivent un déséquilibre entre la complexité du modèle et la quantité de données disponibles.

### Sous-apprentissage (Underfitting)

Un modèle sous-ajusté est trop simple pour capturer les relations dans les données. Ses performances sont médiocres à la fois sur les données d'entraînement et de test.

- **Cause** : modèle trop peu complexe (régression linéaire sur des données non linéaires) ou entraînement trop court.
- **Solution** : utiliser un modèle plus complexe, ajouter des caractéristiques, entraîner plus longtemps.

### Surapprentissage (Overfitting)

Un modèle sur-ajusté a mémorisé les données d'entraînement, y compris le bruit. Il obtient d'excellents résultats sur les données d'entraînement mais échoue sur de nouvelles données.

- **Cause** : modèle trop complexe, entraînement trop long, ou données d'entraînement insuffisantes.
- **Solution** : simplifier le modèle, augmenter les données d'entraînement, appliquer de la régularisation (L1/L2).

| Problème | Train | Test | Solution |
|---|---|---|---|
| **Underfitting** | Mauvais | Mauvais | Augmenter la complexité |
| **Bon modèle** | Bon | Bon | Conserver |
| **Overfitting** | Très bon | Mauvais | Régulariser, plus de données |
