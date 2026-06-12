import { useState, useRef } from 'react';
import { X, Upload, Loader2, Plus, Trash2, Image } from 'lucide-react';
import { MenuItem, Category, CATEGORY_LABELS } from '../types';
import { menuApi, uploadApi } from '../api';

interface DishFormProps {
  dish?: MenuItem;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
const EMPTY: Omit<MenuItem, 'id' | 'created_at'> = {
  name: '', description: '', price: 0, category: 'petisco', image_url: '',
  ingredients: [], available: true, featured: false,
};

export function DishForm({ dish, onClose, onSaved }: DishFormProps) {
  const [form, setForm] = useState(dish ? { ...dish } : { ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleImageFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const reader = new FileReader();
      const dataUri = await new Promise<string>((res, rej) => {
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const { url } = await uploadApi.image(dataUri, file.name);
      set('image_url', url);
    } catch (e: any) {
      setError(`Erro no upload: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const addIngredient = () => {
    const ing = newIngredient.trim();
    if (!ing || form.ingredients.includes(ing)) return;
    set('ingredients', [...form.ingredients, ing]);
    setNewIngredient('');
  };

  const removeIngredient = (ing: string) => {
    set('ingredients', form.ingredients.filter((i: string) => i !== ing));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Nome é obrigatório.'); return; }
    if (!form.price || form.price <= 0) { setError('Preço deve ser maior que zero.'); return; }
    setError('');
    setSaving(true);
    try {
      if (dish?.id) {
        await menuApi.update(dish.id, form);
      } else {
        await menuApi.create(form);
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-lg text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            {dish ? 'Editar prato' : 'Novo prato'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:text-primary transition-colors rounded-lg hover:bg-secondary">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Imagem do prato</label>
            <div className="flex gap-3 items-start">
              <div
                className="w-28 h-28 rounded-xl overflow-hidden bg-secondary border border-border flex items-center justify-center shrink-0 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {form.image_url ? (
                  <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <Image size={24} className="text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Clique para</p>
                    <p className="text-xs text-muted-foreground">escolher</p>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg text-sm hover:border-primary/40 transition-colors disabled:opacity-60"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'Enviando...' : 'Upload de foto'}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                />
                <input
                  type="url"
                  value={form.image_url}
                  onChange={e => set('image_url', e.target.value)}
                  placeholder="Ou cole uma URL de imagem"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Name + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Nome *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Nome do prato"
                className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Categoria *</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none appearance-none cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Descrição</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Descreva o prato, preparo, acompanhamentos..."
              rows={3}
              className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Preço (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.price || ''}
                onChange={e => set('price', parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={e => set('available', e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-muted-foreground">Disponível</span>
              </label>
            </div>
            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-muted-foreground">Destaque</span>
              </label>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Ingredientes</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newIngredient}
                onChange={e => setNewIngredient(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                placeholder="Adicionar ingrediente..."
                className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.ingredients.map((ing: string) => (
                <span key={ing} className="flex items-center gap-1 px-2.5 py-1 bg-secondary text-muted-foreground text-xs rounded-full border border-border">
                  {ing}
                  <button type="button" onClick={() => removeIngredient(ing)} className="hover:text-destructive transition-colors ml-0.5">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="px-3 py-2.5 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold hover:border-primary/30 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : (dish ? 'Salvar alterações' : 'Criar prato')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
