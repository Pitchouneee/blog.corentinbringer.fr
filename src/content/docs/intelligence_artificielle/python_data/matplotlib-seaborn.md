---
title: "Matplotlib et Seaborn"
description: Visualisation de données en Python. Anatomie d'une figure Matplotlib, graphiques fondamentaux, personnalisation, subplots, puis Seaborn pour les distributions, données catégorielles et heatmaps.
sidebar:
  label: "Matplotlib et Seaborn"
---

La visualisation est une étape indispensable de l'analyse de données : elle permet de comprendre la distribution des variables, de détecter les valeurs aberrantes et de communiquer les résultats. Python propose deux bibliothèques complémentaires : Matplotlib pour le contrôle total, Seaborn pour la rapidité d'exécution.

## Matplotlib

### Anatomie d'une figure

Matplotlib structure ses figures selon une hiérarchie :

- Une **Figure** contient des **Axes** (les zones de graphiques).
- Les **Axis** sont les axes X et Y (graduations).
- Les **Axes** sont le graphique lui-même, avec toutes ses données et paramètres.

Deux façons de coder :

1. **Pyplot (`plt.plot()`)** : rapide, état global, idéal pour l'exploration.
2. **Orienté Objet (`fig, ax = plt.subplots()`)** : explicite, puissant, recommandé pour les figures complexes.

```python
import matplotlib.pyplot as plt

# Interface Orientée Objet (recommandée)
fig, ax = plt.subplots()  # Création Figure + Axes
ax.plot(x, y)             # Tracé
ax.set_title("Mon Titre") # Configuration
plt.show()                # Affichage
```

### Graphiques fondamentaux

Matplotlib choisit le type de graphique selon la question analytique :

| Question | Graphique | Code |
|---|---|---|
| Évolution dans le temps | Ligne | `ax.plot(x, y)` |
| Comparaison de catégories | Barres | `ax.bar(categories, valeurs)` |
| Distribution d'une variable | Histogramme | `ax.hist(data, bins=20)` |
| Corrélation entre deux variables | Nuage de points | `ax.scatter(x, y)` |

### Personnalisation

```python
ax.set_title("Ventes 2023")
ax.set_xlabel("Mois")
ax.grid(True, linestyle='--', alpha=0.5)
ax.legend(loc='upper right')
ax.plot(x, y, color='#0d9488', linestyle='--')
```

### Subplots — Mise en page multi-graphiques

```python
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

# Accès au graphique en haut à gauche
axes[0, 0].plot(x, y)
axes[0, 0].set_title("Graphique 1")

# En bas à droite
axes[1, 1].scatter(x, y)

# sharex=True pour partager l'axe temporel
fig, axes = plt.subplots(2, 1, sharex=True)
```

### Boxplots et sauvegarde

```python
plt.style.use('ggplot')
fig, ax = plt.subplots()
ax.boxplot(data)

# Exportation haute qualité
fig.savefig('analyse.pdf')
fig.savefig('plot.png', dpi=300)
```

## Seaborn

Seaborn simplifie les tâches de Matplotlib, produit des graphiques plus soignés par défaut et s'intègre directement avec les DataFrames Pandas.

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Gain d'efficacité : régression en 1 ligne (vs 10+ lignes Matplotlib)
sns.regplot(x='taille', y='poids', data=df)
```

Seaborn fonctionne mieux avec les données au format **long** (tidy data) : chaque variable est une colonne, chaque observation est une ligne. Ses fonctions mappent directement les noms de colonnes aux axes X, Y ou aux couleurs (hue).

### Visualisation des distributions

**Distribution univariée :**

```python
# Histogramme + courbe de densité (KDE)
sns.histplot(data=df, x='colonne_A', kde=True)
```

**Distribution bivariée :**

```python
# Nuage de points central + histogrammes marginaux
sns.jointplot(data=df, x='col_X', y='col_Y')
```

### Données catégorielles

```python
# Boxplot : médiane, quartiles et valeurs aberrantes
sns.boxplot(x='catégorie', y='prix', data=df)

# Violin plot : distribution de densité sous-jacente
sns.violinplot(x='catégorie', y='prix', data=df)
```

Le **swarmplot** affiche tous les points sans chevauchement, utile pour les petits jeux de données.

### Relations et heatmaps

```python
# Régression avec intervalle de confiance à 95 %
sns.regplot(x='X', y='Y', data=df, ci=95)

# Matrice de corrélation visualisée
corr = df.corr()
sns.heatmap(corr, annot=True)
```

`sns.heatmap(df.corr())` est le moyen standard de visualiser les forces des relations entre toutes les paires de variables d'un DataFrame.

## Quand utiliser l'un ou l'autre ?

| Besoin | Outil recommandé |
|---|---|
| Exploration rapide d'un DataFrame | Seaborn |
| Figure complexe multi-panneaux | Matplotlib (OO) |
| Matrice de corrélation | `sns.heatmap` |
| Rapport avec mise en page précise | Matplotlib + `fig.savefig` |
| Distribution + densité | `sns.histplot(kde=True)` |
