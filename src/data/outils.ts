export interface Outil {
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
}

export const CATEGORIES = [
  'Sécurité',
  'CTF & Forensic',
  'Conteneurisation',
  'Backend & Java',
  'Observabilité',
  'IA & Data',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Sécurité': '#ef4444',
  'CTF & Forensic': '#a855f7',
  'Conteneurisation': '#3b82f6',
  'Backend & Java': '#22c55e',
  'Observabilité': '#f59e0b',
  'IA & Data': '#06b6d4',
};

export const outils: Outil[] = [
  // --- Sécurité ---
  {
    name: 'Burp Suite',
    description: 'Proxy d\'interception pour auditer les applications web. Analyse les requêtes HTTP, teste les paramètres et rejoue des attaques.',
    url: 'https://portswigger.net/burp',
    category: 'Sécurité',
    tags: ['web', 'proxy', 'pentest'],
  },
  {
    name: 'OWASP ZAP',
    description: 'Scanner de vulnérabilités web open source. Bonne alternative à Burp pour l\'automatisation et les pipelines CI.',
    url: 'https://www.zaproxy.org/',
    category: 'Sécurité',
    tags: ['web', 'scanner', 'open source'],
  },
  {
    name: 'Nmap',
    description: 'Scanner réseau de référence. Découverte d\'hôtes, détection de services et reconnaissance de l\'infrastructure.',
    url: 'https://nmap.org/',
    category: 'Sécurité',
    tags: ['réseau', 'reconnaissance', 'scanner'],
  },
  {
    name: 'Gobuster',
    description: 'Brute force de répertoires, sous-domaines et fichiers cachés sur les serveurs web. Rapide et configurable.',
    url: 'https://github.com/OJ/gobuster',
    category: 'Sécurité',
    tags: ['web', 'fuzzing', 'énumération'],
  },
  {
    name: 'SQLMap',
    description: 'Automatise la détection et l\'exploitation des injections SQL. Supporte la majorité des bases de données.',
    url: 'https://sqlmap.org/',
    category: 'Sécurité',
    tags: ['sql', 'injection', 'automatisation'],
  },
  {
    name: 'Nikto',
    description: 'Scanner de serveurs web qui détecte les fichiers dangereux, les mauvaises configurations et les versions obsolètes.',
    url: 'https://cirt.net/Nikto2',
    category: 'Sécurité',
    tags: ['web', 'scanner', 'configuration'],
  },
  {
    name: 'Trivy',
    description: 'Scanner de vulnérabilités pour les images Docker, les dépôts Git et les fichiers de configuration IaC.',
    url: 'https://trivy.dev/',
    category: 'Sécurité',
    tags: ['docker', 'cve', 'iac'],
  },
  {
    name: 'hermes-dec',
    description: 'Désassemble et décompile le bytecode Hermes produit par les applications React Native. Complément à JADX pour le reverse mobile.',
    url: 'https://github.com/P1sec/hermes-dec',
    category: 'CTF & Forensic',
    tags: ['react-native', 'reverse', 'mobile'],
  },
  {
    name: 'Maigret',
    description: 'Recherche un nom d\'utilisateur sur des centaines de sites et agrège les profils trouvés pour construire une empreinte numérique.',
    url: 'https://github.com/soxoj/maigret',
    category: 'Sécurité',
    tags: ['osint', 'reconnaissance', 'profiling'],
  },
  {
    name: 'OSINT Framework',
    description: 'Arborescence de ressources OSINT classées par type de donnée : e-mails, pseudos, réseaux sociaux, noms de domaine, géolocalisation. Point de départ pour cadrer une phase de reconnaissance.',
    url: 'https://osintframework.com/',
    category: 'Sécurité',
    tags: ['osint', 'reconnaissance', 'ressources'],
  },
  {
    name: 'nosqlinjection_wordlists',
    description: 'Listes de payloads spécialisées pour les injections NoSQL sur MongoDB, CouchDB et Redis.',
    url: 'https://github.com/cr0hn/nosqlinjection_wordlists',
    category: 'Sécurité',
    tags: ['nosql', 'injection', 'wordlists'],
  },
  {
    name: 'malicious-pdf',
    description: 'Génère des fichiers PDF avec des charges utiles embarquées pour tester les parsers, antivirus et règles de filtrage.',
    url: 'https://github.com/jonaslejon/malicious-pdf',
    category: 'Sécurité',
    tags: ['pdf', 'test', 'antivirus'],
  },
  {
    name: 'PentestGPT',
    description: 'Outil de pentest piloté par un LLM. Guide les phases de reconnaissance, d\'exploitation et de post-exploitation en mode conversationnel.',
    url: 'https://github.com/GreyDGL/PentestGPT',
    category: 'Sécurité',
    tags: ['ia', 'pentest', 'llm'],
  },
  {
    name: 'Awesome Hacking',
    description: 'Liste curatée de dépôts GitHub couvrant l\'ensemble du spectre offensif : exploitation, forensic, malware, OSINT, reversing.',
    url: 'https://github.com/Hack-with-Github/Awesome-Hacking',
    category: 'Sécurité',
    tags: ['référence', 'ressources', 'curated'],
  },
  {
    name: 'PayloadsAllTheThings',
    description: 'Dépôt de payloads et de techniques d\'exploitation pour les pentesters. Référence pour les injections, bypasses et escalades de privilèges.',
    url: 'https://github.com/swisskyrepo/PayloadsAllTheThings',
    category: 'Sécurité',
    tags: ['payloads', 'référence', 'pentest'],
  },
  {
    name: 'SecLists',
    description: 'Collection de wordlists pour le fuzzing, l\'énumération et le brute force. Incontournable pour les phases de reconnaissance.',
    url: 'https://github.com/danielmiessler/SecLists',
    category: 'Sécurité',
    tags: ['wordlists', 'fuzzing', 'brute-force'],
  },

  // --- CTF & Forensic ---
  {
    name: 'CyberChef',
    description: 'Couteau suisse du décodage en ligne. Encodage, chiffrement et extraction de données avec des recettes chaînables.',
    url: 'https://gchq.github.io/CyberChef/',
    category: 'CTF & Forensic',
    tags: ['encodage', 'crypto', 'forensic'],
  },
  {
    name: 'Ghidra',
    description: 'Framework de reverse engineering développé par la NSA. Décompile les binaires et analyse le code assembleur.',
    url: 'https://ghidra-sre.org/',
    category: 'CTF & Forensic',
    tags: ['reverse', 'assembleur', 'binaire'],
  },
  {
    name: 'JADX',
    description: 'Décompilateur d\'APK Android. Transforme le bytecode Dalvik en code Java lisible pour analyser les applications mobiles.',
    url: 'https://github.com/skylot/jadx',
    category: 'CTF & Forensic',
    tags: ['android', 'apk', 'reverse'],
  },
  {
    name: 'Audacity',
    description: 'Éditeur audio open source. Utilisé en stéganographie pour visualiser les spectrogrammes et extraire des données cachées dans des fichiers audio.',
    url: 'https://www.audacityteam.org/',
    category: 'CTF & Forensic',
    tags: ['audio', 'stéganographie', 'spectrogramme'],
  },
  {
    name: 'ExifTool',
    description: 'Lit, écrit et modifie les métadonnées EXIF de fichiers image, audio et vidéo. Utile en stéganographie et forensic.',
    url: 'https://exiftool.org/',
    category: 'CTF & Forensic',
    tags: ['metadata', 'stéganographie', 'forensic'],
  },
  {
    name: 'Binwalk',
    description: 'Analyse les firmwares et les fichiers binaires à la recherche de fichiers embarqués, d\'archives ou de signatures connues.',
    url: 'https://github.com/ReFirmLabs/binwalk',
    category: 'CTF & Forensic',
    tags: ['firmware', 'extraction', 'forensic'],
  },
  {
    name: 'Wireshark',
    description: 'Analyseur de protocoles réseau. Capture et inspecte les trames Ethernet, Bluetooth et réseau depuis des fichiers .pcap.',
    url: 'https://www.wireshark.org/',
    category: 'CTF & Forensic',
    tags: ['réseau', 'pcap', 'protocoles'],
  },
  {
    name: 'StegSolve',
    description: 'Analyse les plans de bits des images pour extraire des données cachées par stéganographie.',
    url: 'https://github.com/zardus/ctf-tools/tree/master/stegsolve',
    category: 'CTF & Forensic',
    tags: ['stéganographie', 'image', 'ctf'],
  },
  {
    name: 'CrackStation',
    description: 'Service de cracking de hashes en ligne par lookup de tables précalculées. Utile pour tester la robustesse des mots de passe récupérés.',
    url: 'https://crackstation.net/',
    category: 'CTF & Forensic',
    tags: ['hash', 'password', 'cracking'],
  },
  {
    name: 'Root-Me',
    description: 'Plateforme de challenges de sécurité. Web client, web serveur, réseau, reverse, forensic et stéganographie. Ma principale source d\'entraînement.',
    url: 'https://www.root-me.org/',
    category: 'CTF & Forensic',
    tags: ['challenges', 'formation', 'ctf'],
  },

  // --- Conteneurisation ---
  {
    name: 'Docker',
    description: 'Plateforme de conteneurisation. Construit, distribue et exécute des applications isolées dans des conteneurs légers.',
    url: 'https://www.docker.com/',
    category: 'Conteneurisation',
    tags: ['conteneur', 'build', 'runtime'],
  },
  {
    name: 'Kubernetes',
    description: 'Orchestrateur de conteneurs. Gère le déploiement, la mise à l\'échelle et la disponibilité des applications conteneurisées.',
    url: 'https://kubernetes.io/',
    category: 'Conteneurisation',
    tags: ['orchestration', 'k8s', 'production'],
  },
  {
    name: 'Helm',
    description: 'Gestionnaire de packages pour Kubernetes. Simplifie le déploiement d\'applications complexes via des charts versionnés.',
    url: 'https://helm.sh/',
    category: 'Conteneurisation',
    tags: ['k8s', 'packaging', 'déploiement'],
  },
  {
    name: 'ArgoCD',
    description: 'Outil de déploiement GitOps pour Kubernetes. Synchronise l\'état du cluster avec un dépôt Git en continu.',
    url: 'https://argoproj.github.io/cd/',
    category: 'Conteneurisation',
    tags: ['gitops', 'k8s', 'cd'],
  },
  {
    name: 'Hadolint',
    description: 'Linter pour Dockerfiles. Détecte les mauvaises pratiques et suggère des corrections selon les recommandations officielles.',
    url: 'https://hadolint.github.io/hadolint/',
    category: 'Conteneurisation',
    tags: ['dockerfile', 'lint', 'sécurité'],
  },
  {
    name: 'Dive',
    description: 'Explore le contenu de chaque couche d\'une image Docker. Identifie ce qui alourdit inutilement l\'image.',
    url: 'https://github.com/wagoodman/dive',
    category: 'Conteneurisation',
    tags: ['docker', 'optimisation', 'layers'],
  },

  // --- Backend & Java ---
  {
    name: 'Spring Boot',
    description: 'Framework Java pour construire des applications de production. Convention over configuration et auto-configuration.',
    url: 'https://spring.io/projects/spring-boot',
    category: 'Backend & Java',
    tags: ['java', 'framework', 'microservices'],
  },
  {
    name: 'Spring Security',
    description: 'Module de sécurité pour Spring. Authentification, autorisation, protection CSRF, OAuth2 et intégration Keycloak.',
    url: 'https://spring.io/projects/spring-security',
    category: 'Backend & Java',
    tags: ['java', 'auth', 'oauth2'],
  },
  {
    name: 'Spring Cloud Config',
    description: 'Centralise la gestion des configurations pour les microservices. Les propriétés sont versionnées dans Git.',
    url: 'https://spring.io/projects/spring-cloud-config',
    category: 'Backend & Java',
    tags: ['java', 'config', 'microservices'],
  },
  {
    name: 'Keycloak',
    description: 'Solution IAM open source. SSO, OAuth2, OIDC et gestion des utilisateurs pour les applications d\'entreprise.',
    url: 'https://www.keycloak.org/',
    category: 'Backend & Java',
    tags: ['iam', 'sso', 'oauth2'],
  },
  {
    name: 'SonarQube',
    description: 'Plateforme d\'analyse de qualité et de sécurité du code. Détecte les code smells, bugs et vulnérabilités.',
    url: 'https://www.sonarsource.com/products/sonarqube/',
    category: 'Backend & Java',
    tags: ['qualité', 'analyse statique', 'sécurité'],
  },
  {
    name: 'IntelliJ IDEA',
    description: 'IDE Java/Kotlin de JetBrains. Analyse statique, refactoring avancé et intégration native avec Spring.',
    url: 'https://www.jetbrains.com/idea/',
    category: 'Backend & Java',
    tags: ['ide', 'java', 'productivité'],
  },

  // --- Observabilité ---
  {
    name: 'Grafana',
    description: 'Plateforme de visualisation et d\'alertes. Crée des dashboards à partir de sources variées : Prometheus, Loki, Tempo.',
    url: 'https://grafana.com/',
    category: 'Observabilité',
    tags: ['dashboards', 'alertes', 'métriques'],
  },
  {
    name: 'Prometheus',
    description: 'Système de collecte de métriques time-series. Scrape les endpoints exposés et stocke les données pour Grafana.',
    url: 'https://prometheus.io/',
    category: 'Observabilité',
    tags: ['métriques', 'time-series', 'scraping'],
  },
  {
    name: 'Loki',
    description: 'Agrégateur de logs inspiré de Prometheus. S\'intègre nativement avec Grafana pour la corrélation logs/métriques.',
    url: 'https://grafana.com/oss/loki/',
    category: 'Observabilité',
    tags: ['logs', 'grafana', 'k8s'],
  },
  {
    name: 'OpenTelemetry',
    description: 'Standard ouvert pour la collecte de traces, métriques et logs. Instrumente les applications sans dépendance au vendor.',
    url: 'https://opentelemetry.io/',
    category: 'Observabilité',
    tags: ['tracing', 'métriques', 'standard'],
  },

  // --- IA & Data ---
  {
    name: 'NumPy',
    description: 'Bibliothèque Python pour le calcul numérique. Manipule les tableaux multidimensionnels et implémente les opérations d\'algèbre linéaire utilisées en machine learning.',
    url: 'https://numpy.org/',
    category: 'IA & Data',
    tags: ['python', 'algèbre linéaire', 'tableaux'],
  },
  {
    name: 'Pandas',
    description: 'Manipulation et analyse de données tabulaires en Python. Chargement, nettoyage et transformation de datasets pour le machine learning.',
    url: 'https://pandas.pydata.org/',
    category: 'IA & Data',
    tags: ['python', 'données', 'dataframe'],
  },
  {
    name: 'Scikit-Learn',
    description: 'Bibliothèque Python pour le machine learning. Implémente les algorithmes supervisés et non supervisés avec une API cohérente.',
    url: 'https://scikit-learn.org/',
    category: 'IA & Data',
    tags: ['python', 'machine learning', 'classification'],
  },
  {
    name: 'Matplotlib',
    description: 'Bibliothèque de visualisation Python. Génère des graphiques statiques pour explorer les données et les résultats de modèles.',
    url: 'https://matplotlib.org/',
    category: 'IA & Data',
    tags: ['python', 'visualisation', 'graphiques'],
  },
  {
    name: 'Seaborn',
    description: 'Bibliothèque de visualisation statistique construite sur Matplotlib. Simplifie la création de graphiques de distributions et de corrélations.',
    url: 'https://seaborn.pydata.org/',
    category: 'IA & Data',
    tags: ['python', 'visualisation', 'statistiques'],
  },
];
