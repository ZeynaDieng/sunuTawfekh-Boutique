<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { CatalogFilterChip } from "~/components/catalog/CatalogFilterChips.vue";
import type { CatalogFacetsResponse } from "~/composables/useCatalog";
import { formatPrice } from "~/utils/data";
import { Filter, Search, X } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const PRICE_MAX = 500000;
const PRICE_DEBOUNCE_MS = 320;

const activeCat = computed(() => (route.query.cat as string) || "");

/** Recherche texte (URL `?q=`) — filtrée côté API sur nom, description, marque, etc. */
const searchQuery = computed(() => {
  const q = route.query.q;
  return typeof q === "string" ? q.trim() : "";
});

const searchDraft = ref("");
watch(
  () => route.query.q,
  (q) => {
    searchDraft.value = typeof q === "string" ? q : "";
  },
  { immediate: true },
);

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
function commitSearchToRoute() {
  searchDebounceTimer = null;
  const next = { ...route.query } as Record<string, string>;
  const t = searchDraft.value.trim();
  if (t) next.q = t;
  else delete next.q;
  router.replace({ path: "/catalogue", query: next });
  page.value = 1;
}
function onSearchInput() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(commitSearchToRoute, 320);
}
function clearSearchField() {
  searchDraft.value = "";
  commitSearchToRoute();
}

const activeFilters = ref<Record<string, string[]>>({});
const stockOnly = ref(false);
const newOnly = ref(false);
const promoOnly = ref(false);
const priceRange = ref<[number, number]>([0, PRICE_MAX]);
const priceQuery = ref<[number, number]>([0, PRICE_MAX]);
const page = ref(1);
const filtersOpen = ref(false);
const drawerPanelRef = ref<HTMLElement | null>(null);

let priceDebounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  priceRange,
  (v) => {
    if (priceDebounceTimer) clearTimeout(priceDebounceTimer);
    priceDebounceTimer = setTimeout(() => {
      priceQuery.value = [v[0], v[1]];
      priceDebounceTimer = null;
    }, PRICE_DEBOUNCE_MS);
  },
  { deep: true },
);

/** Curseur seul côté UI : garde min à 0 (aligné maquette React). */
watch(
  priceRange,
  (v) => {
    if (v[0] !== 0) {
      priceRange.value = [0, v[1]];
    }
  },
  { deep: true },
);

const { data: catRes } = useCatalogCategories();
const categories = computed(() => catRes.value?.categories ?? []);

const { data: facetRes } = useFetch<CatalogFacetsResponse>("/api/catalog/facets", {
  query: computed(() => (activeCat.value ? { cat: activeCat.value } : {})),
  watch: [activeCat],
});

const categoryFilters = computed(() => facetRes.value?.facets ?? []);

watch(
  [activeCat, searchQuery, stockOnly, newOnly, promoOnly, priceQuery, activeFilters],
  () => {
    page.value = 1;
  },
  { deep: true },
);

const listQuery = computed(() => {
  const filtersJson =
    Object.keys(activeFilters.value).length > 0 ? JSON.stringify(activeFilters.value) : undefined;
  return {
    cat: activeCat.value || undefined,
    q: searchQuery.value || undefined,
    page: page.value,
    limit: config.public.catalogPageSize,
    stockOnly: stockOnly.value ? "true" : undefined,
    newOnly: newOnly.value ? "true" : undefined,
    promoOnly: promoOnly.value ? "true" : undefined,
    priceMin: priceQuery.value[0],
    priceMax: priceQuery.value[1],
    filters: filtersJson,
  };
});

const { data: catalogData, pending } = useFetch("/api/catalog/products", {
  query: listQuery,
  watch: [listQuery],
});

const filtered = computed(() => catalogData.value?.items ?? []);
const totalCount = computed(() => catalogData.value?.total ?? 0);
const pageSize = computed(() => catalogData.value?.pageSize ?? Number(config.public.catalogPageSize));
const showDemoBanner = computed(() => !!catalogData.value?.demoMode);
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)));

