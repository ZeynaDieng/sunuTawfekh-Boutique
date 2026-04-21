<script setup lang="ts">
import {
  ChevronRight,
  Heart,
  Home,
  LayoutGrid,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  X,
} from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { BRAND_NAME, BRAND_TAGLINE, HOME_CATEGORIES } from "~/utils/brand";

const route = useRoute();
const router = useRouter();
const { totalItems, wishlist } = useCart();
const { open: openCart } = useCartDrawer();
const { isDark, toggle: toggleTheme } = useThemeMode();

const menuOpen = ref(false);
const navSearchDraft = ref("");

const wishlistCount = computed(() => wishlist.value.length);

function submitNavSearch() {
  const term = navSearchDraft.value.trim();
  menuOpen.value = false;
  router.push({ path: "/catalogue", query: term ? { q: term } : {} });
}

const activeCat = computed(() => {
  const q = route.query.cat;
  if (typeof q === "string" && q) return q;
  return null;
});

function isCatActive(catId: string) {
  return activeCat.value === catId;
}

watch(menuOpen, (open) => {
  if (!import.meta.client) return;
  document.body.style.overflow = open ? "hidden" : "";
  if (open) {
    const q = route.query.q;
    navSearchDraft.value = typeof q === "string" ? q : "";
  }
});

function onMenuKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && menuOpen.value) {
    menuOpen.value = false;
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("keydown", onMenuKeydown);
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener("keydown", onMenuKeydown);
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <nav
    class="safe-nav-top fixed left-0 right-0 top-0 z-50 w-full max-w-full overflow-x-clip border-b border-white/10 bg-st-black/95 text-white shadow-lg backdrop-blur-md dark:border-border dark:bg-background/90 dark:text-foreground dark:backdrop-blur-xl"
  >
    <!-- Pas de `container` ici : le thème ajoute padding 2rem au container, en plus du px-4 → ligne trop étroite + débordement sur mobile. -->
    <div
      class="relative mx-auto box-border flex h-14 w-full min-w-0 max-w-full items-center justify-between gap-1.5 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:gap-2 sm:pl-4 sm:pr-4 lg:h-16 lg:gap-4 lg:pl-6 lg:pr-6"
    >
      <div class="flex min-w-0 max-w-[100%] items-center gap-1.5 sm:gap-4 lg:max-w-none max-lg:min-w-0 max-lg:flex-1">
        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 hover:text-gold active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:h-11 sm:w-11 dark:text-foreground dark:hover:bg-muted/80 lg:hidden"
          aria-label="Ouvrir le menu"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav-drawer"
          @click="menuOpen = true"
        >
          <Menu class="h-6 w-6" :stroke-width="2" />
        </button>
        <NuxtLink
          to="/"
          class="min-w-0 text-left text-white max-lg:flex-1 max-lg:basis-0 dark:text-foreground"
        >
          <span
            class="block min-w-0 truncate pe-0.5 font-serif text-base uppercase tracking-[0.1em] transition-colors hover:text-gold md:text-xl lg:text-2xl"
          >
            {{ BRAND_NAME }}
            <span class="hidden text-gold sm:inline"> {{ BRAND_TAGLINE }}</span>
          </span>
        </NuxtLink>
      </div>

      <div class="hidden gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white lg:flex dark:text-foreground">
        <NuxtLink
          v-for="cat in HOME_CATEGORIES"
          :key="cat.id"
          :to="`/catalogue?cat=${cat.id}`"
          class="relative py-1 transition-all hover:text-gold dark:hover:text-gold"
          :class="isCatActive(cat.id) ? 'text-gold' : 'text-white/90 dark:text-muted-foreground'"
        >
          {{ cat.name }}
          <span
            v-if="isCatActive(cat.id)"
            class="absolute bottom-0 left-0 h-0.5 w-full bg-gold"
          />
        </NuxtLink>
      </div>

      <div class="flex shrink-0 items-center gap-px sm:gap-1.5 md:gap-3">
        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:h-11 sm:w-11 dark:text-foreground dark:hover:bg-muted/80"
          :aria-label="isDark ? 'Passer en thème clair' : 'Passer en thème sombre'"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" class="h-5 w-5" :stroke-width="2" />
          <Moon v-else class="h-5 w-5" :stroke-width="2" />
        </button>
        <NuxtLink
          to="/catalogue"
          class="flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-gold sm:h-11 sm:w-11 dark:text-foreground"
          aria-label="Recherche et catalogue"
        >
          <Search class="h-5 w-5" />
        </NuxtLink>
        <NuxtLink
          to="/wishlist"
          class="relative flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-gold sm:h-11 sm:w-11 dark:text-foreground"
          aria-label="Favoris"
        >
          <Heart class="h-5 w-5" />
          <span
            v-if="wishlistCount > 0"
            class="absolute -right-0.5 top-0.5 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full border border-white/20 bg-gold px-0.5 text-[7px] font-black leading-none text-st-black sm:-right-0.5 sm:-top-0.5 sm:h-4 sm:min-w-[1rem] sm:text-[8px]"
          >
            {{ wishlistCount > 99 ? "99+" : wishlistCount }}
          </span>
        </NuxtLink>
        <button
          type="button"
          class="relative flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-gold sm:h-11 sm:w-11 dark:text-foreground"
          aria-label="Panier"
          @click="openCart()"
        >
          <ShoppingBag class="h-5 w-5" />
          <span
            v-if="totalItems > 0"
            class="absolute -right-0.5 top-0.5 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full border border-white/20 bg-primary text-[8px] font-black leading-none text-primary-foreground sm:-right-1 sm:-top-1.5 sm:h-4 sm:w-4 sm:text-[9px]"
          >
            {{ totalItems }}
          </span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hors de la barre (sans backdrop-blur parent) : évite la transparence / superposition avec la page. -->
  <ClientOnly>
    <Teleport to="body">
      <div
        class="fixed inset-0 z-[180] flex lg:hidden"
        :class="menuOpen ? 'pointer-events-auto' : 'pointer-events-none'"
      >
        <div
          class="absolute inset-0 bg-st-black transition-opacity duration-300 ease-out"
          :class="menuOpen ? 'opacity-[0.92]' : 'opacity-0'"
          aria-hidden="true"
          @click="menuOpen = false"
        />
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          tabindex="-1"
          class="relative z-10 isolate flex min-h-[100dvh] w-full flex-col bg-card text-card-foreground shadow-2xl transition-transform duration-300 ease-out [backface-visibility:hidden]"
          :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
        >
          <header
            class="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))]"
          >
            <div class="min-w-0">
              <p class="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">Menu</p>
              <p class="mt-0.5 truncate font-serif text-lg uppercase tracking-[0.14em] text-primary">
                {{ BRAND_NAME }}
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                :aria-label="isDark ? 'Thème clair' : 'Thème sombre'"
                @click="toggleTheme"
              >
                <Sun v-if="isDark" class="h-5 w-5" :stroke-width="2" />
                <Moon v-else class="h-5 w-5" :stroke-width="2" />
              </button>
              <button
                type="button"
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Fermer le menu"
                @click="menuOpen = false"
              >
                <X class="h-5 w-5" :stroke-width="2" />
              </button>
            </div>
          </header>

          <div
            class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain bg-card"
          >
            <form
              class="border-b border-border bg-card px-4 py-3"
              @submit.prevent="submitNavSearch"
            >
              <label class="sr-only" for="nav-drawer-search">Rechercher</label>
              <div
                class="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              >
                <Search class="h-4 w-4 shrink-0 text-primary" :stroke-width="2" aria-hidden="true" />
                <input
                  id="nav-drawer-search"
                  v-model="navSearchDraft"
                  type="search"
                  autocomplete="off"
                  placeholder="Rechercher…"
                  class="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  type="submit"
                  class="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white"
                >
                  OK
                </button>
              </div>
            </form>

            <nav class="px-2 py-3" aria-label="Raccourcis">
              <ul
                class="divide-y divide-border overflow-hidden rounded-xl border border-border bg-muted/40"
              >
                <li>
                  <NuxtLink
                    to="/"
                    class="flex items-center gap-3 bg-muted/40 px-4 py-3.5 text-sm font-medium text-foreground active:bg-background"
                    @click="menuOpen = false"
                  >
                    <Home class="h-5 w-5 shrink-0 text-primary" :stroke-width="1.75" />
                    <span class="uppercase tracking-[0.12em]">Accueil</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/catalogue"
                    class="flex items-center gap-3 bg-muted/40 px-4 py-3.5 text-sm font-medium text-foreground active:bg-background"
                    @click="menuOpen = false"
                  >
                    <LayoutGrid class="h-5 w-5 shrink-0 text-primary" :stroke-width="1.75" />
                    <span class="uppercase tracking-[0.12em]">Boutique</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/wishlist"
                    class="flex items-center gap-3 bg-muted/40 px-4 py-3.5 text-sm font-medium text-foreground active:bg-background"
                    @click="menuOpen = false"
                  >
                    <Heart class="h-5 w-5 shrink-0 text-primary" :stroke-width="1.75" />
                    <span class="uppercase tracking-[0.12em]">Favoris</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/panier"
                    class="relative flex items-center gap-3 bg-muted/40 px-4 py-3.5 text-sm font-medium text-foreground active:bg-background"
                    @click="menuOpen = false"
                  >
                    <ShoppingBag class="h-5 w-5 shrink-0 text-primary" :stroke-width="1.75" />
                    <span class="uppercase tracking-[0.12em]">Panier</span>
                    <span
                      v-if="totalItems > 0"
                      class="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white"
                    >
                      {{ totalItems > 99 ? "99+" : totalItems }}
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </nav>

            <nav class="bg-card px-4 pb-4 pt-2" aria-label="Collections">
              <p class="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Collections
              </p>
              <ul class="space-y-0.5">
                <li v-for="cat in HOME_CATEGORIES" :key="cat.id">
                  <NuxtLink
                    :to="`/catalogue?cat=${cat.id}`"
                    class="group flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors"
                    :class="
                      isCatActive(cat.id)
                        ? 'bg-muted text-primary ring-1 ring-inset ring-border'
                        : 'text-foreground hover:bg-muted/60'
                    "
                    @click="menuOpen = false"
                  >
                    <span class="text-base" aria-hidden="true">{{ cat.icon }}</span>
                    <span class="min-w-0 flex-1 text-[13px] font-semibold uppercase tracking-[0.08em]">
                      {{ cat.name }}
                    </span>
                    <ChevronRight
                      class="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      :class="isCatActive(cat.id) ? 'text-gold' : ''"
                      :stroke-width="2"
                    />
                  </NuxtLink>
                </li>
              </ul>
              <NuxtLink
                to="/catalogue"
                class="mt-3 flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-primary transition-colors hover:border-primary hover:bg-background"
                @click="menuOpen = false"
              >
                <Search class="h-4 w-4 shrink-0" :stroke-width="2" />
                Tout le catalogue
              </NuxtLink>
            </nav>
          </div>

          <footer
            class="shrink-0 border-t border-border bg-muted/30 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            <p class="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Suivez-nous
            </p>
            <div class="flex justify-center gap-6 text-xs font-semibold text-primary">
              <span class="cursor-pointer underline-offset-4 hover:underline">Instagram</span>
              <span class="cursor-pointer underline-offset-4 hover:underline">TikTok</span>
            </div>
          </footer>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>
