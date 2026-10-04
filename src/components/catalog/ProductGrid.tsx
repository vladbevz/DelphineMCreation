import { ProductCard, type ProductCardData } from '@/components/product/ProductCard';

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
      {products.map((product, i) => (
        <li key={product._id}>
          {/* The first row is above the fold on mobile: load it eagerly for LCP. */}
          <ProductCard
            product={product}
            priority={i < 2}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        </li>
      ))}
    </ul>
  );
}
