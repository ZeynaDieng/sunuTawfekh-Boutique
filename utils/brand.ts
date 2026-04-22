/** Sunu Tawfekh — aligné maquette React (navigation & grille accueil). */
export const BRAND_NAME = "Sunu Tawfekh";
/** Sous-titre court navbar — boutique généraliste (tous univers). */
export const BRAND_TAGLINE = "Boutique en ligne";

/** Couleurs charte (réf. React COLORS). */
export const CHARTE = {
  indigo: "#000666",
  yellow: "#E0A83A",
  black: "#0F0F0F",
  offWhite: "#F8F8F8",
  softGray: "#EAEAEA",
} as const;

export const HOME_CATEGORIES = [
  {
    id: "beaute",
    name: "Beauté",
    subtitle: "Soins, maquillage, routines",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "parfums",
    name: "Parfums",
    subtitle: "Eaux de parfum & coffrets",
    image:
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mode",
    name: "Mode",
    subtitle: "Prêt-à-porter & chaussures",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "accessoires",
    name: "Accessoires",
    subtitle: "Sacs, bijoux, high-tech du quotidien",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "bien-etre",
    name: "Bien-être",
    subtitle: "Détente, sport, hygiène",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "alimentaire",
    name: "Alimentaire",
    subtitle: "Épicerie, boissons, snacking",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
  },
] as const;
