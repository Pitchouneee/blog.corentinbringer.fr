---
title: "Apprentissage par renforcement"
description: Agent, environnement, récompenses. Q-Learning, Deep Q-Networks et PPO expliqués avec leurs mécanismes et leurs cas d'usage.
sidebar:
  label: "Apprentissage par renforcement"
---

L'apprentissage par renforcement (RL) repose sur un paradigme radicalement différent des deux autres types d'apprentissage. Un **agent** interagit avec un **environnement**, prend des décisions et reçoit un signal de **récompense** en retour. Il apprend par essais et erreurs à maximiser sa récompense cumulée au fil du temps.

L'analogie la plus directe est celle d'un enfant qui apprend à marcher : il tombe (récompense négative), se relève, ajuste sa démarche, et converge progressivement vers ce qui fonctionne.

## Concepts de base

Le modèle tourne autour de trois éléments :

- **Agent** : le système qui prend les décisions (le modèle entraîné).
- **Environnement** : le contexte dans lequel l'agent opère (un jeu vidéo, une simulation physique, un réseau informatique).
- **Récompense** : le signal numérique reçu après chaque action, positif ou négatif selon le résultat.

L'agent ne suit pas de règles programmées. Il explore son environnement en découvrant quelles actions mènent aux meilleures récompenses. L'objectif est d'apprendre une **politique** (mapping état → action) qui maximise la récompense cumulée à long terme.

**Cas d'usage :**

| Domaine | Exemple |
|---|---|
| Jeux | AlphaGo, agents Atari, Tic-Tac-Toe |
| Robotique | Apprentissage de la marche, préhension d'objets |
| Systèmes | Optimisation énergétique de datacenters |
| Véhicules autonomes | Conduite dans des simulateurs |

## Q-Learning

Le Q-Learning apprend une **politique optimale** en évaluant la qualité (valeur Q) de chaque action dans un état donné. La valeur Q représente la récompense future attendue pour une action spécifique dans un état spécifique.

**Mécanisme :**

L'agent maintient une table de Q-valeurs. À chaque étape, il choisit une action (en équilibrant exploration et exploitation), observe la récompense et le nouvel état, puis met à jour la Q-valeur de la paire état-action précédente selon la formule de mise à jour de Bellman.

L'algorithme est dit **sans modèle** : il n'a pas besoin de connaître la structure de l'environnement pour fonctionner.

**Usage :** labyrinthes, jeux simples, robotique sur des tâches de navigation basique.

## Deep Q-Networks (DQN)

Le DQN est une extension du Q-Learning qui remplace la table de Q-valeurs par un **réseau de neurones profonds**. Cela permet de l'appliquer à des environnements avec un espace d'états trop large pour tenir dans une table.

**Mécanisme :**

Au lieu d'une table, un réseau de neurones prend l'état en entrée et produit les Q-valeurs de toutes les actions possibles en sortie. Pour stabiliser l'apprentissage, DQN utilise deux techniques :

- **Experience replay** : les transitions passées sont stockées et tirées aléatoirement pour l'entraînement, ce qui casse les corrélations temporelles.
- **Target network** : un second réseau, mis à jour moins fréquemment, sert de cible stable pour le calcul des Q-valeurs.

**Usage :** jeux Atari (DQN a atteint un niveau surhumain sur Breakout et Pong), navigation visuelle de robots, contrôle de systèmes complexes.

## PPO — Proximal Policy Optimization

Le PPO adopte une approche différente des deux précédents : au lieu d'apprendre les Q-valeurs, il apprend directement une **politique**, une fonction qui mappe les états aux actions à prendre.

**Mécanisme :**

L'agent exécute une série d'actions selon sa politique actuelle et collecte les données de cette expérience. Il ajuste ensuite sa politique de manière incrémentale en veillant à ne pas faire de changements trop brusques. C'est le sens du terme «proximal» : les mises à jour sont contraintes pour rester proches de la politique précédente, ce qui stabilise et accélère l'apprentissage.

**Usage :** robotique (apprentissage de la marche bipède), conduite dans des simulateurs, jeux vidéo complexes avec des espaces d'actions continus.

## Comparatif

| Algorithme | Approche | Espace d'états | Points forts |
|---|---|---|---|
| **Q-Learning** | Table de valeurs | Petit et discret | Simple, converge vers l'optimal |
| **DQN** | Réseau de neurones | Grand ou continu | Passe à l'échelle, entrées visuelles |
| **PPO** | Politique directe | Continu | Stable, efficace, production-ready |
