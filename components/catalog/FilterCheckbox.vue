<script setup lang="ts">
import { Check } from "lucide-vue-next";

const model = defineModel<boolean>({ required: true });
</script>

<template>
  <label class="group flex cursor-pointer select-none items-center gap-3">
    <input v-model="model" type="checkbox" class="peer sr-only">
    <span
      class="flex h-4 w-4 shrink-0 items-center justify-center border transition-all peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2"
      :class="
        model
          ? 'border-primary bg-primary'
          : 'border-border bg-transparent'
      "
    >
      <Check v-if="model" class="h-2.5 w-2.5 text-white" stroke-width="3" />
    </span>
    <span class="text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
      <slot />
    </span>
  </label>
</template>
