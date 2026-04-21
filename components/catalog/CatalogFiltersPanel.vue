<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import type { Category } from "~/utils/data";
import { formatPrice } from "~/utils/data";
import { BRAND_NAME } from "~/utils/brand";
import FilterFacetRow from "./FilterFacetRow.vue";
import FilterCheckbox from "./FilterCheckbox.vue";
import FilterSection from "./FilterSection.vue";

const props = withDefaults(
  defineProps<{
    categories: Category[];
    categoryFilters: { label: string; key: string; options: string[] }[];
    activeCat: string;
    priceMax: number;
    activeFilters: Record<string, string[]>;
    /** Sidebar desktop vs. tiroir mobile (grille catégories type maquette React). */
    variant?: "default" | "drawer";
  }>(),
  { variant: "default" },
);

const emit = defineEmits<{
  setCat: [id: string | undefined];
  toggleFilter: [key: string, value: string];
}>();

const stockOnly = defineModel<boolean>("stockOnly", { required: true });
const newOnly = defineModel<boolean>("newOnly", { required: true });
const promoOnly = defineModel<boolean>("promoOnly", { required: true });
const priceRange = defineModel<[number, number]>("priceRange", { required: true });

/** Maquette React : un seul curseur = prix maximum (min = 0). */
function onPriceMaxSlider(e: Event) {
  const v = Number((e.target as HTMLInputElement).value);
  const max = Math.min(props.priceMax, Math.max(0, v));
  priceRange.value = [0, max];
}

</script>

<template>
  <div class="catalog-filters-inner space-y-10">
    <!-- Prix (ordre maquette React) -->
    <div>
      <h3
        v-if="variant !== 'drawer'"
        class="mb-8 flex items-center justify-between border-b border-border pb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground"
      >
        Prix <ChevronDown class="h-3.5 w-3.5 text-foreground" />
      </h3>

      <div v-if="variant === 'drawer'" class="space-y-4">
        <label class="mb-4 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Prix max&nbsp;:
          <span class="text-gold">{{ formatPrice(priceRange[1]) }}</span>
        </label>
        <input
          type="range"
          :min="0"
          :max="priceMax"
          step="5000"
          :value="priceRange[1]"
          class="catalog-price-slider h-2 w-full cursor-pointer accent-primary"
          @input="onPriceMaxSlider"
        >
      </div>

      <div v-else class="space-y-4">
        <input
          type="range"
          :min="0"
          :max="priceMax"
          step="5000"
          :value="priceRange[1]"
          class="catalog-price-slider h-1 w-full cursor-pointer accent-primary"
          @input="onPriceMaxSlider"
        >
        <div class="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gold">
          <span>{{ formatPrice(0) }}</span>
          <span>{{ formatPrice(priceRange[1]) }}</span>
        </div>
      </div>
    </div>

    <!-- Catégories -->
    <div>
      <h3
        v-if="variant !== 'drawer'"
        class="mb-8 border-b border-border pb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground"
      >
        Catégories
      </h3>

      <div
        v-if="variant === 'drawer'"
        class="grid grid-cols-2 gap-3"
      >
        <button
          type="button"
          class="border py-4 text-[10px] font-bold uppercase tracking-widest transition-all"
          :class="
            !activeCat
              ? 'border-primary bg-primary text-white'
              : 'border-border text-muted-foreground'
          "
          @click="emit('setCat', undefined)"
        >
          Tout
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="border py-4 text-[10px] font-bold uppercase tracking-widest transition-all"
          :class="
            activeCat === cat.id
              ? 'border-primary bg-primary text-white'
              : 'border-border text-muted-foreground'
          "
          @click="emit('setCat', cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>

      <div v-else class="space-y-3">
        <button
          type="button"
          class="block w-full text-left text-[11px] uppercase tracking-widest transition-colors"
          :class="
            !activeCat
              ? 'font-bold text-primary'
              : 'text-gray-400 hover:text-foreground'
          "
          @click="emit('setCat', undefined)"
        >
          Tout {{ BRAND_NAME }}
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="block w-full text-left text-[11px] uppercase tracking-widest transition-colors"
          :class="
            activeCat === cat.id
              ? 'font-bold text-primary'
              : 'text-gray-400 hover:text-foreground'
          "
          @click="emit('setCat', cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Tiroir mobile maquette React : uniquement prix + catégories ci-dessus. -->
    <template v-if="variant !== 'drawer'">
      <div class="space-y-4">
        <FilterCheckbox v-model="stockOnly">Disponibles</FilterCheckbox>
        <FilterCheckbox v-model="newOnly">Nouveautés</FilterCheckbox>
        <FilterCheckbox v-model="promoOnly">Promotions</FilterCheckbox>
      </div>

      <FilterSection
        v-for="filter in categoryFilters"
        :key="filter.key"
        :title="filter.label"
        :default-open="false"
      >
        <div class="flex flex-col gap-3">
          <FilterFacetRow
            v-for="opt in filter.options"
            :key="opt"
            :checked="(activeFilters[filter.key] || []).includes(opt)"
            @change="emit('toggleFilter', filter.key, opt)"
          >
            {{ opt }}
          </FilterFacetRow>
        </div>
      </FilterSection>
    </template>
  </div>
</template>

<style scoped>
.catalog-price-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: #eaeaea;
}
.catalog-price-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #3f3c8c;
  border: 2px solid #e0a83a;
  cursor: pointer;
  margin-top: -7px;
}
.catalog-price-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
  background: #eaeaea;
}
.catalog-price-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #3f3c8c;
  border: 2px solid #e0a83a;
  cursor: pointer;
}
.catalog-price-slider::-moz-range-track {
  height: 4px;
  border-radius: 2px;
  background: #eaeaea;
}
</style>
