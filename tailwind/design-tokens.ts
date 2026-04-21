/**
 * Design system — valeurs HSL sans préfixe `hsl()` (format shadcn / Tailwind).
 * Modifier ici pour propager partout : variables CSS + couleurs thème.
 */

/** Primaire marque (#3F3C8C) — meta theme-color, partenaires, etc. */
export const brandPrimaryHex = "#3F3C8C";

export const cssVariablesRoot: Record<string, string> = {
  "--background": "0 0% 97.25%",
  "--foreground": "0 0% 5.88%",
  "--card": "0 0% 100%",
  "--card-foreground": "0 0% 5.88%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "0 0% 5.88%",
  "--primary": "242 42% 39%",
  "--primary-foreground": "0 0% 100%",
  /* Titres / liens sur fond très sombre (footer, etc.) */
  "--primary-soft": "242 48% 72%",
  "--muted": "0 0% 94%",
  "--muted-foreground": "0 0% 38%",
  /* Survols / ghost / outline — violet léger. */
  "--accent": "242 42% 94%",
  "--accent-foreground": "242 42% 32%",
  "--destructive": "0 68% 42%",
  "--destructive-foreground": "0 0% 100%",
  "--border": "0 0% 90%",
  "--input": "0 0% 90%",
  "--ring": "242 42% 39%",
  "--radius": "0.375rem",
  /* Or charte #E0A83A */
  "--gold": "40 72% 55%",
  "--gold-light": "40 55% 68%",
  /* Secondaire marque — or (même teinte que `gold`). */
  "--secondary": "var(--gold)",
  "--secondary-foreground": "var(--charcoal)",
  "--nude": "0 0% 94%",
  "--cream": "0 0% 98%",
  "--charcoal": "0 0% 5.88%",
  "--sidebar-background": "0 0% 98%",
  "--sidebar-foreground": "240 5.3% 26.1%",
  "--sidebar-primary": "240 5.9% 10%",
  "--sidebar-primary-foreground": "0 0% 98%",
  "--sidebar-accent": "240 4.8% 95.9%",
  "--sidebar-accent-foreground": "240 5.9% 10%",
  "--sidebar-border": "220 13% 91%",
  "--sidebar-ring": "217.2 91.2% 59.8%",
};

export const cssVariablesDark: Record<string, string> = {
  /* Fond page légèrement plus clair que le noir pur pour respirer avec le contenu */
  "--background": "0 0% 8%",
  "--foreground": "0 0% 96%",
  "--card": "0 0% 11%",
  "--card-foreground": "0 0% 96%",
  "--popover": "0 0% 11%",
  "--popover-foreground": "0 0% 96%",
  "--primary": "242 48% 62%",
  "--primary-foreground": "0 0% 100%",
  "--primary-soft": "242 42% 76%",
  /* Secondaire marque — or (même teinte que `gold` héritée de :root). */
  "--secondary": "var(--gold)",
  /* Texte lisible sur bouton or en dark */
  "--secondary-foreground": "0 0% 8%",
  "--muted": "0 0% 15%",
  "--muted-foreground": "0 0% 62%",
  "--accent": "242 30% 20%",
  "--accent-foreground": "242 45% 90%",
  "--destructive": "0 55% 40%",
  "--destructive-foreground": "0 0% 100%",
  "--border": "0 0% 20%",
  "--input": "0 0% 17%",
  "--ring": "242 48% 58%",
  "--sidebar-background": "240 5.9% 10%",
  "--sidebar-foreground": "240 4.8% 95.9%",
  "--sidebar-primary": "224.3 76.3% 48%",
  "--sidebar-primary-foreground": "0 0% 100%",
  "--sidebar-accent": "240 3.7% 15.9%",
  "--sidebar-accent-foreground": "240 4.8% 95.9%",
  "--sidebar-border": "240 3.7% 15.9%",
  "--sidebar-ring": "217.2 91.2% 59.8%",
};

/** Google Fonts — maquette Sunu Tawfekh : Playfair Display + Inter. */
export const googleFontsStylesheetHref =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@100..900&display=swap";
