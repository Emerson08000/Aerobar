import { Link } from 'react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';

export function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={60} className="text-muted-foreground/30 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Seu carrinho está vazio
        </h2>
        <p className="text-muted-foreground mb-8">Adicione itens do nosso cardápio para continuar.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ShoppingBag size={18} /> Ver Cardápio
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Meu Carrinho
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</p>
        </div>
        <button
          onClick={clearCart}
          className="text-muted-foreground text-sm hover:text-destructive transition-colors flex items-center gap-1.5"
        >
          <Trash2 size={14} /> Limpar
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 bg-card border border-border rounded-xl p-4 items-center">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground line-clamp-1" style={{ fontFamily: 'var(--font-display)' }}>
                {item.name}
              </h3>
              <p className="text-primary font-bold mt-1">
                R$ {item.price.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
              <div className="flex items-center gap-2 bg-secondary rounded-lg px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 flex items-center justify-center hover:text-primary transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center hover:text-primary transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                = R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="space-y-2 mb-4">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
              <span className="text-foreground">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4 flex justify-between items-center">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-2xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            R$ {total.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <Link
          to="/checkout"
          className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors text-base"
        >
          Finalizar Pedido <ArrowRight size={18} />
        </Link>
        <Link to="/" className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          Continuar comprando
        </Link>
      </div>
    </main>
  );
}
