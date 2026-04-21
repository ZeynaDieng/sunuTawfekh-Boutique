<script setup lang="ts">
defineProps<{
  checked: boolean;
}>();

defineEmits<{
  change: [];
}>();
</script>

<template>
  <label class="flex cursor-pointer select-none items-center gap-3">
    <input type="checkbox" class="peer sr-only" :checked="checked" @change="$emit('change')">
    <span
      class="flex h-4 w-4 shrink-0 items-center justify-center border border-foreground transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:border-gold peer-checked:bg-gold/15"
    >
      <span v-show="checked" class="h-2 w-2 bg-foreground" />
    </span>
    <span class="text-sm text-foreground capitalize"><slot /></span>
  </label>
</template>
