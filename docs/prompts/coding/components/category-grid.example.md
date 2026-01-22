# category-grid.example.md

// SOURCE OF TRUTH: Generated `src/components/CategoryGrid.vue` MUST match this file exactly. Grid layout and token usage must reproduce categories section in `home.png`. Changes require prompt & example sync.

```vue
<template>
  <section class="category-grid" aria-label="Shop by category">
    <div class="category-grid__items">
      <div v-for="cat in categories" :key="cat.id" class="category-grid__item">
        <img v-if="cat.imageUrl" :src="cat.imageUrl" :alt="cat.name" />
        <span class="category-grid__name">{{ cat.name }}</span>
      </div>
    </div>
  </section>
<!-- NOTE: Future enhancement: wrap each item with RouterLink to /category/{id} -->
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'CategoryGrid',
  props: { categories: { type: Array, required: true } }
});
</script>
<style scoped>
.category-grid__items { display: grid; grid-template-columns: repeat(auto-fill,minmax(120px,1fr)); gap: var(--layout-grid-gap); max-width: var(--layout-container-max); margin-left: auto; margin-right: auto; justify-items: center; }
.category-grid__item { text-align: center; padding: var(--space-2); background: var(--color-surface); border-radius: var(--radius-sm); }
.category-grid__item img { width: 100px; height: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto; }
.category-grid__name { display: block; margin-top: var(--space-1); font-size: var(--font-size-sm); }
</style>
```