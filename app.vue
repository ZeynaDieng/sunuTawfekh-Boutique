<script setup lang="ts">
import { brandPrimaryHex } from "~/tailwind/design-tokens";

const { isDark, syncFromDocument } = useThemeMode();

onMounted(() => {
  syncFromDocument();
});

const themeColor = computed(() => (isDark.value ? "#0f0f0f" : brandPrimaryHex));

useHead({
  meta: [{ name: "theme-color", content: themeColor }],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <CartDrawer />
    <Toaster />
  </NuxtLayout>
</template>
