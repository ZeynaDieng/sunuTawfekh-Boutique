<script setup lang="ts">
import { ArrowRight, CreditCard, ShieldCheck, Truck } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { HOME_CATEGORIES } from "~/utils/brand";
import type { Product } from "~/utils/data";

const { data: catRes } = useCatalogCategories();

const { data: homeCatalog } = await useFetch("/api/catalog/products", {
  query: { page: 1, limit: 200 },
  key: "home-catalog-products",
});

const showDemoBanner = computed(
  () => !!(catRes.value?.demoMode || homeCatalog.value?.demoMode),
);

const allHomeProducts = computed(() => homeCatalog.value?.items ?? []);

/** Bandeau parallaxe : nature morte cosmétiques (plusieurs produits — Unsplash). */
const parallaxBgImage =
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1920&q=80";

/** Storytelling : même univers visuel, parallaxe plus douce que le bandeau plein écran. */
const storyParallaxImage = parallaxBgImage;
const storyParallaxRef = ref<HTMLElement | null>(null);
const { y: storyParallaxY } = useParallaxY(storyParallaxRef, {
  factor: 0.28,
  maxPx: 55,
});

/** Nouveautés : produits marqués neufs, sinon les mieux notés (maquette React). */
const newProducts = computed(() => {
  const list = allHomeProducts.value;
  const fresh = list.filter((p) => p.isNew);
  if (fresh.length >= 4) return fresh.slice(0, 4);
  return [...list].sort((a, b) => b.rating - a.rating).slice(0, 4);
});

const newProductIds = computed(
  () => new Set(newProducts.value.map((p) => p.id)),
);

/** Sélection phares : mieux notés en priorité hors « Nouveautés », puis complétion sans doublon. */
const featuredProducts = computed(() => {
  const list = allHomeProducts.value;
  if (!list.length) return [];
  const avoid = newProductIds.value;
  const rest = list.filter((p) => !avoid.has(p.id));
  const ranked = [...rest].sort((a, b) => b.rating - a.rating);
  const byRating = [...list].sort((a, b) => b.rating - a.rating);
  const out: typeof list = [];
  const seen = new Set<string>();
  for (const p of ranked) {
    if (out.length >= 4) break;
    out.push(p);
    seen.add(p.id);
  }
  for (const p of byRating) {
    if (out.length >= 4) break;
    if (!seen.has(p.id)) {
      out.push(p);
      seen.add(p.id);
    }
  }
  return out.slice(0, 4);
});

/** Badges conversion (hors ProductCard) — règles déterministes pour la home. */
function homePromoBadges(
  product: Product,
  index: number,
  section: "new" | "featured",
): { label: string; class: string }[] {
  const rows: { label: string; class: string }[] = [];
  const gold =
    "pointer-events-none absolute left-2 z-20 rounded-sm border border-gold/40 bg-gold/95 px-2 py-0.5 text-[6px] font-bold uppercase tracking-[0.12em] text-st-black shadow-sm md:left-4 md:px-2.5 md:py-1 md:text-[7px] md:tracking-[0.18em]";
  const light =
    "pointer-events-none absolute left-2 z-20 rounded-sm border border-white/25 bg-white/95 px-2 py-0.5 text-[6px] font-bold uppercase tracking-[0.12em] text-st-black shadow-sm backdrop-blur-sm md:left-4 md:px-2.5 md:py-1 md:text-[7px] md:tracking-[0.18em]";
  const darkChip =
    "pointer-events-none absolute left-2 z-20 rounded-sm border border-white/20 bg-st-black/80 px-2 py-0.5 text-[6px] font-bold uppercase tracking-[0.12em] text-white shadow-sm md:left-4 md:px-2.5 md:py-1 md:text-[7px] md:tracking-[0.18em]";

  if (section === "new") {
    if (index === 0 || (product.rating >= 4.85 && product.reviews >= 90)) {
      rows.push({ label: "Best seller", class: gold });
    }
    if (index === 1 || (product.rating >= 4.6 && product.rating < 4.85)) {
      rows.push({ label: "Tendance", class: darkChip });
    }
    if (index === 2 && product.inStock) {
      rows.push({ label: "Stock limité", class: darkChip });
    }
  } else {
    if (index === 0 || product.reviews >= 120) {
      rows.push({ label: "Best seller", class: gold });
    }
    if (index === 1) {
      rows.push({ label: "Tendance", class: light });
    }
    if (index === 3 && product.inStock) {
      rows.push({ label: "Stock limité", class: light });
    }
  }
  return rows.slice(0, 2);
}

