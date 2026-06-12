import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingCart, Menu, X, Flame } from 'lucide-react';
import { useCart } from './CartContext';
import { CATEGORY_LABELS, Category } from './types';

const categories = Object.keys(CATEGORY_LABELS) as Category[];

export function Navbar() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0a06]/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Flame size={18} className="text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="text-primary font-bold text-sm tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                Foguinho
              </p>
              <p className="text-muted-foreground text-[10px] tracking-widest uppercase">Restaurante · Ibateguara</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/menu/${cat}`}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  location.pathname === `/menu/${cat}`
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>

          {/* Cart + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/carrinho"
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ShoppingCart size={22} className="text-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="px-4 py-3 grid grid-cols-2 gap-1">
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/menu/${cat}`}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-md text-sm transition-colors ${
                  location.pathname === `/menu/${cat}`
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
