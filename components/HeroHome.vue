<script setup lang="ts">
withDefaults(
  defineProps<{
    overlapNav?: boolean;
  }>(),
  { overlapNav: true },
);

const heroImageUrl =
  "https://plus.unsplash.com/premium_photo-1661610756820-8dbfaaf9157e?q=80&w=2832&auto=format&fit=crop";
</script>

<template>
  <section
    class="relative flex min-h-[90vh] items-center overflow-hidden"
    :class="overlapNav ? '-mt-20 pt-20' : ''"
  >
    <!-- BACKGROUND -->
    <div class="absolute inset-0">
      <img :src="heroImageUrl" class="w-full h-full object-cover scale-105" />

      <!-- OVERLAY (fix lisibilité) -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20"
      ></div>
    </div>

    <!-- CONTENT -->
    <div class="relative z-10 w-full px-6 md:px-16 max-w-4xl">
      <!-- EYEBROW -->
      <div
        class="flex items-center gap-3 mb-6 text-xs uppercase mt-10 tracking-[0.2em] text-yellow-400"
      ></div>

      <!-- TITLE -->
      <h1 class="flex flex-col leading-tight">
        <span class="text-white/70 italic text-2xl md:text-4xl">
          Tous les produits,
        </span>
        <span class="text-white text-3xl md:text-6xl font-serif">
          tous les univers
        </span>
      </h1>

      <!-- DIVIDER -->
      <div
        class="w-12 h-[2px] bg-gradient-to-r from-yellow-400 to-transparent my-6"
      ></div>

      <!-- TEXT -->
      <p class="text-white/80 max-w-xl leading-relaxed text-sm md:text-base">
        Beauté, parfums, mode, accessoires, bien-être, alimentaire — une
        boutique pensée pour le quotidien comme pour l'envie.
      </p>

      <!-- CTA -->
      <div class="mt-8 flex flex-wrap gap-4">
        <NuxtLink
          to="/catalogue"
          class="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-all hover:scale-105 hover:shadow-lg"
        >
          Parcourir
          <span>→</span>
        </NuxtLink>

        <a
          href="https://wa.me/221770000000"
          target="_blank"
          class="flex items-center gap-2 border border-white/30 text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white/10 transition"
        >
          WhatsApp
        </a>
      </div>
    </div>

    <!-- BADGE -->
    <div
      class="absolute bottom-10 right-6 w-20 h-20 rounded-full border border-yellow-400/40 flex items-center justify-center text-[10px] text-yellow-400 text-center uppercase tracking-wider animate-spin-slow"
    >
      Livraison<br />rapide
    </div>
  </section>
</template>
