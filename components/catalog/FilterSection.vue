<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";

withDefaults(
  defineProps<{
    title: string;
    /** Si true, la section est ouverte par défaut (accordéon). */
    defaultOpen?: boolean;
  }>(),
  { defaultOpen: true },
);
</script>

<template>
  <details class="filter-section group border-b border-border/70 pb-4 last:border-b-0" :open="defaultOpen">
    <summary
      class="flex cursor-pointer list-none items-center justify-between gap-2 py-0.5 text-sm font-semibold tracking-wide text-primary-soft [&::-webkit-details-marker]:hidden"
    >
      <span>{{ title }}</span>
      <ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
    </summary>
    <div class="mt-4">
      <slot />
    </div>
  </details>
</template>
