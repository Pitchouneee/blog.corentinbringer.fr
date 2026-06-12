---
title: "Algorithmes d'apprentissage non supervisé"
description: Clustering et réduction de dimensionnalité. K-Means, DBSCAN, PCA et t-SNE expliqués avec leurs mécanismes, avantages et limites.
sidebar:
  label: "Algorithmes non supervisés"
---

L'apprentissage non supervisé travaille sur des données sans étiquettes. Le modèle ne cherche pas à prédire une sortie connue : il identifie des structures, des regroupements ou des relations cachées dans les données elles-mêmes.

Deux grandes familles d'algorithmes existent : le **clustering** (regroupement) et la **réduction de dimensionnalité**.

## Clustering

Le clustering organise des données non structurées en groupes appelés clusters. Les données d'un même cluster sont similaires entre elles, et différentes de celles des autres clusters.

Cas d'usage typiques : segmentation de clientèle, détection d'anomalies, analyse génomique.

### K-Means

K-Means organise les données en un nombre K de groupes prédéfini. La similarité entre points se mesure par la distance au **centroïde** de chaque groupe.

**Fonctionnement :**

1. L'algorithme sélectionne aléatoirement K points comme centroïdes initiaux.
2. Chaque point de données est affecté au centroïde le plus proche.
3. Une fois tous les points attribués, les centroïdes sont recalculés comme la moyenne des points de leur cluster.
4. Les étapes 2 et 3 se répètent jusqu'à ce que les centroïdes ne bougent plus significativement.

| | |
|---|---|
| **Avantages** | Simple, rapide, efficace sur de grands volumes |
| **Inconvénients** | K doit être fixé à l'avance, sensible aux valeurs aberrantes, suppose des clusters de forme sphérique |

### DBSCAN

DBSCAN (Density-Based Spatial Clustering of Applications with Noise) forme des clusters à partir de la **densité** locale des données. Contrairement à K-Means, il n'exige pas de connaître le nombre de clusters à l'avance et détecte naturellement les points aberrants.

**Fonctionnement :**

1. L'algorithme identifie les points centraux, ceux qui ont un nombre minimum de voisins dans un rayon donné.
2. Il étend les clusters depuis ces points centraux en y ajoutant tous les points à portée.
3. Les points trop éloignés de tout point central sont classés comme **bruit**.

| | |
|---|---|
| **Avantages** | Pas besoin de spécifier K, identifie des clusters de formes complexes, robuste aux valeurs aberrantes |
| **Inconvénients** | Le choix du rayon et du nombre minimum de voisins est délicat, performances dégradées sur des données de densités très variables |

## Réduction de dimensionnalité

La réduction de dimensionnalité diminue le nombre de caractéristiques (dimensions) d'un jeu de données tout en conservant l'information la plus pertinente. Elle accélère les algorithmes en aval, facilite la visualisation et réduit le bruit.

### PCA — Analyse en composantes principales

La PCA est une technique de réduction **linéaire**. Elle transforme les variables corrélées en un nouvel ensemble de variables non corrélées appelées composantes principales, en projetant les données sur un espace de dimension inférieure tout en conservant le maximum de variance.

**Fonctionnement :**

1. L'algorithme identifie la première composante principale (CP1) : l'axe le long duquel la variance des données est la plus grande.
2. Il identifie la deuxième composante principale (CP2) : le deuxième axe le plus important, orthogonal à CP1.
3. Ce processus continue jusqu'à couvrir un niveau de variance cible.
4. On conserve seulement les premières composantes (par exemple les deux premières pour la visualisation).

| | |
|---|---|
| **Avantages** | Simple, rapide, largement utilisée pour la compression et le prétraitement |
| **Inconvénients** | Ne capture que les relations linéaires, les composantes principales sont difficiles à interpréter |

### t-SNE

La t-SNE (t-Distributed Stochastic Neighbor Embedding) est une technique de réduction **non linéaire**, particulièrement adaptée à la **visualisation** de données de haute dimension. Elle produit une carte 2D ou 3D qui préserve la structure locale des données.

**Fonctionnement :**

1. L'algorithme calcule les probabilités de similarité entre chaque paire de points dans l'espace de haute dimension.
2. Il crée une carte de basse dimension où les points similaires restent proches.
3. Les points distants dans l'espace original sont repoussés les uns des autres.

| | |
|---|---|
| **Avantages** | Excellente pour la visualisation, révèle des structures non visibles avec PCA |
| **Inconvénients** | Beaucoup plus lente que PCA, résultats variables d'une exécution à l'autre (nature stochastique), non adaptée à la réduction pour l'entraînement |

## Tableau comparatif

| Algorithme | Type | Paramètre clé | Usage principal |
|---|---|---|---|
| **K-Means** | Clustering | K (nombre de clusters) | Segmentation, regroupement |
| **DBSCAN** | Clustering | Rayon + min. voisins | Détection d'anomalies, formes complexes |
| **PCA** | Réduction | Nombre de composantes | Compression, prétraitement |
| **t-SNE** | Réduction | Perplexité | Visualisation uniquement |
