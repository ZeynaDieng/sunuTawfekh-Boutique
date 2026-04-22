<script setup lang="ts">
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { HOME_BESPOKE_IMAGE } from "~/utils/home-showcase";
import { HOME_CATEGORIES } from "~/utils/brand";
import { formatPrice, type Product } from "~/utils/data";

/** Visuels de secours (maquette) si le catalogue a moins de 3 entrées « nouveautés ». */
const NEW_ARRIVAL_FALLBACK_MAIN =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBQSFcVK5Hcg15ztiRtu9t6dfyBvoER8ldjtF27md23CkXW8clHn981-RCx3rjOQEAW5V37ZK3m8iv8e1GI1EcsB3xTIVlWFTzymXgpWd-C8F-Vbj7iulTPF70xmo1JgSxjHuSTJxrhnTT65s-9i-UO7akrCltutpg52-A8FD8v4R_X5TlletND6tinY1Nlf7puYtAJAZlhGgx27dBCH6Fti1F05ABQ3yGTab5J2G36_P2Y7YhGxNomndxlZDfX70dAoAiHpceUjeUP";
const NEW_ARRIVAL_FALLBACK_1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCePowiOsmJNMZa6VdnQZ-avuqulLM40-hobAuSfVy3XNkR0plCyIjt0Ne0R-kn5NUl7-qwlLmiiwgBCdh3o2pJQyfPfuzg6apltPPpBVYN6qPNMtY4PCAAz55zx5DJJssqbhnvKUYa5zpN-c_w_iktrhiFDtEqDY7OhP3XYludEtUta8rVNvTBG4jh2Bhcp0BVO3_-linV45QY6qQxYUtcPks1oPJ1n7G_5pM0-jwbrj2v3ECoK5TvBe9lDri-z7nHXxK0GP2qJyyS";
const NEW_ARRIVAL_FALLBACK_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_kqrC-WnckChk8CvF1P0IVqreFe5r8_vYSY92tyhoqtXe2EzCiLjMpVtIw4aivO3QBe8MZMXMBhDVXZWDlt5MDGiwCyx-9vHVmq9i2di8pbWneeG63zbFQAIvsP_GkpLKv8AUkFTEUPxZwiL48TAVjx5kL7YqnOG7MQzm0RNmk5Qp0BXmiD9wGC7KWYlvkZRUOcX6bizrmzqrCjyvpL5T81NTCTzxoH24bpvSXQWOqPWixZWS1ALMcs-Evau9uWMvMbLYMLCKbN9";

const { data: catRes } = useCatalogCategories();

const { data: homeCatalog } = await useFetch("/api/catalog/products", {
  query: { page: 1, limit: 200 },
  key: "home-catalog-products",
});

const showDemoBanner = computed(
  () => !!(catRes.value?.demoMode || homeCatalog.value?.demoMode),
);

const allHomeProducts = computed(() => homeCatalog.value?.items ?? []);

/** Nouveautés : produits marqués neufs en priorité, puis complément par note. */
const newArrivalProducts = computed((): Product[] => {
  const list = allHomeProducts.value;
  if (!list.length) return [];
  const fresh = list.filter((p) => p.isNew);
  const rest = [...list]
    .filter((p) => !p.isNew)
    .sort((a, b) => b.rating - a.rating);
  const merged = [...fresh, ...rest];
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of merged) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length >= 3) break;
  }
  return out;
});

const newArrivalBlock = computed(() => {
  const [a, b, c] = newArrivalProducts.value;
  return {
    main: {
      img: a?.image ?? NEW_ARRIVAL_FALLBACK_MAIN,
      href: a ? `/produit/${a.id}` : "/catalogue",
      alt: a?.name ?? "Nouveautés Sunu Tawfekh",
    },
    title: a?.name ?? "Les nouveautés du moment",
    blurb:
      "Beauté, mode, maison, alimentaire… Chaque semaine, de nouvelles références rejoignent le catalogue. Faites le plein d’idées et de produits choisis pour vous.",
    small1: {
      img: b?.image ?? NEW_ARRIVAL_FALLBACK_1,
      label: b?.name ?? "Nouveau",
      href: b ? `/produit/${b.id}` : "/catalogue",
    },
    small2: {
      img: c?.image ?? NEW_ARRIVAL_FALLBACK_2,
      label: c?.name ?? "Nouveau",
      href: c ? `/produit/${c.id}` : "/catalogue",
    },
  };
});

