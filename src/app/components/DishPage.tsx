import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Plus, Minus, ShoppingCart, Check, ChefHat } from 'lucide-react';
import { MenuItem, CATEGORY_LABELS } from './types';
import { menuApi } from './api';
import { useCart } from './CartContext';

export function DishPage() {
  const { id } = useParams<{ id: string }>();
  const [dish, setDish] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    menuApi.getById(id).then(setDish).catch(() => setDish(null)).finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!dish) return;
    for (let i = 0; i < quantity; i++) addToCart(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-card rounded-2xl" />
          <div className="space-y-4 pt-4">
            <div className="h-8 bg-card rounded w-3/4" />
            <div className="h-4 bg-card rounded w-full" />
            <div className="h-4 bg-card rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground text-lg">Prato não encontrado.</p>
        <Link to="/" className="text-primary mt-4 inline-block hover:underline">Voltar ao início</Link>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        to={`/menu/${dish.category}`}
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm mb-6 hover:text-foreground transition-colors"
      >
        <ArrowLeft size={15} /> Voltar para {CATEGORY_LABELS[dish.category]}
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {/* Category badge */}
          <span className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <ChefHat size={13} />
            {CATEGORY_LABELS[dish.category]}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            {dish.name}
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {dish.description}
          </p>

          {/* Ingredients */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-5 h-px bg-primary" />
                Ingredientes
              </h3>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-secondary text-muted-foreground text-xs rounded-full border border-border"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {!dish.available && (
            <div className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-destructive text-sm font-semibold">Este prato está indisponível no momento.</p>
            </div>
          )}

          <div className="mt-auto">
            {/* Price */}
            <p className="text-4xl font-bold text-primary mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              R$ {dish.price.toFixed(2).replace('.', ',')}
            </p>

            {/* Quantity + Add */}
            {dish.available && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-2 py-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center font-bold text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-base transition-all duration-300 ${
                    added
                      ? 'bg-green-600 text-white'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]'
                  }`}
                >
                  {added ? <><Check size={18} /> Adicionado!</> : <><ShoppingCart size={18} /> Adicionar ao Carrinho</>}
                </button>
              </div>
            )}

            {/* Cart link */}
            <Link
              to="/carrinho"
              className="mt-4 block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Ver carrinho →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
