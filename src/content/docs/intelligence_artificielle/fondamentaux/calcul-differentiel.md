---
title: "Calcul différentiel pour l'IA"
description: La dérivée et ses applications en intelligence artificielle. Rétropropagation, descente de gradient, dérivées partielles et optimisation des modèles de machine learning.
sidebar:
  label: "Calcul différentiel"
---

Le calcul différentiel traite des taux de variation des fonctions. En IA, il sert à répondre à une question précise : dans quelle direction faut-il ajuster les paramètres d'un modèle pour qu'il se trompe moins ?

## La dérivée

La dérivée mesure le taux de variation d'une fonction par rapport à une variable. Géométriquement, elle donne la pente de la tangente à la courbe en un point.

- **Dérivée positive** : la fonction est croissante.
- **Dérivée négative** : la fonction est décroissante.
- **Dérivée nulle** : point critique (minimum, maximum ou point d'inflexion).

```python
def f(x):
    return x**2

def derivative_f(x):
    return 2 * x

print(derivative_f(3))  # Affiche 6
```

Pour f(x) = x², la dérivée est f'(x) = 2x. En x = 3, la pente de la tangente vaut 6 : la fonction croît rapidement à cet endroit.

## Applications du calcul différentiel en IA

### Rétropropagation dans les réseaux de neurones

La rétropropagation (backpropagation) est l'algorithme fondamental d'entraînement des réseaux de neurones. Elle calcule le gradient de la fonction de perte par rapport à chaque poids du réseau, en appliquant la règle de dérivation en chaîne depuis la sortie vers l'entrée.

L'objectif est de minimiser l'erreur en ajustant les poids du réseau neuronal à chaque itération.

### Descente de gradient

La descente de gradient utilise la dérivée pour trouver le minimum d'une fonction de coût. À chaque étape, les paramètres se déplacent dans la **direction opposée au gradient** (là où la fonction décroît le plus vite) avec une amplitude contrôlée par le taux d'apprentissage.

```python
def descente_gradient(x_initial, taux_apprentissage, n_iterations):
    x = x_initial
    for _ in range(n_iterations):
        gradient = derivative_f(x)
        x = x - taux_apprentissage * gradient
    return x

minimum = descente_gradient(x_initial=10, taux_apprentissage=0.1, n_iterations=50)
print("Minimum trouvé :", minimum)  # Converge vers 0
```

### Dérivées partielles

Pour les modèles multivariés (avec plusieurs paramètres), on calcule une **dérivée partielle** pour chaque paramètre. La dérivée partielle ∂f/∂xᵢ mesure le taux de variation de f quand seul xᵢ varie, tous les autres paramètres étant fixes.

Le **gradient** d'une fonction multivariée est le vecteur de toutes ses dérivées partielles. C'est lui que la descente de gradient minimise.

### Optimisation des modèles

Les dérivées servent à ajuster les paramètres d'un modèle pour minimiser l'erreur. Pour un modèle avec des paramètres θ et une fonction de coût L(θ) :

```
θ ← θ - α × ∇L(θ)
```

où α est le taux d'apprentissage et ∇L(θ) le gradient de la fonction de coût.

### Règle de la chaîne

La règle de la chaîne calcule la dérivée d'une **fonction composée** f(g(x)) :

```
(f ∘ g)'(x) = f'(g(x)) × g'(x)
```

Dans un réseau de neurones, chaque couche est une composition de fonctions. La rétropropagation applique la règle de la chaîne depuis la couche de sortie jusqu'à la couche d'entrée, en multipliant les gradients couche par couche.

La **dérivée directionnelle** généralise ce principe : elle mesure le taux de variation d'une fonction dans une direction donnée, calculée en projetant le gradient sur cette direction.

### Prédictions en séries temporelles

Le calcul différentiel modélise les relations temporelles entre observations. La dérivée d'une série temporelle indique si la tendance accélère ou ralentit, information utile pour prédire les événements futurs.

## Récapitulatif

| Concept | Rôle en IA |
|---|---|
| **Dérivée** | Mesure la sensibilité d'une fonction à ses paramètres |
| **Gradient** | Direction de montée la plus rapide de la fonction de coût |
| **Descente de gradient** | Algorithme d'optimisation qui minimise la fonction de coût |
| **Dérivée partielle** | Gradient selon un paramètre spécifique dans un modèle multivarié |
| **Rétropropagation** | Application de la règle de chaîne pour calculer les gradients dans un réseau de neurones |
