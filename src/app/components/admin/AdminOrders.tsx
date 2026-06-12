import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, Clock, Search, Filter } from 'lucide-react';
import { Order, STATUS_LABELS, STATUS_COLORS } from '../types';
import { ordersApi } from '../api';

const STATUS_OPTIONS: Order['status'][] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

function OrderRow({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status: Order['status']) => {
    setUpdating(true);
    try {
      await ordersApi.update(order.id, { status });
      onUpdate();
    } catch (e) { console.error(e); }
    setUpdating(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-3">
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(-8).toUpperCase()}</span>
            <span className="font-semibold text-sm text-foreground truncate">{order.customer_name}</span>
            <span className="text-xs text-muted-foreground">{order.order_type === 'delivery' ? '🛵' : '🏃'}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">
              {new Date(order.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-semibold text-primary">R$ {order.total.toFixed(2).replace('.', ',')}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${STATUS_COLORS[order.status]}20`, color: STATUS_COLORS[order.status] }}
          >
            {STATUS_LABELS[order.status]}
          </span>
          {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-border px-4 py-4">
          {/* Items */}
          <div className="space-y-2 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">×{item.quantity}</span>
                <span className="text-xs font-semibold text-foreground shrink-0">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div>
              <p className="text-muted-foreground">Telefone</p>
              <p className="font-medium text-foreground">{order.customer_phone}</p>
            </div>
            {order.delivery_address && (
              <div>
                <p className="text-muted-foreground">Endereço</p>
                <p className="font-medium text-foreground">{order.delivery_address}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Pagamento</p>
              <p className="font-medium text-foreground">{order.payment_method === 'mercadopago' ? 'Mercado Pago' : 'Dinheiro'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status pag.</p>
              <p className={`font-medium ${
                order.payment_status === 'approved' ? 'text-green-400' :
                order.payment_status === 'rejected' ? 'text-destructive' : 'text-yellow-400'
              }`}>
                {order.payment_status === 'approved' ? 'Aprovado' :
                 order.payment_status === 'rejected' ? 'Rejeitado' :
                 order.payment_status === 'cash' ? 'Pagar na retirada' : 'Aguardando'}
              </p>
            </div>
          </div>

          {order.notes && (
            <div className="mb-4 px-3 py-2 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground">📝 {order.notes}</p>
            </div>
          )}

          {/* Status update */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center">Atualizar status:</span>
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating || order.status === s}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 ${
                  order.status === s
                    ? 'ring-1 ring-primary/50'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: `${STATUS_COLORS[s]}20`,
                  color: STATUS_COLORS[s],
                }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchOrders = useCallback(() => {
    setLoading(true);
    ordersApi.getAll().then(setOrders).catch(() => {}).finally(() => {
      setLoading(false);
      setLastRefresh(new Date());
    });
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filtered = orders.filter(o => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (search && !o.customer_name.toLowerCase().includes(search.toLowerCase()) && !o.id.includes(search)) return false;
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Pedidos
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {pendingCount > 0 ? (
              <span className="text-yellow-400 font-semibold">{pendingCount} aguardando confirmação</span>
            ) : 'Todos os pedidos em dia'}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="pl-9 pr-8 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">Todos os status</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders list */}
      {loading && orders.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Clock size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div>
          <p className="text-xs text-muted-foreground mb-3">{filtered.length} pedido{filtered.length !== 1 ? 's' : ''}</p>
          {filtered.map(order => (
            <OrderRow key={order.id} order={order} onUpdate={fetchOrders} />
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4 text-right">
        Última atualização: {lastRefresh.toLocaleTimeString('pt-BR')} · Auto-atualiza a cada 30s
      </p>
    </div>
  );
}
