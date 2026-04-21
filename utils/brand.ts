/** Sunu Tawfekh — aligné maquette React (navigation & grille accueil). */
export const BRAND_NAME = "Sunu Tawfekh";
export const BRAND_TAGLINE = "Boutique";

/** Couleurs charte (réf. React COLORS). */
export const CHARTE = {
  indigo: "#3F3C8C",
  yellow: "#E0A83A",
  black: "#0F0F0F",
  offWhite: "#F8F8F8",
  softGray: "#EAEAEA",
} as const;

export const HOME_CATEGORIES = [
  { id: "beaute", name: "Beauté", icon: "🧴" },
  { id: "parfums", name: "Parfums", icon: "🌸" },
  { id: "mode", name: "Mode", icon: "👗" },
  { id: "accessoires", name: "Accessoires", icon: "👜" },
  { id: "bien-etre", name: "Bien-être", icon: "💆" },
  { id: "alimentaire", name: "Alimentaire", icon: "🥗" },
] as const;
