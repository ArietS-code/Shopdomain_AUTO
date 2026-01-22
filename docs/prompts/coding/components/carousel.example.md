# carousel.example.md

// SOURCE OF TRUTH: Generated `src/components/Carousel.vue` MUST match this example exactly (template, script, styles) except allowed placeholder substitutions. Visual output must align with `docs/instructions/images/home.png` carousel area. Update this file first if any intentional change is required; never allow silent drift.

Example updated to reflect background-image slides with overlay caption and improved a11y labelling.

<template>
  <section class="carousel" aria-label="Promotional carousel">
    <div class="carousel__slides" role="group" :aria-label="'Slides (' + slides.length + ')'">
      <div
        v-for="(slide, idx) in slides"
        :key="slide.id"
        class="carousel__slide"
        :style="{ backgroundImage: 'url(' + slide.imageUrl + ')' }"
        :aria-label="slide.alt"
        aria-roledescription="carousel slide"
        :aria-hidden="idx === currentIndex ? 'false' : 'true'"
        v-show="idx === currentIndex"
        :id="'carousel-slide-' + idx"
      >
        <div class="carousel__caption" v-if="slide.headline">
          <h2>{{ slide.headline }}</h2>
          <p v-if="slide.subheadline">{{ slide.subheadline }}</p>
          <a v-if="slide.ctaText" :href="slide.ctaHref" class="carousel__cta">{{ slide.ctaText }}</a>
        </div>
      </div>
    </div>
    <div class="carousel__dots" role="tablist" aria-label="Carousel slide selectors">
      <button
        v-for="(slide, idx) in slides"
        :key="slide.id + '-dot'"
        type="button"
        class="carousel__dot"
        :class="{ 'is-active': idx === currentIndex }"
        :aria-label="'Go to slide ' + (idx + 1)"
        :aria-controls="'carousel-slide-' + idx"
        :aria-selected="idx === currentIndex ? 'true' : 'false'"
        @click="goTo(idx)"
      ></button>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { CarouselSlide } from '../interfaces/domain';
export default defineComponent({
  name: 'Carousel',
  props: {
    slides: { type: Array as () => CarouselSlide[], required: true },
    intervalMs: { type: Number, default: 5000 }
  },
  data() { return { currentIndex: 0, timer: undefined as number | undefined }; },
  mounted() { this.startTimer(); },
  beforeUnmount() { this.clearTimer(); },
  methods: {
    startTimer() {
      this.clearTimer();
      this.timer = window.setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      }, this.intervalMs);
    },
    clearTimer() { if (this.timer) window.clearInterval(this.timer); },
    goTo(idx: number) { this.currentIndex = idx; this.startTimer(); }
  }
});
</script>
<style scoped>
.carousel { position: relative; }
.carousel__slides { overflow: hidden; }
.carousel__slide {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  min-height: var(--carousel-min-height);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: var(--space-8) var(--space-6) var(--space-6);
  color: var(--color-text-inverse, #fff);
  text-align: left;
}
.carousel__caption {
  background: rgba(0,0,0,0.45);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-md, 8px);
  max-width: 480px;
}
.carousel__caption h2 { margin: 0 0 var(--space-2); font-size: 1.875rem; line-height: 1.2; }
.carousel__caption p { margin: 0 0 var(--space-3); font-size: 1rem; }
.carousel__cta {
  display: inline-block;
  background: var(--color-brand-deep, var(--color-primary));
  color: #fff;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill, 999px);
  font-weight: 600;
  text-decoration: none;
  letter-spacing: var(--ls-tight, 0);
  transition: background .2s ease;
}
.carousel__cta:hover { background: var(--color-brand-medium, var(--color-primary)); }
.carousel__nav { display: flex; gap: var(--space-2); justify-content: center; margin-top: var(--space-2); }
.carousel__nav button { width: 10px; height: 10px; border-radius: 50%; border: none; background: var(--color-muted); cursor: pointer; transition: background .2s ease; }
.carousel__nav button.is-active { background: var(--color-primary); }
.carousel__nav button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
/* Updated dot container */
.carousel__dots { display: flex; gap: var(--space-2); justify-content: center; margin-top: var(--space-2); }
.carousel__dot { width: 10px; height: 10px; border-radius: 50%; border: none; background: var(--color-muted); cursor: pointer; transition: background .2s ease; }
.carousel__dot.is-active { background: var(--color-primary); }
.carousel__dot:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
</style>