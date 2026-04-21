<script setup lang="ts">
import { BRAND_NAME } from "~/utils/brand";

withDefaults(
  defineProps<{
    overlapNav?: boolean;
  }>(),
  { overlapNav: true },
);

/** Image hero maquette React (luxe boutique). */
const heroImageUrl =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80";
</script>

<template>
  <section
    class="relative isolate flex min-h-[85dvh] items-center justify-center overflow-hidden md:min-h-[90vh]"
    :class="
      overlapNav ? '-mt-14 pt-14 lg:-mt-16 lg:pt-16' : 'mt-0 bg-background pt-6'
    "
    aria-labelledby="hero-heading"
  >
    <div class="absolute inset-0 -z-20 overflow-hidden">
      <img
        :src="heroImageUrl"
        alt=""
        class="motion-safe:animate-st-hero-fade h-full min-h-full w-full scale-105 object-cover object-center"
        width="1600"
        height="1067"
        fetchpriority="high"
        decoding="async"
        sizes="100vw"
      />
    </div>
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-t from-st-black/90 via-transparent to-st-black/40"
      aria-hidden="true"
    />

    <div
      class="relative z-10 mx-auto max-w-4xl space-y-6 px-6 text-center text-white md:space-y-10 md:px-10"
    >
      <h2
        id="hero-heading"
        class="motion-safe:animate-st-rise text-balance font-serif text-3xl leading-[1.08] tracking-tight drop-shadow-md md:text-7xl md:drop-shadow-none lg:text-8xl"
      >
        L’Élégance <br class="hidden md:block" />
        par Tawfekh
      </h2>
      <p
        class="motion-safe:animate-st-rise-delay-1 mx-auto max-w-lg px-2 text-base font-normal leading-[1.65] opacity-95 md:max-w-xl md:px-4 md:text-xl md:leading-[1.7]"
      >
        Une curation exclusive mêlant indigo royal et éclats dorés pour un art
        de vivre d’exception au Sénégal.
      </p>
      <div
        class="motion-safe:animate-st-rise-delay-2 flex flex-col justify-center gap-4 pt-2 sm:flex-row md:pt-10"
      >
        <NuxtLink
          to="/catalogue"
          class="inline-flex items-center justify-center bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-xl transition-all duration-luxury ease-luxury hover:bg-primary/90 hover:text-primary-foreground md:px-12 md:py-5 md:text-base"
        >
          Explorer l’univers
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
