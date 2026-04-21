<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

onMounted(() => {
  console.error("404 Error: User attempted to access non-existent route:", useRoute().path);
});

function goHome() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted">
    <div class="text-center">
      <h1 class="mb-4 text-4xl font-bold">404</h1>
      <p class="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
      <button type="button" class="text-primary underline hover:text-primary/90" @click="goHome">
        Return to Home
      </button>
    </div>
  </div>
</template>