/** Position verticale des pastilles selon la présence du badge « Nouveau » dans ProductCard. */
function homeBadgeTopOffset(product: Product, badgeIndex: number): string {
  const base = product.isNew && product.inStock ? 2.75 : 1;
  return `${base + badgeIndex * 1.65}rem`;
}

const homeTestimonials = [
  {
    quote:
      "Des produits introuvables ailleurs à Dakar, emballage soigné et conseils au top. Mon rituel beauté passe par Sunu Tawfekh.",
    author: "Awa",
    meta: "Dakar",
  },
  {
    quote:
      "J’ai offert un parfum et une pièce mode : la qualité est au rendez-vous. Livraison rapide, je recommande les yeux fermés.",
    author: "Ibrahima",
    meta: "Almadies",
  },
  {
    quote:
      "Enfin une boutique en ligne premium avec une vraie sélection. Le paiement à la livraison m’a rassurée pour la première commande.",
    author: "Marième",
    meta: "Mermoz",
  },
] as const;

let homeRevealObserver: IntersectionObserver | null = null;

onMounted(() => {
  if (!import.meta.client) return;
  homeRevealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("home-reveal-animate");
        homeRevealObserver?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  document
    .querySelectorAll("[data-home-reveal]")
    .forEach((el) => homeRevealObserver?.observe(el));
});

onBeforeUnmount(() => {
  homeRevealObserver?.disconnect();
  homeRevealObserver = null;
});

useSeoMeta({
  title: "Sunu Tawfekh — Concept Store Premium Dakar",
  description:
    "Une curation exclusive : beauté, parfums, mode et bien-être au Sénégal. Indigo royal et éclats dorés — livraison rapide à Dakar.",
  ogTitle: "Sunu Tawfekh — Concept Store Premium",
  ogDescription: "Beauté, parfums, mode et bien-être premium au Sénégal.",
});
</script>

