<script setup lang="ts">
import { X } from "lucide-vue-next";

export type CatalogFilterChip =
  | { kind: "stock" | "new" | "promo" }
  | { kind: "price"; label: string }
  | { kind: "category"; label: string }
  | { kind: "search"; label: string }
  | { kind: "facet"; key: string; value: string; label: string };

defineProps<{
  chips: CatalogFilterChip[];
}>();

const emit = defineEmits<{
  remove: [chip: CatalogFilterChip];
}>();
</script>

<template>
  <div
    v-if="chips.length > 0"
    class="mb-5 border-b border-border/60 pb-5 lg:mb-6 lg:pb-6"
    aria-label="Filtres actifs"
  >
    <p class="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground lg:hidden">
      Filtres actifs
    </p>
    <div
      class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] lg:mx-0 lg:flex-wrap lg:overflow-x-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <button
        v-for="(chip, i) in chips"
        :key="i"
        type="button"
        class="inline-flex max-w-[min(100%,280px)] shrink-0 touch-manipulation items-center gap-1.5 rounded-full border border-gold/40 bg-gold/5 px-3 py-1.5 text-left text-[11px] text-foreground transition-colors active:bg-gold/25 hover:bg-gold/15 lg:max-w-full lg:shrink lg:py-1"
        @click="emit('remove', chip)"
      >
        <span class="min-w-0 truncate">
          <template v-if="chip.kind === 'stock'">En stock</template>
          <template v-else-if="chip.kind === 'new'">Nouveautés</template>
          <template v-else-if="chip.kind === 'promo'">Promotions</template>
          <template v-else-if="chip.kind === 'price'">{{ chip.label }}</template>
          <template v-else-if="chip.kind === 'category'">{{ chip.label }}</template>
          <template v-else-if="chip.kind === 'search'">« {{ chip.label }} »</template>
          <template v-else>{{ chip.label }}</template>
        </span>
        <X class="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
