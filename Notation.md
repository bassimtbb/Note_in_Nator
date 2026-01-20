# 📝 Fiche de Notation : Projet Infrastructure Docker & DevOps

**Noms des Étudiants :**

1. ...........................................................
    
2. ...........................................................
    
3. ...........................................................
    

Sujet du Projet : ...........................................................

URL du Repo GitHub : ...........................................................

---

## 🚫 Critères Éliminatoires (Go / No-Go)

_Si l'une des cases ci-dessous est cochée "NON", le projet n'est pas corrigé (Note = 0 ou rattrapage)._

| **Critère**                                     | **OUI** | **NON** |
| ----------------------------------------------- | ------- | ------- |
| Présence du fichier `README.md`                 | ☐       | ☐       |
| Noms et Prénoms clairs dans l'en-tête du README | ☐       | ☐       |
| URL du dépôt GitHub accessible (Public)         | ☐       | ☐       |
| Présence d'un fichier `docker-compose.yml`      | ☐       | ☐       |

---

## 📊 Grille Détaillée (20 Points)

### 1. Déploiement & Fonctionnalités (5 pts)

_Est-ce que ça marche concrètement ?_

|**Critère**|**Détail**|**Note**|
|---|---|---|
|**Accessibilité Externe**|L'URL Cloudflare (tunnel) fonctionne et charge le site sans erreur 502/404.|**/ 2**|
|**Services Fonctionnels**|Les services demandés (App + Admin + DB) sont tous opérationnels.|**/ 1.5**|
|**Persistance (Test)**|_Test Enseignant :_ `docker compose down` puis `up`. Les données (comptes, articles) sont toujours là.|**/ 1.5**|

### 2. Architecture & Robustesse (6 pts)

_La conception est-elle logique, sécurisée et "propre" ?_

|**Critère**|**Détail**|**Note**|
|---|---|---|
|**Reverse Proxy (Caddy)**|Caddy est le seul point d'entrée (Port 80). Le routage (Path ou Host) est correct.|**/ 2**|
|**Isolation Réseau**|La Base de Données n'est **PAS** exposée sur Internet (pas de port mapping inutile).|**/ 1**|
|**Infrastructure Code**|Le `docker-compose.yml` est propre (indentation, version, restart policy `unless-stopped`).|**/ 1**|
|**Schéma PlantUML**|Le schéma est présent dans le README (rendu visuel ok) et correspond à la réalité du code.|**/ 2**|

### 3. Méthodologie & Résolution de Problèmes (5 pts)

_Ont-ils compris ce qu'ils font ou ont-ils juste copié-collé ?_

|**Critère**|**Détail**|**Note**|
|---|---|---|
|**Analyse des Difficultés**|Section "Difficultés" du README : Description claire d'un problème rencontré et de la solution technique trouvée (Preuve de réflexion).|**/ 2.5**|
|**Transparence IA**|Usage des outils IA explicité honnêtement. Distinction claire entre "généré par l'IA" et "adapté par l'humain".|**/ 1.5**|
|**Qualité du Rapport**|README propre, instructions d'installation claires, orthographe et présentation soignée.|**/ 1**|

### 4. Qualité Technique & Bonus (4 pts)

_Le souci du détail._

|**Critère**|**Détail**|**Note**|
|---|---|---|
|**Variables d'Env.**|Pas de mots de passe en dur dans le code ! Usage correct de variables d'environnement.|**/ 1**|
|**Git Cleanliness**|`.gitignore` présent (pas de fichiers inutiles/système), messages de commit clairs.|**/ 1**|
|**Complexité / Bonus**|Mise en place d'éléments supplémentaires (Healthchecks, Redis, Monitoring, Séparation Frontend/Backend complexe).|**/ 2**|

---

## 💬 Commentaires & Appréciation Générale

Points Forts :

...................................................................................................................

...................................................................................................................

Axes d'Amélioration :

...................................................................................................................

...................................................................................................................

## 🏆 Note Finale

|**Section**|**Score**|
|---|---|
|I. Déploiement|.... / 5|
|II. Architecture|.... / 6|
|III. Méthodologie|.... / 5|
|IV. Technique|.... / 4|
|**TOTAL**|**.... / 20**|