<template>
  <div class="min-h-screen bg-background">
    <Navbar />
    <CatalogDemoBanner :show="showDemoBanner" />

    <HeroHome :overlap-nav="!showDemoBanner" />

    <!-- Nos univers — léger dégradé (évite un aplati sur fond page) -->
    <section
      class="bg-gradient-to-b from-background via-muted/35 to-background px-5 py-20 md:px-10 md:py-24 lg:py-32"
      data-home-reveal
    >
      <div class="mx-auto max-w-7xl">
        <div
          class="mb-14 flex flex-col items-center gap-6 text-center md:mb-20 md:flex-row md:items-end md:justify-between md:gap-8 md:text-left"
        >
          <div class="max-w-md md:text-left">
            <h3
              class="mb-5 font-serif text-2xl uppercase tracking-widest text-primary md:mb-6 md:text-4xl"
            >
              Nos univers
            </h3>
            <p
              class="text-xs font-light leading-[1.7] text-muted-foreground md:text-sm"
            >
              Chez Sunu Tawfekh, chaque détail est pensé pour refléter la
              qualité et le raffinement.
            </p>
          </div>
          <NuxtLink
            to="/catalogue"
            class="border-b border-primary pb-1 text-[10px] font-bold uppercase tracking-widest transition-colors duration-luxury ease-luxury hover:border-gold hover:text-gold"
          >
            Découvrir la collection
          </NuxtLink>
        </div>
        <div
          class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-6"
        >
          <NuxtLink
            v-for="cat in HOME_CATEGORIES"
            :key="cat.id"
            :to="`/catalogue?cat=${cat.id}`"
            class="group flex cursor-pointer flex-col items-center rounded-sm border border-border bg-card p-5 transition-all duration-luxury ease-luxury hover:scale-[1.02] hover:border-gold hover:bg-muted/50 hover:shadow-2xl sm:p-7 md:p-11"
          >
            <span
              class="mb-5 text-3xl transition-transform duration-luxury ease-luxury group-hover:scale-110 md:mb-6 md:text-4xl"
              >{{ cat.icon }}</span
            >
            <span
              class="text-center text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-luxury ease-luxury group-hover:text-primary"
              >{{ cat.name }}</span
            >
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Nouveautés — noir + dégradé discret indigo (ancrage premium) -->
    <section
      class="relative overflow-visible bg-black px-5 py-20 text-white md:overflow-hidden md:px-10 md:py-28 lg:py-36"
      data-home-reveal
    >
      <div
        class="pointer-events-none absolute right-0 top-0 h-full w-1/3 -skew-x-12 bg-primary/10"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-gold/[0.04]"
      />
      <div class="relative z-10 mx-auto max-w-7xl">
        <div class="mb-16 space-y-5 text-center md:mb-20 md:space-y-6">
          <span
            class="text-[10px] font-bold uppercase tracking-[0.4em] text-gold"
            >Exclusivités Sunu Tawfekh</span
          >
          <h3 class="font-serif text-3xl uppercase tracking-widest md:text-5xl">
            Nouveautés
          </h3>
        </div>
        <div
          v-if="newProducts.length"
          class="home-product-scroll -mx-5 overflow-x-auto overflow-y-visible overscroll-x-contain px-5 pb-2 md:mx-0 md:overflow-visible md:pb-0"
        >
          <div
            class="flex snap-x snap-mandatory flex-nowrap gap-3 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16 md:snap-none lg:grid-cols-4"
          >
            <div
              v-for="(p, i) in newProducts"
              :key="p.id"
              class="relative w-[min(48vw,11rem)] shrink-0 snap-start sm:w-[min(44vw,11.75rem)] md:w-auto md:min-w-0 md:snap-normal md:transition-transform md:duration-luxury md:ease-luxury motion-safe:md:hover:scale-[1.02]"
            >
              <span
                v-for="(b, bi) in homePromoBadges(p, i, 'new')"
                :key="`${p.id}-${b.label}`"
                :class="b.class"
                :style="{ top: homeBadgeTopOffset(p, bi) }"
              >
                {{ b.label }}
              </span>
              <ProductCard compact variant="dark" :product="p" />
            </div>
          </div>
        </div>
        <p v-else class="text-center text-sm text-muted-foreground">
          Chargement du catalogue…
        </p>
      </div>
    </section>

    <!-- Storytelling marque (fond parallaxe discret) -->
    <section
      ref="storyParallaxRef"
      class="relative isolate overflow-hidden border-y border-white/10 bg-st-black px-5 py-20 md:px-10 md:py-24 lg:py-32"
      data-home-reveal
    >
      <!-- BACKGROUND PARALLAX -->
      <div
        class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <!-- IMAGE -->
        <img
          :src="storyParallaxImage"
          alt=""
          width="1920"
          height="1080"
          loading="lazy"
          decoding="async"
          class="absolute left-0 top-0 h-full min-h-[125%] w-full min-w-full object-cover object-center will-change-transform"
          :style="{
            transform: `translate3d(0, calc(-10% + ${
              Number.isFinite(storyParallaxY) ? storyParallaxY : 0
            }px), 0) scale(1.06)`,
          }"
        />

        <div class="absolute inset-0 bg-black/45" />
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/55"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary/[0.12] via-transparent to-primary/[0.08]"
        />
      </div>

      <!-- CONTENT -->
      <div class="relative z-10 mx-auto max-w-7xl">
        <div class="mx-auto max-w-xl text-center md:max-w-2xl">
          <p
            class="mb-5 text-[10px] font-bold uppercase tracking-[0.35em] text-gold md:mb-6"
          >
            L’esprit Sunu Tawfekh
          </p>

          <h2
            class="mb-8 font-serif text-2xl uppercase tracking-widest text-white md:mb-10 md:text-4xl"
          >
            Une maison de sélection, pas un simple catalogue
          </h2>

          <p
            class="text-sm font-light leading-[1.75] text-white/90 md:text-base"
          >
            Nous cultivons l’exigence : pièces choisies pour leur signature,
            leur tenue dans le temps et l’émotion qu’elles suscitent. Chaque
            ajout au catalogue est pensé comme une invitation au plaisir et à la
            confiance — du premier regard à la livraison.
          </p>
        </div>
      </div>
    </section>

    <!-- Sélection produits — clair en dégradé (respiration après le parallaxe) -->
    <section
      class="border-y border-border bg-gradient-to-b from-muted/30 via-background to-muted/30 px-5 py-20 md:px-10 md:py-24 lg:py-32"
      data-home-reveal
    >
      <div class="mx-auto max-w-7xl">
        <div
          class="mb-14 flex flex-col items-center gap-6 text-center md:mb-20 md:flex-row md:items-end md:justify-between md:gap-8 md:text-left"
        >
          <div class="max-w-lg md:text-left">
            <p
              class="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-primary"
            >
              Qualité &amp; confiance
            </p>
            <h3
              class="font-serif text-2xl uppercase tracking-widest text-foreground md:text-4xl"
            >
              Sélection phares
            </h3>
          </div>
          <NuxtLink
            to="/catalogue"
            class="inline-flex items-center gap-2 border-b border-primary pb-1 text-[10px] font-bold uppercase tracking-widest text-primary transition-colors duration-luxury ease-luxury hover:border-gold hover:text-gold"
          >
            Explorer la boutique
            <ArrowRight class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>
        <div
          v-if="featuredProducts.length"
          class="home-product-scroll -mx-5 overflow-x-auto overflow-y-visible overscroll-x-contain px-5 pb-2 md:mx-0 md:overflow-visible md:pb-0"
        >
          <div
            class="flex snap-x snap-mandatory flex-nowrap gap-3 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-16 md:snap-none xl:grid-cols-4"
          >
            <div
              v-for="(p, i) in featuredProducts"
              :key="p.id"
              class="relative w-[min(48vw,11rem)] shrink-0 snap-start sm:w-[min(44vw,11.75rem)] md:w-auto md:min-w-0 md:snap-normal md:transition-transform md:duration-luxury md:ease-luxury motion-safe:md:hover:scale-[1.02]"
            >
              <span
                v-for="(b, bi) in homePromoBadges(p, i, 'featured')"
                :key="`${p.id}-${b.label}`"
                :class="b.class"
                :style="{ top: homeBadgeTopOffset(p, bi) }"
              >
                {{ b.label }}
              </span>
              <ProductCard compact :product="p" />
            </div>
          </div>
        </div>
        <p v-else class="text-center text-sm text-muted-foreground">
          Chargement du catalogue…
        </p>
      </div>
    </section>

    <!-- Preuve sociale — bandeau sombre (contraste après sélection claire, avant parallaxe) -->
    <section
      class="relative overflow-hidden bg-black px-5 py-20 text-white md:px-10 md:py-24 lg:py-32"
      data-home-reveal
    >
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-gold/[0.06] via-transparent to-transparent"
      />
      <div class="relative z-10 mx-auto max-w-7xl">
        <div class="mb-14 text-center md:mb-20">
          <p
            class="mb-5 text-[10px] font-bold uppercase tracking-[0.35em] text-gold md:mb-6"
          >
            Elles &amp; ils en parlent
          </p>
          <h3
            class="font-serif text-2xl uppercase tracking-widest text-white md:text-3xl"
          >
            La communauté Tawfekh
          </h3>
        </div>
        <!-- Marquee infini : deux passes identiques, translate -50% (voir main.css) -->
        <div
          class="home-testimonials-marquee relative -mx-5 mt-10 overflow-hidden md:-mx-10 md:mt-14"
          aria-label="Témoignages clients"
        >
          <div
            class="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black to-transparent md:w-16"
            aria-hidden="true"
          />
          <div
            class="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-black to-transparent md:w-16"
            aria-hidden="true"
          />
          <div
            class="home-testimonials-track flex pr-6 md:pr-10 lg:pr-12"
          >
            <template v-for="pass in 2" :key="pass">
              <div
                class="flex shrink-0 gap-6 md:gap-10 lg:gap-12 [&:not(:first-child)]:pl-6 md:[&:not(:first-child)]:pl-10 lg:[&:not(:first-child)]:pl-12"
              >
                <blockquote
                  v-for="(t, idx) in homeTestimonials"
                  :key="`${pass}-${idx}`"
                  class="flex w-72 shrink-0 flex-col justify-between border border-white/15 bg-white/[0.07] p-9 text-left shadow-sm backdrop-blur-sm sm:w-80 md:w-96 md:p-11"
                >
                  <p
                    class="mb-8 text-sm font-light leading-[1.75] text-white/80 md:mb-10 md:text-[0.9375rem]"
                  >
                    « {{ t.quote }} »
                  </p>
                  <footer>
                    <p
                      class="text-[10px] font-bold uppercase tracking-[0.2em] text-gold"
                    >
                      {{ t.author }}
                    </p>
                    <p class="mt-2 text-xs text-white/55">{{ t.meta }}</p>
                  </footer>
                </blockquote>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Parallaxe : image en arrière-plan seule (texte au-dessus du voile, pas d’image devant) -->
    <HomeParallaxBand
      :image-src="parallaxBgImage"
      overlay-eyebrow="Sunu Tawfekh"
      overlay-title="L’expérience boutique"
    />

    <!-- Engagements — transition douce vers le footer -->
    <section
      class="bg-gradient-to-b from-background via-muted/25 to-background px-5 py-20 md:px-10 md:py-28 lg:py-36"
      data-home-reveal
    >
      <div
        class="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-3 md:gap-x-12 md:gap-y-0 lg:gap-x-16"
      >
        <div class="group space-y-7 text-center md:space-y-8">
          <div
            class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm transition-all duration-luxury ease-luxury group-hover:bg-primary group-hover:text-white"
          >
            <Truck class="h-6 w-6" />
          </div>
          <h4 class="text-[11px] font-bold uppercase tracking-widest">
            Livraison Tawfekh
          </h4>
          <p
            class="mx-auto max-w-xs text-xs font-light leading-[1.75] text-muted-foreground"
          >
            Service VIP partout au Sénégal en moins de 48h avec le plus grand
            soin.
          </p>
        </div>
        <div class="group space-y-7 text-center md:space-y-8">
          <div
            class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm transition-all duration-luxury ease-luxury group-hover:bg-primary group-hover:text-white"
          >
            <ShieldCheck class="h-6 w-6" />
          </div>
          <h4 class="text-[11px] font-bold uppercase tracking-widest">
            Produits authentiques
          </h4>
          <p
            class="mx-auto max-w-xs text-xs font-light leading-[1.75] text-muted-foreground"
          >
            Chaque article est un trésor d’authenticité sélectionné avec
            rigueur.
          </p>
        </div>
        <div class="group space-y-7 text-center md:space-y-8">
          <div
            class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm transition-all duration-luxury ease-luxury group-hover:bg-primary group-hover:text-white"
          >
            <CreditCard class="h-6 w-6" />
          </div>
          <h4 class="text-[11px] font-bold uppercase tracking-widest">
            Paiement à la livraison
          </h4>
          <p
            class="mx-auto max-w-xs text-xs font-light leading-[1.75] text-muted-foreground"
          >
            Simplifiez-vous la vie : payez en cash ou Wave lors de la réception.
          </p>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>
