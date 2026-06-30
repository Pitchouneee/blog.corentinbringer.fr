---
title: "HTTP QUERY : un verbe pour les lectures avec un corps"
date: 2026-06-30
authors:
  - corentin
tags:
  - http
  - rfc
  - api
  - rest
excerpt: POST a longtemps servi de palliatif pour les requêtes de lecture trop grandes pour une URL. La RFC 10008 officialise enfin un verbe dédié à ce cas.
---

**Mise à jour :** depuis la publication initiale de ce billet, le draft est devenu la RFC 10008, publiée en tant que Proposed Standard. L'implémentation dans les frameworks n'est pas encore là, mais la réponse officielle existe.

---

## Le problème

Quand un filtre de recherche dépasse ce qu'une URL peut raisonnablement transporter, la solution de fait est toujours la même : mettre le corps dans un POST et passer à autre chose.

Ça fonctionne. Mais ça casse des propriétés que HTTP offre gratuitement sur les vraies lectures.

- **Le cache ne s'active pas.** POST signifie «  écriture  » pour les proxies et les CDN. La réponse ne sera pas mise en cache, même si elle est identique d'une requête à l'autre.
- **Les retries deviennent risqués.** POST n'est pas idempotent par définition. Un client qui reçoit une erreur réseau ne sait pas s'il peut réémettre la requête sans effet de bord.
- **La sémantique disparaît.** Un proxy, un load balancer ou un log d'audit voit un POST et présume une modification d'état. Il n'a aucun moyen de distinguer ça d'une simple lecture filtrée.

Ce n'est pas un bug de conception de votre API. C'est une limite du protocole, et les développeurs la contournent depuis des années avec les mêmes workarounds.

## Ce que QUERY apporte

La RFC 10008 définit la méthode `QUERY`. Elle combine ce qui manquait : un corps de requête, avec la sémantique d'une lecture.

Concrètement :

- **Corps libre.** Comme POST, QUERY transporte un corps. Vous pouvez y mettre un objet JSON arbitrairement complexe, un filtre GraphQL, une requête SQL partielle, peu importe le format que votre ressource comprend.
- **Sûre et idempotente.** Comme GET, QUERY déclare qu'elle ne modifie pas l'état du serveur. Les clients peuvent la réémettre sans risque après une coupure réseau. Les proxies peuvent l'identifier comme une lecture.
- **Compatible avec le cache.** Les intermédiaires peuvent mettre la réponse en cache et la servir à d'autres clients qui envoient la même requête. C'est impossible avec POST sans configuration explicite et fragile.

Le protocole ajoute aussi un en-tête `Accept-Query`. Une ressource peut l'utiliser pour annoncer les formats de corps qu'elle accepte, de la même façon qu'`Accept` annonce les formats de réponse.

## Où on en est

La RFC 10008 est publiée en tant que **Proposed Standard** à l'IETF. C'est une étape formelle : le problème est reconnu, la solution est documentée et validée.

En pratique, aucun framework web majeur ne l'implémente encore nativement. Les navigateurs ne l'envoient pas. Les CDN ne savent pas encore quoi en faire. La route entre un Proposed Standard et une adoption réelle dans une stack de production prend du temps, et QUERY ne fait pas exception.

Ce que ça change dès maintenant : si vous contrôlez à la fois le client et le serveur d'une API interne, rien ne vous empêche de l'implémenter vous-même. La méthode est déclarée, la sémantique est claire. Un serveur qui comprend `QUERY` sur une route `/search` reste parfaitement conforme à HTTP.

## Ce que ça règle vraiment

Le problème n'est pas technique. Les développeurs ont des solutions qui fonctionnent depuis des années : POST avec un corps JSON, GET avec un paramètre encodé en base64, parfois GraphQL pour s'abstraire du problème. Ça tourne.

Ce que QUERY règle, c'est la sémantique. HTTP repose sur des conventions que les intermédiaires comprennent sans configuration : méthode sûre = lisible par le cache, idempotente = rejouable par le client. En utilisant POST pour des lectures, on sort de ces conventions et on perd les bénéfices associés, souvent sans s'en rendre compte.

Avoir un verbe explicite pour ce cas permet de retrouver ces propriétés sans workaround. C'est un ajustement de protocole, pas une refonte, et c'est exactement ce dont ce cas avait besoin.

## Sources

- [RFC 10008 – The HTTP QUERY Method](https://datatracker.ietf.org/doc/rfc10008/)
