---
title: "PrimeFaces 7 : une montée de version qui vire à la réécriture"
date: 2026-08-17
authors:
  - corentin
tags:
  - java
  - spring
  - primefaces
  - jsf
  - migration
  - dette-technique
  - strangler-fig
excerpt: Une dépendance PrimeFaces 7 récupérée puis peut-être modifiée, aucun moyen de le vérifier, et l'idée de repasser sur la version officielle. Récit d'un arbitrage où la simple montée de version s'est révélée être une réécriture, et où l'effort est finalement parti ailleurs.
---

Le projet dont il est question ici tourne sur Spring, Java 11, et PrimeFaces 7 pour toute la partie JSF. Une base solide, en production, qui porte du métier réel. C'est aussi une base qui traîne une incertitude gênante.

## Le point de départ : une dépendance dont on ne sait plus rien

Historiquement, la bibliothèque PrimeFaces 7 a été récupérée puis, d'après quelques bruits de couloir, modifiée. Personne dans l'équipe actuelle ne peut confirmer ce qui a été touché, ni pourquoi. Le jar est là, il fonctionne, mais je n'ai aucun moyen de vérifier son intégrité par rapport à l'artefact officiel.

Cette zone d'ombre est un problème en soi. Une dépendance dont on ignore la provenance exacte, c'est une surface d'attaque potentielle et une dette impossible à raisonner. Mon objectif premier était donc modeste : repasser a minima sur la version officielle de la dépendance, publiée sur le dépôt Maven, pour retrouver une base connue et reproductible.

L'idée de départ n'était pas une grande montée de version. Juste remettre du sûr là où il y avait de l'incertain.

## Revenir sur le 7 officiel, presque indolore

Repasser sur la 7 officielle n'a pas posé de vrai problème. Quelques signatures de méthodes à ajuster, rien de plus. La base retrouvait une provenance connue, reproductible depuis le dépôt Maven, et c'était déjà l'essentiel de l'objectif de départ.

Un signal a confirmé au passage que le jar en place avait bien été trafiqué : certains imports pointaient vers le JSON embarqué dans PrimeFaces plutôt que vers la bibliothèque standard. C'est exactement le genre de trace que laisse une dépendance bricolée.

```java
// Avant
import org.primefaces.shaded.json.JSONObject;

// Après
import org.json.JSONObject;
```

## Monter en 8, une marche franchissable

La 8 a demandé davantage de travail, sans devenir violente pour autant. Les ruptures sont concrètes, localisées, et se traitent au cas par cas. Les voici dans l'ordre où elles sont tombées.

### Le déplacement de UploadedFile

La classe de gestion des fichiers uploadés a changé de paquet, et sa méthode d'accès au flux a été renommée pour respecter la casse Java.

```java
// Avant
import org.primefaces.model.UploadedFile;
// ...
file.getInputstream();

// Après
import org.primefaces.model.file.UploadedFile;
// ...
file.getInputStream();
```

### Le contenu d'un fichier uploadé via un événement

Sur `org.primefaces.event.FileUploadEvent`, la récupération du contenu binaire a suivi le même mouvement.

```java
// Avant
byte[] data = event.getFile().getContents();

// Après
byte[] data = event.getFile().getContent();
```

### Le changement de signature de LazyDataModel

C'est le changement le plus intrusif, parce qu'il touche tous les tableaux paginés côté serveur. Le type des filtres passe de `Map<String, Object>` à `Map<String, FilterMeta>`.

```java
// Avant
public List<Client> load(int first, int pageSize, String sortField,
        SortOrder sortOrder, Map<String, Object> filters) {

// Après
public List<Client> load(int first, int pageSize, String sortField,
        SortOrder sortOrder, Map<String, FilterMeta> filters) {
```

`FilterMeta` transporte davantage d'information qu'une simple valeur, et ses accesseurs ont aussi été renommés. Là où on lisait le champ ou l'ordre de tri directement, il faut désormais passer par les nouvelles méthodes.

```java
// meta étant un FilterMeta
meta.getSortField();  // devient meta.getField()
meta.getSortOrder();  // devient meta.getOrder()
meta.getFilterField(); // devient meta.getField()
```

### Le pont entre l'ancien et le nouveau contrat

Le changement de signature ne s'arrête pas à la méthode `load`. Elle propage `FilterMeta` dans toute la couche d'accès aux données. Sur une méthode comme celle-ci :

```java
List<PrescriptionTransport> getPrescriptionParClient(int first, int pageSize,
        Map<String, FilterMeta> filters, Client client)
```

l'appel interne à `this.getCriteriaForPrescriptionByCLient(filters, client)` attendait, lui, l'ancienne `Map<String, Object>`. Deux options : propager `FilterMeta` jusqu'au fond de la couche Criteria, ou convertir en frontière. J'ai choisi la conversion, moins invasive, pour ne pas réécrire la construction des `Criteria` Hibernate.

```java
Map<String, Object> oldStyleFilters = convertFilters(filters);
Criteria criteria = this.getCriteriaForPrescriptionByCLient(oldStyleFilters, client)
        .setProjection(Projections.groupProperty("prescription.id"));
```

