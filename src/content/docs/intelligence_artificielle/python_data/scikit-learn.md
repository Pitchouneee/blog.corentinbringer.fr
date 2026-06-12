---
title: "Scikit-Learn : entraîner des modèles en Python"
description: Préparation des données avec StandardScaler et OneHotEncoder, entraînement de modèles de régression et de classification, métriques d'évaluation avec scikit-learn.
sidebar:
  label: "Scikit-Learn"
---

Scikit-learn est la bibliothèque de référence pour le machine learning en Python. Elle propose une API uniforme pour préparer les données, entraîner des modèles et les évaluer, quel que soit l'algorithme choisi.

## Préparation des données

Avant d'entraîner un modèle, les données doivent être transformées. Scikit-learn fournit des **préprocesseurs** qui s'entraînent sur les données d'apprentissage et transforment ensuite toutes les données de manière cohérente.

### Mise à l'échelle (Scaling)

Les modèles comme KNN et la régression linéaire sont sensibles à l'échelle des données. Deux scalers s'utilisent couramment :

- **StandardScaler** : centre les données autour de la moyenne (0) avec un écart-type de 1.
- **MinMaxScaler** : met les données entre 0 et 1.

```python
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Initialiser les préprocesseurs
scaler = StandardScaler()
ohe = OneHotEncoder()

# Mise à l'échelle des variables numériques
X_scaled = scaler.fit_transform(X_num)
```

### Encodage catégoriel

Les modèles numériques ne peuvent pas traiter des chaînes de caractères. Le **One-Hot Encoding** convertit une colonne de catégories (ex : «Rouge», «Bleu») en colonnes binaires (0 ou 1), évitant que le modèle interprète les étiquettes comme un ordre numérique.

```python
# Encodage des variables catégorielles
X_encoded = ohe.fit_transform(X_cat)
```

## Régression linéaire

Le modèle `LinearRegression` cherche à minimiser la somme des carrés des erreurs entre les prédictions et les valeurs réelles.

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"MSE : {mse:.2f}")
print(f"R² : {r2:.2f}")
```

**Métriques clés :**

- **MSE** (Mean Squared Error) : pénalise fortement les grandes erreurs.
- **R²** : mesure la proportion de variance des données expliquée par le modèle. R² = 0,8 signifie que le modèle explique 80 % de la variance.

### Régularisation L1 et L2

La régularisation pénalise les modèles trop complexes pour limiter le surapprentissage. Scikit-learn l'intègre directement dans les modèles via le paramètre `C` (inverse de la force de régularisation) ou `alpha`.

- **L1 (Lasso) :** pénalise la somme des valeurs absolues des poids. Produit des modèles creux (certains poids deviennent exactement 0) — utile pour la sélection de variables.
- **L2 (Ridge) :** pénalise la somme des carrés des poids. Réduit les poids sans les annuler — comportement plus stable en présence de corrélations.

```python
from sklearn.linear_model import Ridge, Lasso

ridge = Ridge(alpha=1.0)   # L2
lasso = Lasso(alpha=0.1)   # L1
```

## Classification

### Régression logistique

La régression logistique utilise la fonction Sigmoïde pour transformer la sortie linéaire en une probabilité ∈ [0, 1], permettant la classification binaire. C'est l'un des modèles les plus rapides et interprétables.

### KNN

La classe d'un nouveau point est décidée par le vote majoritaire de ses K voisins les plus proches. La **Méthode du Coude** aide à choisir la valeur de K qui optimise l'équilibre entre complexité et performance.

```python
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier

# Régression Logistique
log_model = LogisticRegression()
log_model.fit(X_train, y_train)

# KNN
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
```

## Métriques d'évaluation

### Matrice de confusion

La matrice de confusion croise les prédictions du modèle avec la réalité. Les éléments hors diagonale (FP et FN) représentent les erreurs.

```python
from sklearn.metrics import confusion_matrix, recall_score, f1_score

cm = confusion_matrix(y_true, y_pred)
recall = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)
```

- **Rappel** : parmi tous les vrais positifs, combien le modèle en a-t-il capturés ?
- **F1-Score** : moyenne harmonique de la Précision et du Rappel. Fournit une métrique unique et équilibrée, particulièrement utile quand les classes sont déséquilibrées.

## Pipeline typique scikit-learn

```python
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, cross_val_score

# Division des données
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Pipeline : préprocessing + modèle
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression())
])

# Entraînement et évaluation par validation croisée
scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring='f1')
print(f"F1 moyen : {scores.mean():.2f} ± {scores.std():.2f}")
```

## Sur/sous-apprentissage et optimisation des hyperparamètres

### Surapprentissage et sous-apprentissage

- **Surapprentissage (Overfitting) :** le modèle mémorise le bruit des données d'entraînement. Il performe bien en entraînement mais mal en généralisation.
- **Sous-apprentissage (Underfitting) :** le modèle est trop simple pour capturer la tendance sous-jacente. Il performe mal même en entraînement.

### GridSearchCV — Recherche d'hyperparamètres

Les hyperparamètres (K dans KNN, C dans la régression logistique) ne sont pas appris par le modèle : ils se fixent avant l'entraînement. `GridSearchCV` teste toutes les combinaisons spécifiées via validation croisée et retourne la meilleure.

```python
from sklearn.model_selection import GridSearchCV

params = {'n_neighbors': [3, 5, 7, 9]}

grid_search = GridSearchCV(KNeighborsClassifier(), params, cv=5)
grid_search.fit(X, y)

print(grid_search.best_params_)
```

La validation croisée (cv=5) découpe les données en 5 folds : pour chaque combinaison de paramètres, le modèle s'entraîne sur 4 folds et se valide sur le 5ème, répété 5 fois. Le score moyen détermine la meilleure combinaison.

## Récapitulatif de l'API

L'API scikit-learn est uniforme pour tous les modèles :

| Étape | Méthode | Description |
|---|---|---|
| Entraînement | `model.fit(X_train, y_train)` | Apprend les paramètres |
| Prédiction | `model.predict(X_test)` | Génère les prédictions |
| Probabilités | `model.predict_proba(X_test)` | Probabilités par classe |
| Score | `model.score(X_test, y_test)` | Accuracy par défaut |
