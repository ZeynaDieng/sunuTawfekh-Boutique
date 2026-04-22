<script setup lang="ts">
import { Heart, ShoppingBag, Star } from "lucide-vue-next";
import type { Product } from "~/utils/data";
import { formatPrice } from "~/utils/data";

const props = withDefaults(
  defineProps<{
    product: Product;
    /** Section « Nouveautés » sur fond sombre (maquette React). */
    variant?: "default" | "dark";
    /** Typo / gouttières réduites sur mobile (ex. carrousel home). */
    compact?: boolean;
    /** Ratio image (maquette « Pièces maîtresses » = 3/4). */
    imageAspect?: "4/5" | "3/4";
    /** Badge « Nouveau » sur la vignette. */
    showNewBadge?: boolean;
    /** Badge « Rupture » lorsque hors stock. */
    showOutOfStockBadge?: boolean;
  }>(),
  {
    variant: "default",
    compact: false,
    imageAspect: "4/5",
    showNewBadge: true,
    showOutOfStockBadge: true,
  },
);

const { addItem, wishlist, toggleWishlist } = useCart();
const { open: openCart } = useCartDrawer();

function isWished(id: string) {
  return wishlist.value.includes(id);
}

function onAddToCart(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  if (!props.product.inStock) return;
  addItem(props.product);
  openCart();
}

const label = computed(() => {
  const m = props.product.filters?.marque?.trim();
  if (m) return m;
  const cats: Record<string, string> = {
    beaute: "Beauté",
    parfums: "Parfums",
    mode: "Mode",
    accessoires: "Accessoires",
    "bien-etre": "Bien-être",
    alimentaire: "Alimentaire",
  };
  return cats[props.product.category] ?? props.product.category;
});

const cardRootClass = computed(() =>
  props.variant === "dark"
    ? "bg-transparent shadow-none ring-0"
    : "rounded-sm bg-card text-card-foreground shadow-sm ring-1 ring-border/70 hover:shadow-2xl dark:ring-border",
);

const aspectClass = computed(() =>
  props.imageAspect === "3/4" ? "aspect-[3/4]" : "aspect-[4/5]",
);
</script>

<template>
  <NuxtLink
    :to="`/produit/${product.id}`"
    class="group relative block cursor-pointer overflow-hidden rounded-sm transition-all duration-luxury ease-luxury"
    :class="cardRootClass"
  >
    <div
      class="relative overflow-hidden rounded-sm"
      :class="[
        aspectClass,
        variant === 'dark'
          ? 'bg-white/5 ring-1 ring-white/10'
          : 'bg-muted/30 ring-1 ring-transparent dark:bg-muted/20',
      ]"
    >
      <ProductImage
        class="absolute inset-0 z-0"
        :src="product.image"
        :alt="product.name"
        :product-name="product.name"
        :placeholder-variant="variant === 'dark' ? 'dark' : 'light'"
        size="lg"
        img-class="transition-transform duration-700 ease-luxury group-hover:scale-105"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-luxury ease-luxury group-hover:opacity-100"
      />

      <span
        v-if="showOutOfStockBadge && !product.inStock"
        class="absolute left-4 top-4 border border-border bg-card/95 px-3 py-1 text-[10px] font-semibold text-card-foreground shadow-sm backdrop-blur-sm"
        :class="
          compact
            ? 'max-md:left-3 max-md:top-3 max-md:px-2 max-md:py-0.5 max-md:text-[9px]'
            : ''
        "
      >
        Rupture
      </span>

      <span
        v-if="showNewBadge && product.isNew && product.inStock"
        class="absolute left-4 top-4 rounded-sm bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground shadow-sm"
        :class="
          compact
            ? 'max-md:left-3 max-md:top-3 max-md:px-2 max-md:py-0.5 max-md:text-[9px]'
            : ''
        "
      >
        Nouveau
      </span>

      <button
        type="button"
        class="luxe-glass absolute bottom-6 left-6 right-6 flex translate-y-24 items-center justify-center gap-3 border border-primary/15 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary opacity-0 shadow-xl transition-all duration-500 ease-luxury group-hover:translate-y-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        :class="
          compact
            ? 'max-md:bottom-4 max-md:left-3 max-md:right-3 max-md:gap-2 max-md:py-3 max-md:text-[9px]'
            : ''
        "
        :disabled="!product.inStock"
        @click="onAddToCart"
      >
        <ShoppingBag class="h-3.5 w-3.5" /> Ajouter au panier
      </button>

      <button
        type="button"
        class="luxe-glass absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all duration-luxury ease-luxury hover:scale-110"
        :class="compact ? 'max-md:right-2 max-md:top-2 max-md:h-8 max-md:w-8' : ''"
        aria-label="Favoris"
        @click.prevent.stop="toggleWishlist(product.id)"
      >
        <Heart
          class="h-4 w-4"
          :class="
            isWished(product.id)
              ? variant === 'dark'
                ? 'fill-gold text-gold'
                : 'fill-secondary text-secondary'
              : 'text-foreground'
          "
        />
      </button>
    </div>

    <div
      class="space-y-2 px-4 pb-4 pt-4"
      :class="[
        variant === 'dark' ? 'text-white' : 'text-card-foreground',
        compact
          ? 'max-md:space-y-1 max-md:px-2 max-md:pb-3 max-md:pt-2'
          : '',
      ]"
    >
      <div class="flex items-start justify-between gap-2">
        <p
          class="min-w-0 text-[10px] font-medium md:text-[11px]"
          :class="[
            variant === 'dark' ? 'text-white/70' : 'text-primary opacity-70',
            compact ? 'max-md:truncate max-md:text-[9px]' : '',
          ]"
        >
          {{ label }}
        </p>
        <div
          class="flex shrink-0 items-center gap-1 text-[10px] font-bold text-gold"
          :class="compact ? 'max-md:gap-0.5 max-md:text-[9px]' : ''"
        >
          <Star
            class="h-2.5 w-2.5 fill-gold text-gold"
            :class="compact ? 'max-md:h-2 max-md:w-2' : ''"
          />
          {{ product.rating }}
        </div>
      </div>
      <h3
        class="luxe-title line-clamp-1 text-base font-semibold capitalize text-foreground transition-colors duration-luxury ease-luxury group-hover:text-secondary md:text-lg"
        :class="
          compact
            ? 'max-md:line-clamp-2 max-md:text-xs max-md:leading-tight md:line-clamp-1'
            : ''
        "
      >
        {{ product.name }}
      </h3>
      <p
        class="text-sm font-semibold tracking-tight text-primary md:text-base"
        :class="compact ? 'max-md:text-xs' : ''"
      >
        {{ formatPrice(product.price) }}
        <span v-if="product.oldPrice" class="ml-2 text-xs font-normal text-muted-foreground line-through">{{
          formatPrice(product.oldPrice)
        }}</span>
      </p>
    </div>
  </NuxtLink>
</template>
