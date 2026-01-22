# search-bar.example.md

// SOURCE OF TRUTH: Generated `src/components/SearchBar.vue` MUST match this example. Accessibility (role="search"), input labeling and token usage must align with header search in screenshots. Update here first for changes.

```vue
<template>
  <form class="search-bar" role="search" @submit.prevent="submit">
    <input v-model="term" type="text" :placeholder="placeholder" aria-label="Search products" />
    <button type="submit">Search</button>
  </form>
</template>
<script lang="ts">export default { name: 'SearchBar', props: { placeholder: { type: String, default: 'Search products' } }, data() { return { term: '' }; }, methods: { submit() { this.$emit('search', this.term.trim()); } } };</script>
<style scoped>
.search-bar { display: flex; gap: $space-2; }
input { flex: 1; padding: $space-2; border: 1px solid $color-bg-alt; border-radius: $radius-md; }
button { background: $color-brand-primary; color: $color-text-inverse; border: none; padding: $space-2 $space-3; border-radius: $radius-pill; }
</style>
```