/**
 * Design system — valeurs HSL sans préfixe `hsl()` (format shadcn / Tailwind).
 * Modifier ici pour propager partout : variables CSS + couleurs thème.
 */

/** Primaire marque (#000666) — meta theme-color, partenaires, etc. */
export const brandPrimaryHex = "#000666";

export const cssVariablesRoot: Record<string, string> = {
  "--background": "45 20% 97%",
  "--foreground": "120 4% 10%",
  "--card": "0 0% 100%",
  "--card-foreground": "120 4% 10%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "120 4% 10%",
  "--primary": "236 100% 20%",
  "--primary-foreground": "0 0% 100%",
  "--primary-soft": "231 78% 84%",
  "--muted": "42 18% 94%",
  "--muted-foreground": "228 8% 30%",
  "--accent": "233 65% 94%",
  "--accent-foreground": "236 50% 28%",
  "--destructive": "0 68% 42%",
  "--destructive-foreground": "0 0% 100%",
  "--border": "230 14% 84%",
  "--input": "230 14% 84%",
  "--ring": "236 100% 20%",
  "--radius": "0.375rem",
  /* Or charte #E0A83A */
  "--gold": "40 84% 62%",
  "--gold-light": "40 72% 74%",
  "--secondary": "272 45% 49%",
  "--secondary-foreground": "0 0% 100%",
  "--nude": "0 0% 94%",
  "--cream": "0 0% 98%",
  "--charcoal": "120 4% 10%",
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
  "--muted-foreground": "0 0% 70%",
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

/** Google Fonts — premium éditorial : Noto Serif (titres) + Inter (corps). */
export const googleFontsStylesheetHref =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap";
