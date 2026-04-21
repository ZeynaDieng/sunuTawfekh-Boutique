import { nextTick, onMounted, onUnmounted, ref, type Ref } from "vue";

export type ParallaxYOptions = {
  /** Intensité (0.25–0.55 donne un effet bien visible). */
  factor?: number;
  /** Limite le déplacement en px (évite les sauts extrêmes). */
  maxPx?: number;
};

/**
 * Parallaxe verticale sur l’image de fond : le fond se décale par rapport au bloc
 * quand on fait défiler la page (effet plus lisible qu’un simple `top * 0.2`).
 * Sur viewport ≤767px l’intensité est atténuée (facteur ×0.65, amplitude plafonnée à 56px).
 */
export function useParallaxY(
  containerRef: Ref<HTMLElement | null>,
  optionsOrFactor: number | ParallaxYOptions = {},
) {
  const opts: ParallaxYOptions =
    typeof optionsOrFactor === "number" ? { factor: optionsOrFactor } : optionsOrFactor;
  const factor = opts.factor ?? 0.38;
  const maxPx = opts.maxPx ?? 110;

  const y = ref(0);
  let raf = 0;
  let reduceMotion = false;

  function update() {
    raf = 0;
    const el = containerRef.value;
    if (!el || typeof window === "undefined") {
      y.value = 0;
      return;
    }
    if (reduceMotion) {
      y.value = 0;
      return;
    }
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const isMobile =
      window.matchMedia?.("(max-width: 767px)")?.matches ?? window.innerWidth <= 767;
    // Mobile : effet un peu plus lisible qu’en desktop allégé, tout en restant raisonnable pour le scroll
    const f = isMobile ? factor * 0.65 : factor;
    const cap = isMobile ? Math.min(maxPx, 56) : maxPx;
    const raw = (vh * 0.5 - rect.top) * f;
    y.value = Math.max(-cap, Math.min(cap, raw));
  }

  function onScroll() {
    if (!raf) raf = requestAnimationFrame(update);
  }

  onMounted(() => {
    reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    void nextTick(() => {
      update();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Certaines pages / navigateurs : premier rendu sans événement scroll
    requestAnimationFrame(update);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (raf) cancelAnimationFrame(raf);
  });

  return { y };
}
