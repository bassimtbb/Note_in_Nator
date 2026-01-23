# SETUP CI/CD - Instructions Complètes

## 🚀 Quick Start

Avant que le CI/CD fonctionne, tu dois configurer 3 secrets sur GitHub.

---

## 1️⃣ Docker Hub Token

### Créer le token

1. Va sur https://hub.docker.com/settings/security
2. Clique sur **"New Access Token"**
3. Remplis:
   - **Access Token Description**: `GitHub Actions CI/CD`
   - **Permissions**: ✅ Read & Write
4. Clique **"Generate"**
5. **Copie le token complet** (tu ne le verras qu'une fois!)

### Ajouter le secret à GitHub

1. Va sur ton repo: https://github.com/bassimtbb/Note_in_Nator
2. **Settings** → **Secrets and variables** → **Actions**
3. Clique **"New repository secret"**
4. **Name**: `DOCKER_USERNAME`
   **Secret**: `ton-username-docker-hub`
5. Clique **"Add secret"**

Répète pour le token:
6. Clique **"New repository secret"** à nouveau
7. **Name**: `DOCKER_PASSWORD`
   **Secret**: `le-token-que-tu-as-copié`
8. Clique **"Add secret"**

---

## 2️⃣ Kubernetes Config (kubeconfig)

### Obtenir kubeconfig en base64

Si tu utilises **Minikube**:
```bash
# Sur ta machine (Windows/Linux/Mac)
cat ~/.kube/config | base64
```

**Ou** si tu utilises **Docker Desktop Kubernetes**:
```bash
# Windows PowerShell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("$env:USERPROFILE\.kube\config"))
```

**Ou** si tu utilises **WSL**:
```bash
cat ~/.kube/config | base64 -w 0
```

Copie la **sortie complète** (c'est long, c'est normal!)

### Ajouter le secret à GitHub

1. Va sur ton repo: https://github.com/bassimtbb/Note_in_Nator
2. **Settings** → **Secrets and variables** → **Actions**
3. Clique **"New repository secret"**
4. **Name**: `KUBE_CONFIG`
   **Secret**: `colle-ici-la-sortie-base64-complete`
5. Clique **"Add secret"**

---

## 3️⃣ Slack Webhook (Optionnel)

Si tu veux des notifications Slack quand ça déploie:

### Créer le Slack App

1. Va sur https://api.slack.com/apps
2. Clique **"Create New App"** → **"From scratch"**
3. **App Name**: `Vikunja CI/CD`
   **Workspace**: Choisis ton workspace
4. Clique **"Create App"**

### Activer Incoming Webhooks

1. À gauche: **Features** → **Incoming Webhooks**
2. Toggle **"Activate Incoming Webhooks"** → **ON**
3. Clique **"Add New Webhook to Workspace"**
4. Choisis le channel (ex: `#deployments`)
5. Clique **"Allow"**
6. **Copie l'URL du webhook** (commence par `https://hooks.slack.com/...`)

### Ajouter le secret à GitHub

1. Va sur ton repo: https://github.com/bassimtbb/Note_in_Nator
2. **Settings** → **Secrets and variables** → **Actions**
3. Clique **"New repository secret"**
4. **Name**: `SLACK_WEBHOOK`
   **Secret**: `l-url-du-webhook-slack`
5. Clique **"Add secret"**

---

## ✅ Vérifier les secrets

Va sur **Settings** → **Secrets and variables** → **Actions**

Tu dois voir:
- ✅ `DOCKER_PASSWORD`
- ✅ `DOCKER_USERNAME`
- ✅ `KUBE_CONFIG`
- ✅ `SLACK_WEBHOOK` (optionnel)

---

## 🎯 Utiliser le CI/CD

### Déployer une nouvelle version

```bash
cd ~/Downloads/Projet

# Make some changes
git add .
git commit -m "feat: Add awesome new feature"
git push origin master
```

### Voir le workflow s'exécuter

1. Va sur ton repo GitHub
2. Clique sur **"Actions"**
3. Tu devrais voir le workflow en cours: **"CI/CD - Build & Deploy Canary"**
4. Attends que ça finisse (2-5 minutes)
5. Si tout est vert ✅: Ton app est déployée!
6. Si c'est rouge ❌: Clique pour voir l'erreur

### Accéder à l'appli après déploiement

```bash
# Port forward vers la nouvelle version (v2 - canary)
kubectl port-forward svc/vikunja 8080:3456

# Ouvre http://localhost:8080
```

---

## 🔍 Troubleshooting

### Le workflow échoue avec "Unhandled Error"

**Cause**: kubeconfig pas valide

**Fix**:
```bash
# Vérifie que kubeconfig est en base64 valide
cat ~/.kube/config | base64 | head -c 50
# Doit commencer par: YXBpVmVyc2lvbjog...
```

### "Authentication failed"

**Cause**: Docker Hub credentials invalides

**Fix**:
```bash
# Vérifie que tu peux te login localement
docker login
# Puis essaie:
docker pull your-username/vikunja:latest
```

### "kubectl: command not found"

**Cause**: kubeconfig pas accessible

**Fix**: Re-vérifie le secret `KUBE_CONFIG` sur GitHub

### Pas de notification Slack

**Cause**: `SLACK_WEBHOOK` manquant ou invalide

**Fix**: Va sur **https://api.slack.com/apps** et re-génère l'URL

---

## 📊 Architecture du workflow

```
Tu push du code (git push)
        ↓
GitHub Actions déclenche
        ↓
✅ Build Docker image avec tag: SHA du commit
        ↓
✅ Push vers Docker Hub (your-username/vikunja:SHA)
        ↓
✅ Update k8s/22-vikunja-v2.yaml avec la nouvelle image
        ↓
✅ Deploy sur Kubernetes (v2 = version canary)
        ↓
✅ Wait for rollout (max 5 minutes)
        ↓
✅ Envoie notification Slack
        ↓
FAIT! 🚀
```

---

## 🎓 Pour le prof

**Récapitulatif de ce qu'on a implémenté:**

| Composant | Status |
|-----------|--------|
| Docker Compose | ✅ 6 services operationnels |
| Kubernetes | ✅ 5 pods running |
| Canary Deployment | ✅ v1 stable (2 pods) + v2 canary (1 pod) |
| Security | ✅ Secrets en .env (pas en VCS) |
| Reverse Proxy | ✅ Caddy avec path-based routing |
| Public Access | ✅ Cloudflare Tunnel |
| **CI/CD Pipeline** | ✅ **GitHub Actions (nouveau!)** |

**Le CI/CD automatise:**
1. Build Docker image
2. Push vers registry
3. Déploie sur K8s (Canary pattern)
4. Notifie Slack
5. Tout en 2-5 minutes

---

## 📝 Notes

- Le workflow se lance automatiquement sur `git push` vers `main` ou `develop`
- La nouvelle version va **toujours** en v2 (canary) d'abord
- Si v2 fonctionne bien → tu peux promouvoir vers v1 manuellement
- Si v2 casse → seulement 33% des users affectés (v1 reste stable)

---

## Questions?

Si quelque chose fonctionne pas:
```bash
# Check logs localement
docker compose logs -f

# Check K8s
kubectl get pods
kubectl logs deployment/vikunja-v2

# Check GitHub Actions
# Va sur ton repo → Actions → Clique le workflow
```
