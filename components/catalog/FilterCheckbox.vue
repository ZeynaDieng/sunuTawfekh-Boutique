<script setup lang="ts">
import { Check } from "lucide-vue-next";

const model = defineModel<boolean>({ required: true });
</script>

<template>
  <label class="group flex cursor-pointer select-none items-center gap-3">
    <input v-model="model" type="checkbox" class="peer sr-only">
    <span
      class="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-all duration-luxury ease-luxury peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-focus-visible:ring-offset-2"
      :class="
        model
          ? 'border-primary bg-primary shadow-sm'
          : 'border-border/80 bg-card/70 group-hover:border-primary/45'
      "
    >
      <Check v-if="model" class="h-2.5 w-2.5 text-white" stroke-width="3" />
    </span>
    <span class="text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
      <slot />
    </span>
  </label>
</template>
