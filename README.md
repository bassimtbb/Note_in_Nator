# Note_in_Nator

> **⚠️ MEMBRES DU GROUPE :**
> - **CHAOUKI Dina**
> - **TABBEB Bassim**
> - **PENAGOS Mathis**

---

## 1. Présentation du Projet
*Ce projet vise à déployer une instance auto-hébergée de Vikunja, une plateforme de gestion de tâches open-source. L'objectif est de fournir une solution collaborative, performante et privée pour gérer des projets, remplaçant des outils comme Trello ou Todoist. L'architecture sépare le frontend (interface utilisateur) du backend (API) pour une meilleure scalabilité..*

*Exemple : Ce projet est une stack permettant de gérer une liste de tâches (TodoList) avec une interface web et une base de données, le tout monitoré via Portainer.*

**Fonctionnalités principales :**
* Vues multiples : Gestion des tâches sous forme de Listes, Tableaux Kanban, Diagrammes de Gantt et Calendriers.

* Collaboration : Partage de listes, assignation de tâches et gestion des droits utilisateurs.

* Intégration : Synchronisation CalDAV pour les agendas externes.

**Lien accessible (si tunnel actif) :** [https://votre-url-random.trycloudflare.com](https://votre-url-random.trycloudflare.com)

**Screenshot de l'application déployée** : ![](screenshot.jpg)

## 2. Architecture Technique

### Schéma d'infrastructure
*Ce schéma est généré dynamiquement à partir du fichier `architecture.puml` présent dans ce dépôt.*

![Architecture du Projet](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/VOTRE_USERNAME_GITHUB/NOM_DU_REPO/main/architecture.puml)

*(Note aux étudiants : Pour que l'image ci-dessus s'affiche :*
1. *Créez un fichier `architecture.puml` à la racine de votre repo.*
2. *Mettez votre code PlantUML dedans.*
3. *Remplacez `VOTRE_USERNAME_GITHUB` et `NOM_DU_REPO` dans l'URL ci-dessus par les vôtres.*
4. *Assurez-vous que votre repo est Public.)*

### Description des services
| Service | Image Docker | Rôle | Port Interne |
| :--- | :--- | :--- | :--- |
| **Caddy** | `caddy:latest` | Reverse Proxy & Routing | 8000:80, 8443:443 |
| **Vikunja** | `vikunja/vikunja:latest` | Gestion de tâches | 3456 |
| **PostgreSQL** | `postgres:15-alpine` | Base de données | 5432 |
| **Adminer** | `adminer:latest` | Interface admin BDD | 8080 |
| **Cloudflared** | `cloudflare/cloudflared:latest` | Tunnel Cloudflare HTTPS | N/A |


## 3. Guide d'installation

Pour lancer le projet localement :

1.  Cloner le dépôt :
    ```bash
    git clone https://github.com/bassimtbb/Note_in_Nator.git
    cd Projet
    ```

2.  Créer le fichier `.env` :
    ```bash
    cp .env.example .env
    ```

3.  Lancer la stack :
    ```bash
    docker compose up -d
    ```

4.  Attendre que les services démarrent (30-45 secondes) :
    ```bash
    docker compose ps
    ```

5.  Accéder aux services :
    * **Vikunja** : http://localhost:8000/vikunja/
    * **Adminer** : http://localhost:8000/admin/
    * **Identifiants Adminer** :
      - Serveur: `database`
      - Utilisateur: `vikunja`
      - Mot de passe: `vikunja123`
      - Base: `vikunja`

## Vérification du déploiement

### Vérifier que tous les services tournent
```bash
docker compose ps
```

**Résultat attendu :** 5 conteneurs avec status "Up"
- caddy-proxy (8000:80, 8443:443)
- vikunja-app (3456)
- vikunja-database (5432)
- vikunja-adminer (8080)
- cloudflared-tunnel

### Vérifier les logs
```bash
# Logs Vikunja
docker compose logs vikunja -n 20

# Logs Caddy (routing)
docker compose logs caddy -n 20

# Logs Cloudflared (configuration info)
docker compose logs cloudflared -n 30
```

### Tester la connectivité
```bash
# Tester Vikunja via Caddy
curl http://localhost:8000/vikunja/

# Tester l'API
curl http://localhost:8000/api/v1/info

# Tester Adminer
curl http://localhost:8000/admin/
```

### Vérifier Cloudflare Tunnel
Pour vérifier que Cloudflare fonctionne :

1. **Le conteneur cloudflared doit rester actif** (sans crash)
   ```bash
   docker compose ps | grep cloudflared
   ```
   → Status doit être "Up"

2. **Les logs doivent afficher les instructions** (pas d'erreurs)
   ```bash
   docker compose logs cloudflared
   ```
   → Affiche le message d'aide (pas de "error" ou "ERR")

3. **Pour activer le vrai tunnel Cloudflare** :
   - Créer un tunnel: https://dash.cloudflare.com/
   - Récupérer les credentials
   - Placer dans `cloudflared_data/`
   - Redémarrer: `docker compose restart cloudflared`

## 4. Méthodologie & Transparence IA

### Organisation du Groupe

**Répartition des tâches :**
- 👤 **Dina Chaouki** : Architecture Kubernetes, CI/CD GitHub Actions, Tests
- 👤 **Bassim Tabbeb** : Docker Compose, Configuration services, Debugging
- 👤 **Mathis Penagos** : Documentation, Architecture globale

**Approche :** Collaboration itérative avec partage régulier des avancées et peer review des modifications.

### Outils IA Utilisés

#### 1. **GitHub Copilot (VS Code)**
- ✅ **Génération de code YAML** : Manifests Kubernetes, docker-compose.yml
- ✅ **Snippets Python** : test_vikunja.py, requirements management
- ✅ **Completion** : Autocomplétion lors de la rédaction des fichiers de config
- **Impact :** ~40% des fichiers de configuration générés automatiquement

#### 2. **ChatGPT 4**
- ✅ **Debugging détaillé** : Explication des erreurs complexes (CORS, networking Docker)
- ✅ **Architecture system** : Conseils sur patterns Kubernetes et Canary deployment
- ✅ **Documentation** : Rédaction de commentaires et explications techniques
- **Impact :** ~60% du troubleshooting résolu via ChatGPT

#### 3. **GitHub Copilot Chat**
- ✅ **Explications inline** : Hover sur code pour comprendre
- ✅ **Refactoring suggestions** : Amélioration des workflows
- **Impact :** Gain de compréhension lors du debugging

### Apprentissages Clés

**Ce que l'IA a fait pour nous :**
- ✅ Généré les manifests Kubernetes complexes (StatefulSets, Services, ConfigMaps)
- ✅ Créé le pipeline GitHub Actions de zéro
- ✅ Debuggé les erreurs Docker/PostgreSQL/networking
- ✅ Écrit les tests unitaires Python
- ✅ Optimisé le Dockerfile et compose files

**Ce que nous avons compris/appris :**
- 🧠 **Kubernetes concepts** : StatefulSets vs Deployments, Services, PVCs, healthchecks
- 🧠 **Canary pattern** : Comment balancer le trafic entre v1 (stable) et v2 (canary)
- 🧠 **CI/CD principles** : Job dependencies, secrets management, workflow triggers
- 🧠 **Docker networking** : Problèmes de timing (healthchecks), env variables, volumes
- 🧠 **PostgreSQL configuration** : Connection strings, migration, database initialization

**Valeur ajoutée humaine :**
- Validation que le code généré est correct et adapté au projet
- Prises de décision architecturales (Docker vs K8s vs CI/CD)
- Debugging quand l'IA donnait des solutions partielles
- Compréhension profonde des erreurs (pas juste copier-coller)

---

## 5. Difficultés Rencontrées & Solutions Complètes

### Problème 1 : Erreur CORS et Communications Inter-conteneurs ✅

**Symptôme :**
```
Le navigateur bloquait les requêtes entre le frontend et l'API 
car ils tournaient sur des ports/services différents (port 3456 pour API, 8080 pour frontend)
```

**Cause racine :**
Vikunja expose directement ses ports sans reverse proxy, créant une violation CORS.

**Solution appliquée :**
Mise en place de **Caddy** comme reverse proxy central :
- Point d'entrée unique : http://localhost:8000
- Redirige / → Frontend (par défaut)
- Redirige /api/* → API Vikunja:3456
- Redirige /admin/* → Adminer:8080
- ✅ CORS résolu car tout semble venir du même domaine

**Apprentissage :** Importance du reverse proxy dans les architectures multi-conteneurs.

---

### Problème 2 : Docker Compose Networking - PostgreSQL Not Ready ⚠️

**Symptôme :**
```
vikunja-1 exited with code 1
could not connect to db: could not open database file [uid=1000, gid=0]: 
open /db/vikunja.db: no such file or directory
```

**Cause racine :**
- Vikunja se lançait AVANT que PostgreSQL ne soit prêt
- Vikunja essayait d'utiliser SQLite au lieu de PostgreSQL (env var manquante)

**Solutions appliquées :**
1. ✅ **Healthchecks** : Ajout de `healthcheck` à PostgreSQL
2. ✅ **Depends-on conditions** : Utiliser `condition: service_healthy` au lieu de juste `depends_on`
3. ✅ **Env variables** : Ajouter `VIKUNJA_DATABASE_TYPE: postgres` explicitement

**Apprentissage :** Les healthchecks ne sont pas optionnels en Docker Compose production-like.

---

### Problème 3 : Permissions Docker (/.cache) 🔐

**Symptôme :**
```
vikunja-1 | failed to create modcache index dir: mkdir /.cache: permission denied
```

**Cause racine :**
Vikunja (UID:1000) tentait d'écrire dans le répertoire racine (`/`).

**Solutions appliquées :**
1. ✅ Ajouter `GOMODCACHE=/tmp/.cache` → Écrire dans `/tmp` (writable)
2. ✅ Ajouter `HOME=/tmp` → Home directory writable
3. ✅ Monter `-v /tmp/.cache:/tmp/.cache` → Persistance du cache

**Impact :** Vikunja peut maintenant créer ses fichiers de cache sans erreurs.

---

### Problème 4 : GitHub Actions - docker-compose Command Not Found 🐚

**Symptôme :**
```
/home/runner/work/...: line 2: docker-compose: command not found
Error: Process completed with exit code 127.
```

**Cause racine :**
GitHub Actions runners Ubuntu n'ont que Docker, pas l'ancienne version `docker-compose`.

**Solutions testées :**
1. ❌ Télécharger docker-compose manuellement (risqué, réseau instable)
2. ❌ Installer via apt-get (permissions issues)
3. ✅ **Utiliser la nouvelle syntaxe : `docker compose` (sans tiret)**

**Apprentissage :** `docker compose` est la nouvelle syntaxe, intégrée nativement dans Docker moderne.

---

### Problème 5 : Vikunja Missing Environment Variables 🔧

**Symptôme :**
```
service.publicurl is required when cors.enable is true
```

**Cause racine :**
Variables d'environnement manquantes ou mal configurées pour Vikunja.

**Solutions appliquées :**
✅ Créer `.env.test` avec TOUS les paramètres requis
✅ Workflow copie `.env.test` → `.env` avant Docker Compose

**Impact :** Vikunja démarre correctement avec la bonne configuration.

---

### Problème 6 : GitHub Actions Workflow Fails - Secrets Not Set 🔐

**Symptôme :**
```
Error: Error: Need to provide at least one botToken or webhookUrl
```

**Cause racine :**
Slack notifications requéraient un secret non configuré.

**Solutions appliquées :**
✅ **Supprimer les dépendances optionnelles** → Enlever les Slack notifications  
✅ **Garder le flow essentiel** → Tests + Déploiement K8s seulement

**Apprentissage :** Ne pas ajouter d'optionnels qui compliquent le debug.

---

### Problème 7 : Kubernetes Config Secret - Base64 Encoding 🔑

**Symptôme :**
```
kubectl: unable to read kubeconfig: error reading kubeconfig: invalid configuration file
```

**Cause racine :**
La commande `base64 -d` en GitHub Actions nécessite du correct PowerShell/Bash encoding.

**Solutions appliquées :**
✅ Vérifier que le secret KUBE_CONFIG est correctement encodé en base64
✅ Tester localement : `cat ~/.kube/config | base64 | base64 -d`

**Impact :** kubectl peut maintenant lire la config correctement.

---

## Résumé des Difficultés

| # | Problème | Gravité | Temps résolu | Solution clé |
|---|----------|---------|--------------|-------------|
| 1 | CORS / Networking | 🔴 Critique | 2h | Caddy reverse proxy |
| 2 | PostgreSQL timing | 🔴 Critique | 4h | Healthchecks + condition |
| 3 | Permissions cache | 🟠 Moyen | 1h | GOMODCACHE env var |
| 4 | docker-compose absent | 🔴 Critique | 2h | Utiliser `docker compose` |
| 5 | Missing env vars | 🟠 Moyen | 1.5h | .env.test file |
| 6 | Slack secrets error | 🟢 Bénin | 0.5h | Supprimer la feature |
| 7 | Kubeconfig encoding | 🟠 Moyen | 1h | Base64 validation |

**Total : ~12 heures de debugging + résolution**

---

## Comment l'IA a Aidé pour Chaque Problème

| Problème | GitHub Copilot | ChatGPT | Impact |
|----------|----------------|---------|--------|
| 1 (CORS) | Généré Caddyfile | Expliqué architecture | 🟢 Solutionné rapidement |
| 2 (PostgreSQL) | Code healthcheck | Diagnosé timing issue | 🟢 Fix appliqué en 1h |
| 3 (Permissions) | Suggestions env var | Expliqué mkdir error | 🟢 Volume mount solution |
| 4 (docker-compose) | - | Suggéré nouvelle syntaxe | 🟢 Changement minimal |
| 5 (Env vars) | Structure fichier | Listé ALL required vars | 🟢 Config complète |
| 6 (Secrets) | Détection erreur | Conseillé suppression | 🟢 Simplification |
| 7 (Kubeconfig) | - | Expliqué base64 encoding | 🟢 Debug successful |

---

## 6. Déploiement Kubernetes & Canary

### Architecture Kubernetes
Le projet utilise **Kubernetes** pour l'orchestration en production avec un **déploiement Canary** :

```
k8s/ (Manifests Kubernetes)
├── 02-configmaps.yaml       → Configuration Vikunja
├── 03-pvcs.yaml             → Volumes persistants
├── 10-database.yaml         → StatefulSet PostgreSQL
├── 21-vikunja-v1.yaml       → Vikunja v1.0.0-rc3 (2 replicas - STABLE)
├── 22-vikunja-v2.yaml       → Vikunja latest (1 replica - CANARY)
├── 30-caddy.yaml            → Reverse proxy Caddy
├── 40-adminer.yaml          → Interface admin DB
└── 50-cloudflared.yaml      → Tunnel Cloudflare
```

### Pattern Canary Deployment

**Concept :** Déployer une nouvelle version vers une partie seulement du trafic pour tester avant full rollout.

**Notre implémentation :**
- **v1 (Stable)** : 2 replicas de `vikunja:v1.0.0-rc3` → ~67% du trafic
- **v2 (Canary)** : 1 replica de `vikunja:latest` → ~33% du trafic

**Avantages :**
✅ Test de nouvelles versions en prod avec peu de risque  
✅ Rollback rapide si problème (juste supprimer v2)  
✅ Monitoring des deux versions en parallèle  

### Déployer sur Kubernetes (Minikube)

**Prérequis :**
```bash
minikube start --cpus=4 --memory=4096
minikube addons enable ingress
```

**Appliquer les manifests :**
```bash
kubectl apply -f k8s/
```

**Vérifier le déploiement :**
```bash
kubectl get pods
kubectl get svc
kubectl logs -f deployment/vikunja-v1
```

---

## 7. CI/CD Pipeline - GitHub Actions

### Vue d'ensemble

Le projet utilise **GitHub Actions** pour automatiser les tests et le déploiement sur Kubernetes à chaque push.

```
Push to master
    ↓
GitHub Actions trigger
    ↓
Job 1: Run Tests (build/ directory)
    - Lance Docker Compose (Vikunja + PostgreSQL)
    - Exécute tests unitaires (API health checks)
    - ✅ Tests passent → Job 2 s'exécute
    - ❌ Tests échouent → Pipeline arrête
    ↓
Job 2: Deploy to Kubernetes
    - Configure kubectl avec les secrets
    - Valide les manifests K8s
    - Déploie sur le cluster K8s
    - Attend le rollout de v2
    - Vérifie la santé des pods
```

### Configurer GitHub Actions

**1. Activer les Actions :**
```
GitHub → Settings → Actions → Enable for this repository
```

**2. Ajouter les secrets :**
```
Settings → Secrets and variables → Actions → New repository secret
```

| Secret | Description |
|--------|-------------|
| `KUBE_CONFIG` | Contenu base64 de `~/.kube/config` |
| `DOCKER_USERNAME` | Username Docker Hub |
| `DOCKER_PASSWORD` | Token Docker Hub |

### Fichiers CI/CD

```
.github/workflows/deploy.yml  → Workflow principal
build/                        → Tests locaux
├── Dockerfile              → Image Vikunja
├── compose-test.yml        → Docker Compose tests
├── test_vikunja.py         → Tests unitaires
├── requirements.txt        → Dépendances Python
└── .env.test              → Variables environnement
```

---

## 8. Tests Locaux

### Lancer les tests

```bash
cd build
cp .env.test .env
docker compose -f compose-test.yml up --build --abort-on-container-exit
```

**Tests inclus :**
✅ API health check  
✅ API root endpoint  
✅ Docker environment validation  

---

## 9. Troubleshooting

### Docker
```bash
# Permission denied
sudo usermod -aG docker $USER
```

### Kubernetes
```bash
# Voir les pods
kubectl get pods

# Voir les logs
kubectl logs <pod-name>

# Port-forward
kubectl port-forward svc/vikunja 3456:3456
```

### GitHub Actions
Si workflow échoue :
1. GitHub → Actions → [Run failed]
2. Voir les logs détaillés
3. Vérifier les secrets sont configurés

---

## 10. Résumé

| Aspect | Détails |
|--------|---------|
| **App** | Vikunja (Gestion de tâches) |
| **Local** | Docker Compose (5 services) |
| **K8s** | Canary pattern (v1 + v2) |
| **CI/CD** | GitHub Actions (Tests + Deploy) |
| **Sécurité** | Secrets, Cloudflare Tunnel |
| **Status** | ✅ Production-ready |

