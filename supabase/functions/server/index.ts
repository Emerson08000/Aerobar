import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();
app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

const BUCKET = 'make-5acea9aa-images';
const PREFIX = '/make-server-5acea9aa';

const getSupabase = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

(async () => {
  try {
    const supabase = getSupabase();
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b: any) => b.name === BUCKET);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET, { public: true });
      console.log('Storage bucket created:', BUCKET);
    }
  } catch (e) { console.log('Bucket init error:', e); }
})();

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyAdmin(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const session = await kv.get(`admin_session_${token}`);
    return session !== null;
  } catch { return false; }
}

(async () => {
  try {
    const config = await kv.get('admin_config');
    if (!config) {
      const hash = await hashPassword('aerobar2024');
      await kv.set('admin_config', { username: 'admin', passwordHash: hash });
      console.log('Admin config initialized — user: admin, pass: aerobar2024');
    }
  } catch (e) { console.log('Admin init error:', e); }
})();

// ─── Image helpers ───
const IMG = {
  carneChapa: 'https://images.unsplash.com/photo-1573225342350-16731dd9bf3d?w=800&h=600&fit=crop&auto=format',
  carneSol: 'https://images.unsplash.com/photo-1565552834325-476051b6777a?w=800&h=600&fit=crop&auto=format',
  prato: 'https://images.unsplash.com/photo-1637362520022-81292a4bff4b?w=800&h=600&fit=crop&auto=format',
  frango: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=800&h=600&fit=crop&auto=format',
  peixe: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&auto=format',
  camarao: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop&auto=format',
  camaraoCremeQueijo: 'https://images.unsplash.com/photo-1573810655264-8d1e50f1592d?w=800&h=600&fit=crop&auto=format',
  bacalhau: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=600&fit=crop&auto=format',
  salmao: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&auto=format',
  petisco: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&auto=format',
  fritas: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&h=600&fit=crop&auto=format',
  isca: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=600&fit=crop&auto=format',
  bolinho: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop&auto=format',
  queijo: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&auto=format',
  refrigerante: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&h=600&fit=crop&auto=format',
  suco: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&h=600&fit=crop&auto=format',
  agua: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&h=600&fit=crop&auto=format',
  aguaCoco: 'https://images.unsplash.com/photo-1596113782836-32fd09fbe3fb?w=800&h=600&fit=crop&auto=format',
  dose: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format',
  licor: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop&auto=format',
  caipirinha: 'https://images.unsplash.com/photo-1573624658129-3f7856192f19?w=800&h=600&fit=crop&auto=format',
  ginTonica: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop&auto=format',
  cocktail: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop&auto=format',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&auto=format',
  burgerCarneSol: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&auto=format',
  burgerCheddar: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop&auto=format',
  burgerBacon: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=600&fit=crop&auto=format',
  burgerSimples: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=800&h=600&fit=crop&auto=format',
};

