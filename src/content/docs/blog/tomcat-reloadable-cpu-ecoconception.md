---
title: "Tomcat reloadable : un cœur à 100 % toutes les 20 secondes"
date: 2026-10-20
authors:
  - corentin
tags:
  - java
  - tomcat
  - kubernetes
  - performance
  - ecoconception
  - green-it
excerpt: Des pics CPU à 100 % pendant 10 secondes, toutes les 20 secondes, sur nos pods Kubernetes comme sur nos vieilles VM Tomcat. La cause tient en un attribut de configuration hérité du développement, et la correction en une ligne.
---

Sur nos clusters Kubernetes, et jusque sur les anciennes VM qui hébergent encore un Tomcat installé à la main, les graphes de consommation CPU montraient tous le même motif : un cœur qui monte à 100 % pendant une dizaine de secondes, redescend, puis remonte vingt secondes après le début du pic précédent. Sans charge applicative, sans requête entrante, sans traitement planifié côté métier.

Un motif aussi régulier ne vient pas des utilisateurs. Il vient d'une horloge interne.

## Le symptôme

| Observation | Valeur |
|---|---|
| Amplitude | un cœur à 100 % |
| Durée du pic | environ 10 secondes |
| Période | environ 20 secondes |
| Périmètre | pods Kubernetes et VM legacy, même comportement |
| Lien avec le trafic | aucun, le motif persiste à vide |

Le fait que le comportement soit identique sur deux plateformes aussi différentes oriente vers ce qu'elles ont en commun : le serveur d'applications et sa configuration.

## La cause : `reloadable="true"`

Le contexte des applications était déclaré avec l'attribut `reloadable` activé :

```xml
<Context reloadable="true">
    ...
</Context>
```

La documentation de Tomcat décrit cet attribut sans ambiguïté. Avec `reloadable="true"`, Catalina surveille `/WEB-INF/classes/` et `/WEB-INF/lib` et recharge l'application dès qu'une modification est détectée. La même documentation précise que cette fonction « requires significant runtime overhead and is not recommended for use on deployed production applications », et que c'est la raison pour laquelle la valeur par défaut est `false`.

Ce réglage sert au développement : on recompile une classe, Tomcat recharge l'application sans redémarrage. Il a probablement été posé à cette époque, puis recopié d'image en image et de VM en VM sans que personne ne le remette en question.

## Le mécanisme

Tomcat exécute un thread de fond, `ContainerBackgroundProcessor`, qui appelle périodiquement la méthode `backgroundProcess` de chaque conteneur : moteur, hôtes, contextes. C'est lui qui gère l'expiration des sessions et, quand `reloadable` est actif, la surveillance des classes.

À chaque passage, le chargeur de classes de l'application vérifie si une ressource a changé. Concrètement, il parcourt les classes et les jars déjà chargés et compare leur date de modification sur le disque. Sur une application Java d'entreprise, cela représente plusieurs milliers de fichiers et des dizaines, voire des centaines de jars. Chaque passage relit donc l'état d'une grande partie du classpath, uniquement pour constater que rien n'a bougé.

Le rythme de ce thread est fixé par l'attribut `backgroundProcessorDelay` de l'élément `Engine`, dont la valeur par défaut est de **10 secondes**. Le délai court à partir de la fin d'un passage. Un passage de vérification qui dure lui-même une dizaine de secondes, suivi de 10 secondes d'attente, donne un cycle de 20 secondes. Ce calcul correspond au motif observé. Je n'ai pas instrumenté le thread pour mesurer précisément la durée de chaque passage, la correspondance repose sur les graphes et sur la disparition du motif après correction.

## Pourquoi c'est inutile dans notre cas

Le rechargement à chaud n'a aucun usage dans nos déploiements :

- **sur Kubernetes**, une image est immuable. Une nouvelle version de l'application correspond à une nouvelle image et à de nouveaux pods. Aucun fichier ne change dans `/WEB-INF/lib` d'un conteneur en cours d'exécution ;
- **sur les VM**, les livraisons passent par un redéploiement du WAR et un redémarrage contrôlé, jamais par une recompilation sur place.