/** Grille « Pièces maîtresses » : 4 meilleures notes (données réelles). */
const featuredProducts = computed(() => {
  const list = allHomeProducts.value;
  if (!list.length) return [];
  return [...list].sort((a, b) => b.rating - a.rating).slice(0, 4);
});

const OUR_PRODUCTS_PAGE = 4;
const ourProductsOffset = ref(0);

/** Fenêtre « Nos produits » : priorité aux articles hors « Sélection du moment », tri par popularité. */
const ourProductsPool = computed((): Product[] => {
  const list = allHomeProducts.value;
  if (!list.length) return [];
  const featIds = new Set(featuredProducts.value.map((p) => p.id));
  const withoutFeatured = list.filter((p) => !featIds.has(p.id));
  const base =
    withoutFeatured.length >= OUR_PRODUCTS_PAGE ? withoutFeatured : list;
  return [...base].sort((a, b) => b.reviews - a.reviews || b.rating - a.rating);
});

const ourProductsMaxOffset = computed(() =>
  Math.max(0, ourProductsPool.value.length - OUR_PRODUCTS_PAGE),
);

const ourProductsVisible = computed(() => {
  const pool = ourProductsPool.value;
  if (!pool.length) return [];
  const start = Math.min(ourProductsOffset.value, ourProductsMaxOffset.value);
  return pool.slice(start, start + OUR_PRODUCTS_PAGE);
});

watch(ourProductsPool, () => {
  ourProductsOffset.value = Math.min(
    ourProductsOffset.value,
    ourProductsMaxOffset.value,
  );
});

function ourProductsPrev() {
  ourProductsOffset.value = Math.max(
    0,
    ourProductsOffset.value - OUR_PRODUCTS_PAGE,
  );
}

function ourProductsNext() {
  ourProductsOffset.value = Math.min(
    ourProductsMaxOffset.value,
    ourProductsOffset.value + OUR_PRODUCTS_PAGE,
  );
}

function productRayonLabel(p: Product): string {
  const cats: Record<string, string> = {
    beaute: "Beauté",
    parfums: "Parfums",
    mode: "Mode",
    accessoires: "Accessoires",
    "bien-etre": "Bien-être",
    alimentaire: "Alimentaire",
  };
  return (cats[p.category] ?? p.category).toUpperCase();
}

