import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ProductCard, type ProductCardData } from '@/components/product/ProductCard';
import { cn } from '@/components/ui/cn';

const variants = {
  /** Full-width grids (collections, related products). */
  full: {
    grid: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  },
  /** Next to the boutique filter sidebar. */
  sidebar: {
    grid: 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4',
    sizes: '(min-width: 1280px) 17vw, (min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw',
  },
};

export function ProductGrid({
  products,
  variant = 'full',
}: {
  products: ProductCardData[];
  variant?: keyof typeof variants;
}) {
  const { grid, sizes } = variants[variant];
  return (
    <Stagger as="ul" className={cn('grid gap-x-4 gap-y-8 sm:gap-x-5', grid)}>
      {products.map((product, i) => (
        <StaggerItem as="li" key={product._id}>
          {/* The first row is above the fold on mobile: load it eagerly for LCP. */}
          <ProductCard product={product} priority={i < 2} sizes={sizes} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
