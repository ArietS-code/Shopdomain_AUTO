<template>
  <footer class="footer">
    <div class="footer-container">
      <p class="footer-copyright">
        &copy; {{ currentYear }} Stop & Shop. All rights reserved.
      </p>
      <nav class="footer-nav" aria-label="Footer navigation">
        <ul class="footer-nav-list">
          <li><a href="#" class="footer-link">Privacy Policy</a></li>
          <li><a href="#" class="footer-link">Terms of Service</a></li>
          <li><a href="#" class="footer-link">Contact Us</a></li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer',
  computed: {
    currentYear(): number {
      return new Date().getFullYear();
    },
  },
});
</script>

<style scoped lang="scss">
.footer {
  background-color: var(--color-background-alt);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-xl) 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-copyright {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  margin: 0;
}

.footer-nav-list {
  display: flex;
  gap: var(--spacing-lg);
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-link {
  color: var(--color-text-light);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-primary);
  }
}
</style>
