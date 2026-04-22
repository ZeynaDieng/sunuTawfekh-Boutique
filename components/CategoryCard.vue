<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    image: string;
    link: string;
    subtitle?: string;
    elevated?: boolean;
    scrollStrip?: boolean;
  }>(),
  { subtitle: "", elevated: false, scrollStrip: false },
);

const fallback =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80";
</script>

<template>
  <NuxtLink
    :to="link"
    class="cat-card group"
    :class="[
      scrollStrip ? 'cat-card--strip' : 'cat-card--grid',
      elevated && !scrollStrip ? 'cat-card--elevated' : '',
    ]"
  >
    <!-- IMAGE -->
    <img
      :src="image || fallback"
      :alt="title"
      loading="lazy"
      decoding="async"
      class="cat-card__img"
      @error="($event.target as HTMLImageElement).src = fallback"
    />

    <!-- OVERLAYS -->
    <div class="cat-card__overlay-base" aria-hidden="true" />
    <div class="cat-card__overlay-hover" aria-hidden="true" />

    <!-- CONTENT -->
    <div class="cat-card__body">
      <!-- Top-left index number -->
      <span class="cat-card__index" aria-hidden="true">
        {{ String(Math.floor(Math.random() * 8) + 1).padStart(2, "0") }}
      </span>

      <!-- Bottom text block -->
      <div class="cat-card__footer">
        <p v-if="subtitle" class="cat-card__subtitle">{{ subtitle }}</p>
        <h3 class="cat-card__title">{{ title }}</h3>

        <!-- Arrow CTA -->
        <span class="cat-card__cta">
          <span class="cat-card__cta-text">Découvrir</span>
          <svg class="cat-card__cta-arrow" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
/* ─── BASE CARD ──────────────────────────── */
.cat-card {
  --accent: #c9a84c;
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: 2px;
  cursor: pointer;
  text-decoration: none;
  transition:
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.5s ease;
}

.cat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.cat-card--strip {
  height: 340px;
}

.cat-card--grid {
  height: 420px;
}

@media (min-width: 768px) {
  .cat-card--strip {
    height: 400px;
  }
  .cat-card--grid {
    height: 500px;
  }
}

.cat-card--elevated {
  margin-top: 3rem;
}

/* ─── IMAGE ──────────────────────────────── */
.cat-card__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.cat-card:hover .cat-card__img {
  transform: scale(1.08);
}

/* ─── OVERLAYS ───────────────────────────── */
.cat-card__overlay-base {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.78) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
  transition: opacity 0.5s ease;
}

.cat-card__overlay-hover {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(201, 168, 76, 0.18) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
}

.cat-card:hover .cat-card__overlay-hover {
  opacity: 1;
}

/* ─── BODY ───────────────────────────────── */
.cat-card__body {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem 1.5rem 1.5rem;
  color: #fff;
}

/* ─── INDEX ──────────────────────────────── */
.cat-card__index {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--accent);
  opacity: 0.7;
  font-family: monospace;
  transition: opacity 0.3s ease;
}

.cat-card:hover .cat-card__index {
  opacity: 1;
}

/* ─── FOOTER ─────────────────────────────── */
.cat-card__footer {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

/* ─── SUBTITLE ───────────────────────────── */
.cat-card__subtitle {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  transform: translateY(6px);
  opacity: 0;
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
}

.cat-card:hover .cat-card__subtitle {
  transform: translateY(0);
  opacity: 1;
}

/* ─── TITLE ──────────────────────────────── */
.cat-card__title {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  line-height: 1.1;
  color: #fff;
  margin: 0;
  letter-spacing: -0.01em;
}

/* ─── CTA ────────────────────────────────── */
.cat-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  transform: translateY(8px);
  opacity: 0;
  transition:
    transform 0.4s 0.05s ease,
    opacity 0.4s 0.05s ease,
    color 0.3s ease;
}

.cat-card:hover .cat-card__cta {
  transform: translateY(0);
  opacity: 1;
  color: rgba(255, 255, 255, 0.9);
}

.cat-card__cta-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.cat-card:hover .cat-card__cta-arrow {
  transform: translateX(4px);
}
</style>
