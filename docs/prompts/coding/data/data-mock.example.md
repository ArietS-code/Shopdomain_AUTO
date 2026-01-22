# data-mock.example.md

```ts
// Example mock data (mirrors src/mocks/data.mock.ts)
// Notes:
// - Deal product images (now all product images) sourced from /assets/homepage/deals/*.png
// - Promotion background images under /assets/homepage/promotions/*.png
// - Carousel slide images under /assets/homepage/carousel/*.png
// - Category images reuse deal asset imagery (banana, greek-yogurt)
// - Badges: 'deal' for discounted items, 'new' for recently added

import { Product, Category, Promotion, CarouselSlide } from '@/interfaces/domain';

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Organic Bananas', imageUrl: '/assets/homepage/deals/banana.png', price: 1.99, originalPrice: 2.49, currency: '$', rating: 4.7, badges: ['deal'], categoryId: 'c-fruit' },
  { id: 'p2', name: 'Almond Milk 1L', imageUrl: '/assets/homepage/deals/almond-milk.png', price: 3.49, currency: '$', rating: 4.4, categoryId: 'c-dairy' },
  { id: 'p3', name: 'Strawberries 1lb', imageUrl: '/assets/homepage/deals/strawberries.png', price: 3.99, originalPrice: 4.99, currency: '$', rating: 4.6, badges: ['deal'], categoryId: 'c-fruit' },
  { id: 'p4', name: 'Greek Yogurt 6oz', imageUrl: '/assets/homepage/deals/greek-yogurt.png', price: 1.19, originalPrice: 1.49, currency: '$', rating: 4.3, badges: ['deal'], categoryId: 'c-dairy' },
  { id: 'p5', name: 'Cheddar Cheese Block', imageUrl: '/assets/homepage/deals/cheedar-cheese.png', price: 4.99, currency: '$', rating: 4.5, categoryId: 'c-dairy' },
  { id: 'p6', name: 'Avocado Hass', imageUrl: '/assets/homepage/deals/avocado-hass.png', price: 0.99, originalPrice: 1.49, currency: '$', rating: 4.8, badges: ['deal'], categoryId: 'c-fruit' },
  { id: 'p7', name: 'Mixed Berries Pack', imageUrl: '/assets/homepage/deals/berries.png', price: 5.49, currency: '$', rating: 4.2, categoryId: 'c-fruit' },
  { id: 'p8', name: 'Oat Milk 1L', imageUrl: '/assets/homepage/deals/oat-milk.png', price: 3.79, currency: '$', rating: 4.1, badges: ['new'], categoryId: 'c-dairy' }
];

export const mockCategories: Category[] = [
  { id: 'c-fruit', name: 'Fruit', imageUrl: '/assets/homepage/deals/banana.png', productCount: 24 },
  { id: 'c-dairy', name: 'Dairy & Alternatives', imageUrl: '/assets/homepage/deals/greek-yogurt.png', productCount: 18 }
];

export const mockPromotions: Promotion[] = [
  { id: 'promo-summer', title: 'Summer Savings', description: 'Fresh picks for sunny days', imageUrl: '/assets/homepage/promotions/promo-1.png', ctaText: 'Shop Now', ctaHref: '/summer' },
  { id: 'promo-fall-harvest', title: 'Fall Harvest Picks', description: 'Seasonal squash & cozy ingredients', imageUrl: '/assets/homepage/promotions/promo-2.png', ctaText: 'Explore Fall', ctaHref: '/fall' },
  { id: 'promo-weekly-specials', title: 'Weekly Specials', description: 'Limited-time deals ending Sunday', imageUrl: '/assets/homepage/promotions/promo-3.png', ctaText: 'View Specials', ctaHref: '/specials' },
  { id: 'promo-organic-spotlight', title: 'Organic Spotlight', description: 'Certified organic essentials for your pantry', imageUrl: '/assets/homepage/promotions/promo-4.png', ctaText: 'Shop Organic', ctaHref: '/organic' }
];

export const mockSlides: CarouselSlide[] = [
  { id: 'slide-hero-1', imageUrl: '/assets/homepage/carousel/car-3.png', alt: 'Assorted groceries on patterned background', headline: 'Fresh & Local', subheadline: 'Quality you can taste', ctaText: 'Browse Produce', ctaHref: '/produce' },
  { id: 'slide-hero-2', imageUrl: '/assets/homepage/carousel/car-1.png', alt: 'Breakfast table with orange juice and croissants', headline: 'Mornings Made Easy', subheadline: 'Staples & quick picks', ctaText: 'Shop Breakfast', ctaHref: '/breakfast' },
  { id: 'slide-hero-3', imageUrl: '/assets/homepage/carousel/car-2.png', alt: 'Kitchen counter with fresh vegetables', headline: 'Stock the Pantry', ctaText: 'Pantry Essentials', ctaHref: '/pantry' }
];
```
