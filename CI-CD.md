# CI/CD Setup - GitHub Actions

## Vue d'ensemble

Ce projet utilise **GitHub Actions** pour automatiser:
- ✅ Build de l'image Docker
- ✅ Push vers Docker Hub
- ✅ Déploiement automatique sur Kubernetes (pattern Canary)
- ✅ Notifications Slack en cas de succès/échec

## Architecture CI/CD

```
Code Push (main/develop)
    ↓
GitHub Actions Workflow
    ├─ Build Docker image
    ├─ Push to Docker Hub
    ├─ Update K8s manifests
    └─ Deploy to Kubernetes (v2 - Canary)
    ↓
Verification & Notifications
```

## Configuration requise

### 1. Secrets GitHub

Tu dois ajouter ces secrets dans les paramètres GitHub du repo:

**Settings → Secrets and variables → Actions**

| Secret | Valeur |
|--------|--------|
| `DOCKER_USERNAME` | Ton username Docker Hub |
| `DOCKER_PASSWORD` | Ton token Docker Hub |
| `KUBE_CONFIG` | Ton kubeconfig en base64 |
| `SLACK_WEBHOOK` | (Optionnel) URL webhook Slack |

### 2. Obtenir KUBE_CONFIG en base64

```bash
# Sur ta machine locale
cat ~/.kube/config | base64 -w 0
```

Puis copie la sortie dans le secret `KUBE_CONFIG` sur GitHub.

### 3. Docker Hub Token

1. Va sur https://hub.docker.com/settings/security
2. Crée un **Personal Access Token**
3. Utilise ce token pour `DOCKER_PASSWORD`

### 4. Slack Webhook (optionnel)

1. Crée une Slack App: https://api.slack.com/apps
2. Active Incoming Webhooks
3. Crée un webhook pour ton channel
4. Ajoute-le en secret `SLACK_WEBHOOK`

## Workflow détaillé

### Trigger
Le workflow se lance automatiquement quand tu push sur `main` ou `develop` et que tu touches:
- Des fichiers dans `k8s/`
- `.github/workflows/`
- `docker-compose.yml`

### Étapes

1. **Checkout**: Récupère le code
2. **Docker Setup**: Prépare Docker Buildx pour multi-platform builds
3. **Login Docker Hub**: S'authentifie avec tes credentials
4. **Build & Push**: 
   - Tag: `votre-username/vikunja:SHA-du-commit`
   - Tag: `votre-username/vikunja:latest`
5. **Update K8s Manifest**: Remplace l'image dans `vikunja-v2.yaml` avec le nouveau SHA
6. **Configure kubectl**: Utilise kubeconfig depuis les secrets
7. **Deploy**: Applique tous les manifests K8s
8. **Wait & Verify**: Attend le rollout et affiche les logs
9. **Notify Slack**: Envoie une notification de succès/échec

## Pattern Canary

Le workflow déploie **toujours en v2 (canary)** d'abord:

```
Avant:  v1 (2 pods - stable) → v2 (1 pod - canary)
Après:  v1 (2 pods) → v2 (1 pod - NOUVELLE VERSION)
```

**Avantages:**
- La nouvelle version reçoit ~33% du trafic
- Si elle casse → seulement 33% d'utilisateurs affectés
- Facile de rollback en supprimant les pods v2

## Utilisation

### Déployer une nouvelle version

```bash
# Make some changes
git add .
git commit -m "feat: Add new feature"
git push origin main
```

GitHub Actions se lance automatiquement! 🚀

### Vérifier le déploiement

1. Va sur ton repo GitHub
2. Clique sur **Actions**
3. Vois le workflow en cours d'exécution
4. Reçois une notification Slack quand c'est fini

### Accéder à l'appli

```bash
# Canary version (v2 - nouvelle)
kubectl port-forward svc/vikunja 8080:3456
# Accède à http://localhost:8080
```

## Troubleshooting

### Le workflow échoue

**Vérifie:**
1. Les secrets sont correctement configurés
2. `KUBE_CONFIG` est en base64 (pas un fichier)
3. Le kubeconfig a les bonnes permissions
4. Docker Hub credentials sont valides

### Image pas pushée à Docker Hub

```bash
# Vérifie localement
docker login
docker tag vikunja:latest your-username/vikunja:latest
docker push your-username/vikunja:latest
```

### K8s deployment échoue

```bash
# Vérifie les manifests localement
kubectl apply -f k8s/ --dry-run=client
```

## Prochaines améliorations

- ✅ Promotion automatique v2 → v1 après X heures sans erreur
- ✅ Tests automatiques avant build
- ✅ Rollback automatique si health check échoue
- ✅ Auto-scaling basé sur la charge

## Ressources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Kubernetes Deployment Rollout](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#rollouts)
