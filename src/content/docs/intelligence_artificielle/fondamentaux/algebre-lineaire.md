---
title: "Algèbre linéaire pour l'IA"
description: Vecteurs, matrices et leurs opérations en Python. Déterminant, inversion et transformations linéaires (rotation, homothétie, symétrie, projection, cisaillement).
sidebar:
  label: "Algèbre linéaire"
---

L'algèbre linéaire est le socle mathématique du machine learning et du deep learning. Les données sont représentées par des vecteurs et des matrices ; les transformations appliquées par les réseaux de neurones sont des opérations linéaires.

## Vecteurs et matrices

Un **vecteur** est une liste ordonnée de nombres qui représente un point ou une direction dans un espace. Une **matrice** est un tableau rectangulaire de nombres qui organise des données ou encode des transformations.

En Python, ces structures se manipulent directement sans bibliothèque externe :

```python
# Vecteur
v = [1, 2, 3]

# Matrices 2×2
A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
```

## Opérations fondamentales

Le tableau suivant résume les opérations disponibles selon le type de structure :

| Opération | Vecteurs | Matrices |
|---|---|---|
| Addition/Soustraction | Oui (élément par élément) | Oui (élément par élément) |
| Multiplication par un scalaire | Oui | Oui |
| Produit scalaire | Oui (somme des produits) | Non |
| Produit matriciel | Non | Oui (ligne × colonne) |
| Transposition | Non | Oui (lignes deviennent colonnes) |
| Déterminant | Non | Oui (matrices carrées uniquement) |
| Inversion | Non | Oui (si la matrice est inversible) |

### Déterminant

Le déterminant d'une matrice carrée indique si elle est inversible (déterminant ≠ 0) et mesure le facteur d'échelle de la transformation qu'elle représente.

```python
A = [[1, 2], [3, 4]]

determinant = A[0][0] * A[1][1] - A[0][1] * A[1][0]
print("Déterminant de A :", determinant)  # -2
```

### Inversion

La matrice inverse A⁻¹ est telle que A × A⁻¹ = I (matrice identité). Elle n'existe que si le déterminant est non nul.

```python
determinant = A[0][0] * A[1][1] - A[0][1] * A[1][0]

if determinant != 0:
    inverse = [
        [ A[1][1] / determinant, -A[0][1] / determinant],
        [-A[1][0] / determinant,  A[0][0] / determinant]
    ]
    print("Matrice inverse :", inverse)
else:
    print("La matrice n'est pas inversible.")
```

## Transformations linéaires

Une transformation linéaire est une fonction qui prend un vecteur en entrée et renvoie un autre vecteur en sortie, en respectant deux propriétés :

- **Additivité** : transformer la somme de deux vecteurs revient à sommer leurs transformations séparées.
- **Homogénéité** : multiplier un vecteur par un scalaire avant la transformation produit le même résultat qu'après.

Les matrices sont la représentation concrète des transformations linéaires.

### Rotation dans le plan

```python
import math

def rotation(vecteur, theta):
    x, y = vecteur
    return [
        x * math.cos(theta) - y * math.sin(theta),
        x * math.sin(theta) + y * math.cos(theta)
    ]

vecteur = [1, 0]
angle = math.pi / 2  # 90 degrés
resultat = rotation(vecteur, angle)
print("Vecteur après rotation :", resultat)  # [0, 1]
```

### Homothétie (changement d'échelle)

```python
def homothetie(vecteur, k):
    return [k * coord for coord in vecteur]

vecteur = [2, 3]
facteur = 2
resultat = homothetie(vecteur, facteur)
print("Vecteur après homothétie :", resultat)  # [4, 6]
```

### Symétrie

```python
def symetrie_par_point(point_a, point_p):
    x_a, y_a = point_a
    x_p, y_p = point_p
    return (2 * x_p - x_a, 2 * y_p - y_a)

def symetrie_par_rapport_a_x(point):
    x, y = point
    return (x, -y)

def symetrie_par_rapport_a_y(point):
    x, y = point
    return (-x, y)
```

### Projection et cisaillement

```python
# Projection sur l'axe X
def projection_sur_x(point):
    x, y = point
    return (x, 0)

# Cisaillement horizontal
def cisaillement_horizontal(point, k):
    x, y = point
    return (x + k * y, y)

# Cisaillement vertical
def cisaillement_vertical(point, k):
    x, y = point
    return (x, y + k * x)
```

## Algèbre linéaire avancée pour l'IA

### Décomposition en valeurs singulières (SVD)

La SVD factorise toute matrice A en trois matrices : A = U Σ Vᵀ, où U et V sont des matrices orthogonales et Σ une matrice diagonale de valeurs singulières. Elle révèle la structure interne de la transformation représentée par A.

Usage en IA : compression de données, recommandation, traitement du langage naturel (word embeddings).

### Analyse en composantes principales (PCA)

La PCA utilise la SVD pour **réduire la dimension** d'un jeu de données en projetant les données sur les directions de plus grande variance (les composantes principales). Elle élimine les corrélations entre variables et réduit le bruit.

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)
X_reduit = pca.fit_transform(X)
print("Variance expliquée :", pca.explained_variance_ratio_)
```

### Matrices de covariance et de transition

La **matrice de covariance** quantifie les corrélations entre chaque paire de variables d'un jeu de données. C'est la matrice que la PCA diagonalise pour trouver les composantes principales.

Les **matrices de transition** encodent les probabilités de passage d'un état à un autre dans les processus de Markov, utilisés notamment en traitement du langage et en apprentissage par renforcement.

## Pourquoi l'algèbre linéaire est centrale en IA

Les réseaux de neurones sont fondamentalement des séquences de transformations linéaires (multiplications matricielles) suivies de fonctions non linéaires (fonctions d'activation). Chaque couche d'un réseau de neurones dense effectue l'opération : **y = W·x + b**, où W est une matrice de poids, x le vecteur d'entrée et b le vecteur de biais.
