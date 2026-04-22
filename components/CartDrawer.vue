<script setup lang="ts">
import { ChevronRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-vue-next";
import { nextTick, ref, watch } from "vue";
import { formatPrice } from "~/utils/data";

const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
const { isOpen, close } = useCartDrawer();

const drawerRoot = ref<HTMLElement | null>(null);

/** Quand le tiroir se ferme, le focus peut rester sur un lien (ex. checkout) : évite aria-hidden/inert + focus descendant. */
watch(isOpen, async (open) => {
  if (open) return;
  await nextTick();
  const root = drawerRoot.value;
  const active = document.activeElement;
  if (root && active instanceof HTMLElement && root.contains(active)) {
    active.blur();
  }
});

</script>

<template>
  <div
    ref="drawerRoot"
    class="fixed inset-0 z-[200] transition-all duration-500"
    :class="isOpen ? 'visible' : 'invisible pointer-events-none'"
    :inert="!isOpen"
  >
    <div
      class="absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity dark:bg-black/55"
      :class="isOpen ? 'opacity-100' : 'opacity-0'"
      @click="close"
    />
    <div
      class="luxe-glass absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/30 text-card-foreground shadow-2xl transition-transform duration-500 md:max-w-[480px]"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex items-center justify-between border-b border-border/60 bg-white/35 p-6 md:p-8">
        <div class="flex items-center gap-3">
          <h2 class="font-serif text-lg uppercase tracking-[0.18em] text-primary md:text-xl">
            Panier
          </h2>
          <span class="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {{ totalItems }} article{{ totalItems === 1 ? "" : "s" }}
          </span>
        </div>
        <button type="button" class="p-2 transition-transform hover:rotate-90" aria-label="Fermer" @click="close">
          <X class="h-6 w-6" />
        </button>
      </div>

      <div class="flex-1 space-y-8 overflow-y-auto p-6 md:p-8">
        <div
          v-if="items.length === 0"
          class="flex h-full min-h-[40vh] flex-col items-center justify-center space-y-6 text-center"
        >
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-primary opacity-30">
            <ShoppingBag class="h-8 w-8" />
          </div>
          <p class="text-sm font-light text-muted-foreground">Votre panier Tawfekh est vide.</p>
          <button
            type="button"
            class="border-b border-primary/60 pb-1 text-sm font-semibold text-primary-soft transition-colors hover:border-primary hover:text-primary"
            @click="
              close();
              navigateTo('/catalogue');
            "
          >
            Commencer mon shopping
          </button>
        </div>

        <div v-for="line in items" v-else :key="line.product.id" class="group flex gap-6">
          <div class="relative h-28 w-24 shrink-0 overflow-hidden rounded-sm border border-border bg-muted/40">
            <ProductImage
              class="absolute inset-0"
              :src="line.product.image"
              :alt="line.product.name"
              :product-name="line.product.name"
              size="sm"
              img-class="transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div class="min-w-0 flex-1 space-y-3 text-foreground">
            <div class="flex items-start justify-between gap-4">
              <h3 class="truncate text-sm font-semibold uppercase leading-relaxed tracking-wide text-primary">
                {{ line.product.name }}
              </h3>
              <button
                type="button"
                class="text-muted-foreground transition-colors hover:text-secondary"
                aria-label="Retirer"
                @click="removeItem(line.product.id)"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
            <p class="text-sm font-semibold text-primary">{{ formatPrice(line.product.price) }}</p>
            <div class="flex items-center gap-6">
              <div class="flex items-center rounded-sm border border-border/70 bg-white/55">
                <button
                  type="button"
                  class="p-2 hover:text-secondary"
                  aria-label="Diminuer"
                  @click="updateQuantity(line.product.id, line.quantity - 1)"
                >
                  <Minus class="h-3 w-3" />
                </button>
                <span class="w-8 text-center text-sm font-bold">{{ line.quantity }}</span>
                <button
                  type="button"
                  class="p-2 hover:text-secondary"
                  aria-label="Augmenter"
                  @click="updateQuantity(line.product.id, line.quantity + 1)"
                >
                  <Plus class="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="items.length > 0" class="space-y-6 border-t border-border/60 bg-white/55 p-6 shadow-inner md:p-8">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-muted-foreground">Total commande</span>
          <span class="text-xl font-bold tracking-tight text-primary">{{ formatPrice(totalPrice) }}</span>
        </div>
        <NuxtLink
          to="/panier"
          class="flex w-full items-center justify-center gap-3 bg-primary py-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-xl transition-all duration-luxury ease-luxury hover:-translate-y-0.5 hover:bg-secondary hover:shadow-2xl"
        >
          Valider mon Tawfekh <ChevronRight class="h-4 w-4" />
        </NuxtLink>
        <NuxtLink
          to="/catalogue"
          class="block text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-secondary"
        >
          Continuer mes achats
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
