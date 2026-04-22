<script setup lang="ts">
defineProps<{
  checked: boolean;
}>();

defineEmits<{
  change: [];
}>();
</script>

<template>
  <label class="group flex cursor-pointer select-none items-center gap-3">
    <input type="checkbox" class="peer sr-only" :checked="checked" @change="$emit('change')">
    <span
      class="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-border/80 bg-card/70 transition-all duration-luxury ease-luxury peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-focus-visible:ring-offset-2 group-hover:border-primary/45 peer-checked:border-gold peer-checked:bg-gold/15"
    >
      <span v-show="checked" class="h-2 w-2 bg-foreground" />
    </span>
    <span class="text-sm text-foreground capitalize transition-colors group-hover:text-primary"><slot /></span>
  </label>
</template>
