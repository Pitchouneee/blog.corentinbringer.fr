---
title: "NumPy et Pandas pour la data science"
description: Les deux bibliothèques fondamentales de l'écosystème Python data. NumPy pour le calcul numérique vectorisé, Pandas pour la manipulation de données tabulaires.
sidebar:
  label: "NumPy et Pandas"
---

L'écosystème Python data repose sur deux bibliothèques complémentaires. NumPy fournit la couche de calcul numérique haute performance. Pandas s'appuie dessus pour manipuler des données tabulaires avec une interface proche d'un tableur ou d'une base SQL.

## NumPy

NumPy (Numerical Python) résout une limite fondamentale des listes Python : les listes stockent des pointeurs vers des objets dispersés en mémoire, ce qui les rend lentes pour le calcul scientifique. NumPy introduit le type `ndarray`, un tableau multidimensionnel qui stocke des éléments du même type dans un bloc mémoire continu.

Le gain de performance est de l'ordre de 10 à 100 fois par rapport aux listes Python, grâce aux optimisations C et à la vectorisation.

### Le type ndarray

Un `ndarray` représente des vecteurs (1D), des matrices (2D) ou des tenseurs (3D+).

```python
import numpy as np

# Créer un tableau 3×4 de zéros (entiers 8 bits)
arr = np.zeros((3, 4), dtype=np.int8)
print(arr.shape)   # (3, 4)
print(arr.ndim)    # 2
print(arr.size)    # 12

# 5 points équidistants entre 0 et 10
points = np.linspace(0, 10, 5)
```

### Indexation et slicing

Le slicing NumPy retourne une **vue**, pas une copie. Modifier la vue modifie le tableau d'origine.

```python
matrix = np.array([
    [ 0,  1,  2,  3,  4],
    [ 5,  6,  7,  8,  9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24]
])

# Sous-bloc central (lignes 1 à 3, colonnes 1 à 3)
sous_bloc = matrix[1:4, 1:4]

# Masque booléen : valeurs supérieures à 10
grandes_valeurs = matrix[matrix > 10]
```

### Broadcasting et algèbre linéaire

NumPy aligne automatiquement les dimensions de tableaux de formes différentes selon des règles précises : les dimensions sont compatibles si elles sont égales ou si l'une d'elles vaut 1.

```python
A = np.array([[1, 2], [3, 4]])
B = np.ones((2, 1))   # vecteur colonne

# Broadcasting : (2,2) + (2,1) → B est "étiré" pour matcher A
C = A + B

# Produit matriciel avec @
D = A @ B

# Algèbre linéaire avec np.linalg
inverse = np.linalg.inv(A)
determinant = np.linalg.det(A)
```

## Pandas

Pandas apporte la structure des feuilles de calcul et des bases de données SQL à Python. Construit sur NumPy pour la performance, il ajoute des **étiquettes** aux données, ce qui permet de gérer des types hétérogènes et des valeurs manquantes.

### Series et DataFrame

Les deux structures fondamentales :

- **Series** : tableau 1D avec un index.
- **DataFrame** : tableau 2D, collection de Series partageant le même index.

```python
import pandas as pd

data = {
    'Nom':  ['Alice', 'Bob', 'Charlie'],
    'Âge':  [25, 30, 35],
    'Ville': ['Paris', 'Lyon', 'Marseille']
}
df = pd.DataFrame(data)
```

### Inspection et indexation

```python
df.head()    # premières lignes
df.info()    # types et valeurs nulles

# .loc utilise les NOMS (étiquettes)
# Lignes 0 à 1, colonnes 'Nom' à 'Âge'
df.loc[0:1, 'Nom':'Âge']

# .iloc utilise les POSITIONS (entiers)
# Lignes 0 à 2 (exclu), colonnes 0 à 2 (exclu)
df.iloc[0:2, 0:2]
```

### Nettoyage de données

Les données réelles contiennent des trous (`NaN`), des mauvais types ou des erreurs.

```python
# Détection
df.isnull().sum()

# Suppression des lignes avec NaN
df.dropna()

# Remplissage par la moyenne de la colonne
df['Âge'].fillna(df['Âge'].mean(), inplace=True)

# Transformation de colonne avec apply
df['Âge_double'] = df['Âge'].apply(lambda x: x * 2)
```

### Agrégation et GroupBy

Le cycle **Split-Apply-Combine** : on découpe le DataFrame selon une clé, on applique une fonction d'agrégation, puis on recolle les résultats.

```python
# Nombre de clients et âge moyen par ville
df.groupby('Ville').agg(
    Nombre=('Nom', 'count'),
    Age_Moyen=('Âge', 'mean')
)

# Fusion de deux DataFrames sur une clé commune (comme un JOIN SQL)
pd.merge(df1, df2, on='id_client', how='left')
```

### Séries temporelles

```python
df['Date'] = pd.to_datetime(df['Date'])
df.set_index('Date', inplace=True)

# Sélectionner tout le mois de janvier 2023
df['2023-01']

# Agréger par mois (moyenne mensuelle)
monthly_avg = df.resample('M').mean()
monthly_avg.plot()
```

## Récapitulatif

| Outil | Usage principal | Structure clé |
|---|---|---|
| **NumPy** | Calcul numérique vectorisé | `ndarray` |
| **Pandas** | Manipulation de données tabulaires | `DataFrame` |
