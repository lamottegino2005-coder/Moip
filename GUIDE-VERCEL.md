# 🚀 Guide de déploiement — GDT Rénovation v2 sur Vercel

## Étape 1 — Créer un compte Vercel
1. Va sur **https://vercel.com**
2. Clique "Sign Up" → connecte-toi avec Google ou GitHub
3. Gratuit, pas de carte bancaire

## Étape 2 — Déployer
1. Tableau de bord Vercel → **"Add New Project"**
2. Clique **"Deploy"** → glisse-dépose le dossier `gdt-vercel`
3. Attends 30 secondes → ton site est en ligne !
4. Note ton URL : `https://XXXXX.vercel.app`

## Étape 3 — Activer Vercel KV (base de données licences)
1. Dans Vercel → ton projet → onglet **"Storage"**
2. Clique **"Create Database"** → choisis **"KV"**
3. Nomme-la `gdt-licenses` → **"Create"**
4. Clique **"Connect Project"** → sélectionne ton projet → **"Connect"**
5. Vercel ajoute automatiquement les variables `KV_URL`, `KV_REST_API_URL`, etc.

## Étape 4 — Variables d'environnement
Dans Vercel → ton projet → **Settings** → **Environment Variables** :

| Clé | Valeur |
|-----|--------|
| `ADMIN_SECRET` | Un mot de passe que tu choisis (ex: `GDT2024Admin!`) |
| `ANTHROPIC_API_KEY` | Ta clé Anthropic (optionnel, pour le SEO) |

Après avoir ajouté → clique **"Redeploy"**.

## Étape 5 — Ajouter ton nom de domaine (optionnel)
Vercel → ton projet → **Settings** → **Domains** → tape ton domaine.
Tu recevras 2 enregistrements DNS à ajouter chez ton registrar :
```
Type A     →  76.76.21.21
Type CNAME →  cname.vercel-dns.com
```

## Étape 6 — Générer des licences clients
1. Va sur ton site → clique **"⚙️ Espace admin"** en bas de l'écran de licence
2. Entre ton `ADMIN_SECRET`
3. Tape le nom du client, choisis le plan et la durée
4. Clique **"✨ Générer"** → la clé apparaît
5. Clique **"📤 Envoyer par SMS"** → message pré-rédigé s'ouvre

## Ce qui est inclus dans la v2

| Module | Fonctionnalités |
|--------|----------------|
| 🏗️ Chantiers | Tâches auto selon type de travaux, photos avant/pendant/après, estimation temps, surface m² |
| 🧱 Matériaux | Calcul auto carrelage/peinture/béton/placo/etc, ajout direct au devis |
| 📋 Devis/Factures | Lignes détaillées, transformer en facture, signature client sur mobile |
| 📊 Dashboard | Graphique CA 6 mois, stats en temps réel |
| 👥 Clients | Carnet avec compteurs chantiers/devis |
| 👷 Équipe | Gestion employés et statuts |
| 🔍 SEO | Analyse IA avec score et conseils |
| 🔐 Licences | Clés avec expiration, liées à l'appareil |
