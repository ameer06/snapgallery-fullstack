import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { SITE_CONFIG } from '../../data/config';
import MobileMenu from './MobileMenu';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Why Us', href: '/why-us' },
  { label: 'For Dentists', href: '/for-dentists' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-shadow duration-300 ${
          scrolled ? 'shadow-sm' : ''
        } bg-surface-container-lowest border-b border-stroke-subtle`}
      >
        <div className="flex justify-between items-center max-w-container-max mx-auto px-4 md:px-margin-desktop h-20">
          {/* Brand */}
          <Link
            to="/"
            className="font-sans font-bold text-[20px] leading-tight tracking-tight text-primary flex-shrink-0"
            aria-label="Dental Forge Technologies — Home"
          >
            {SITE_CONFIG.companyName}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-gutter" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`font-label-md text-label-md transition-all duration-200 pb-0.5 ${
                  isActive(item.href)
                    ? 'text-secondary font-semibold border-b-2 border-secondary'
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-stack-sm">
            <Link
              to="/quote"
              className="hidden md:inline-flex btn-primary text-label-md px-6 py-2"
            >
              Request a Quote
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-primary rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <MobileMenu
        id="mobile-menu"
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        isActive={isActive}
      />
    </>
  );
}
