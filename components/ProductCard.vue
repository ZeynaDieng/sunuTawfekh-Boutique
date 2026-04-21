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
  }>(),
  { variant: "default", compact: false },
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
    : "rounded-sm bg-card text-card-foreground shadow-sm ring-1 ring-border hover:shadow-xl dark:ring-border",
);
</script>

<template>
  <NuxtLink
    :to="`/produit/${product.id}`"
    class="group relative block cursor-pointer overflow-hidden rounded-sm transition-all duration-luxury ease-luxury"
    :class="cardRootClass"
  >
    <div
      class="relative aspect-[4/5] overflow-hidden rounded-sm"
      :class="
        variant === 'dark'
          ? 'bg-white/5 ring-1 ring-white/10'
          : 'bg-muted/30 ring-1 ring-transparent dark:bg-muted/20'
      "
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
        v-if="!product.inStock"
        class="absolute left-4 top-4 border border-border bg-card/95 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-card-foreground shadow-sm backdrop-blur-sm"
        :class="
          compact
            ? 'max-md:left-3 max-md:top-3 max-md:px-2 max-md:py-0.5 max-md:text-[7px] max-md:tracking-[0.15em]'
            : ''
        "
      >
        Sold out
      </span>

      <span
        v-if="product.isNew && product.inStock"
        class="absolute left-4 top-4 rounded-sm bg-primary px-3 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-sm"
        :class="
          compact
            ? 'max-md:left-3 max-md:top-3 max-md:px-2 max-md:py-0.5 max-md:text-[7px] max-md:tracking-[0.12em]'
            : ''
        "
      >
        Nouveau
      </span>

      <button
        type="button"
        class="absolute bottom-6 left-6 right-6 flex translate-y-20 items-center justify-center gap-3 bg-primary py-4 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-2xl transition-transform duration-luxury ease-luxury group-hover:translate-y-0 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
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
        class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-card/95 shadow-sm ring-1 ring-border backdrop-blur-sm transition-all duration-luxury ease-luxury hover:scale-110"
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
                : 'fill-primary text-primary'
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
          class="min-w-0 text-[9px] font-bold uppercase tracking-[0.3em] md:text-[10px]"
          :class="[
            variant === 'dark' ? 'text-white/70' : 'text-primary opacity-70',
            compact ? 'max-md:truncate max-md:text-[8px] max-md:tracking-[0.2em]' : '',
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
        class="line-clamp-1 font-serif text-sm uppercase tracking-wider transition-colors duration-luxury ease-luxury group-hover:text-gold md:text-base"
        :class="
          compact
            ? 'max-md:line-clamp-2 max-md:text-xs max-md:leading-tight md:line-clamp-1'
            : ''
        "
      >
        {{ product.name }}
      </h3>
      <p
        class="text-sm font-bold tracking-tight text-gold md:text-base"
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
