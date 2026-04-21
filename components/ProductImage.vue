<script setup lang="ts">
import { Sparkles } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { cn } from "~/utils/cn";

const props = withDefaults(
  defineProps<{
    src: string;
    alt: string;
    /** Nom du produit — sert aux initiales sur le placeholder (sans image). */
    productName?: string;
    /** Classes pour la balise <img> (object-cover, transitions, etc.). */
    imgClass?: string;
    /** Placeholder sur fond clair ou sombre (cartes « Nouveautés »). */
    placeholderVariant?: "light" | "dark";
    /** Taille du pictogramme (vignette panier vs carte). */
    size?: "sm" | "md" | "lg";
  }>(),
  { productName: "", imgClass: "", placeholderVariant: "light", size: "md" },
);

const failed = ref(false);

const hasSrc = computed(() => !!props.src?.trim());

/** Ancien fallback `/placeholder.svg` = SVG texte vectoriel ; en `object-cover` ça affichait des morceaux de « will ». */
function isLegacyPlaceholderSvg(url: string): boolean {
  const base = url.trim().split("?")[0].toLowerCase();
  return base.endsWith("/placeholder.svg") || base === "placeholder.svg";
}

/** Évite de charger une page HTML ou une URL non image (souvent source de texte « will » / artefacts). */
function looksLikeImageUrl(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  if (isLegacyPlaceholderSvg(u)) return false;
  if (u.startsWith("data:image/")) return true;
  if (u.startsWith("/") || u.startsWith("//")) return true;
  if (!/^https?:\/\//i.test(u)) return false;
  try {
    const pathname = new URL(u).pathname.toLowerCase();
    if (
      pathname.endsWith(".html") ||
      pathname.endsWith(".htm") ||
      pathname.endsWith(".php")
    ) {
      return false;
    }
  } catch {
    return false;
  }
  return true;
}

const canAttemptLoad = computed(
  () => hasSrc.value && looksLikeImageUrl(props.src),
);

const showImg = computed(() => canAttemptLoad.value && !failed.value);

const showPlaceholder = computed(
  () => !hasSrc.value || !canAttemptLoad.value || failed.value,
);

watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);

function onImgError() {
  failed.value = true;
}

/** Initiales : 1ère lettre de 2 premiers mots, ou 2 premiers caractères alphanumériques si un seul mot. */
function initialsFromName(name: string): string {
  const t = name.normalize("NFC").trim();
  if (!t) return "";
  const words = t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
  const pick = (s: string) => s.match(/[\p{L}\p{N}]/u)?.[0] ?? "";
  if (words.length >= 2) {
    const a = pick(words[0]!);
    const b = pick(words[1]!);
    if (a && b) return (a + b).toUpperCase();
  }
  const w = words[0] ?? t;
  const chars = [...w.matchAll(/[\p{L}\p{N}]/gu)].map((m) => m[0]!).slice(0, 2);
  if (chars.length >= 2) return chars.join("").toUpperCase();
  if (chars.length === 1) return chars[0]!.toUpperCase();
  return "";
}

const initialsLabel = computed(() =>
  initialsFromName(`${props.productName ?? ""}`.trim() || `${props.alt ?? ""}`.trim()),
);

const iconClass = computed(() => {
  const map = { sm: "h-7 w-7", md: "h-10 w-10", lg: "h-14 w-14" };
  return map[props.size];
});

/** Cercle icône + typo : plus compact en vignette panier */
const placeholderScaleClass = computed(() => {
  const map = {
    sm: "gap-1.5 [&_.ph-initials]:h-9 [&_.ph-initials]:w-9 [&_.ph-initials]:text-[11px] [&_p.ph-brand]:text-[9px]",
    md: "gap-2 [&_.ph-initials]:h-11 [&_.ph-initials]:w-11 [&_.ph-initials]:text-sm [&_p.ph-brand]:text-[10px]",
    lg: "gap-2.5 [&_.ph-initials]:h-14 [&_.ph-initials]:w-14 [&_.ph-initials]:text-base md:[&_.ph-initials]:h-16 md:[&_.ph-initials]:w-16 md:[&_.ph-initials]:text-lg [&_p.ph-brand]:text-[11px] md:[&_p.ph-brand]:text-xs",
  };
  return map[props.size];
});
</script>

<template>
  <div class="relative h-full w-full min-h-0 overflow-hidden">
    <img
      v-if="showImg"
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
      referrerpolicy="no-referrer"
      :class="cn('h-full w-full object-cover', imgClass)"
      @error="onImgError"
    />
    <!-- Placeholder « sans image » : fond marque, halos, motif discret — lisible en carte & vignette -->
    <div
      v-if="showPlaceholder"
      class="product-image-placeholder absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-3 text-center"
      role="img"
      :aria-label="alt"
    >
      <!-- Fonds & profondeur -->
      <template v-if="placeholderVariant === 'dark'">
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-br from-st-black via-primary/30 to-st-black"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -right-[20%] -top-[25%] h-[85%] w-[85%] rounded-full bg-primary/25 blur-[56px]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -bottom-[30%] -left-[20%] h-[70%] w-[70%] rounded-full bg-gold/15 blur-[48px]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.12)_1px,transparent_0)] [background-size:18px_18px]"
          aria-hidden="true"
        />
      </template>
      <template v-else>
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-br from-cream via-primary/[0.07] to-gold/[0.08]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -right-[15%] -top-[20%] h-[75%] w-[75%] rounded-full bg-primary/[0.09] blur-[52px]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -bottom-[25%] -left-[15%] h-[65%] w-[65%] rounded-full bg-gold/[0.14] blur-[44px]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:radial-gradient(circle_at_1px_1px,rgb(63_60_140/0.09)_1px,transparent_0)] [background-size:20px_20px]"
          aria-hidden="true"
        />
      </template>

      <!-- Cadre décoratif léger -->
      <div
        class="pointer-events-none absolute inset-2 rounded-sm border border-primary/10 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35)] sm:inset-3"
        :class="
          placeholderVariant === 'dark'
            ? 'border-white/10 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)]'
            : ''
        "
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute bottom-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        aria-hidden="true"
      />

      <!-- Contenu -->
      <div
        class="relative z-[1] flex flex-col items-center"
        :class="placeholderScaleClass"
      >
        <div
          v-if="initialsLabel"
          class="ph-initials flex shrink-0 items-center justify-center rounded-full border font-serif font-semibold tabular-nums leading-none shadow-md backdrop-blur-sm"
          :class="
            placeholderVariant === 'dark'
              ? 'border-white/20 bg-white/10 text-white'
              : 'border-primary/15 bg-white/90 text-primary'
          "
          aria-hidden="true"
        >
          {{ initialsLabel }}
        </div>
        <p
          class="ph-brand font-serif font-semibold uppercase tracking-[0.22em]"
          :class="
            placeholderVariant === 'dark' ? 'text-white/95' : 'text-primary/90'
          "
        >
          Sunu Tawfekh
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-image-placeholder {
  animation: product-placeholder-in 0.55s ease-out both;
}

@keyframes product-placeholder-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
