<script setup lang="ts">
import { BRAND_NAME, HOME_CATEGORIES } from "~/utils/brand";
</script>

<template>
  <footer class="border-t border-border/60 bg-background pt-24 text-foreground dark:border-white/5 dark:bg-st-black dark:text-white">
    <div class="container mx-auto max-w-container-max px-6 md:px-12 xl:px-margin-x">
      <div class="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-6 text-center md:text-left">
          <h2 class="font-serif text-3xl italic tracking-tight text-primary">{{ BRAND_NAME }}</h2>
          <p class="mx-auto max-w-xs text-xs font-normal uppercase tracking-[0.12em] leading-loose text-muted-foreground md:mx-0 dark:text-gray-400">
            Boutique en ligne généraliste : beauté, mode, maison, alimentaire, bien-être et plus encore. Livraison à Dakar et conseils sur WhatsApp.
          </p>
        </div>
        <div class="space-y-6 text-center md:text-left">
          <h3 class="luxe-label text-primary dark:text-primary-soft">Nos univers</h3>
          <ul class="space-y-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground dark:text-gray-400">
            <li>
              <NuxtLink to="/catalogue" class="transition-colors hover:text-primary dark:hover:text-primary-soft">Tout le catalogue</NuxtLink>
            </li>
            <li v-for="cat in HOME_CATEGORIES" :key="cat.id">
              <NuxtLink
                :to="`/catalogue?cat=${cat.id}`"
                class="transition-colors hover:text-primary dark:hover:text-primary-soft"
              >
                {{ cat.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div class="space-y-6 text-center md:text-left">
          <h3 class="luxe-label text-primary dark:text-primary-soft">Clientèle</h3>
          <ul class="space-y-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground dark:text-gray-400">
            <li>
              <NuxtLink to="/livraison-retours" class="transition-colors hover:text-primary dark:hover:text-primary-soft">Livraison &amp; retours</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cgv" class="transition-colors hover:text-primary dark:hover:text-primary-soft">CGV</NuxtLink>
            </li>
            <li>
              <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-primary dark:hover:text-primary-soft">WhatsApp — service client</a>
            </li>
          </ul>
        </div>
        <div class="space-y-8 text-center md:text-left">
          <h3 class="luxe-label text-primary dark:text-primary-soft">Privilèges</h3>
          <p class="text-xs font-normal uppercase tracking-[0.12em] text-muted-foreground dark:text-gray-400">Inscrivez-vous pour nos offres exclusives {{ BRAND_NAME }}.</p>
          <div class="group mx-auto flex max-w-[200px] border-b border-border/60 pb-2 md:mx-0 md:max-w-none dark:border-white/20">
            <input
              type="email"
              placeholder="Email"
              class="w-full bg-transparent text-xs uppercase tracking-[0.12em] outline-none placeholder:text-muted-foreground/70 dark:placeholder:text-gray-700"
              autocomplete="email"
            >
            <button type="button" class="text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:text-primary/80 dark:hover:text-primary-soft">
              OK
            </button>
          </div>
        </div>
      </div>
      <div class="mt-24 flex flex-col items-center justify-between gap-6 border-t border-border/60 pt-10 md:flex-row dark:border-white/5">
        <p class="text-center text-xs uppercase tracking-[0.12em] text-muted-foreground">
          © {{ new Date().getFullYear() }} {{ BRAND_NAME }} — Dakar, Sénégal — Tous droits réservés.
        </p>
        <div class="flex gap-10 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground dark:text-gray-400">
          <span class="cursor-pointer transition-colors hover:text-primary">Instagram</span>
          <span class="cursor-pointer transition-colors hover:text-primary">Facebook</span>
        </div>
      </div>
    </div>
    <div class="pb-12" />
  </footer>
</template>