Tomcat vérifiait donc toutes les 20 secondes, sur chaque instance, une condition qui ne pouvait pas devenir vraie.

## Ce que ça coûte

Un pic de 10 secondes toutes les 20 secondes revient à occuper un cœur la moitié du temps, en continu, jour et nuit. Par instance, cela représente un demi-cœur consommé en permanence pour rien. À 2 GHz, ce sont environ 1 milliard de cycles par seconde, en moyenne, dépensés à relire des dates de modification.

Le coût se multiplie ensuite par le nombre d'instances :

| Instances de l'application | Cœurs occupés en moyenne |
|---|---|
| 1 | 0,5 |
| 10 | 5 |
| 40 | 20 |

Ces chiffres sont une moyenne arithmétique tirée du motif observé, et non une mesure de consommation électrique. Je ne dispose pas de données vérifiables sur la puissance réellement consommée par cœur sur nos hyperviseurs. Le principe reste le même : un processeur occupé consomme plus qu'un processeur au repos, et cette charge tournait 24 heures sur 24 sur tout le parc.

Sur Kubernetes, l'effet ne s'arrête pas à l'électricité. Une charge CPU périodique peut fausser la lecture des métriques, déclencher du throttling quand le pod atteint sa limite CPU, et peser sur les décisions d'un autoscaler horizontal basé sur le CPU. Autant de ressources réservées ou ajoutées pour absorber un travail sans valeur.

## La correction

La correction tient en un attribut :

```xml
<Context reloadable="false">
    ...
</Context>
```

Retirer purement l'attribut produit le même résultat, puisque `false` est la valeur par défaut. Si un rechargement ponctuel reste nécessaire sur une VM, l'application Manager de Tomcat permet de le déclencher à la demande, sans surveillance permanente.

Pour retrouver toutes les occurrences, une recherche dans les configurations et les images suffit :

```bash
grep -rn 'reloadable="true"' "$CATALINA_BASE/conf" "$CATALINA_BASE/webapps"
```

Il faut penser à toutes les sources possibles de configuration d'un contexte : `conf/context.xml`, `conf/server.xml`, `conf/[moteur]/[hôte]/*.xml`, et le `META-INF/context.xml` embarqué dans le WAR lui-même.

Pour confirmer le diagnostic avant correction, un `jstack` pris pendant un pic montre le thread `ContainerBackgroundProcessor` occupé dans le chargeur de classes de l'application. Après correction, le motif disparaît des graphes : la courbe CPU à vide redevient plate.

## Ce que je retiens

**Une configuration de développement finit toujours par arriver en production.** `reloadable="true"` est utile sur un poste de développeur. Recopié dans une image de base, il se propage silencieusement à chaque nouveau service construit sur cette image.

**Un motif périodique à vide mérite une investigation.** Une consommation qui suit une horloge plutôt que le trafic désigne presque toujours un traitement interne. Ici, la régularité du motif a suffi à orienter la recherche vers un thread de fond.

**L'écoconception commence par ne pas faire de travail inutile.** Avant d'optimiser un algorithme ou de redimensionner un cluster, retirer une tâche sans valeur est la mesure la moins coûteuse. Une ligne de configuration a supprimé l'équivalent d'un demi-cœur par instance, sur tout le parc.

## Sources

- [Stack Overflow — Why Tomcat reloadable="true" cause CPU 100%?](https://stackoverflow.com/questions/53697417/why-tomcat-reloadable-true-cause-cpu-100)
- [Apache Tomcat 9 — Configuration Reference, The Context Container](https://tomcat.apache.org/tomcat-9.0-doc/config/context.html)
- [Apache Tomcat 9 — Configuration Reference, The Engine Container](https://tomcat.apache.org/tomcat-9.0-doc/config/engine.html)
