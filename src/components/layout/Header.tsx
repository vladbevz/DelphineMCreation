import Link from 'next/link';
import { CartButton } from '@/components/cart/CartButton';
import { mainNav } from '@/lib/site';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-espresso/80 bg-linen">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-espresso focus:px-4 focus:py-2 focus:text-linen"
      >
        Aller au contenu
      </a>
      {/* Three columns: menu | centred logo | cart. */}
      <div className="mx-auto grid h-[4.5rem] max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <MobileMenu />
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="py-2 text-[0.7rem] font-medium tracking-[0.15em] uppercase decoration-1 underline-offset-[6px] hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Logo />

        <div className="flex justify-end">
          <CartButton />
        </div>
      </div>
    </header>
  );
}
