---
title: "Les types d'apprentissage en machine learning"
description: Apprentissage supervisé, non supervisé et par renforcement. Les trois paradigmes fondamentaux du machine learning et leurs cas d'usage.
sidebar:
  label: "Types d'apprentissage"
---

Le machine learning (ML) est un sous-domaine de l'IA dans lequel un système apprend à partir de données plutôt que d'être explicitement programmé. Il existe trois paradigmes principaux, selon la nature des données disponibles et l'objectif visé.

## IA, ML et Deep Learning

Ces trois termes désignent des périmètres imbriqués.

- **Intelligence Artificielle (IA)** : domaine général visant à faire exécuter des tâches cognitives aux machines.
- **Machine Learning (ML)** : sous-domaine de l'IA. Au lieu de programmer chaque règle, le système apprend à partir de données et s'améliore avec l'expérience.
- **Deep Learning (DL)** : sous-domaine du ML. Il utilise des réseaux de neurones à de nombreuses couches pour modéliser des abstractions complexes. Il excelle sur la reconnaissance d'images et le traitement du langage naturel.

## Apprentissage supervisé

Le modèle apprend à partir d'un jeu de données **étiquetées** : pour chaque entrée, la sortie attendue est connue. L'objectif est de généraliser cette relation pour prédire la sortie sur de nouvelles données.

Deux grandes tâches existent :

- **Régression** : prédire une valeur continue (prix d'un bien immobilier, température de demain). Algorithmes courants : régression linéaire, forêt aléatoire, KNN.
- **Classification** : attribuer une catégorie à une entrée (spam ou non-spam, détection de maladie). Algorithmes courants : régression logistique, SVM.

## Apprentissage non supervisé

Le modèle travaille sur des données **non étiquetées**. Il cherche à identifier des structures cachées sans supervision humaine.

- **Clustering** : regrouper des individus similaires (segmentation clients, détection d'anomalies).
- **Réduction de dimension** : compresser les données en conservant l'information utile (PCA).

## Apprentissage par renforcement

Un **agent** prend des décisions dans un environnement et reçoit des récompenses ou des pénalités selon ses actions. Il apprend par essais et erreurs à maximiser sa récompense totale. C'est le paradigme derrière AlphaGo et les systèmes de conduite autonome.

## Récapitulatif

| Type | Données | Objectif | Exemples d'algorithmes |
|---|---|---|---|
| Supervisé | Étiquetées | Prédire une sortie connue | Régression linéaire, SVM, KNN |
| Non supervisé | Non étiquetées | Découvrir des structures | K-Means, PCA |
| Par renforcement | Retours d'environnement | Maximiser une récompense | Q-Learning, PPO |
