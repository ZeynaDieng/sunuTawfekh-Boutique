import type { Config } from "tailwindcss";
import { themePlugin } from "./tailwind/theme.plugin";

export default {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        gold: "hsl(var(--gold))",
        "gold-light": "hsl(var(--gold-light))",
        nude: "hsl(var(--nude))",
        cream: "hsl(var(--cream))",
        charcoal: "hsl(var(--charcoal))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary-soft))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        /** Charte Sunu Tawfekh (hex fixes, alignés maquette React). */
        st: {
          black: "#0F0F0F",
          offwhite: "#F8F8F8",
          softgray: "#EAEAEA",
          gold: "#E0A83A",
          indigo: "#3F3C8C",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionDuration: {
        800: "800ms",
        /** Transitions « luxe » (boutons, cartes) — aligné avec les entrées animées */
        luxury: "600ms",
      },
      transitionTimingFunction: {
        /** Courbe unique charte Sunu Tawfekh (scroll-reveal, hero) */
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
        soft: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        /** Entrées type scroll-reveal (14px, même courbe que `.home-reveal-animate`) */
        "st-rise": {
          from: { opacity: "0", transform: "translate3d(0, 14px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "st-hero-fade": {
          from: { opacity: "0.9" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translate3d(0, 14px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translate3d(0, 14px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "st-rise": "st-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "st-rise-delay-1": "st-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both",
        "st-rise-delay-2": "st-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.24s both",
        "st-hero-fade": "st-hero-fade 1.15s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in-up": "fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-up": "slide-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), themePlugin],
} satisfies Config;
