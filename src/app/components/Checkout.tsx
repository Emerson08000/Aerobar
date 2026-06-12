import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, CreditCard, Banknote, MapPin, User, Phone, Mail, FileText, Loader2 } from 'lucide-react';
import { useCart } from './CartContext';
import { ordersApi, paymentApi } from './api';
import { OrderItem } from './types';

export function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    order_type: 'retirada' as 'retirada' | 'delivery',
    delivery_address: '',
    notes: '',
    payment_method: 'mercadopago' as 'mercadopago' | 'cash',
  });

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Seu carrinho está vazio.</p>
        <Link to="/" className="text-primary hover:underline">Ver cardápio</Link>
      </div>
    );
  }

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.customer_phone.trim()) {
      setError('Preencha nome e telefone para continuar.');
      return;
    }
    if (form.order_type === 'delivery' && !form.delivery_address.trim()) {
      setError('Informe o endereço de entrega.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const orderItems: OrderItem[] = items.map(i => ({
        menu_item_id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image_url: i.image_url,
      }));

      const order = await ordersApi.create({
        items: orderItems,
        total,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email,
        order_type: form.order_type,
        delivery_address: form.delivery_address,
        notes: form.notes,
        payment_method: form.payment_method,
      });

      if (form.payment_method === 'mercadopago') {
        try {
          const payment = await paymentApi.create(order.id, total, form.customer_name, form.customer_email);
          clearCart();
          // Redirect to Mercado Pago checkout
          window.location.href = payment.initPoint || payment.sandboxInitPoint;
        } catch (mpErr: any) {
          // If MP fails, still save order and go to order page
          clearCart();
          navigate(`/pedido/${order.id}?payment=failed`);
        }
      } else {
        clearCart();
        navigate(`/pedido/${order.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar pedido. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/carrinho" className="inline-flex items-center gap-1.5 text-muted-foreground text-sm mb-8 hover:text-foreground transition-colors">
        <ArrowLeft size={15} /> Voltar ao carrinho
      </Link>

      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Finalizar Pedido
      </h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-8">
        {/* Form */}
        <div className="md:col-span-3 space-y-6">
          {/* Customer info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User size={16} className="text-primary" /> Seus dados
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Nome completo *</label>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={e => set('customer_name', e.target.value)}
                  placeholder="João Silva"
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Telefone/WhatsApp *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      value={form.customer_phone}
                      onChange={e => set('customer_phone', e.target.value)}
                      placeholder="(82) 9 9999-9999"
                      className="w-full pl-9 pr-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">E-mail (opcional)</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={form.customer_email}
                      onChange={e => set('customer_email', e.target.value)}
                      placeholder="email@exemplo.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery / Pickup */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Tipo de pedido
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(['retirada', 'delivery'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => set('order_type', type)}
                  className={`py-3 rounded-lg border text-sm font-semibold transition-all ${
                    form.order_type === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  {type === 'retirada' ? '🏃 Retirada no local' : '🛵 Entrega'}
                </button>
              ))}
            </div>
            {form.order_type === 'delivery' && (
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Endereço de entrega *</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3 text-muted-foreground" />
                  <textarea
                    required
                    value={form.delivery_address}
                    onChange={e => set('delivery_address', e.target.value)}
                    placeholder="Rua, número, bairro, cidade..."
                    rows={3}
                    className="w-full pl-9 pr-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText size={16} className="text-primary" /> Observações
            </h2>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Ex: sem cebola, ponto da carne, alergia a amendoim..."
              rows={3}
              className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground resize-none"
            />
          </div>
        </div>

        {/* Order summary + payment */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-20">
            <h2 className="font-semibold text-foreground mb-4">Resumo do pedido</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-foreground shrink-0">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center mb-6">
              <span className="font-bold">Total</span>
              <span className="font-bold text-xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Payment method */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2 font-medium">Forma de pagamento</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => set('payment_method', 'mercadopago')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    form.payment_method === 'mercadopago'
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <CreditCard size={16} className={form.payment_method === 'mercadopago' ? 'text-primary' : ''} />
                  <span className="font-medium">Mercado Pago</span>
                  <span className="text-xs text-muted-foreground ml-auto">Cartão, Pix</span>
                </button>
                <button
                  type="button"
                  onClick={() => set('payment_method', 'cash')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    form.payment_method === 'cash'
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <Banknote size={16} className={form.payment_method === 'cash' ? 'text-primary' : ''} />
                  <span className="font-medium">Dinheiro / Pix na retirada</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 px-3 py-2.5 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-destructive text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Processando...</>
              ) : form.payment_method === 'mercadopago' ? (
                <><CreditCard size={18} /> Pagar com Mercado Pago</>
              ) : (
                <>Confirmar Pedido</>
              )}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
