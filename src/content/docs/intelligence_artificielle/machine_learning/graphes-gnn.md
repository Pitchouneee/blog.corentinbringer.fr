---
title: "Graphes et Graph Neural Networks"
description: Introduction aux données relationnelles sous forme de graphes, représentations par matrice et liste d'adjacence, puis passage aux GNN et au mécanisme de message passing.
sidebar:
  label: "Graphes et GNN"
---

Le machine learning traditionnel structure les données sous forme de tableaux. Beaucoup de données du monde réel ont pourtant une nature **relationnelle** : des entités liées par des connexions. Les graphes modélisent précisément ces structures.

## Qu'est-ce qu'un graphe ?

Un graphe est une structure de données composée de :

- **Nœuds (Nodes/Vertices)** : les entités du système. Dans un réseau social, ce sont les utilisateurs. Dans un graphe routier, ce sont les villes.
- **Arêtes (Edges/Links)** : les connexions entre les nœuds. Une arête peut représenter une amitié, une liaison chimique, une route.
  - **Graphe non orienté** : relations bidirectionnelles (A est ami avec B, donc B est ami avec A).
  - **Graphe orienté** : relations unidirectionnelles (A suit B sur Twitter, mais B ne suit pas forcément A).
- **Poids (Weights)** : valeur associée à une arête qui indique la force, le coût ou la distance de la relation.

## Applications des données relationnelles

Les graphes servent à modéliser de nombreux domaines :

| Domaine | Nœuds | Arêtes |
|---|---|---|
| **Réseaux Sociaux** | Utilisateurs | Amitiés, relations |
| **Molécules et Chimie** | Atomes | Liaisons chimiques |
| **Logistique et Routage** | Villes, entrepôts | Routes |
| **Systèmes de Recommandation** | Utilisateurs, produits | Achats, interactions |

## Représentations informatiques

Pour stocker et manipuler des graphes, deux structures de données s'opposent :

**Matrice d'Adjacence :** une matrice n×n où l'élément Aij vaut 1 s'il existe une arête entre le nœud i et le nœud j, 0 sinon.

- Avantage : rapide pour vérifier l'existence d'une arête entre deux nœuds.
- Inconvénient : inefficace en mémoire pour les graphes clairsemés (peu d'arêtes), car la matrice est remplie de zéros.

**Liste d'Adjacence :** une collection de listes. Pour chaque nœud, on stocke la liste de tous les nœuds auxquels il est directement connecté.

- Avantage : très efficace en mémoire pour les graphes clairsemés.
- Inconvénient : vérifier une connexion entre deux nœuds prend plus de temps, car il faut parcourir une liste.

## Des graphes aux Graph Neural Networks (GNN)

Les GNN sont une famille d'algorithmes de Deep Learning conçus pour fonctionner directement sur des structures de graphes. Ils appliquent les techniques des réseaux de neurones aux données non euclidiennes (non tabulaires).

L'idée fondamentale : apprendre des **représentations vectorielles** (embeddings) des nœuds qui encodent à la fois leurs propres caractéristiques et la structure de leur voisinage.

### Lien avec le Deep Learning classique

- **De la Convolution à la Propagation** : les CNN fonctionnent en glissant un filtre sur une grille régulière (les pixels). Les GNN généralisent cette idée à des structures irrégulières. La phase d'agrégation dans un GNN peut être vue comme une «convolution» sur le graphe.
- **Des Séquences aux Graphes** : de la même façon que les RNN ont été conçus pour les données séquentielles, les GNN ont été conçus pour les données relationnelles.

### Mécanisme : Message Passing (Propagation de messages)

Le concept clé derrière les GNN est le processus de **propagation de messages**. Un GNN apprend une représentation pour chaque nœud en agrégeant les informations de ses voisins, de manière itérative sur plusieurs couches.

**Les trois phases :**

1. **Phase de Message** : chaque nœud crée un «message» pour chacun de ses voisins, généralement une transformation de son propre état.
2. **Phase d'Agrégation** : chaque nœud collecte tous les messages reçus de ses voisins. Ces messages sont agrégés en une seule représentation (somme, moyenne ou maximum).
3. **Phase de Mise à jour** : chaque nœud utilise cette représentation agrégée, combinée à son propre état précédent, pour calculer son nouvel état.

Ce processus se répète sur plusieurs couches. À chaque nouvelle couche, l'information se propage plus loin dans le graphe : un nœud «voit» non seulement ses voisins immédiats, mais aussi les voisins de ses voisins.

### Tâches possibles avec les GNN

Les embeddings appris par un GNN servent à plusieurs tâches :

- **Classification de nœuds** : déterminer si un utilisateur est un «bot» ou non.
- **Prédiction de liens** : recommander une amitié ou prédire une interaction.
- **Classification de graphes entiers** : prédire les propriétés d'une molécule.
