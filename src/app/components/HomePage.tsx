import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Clock, MapPin, Phone, Star, Instagram, MessageCircle, Navigation, Moon } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS, CATEGORY_EMOJIS, CATEGORY_IMAGES, Category, MenuItem } from './types';
import { menuApi } from './api';

const categories: Category[] = ['carnes', 'frangos', 'frutos-do-mar', 'petisco', 'bebida', 'drink'];

const WHATSAPP_NUMBER = '5582988281681';
const INSTAGRAM_URL = 'https://www.instagram.com/restaurantefoguinho';
const GMAPS_URL = 'https://www.google.com/maps/search/Restaurante+Foguinho+Ibateguara+Alagoas';

const BURGER_HIGHLIGHTS = [
  {
    name: 'X-Foguinho',
    description: 'Duplo 180g · Carne de sol · Bacon · Cebola caramelizada · Catupiry · Abacaxi grelhado · Muçarela · Molho especial',
    price: 50,
    tag: 'Clássico',
    tagColor: 'bg-primary',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&auto=format',
  },
  {
    name: 'Nordestino',
    description: '180g · Charque acebolado · Queijo de coalho · Molho especial no pão de brioche',
    price: 39,
    tag: 'Regional',
    tagColor: 'bg-amber-600',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&auto=format',
  },
  {
    name: 'Picanha Burger',
    description: '180g · Picanha fatiada · Cheddar cremoso · Cebola caramelizada · Molho especial',
    price: 45,
    tag: 'Premium',
    tagColor: 'bg-yellow-600',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&fit=crop&auto=format',
  },
  {
    name: 'Duplo Cheddar',
    description: 'Duplo 120g · Cheddar cremoso · Bacon crocante · Cebola caramelizada · Molho especial',
    price: 36,
    tag: 'Exclusivo',
    tagColor: 'bg-orange-600',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop&auto=format',
  },
];

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link
      to={`/menu/${cat}`}
      className="group relative overflow-hidden rounded-xl aspect-[4/3] flex flex-col justify-end cursor-pointer"
    >
      <img
        src={CATEGORY_IMAGES[cat]}
        alt={CATEGORY_LABELS[cat]}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundColor: '#1e1209' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="relative p-4">
        <span className="text-2xl">{CATEGORY_EMOJIS[cat]}</span>
        <h3 className="text-white font-bold text-lg mt-1 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          {CATEGORY_LABELS[cat]}
        </h3>
        <p className="text-white/65 text-xs mt-0.5 line-clamp-1">{CATEGORY_DESCRIPTIONS[cat]}</p>
        <div className="mt-2 flex items-center gap-1 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Ver cardápio <ChevronRight size={12} />
        </div>
      </div>
    </Link>
  );
}

function FeaturedDishCard({ dish }: { dish: MenuItem }) {
  return (
    <Link
      to={`/prato/${dish.id}`}
      className="group shrink-0 w-52 bg-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={dish.image_url}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-3">
        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
          {CATEGORY_LABELS[dish.category]}
        </p>
        <h4 className="text-foreground font-semibold text-sm line-clamp-2 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
          {dish.name}
        </h4>
        <p className="text-primary font-bold text-base mt-2">
          R$ {dish.price.toFixed(2).replace('.', ',')}
        </p>
      </div>
    </Link>
  );
}

