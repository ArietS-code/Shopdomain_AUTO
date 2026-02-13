<template>
  <div class="homepage">
    <h1 class="homepage-title">Welcome to {{ appName }}</h1>
    
    <section v-if="showPromotions" class="homepage-section">
      <h2 class="homepage-section-title">Special Promotions</h2>
      <div class="homepage-promotions">
        <div
          v-for="promotion in promotions"
          :key="promotion.id"
          class="homepage-promotion-card"
        >
          <img
            :src="promotion.imageUrl"
            :alt="promotion.title"
            class="homepage-promotion-image"
          />
          <div class="homepage-promotion-content">
            <h3 class="homepage-promotion-title">{{ promotion.title }}</h3>
            <p class="homepage-promotion-description">{{ promotion.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="showCarousel" class="homepage-section">
      <h2 class="homepage-section-title">Featured</h2>
      <div class="homepage-carousel">
        <div
          v-for="slide in carouselSlides"
          :key="slide.id"
          class="homepage-carousel-slide"
        >
          <img
            :src="slide.imageUrl"
            :alt="slide.title"
            class="homepage-carousel-image"
          />
          <div class="homepage-carousel-caption">
            <h3>{{ slide.title }}</h3>
            <p v-if="slide.subtitle">{{ slide.subtitle }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="showDeals" class="homepage-section">
      <h2 class="homepage-section-title">Today's Deals</h2>
      <div class="homepage-deals">
        <div
          v-for="deal in deals"
          :key="deal.id"
          class="homepage-deal-card"
        >
          <img
            :src="deal.imageUrl"
            :alt="deal.title"
            class="homepage-deal-image"
          />
          <div class="homepage-deal-content">
            <h3 class="homepage-deal-title">{{ deal.title }}</h3>
            <p class="homepage-deal-discount">{{ deal.discount }}</p>
            <p class="homepage-deal-description">{{ deal.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="homepage-section">
      <h2 class="homepage-section-title">Shop by Category</h2>
      <div class="homepage-categories">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="`/product-listing?category=${category.id}`"
          class="homepage-category-card"
        >
          <img
            :src="category.imageUrl"
            :alt="category.name"
            class="homepage-category-image"
          />
          <h3 class="homepage-category-name">{{ category.name }}</h3>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { APP_NAME, FEATURE_FLAGS } from '@/shared/EnvConsts';
import { mockPromotions, mockSlides, mockCategories } from '@/mocks/data.mock';
import type { Promotion, CarouselSlide, Category, Deal } from '@/interfaces/domain';

export default defineComponent({
  name: 'HomepageView',
  data() {
    return {
      appName: APP_NAME,
      promotions: mockPromotions,
      carouselSlides: mockSlides,
      categories: mockCategories,
      deals: [] as Deal[], // Derived from products with badges
    };
  },
  computed: {
    showPromotions(): boolean {
      return FEATURE_FLAGS.showPromotions;
    },
    showCarousel(): boolean {
      return FEATURE_FLAGS.showCarousel;
    },
    showDeals(): boolean {
      return FEATURE_FLAGS.showDeals;
    },
  },
});
</script>

<style scoped lang="scss">
.homepage {
  width: 100%;
}

.homepage-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.homepage-section {
  margin-bottom: var(--spacing-2xl);
}

.homepage-section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
}

.homepage-promotions,
.homepage-carousel,
.homepage-deals,
.homepage-categories {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.homepage-promotion-card,
.homepage-carousel-slide,
.homepage-deal-card,
.homepage-category-card {
  background: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}

.homepage-promotion-image,
.homepage-carousel-image,
.homepage-deal-image,
.homepage-category-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.homepage-promotion-content,
.homepage-carousel-caption,
.homepage-deal-content {
  padding: var(--spacing-md);
}

.homepage-promotion-title,
.homepage-deal-title,
.homepage-category-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.homepage-promotion-description,
.homepage-deal-description {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
  margin: 0;
}

.homepage-deal-discount {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
}

.homepage-category-card {
  text-decoration: none;
  color: inherit;
}
</style>
