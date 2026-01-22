# data-models.example.md

```ts
// Canonical domain interfaces (mirrors src/interfaces/domain.ts)
// Note: All current mock product images standardized to /assets/homepage/deals/*.png for consistency.
// Mock data generation: see src/mocks/data.mock.ts produced alongside this file via data-models prompt.
// Import usage example:
//   import { mockProducts, mockCategories } from '@/mocks/data.mock';
//   import { deriveDiscount } from '@/interfaces/domain';
//   const firstDiscount = deriveDiscount(mockProducts.find(p => p.originalPrice)!);

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;              // current selling price
  originalPrice?: number;     // if present & > price, indicates discount
  currency: string;           // Symbol e.g. '$'
  rating?: number;            // 0-5
  badges?: string[];          // UI badges e.g. ['deal','new']
  categoryId?: string;        // foreign key to Category
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  productCount?: number;      // optional merchandising count
}

export interface Deal {
  productId: string;
  discountPercentage?: number; // derived when originalPrice present
  endsAt?: string;              // ISO timestamp
  label?: string;               // e.g. 'Limited Time'
}

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  alt: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface FeatureFlagsConfig {
  showPromotions: boolean;
  showCarousel: boolean;
  showDeals: boolean;
}

export function deriveDiscount(product: Product): number | undefined {
  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    return Math.round(discount);
  }
  return undefined;
}
```