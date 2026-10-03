import Link from 'next/link';
import { CartButton } from '@/components/cart/CartButton';
import { Container } from '@/components/ui/Container';
import { mainNav } from '@/lib/site';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-sand-border bg-linen">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-espresso focus:px-4 focus:py-2 focus:text-linen"
      >
        Aller au contenu
      </a>
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        <div className="flex items-center gap-1">
          <MobileMenu />
          <Logo />
        </div>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="py-2 underline-offset-8 transition-colors hover:text-cognac hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <CartButton />
      </Container>
    </header>
  );
}
