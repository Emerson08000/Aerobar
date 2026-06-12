import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { MenuItem, Category, CATEGORY_LABELS, CATEGORY_EMOJIS } from '../types';
import { menuApi, seedApi } from '../api';
import { DishForm } from './DishForm';

const ALL_CATS = 'todas';

export function AdminMenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(ALL_CATS);
  const [search, setSearch] = useState('');
  const [editingDish, setEditingDish] = useState<MenuItem | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  const fetchItems = useCallback(() => {
    setLoading(true);
    menuApi.getAll().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleDelete = async (id: string) => {
    try {
      await menuApi.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e) { console.error(e); }
    setDeleteConfirm(null);
  };

  const toggleAvailability = async (item: MenuItem) => {
    setTogglingId(item.id);
    try {
      await menuApi.update(item.id, { available: !item.available });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i));
    } catch (e) { console.error(e); }
    setTogglingId(null);
  };

  const openNew = () => { setEditingDish(undefined); setShowForm(true); };
  const openEdit = (dish: MenuItem) => { setEditingDish(dish); setShowForm(true); };

  const handleReset = async () => {
    setResetting(true);
    setResetMsg('');
    try {
      const result = await seedApi.reset();
      setResetMsg(`✓ Cardápio restaurado com ${result.count} pratos!`);
      fetchItems();
    } catch (e: any) {
      setResetMsg(`Erro: ${e.message}`);
    } finally {
      setResetting(false);
    }
  };

  const categories = [ALL_CATS, ...Object.keys(CATEGORY_LABELS)] as (string | Category)[];

  const filtered = items.filter(i => {
    if (category !== ALL_CATS && i.category !== category) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Cardápio
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{items.length} pratos cadastrados</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={resetting}
            title="Restaurar cardápio original do Foguinho"
            className="flex items-center gap-1.5 px-3 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors disabled:opacity-60"
          >
            {resetting ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Restaurar cardápio
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus size={16} /> Novo prato
          </button>
        </div>
      </div>
      {resetMsg && (
        <div className={`mb-4 px-3 py-2.5 rounded-lg text-sm ${resetMsg.startsWith('✓') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-destructive/10 border border-destructive/30 text-destructive'}`}>
          {resetMsg}
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar prato..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => {
            const isActive = category === cat;
            const label = cat === ALL_CATS ? 'Todas' : CATEGORY_LABELS[cat as Category];
            const emoji = cat === ALL_CATS ? '📋' : CATEGORY_EMOJIS[cat as Category];
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {emoji} {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items grid/table */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Plus size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">Nenhum prato encontrado.</p>
          <button onClick={openNew} className="text-primary text-sm hover:underline">
            Adicionar primeiro prato
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/20 transition-colors">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-foreground line-clamp-1">{item.name}</p>
                  <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  {item.featured && <span className="text-xs text-primary">⭐ Destaque</span>}
                </div>
                <p className="text-primary text-sm font-bold mt-0.5">R$ {item.price.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {/* Toggle availability */}
                <button
                  onClick={() => toggleAvailability(item)}
                  disabled={togglingId === item.id}
                  title={item.available ? 'Disponível — clique para desativar' : 'Indisponível — clique para ativar'}
                  className={`p-1.5 rounded-lg transition-colors ${
                    item.available ? 'text-green-400 hover:bg-green-400/10' : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {togglingId === item.id ? <Loader2 size={16} className="animate-spin" /> : item.available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(item.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm text-center">
            <AlertTriangle size={32} className="text-destructive mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-2">Excluir prato?</h3>
            <p className="text-muted-foreground text-sm mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold hover:border-primary/30 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-destructive text-white rounded-lg text-sm font-bold hover:bg-destructive/90 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dish form modal */}
      {showForm && (
        <DishForm
          dish={editingDish}
          onClose={() => { setShowForm(false); setEditingDish(undefined); }}
          onSaved={fetchItems}
        />
      )}
    </div>
  );
}
