<script setup lang="ts">
import { computed, ref } from "vue";
import { useParallaxY } from "~/composables/useParallaxY";

const sectionRef = ref<HTMLElement | null>(null);

/** Parallaxe sécurisé (évite NaN / undefined côté style). */
const { y } = useParallaxY(sectionRef, { factor: 0.55, maxPx: 140 });

/** Image par défaut si aucune URL fournie (boutique / retail). */
const DEFAULT_PARALLAX_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-e647996988d3?auto=format&fit=crop&w=1920&q=80";

const props = withDefaults(
  defineProps<{
    /** URL de l’image de fond (parallaxe). */
    imageSrc?: string;
    overlayEyebrow?: string;
    overlayTitle?: string;
    overlaySubtitle?: string;
  }>(),
  { imageSrc: "" },
);

const resolvedSrc = computed(() => {
  const s = props.imageSrc?.trim();
  return s || DEFAULT_PARALLAX_IMAGE;
});

const parallaxY = computed(() => {
  const n = y.value;
  return Number.isFinite(n) ? n : 0;
});

const hasVisibleContent = computed(
  () => !!(props.overlayTitle || props.overlaySubtitle || props.overlayEyebrow),
);
</script>

<template>
  <section
    ref="sectionRef"
    data-home-reveal
    class="relative isolate flex min-h-[22rem] flex-col items-center justify-center overflow-hidden bg-st-black py-16 md:min-h-[min(70vh,38rem)] md:py-28 lg:min-h-[min(75vh,44rem)] lg:py-32"
    :aria-hidden="!hasVisibleContent"
  >
    <h2 v-if="hasVisibleContent" class="sr-only">Section visuelle Sunu Tawfekh</h2>

    <!--
      Fond parallaxe : image plus haute que le bloc + offset vertical négatif.
      Sinon translateY(+) seul fait « glisser » l’image vers le bas et le haut du
      conteneur laisse voir le fond gris de la page (bg-background).
    -->
    <div class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img
        :src="resolvedSrc"
        alt=""
        width="1920"
        height="1080"
        class="pointer-events-none min-h-[135%] w-full min-w-full object-cover object-center will-change-transform"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        :style="{
          transform: `translate3d(0, calc(-14% + ${parallaxY}px), 0) scale(1.12)`,
        }"
      >
    </div>

    <div class="pointer-events-none absolute inset-0 z-[1] bg-black/50" />
    <div
      class="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/35 to-primary/25"
    />
    <div
      class="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-gold/[0.06]"
    />

    <div
      v-if="hasVisibleContent"
      class="relative z-10 mx-auto w-full max-w-3xl space-y-5 px-5 text-center text-white md:space-y-6 md:px-10"
    >
      <p
        v-if="overlayEyebrow"
        class="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-soft md:text-xs"
      >
        {{ overlayEyebrow }}
      </p>

      <p
        v-if="overlayTitle"
        class="font-serif text-2xl uppercase leading-tight tracking-[0.12em] drop-shadow md:text-4xl lg:text-5xl"
      >
        {{ overlayTitle }}
      </p>

      <p
        v-if="overlaySubtitle"
        class="mx-auto max-w-lg text-xs font-light leading-[1.75] text-white/90 md:max-w-xl md:text-sm"
      >
        {{ overlaySubtitle }}
      </p>
    </div>
  </section>
</template>
