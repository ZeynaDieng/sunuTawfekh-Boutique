# Déploiement — Maison Élégance (Nuxt)

## Prérequis

- Node 20+ (ou version supportée par Nuxt 3.21+).
- Définir les variables d’environnement sur la plateforme (voir [.env.example](../.env.example) et [api-contract.md](./api-contract.md)).

## Build

```bash
npm install
npm run build
node .output/server/index.mjs
```

Ou utiliser l’adaptateur de votre hébergeur (Vercel, Netlify, Docker, etc.) avec la cible Nitro par défaut `node-server`.

## Secrets

- `NUXT_STOCK_API_KEY` : uniquement côté serveur, jamais préfixé `NUXT_PUBLIC_`.
- Rotation des clés et limitation d’IP sur la gestion de stock recommandées.

## Monitoring (minimal)

- Logs Nitro / plateforme pour erreurs 5xx sur `/api/catalog/*` et `/api/orders`.
- Alertes si taux d’en-tête `x-catalog-source: mock-fallback` anormalement élevé en production (API instable).
