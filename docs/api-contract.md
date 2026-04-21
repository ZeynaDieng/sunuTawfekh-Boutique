# Contrat d’intégration — Vitrine Nuxt ↔ Gestion de stock

Ce document sert de référence pour brancher [`server/utils/stock-api-client.ts`](../server/utils/stock-api-client.ts) sur votre application métier. Ajustez les chemins et champs selon votre API réelle.

## Variables d’environnement

| Variable | Où | Description |
|----------|-----|-------------|
| `NUXT_PUBLIC_DATA_SOURCE` | Public | `mock` (défaut) ou `api` — active les appels distants côté serveur avec repli mock si échec. |
| `NUXT_PUBLIC_CATALOG_PAGE_SIZE` | Public | Taille de page catalogue (défaut : 48). |
| `NUXT_PUBLIC_SHOW_DEMO_BANNER` | Public | `true` pour afficher une bannière lorsque le catalogue est servi en repli démo. |
| `NUXT_STOCK_API_BASE` | Serveur uniquement | URL de base (sans slash final), ex. `https://stock.example.com/v1`. |
| `NUXT_STOCK_API_KEY` | Serveur uniquement | Jeton Bearer ou clé API envoyée en `Authorization: Bearer …` si défini. |

Ne commitez pas de secrets : utilisez `.env` local et les secrets de votre hébergeur en production.

## Architecture recommandée

- Le navigateur appelle uniquement les routes **`/api/catalog/*`** et **`/api/orders`** (Nitro).
- Nitro appelle la gestion de stock avec `NUXT_STOCK_*`, agrège les erreurs et applique le **fallback mock** si configuré.

## Endpoints attendus côté gestion de stock (proposition)

Votre backend peut différer ; adaptez le mapping dans `mapStockApiProductToProduct`.

### `GET /categories` (ou équivalent)

Réponse suggérée :

```json
{
  "data": [
    {
      "id": "beaute",
      "name": "Beauté",
      "image": "https://…",
      "count": 45
    }
  ]
}
```

### `GET /products`

Query : `category`, `page`, `limit`, filtres métier éventuels.

Réponse suggérée :

```json
{
  "data": [ { …produit } ],
  "meta": { "total": 120, "page": 1, "limit": 48 }
}
```

### `GET /products/:id`

Réponse : un objet produit ou `{ "data": { … } }`.

### `POST /orders`

Body suggéré (aligné sur notre [`server/api/orders.post.ts`](../server/api/orders.post.ts)) :

```json
{
  "customer": {
    "name": "…",
    "phone": "…",
    "address": "…",
    "city": "Dakar",
    "notes": "…"
  },
  "payment": "livraison | whatsapp",
  "lines": [
    { "productId": "b1", "quantity": 2, "unitPrice": 15000 }
  ]
}
```

### `POST /cart/validate` (optionnel)

Si votre stack expose un équivalent : lignes panier → prix courants + disponibilité. Sinon la vitrine utilise la validation locale sur le catalogue résolu.

## Mapping produit distant → [`Product`](../utils/data.ts)

Champs cibles : `id`, `name`, `price`, `oldPrice?`, `image`, `images?`, `category`, `description`, `inStock`, `isNew?`, `isPromo?`, `rating`, `reviews`, `filters` (record clé/valeur pour facettes).

**Variantes** (taille, couleur) : étendre le type `Product` ou ajouter `variants: { sku, label, price, inStock }[]` puis adapter `ProductCard` / fiche ; le mapper distant doit remplir cette structure une fois le contrat défini.

## Codes erreur

- En cas d’échec réseau ou 5xx upstream, la vitrine peut renvoyer les données mock avec l’en-tête `x-catalog-source: mock-fallback` pour le debug.