const patrons = [
  {
    quote:
      "J’ai commandé de la beauté et de l’alimentaire : tout est arrivé vite, bien emballé. Une vraie boutique où on trouve de tout.",
    author: "Awa D.",
    meta: "Dakar",
  },
  {
    quote:
      "Large choix, des marques connues et des produits locaux. Le paiement à la livraison m’a rassurée pour tester la boutique.",
    author: "Ibrahima N.",
    meta: "Pikine",
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
  title: "Sunu Tawfekh Boutique — beauté, mode, maison & plus | Dakar",
  description:
    "Boutique en ligne généraliste : beauté, parfums, mode, accessoires, bien-être, alimentaire et bien plus. Livraison et service client à Dakar.",
  ogTitle: "Sunu Tawfekh Boutique — tous les produits, tous les univers",
  ogDescription:
    "Votre shopping en ligne au Sénégal : tous rayons, sélection claire, conseils sur WhatsApp.",
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <Navbar />
    <CatalogDemoBanner :show="showDemoBanner" />

    <HeroHome :overlap-nav="!showDemoBanner" />

    <!-- Nouveautés — après la bannière hero -->
    <section class="overflow-hidden bg-card py-stack-lg" data-home-reveal>
      <div class="mx-auto max-w-container-max px-6 md:px-12 xl:px-margin-x">
        <div class="mb-stack-md flex flex-col items-center text-center">
          <span
            class="home-label-caps mb-4 block font-sans uppercase tracking-[0.2em] text-gold"
          >
            Le dernier cri
          </span>
          <h2 class="home-font-h2 font-serif text-primary">Nouveautés</h2>
          <div class="mt-6 h-px w-12 bg-primary/20" aria-hidden="true" />
        </div>
        <div class="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <NuxtLink
            :to="newArrivalBlock.main.href"
            class="group relative aspect-[4/5] cursor-pointer overflow-hidden"
          >
            <img
              :src="newArrivalBlock.main.img"
              :alt="newArrivalBlock.main.alt"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-transparent"
              aria-hidden="true"
            />
          </NuxtLink>
          <div class="flex flex-col justify-center space-y-8 md:pl-12">
            <div class="space-y-4 text-center md:text-left">
              <h3 class="font-serif text-3xl text-gold md:text-4xl">
                {{ newArrivalBlock.title }}
              </h3>
              <p
                class="home-font-body-lg font-sans italic text-muted-foreground"
              >
                {{ newArrivalBlock.blurb }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-3">
                <NuxtLink
                  :to="newArrivalBlock.small1.href"
                  class="block aspect-square overflow-hidden bg-muted"
                >
                  <img
                    :src="newArrivalBlock.small1.img"
                    :alt="newArrivalBlock.small1.label"
                    loading="lazy"
                    decoding="async"
                    class="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </NuxtLink>
                <p
                  class="home-label-caps line-clamp-2 text-[10px] uppercase text-primary"
                >
                  {{ newArrivalBlock.small1.label }}
                </p>
              </div>
              <div class="space-y-3">
                <NuxtLink
                  :to="newArrivalBlock.small2.href"
                  class="block aspect-square overflow-hidden bg-muted"
                >
                  <img
                    :src="newArrivalBlock.small2.img"
                    :alt="newArrivalBlock.small2.label"
                    loading="lazy"
                    decoding="async"
                    class="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </NuxtLink>
                <p
                  class="home-label-caps line-clamp-2 text-[10px] uppercase text-primary"
                >
                  {{ newArrivalBlock.small2.label }}
                </p>
              </div>
            </div>
            <NuxtLink
              to="/catalogue"
              class="home-label-caps mx-auto w-fit border-b border-primary/40 pb-2 text-center text-xs uppercase tracking-[0.2em] text-primary transition-all hover:border-primary md:mx-0 md:text-left"
            >
              Voir les nouveautés
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos univers — tous les rayons, défilement horizontal -->

    <section class="bg-muted dark:bg-background py-16 md:py-20 overflow-hidden">
      <div class="mx-auto max-w-[1440px] px-6 md:px-12">
        <!-- HEADER -->
        <div
          class="flex flex-col gap-5 mb-8 md:flex-row md:items-end md:justify-between md:mb-10"
        >
          <div>
            <!-- EYEBROW -->
            <div
              class="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gold mb-2"
            >
              <span class="w-[5px] h-[5px] rounded-full bg-current"></span>
              Rayons & catégories
            </div>

            <!-- TITLE -->
            <h2
              class="font-serif text-3xl md:text-5xl text-primary leading-tight tracking-tight"
            >
              Nos univers
            </h2>
          </div>

          <!-- LINK -->
          <NuxtLink
            to="/catalogue"
            class="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-primary border-b border-current pb-1 opacity-50 transition-all hover:opacity-100 hover:gap-3 whitespace-nowrap"
          >
            <span>Explorer tous les univers</span>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              class="w-4 h-4 transition-transform group-hover:translate-x-1"
            >
              <path
                d="M4 10h12M11 5l5 5-5 5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </NuxtLink>
        </div>

        <!-- MOBILE HINT -->
        <p
          class="flex items-center gap-1 text-[11px] text-gray-400 mb-4 md:hidden"
        >
          <svg viewBox="0 0 20 20" fill="none" class="w-3.5 h-3.5">
            <path
              d="M7 10h6M10 7l3 3-3 3"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Glissez pour voir tous les rayons
        </p>

        <!-- SCROLL -->
        <div class="relative -mx-6 md:-mx-12">
          <div
            class="flex gap-4 md:gap-5 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory px-6 md:px-12 pb-6 scrollbar-none"
          >
            <div
              v-for="cat in HOME_CATEGORIES"
              :key="cat.id"
              class="snap-start shrink-0 w-[78vw] max-w-[280px] sm:w-[280px] lg:w-[300px]"
            >
              <CategoryCard
                scroll-strip
                :title="cat.name"
                :subtitle="cat.subtitle"
                :image="cat.image"
                :link="`/catalogue?cat=${cat.id}`"
              />
            </div>
          </div>

          <!-- FADE LEFT -->
          <div
            class="hidden md:block absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted to-transparent dark:from-background pointer-events-none"
          ></div>

          <!-- FADE RIGHT -->

          <div
            class="hidden md:block absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted to-transparent dark:from-background pointer-events-none"
          ></div>
        </div>
      </div>
    </section>

    <!-- Les pièces maîtresses — maquette : fond clair, grille 4, gap-gutter -->
    <section class="bg-card py-stack-lg" data-home-reveal>
      <div class="mx-auto max-w-container-max px-6 md:px-12 xl:px-margin-x">
        <div class="mb-stack-md text-center">
          <h2 class="home-font-h2 font-serif text-primary">
            Sélection du moment
          </h2>
          <p
            class="home-font-body-lg mx-auto mt-4 max-w-2xl font-sans italic text-muted-foreground"
          >
            Quelques coups de cœur parmi tout le catalogue : beauté, mode,
            maison…
          </p>
        </div>
        <div
          v-if="featuredProducts.length"
          class="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-4"
        >
          <ProductCard
            v-for="p in featuredProducts"
            :key="p.id"
            image-aspect="3/4"
            :show-new-badge="false"
            :show-out-of-stock-badge="false"
            :product="p"
          />
        </div>
        <p v-else class="text-center text-sm text-muted-foreground">
          Chargement du catalogue…
        </p>
      </div>
    </section>

    <!-- Avis — maquette : fond surface-container, 2 cartes glass -->
    <section class="overflow-hidden bg-muted/45 py-stack-lg" data-home-reveal>
      <div class="mx-auto max-w-container-max px-6 md:px-12 xl:px-margin-x">
        <div
          class="flex flex-col items-center gap-16 md:flex-row md:items-start"
        >
          <div class="md:w-1/3 md:shrink-0">
            <span
              class="home-label-caps mb-4 block font-sans uppercase text-gold"
            >
              Avis clients
            </span>
            <h2 class="home-font-h2 mb-6 font-serif text-primary">
              Ils achètent sur Sunu Tawfekh
            </h2>
            <div class="mb-8 flex gap-0.5 text-gold">
              <Star
                v-for="s in 5"
                :key="s"
                class="h-5 w-5 fill-gold text-gold"
              />
            </div>
            <p class="home-font-body-lg font-sans italic text-muted-foreground">
              Parcours d’achat, choix des produits et livraison : la parole à
              celles et ceux qui commandent chez nous.
            </p>
          </div>
          <div class="flex w-full flex-col gap-8 md:w-2/3 md:flex-row">
            <div
              class="glass-panel-heritage w-full max-w-lg rounded-sm border border-white/40 p-8 text-primary md:p-12 dark:border-white/20 dark:text-white"
            >
              <Quote class="mb-8 h-10 w-10 text-gold" aria-hidden="true" />
              <p
                class="mb-10 font-serif text-xl italic leading-snug md:text-2xl"
              >
                « {{ patrons[0].quote }} »
              </p>
              <div>
                <p
                  class="home-label-caps font-sans uppercase text-primary dark:text-white"
                >
                  {{ patrons[0].author }}
                </p>
                <p class="mt-1 font-sans text-sm text-muted-foreground">
                  {{ patrons[0].meta }}
                </p>
              </div>
            </div>
            <div
              class="glass-panel-heritage hidden w-full max-w-lg rounded-sm border border-white/40 p-8 text-primary md:p-12 lg:block lg:translate-y-12 dark:border-white/20 dark:text-white"
            >
              <Quote class="mb-8 h-10 w-10 text-gold" aria-hidden="true" />
              <p
                class="mb-10 font-serif text-xl italic leading-snug md:text-2xl"
              >
                « {{ patrons[1].quote }} »
              </p>
              <div>
                <p
                  class="home-label-caps font-sans uppercase text-primary dark:text-white"
                >
                  {{ patrons[1].author }}
                </p>
                <p class="mt-1 font-sans text-sm text-muted-foreground">
                  {{ patrons[1].meta }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos produits — grille moderne + pagination par flèches -->
    <section class="bg-muted/25 py-stack-lg dark:bg-muted/15" data-home-reveal>
      <div class="mx-auto max-w-container-max px-6 md:px-12 xl:px-margin-x">
        <div
          class="mb-stack-md flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 class="home-font-h2 font-serif text-primary">Nos produits</h2>
            <p class="mt-2 font-sans text-base italic text-muted-foreground">
              Un aperçu du catalogue : beauté, mode, maison, alimentaire et plus
              encore.
            </p>
          </div>
          <div
            v-if="ourProductsMaxOffset > 0"
            class="flex shrink-0 justify-end gap-4"
          >
            <button
              type="button"
              class="flex h-12 w-12 items-center justify-center rounded-full border border-primary/15 text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-35"
              aria-label="Produits précédents"
              :disabled="ourProductsOffset <= 0"
              @click="ourProductsPrev"
            >
              <ChevronLeft class="h-5 w-5" />
            </button>
            <button
              type="button"
              class="flex h-12 w-12 items-center justify-center rounded-full border border-primary/15 text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-35"
              aria-label="Produits suivants"
              :disabled="ourProductsOffset >= ourProductsMaxOffset"
              @click="ourProductsNext"
            >
              <ChevronRight class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          v-if="ourProductsVisible.length"
          class="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div v-for="p in ourProductsVisible" :key="p.id" class="group">
            <div class="relative mb-6 aspect-[3/4] overflow-hidden bg-muted">
              <NuxtLink :to="`/produit/${p.id}`" class="block h-full w-full">
                <img
                  :src="p.image"
                  :alt="p.name"
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-cover grayscale-[0.5] transition-all duration-700 group-hover:grayscale-0"
                />
              </NuxtLink>
              <div
                class="pointer-events-none absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <NuxtLink
                :to="`/produit/${p.id}`"
                class="home-label-caps absolute bottom-6 left-6 right-6 bg-white py-4 text-center text-[10px] uppercase tracking-[0.2em] text-primary opacity-0 translate-y-4 transition-all duration-500 hover:bg-primary hover:text-primary-foreground group-hover:translate-y-0 group-hover:opacity-100"
              >
                Voir la fiche
              </NuxtLink>
            </div>
            <div class="space-y-1">
              <p
                class="home-label-caps text-[10px] uppercase tracking-[0.2em] text-gold"
              >
                {{ productRayonLabel(p) }}
              </p>
              <h4 class="font-serif text-lg text-primary">
                <NuxtLink
                  :to="`/produit/${p.id}`"
                  class="transition-colors hover:text-gold"
                >
                  {{ p.name }}
                </NuxtLink>
              </h4>
              <p class="font-sans text-base text-primary/70">
                {{ formatPrice(p.price) }}
              </p>
            </div>
          </div>
        </div>
        <p v-else class="py-16 text-center text-sm text-muted-foreground">
          Chargement du catalogue…
        </p>

        <div class="mt-stack-md text-center">
          <NuxtLink
            to="/catalogue"
            class="home-label-caps inline-block bg-primary px-12 py-5 text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90"
          >
            Tout le catalogue
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Service & contact — boutique généraliste -->
    <section
      class="relative flex min-h-[min(85dvh,716px)] items-center md:h-[716px] md:min-h-[716px]"
      data-home-reveal
    >
      <img
        :src="HOME_BESPOKE_IMAGE"
        alt=""
        class="absolute inset-0 h-full w-full object-cover object-center"
        width="1920"
        height="1080"
        loading="lazy"
        decoding="async"
      />
      <div
        class="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        class="relative z-10 mx-auto w-full max-w-container-max px-6 text-white md:px-12 xl:px-margin-x"
      >
        <div class="max-w-xl">
          <h2 class="home-font-h1 font-serif">
            Une question sur un produit&nbsp;?
          </h2>
          <p
            class="home-font-body-lg mb-10 mt-8 font-sans italic text-white/90"
          >
            Disponibilité, taille, compatibilité, livraison ou paiement à la
            livraison&nbsp;: notre équipe vous répond sur WhatsApp pour tous les
            rayons.
          </p>
          <a
            href="https://wa.me/221770000000"
            target="_blank"
            rel="noopener noreferrer"
            class="home-label-caps inline-flex border border-white px-10 py-5 uppercase tracking-[0.12em] text-white transition-all duration-500 hover:bg-white hover:text-primary"
          >
            Écrire sur WhatsApp
          </a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>
