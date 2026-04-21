<script setup lang="ts">
import { ArrowLeft, ChevronDown, Heart, MessageCircle, ShoppingBag, Star } from "lucide-vue-next";
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { Product } from "~/utils/data";
import { formatPrice } from "~/utils/data";

/** Largeur viewport Tailwind `lg` — carrousel swipe uniquement en dessous. */
const LG_PX = 1024;

const route = useRoute();

const { data, error } = await useFetch(() => `/api/catalog/products/${route.params.id as string}`, {
  watch: [() => route.params.id],
});

const product = computed(() => data.value?.product);
const showDemoBanner = computed(() => !!data.value?.demoMode);

const { addItem, wishlist, toggleWishlist } = useCart();
const { open: openCart } = useCartDrawer();
const selectedImage = ref(0);

const allImages = computed(() => {
  const p = product.value;
  if (!p) return [];
  return [p.image, ...(p.images || [])].filter((u) => typeof u === "string" && u.trim().length > 0);
});

const mainImageSrc = computed(() => allImages.value[selectedImage.value] ?? "");

const mobileGalleryRef = ref<HTMLElement | null>(null);
let mobileGalleryScrollRaf = 0;

function isMobileGalleryActive() {
  if (!import.meta.client) return false;
  return window.innerWidth < LG_PX;
}

function scrollMobileGalleryToIndex(i: number, behavior: ScrollBehavior = "smooth") {
  const el = mobileGalleryRef.value;
  if (!el || !isMobileGalleryActive()) return;
  const w = el.clientWidth;
  if (w <= 0) return;
  const max = Math.max(0, allImages.value.length - 1);
  const idx = Math.max(0, Math.min(i, max));
  el.scrollTo({ left: idx * w, behavior });
}

function onSelectGalleryImage(i: number) {
  selectedImage.value = i;
  nextTick(() => scrollMobileGalleryToIndex(i, "smooth"));
}

function onMobileGalleryScroll() {
  if (mobileGalleryScrollRaf) cancelAnimationFrame(mobileGalleryScrollRaf);
  mobileGalleryScrollRaf = requestAnimationFrame(() => {
    mobileGalleryScrollRaf = 0;
    const el = mobileGalleryRef.value;
    if (!el || !isMobileGalleryActive()) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const idx = Math.round(el.scrollLeft / w);
    const max = Math.max(0, allImages.value.length - 1);
    const clamped = Math.max(0, Math.min(idx, max));
    if (clamped !== selectedImage.value) {
      selectedImage.value = clamped;
    }
  });
}

function resetMobileGalleryScroll() {
  nextTick(() => {
    mobileGalleryRef.value?.scrollTo({ left: 0, behavior: "auto" });
  });
}

onBeforeUnmount(() => {
  if (mobileGalleryScrollRaf) cancelAnimationFrame(mobileGalleryScrollRaf);
});

const { data: similarData } = await useAsyncData(
  () => `similar-${route.params.id as string}`,
  async () => {
    const p = data.value?.product;
    if (!p) return { items: [] as Product[] };
    return await $fetch<{ items: Product[] }>("/api/catalog/products", {
      query: { cat: p.category, limit: 12, page: 1 },
    });
  },
  { watch: [data, () => route.params.id] },
);

const similar = computed(() => {
  const p = product.value;
  if (!p) return [];
  return (similarData.value?.items ?? []).filter((x) => x.id !== p.id).slice(0, 4);
});

const isWished = computed(() => product.value && wishlist.value.includes(product.value.id));

const whatsappMsg = computed(() => {
  const p = product.value;
  if (!p) return "";
  return encodeURIComponent(`Bonjour Sunu Tawfekh, je souhaite commander : ${p.name}`);
});

const categoryLabel = computed(() => {
  const p = product.value;
  if (!p) return "";
  const id = p.category.toLowerCase();
  const map: Record<string, string> = {
    beaute: "Beauté",
    parfums: "Parfums",
    mode: "Mode",
    accessoires: "Accessoires",
    "bien-etre": "Bien-être",
    alimentaire: "Alimentaire",
  };
  return map[id] ?? p.category;
});

const showBioBadge = computed(() => {
  const f = product.value?.filters;
  if (!f) return false;
  const v = String(f.bio ?? f.ingredients ?? "").toLowerCase();
  return v.includes("bio") || v === "oui";
});

watch(
  () => route.params.id,
  () => {
    selectedImage.value = 0;
    resetMobileGalleryScroll();
  },
);

watch(product, () => {
  selectedImage.value = 0;
  resetMobileGalleryScroll();
});

