# layout.example.md

Example implementation for `LayoutDefault.vue` (simplified).

```vue
<template>
  <div class="layout" aria-label="App layout">
    <Header :title="appName" />
    <main class="layout__main" role="main" aria-label="Main content">
      <router-view />
    </main>
    <Footer :brand="appName" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { APP_NAME } from '@/shared/EnvConsts';
export default defineComponent({
  name: 'LayoutDefault',
  components: { Header, Footer },
  data() { return { appName: APP_NAME }; }
});
</script>
<style scoped>
.layout { display: flex; flex-direction: column; min-height: 100vh; gap: var(--space-6); }
.layout__main { flex: 1 1 auto; display: flex; flex-direction: column; }
</style>
```
