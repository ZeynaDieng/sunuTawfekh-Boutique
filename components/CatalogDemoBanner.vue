<script setup lang="ts">
defineProps<{
  show: boolean;
}>();
</script>

<template>
  <div
    v-if="show"
    class="bg-primary/10 border-b border-primary/25 text-center text-xs py-2 px-4 text-foreground"
    role="status"
  >
    Mode démonstration : le catalogue affiché provient des données locales (repli API).
  </div>
</template>
