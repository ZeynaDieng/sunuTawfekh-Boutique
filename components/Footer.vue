<script setup lang="ts">
import { BRAND_NAME } from "~/utils/brand";
</script>

<template>
  <footer class="border-t border-white/5 bg-st-black pt-24 text-white">
    <div class="container mx-auto max-w-7xl px-6">
      <div class="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-6 text-center md:text-left">
          <h2 class="font-serif text-3xl uppercase tracking-widest text-primary">{{ BRAND_NAME }}</h2>
          <p class="mx-auto max-w-xs text-xs font-light leading-loose text-gray-400 md:mx-0">
            Votre destination premium pour le luxe et le bien-être au quotidien. L’excellence à la sénégalaise.
          </p>
        </div>
        <div class="space-y-6 text-center md:text-left">
          <h3 class="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Nos univers</h3>
          <ul class="space-y-4 text-xs font-medium uppercase tracking-widest text-gray-400">
            <li>
              <NuxtLink to="/catalogue?cat=beaute" class="transition-colors hover:text-gold">Beauté &amp; soins</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/catalogue?cat=parfums" class="transition-colors hover:text-gold">Haute parfumerie</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/catalogue?cat=mode" class="transition-colors hover:text-gold">Mode &amp; accessoires</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="space-y-6 text-center md:text-left">
          <h3 class="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Clientèle</h3>
          <ul class="space-y-4 text-xs font-medium uppercase tracking-widest text-gray-400">
            <li>
              <NuxtLink to="/livraison-retours" class="transition-colors hover:text-gold">Livraison &amp; retours</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cgv" class="transition-colors hover:text-gold">CGV</NuxtLink>
            </li>
            <li>
              <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-gold">WhatsApp concierge</a>
            </li>
          </ul>
        </div>
        <div class="space-y-8 text-center md:text-left">
          <h3 class="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Privilèges</h3>
          <p class="text-xs font-light text-gray-400">Inscrivez-vous pour nos offres exclusives {{ BRAND_NAME }}.</p>
          <div class="mx-auto flex max-w-[200px] border-b border-white/20 pb-2 group md:mx-0 md:max-w-none">
            <input
              type="email"
              placeholder="Email"
              class="w-full bg-transparent text-xs outline-none placeholder:text-gray-700"
              autocomplete="email"
            >
            <button type="button" class="text-[10px] font-bold uppercase tracking-widest text-primary transition-colors hover:text-gold">
              OK
            </button>
          </div>
        </div>
      </div>
      <div class="mt-24 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 md:flex-row">
        <p class="text-center text-[9px] uppercase tracking-[0.4em] text-gray-500">
          © {{ new Date().getFullYear() }} {{ BRAND_NAME }} — Dakar, Sénégal — Tous droits réservés.
        </p>
        <div class="flex gap-10 text-[9px] font-bold uppercase tracking-widest text-gray-400">
          <span class="cursor-pointer transition-colors hover:text-primary">Instagram</span>
          <span class="cursor-pointer transition-colors hover:text-gold">Facebook</span>
        </div>
      </div>
    </div>
    <div class="pb-12" />
  </footer>
</template>
