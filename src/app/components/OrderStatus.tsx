import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router';
import { CheckCircle, Clock, ChefHat, PackageCheck, Truck, XCircle, RefreshCw, Home, CreditCard } from 'lucide-react';
import { Order, STATUS_LABELS, STATUS_COLORS } from './types';
import { ordersApi } from './api';

const STATUS_ICONS: Record<Order['status'], React.ReactNode> = {
  pending: <Clock size={20} />,
  confirmed: <CheckCircle size={20} />,
  preparing: <ChefHat size={20} />,
  ready: <PackageCheck size={20} />,
  delivered: <Truck size={20} />,
  cancelled: <XCircle size={20} />,
};

const STATUS_STEP: Record<Order['status'], number> = {
  pending: 0, confirmed: 1, preparing: 2, ready: 3, delivered: 4, cancelled: -1
};

const STEPS: Order['status'][] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

export function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const paymentResult = searchParams.get('payment');

  const fetchOrder = () => {
    if (!id) return;
    ordersApi.getById(id).then(setOrder).catch(() => setOrder(null)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 bg-card rounded w-1/2 mb-8" />
        <div className="bg-card rounded-xl p-6 space-y-3">
          <div className="h-4 bg-secondary rounded w-3/4" />
          <div className="h-4 bg-secondary rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground text-lg mb-4">Pedido não encontrado.</p>
        <Link to="/" className="text-primary hover:underline">Voltar ao início</Link>
      </div>
    );
  }

  const currentStep = STATUS_STEP[order.status];
  const isCancelled = order.status === 'cancelled';

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Payment feedback */}
      {paymentResult === 'success' && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2">
          <CheckCircle size={18} className="text-green-500" />
          <p className="text-green-400 text-sm font-semibold">Pagamento confirmado com sucesso!</p>
        </div>
      )}
      {paymentResult === 'failure' && (
        <div className="mb-6 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-2">
          <XCircle size={18} className="text-destructive" />
          <p className="text-destructive text-sm font-semibold">Pagamento não aprovado. Tente novamente.</p>
        </div>
      )}
      {paymentResult === 'failed' && (
        <div className="mb-6 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <p className="text-yellow-400 text-sm font-semibold">Pedido criado, mas houve um problema com o pagamento. Entre em contato conosco.</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Pedido #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(order.created_at).toLocaleString('pt-BR')}
          </p>
        </div>
        <button onClick={fetchOrder} className="p-2 hover:text-primary transition-colors text-muted-foreground rounded-lg hover:bg-secondary">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Status card */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${STATUS_COLORS[order.status]}20`, color: STATUS_COLORS[order.status] }}>
            {STATUS_ICONS[order.status]}
          </div>
          <div>
            <p className="font-bold text-foreground text-lg" style={{ color: STATUS_COLORS[order.status] }}>
              {STATUS_LABELS[order.status]}
            </p>
            <p className="text-muted-foreground text-sm">
              {order.order_type === 'delivery' ? '🛵 Entrega' : '🏃 Retirada no local'}
            </p>
          </div>
        </div>

        {/* Progress */}
        {!isCancelled && (
          <div className="flex items-center gap-0">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {i < currentStep ? <CheckCircle size={14} /> : <span className="text-xs font-bold">{i + 1}</span>}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 transition-all ${i < currentStep ? 'bg-primary' : 'bg-secondary'}`} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order items */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-4">Itens do pedido</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-primary">
                R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
              </p>
            </div>
          ))}
        </div>
        {order.notes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">📝 <span className="font-medium">Obs:</span> {order.notes}</p>
          </div>
        )}
        <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
          <span className="font-bold">Total</span>
          <span className="font-bold text-xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            R$ {order.total.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Payment status */}
      <div className="bg-card border border-border rounded-xl p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Pagamento</span>
        </div>
        <span className={`text-sm font-semibold ${
          order.payment_status === 'approved' ? 'text-green-400' :
          order.payment_status === 'rejected' ? 'text-destructive' :
          order.payment_status === 'cash' ? 'text-yellow-400' :
          'text-yellow-400'
        }`}>
          {order.payment_status === 'approved' ? '✓ Aprovado' :
           order.payment_status === 'rejected' ? '✗ Rejeitado' :
           order.payment_status === 'cash' ? '💵 Pagar na retirada' :
           '⏳ Aguardando'}
        </span>
      </div>

      <div className="flex gap-3">
        <Link
          to="/"
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-sm font-semibold hover:border-primary/30 transition-colors"
        >
          <Home size={16} /> Início
        </Link>
        {order.payment_url && order.payment_status === 'pending' && (
          <a
            href={order.payment_url}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            <CreditCard size={16} /> Pagar agora
          </a>
        )}
      </div>
    </main>
  );
}