export function HomePage() {
  const [featured, setFeatured] = useState<MenuItem[]>([]);

  useEffect(() => {
    menuApi.getAll().then((items: MenuItem[]) => {
      setFeatured(items.filter(i => i.featured && i.available && i.category !== 'hamburgueres').slice(0, 12));
    }).catch(() => {});
  }, []);

  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=900&fit=crop&auto=format"
          alt="Restaurante Foguinho de Ibateguara"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ backgroundColor: '#0f0a06' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[#0f0a06]" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-primary text-xs font-semibold tracking-[0.35em] uppercase mb-4">Bem-vindo ao</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Restaurante
          </h1>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="text-primary italic">Foguinho</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-2 leading-relaxed">
            Frutos do mar frescos, carnes nobres, drinks especiais e petiscos irresistíveis.
          </p>
          <p className="text-primary/80 text-sm font-medium mb-10">📍 Ibateguara, Alagoas</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu/carnes" className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-base">
              Ver Cardápio
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de fazer um pedido.`}
              target="_blank" rel="noopener noreferrer"
              className="px-8 py-3.5 border border-green-500/50 text-green-400 font-semibold rounded-lg hover:bg-green-500/10 transition-colors text-base backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── Info bar ─── */}
      <section className="bg-secondary/50 border-y border-border py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-4 justify-center md:justify-between">
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Horário</p>
              <p className="text-sm font-semibold">Seg–Dom · 11h às 23h</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Localização</p>
              <p className="text-sm font-semibold">Ibateguara, Alagoas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">WhatsApp</p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:text-primary transition-colors">
                (82) 9 8828-1681
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Instagram size={16} className="text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Instagram</p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:text-primary transition-colors">
                @restaurantefoguinho
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">O que você quer hoje?</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Nosso Cardápio
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <CategoryCard key={cat} cat={cat} />
          ))}
          {/* Hambúrgueres — card especial noturno */}
          <Link
            to="/menu/hamburgueres"
            className="group relative overflow-hidden rounded-xl aspect-[4/3] flex flex-col justify-end cursor-pointer col-span-2 md:col-span-1"
          >
            <img
              src={CATEGORY_IMAGES['hamburgueres']}
              alt="Hambúrgueres"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundColor: '#1e1209' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            {/* Badge noturno */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full">
              <Moon size={11} className="text-violet-400" />
              <span className="text-white/80 text-xs font-medium">A partir das 18h</span>
            </div>
            <div className="relative p-4">
              <span className="text-2xl">🍔</span>
              <h3 className="text-white font-bold text-lg mt-1 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Hambúrgueres
              </h3>
              <p className="text-white/65 text-xs mt-0.5">Smash burgers artesanais — cardápio noturno</p>
              <div className="mt-2 flex items-center gap-1 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Ver cardápio <ChevronRight size={12} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── Featured ─── */}
      {featured.length > 0 && (
        <section className="py-12 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-1">Seleção especial</p>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  Destaques
                </h2>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
              {featured.map(dish => (
                <FeaturedDishCard key={dish.id} dish={dish} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Cardápio Noturno ─── */}
      <section className="relative py-24 overflow-hidden">
        {/* Fundo escuro com textura */}
        <div className="absolute inset-0 bg-[#080508]" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Badge horário */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm px-5 py-2 rounded-full">
              <Moon size={14} className="text-violet-400" />
              <span className="text-white/70 text-sm font-medium tracking-widest uppercase">A partir das 18h</span>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-14">
            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Cardápio
            </h2>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: '#c084fc' }}>
              Noturno
            </h2>
            <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto mt-5 leading-relaxed">
              Quando a noite chega, o Foguinho vira burger house. Smash burgers artesanais, blends nobres e combos irresistíveis.
            </p>
          </div>

          {/* Cards de burgers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {BURGER_HIGHLIGHTS.map((burger) => (
              <Link
                key={burger.name}
                to="/menu/hamburgueres"
                className="group relative overflow-hidden rounded-2xl aspect-[16/9] flex flex-col justify-end"
              >
                <img
                  src={burger.image}
                  alt={burger.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className={`${burger.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {burger.tag}
                  </span>
                </div>
                <div className="relative p-5">
                  <h3 className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>
                    {burger.name}
                  </h3>
                  <p className="text-white/60 text-xs mt-1 line-clamp-2 leading-relaxed">{burger.description}</p>
                  <p className="text-primary font-bold text-lg mt-3">R$ {burger.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/menu/hamburgueres"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors text-base"
            >
              Ver cardápio completo <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── About ─── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-3">Sobre nós</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              O sabor autêntico<br />de Ibateguara
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O Restaurante Foguinho é referência em Ibateguara, Alagoas. Do almoço executivo ao jantar tardio, oferecemos uma experiência gastronômica completa com carnes nobres, frutos do mar frescos e drinks especiais.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Nosso cardápio celebra os sabores do Nordeste: carne de sol, charque na chapa, picanha de boi, além de pratos especiais como moqueca, bacalhau e salmão.
            </p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>+70</p>
                <p className="text-xs text-muted-foreground mt-0.5">Pratos no cardápio</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="flex items-center gap-1 text-primary">
                  <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>4.9</p>
                  <Star size={18} fill="currentColor" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Avaliação</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>R$35</p>
                <p className="text-xs text-muted-foreground mt-0.5">Prato executivo</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&auto=format"
              alt="Interior do Foguinho"
              className="rounded-xl w-full aspect-[4/3] object-cover"
              style={{ backgroundColor: '#1e1209' }}
            />
            <img
              src="https://images.unsplash.com/photo-1565552834325-476051b6777a?w=400&h=300&fit=crop&auto=format"
              alt="Pratos especiais"
              className="rounded-xl w-full aspect-[4/3] object-cover mt-6"
              style={{ backgroundColor: '#1e1209' }}
            />
          </div>
        </div>
      </section>

      {/* ─── Contact / Location ─── */}
      <section className="bg-secondary/30 border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">Fale conosco</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Localização & Contato
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de fazer um pedido ou tirar uma dúvida.`} target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-8 bg-card border border-border rounded-2xl hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <MessageCircle size={26} className="text-green-400" />
              </div>
              <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: 'var(--font-display)' }}>WhatsApp</h3>
              <p className="text-muted-foreground text-sm mb-3">Pedidos e informações</p>
              <p className="text-green-400 font-semibold text-base">(82) 9 8828-1681</p>
              <p className="text-muted-foreground/60 text-xs mt-2">Clique para chamar no WhatsApp</p>
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-8 bg-card border border-border rounded-2xl hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                <Instagram size={26} className="text-pink-400" />
              </div>
              <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: 'var(--font-display)' }}>Instagram</h3>
              <p className="text-muted-foreground text-sm mb-3">Fotos e novidades</p>
              <p className="text-pink-400 font-semibold text-base">@restaurantefoguinho</p>
              <p className="text-muted-foreground/60 text-xs mt-2">Ver perfil no Instagram</p>
            </a>
            <a href={GMAPS_URL} target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-8 bg-card border border-border rounded-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Navigation size={26} className="text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: 'var(--font-display)' }}>Localização</h3>
              <p className="text-muted-foreground text-sm mb-3">Venha nos visitar</p>
              <p className="text-primary font-semibold text-base">Ibateguara, AL</p>
              <p className="text-muted-foreground/60 text-xs mt-2">Abrir no Google Maps</p>
            </a>
          </div>
          <a href={GMAPS_URL} target="_blank" rel="noopener noreferrer"
            className="group block rounded-2xl overflow-hidden border border-border bg-card relative hover:border-primary/30 transition-colors">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=340&fit=crop&auto=format"
              alt="Mapa - Ibateguara, Alagoas" className="w-full h-48 md:h-64 object-cover opacity-60 group-hover:opacity-75 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                <MapPin size={26} className="text-primary-foreground" />
              </div>
              <div className="text-center bg-black/60 backdrop-blur-sm px-5 py-2.5 rounded-xl">
                <p className="text-white font-bold text-base">Restaurante Foguinho</p>
                <p className="text-white/70 text-sm">Ibateguara, Alagoas · Clique para abrir no Maps</p>
              </div>
            </div>
          </a>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock size={16} className="text-primary" /> Horário de funcionamento
              </h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Segunda – Sexta</span>
                  <span className="font-medium">11:00 – 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sábado – Domingo</span>
                  <span className="font-medium">11:00 – 23:00</span>
                </div>
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">⚡ Prato Executivo: Seg–Sex das 11:00 às 16:00</p>
                  <p className="text-xs text-muted-foreground mt-1">🍔 Hambúrgueres: todos os dias a partir das 18:00</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Phone size={16} className="text-primary" /> Contato direto
              </h3>
              <div className="space-y-3">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de fazer um pedido.`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
                  <MessageCircle size={16} className="text-green-400" />
                  <div>
                    <p className="text-sm font-semibold text-green-400">(82) 9 8828-1681</p>
                    <p className="text-xs text-muted-foreground">Pedir pelo WhatsApp</p>
                  </div>
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 bg-pink-500/10 border border-pink-500/20 rounded-lg hover:bg-pink-500/20 transition-colors">
                  <Instagram size={16} className="text-pink-400" />
                  <div>
                    <p className="text-sm font-semibold text-pink-400">@restaurantefoguinho</p>
                    <p className="text-xs text-muted-foreground">Seguir no Instagram</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#0a0703] border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-primary font-bold text-xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Restaurante Foguinho
          </p>
          <p className="text-muted-foreground text-sm">Ibateguara, Alagoas · (82) 9 8828-1681</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-green-400 transition-colors">
              <MessageCircle size={18} />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-400 transition-colors">
              <Instagram size={18} />
            </a>
            <a href={GMAPS_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <MapPin size={18} />
            </a>
          </div>
          <p className="text-muted-foreground/40 text-xs mt-5">© 2025 Restaurante Foguinho. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
