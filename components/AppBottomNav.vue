<script setup lang="ts">
import { Heart, Home, LayoutGrid, ShoppingBag } from "lucide-vue-next";
import { computed } from "vue";

const route = useRoute();
const { totalItems } = useCart();

const tabs = computed(() => [
  {
    to: "/",
    label: "Accueil",
    icon: Home,
    active: route.path === "/",
  },
  {
    to: "/catalogue",
    label: "Boutique",
    icon: LayoutGrid,
    active: route.path.startsWith("/catalogue") || route.path.startsWith("/produit"),
  },
  {
    to: "/wishlist",
    label: "Favoris",
    icon: Heart,
    active: route.path === "/wishlist",
  },
  {
    to: "/panier",
    label: "Panier",
    icon: ShoppingBag,
    active: route.path === "/panier" || route.path === "/checkout",
    badge: totalItems.value > 0 ? totalItems.value : null,
  },
]);
</script>

<template>
  <nav
    class="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)]"
    aria-label="Navigation principale"
  >
    <div class="mx-auto flex max-w-lg items-stretch justify-around gap-1 px-2">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium tracking-wide transition-colors active:scale-[0.98]"
        :class="
          tab.active
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground active:bg-muted/80'
        "
      >
        <div class="relative flex h-6 w-6 items-center justify-center">
          <component
            :is="tab.icon"
            class="h-5 w-5"
            :class="
              tab.active
                ? 'text-primary-foreground stroke-[2.25]'
                : 'stroke-[1.75] text-muted-foreground'
            "
          />
          <span
            v-if="tab.badge != null"
            class="absolute -right-1.5 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-semibold text-primary-foreground"
          >
            {{ tab.badge > 99 ? "99+" : tab.badge }}
          </span>
        </div>
        <span class="truncate">{{ tab.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
