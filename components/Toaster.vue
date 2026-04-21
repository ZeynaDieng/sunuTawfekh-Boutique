<script setup lang="ts">
import { X } from "lucide-vue-next";
import { computed } from "vue";
import { cn } from "~/utils/cn";

const { toasts, dismiss } = useToast();

const viewportClass =
  "fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 max-lg:left-0 max-lg:right-0 max-lg:top-auto max-lg:bottom-[max(1rem,env(safe-area-inset-bottom,0px))] max-lg:max-w-none lg:top-0 lg:right-0 lg:bottom-auto lg:left-auto lg:max-w-[420px]";

const toastVariants = (variant?: "default" | "destructive") =>
  cn(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    variant === "destructive"
      ? "destructive group border-destructive bg-destructive text-destructive-foreground"
      : "border bg-background text-foreground",
  );

const list = computed(() => toasts.value);
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div :class="viewportClass">
        <div
          v-for="t in list"
          :key="t.id"
          :class="toastVariants(t.variant)"
          data-state="open"
        >
          <div class="grid gap-1">
            <div v-if="t.title" class="text-sm font-semibold">
              {{ t.title }}
            </div>
            <div v-if="t.description" class="text-sm opacity-90">
              {{ t.description }}
            </div>
          </div>
          <button
            type="button"
            class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
            aria-label="Fermer"
            @click="dismiss(t.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>
