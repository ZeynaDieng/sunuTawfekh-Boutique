<script setup lang="ts">
import { computed } from "vue";
import { cn } from "~/utils/cn";

const props = defineProps<{
  class?: string;
  type?: string;
  modelValue?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const mergedClass = computed(() =>
  cn(
    "flex h-10 w-full rounded-md border border-input/80 bg-card/80 px-3 py-2 text-base shadow-sm ring-offset-background transition-all duration-luxury ease-luxury file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/90 hover:border-primary/45 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    props.class,
  ),
);

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
</script>

<template>
  <input
    :type="type ?? 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :class="mergedClass"
    @input="onInput"
  />
</template>
