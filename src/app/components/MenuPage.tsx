import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ShoppingCart, Plus, Search, ArrowLeft } from 'lucide-react';
import { Category, MenuItem, CATEGORY_LABELS, CATEGORY_IMAGES, CATEGORY_EMOJIS } from './types';
import { menuApi } from './api';
import { useCart } from './CartContext';

function DishCard({ dish }: { dish: MenuItem }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300">
      <Link to={`/prato/${dish.id}`} className="block">
        <div className="aspect-video overflow-hidden bg-secondary relative">
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {!dish.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">Indisponível</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {dish.name}
          </h3>
          <p className="text-muted-foreground text-xs mt-1 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4 flex items-center justify-between">
        <p className="text-primary font-bold text-lg">
          R$ {dish.price.toFixed(2).replace('.', ',')}
        </p>
        <button
          onClick={() => dish.available && addToCart(dish)}
          disabled={!dish.available}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            dish.available
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Plus size={14} />
          Adicionar
        </button>
      </div>
    </div>
  );
}

export function MenuPage() {
  const { category } = useParams<{ category: Category }>();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showUnavailable, setShowUnavailable] = useState(false);

  useEffect(() => {
    setLoading(true);
    menuApi.getAll().then((all: MenuItem[]) => {
      setItems(all.filter(i => i.category === category));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [category]);

  const cat = (category as Category) || 'carnes';
  const label = CATEGORY_LABELS[cat] ?? 'Cardápio';

  const filtered = items.filter(i => {
    if (!showUnavailable && !i.available) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main>
      {/* Header */}
      <section className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={CATEGORY_IMAGES[cat] ?? 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop&auto=format'}
          alt={label}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ backgroundColor: '#1e1209' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a06] via-black/50 to-black/30" />
        <div className="relative h-full flex flex-col justify-end px-4 pb-6 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-1.5 text-white/70 text-sm mb-3 hover:text-white transition-colors w-fit">
            <ArrowLeft size={14} /> Voltar
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{CATEGORY_EMOJIS[cat]}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {label}
            </h1>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar prato..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground select-none">
          <input
            type="checkbox"
            checked={showUnavailable}
            onChange={e => setShowUnavailable(e.target.checked)}
            className="w-4 h-4 accent-primary rounded"
          />
          Mostrar indisponíveis
        </label>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden border border-border animate-pulse">
                <div className="aspect-video bg-secondary" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-full" />
                  <div className="h-3 bg-secondary rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">{CATEGORY_EMOJIS[cat]}</p>
            <p className="text-muted-foreground text-lg">
              {search ? 'Nenhum prato encontrado para essa busca.' : 'Nenhum item disponível no momento.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(dish => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
