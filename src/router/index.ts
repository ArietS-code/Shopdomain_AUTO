import { createRouter, createWebHistory } from 'vue-router';
import LayoutDefault from '@/layout/LayoutDefault.vue';
import HomepageView from '@/views/HomepageView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: LayoutDefault,
      children: [
        {
          path: '',
          name: 'home',
          component: HomepageView,
        },
        {
          path: 'product-listing',
          name: 'product-listing',
          component: () => import('@/views/ProductListingView.vue'),
        },
        {
          path: 'product-details/:id',
          name: 'product-details',
          component: () => import('@/views/ProductDetailsView.vue'),
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/CartView.vue'),
        },
        {
          path: 'qa',
          name: 'quality-check',
          component: () => import('@/views/QualityCheckView.vue'),
        },
      ],
    },
  ],
});

export default router;
