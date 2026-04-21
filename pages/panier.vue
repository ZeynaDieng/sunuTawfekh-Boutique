<script setup lang="ts">
import { ArrowLeft, ArrowRight, ChevronRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { formatPrice } from "~/utils/data";

const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
const { close: closeCartDrawer } = useCartDrawer();

onMounted(() => {
  closeCartDrawer();
});

const { data: catalogData } = await useFetch("/api/catalog/products", {
  query: { page: 1, limit: 1 },
  key: "panier-demo-flag",
});

const showDemoBanner = computed(() => !!catalogData.value?.demoMode);

useSeoMeta({
  title: "Panier — Sunu Tawfekh",
  description: "Votre sélection Sunu Tawfekh : validez ou continuez vos achats.",
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
    <Navbar />
    <CatalogDemoBanner :show="showDemoBanner" />

    <!-- Panier vide -->
    <div v-if="items.length === 0" class="pt-with-fixed-nav pb-12">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <NuxtLink
          to="/catalogue"
          class="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft class="h-4 w-4" /> Retour à la boutique
        </NuxtLink>

        <div class="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
          <div
            class="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-muted text-primary/35"
          >
            <ShoppingBag class="h-10 w-10" stroke-width="1.25" />
          </div>
          <p class="mb-2 text-sm font-medium text-primary">Votre sélection</p>
          <h1 class="mb-3 font-serif text-2xl tracking-tight text-primary md:text-3xl">
            Panier vide
          </h1>
          <p class="mb-10 max-w-sm text-base font-normal leading-relaxed text-muted-foreground">
            Découvrez nos collections et ajoutez vos coups de cœur à votre panier Tawfekh.
          </p>
          <NuxtLink
            to="/catalogue"
            class="inline-flex items-center gap-2 border-b border-primary/60 pb-1.5 text-sm font-semibold text-primary-soft transition-colors hover:border-primary hover:text-primary"
          >
            Commencer mon shopping <ChevronRight class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Panier avec articles -->
    <div v-else class="pt-with-fixed-nav pb-12">
      <div class="mx-auto max-w-3xl px-4 md:px-8">
        <NuxtLink
          to="/catalogue"
          class="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft class="h-4 w-4" /> Retour à la boutique
        </NuxtLink>

        <header class="mb-10 text-center md:text-left">
          <p class="mb-2 text-sm font-medium text-primary">Votre sélection</p>
          <h1 class="font-serif text-2xl tracking-tight text-primary md:text-4xl">Panier</h1>
          <div class="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span class="h-0.5 w-8 bg-gold" aria-hidden="true" />
            <span class="text-sm font-medium text-muted-foreground">
              {{ totalItems }} article{{ totalItems !== 1 ? "s" : "" }}
            </span>
          </div>
        </header>

        <div
          class="overflow-hidden rounded-sm border border-border bg-card text-card-foreground shadow-sm ring-1 ring-primary/5"
        >
          <div
            v-for="item in items"
            :key="item.product.id"
            class="group border-b border-border p-4 transition-colors last:border-b-0 hover:bg-muted/40 md:p-6"
          >
            <div class="flex gap-4 md:gap-6">
              <NuxtLink
                :to="`/produit/${item.product.id}`"
                class="relative h-28 w-24 shrink-0 overflow-hidden rounded-sm border border-border bg-muted/40"
              >
                <ProductImage
                  class="absolute inset-0"
                  :src="item.product.image"
                  :alt="item.product.name"
                  :product-name="item.product.name"
                  size="sm"
                  img-class="transition-transform duration-500 group-hover:scale-105"
                />
              </NuxtLink>

              <div class="min-w-0 flex-1 space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <NuxtLink
                    :to="`/produit/${item.product.id}`"
                    class="truncate capitalize text-left text-sm font-semibold leading-relaxed text-foreground transition-colors hover:text-primary"
                  >
                    {{ item.product.name }}
                  </NuxtLink>
                  <button
                    type="button"
                    class="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                    aria-label="Retirer du panier"
                    @click="removeItem(item.product.id)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>

                <p class="text-sm font-bold text-gold">{{ formatPrice(item.product.price) }}</p>

                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center rounded-sm border border-border bg-muted/50">
                    <button
                      type="button"
                      class="p-2.5 transition-colors hover:text-primary"
                      aria-label="Diminuer la quantité"
                      @click="updateQuantity(item.product.id, item.quantity - 1)"
                    >
                      <Minus class="h-3.5 w-3.5" />
                    </button>
                    <span class="min-w-[2rem] text-center text-sm font-bold tabular-nums">{{
                      item.quantity
                    }}</span>
                    <button
                      type="button"
                      class="p-2.5 transition-colors hover:text-primary"
                      aria-label="Augmenter la quantité"
                      @click="updateQuantity(item.product.id, item.quantity + 1)"
                    >
                      <Plus class="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span class="text-sm font-bold tabular-nums text-primary md:text-base">
                    {{ formatPrice(item.product.price * item.quantity) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 space-y-6 rounded-sm border border-border bg-card p-6 shadow-inner md:p-8">
          <div class="flex items-center justify-between gap-4">
            <span class="text-sm font-medium text-muted-foreground">
              Total commande
            </span>
            <span class="text-xl font-bold tracking-tight text-primary md:text-2xl">
              {{ formatPrice(totalPrice) }}
            </span>
          </div>

          <NuxtLink
            to="/checkout"
            class="flex w-full items-center justify-center gap-3 rounded-sm bg-primary py-5 text-sm font-semibold text-primary-foreground shadow-2xl transition-all hover:bg-foreground hover:text-background"
          >
            Passer commande <ArrowRight class="h-4 w-4" />
          </NuxtLink>

          <NuxtLink
            to="/catalogue"
            class="block text-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary"
          >
            Continuer mes achats
          </NuxtLink>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>
