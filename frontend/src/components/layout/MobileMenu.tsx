import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { SITE_CONFIG, WHATSAPP_URL } from '../../data/config';

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  isActive: (href: string) => boolean;
}

export default function MobileMenu({ id, isOpen, onClose, navItems, isActive }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Trap focus & body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      menuRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-primary/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id={id}
        ref={menuRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 h-full w-[280px] bg-surface-container-lowest z-50
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-stroke-subtle flex-shrink-0">
          <span className="font-sans font-bold text-[16px] text-primary">{SITE_CONFIG.companyName}</span>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-primary rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-6 py-stack-md" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center h-11 px-3 rounded text-body-md font-body-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-secondary/10 text-secondary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer CTAs */}
        <div className="px-6 pb-8 flex flex-col gap-3 flex-shrink-0 border-t border-stroke-subtle pt-stack-md">
          <Link
            to="/quote"
            onClick={onClose}
            className="btn-primary w-full justify-center py-3 text-label-md"
          >
            Request a Quote
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="btn-secondary w-full justify-center py-3 text-label-md"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </>
  );
}