function onAddToCart() {
  const p = product.value;
  if (!p || !p.inStock) return;
  addItem(p);
  openCart();
}

useSeoMeta({
  title: () => (product.value ? `${product.value.name} — Sunu Tawfekh` : "Produit — Sunu Tawfekh"),
  description: () =>
    product.value?.description
      ? String(product.value.description).slice(0, 160)
      : "Découvrez nos produits premium.",
  ogTitle: () => (product.value ? product.value.name : "Sunu Tawfekh"),
});
</script>

<template>
  <div v-if="error || !product" class="flex min-h-screen items-center justify-center bg-background text-foreground">
    <p class="text-sm text-muted-foreground">Produit introuvable.</p>
  </div>
  <div v-else class="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
    <Navbar />
    <CatalogDemoBanner :show="showDemoBanner" />
    <div class="pt-with-fixed-nav pb-12 lg:pb-12 max-lg:pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <NuxtLink
          to="/catalogue"
          class="mb-6 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary md:mb-10 lg:mb-12"
        >
          <ArrowLeft class="h-4 w-4 shrink-0" /> Retour à la boutique
        </NuxtLink>

        <div class="grid grid-cols-1 gap-8 md:gap-20 lg:grid-cols-12">
          <div class="max-lg:-mx-4 space-y-3 md:mx-0 md:space-y-6 lg:col-span-7">
            <!-- Mobile / tablette : carrousel swipe (scroll-snap) -->
            <div
              v-if="allImages.length > 0"
              ref="mobileGalleryRef"
              class="home-product-scroll flex aspect-[4/5] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain lg:hidden"
              role="region"
              aria-roledescription="carousel"
              :aria-label="`Photos de ${product.name}`"
              @scroll.passive="onMobileGalleryScroll"
            >
              <div
                v-for="(img, i) in allImages"
                :key="`slide-${i}-${img}`"
                class="w-full shrink-0 snap-start snap-always"
                role="group"
                :aria-roledescription="`Photo ${i + 1} sur ${allImages.length}`"
                :aria-hidden="i !== selectedImage"
              >
                <div class="group relative aspect-[4/5] w-full overflow-hidden bg-muted/40">
                  <ProductImage
                    class="absolute inset-0"
                    :src="img"
                    :alt="i === 0 ? product.name : ''"
                    :product-name="product.name"
                    size="lg"
                    img-class="pointer-events-none transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            <!-- lg+ : image active seule -->
            <div
              class="group relative hidden aspect-[4/5] overflow-hidden bg-muted/40 md:rounded-sm md:border md:border-border lg:block"
            >
              <ProductImage
                class="absolute inset-0"
                :src="mainImageSrc"
                :alt="product.name"
                :product-name="product.name"
                size="lg"
                img-class="transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            <div
              v-if="allImages.length > 1"
              class="home-product-scroll flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0"
            >
              <button
                v-for="(img, i) in allImages"
                :key="i"
                type="button"
                class="relative aspect-square w-[4.25rem] shrink-0 snap-start overflow-hidden rounded-md border border-border opacity-70 ring-offset-2 ring-offset-background transition-all active:scale-[0.98] md:min-w-0 md:w-auto md:rounded-sm md:opacity-60 md:ring-offset-0 md:hover:border-gold md:hover:opacity-100"
                :class="i === selectedImage ? 'border-gold opacity-100 ring-2 ring-gold/50 md:ring-0' : ''"
                :aria-current="i === selectedImage ? 'true' : undefined"
                @click="onSelectGalleryImage(i)"
              >
                <ProductImage
                  class="absolute inset-0"
                  :src="img"
                  alt=""
                  :product-name="product.name"
                  size="sm"
                />
              </button>
            </div>
          </div>

          <div class="space-y-6 max-lg:px-0 md:space-y-10 lg:col-span-5">
            <div class="space-y-3 md:space-y-4">
              <div class="flex flex-wrap items-center gap-2 md:gap-3">
                <span
                  class="rounded-full bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary"
                >
                  {{ categoryLabel }}
                </span>
                <span
                  v-if="showBioBadge"
                  class="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold text-gold"
                >
                  Naturel &amp; Bio
                </span>
              </div>
              <h1
                class="text-balance font-serif text-2xl font-normal leading-[1.15] tracking-tight text-foreground sm:text-[1.65rem] md:text-4xl lg:text-5xl"
              >
                {{ product.name }}
              </h1>
              <p class="text-xl font-bold tracking-tighter text-gold md:text-3xl">
                {{ formatPrice(product.price) }}
                <span v-if="product.oldPrice" class="ml-2 text-base font-normal text-muted-foreground line-through md:text-lg">{{
                  formatPrice(product.oldPrice)
                }}</span>
              </p>
              <div class="flex flex-wrap items-center gap-2 text-gold">
                <Star class="h-4 w-4 shrink-0 fill-gold text-gold" />
                <span class="text-sm font-bold">{{ product.rating }}</span>
                <span class="text-sm text-muted-foreground">({{ product.reviews }} avis)</span>
              </div>
            </div>

            <p
              class="border-l-2 border-primary py-1 pl-4 text-sm font-light leading-relaxed text-muted-foreground md:py-2 md:pl-6 md:text-base"
            >
              {{ product.description }}
            </p>

            <!-- À partir de lg : CTA dans le flux (mobile → barre fixe en bas) -->
            <div class="hidden gap-3 lg:flex lg:flex-row lg:gap-4">
              <button
                type="button"
                class="flex min-h-12 flex-1 items-center justify-center gap-3 rounded-sm bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-xl transition-all hover:bg-foreground hover:text-background active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground md:py-5"
                :disabled="!product.inStock"
                @click="onAddToCart"
              >
                <ShoppingBag class="h-5 w-5 shrink-0" /> Ajouter au panier
              </button>
              <button
                type="button"
                class="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-sm border border-border bg-card px-5 transition-all hover:border-gold hover:text-gold md:min-w-14"
                aria-label="Favoris"
                @click="toggleWishlist(product.id)"
              >
                <Heart class="h-5 w-5 transition-colors" :class="isWished ? 'fill-gold text-gold' : ''" />
              </button>
            </div>

            <a
              :href="`https://wa.me/221770000000?text=${whatsappMsg}`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex min-h-12 w-full items-center justify-center gap-3 rounded-sm bg-[#25D366] px-4 py-4 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.99] hover:opacity-90 md:py-5"
            >
              <MessageCircle class="h-5 w-5 shrink-0" /> WhatsApp
            </a>

            <div class="space-y-4 border-t border-border pt-6 md:space-y-6 md:pt-10">
              <details class="group rounded-lg border border-border bg-card/30 md:border-0 md:bg-transparent" open>
                <summary
                  class="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-sm font-semibold text-primary md:min-h-0 md:px-0 md:py-0 [&::-webkit-details-marker]:hidden"
                >
                  L’engagement Sunu Tawfekh
                  <ChevronDown class="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p class="px-3 pb-3 pt-0 text-xs font-light leading-relaxed text-muted-foreground md:px-0 md:pb-0 md:pt-6 md:text-sm">
                  Nous garantissons l’authenticité de chaque article. Notre boutique sélectionne uniquement des produits
                  qui apportent satisfaction (Tawfekh) et bien-être à nos clients.
                </p>
              </details>

              <div v-if="Object.keys(product.filters).length > 0" class="space-y-3">
                <h3 class="text-sm font-semibold text-primary">Caractéristiques</h3>
                <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">
                  <div
                    v-for="(val, key) in product.filters"
                    :key="key"
                    class="rounded-md border border-border/80 bg-muted/20 px-3 py-2.5 text-sm sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
                  >
                    <dt class="text-xs text-muted-foreground capitalize md:text-sm">{{ key }}</dt>
                    <dd class="font-medium text-foreground">{{ val }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div v-if="similar.length > 0" class="mt-14 md:mt-24">
          <h2 class="mb-5 font-serif text-xl text-primary md:mb-6 md:text-3xl">
            À découvrir aussi
          </h2>
          <div class="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-8 sm:gap-y-12 xl:grid-cols-4">
            <ProductCard v-for="p in similar" :key="p.id" :product="p" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile : barre d’action fixe (panier + favoris), zone sûre iOS -->
    <div
      class="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-card/85 lg:hidden dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
      style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0px))"
    >
      <div class="mx-auto flex max-w-7xl gap-3">
        <button
          type="button"
          class="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-sm bg-primary text-sm font-semibold text-primary-foreground shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          :disabled="!product.inStock"
          @click="onAddToCart"
        >
          <ShoppingBag class="h-5 w-5 shrink-0" />
          {{ product.inStock ? "Ajouter" : "Rupture" }}
        </button>
        <button
          type="button"
          class="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-sm border border-border bg-background text-foreground transition-colors active:scale-[0.98] hover:border-gold"
          aria-label="Favoris"
          @click="toggleWishlist(product.id)"
        >
          <Heart class="h-5 w-5 transition-colors" :class="isWished ? 'fill-gold text-gold' : ''" />
        </button>
      </div>
    </div>
    <div class="max-lg:pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
      <Footer />
    </div>
  </div>
</template>
