export type Category = 'carnes' | 'frangos' | 'frutos-do-mar' | 'petisco' | 'bebida' | 'drink' | 'hamburgueres';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image_url: string;
  ingredients: string[];
  available: boolean;
  featured: boolean;
  created_at?: string;
}
export interface CartItem extends MenuItem {
  quantity: number;
} 

export const CATEGORY_LABELS: Record<Category, string> = {
  carnes: 'Carnes',
  frangos: 'Frangos',
  'frutos-do-mar': 'Frutos do Mar',
  petisco: 'Petiscos',
  bebida: 'Bebidas',
  drink: 'Drinks',
  hamburgueres: 'Hambúrgueres',
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  carnes: 'Carnes nobres grelhadas e assadas',
  frangos: 'Filés de frango em preparos especiais',
  'frutos-do-mar': 'Peixes, camarões e frutos do mar frescos',
  petisco: 'Petiscos e porções para compartilhar',
  bebida: 'Refrigerantes, sucos, doses e licores',
  drink: 'Caipirinhas, gin tônica e drinks especiais',
  hamburgueres: 'Smash burgers artesanais — a partir das 18h',
};

export const CATEGORY_EMOJIS: Record<Category, string> = {
  carnes: '🥩',
  frangos: '🍗',
  'frutos-do-mar': '🦐',
  petisco: '🍢',
  bebida: '🥤',
  drink: '🍹',
  hamburgueres: '🍔',
};

export const CATEGORY_IMAGES: Record<Category, string> = {
  carnes: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop&auto=format',
  frangos: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=800&h=600&fit=crop&auto=format',
  'frutos-do-mar': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&auto=format',
  petisco: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&auto=format',
  bebida: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&h=600&fit=crop&auto=format',
  drink: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop&auto=format',
  hamburgueres: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&auto=format',
};
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id?: string;
  name: string;
  image_url: string;
  quantity: number;
  price: number;
}

export type PaymentStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cash';

export type OrderType =
  | 'delivery'
  | 'pickup';

export interface Order {
  id: string;
  status: OrderStatus;

  created_at: string;

  order_type: OrderType;

  items: OrderItem[];

  notes?: string;

  total: number;

  payment_status: PaymentStatus;

  payment_url?: string | null;
}


export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'text-yellow-500',
  confirmed: 'text-blue-500',
  preparing: 'text-orange-500',
  ready: 'text-green-500',
  delivered: 'text-gray-500',
  cancelled: 'text-red-500',
};