```java
private Map<String, Object> convertFilters(Map<String, FilterMeta> filters) {
    if (filters == null || filters.isEmpty()) {
        return Collections.emptyMap();
    }

    Map<String, Object> converted = new HashMap<>();
    for (Map.Entry<String, FilterMeta> entry : filters.entrySet()) {
        if (entry.getValue() != null && entry.getValue().getValue() != null) {
            converted.put(entry.getKey(), entry.getValue().getValue());
        }
    }
    return converted;
}
```

Cette conversion est un compromis assumé. Elle jette l'information supplémentaire portée par `FilterMeta`, mais elle isole le changement d'API à un seul point plutôt que de le diffuser dans toute la couche persistance.

### Le sanitizer HTML devenu obligatoire

Dernier écueil, à l'exécution cette fois. Le composant `TextEditor` refuse de s'afficher si le sanitizer HTML n'est pas au classpath.

```
javax.faces.FacesException: TextEditor component is marked secure='true'
but the HTML Sanitizer was not found on the classpath. Either add the HTML
sanitizer to the classpath per the documentation or mark secure='false'...
```

Baisser la garde en passant `secure='false'` n'était pas envisageable, l'éditeur reçoit du contenu utilisateur. La bonne réponse est d'ajouter la dépendance attendue, dans le pom du module :

```xml
<dependency>
    <groupId>com.googlecode.owasp-java-html-sanitizer</groupId>
    <artifactId>owasp-java-html-sanitizer</artifactId>
</dependency>
```

et de fixer sa version dans le pom parent qui centralise la gestion des versions :

```xml
<dependency>
    <groupId>com.googlecode.owasp-java-html-sanitizer</groupId>
    <artifactId>owasp-java-html-sanitizer</artifactId>
    <version>20191001.1</version>
</dependency>
```

Au bout de cette marche, l'ensemble PrimeFaces 8 tenait. Restait la version du langage.

## Java 17 sans douleur, avec OpenRewrite

La montée de Java 11 vers Java 17 s'est faite sans accroc, en s'appuyant sur OpenRewrite. Les recettes de migration automatisent la réécriture du code sur les points connus, et l'outil absorbe le gros du travail mécanique plutôt que de le laisser à la main. Sur le périmètre concerné, PrimeFaces 8 et Java 17 réunis représentaient de l'ordre d'un jour et demi à deux jours. Raisonnable, et sans commune mesure avec ce qui allait suivre.

## Le mur de la 10

C'est la montée vers PrimeFaces 10 qui a tout changé. Là, les ruptures ne se rattrapent plus par quelques ajustements de signatures. Le volume et la nature des changements reviennent à réécrire les écrans, pas à les adapter. Le verdict était sans appel : au bout de cette trajectoire, ce n'est plus une montée de version, c'est une réécriture déguisée. Et payer une réécriture pour rester sur une pile JSF, ça n'a pas de sens quand on la remplace déjà par ailleurs.

## L'arbitrage : arrêter, et déplacer l'effort

En parallèle de cette investigation, un autre chantier avançait déjà : refaire les écrans en React. Ce chantier est long, et il est mené selon le **strangler fig pattern**. On remplace les écrans un par un, en laissant l'ancien et le nouveau cohabiter, plutôt que de viser le grand soir. Vouloir tout réécrire d'un coup est joli sur le papier, mais c'est de la science-fiction quand le métier a besoin d'avancer en continu.

Face au mur de la 10, la décision devient évidente. Financer une réécriture des écrans pour rester sur une pile JSF qu'on remplace de toute façon un à un n'a pas de sens. Le trade-off retenu : laisser la partie JSF en l'état, et concentrer l'effort sur ce qui fait réellement avancer la migration.

Cet effort, c'est l'outillage IA. En parallèle, l'équipe construit ses propres fichiers de règles pour Claude, des fichiers Markdown structurés pour qu'à partir de la capture d'un ancien écran JSF, l'assistant s'appuie sur notre bibliothèque de composants React et reconstitue l'écran. L'objectif est d'accélérer la partie la plus coûteuse de la migration, la reconstruction des interfaces, plutôt que de payer deux fois : une fois pour moderniser du JSF condamné, une autre pour le remplacer.

## Ce que je retiens

Une montée de version n'est jamais une opération neutre tant qu'on n'a pas mesuré la surface d'API réellement impactée. Ici, l'intention modeste, revenir à une dépendance officielle vérifiable, a été atteinte sans douleur. C'est en cherchant à monter plus haut dans les versions que le coût a basculé, jusqu'à rejoindre celui d'une réécriture avec la 10.

Le rôle d'architecte n'est pas de mener chaque piste jusqu'au bout par principe. C'est de savoir arrêter une piste quand son coût dépasse sa valeur au regard de la trajectoire déjà tracée. La dette JSF reste réelle, mais elle s'éteindra d'elle-même à mesure que le strangler fig avance, sans qu'on ait à financer une modernisation intermédiaire d'une pile en fin de vie.

Reste l'incertitude initiale sur l'intégrité du jar. Elle n'est pas résolue, elle est contournée par isolation : le périmètre JSF est gelé, il ne reçoit plus de nouvelles fonctionnalités, et chaque écran migré le retire un peu plus de l'équation.
