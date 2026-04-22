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
import { onBeforeUnmount, onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BRAND_NAME, BRAND_TAGLINE, HOME_CATEGORIES } from "~/utils/brand";

const route = useRoute();
const router = useRouter();

const { totalItems, wishlist } = useCart();
const { open: openCart } = useCartDrawer();
const { isDark, toggle: toggleTheme } = useThemeMode();

const menuOpen = ref(false);
const navSearchDraft = ref("");
const isScrolled = ref(false);

const wishlistCount = computed(() => wishlist.value.length);

function submitNavSearch() {
  const term = navSearchDraft.value.trim();
  menuOpen.value = false;
  router.push({ path: "/catalogue", query: term ? { q: term } : {} });
}

const activeCat = computed(() => {
  const q = route.query.cat;
  return typeof q === "string" && q ? q : null;
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
    const onScroll = () => {
      isScrolled.value = window.scrollY > 16;
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
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
    class="safe-nav-top fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300"
    :class="
      isScrolled
        ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-md'
        : 'bg-white dark:bg-black border-border'
    "
  >
    <div
      class="mx-auto flex h-20 w-full max-w-container-max items-center justify-between px-4 md:px-12"
    >
      <!-- LEFT -->
      <div class="flex items-center gap-3">
        <button class="lg:hidden" @click="menuOpen = true">
          <Menu class="h-6 w-6" />
        </button>

        <NuxtLink
          to="/"
          class="font-serif text-lg md:text-2xl transition-colors duration-300"
        >
          {{ BRAND_NAME }}
        </NuxtLink>
      </div>

      <!-- CENTER (desktop) -->
      <div class="hidden lg:flex gap-8 text-sm uppercase tracking-wide">
        <NuxtLink
          v-for="cat in HOME_CATEGORIES"
          :key="cat.id"
          :to="`/catalogue?cat=${cat.id}`"
          :class="isCatActive(cat.id) ? 'text-primary' : 'text-foreground/80'"
        >
          {{ cat.name }}
        </NuxtLink>
      </div>

      <!-- RIGHT -->
      <div class="flex items-center gap-3 text-foreground">
        <button @click="toggleTheme">
          <Sun v-if="isDark" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </button>

        <NuxtLink to="/catalogue">
          <Search class="h-5 w-5" />
        </NuxtLink>

        <NuxtLink to="/wishlist" class="relative">
          <Heart class="h-5 w-5" />
          <span
            v-if="wishlistCount > 0"
            class="absolute -top-1 -right-1 text-xs bg-gold px-1 rounded"
          >
            {{ wishlistCount }}
          </span>
        </NuxtLink>

        <button @click="openCart()" class="relative">
          <ShoppingBag class="h-5 w-5" />
          <span
            v-if="totalItems > 0"
            class="absolute -top-1 -right-1 text-xs bg-primary text-white px-1 rounded"
          >
            {{ totalItems }}
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>