const SEED_ITEMS = [
  // ─── CARNES ───
  { id: crypto.randomUUID(), name: 'Carneiro na Chapa', description: 'Acompanha arroz, macaxeira frita, salada, queijo coalho e feijão tropeiro.', price: 140.00, category: 'carnes', image_url: IMG.carneChapa, ingredients: ['Carneiro', 'Arroz', 'Macaxeira frita', 'Salada', 'Queijo coalho', 'Feijão tropeiro'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Picanha de Boi na Chapa', description: 'Acompanha arroz, macaxeira frita, salada, queijo coalho e feijão tropeiro.', price: 145.00, category: 'carnes', image_url: IMG.carneChapa, ingredients: ['Picanha de boi', 'Arroz', 'Macaxeira frita', 'Salada', 'Queijo coalho', 'Feijão tropeiro'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Charque na Chapa', description: 'Acompanha arroz, macaxeira frita, vinagrete, queijo coalho e feijão tropeiro.', price: 145.00, category: 'carnes', image_url: IMG.carneSol, ingredients: ['Charque', 'Arroz', 'Macaxeira frita', 'Vinagrete', 'Queijo coalho', 'Feijão tropeiro'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Carne de Sol', description: 'Acompanha arroz, batata frita, salada, queijo coalho e feijão tropeiro.', price: 120.00, category: 'carnes', image_url: IMG.carneSol, ingredients: ['Carne de sol', 'Arroz', 'Batata frita', 'Salada', 'Queijo coalho', 'Feijão tropeiro'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Filé à Parmegiana', description: 'Acompanha arroz e purê.', price: 125.00, category: 'carnes', image_url: IMG.prato, ingredients: ['Filé bovino', 'Molho de tomate', 'Queijo parmesão', 'Arroz', 'Purê de batata'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Filé à Macedônia', description: 'Filé à milanesa recheado com queijo, presunto, molho madeira, arroz e batata palha.', price: 135.00, category: 'carnes', image_url: IMG.prato, ingredients: ['Filé bovino', 'Queijo', 'Presunto', 'Molho madeira', 'Arroz', 'Batata palha'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Carneiro Guisado', description: 'Acompanha fava, vinagrete, arroz e farofa.', price: 125.00, category: 'carnes', image_url: IMG.carneChapa, ingredients: ['Carneiro', 'Fava', 'Vinagrete', 'Arroz', 'Farofa'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Filé ao Molho de Queijo', description: 'Acompanha arroz à grega, purê e fritas.', price: 135.00, category: 'carnes', image_url: IMG.prato, ingredients: ['Filé bovino', 'Molho de queijo', 'Arroz à grega', 'Purê de batata', 'Batata frita'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Prato Executivo', description: 'Filé de frango, carne de sol, frango empanado, boi guisado, fígado e peixe. Servido de segunda a sexta, das 11:00 às 16:00.', price: 35.00, category: 'carnes', image_url: IMG.prato, ingredients: ['Filé de frango', 'Carne de sol', 'Frango empanado', 'Boi guisado', 'Fígado', 'Peixe', 'Arroz', 'Feijão'], available: true, featured: true },
  // ─── FRANGOS ───
  { id: crypto.randomUUID(), name: 'Filé de Frango à Brasileira ao Molho Branco', description: 'Acompanha arroz, salada e purê.', price: 120.00, category: 'frangos', image_url: IMG.frango, ingredients: ['Filé de frango', 'Molho branco', 'Arroz', 'Salada', 'Purê de batata'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Filé de Frango à Parmegiana', description: 'Acompanha arroz, salada e purê.', price: 100.00, category: 'frangos', image_url: IMG.frango, ingredients: ['Filé de frango', 'Molho de tomate', 'Queijo parmesão', 'Arroz', 'Salada', 'Purê de batata'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Frango à Cubana', description: 'Acompanha arroz à grega, batata palha, abacaxi e banana empanada.', price: 100.00, category: 'frangos', image_url: IMG.frango, ingredients: ['Frango', 'Arroz à grega', 'Batata palha', 'Abacaxi', 'Banana empanada'], available: true, featured: true },
  // ─── FRUTOS DO MAR ───
  { id: crypto.randomUUID(), name: 'Peixada', description: 'Acompanha legumes, ovos, arroz e pirão.', price: 120.00, category: 'frutos-do-mar', image_url: IMG.peixe, ingredients: ['Peixe fresco', 'Legumes', 'Ovos cozidos', 'Arroz', 'Pirão'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Peixe Frito', description: 'Acompanha arroz, feijão tropeiro, purê e salada.', price: 100.00, category: 'frutos-do-mar', image_url: IMG.peixe, ingredients: ['Peixe fresco', 'Arroz', 'Feijão tropeiro', 'Purê de batata', 'Salada'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Peixe ao Molho de Camarão', description: 'Acompanha arroz, purê e legumes.', price: 160.00, category: 'frutos-do-mar', image_url: IMG.camarao, ingredients: ['Peixe fresco', 'Camarão', 'Molho especial', 'Arroz', 'Purê', 'Legumes'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Camarão ao Molho Branco', description: 'Acompanha arroz e purê.', price: 140.00, category: 'frutos-do-mar', image_url: IMG.camarao, ingredients: ['Camarão VG', 'Molho branco', 'Arroz', 'Purê de batata'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Camarãozada', description: 'Acompanha arroz, pirão e legumes.', price: 140.00, category: 'frutos-do-mar', image_url: IMG.camarao, ingredients: ['Camarão VG', 'Arroz', 'Pirão', 'Legumes', 'Temperos regionais'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Bacalhau à Portuguesa', description: 'Acompanha arroz, purê e salada.', price: 140.00, category: 'frutos-do-mar', image_url: IMG.bacalhau, ingredients: ['Bacalhau dessalgado', 'Batata', 'Ovos', 'Azeite', 'Azeitonas', 'Cebola', 'Arroz', 'Salada'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Bacalhoada', description: 'Acompanha arroz, pirão e legumes.', price: 140.00, category: 'frutos-do-mar', image_url: IMG.bacalhau, ingredients: ['Bacalhau dessalgado', 'Arroz', 'Pirão', 'Legumes', 'Azeite', 'Temperos'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Bacalhau ao Forno', description: 'Acompanha purê e arroz.', price: 140.00, category: 'frutos-do-mar', image_url: IMG.bacalhau, ingredients: ['Bacalhau dessalgado', 'Batata', 'Azeite', 'Cebola', 'Purê', 'Arroz'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Salmão ao Molho de Alcaparras', description: 'Acompanha purê e arroz.', price: 160.00, category: 'frutos-do-mar', image_url: IMG.salmao, ingredients: ['Filé de salmão', 'Alcaparras', 'Molho especial', 'Purê', 'Arroz'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Salmão à Portuguesa', description: 'Acompanha purê e arroz.', price: 160.00, category: 'frutos-do-mar', image_url: IMG.salmao, ingredients: ['Filé de salmão', 'Batata', 'Azeite', 'Cebola', 'Tomate', 'Purê', 'Arroz'], available: true, featured: false },
  // ─── PETISCOS ───
  { id: crypto.randomUUID(), name: 'Arrumadinho da Casa', description: 'Acompanha carne de sol, frango, ovo de codorna, calabresa e macaxeira frita.', price: 75.00, category: 'petisco', image_url: IMG.carneSol, ingredients: ['Carne de sol', 'Frango', 'Ovo de codorna', 'Calabresa', 'Macaxeira frita'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Arrumadinho de Charque', description: 'Petisco tradicional com charque temperado e acompanhamentos.', price: 65.00, category: 'petisco', image_url: IMG.carneSol, ingredients: ['Charque', 'Macaxeira frita', 'Vinagrete', 'Feijão verde'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Arrumadinho de Carne de Sol', description: 'Petisco especial com carne de sol na chapa e acompanhamentos.', price: 60.00, category: 'petisco', image_url: IMG.carneSol, ingredients: ['Carne de sol', 'Macaxeira frita', 'Vinagrete', 'Feijão verde'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Filé com Fritas', description: 'Porção de filé frito crocante com batata frita.', price: 60.00, category: 'petisco', image_url: IMG.fritas, ingredients: ['Filé de peixe ou frango', 'Batata frita', 'Limão', 'Molho'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Isca de Frango', description: 'Porção de iscas de frango fritas, temperadas com especiarias da casa.', price: 30.00, category: 'petisco', image_url: IMG.isca, ingredients: ['Peito de frango', 'Tempero da casa', 'Farinha especial'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Pilombeta', description: 'Peixe frito miúdo, petisco tradicional nordestino.', price: 30.00, category: 'petisco', image_url: IMG.peixe, ingredients: ['Peixe miúdo', 'Tempero', 'Limão'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Codorna', description: 'Codorna inteira temperada e frita.', price: 17.00, category: 'petisco', image_url: IMG.petisco, ingredients: ['Codorna', 'Temperos', 'Limão'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Ovos de Codorna', description: 'Porção de ovos de codorna cozidos e temperados.', price: 10.00, category: 'petisco', image_url: IMG.petisco, ingredients: ['Ovos de codorna', 'Sal', 'Temperos'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Tripinha', description: 'Porção de tripinha temperada na chapa, petisco nordestino.', price: 32.00, category: 'petisco', image_url: IMG.petisco, ingredients: ['Tripa', 'Temperos regionais', 'Cebola', 'Limão'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Batata Frita', description: 'Porção de batata frita crocante.', price: 20.00, category: 'petisco', image_url: IMG.fritas, ingredients: ['Batata palito', 'Sal', 'Óleo de girassol'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Macaxeira Frita', description: 'Porção de macaxeira (aipim) frita crocante por fora e macia por dentro.', price: 20.00, category: 'petisco', image_url: IMG.fritas, ingredients: ['Macaxeira', 'Sal', 'Óleo'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Torresmo', description: 'Porção de torresmo crocante tradicional.', price: 35.00, category: 'petisco', image_url: IMG.petisco, ingredients: ['Torresmo', 'Sal grosso'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Queijo com Azeitonas', description: 'Queijo coalho com azeitonas temperadas no azeite.', price: 25.00, category: 'petisco', image_url: IMG.queijo, ingredients: ['Queijo coalho', 'Azeitonas', 'Azeite', 'Ervas finas'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Filé de Camarão Grande', description: 'Filé de camarão acebolado ou ao alho e óleo.', price: 100.00, category: 'petisco', image_url: IMG.camarao, ingredients: ['Camarão VG', 'Cebola', 'Alho', 'Azeite'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Camarão Crocante', description: 'Camarão empanado e frito, crocante por fora e suculento por dentro.', price: 60.00, category: 'petisco', image_url: IMG.camarao, ingredients: ['Camarão', 'Farinha panko', 'Tempero especial'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Camarão ao Cream Cheese', description: 'Camarão ao molho de cream cheese cremoso e temperado.', price: 110.00, category: 'petisco', image_url: IMG.camaraoCremeQueijo, ingredients: ['Camarão VG', 'Cream cheese', 'Alho', 'Temperos', 'Ervas finas'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Peixe Frito (Petisco)', description: 'Porção de peixe frito para compartilhar.', price: 70.00, category: 'petisco', image_url: IMG.peixe, ingredients: ['Peixe fresco', 'Tempero', 'Limão'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Arrumadinho de Bacalhau', description: 'Arrumadinho especial com bacalhau dessalgado e acompanhamentos.', price: 75.00, category: 'petisco', image_url: IMG.bacalhau, ingredients: ['Bacalhau dessalgado', 'Macaxeira frita', 'Azeite', 'Cebola', 'Vinagrete'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Ova de Peixe', description: 'Ova de peixe frita, petisco regional exclusivo.', price: 70.00, category: 'petisco', image_url: IMG.peixe, ingredients: ['Ova de peixe', 'Temperos', 'Limão'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Isca de Peixe', description: 'Iscas de peixe fritas, macias por dentro e crocantes por fora.', price: 60.00, category: 'petisco', image_url: IMG.peixe, ingredients: ['Peixe fresco', 'Tempero da casa', 'Farinha especial', 'Limão'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Bolinho de Charque', description: 'Bolinhos de charque crocantes por fora e cremosos por dentro.', price: 35.00, category: 'petisco', image_url: IMG.bolinho, ingredients: ['Charque', 'Batata', 'Cebola', 'Temperos', 'Ovo'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Bolinho de Bacalhau', description: 'Bolinhos de bacalhau tradicionais, crocantes por fora e cremosos por dentro.', price: 35.00, category: 'petisco', image_url: IMG.bolinho, ingredients: ['Bacalhau dessalgado', 'Batata', 'Cebola', 'Salsinha', 'Ovo'], available: true, featured: true },
  // ─── BEBIDAS ───
  { id: crypto.randomUUID(), name: 'Refrigerante KS', description: 'Refrigerante gelado tamanho KS.', price: 5.00, category: 'bebida', image_url: IMG.refrigerante, ingredients: ['Refrigerante KS'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Refrigerante Lata', description: 'Refrigerante em lata 350ml gelado.', price: 7.00, category: 'bebida', image_url: IMG.refrigerante, ingredients: ['Refrigerante lata 350ml'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Refrigerante de 1 Litro', description: 'Refrigerante garrafa 1 litro.', price: 13.00, category: 'bebida', image_url: IMG.refrigerante, ingredients: ['Refrigerante 1L'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Refrigerante de 2 Litros', description: 'Refrigerante garrafa 2 litros para a mesa.', price: 17.00, category: 'bebida', image_url: IMG.refrigerante, ingredients: ['Refrigerante 2L'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Suco de 400ml', description: 'Suco natural de frutas da estação: laranja, limão, maracujá ou acerola.', price: 8.00, category: 'bebida', image_url: IMG.suco, ingredients: ['Fruta fresca', 'Água', 'Açúcar a gosto'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Suco com Leite de 400ml', description: 'Vitamina de fruta com leite, cremosa e nutritiva.', price: 10.00, category: 'bebida', image_url: IMG.suco, ingredients: ['Fruta fresca', 'Leite', 'Açúcar a gosto'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Jarra de Suco de 800ml', description: 'Jarra de suco natural 800ml, ideal para compartilhar.', price: 16.00, category: 'bebida', image_url: IMG.suco, ingredients: ['Fruta fresca', 'Água', 'Açúcar a gosto'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Jarra de Suco com Leite de 800ml', description: 'Jarra de vitamina 800ml, cremosa e gelada.', price: 20.00, category: 'bebida', image_url: IMG.suco, ingredients: ['Fruta fresca', 'Leite', 'Açúcar a gosto'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Água Mineral de 500ml', description: 'Água mineral natural 500ml.', price: 4.00, category: 'bebida', image_url: IMG.agua, ingredients: ['Água mineral 500ml'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Água Mineral com Gás de 500ml', description: 'Água mineral com gás 500ml.', price: 5.00, category: 'bebida', image_url: IMG.agua, ingredients: ['Água mineral com gás 500ml'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Aquarius Fresh', description: 'Aquarius Fresh gelado.', price: 8.00, category: 'bebida', image_url: IMG.refrigerante, ingredients: ['Aquarius Fresh'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Água de Coco', description: 'Água de coco gelada e natural.', price: 8.00, category: 'bebida', image_url: IMG.aguaCoco, ingredients: ['Água de coco'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Jarra de Água de Coco', description: 'Jarra de água de coco 800ml natural e gelada.', price: 15.00, category: 'bebida', image_url: IMG.aguaCoco, ingredients: ['Água de coco'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Energético', description: 'Energético gelado.', price: 20.00, category: 'bebida', image_url: IMG.refrigerante, ingredients: ['Energético'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Vodka Absolut', description: 'Dose de Vodka Absolut.', price: 15.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Vodka Absolut'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Vodka Ciroc', description: 'Dose de Vodka Ciroc premium.', price: 25.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Vodka Ciroc'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Campari', description: 'Dose de Campari.', price: 10.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Campari'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Montilla', description: 'Dose de Montilla.', price: 8.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Montilla'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Uísque 8 Anos', description: 'Dose de uísque maturado 8 anos.', price: 13.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Uísque 8 anos'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Uísque 12 Anos', description: 'Dose de uísque maturado 12 anos, suave e encorpado.', price: 18.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Uísque 12 anos'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Gin', description: 'Dose de Gin.', price: 20.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Gin'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Martini', description: 'Dose de Martini.', price: 9.00, category: 'bebida', image_url: IMG.licor, ingredients: ['Martini'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Caninha', description: 'Dose de caninha.', price: 3.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Aguardente de cana'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Caninha com Mel', description: 'Dose de caninha com mel, reconfortante e saborosa.', price: 5.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Aguardente de cana', 'Mel'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Cachaça Envelhecida', description: 'Dose de cachaça envelhecida em barril.', price: 10.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Cachaça envelhecida'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Paratiana 20 Anos', description: 'Dose especial de Paratiana maturada 20 anos. Requintada e rara.', price: 50.00, category: 'bebida', image_url: IMG.dose, ingredients: ['Cachaça Paratiana 20 anos'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Cointreau', description: 'Dose de licor Cointreau de laranja.', price: 25.00, category: 'bebida', image_url: IMG.licor, ingredients: ['Cointreau'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Licor 43', description: 'Dose de Licor 43, baunilha e frutas cítricas.', price: 25.00, category: 'bebida', image_url: IMG.licor, ingredients: ['Licor 43'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Amarula', description: 'Dose de Amarula, licor cremoso sul-africano.', price: 25.00, category: 'bebida', image_url: IMG.licor, ingredients: ['Amarula'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Frangelico', description: 'Dose de Frangelico, licor de avelã italiano.', price: 25.00, category: 'bebida', image_url: IMG.licor, ingredients: ['Frangelico'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Peach Tree', description: 'Dose de Peach Tree, licor de pêssego.', price: 25.00, category: 'bebida', image_url: IMG.licor, ingredients: ['Peach Tree'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Amêndoas', description: 'Dose de licor de amêndoas.', price: 25.00, category: 'bebida', image_url: IMG.licor, ingredients: ['Licor de amêndoas'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Sheridan', description: 'Dose de Sheridan, licor duplo de café e baunilha.', price: 35.00, category: 'bebida', image_url: IMG.licor, ingredients: ['Sheridan'], available: true, featured: false },
  // ─── DRINKS ───
  { id: crypto.randomUUID(), name: 'Caipirinha Nordestina', description: 'Cachaça, caju, limão e açúcar. O sabor autêntico do Nordeste.', price: 20.00, category: 'drink', image_url: IMG.caipirinha, ingredients: ['Cachaça', 'Caju fresco', 'Limão', 'Açúcar', 'Gelo'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Caipirinha Tradicional', description: 'Cachaça, limão e açúcar. A clássica brasileira.', price: 13.00, category: 'drink', image_url: IMG.caipirinha, ingredients: ['Cachaça', 'Limão tahiti', 'Açúcar', 'Gelo'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Caipiroska Nevada', description: 'Vodka, leite condensado, fruta e açúcar. Cremosa e deliciosa.', price: 23.00, category: 'drink', image_url: IMG.cocktail, ingredients: ['Vodka', 'Leite condensado', 'Fruta da estação', 'Açúcar', 'Gelo'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Caipiroska de Frutas', description: 'Vodka, açúcar e fruta disponível. Refrescante e colorida.', price: 28.00, category: 'drink', image_url: IMG.cocktail, ingredients: ['Vodka', 'Açúcar', 'Fruta disponível', 'Gelo'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Fogo Fátuo', description: 'Gin, vodka, limão, morango, uva e xarope de frutas vermelhas.', price: 29.00, category: 'drink', image_url: IMG.cocktail, ingredients: ['Gin', 'Vodka', 'Limão', 'Morango', 'Uva', 'Xarope de frutas vermelhas', 'Gelo'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Te Quiero', description: 'Tequila, vodka, licor de pêssego, morango, limão e xarope de frutas vermelhas.', price: 32.00, category: 'drink', image_url: IMG.cocktail, ingredients: ['Tequila', 'Vodka', 'Licor de pêssego', 'Morango', 'Limão', 'Xarope de frutas vermelhas', 'Gelo'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Negroni', description: 'Gin, campari, vermute e laranja. Clássico italiano.', price: 30.00, category: 'drink', image_url: IMG.cocktail, ingredients: ['Gin', 'Campari', 'Vermute rosso', 'Laranja'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Gin Tônica de Limão', description: 'Gin, tônica e limão. Refrescante e elegante.', price: 29.00, category: 'drink', image_url: IMG.ginTonica, ingredients: ['Gin', 'Água tônica', 'Limão', 'Gelo'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Gin Tônica de Morango', description: 'Gin, tônica e morango. Sofisticado e frutado.', price: 29.00, category: 'drink', image_url: IMG.ginTonica, ingredients: ['Gin', 'Água tônica', 'Morango', 'Gelo'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Gin Tônica de Maracujá', description: 'Gin, tônica e maracujá. Tropical e delicioso.', price: 29.00, category: 'drink', image_url: IMG.ginTonica, ingredients: ['Gin', 'Água tônica', 'Maracujá', 'Gelo'], available: true, featured: false },
  // ─── HAMBÚRGUERES ───
  { id: crypto.randomUUID(), name: 'X-Foguinho', description: 'Duplo burguer de 180g, carne de sol, bacon, cebola caramelizada, catupiry, abacaxi grelhado, muçarela e molho especial no pão de brioche.', price: 50.00, category: 'hamburgueres', image_url: IMG.burger, ingredients: ['Burguer duplo 180g', 'Carne de sol', 'Bacon', 'Cebola caramelizada', 'Catupiry', 'Abacaxi grelhado', 'Muçarela', 'Molho especial', 'Pão de brioche'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Nordestino', description: 'Burguer de 180g, charque acebolado, queijo de coalho e molho especial no pão de brioche.', price: 39.00, category: 'hamburgueres', image_url: IMG.burgerCarneSol, ingredients: ['Burguer 180g', 'Charque acebolado', 'Queijo de coalho', 'Molho especial', 'Pão de brioche'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'X-Carne de Sol', description: 'Burguer de 180g, carne de sol, cream cheese, muçarela e molho especial no pão de brioche.', price: 39.00, category: 'hamburgueres', image_url: IMG.burgerCarneSol, ingredients: ['Burguer 180g', 'Carne de sol', 'Cream cheese', 'Muçarela', 'Molho especial', 'Pão de brioche'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Duplo Cheddar', description: 'Duplo burguer de 120g, cheddar cremoso, bacon crocante, cebola caramelizada e molho especial no pão de brioche.', price: 36.00, category: 'hamburgueres', image_url: IMG.burgerCheddar, ingredients: ['Burguer duplo 120g', 'Cheddar cremoso', 'Bacon crocante', 'Cebola caramelizada', 'Molho especial', 'Pão de brioche'], available: true, featured: true },
  { id: crypto.randomUUID(), name: 'Cheddar Especial', description: 'Burguer de 180g na brasa, cheddar cremoso, cebola caramelizada e molho especial no pão de brioche.', price: 32.00, category: 'hamburgueres', image_url: IMG.burgerCheddar, ingredients: ['Burguer 180g', 'Cheddar cremoso', 'Cebola caramelizada', 'Molho especial', 'Pão de brioche'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Fitness', description: 'Burguer de 120g na brasa, muçarela, ovo, tomate, alface e molho especial no pão de brioche.', price: 30.00, category: 'hamburgueres', image_url: IMG.burgerSimples, ingredients: ['Burguer 120g', 'Muçarela', 'Ovo', 'Tomate', 'Alface', 'Molho especial', 'Pão de brioche'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'X-Frango', description: 'Burguer de 120g, frango desfiado, catupiry, muçarela, tomate, alface e molho especial no pão de brioche.', price: 30.00, category: 'hamburgueres', image_url: IMG.burgerSimples, ingredients: ['Burguer 120g', 'Frango desfiado', 'Catupiry', 'Muçarela', 'Tomate', 'Alface', 'Molho especial', 'Pão de brioche'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'X-Bacon', description: 'Burguer de 180g, muçarela, bacon crocante e molho especial no pão de brioche.', price: 30.00, category: 'hamburgueres', image_url: IMG.burgerBacon, ingredients: ['Burguer 180g', 'Muçarela', 'Bacon crocante', 'Molho especial', 'Pão de brioche'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'X-Burguer', description: 'Burguer de 180g, muçarela e molho especial no pão de brioche.', price: 26.00, category: 'hamburgueres', image_url: IMG.burgerSimples, ingredients: ['Burguer 180g', 'Muçarela', 'Molho especial', 'Pão de brioche'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'X-Burguer Kids', description: 'Burguer de 120g, batata frita, muçarela e molho especial no pão de brioche.', price: 23.00, category: 'hamburgueres', image_url: IMG.burgerSimples, ingredients: ['Burguer 120g', 'Batata frita', 'Muçarela', 'Molho especial', 'Pão de brioche'], available: true, featured: false },
  { id: crypto.randomUUID(), name: 'Mini Burguer', description: 'Burguer de 120g, muçarela ou cheddar e molho especial no pão de brioche.', price: 19.00, category: 'hamburgueres', image_url: IMG.burgerSimples, ingredients: ['Burguer 120g', 'Muçarela ou cheddar', 'Molho especial', 'Pão de brioche'], available: true, featured: false },
];

const SEED_VERSION = 'v5-hamburgueres';

(async () => {
  try {
    const currentVersion = await kv.get('seed_version');
    if (currentVersion === SEED_VERSION) return;

    // Clear all old menu items
    const oldItems = await kv.getByPrefix('menu_');
    for (const item of oldItems) {
      if (item?.id) await kv.del(`menu_${item.id}`);
    }

    // Seed fresh data
    const now = new Date().toISOString();
    for (const item of SEED_ITEMS) {
      await kv.set(`menu_${item.id}`, { ...item, created_at: now });
    }
    await kv.set('seed_version', SEED_VERSION);
    console.log(`Seeded ${SEED_ITEMS.length} menu items (${SEED_VERSION})`);
  } catch (e) { console.log('Seed error:', e); }
})();

// ─────────────────── HEALTH ───────────────────
app.get(`${PREFIX}/health`, (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─────────────────── SEED RESET (admin only) ───────────────────
app.post(`${PREFIX}/seed/reset`, async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!await verifyAdmin(token)) return c.json({ error: 'Não autorizado' }, 401);

    // Delete all old menu items
    const oldItems = await kv.getByPrefix('menu_');
    for (const item of oldItems as any[]) {
      if (item?.id) await kv.del(`menu_${item.id}`);
    }

    // Re-seed
    const now = new Date().toISOString();
    for (const item of SEED_ITEMS) {
      await kv.set(`menu_${item.id}`, { ...item, created_at: now });
    }
    await kv.set('seed_version', SEED_VERSION);
    return c.json({ success: true, count: SEED_ITEMS.length });
  } catch (e) {
    return c.json({ error: 'Erro ao resetar seed' }, 500);
  }
});

// ─────────────────── MENU ───────────────────
app.get(`${PREFIX}/menu`, async (c) => {
  try {
    const items = await kv.getByPrefix('menu_');
    return c.json(items);
  } catch (e) {
    return c.json({ error: 'Erro ao buscar cardápio' }, 500);
  }
});

app.get(`${PREFIX}/menu/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const item = await kv.get(`menu_${id}`);
    if (!item) return c.json({ error: 'Item não encontrado' }, 404);
    return c.json(item);
  } catch (e) {
    return c.json({ error: 'Erro ao buscar item' }, 500);
  }
});

app.post(`${PREFIX}/menu`, async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!await verifyAdmin(token)) return c.json({ error: 'Não autorizado' }, 401);
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const item = { ...body, id, created_at: new Date().toISOString() };
    await kv.set(`menu_${id}`, item);
    return c.json(item, 201);
  } catch (e) {
    return c.json({ error: 'Erro ao criar item' }, 500);
  }
});

app.put(`${PREFIX}/menu/:id`, async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!await verifyAdmin(token)) return c.json({ error: 'Não autorizado' }, 401);
    const id = c.req.param('id');
    const existing: any = await kv.get(`menu_${id}`);
    if (!existing) return c.json({ error: 'Item não encontrado' }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id };
    await kv.set(`menu_${id}`, updated);
    return c.json(updated);
  } catch (e) {
    return c.json({ error: 'Erro ao atualizar item' }, 500);
  }
});

app.delete(`${PREFIX}/menu/:id`, async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!await verifyAdmin(token)) return c.json({ error: 'Não autorizado' }, 401);
    const id = c.req.param('id');
    await kv.del(`menu_${id}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'Erro ao deletar item' }, 500);
  }
});

// ─────────────────── ORDERS ───────────────────
app.get(`${PREFIX}/orders`, async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!await verifyAdmin(token)) return c.json({ error: 'Não autorizado' }, 401);
    const orders = await kv.getByPrefix('order_');
    orders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return c.json(orders);
  } catch (e) {
    return c.json({ error: 'Erro ao buscar pedidos' }, 500);
  }
});

app.get(`${PREFIX}/orders/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const order = await kv.get(`order_${id}`);
    if (!order) return c.json({ error: 'Pedido não encontrado' }, 404);
    return c.json(order);
  } catch (e) {
    return c.json({ error: 'Erro ao buscar pedido' }, 500);
  }
});

app.post(`${PREFIX}/orders`, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const order = {
      ...body,
      id,
      status: 'pending',
      payment_status: body.payment_method === 'cash' ? 'cash' : 'pending',
      created_at: new Date().toISOString()
    };
    await kv.set(`order_${id}`, order);
    return c.json(order, 201);
  } catch (e) {
    return c.json({ error: 'Erro ao criar pedido' }, 500);
  }
});

app.put(`${PREFIX}/orders/:id`, async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!await verifyAdmin(token)) return c.json({ error: 'Não autorizado' }, 401);
    const id = c.req.param('id');
    const existing: any = await kv.get(`order_${id}`);
    if (!existing) return c.json({ error: 'Pedido não encontrado' }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id };
    await kv.set(`order_${id}`, updated);
    return c.json(updated);
  } catch (e) {
    return c.json({ error: 'Erro ao atualizar pedido' }, 500);
  }
});

// ─────────────────── AUTH ───────────────────
app.post(`${PREFIX}/auth/login`, async (c) => {
  try {
    const { username, password } = await c.req.json();
    const config: any = await kv.get('admin_config');
    if (!config) return c.json({ error: 'Admin não configurado' }, 500);
    const inputHash = await hashPassword(password);
    if (username !== config.username || inputHash !== config.passwordHash) {
      return c.json({ error: 'Usuário ou senha incorretos' }, 401);
    }
    const token = crypto.randomUUID();
    await kv.set(`admin_session_${token}`, { createdAt: new Date().toISOString() });
    return c.json({ token });
  } catch (e) {
    return c.json({ error: 'Erro ao fazer login' }, 500);
  }
});

app.post(`${PREFIX}/auth/logout`, async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (token) await kv.del(`admin_session_${token}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'Erro ao fazer logout' }, 500);
  }
});

app.get(`${PREFIX}/auth/verify`, async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    const valid = await verifyAdmin(token);
    return c.json({ valid });
  } catch (e) {
    return c.json({ valid: false });
  }
});

// ─────────────────── IMAGE UPLOAD ───────────────────
app.post(`${PREFIX}/upload/image`, async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!await verifyAdmin(token)) return c.json({ error: 'Não autorizado' }, 401);
    const { dataUri, filename } = await c.req.json();
    const [header, base64Data] = dataUri.split(',');
    const contentType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bytes = Uint8Array.from(atob(base64Data), (ch) => ch.charCodeAt(0));
    const path = `menu/${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const supabase = getSupabase();
    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, { contentType, upsert: true });
    if (error) return c.json({ error: `Falha no upload: ${error.message}` }, 500);
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return c.json({ url: publicUrl });
  } catch (e) {
    return c.json({ error: 'Erro ao fazer upload da imagem' }, 500);
  }
});

// ─────────────────── PAYMENTS ───────────────────
app.post(`${PREFIX}/payment/create`, async (c) => {
  try {
    const { orderId, total, customerName, customerEmail } = await c.req.json();
    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!accessToken) return c.json({ error: 'Mercado Pago não configurado.' }, 500);
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const shortId = orderId.slice(-8).toUpperCase();
    const preference = {
      items: [{ title: `Pedido Foguinho #${shortId}`, quantity: 1, unit_price: total, currency_id: 'BRL' }],
      payer: { name: customerName || 'Cliente', email: customerEmail || 'cliente@foguinho.com.br' },
      back_urls: {
        success: `https://aerobar.com.br/pedido/${orderId}?payment=success`,
        failure: `https://aerobar.com.br/pedido/${orderId}?payment=failure`,
        pending: `https://aerobar.com.br/pedido/${orderId}?payment=pending`,
      },
      auto_return: 'approved',
      notification_url: `${supabaseUrl}/functions/v1/make-server-5acea9aa/payment/webhook`,
      external_reference: orderId,
      statement_descriptor: 'RESTAURANTE FOGUINHO',
    };
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(preference)
    });
    if (!response.ok) {
      const err = await response.text();
      return c.json({ error: `Erro Mercado Pago: ${err}` }, 500);
    }
    const data = await response.json();
    const order: any = await kv.get(`order_${orderId}`);
    if (order) {
      await kv.set(`order_${orderId}`, {
        ...order,
        payment_preference_id: data.id,
        payment_url: data.init_point,
        sandbox_payment_url: data.sandbox_init_point
      });
    }
    return c.json({ preferenceId: data.id, initPoint: data.init_point, sandboxInitPoint: data.sandbox_init_point });
  } catch (e) {
    return c.json({ error: 'Erro ao criar pagamento' }, 500);
  }
});

app.post(`${PREFIX}/payment/webhook`, async (c) => {
  try {
    const body = await c.req.json();
    if (body.type !== 'payment') return c.json({ ok: true });
    const paymentId = body.data?.id;
    if (!paymentId) return c.json({ ok: true });
    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!accessToken) return c.json({ ok: true });
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!response.ok) return c.json({ ok: true });
    const payment = await response.json();
    const orderId = payment.external_reference;
    if (!orderId) return c.json({ ok: true });
    const order: any = await kv.get(`order_${orderId}`);
    if (!order) return c.json({ ok: true });
    const paymentStatus = payment.status === 'approved' ? 'approved' : payment.status === 'rejected' ? 'rejected' : 'pending';
    await kv.set(`order_${orderId}`, {
      ...order,
      payment_status: paymentStatus,
      payment_id: String(paymentId),
      status: paymentStatus === 'approved' && order.status === 'pending' ? 'confirmed' : order.status
    });
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ ok: true });
  }
});

Deno.serve(app.fetch);
