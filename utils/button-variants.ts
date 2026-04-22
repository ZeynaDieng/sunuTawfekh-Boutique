import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-luxury ease-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-secondary/85",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /** Accent or — bouton secondaire « chaleureux » ; le parcours principal utilise `default` / `hero`. */
        gold: "bg-gold text-charcoal tracking-wider uppercase text-xs font-semibold shadow-sm hover:-translate-y-0.5 hover:brightness-[0.98] hover:shadow-md",
        "gold-outline":
          "border border-gold text-gold hover:-translate-y-0.5 hover:bg-gold hover:text-charcoal tracking-wider uppercase text-xs font-semibold",
        "primary-outline":
          "border border-primary bg-transparent text-primary hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground tracking-wider uppercase text-xs font-semibold",
        hero: "bg-primary text-primary-foreground tracking-[0.2em] uppercase text-xs font-semibold shadow-md hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        xl: "h-14 px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
