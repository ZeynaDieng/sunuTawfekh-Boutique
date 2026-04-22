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
import { BRAND_NAME, HOME_CATEGORIES } from "~/utils/brand";

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
  <!-- NAVBAR -->
  <nav
    class="fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 bg-background/90 backdrop-blur-md border-b border-border shadow-md"
  >
    <div
      class="mx-auto flex h-20 w-full max-w-container-max items-center justify-between px-4 md:px-12"
    >
      <!-- LEFT -->
      <div class="flex items-center gap-3">
        <button class="lg:hidden" @click="menuOpen = true">
          <Menu class="h-6 w-6 text-primary" />
        </button>

        <NuxtLink to="/" class="font-serif text-lg md:text-2xl text-primary">
          {{ BRAND_NAME }}
        </NuxtLink>
      </div>

      <!-- CENTER -->
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
      <div class="flex items-center gap-3">
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

  <!-- OVERLAY -->
  <Transition name="fade">
    <div
      v-if="menuOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="menuOpen = false"
    ></div>
  </Transition>

  <!-- DRAWER -->
  <Transition name="slide">
    <div
      v-if="menuOpen"
      class="fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs bg-background p-6 shadow-xl lg:hidden font-serif"
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between mb-6">
        <span class="font-semibold text-lg">Menu</span>
        <button @click="menuOpen = false">
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- LINKS -->
      <div class="flex flex-col gap-4">
        <!-- ACCUEIL -->
        <NuxtLink
          to="/"
          @click="menuOpen = false"
          class="transition-colors duration-300"
          :class="
            route.path === '/' ? 'text-gold' : 'text-foreground hover:text-gold'
          "
        >
          Accueil
        </NuxtLink>

        <!-- CATALOGUE -->
        <NuxtLink
          to="/catalogue"
          @click="menuOpen = false"
          class="transition-colors duration-300"
          :class="
            route.path === '/catalogue' && !route.query.cat
              ? 'text-gold'
              : 'text-foreground hover:text-gold'
          "
        >
          Catalogue
        </NuxtLink>

        <!-- CATEGORIES -->
        <NuxtLink
          v-for="cat in HOME_CATEGORIES"
          :key="cat.id"
          :to="`/catalogue?cat=${cat.id}`"
          @click="menuOpen = false"
          class="transition-colors duration-300"
          :class="
            route.query.cat === cat.id
              ? 'text-gold'
              : 'text-foreground hover:text-gold'
          "
        >
          {{ cat.name }}
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
