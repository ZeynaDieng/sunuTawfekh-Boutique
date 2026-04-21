<script setup lang="ts">
import { MessageCircle } from "lucide-vue-next";
</script>

<template>
  <a
    href="https://wa.me/221770000000"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-6 z-[150] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-all hover:scale-110 active:scale-95 md:hidden"
    aria-label="Contacter via WhatsApp"
  >
    <MessageCircle class="w-6 h-6" />
  </a>
</template>
