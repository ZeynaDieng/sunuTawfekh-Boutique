<script setup lang="ts">
import { Heart } from "lucide-vue-next";
import { computed } from "vue";

const { wishlist } = useCart();

const { data: catalogData } = await useFetch("/api/catalog/products", {
  query: { page: 1, limit: 500 },
  key: "wishlist-catalog-pool",
});

const allProducts = computed(() => catalogData.value?.items ?? []);
const wishedProducts = computed(() => allProducts.value.filter((p) => wishlist.value.includes(p.id)));
const showDemoBanner = computed(() => !!catalogData.value?.demoMode);

useSeoMeta({
  title: "Favoris — Sunu Tawfekh",
  description: "Vos coups de cœur Sunu Tawfekh.",
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <Navbar />
    <CatalogDemoBanner :show="showDemoBanner" />
    <div class="pt-with-fixed-nav pb-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-10">
          <p class="text-xs tracking-[0.3em] uppercase text-primary mb-2">Vos coups de cœur</p>
          <h2 class="text-3xl md:text-4xl font-serif">Favoris</h2>
        </div>

        <div v-if="wishedProducts.length === 0" class="text-center py-20">
          <Heart class="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p class="text-muted-foreground mb-6">Vous n'avez pas encore de favoris.</p>
          <NuxtLink to="/catalogue">
            <Button variant="hero" size="lg">Explorer la boutique</Button>
          </NuxtLink>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ProductCard v-for="p in wishedProducts" :key="p.id" :product="p" />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
