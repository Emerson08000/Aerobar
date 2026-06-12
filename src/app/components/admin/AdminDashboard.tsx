import { useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation, Link, Routes, Route } from 'react-router';
import { LayoutDashboard, ClipboardList, UtensilsCrossed, LogOut, Menu, X, ChevronRight, Flame } from 'lucide-react';
import { AdminOrders } from './AdminOrders';
import { AdminMenuManager } from './AdminMenuManager';

const TOKEN_KEY = 'aerobar_admin_token';
const VALID_TOKEN = 'foguinho-admin-authenticated';

function isAuthenticated(): boolean {
  return localStorage.getItem(TOKEN_KEY) === VALID_TOKEN;
}

function doLogout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    doLogout();
    navigate('/admin');
  };

  const links = [
    { to: '/admin/pedidos', icon: ClipboardList, label: 'Pedidos' },
    { to: '/admin/cardapio', icon: UtensilsCrossed, label: 'Cardápio' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-primary" />
          <div>
            <p className="text-primary font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>
              Foguinho Admin
            </p>
            <p className="text-muted-foreground text-xs">Painel de controle</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:text-primary transition-colors text-muted-foreground lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6 space-y-2 border-t border-border pt-4">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <LayoutDashboard size={16} />
          Ver site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  );
}

function AuthGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
    }
  }, []);

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminDashboard() {
  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-56 bg-sidebar border-r border-sidebar-border shrink-0">
          <Sidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileSidebar && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebar(false)} />
            <aside className="relative w-56 bg-sidebar border-r border-sidebar-border flex flex-col z-10">
              <Sidebar onClose={() => setMobileSidebar(false)} />
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar (mobile) */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
            <button onClick={() => setMobileSidebar(true)} className="p-1.5 hover:text-primary transition-colors">
              <Menu size={20} />
            </button>
            <Flame size={16} className="text-primary" />
            <span className="font-semibold text-sm">Foguinho Admin</span>
          </div>

          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="cardapio" element={<AdminMenuManager />} />
              <Route path="*" element={<AdminOrders />} />
            </Routes>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
