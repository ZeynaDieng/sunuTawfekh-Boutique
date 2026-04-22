import plugin from "tailwindcss/plugin";
import { cssVariablesDark, cssVariablesRoot } from "./design-tokens";

/**
 * Source unique pour variables CSS, reset léger, utilitaires layout (safe area).
 */
export const themePlugin = plugin(({ addBase, addUtilities, theme }) => {
  const serif = theme("fontFamily.serif");
  const fontSerif =
    typeof serif === "string" ? serif : Array.isArray(serif) ? serif.join(", ") : String(serif);

  addBase({
    ":root": {
      ...cssVariablesRoot,
      colorScheme: "light",
    },
    ".dark": {
      ...cssVariablesDark,
      colorScheme: "dark",
    },
  });

  addBase({
    "*": {
      borderColor: "hsl(var(--border))",
    },
    html: {
      WebkitTapHighlightColor: "hsl(var(--primary) / 0.12)",
      maxWidth: "100%",
      overflowX: "clip",
    },
    body: {
      "@apply bg-background text-foreground font-sans antialiased": {},
      maxWidth: "100%",
      overflowX: "clip",
    },
    "h1, h2, h3, h4, h5, h6": {
      fontFamily: fontSerif,
    },
  });

  const lg = theme("screens.lg");
  const lgMin = typeof lg === "string" ? lg : (lg as { min?: string })?.min ?? "1024px";

  addUtilities({
    ".safe-nav-top": {
      paddingTop: "env(safe-area-inset-top, 0px)",
    },
    ".pt-with-fixed-nav": {
      paddingTop: "calc(6rem + env(safe-area-inset-top, 0px) + 1rem)",
      [`@media (min-width: ${lgMin})`]: {
        paddingTop: "calc(6rem + env(safe-area-inset-top, 0px) + 1rem)",
      },
    },
  });
});