function setCat(catId: string | undefined) {
  page.value = 1;
  const next: Record<string, string> = {};
  if (searchQuery.value) next.q = searchQuery.value;
  if (catId) next.cat = catId;
  router.replace({ path: "/catalogue", query: next });
  activeFilters.value = {};
}

function toggleFilter(key: string, value: string) {
  const prev = activeFilters.value;
  const current = prev[key] || [];
  const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  if (updated.length === 0) {
    const { [key]: _, ...rest } = prev;
    activeFilters.value = rest;
  } else {
    activeFilters.value = { ...prev, [key]: updated };
  }
}

const activeCount = computed(() => {
  return (
    Object.values(activeFilters.value).flat().length +
    (stockOnly.value ? 1 : 0) +
    (newOnly.value ? 1 : 0) +
    (promoOnly.value ? 1 : 0) +
    (activeCat.value ? 1 : 0) +
    (searchQuery.value ? 1 : 0) +
    (priceRange.value[1] < PRICE_MAX || priceRange.value[0] > 0 ? 1 : 0)
  );
});

const filterChips = computed<CatalogFilterChip[]>(() => {
  const chips: CatalogFilterChip[] = [];
  if (searchQuery.value) {
    chips.push({ kind: "search", label: searchQuery.value });
  }
  if (activeCat.value) {
    const name = categories.value.find((c) => c.id === activeCat.value)?.name;
    if (name) chips.push({ kind: "category", label: name });
  }
  if (stockOnly.value) chips.push({ kind: "stock" });
  if (newOnly.value) chips.push({ kind: "new" });
  if (promoOnly.value) chips.push({ kind: "promo" });
  if (priceRange.value[0] > 0 || priceRange.value[1] < PRICE_MAX) {
    chips.push({
      kind: "price",
      label: `${formatPrice(priceRange.value[0])} – ${formatPrice(priceRange.value[1])}`,
    });
  }
  for (const f of categoryFilters.value) {
    const vals = activeFilters.value[f.key] || [];
    for (const v of vals) {
      chips.push({ kind: "facet", key: f.key, value: v, label: `${f.label}: ${v}` });
    }
  }
  return chips;
});

function removeChip(chip: CatalogFilterChip) {
  switch (chip.kind) {
    case "stock":
      stockOnly.value = false;
      break;
    case "new":
      newOnly.value = false;
      break;
    case "promo":
      promoOnly.value = false;
      break;
    case "price":
      priceRange.value = [0, PRICE_MAX];
      priceQuery.value = [0, PRICE_MAX];
      break;
    case "category":
      setCat(undefined);
      break;
    case "search": {
      searchDraft.value = "";
      const next = { ...route.query } as Record<string, string>;
      delete next.q;
      router.replace({ path: "/catalogue", query: next });
      break;
    }
    case "facet":
      toggleFilter(chip.key, chip.value);
      break;
  }
}

function resetFilters() {
  activeFilters.value = {};
  stockOnly.value = false;
  newOnly.value = false;
  promoOnly.value = false;
  priceRange.value = [0, PRICE_MAX];
  priceQuery.value = [0, PRICE_MAX];
  searchDraft.value = "";
  page.value = 1;
  const next: Record<string, string> = {};
  if (activeCat.value) next.cat = activeCat.value;
  router.replace({ path: "/catalogue", query: next });
}

watch(filtersOpen, async (open) => {
  if (open) {
    document.body.style.overflow = "hidden";
    await nextTick();
    drawerPanelRef.value?.focus();
  } else {
    document.body.style.overflow = "";
  }
});

function onGlobalKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && filtersOpen.value) {
    filtersOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener("keydown", onGlobalKeydown);
  if (priceRange.value[0] !== 0) {
    priceRange.value = [0, priceRange.value[1]];
  }
});

