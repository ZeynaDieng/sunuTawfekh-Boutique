<script setup lang="ts">
import type { VariantProps } from "class-variance-authority";
import { computed } from "vue";
import { buttonVariants } from "~/utils/button-variants";
import { cn } from "~/utils/cn";

type ButtonVariants = VariantProps<typeof buttonVariants>;

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  }>(),
  {
    variant: "default",
    size: "default",
    type: "button",
    disabled: false,
  },
);

const mergedClass = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class),
);
</script>

<template>
  <button :type="type" :disabled="disabled" :class="mergedClass">
    <slot />
  </button>
</template>
