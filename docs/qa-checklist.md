# Checklist QA — Maison Élégance

À exécuter avant mise en production ou après branchement API.

## Catalogue

- [ ] Accueil : catégories, best-sellers, nouveautés s’affichent (source mock ou API).
- [ ] Bannière démo visible uniquement si `NUXT_PUBLIC_SHOW_DEMO_BANNER=true` et repli mock actif.
- [ ] Catalogue : onglets catégorie, filtres, pagination (si &gt; 1 page).
- [ ] Réponse vide API : le site affiche toujours le mock (pas d’écran vide).

## Produit

- [ ] Fiche produit 404 pour id inconnu.
- [ ] Images et SEO (`title` / `description`) cohérents.
- [ ] Produits similaires listés.

## Panier & checkout

- [ ] Panier vide : message et CTA boutique.
- [ ] Persistance : recharger la page conserve panier / favoris (localStorage).
- [ ] Checkout : validation `/api/cart/validate` bloque si rupture ou produit inconnu.
- [ ] Soumission : `/api/orders` retourne succès (mock ou API).
- [ ] Middleware checkout redirige vers `/panier` si panier vide.

## Légal

- [ ] Liens footer vers `/livraison-retours`, `/cgv`, `/confidentialite`.

## Technique

- [ ] Variables `NUXT_*` définies en staging/prod (sans commit des secrets).
- [ ] Build `nuxt build` sans erreur.
