// https://nuxt.com/docs/api/configuration/nuxt-config
import { googleFontsStylesheetHref } from "./tailwind/design-tokens";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  /** Assure que `.nuxt/paths.mjs` existe sur disque pour Node (import `#internal/nuxt/paths` du bundle SSR). */
  hooks: {
    "app:templates"(app) {
      for (const t of app.templates) {
        if (t.filename === "paths.mjs") {
          t.write = true;
        }
      }
    },
  },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    cssPath: "~/assets/css/main.css",
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    /** Base API Orion (serveur uniquement) — sans slash final. */
    orionApiBase: process.env.NUXT_ORION_API_BASE || "https://api.orionsn.com/api",
    /** Slug boutique dans Orion (ex. sunu-tawfekh-boutique). */
    orionStoreSlug: process.env.NUXT_ORION_STORE_SLUG || "sunu-tawfekh-boutique",
    stockApiBase: "",
    stockApiKey: "",
    public: {
      /** mock | orion | api — défaut orion (catalogue Orion Sunu Tawfekh). Mettre mock pour le dev hors-ligne. */
      dataSource: process.env.NUXT_PUBLIC_DATA_SOURCE ?? "orion",
      catalogPageSize: 48,
      showDemoBanner: false,
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: "fr" },
      title: "Sunu Tawfekh Boutique — tous produits, tous univers | Dakar",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
        },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "mobile-web-app-capable", content: "yes" },
        {
          name: "description",
          content:
            "Sunu Tawfekh Boutique : beauté, parfums, mode, accessoires, maison, alimentaire, bien-être… Tous vos achats en ligne au Sénégal, livraison à Dakar.",
        },
        { property: "og:title", content: "Sunu Tawfekh Boutique — généraliste & livraison Dakar" },
        {
          property: "og:description",
          content:
            "Boutique en ligne : tous rayons, conseils WhatsApp, paiement à la livraison. Dakar & Sénégal.",
        },
        { property: "og:type", content: "website" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "mask-icon", href: "/favicon.svg", color: "#000666" },
        { rel: "apple-touch-icon", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "stylesheet", href: googleFontsStylesheetHref },
      ],
    },
  },
});