onBeforeUnmount(() => {
  if (priceDebounceTimer) clearTimeout(priceDebounceTimer);
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onGlobalKeydown);
});

function closeFiltersDrawer() {
  filtersOpen.value = false;
}

const categoryTitle = computed(() =>
  activeCat.value ? categories.value.find((c) => c.id === activeCat.value)?.name || "Le catalogue" : "Le catalogue",
);

useSeoMeta({
  title: () => `${categoryTitle.value} — Sunu Tawfekh`,
  description: "Collection premium : beauté, parfums, mode et bien-être à Dakar.",
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
    <Navbar />
    <CatalogDemoBanner :show="showDemoBanner" />
    <div class="pt-with-fixed-nav pb-12">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <!-- En-tête maquette React -->
        <div class="mb-12 flex flex-col gap-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="min-w-0">
              <h1 class="text-balance font-serif text-2xl uppercase tracking-[0.1em] text-primary md:text-4xl">
                {{ categoryTitle }}
              </h1>
              <div class="mt-2 flex items-center gap-2">
                <span class="h-0.5 w-8 bg-gold" aria-hidden="true" />
                <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <template v-if="pending">Chargement…</template>
                  <template v-else>{{ totalCount }} article{{ totalCount !== 1 ? "s" : "" }} sélectionné{{ totalCount !== 1 ? "s" : "" }}</template>
                </span>
              </div>
            </div>
            <button
              type="button"
              class="flex items-center gap-2 border border-border bg-card p-3 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-primary hover:text-primary-foreground lg:hidden"
              aria-haspopup="dialog"
              :aria-expanded="filtersOpen"
              @click="filtersOpen = true"
            >
              <Filter class="h-4 w-4 shrink-0" aria-hidden="true" />
              Filtres
            </button>
          </div>

          <div class="relative w-full max-w-xl">
            <label class="sr-only" for="catalogue-search">Rechercher un produit</label>
            <Search
              class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70"
              aria-hidden="true"
            />
            <input
              id="catalogue-search"
              v-model="searchDraft"
              type="search"
              name="q"
              autocomplete="off"
              placeholder="Rechercher par nom, marque…"
              class="w-full rounded-sm border border-border bg-muted/50 py-3.5 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none ring-primary/20 transition-shadow focus:border-primary focus:ring-2"
              @input="onSearchInput"
            />
            <button
              v-if="searchDraft.trim()"
              type="button"
              class="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              aria-label="Effacer la recherche"
              @click="clearSearchField"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-12 lg:flex-row">
          <aside
            class="catalog-filters-scroll hidden w-64 shrink-0 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1 lg:sticky lg:top-32 [scrollbar-gutter:stable]"
          >
            <div class="mb-6 hidden items-center justify-between lg:flex">
              <h2 class="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground">
                Filtres
              </h2>
              <button
                v-if="activeCount > 0"
                type="button"
                class="shrink-0 text-[11px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                @click="resetFilters"
              >
                Réinitialiser
              </button>
            </div>
            <CatalogFiltersPanel
              v-model:stock-only="stockOnly"
              v-model:new-only="newOnly"
              v-model:promo-only="promoOnly"
              v-model:price-range="priceRange"
              variant="default"
              :categories="categories"
              :category-filters="categoryFilters"
              :active-cat="activeCat"
              :price-max="PRICE_MAX"
              :active-filters="activeFilters"
              @set-cat="setCat"
              @toggle-filter="toggleFilter"
            />
          </aside>

          <main class="min-w-0 flex-1">
            <CatalogFilterChips :chips="filterChips" @remove="removeChip" />

            <div
              class="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:gap-x-8 md:gap-y-12 xl:grid-cols-3"
              :aria-busy="pending"
              aria-live="polite"
            >
              <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
            </div>

            <div
              v-if="!pending && filtered.length === 0"
              class="space-y-6 rounded-sm bg-muted/40 py-32 text-center"
            >
              <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm">
                <Search class="h-6 w-6 text-muted-foreground" />
              </div>
              <p class="text-sm font-light italic text-muted-foreground">
                <template v-if="searchQuery">
                  Aucun résultat pour « {{ searchQuery }} ». Essayez d’autres mots ou élargissez les filtres.
                </template>
                <template v-else>Aucun produit ne correspond à ces critères.</template>
              </p>
              <button
                type="button"
                class="border border-primary px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-white"
                @click="resetFilters"
              >
                Réinitialiser les filtres
              </button>
            </div>

            <div v-if="totalPages > 1" class="mt-14 flex items-center justify-center gap-4">
              <button
                type="button"
                class="rounded-sm border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                :disabled="page <= 1"
                @click="page--"
              >
                Précédent
              </button>
              <span class="text-xs text-muted-foreground">Page {{ page }} / {{ totalPages }}</span>
              <button
                type="button"
                class="rounded-sm border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                :disabled="page >= totalPages"
                @click="page++"
              >
                Suivant
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>

    <ClientOnly>
      <Teleport to="body">
        <Transition name="catalog-sheet">
          <div
            v-if="filtersOpen"
            class="fixed inset-0 z-[120] flex lg:hidden"
            role="presentation"
          >
            <div
              class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              @click="closeFiltersDrawer"
            />
            <div
              ref="drawerPanelRef"
              tabindex="-1"
              role="dialog"
              aria-modal="true"
              aria-labelledby="catalog-filters-drawer-title"
              class="catalog-sheet-panel absolute bottom-0 left-0 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[2.5rem] bg-card text-card-foreground outline-none"
              @click.stop
            >
              <div class="flex shrink-0 items-center justify-between p-8 pb-4">
                <h2 id="catalog-filters-drawer-title" class="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  Affiner
                </h2>
                <button
                  type="button"
                  class="rounded-full bg-muted p-2 text-foreground"
                  aria-label="Fermer"
                  @click="closeFiltersDrawer"
                >
                  <X class="h-[18px] w-[18px]" />
                </button>
              </div>
              <div class="catalog-filters-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-8 pb-4">
                <CatalogFiltersPanel
                  v-model:stock-only="stockOnly"
                  v-model:new-only="newOnly"
                  v-model:promo-only="promoOnly"
                  v-model:price-range="priceRange"
                  variant="drawer"
                  :categories="categories"
                  :category-filters="categoryFilters"
                  :active-cat="activeCat"
                  :price-max="PRICE_MAX"
                  :active-filters="activeFilters"
                  @set-cat="setCat"
                  @toggle-filter="toggleFilter"
                />
              </div>
              <div class="shrink-0 p-8 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  class="w-full rounded-sm bg-st-black py-5 text-[10px] font-bold uppercase tracking-widest text-white shadow-2xl"
                  @click="closeFiltersDrawer"
                >
                  Voir les résultats
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>

    <Footer />
  </div>
</template>

<style scoped>
.catalog-filters-scroll {
  scrollbar-width: thin;
  scrollbar-color: #eaeaea transparent;
}
.catalog-filters-scroll::-webkit-scrollbar {
  width: 4px;
}
.catalog-filters-scroll::-webkit-scrollbar-track {
  background: #f8f8f8;
}
.catalog-filters-scroll::-webkit-scrollbar-thumb {
  background: #3f3c8c;
}

@media (prefers-reduced-motion: no-preference) {
  .catalog-sheet-enter-active,
  .catalog-sheet-leave-active {
    transition: opacity 0.22s ease;
  }
  .catalog-sheet-enter-active .catalog-sheet-panel,
  .catalog-sheet-leave-active .catalog-sheet-panel {
    transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
  }
  .catalog-sheet-enter-from,
  .catalog-sheet-leave-to {
    opacity: 0;
  }
  .catalog-sheet-enter-from .catalog-sheet-panel,
  .catalog-sheet-leave-to .catalog-sheet-panel {
    transform: translateY(100%);
  }
}
</style>
