import { Alimento } from '../types';

export const DATABASE_ALIMENTI: Alimento[] = [
  // ── CEREALI ──────────────────────────────────────────────────────────────
  {
    id: 'pasta-semola',
    nome: 'Pasta di semola (cruda)',
    categoria: 'cereali',
    nutrienti: { calorie: 353, proteine: 12, carboidrati: 71, zuccheri: 2.1, grassi: 1.5, grassiSaturi: 0.3, fibre: 3, sodio: 6 },
  },
  {
    id: 'pasta-integrale',
    nome: 'Pasta integrale (cruda)',
    categoria: 'cereali',
    nutrienti: { calorie: 334, proteine: 13, carboidrati: 64, zuccheri: 1.8, grassi: 2.5, grassiSaturi: 0.5, fibre: 8.1, sodio: 8 },
  },
  {
    id: 'riso-bianco',
    nome: 'Riso bianco (crudo)',
    categoria: 'cereali',
    nutrienti: { calorie: 342, proteine: 6.7, carboidrati: 79, zuccheri: 0, grassi: 0.4, grassiSaturi: 0.1, fibre: 1.4, sodio: 5 },
  },
  {
    id: 'riso-integrale',
    nome: 'Riso integrale (crudo)',
    categoria: 'cereali',
    nutrienti: { calorie: 362, proteine: 8, carboidrati: 76, zuccheri: 0.7, grassi: 2.7, grassiSaturi: 0.5, fibre: 3.4, sodio: 5 },
  },
  {
    id: 'pane-bianco',
    nome: 'Pane bianco',
    categoria: 'cereali',
    nutrienti: { calorie: 270, proteine: 9, carboidrati: 55, zuccheri: 3, grassi: 1.5, grassiSaturi: 0.4, fibre: 2.5, sodio: 560 },
  },
  {
    id: 'pane-integrale',
    nome: 'Pane integrale',
    categoria: 'cereali',
    nutrienti: { calorie: 247, proteine: 9, carboidrati: 47, zuccheri: 2.5, grassi: 2, grassiSaturi: 0.4, fibre: 6, sodio: 460 },
  },
  {
    id: 'avena',
    nome: 'Fiocchi d\'avena',
    categoria: 'cereali',
    nutrienti: { calorie: 370, proteine: 13, carboidrati: 66, zuccheri: 1, grassi: 7, grassiSaturi: 1.3, fibre: 10, sodio: 5 },
  },
  {
    id: 'crackers',
    nome: 'Crackers',
    categoria: 'cereali',
    nutrienti: { calorie: 415, proteine: 11, carboidrati: 72, zuccheri: 2, grassi: 10, grassiSaturi: 2.5, fibre: 3, sodio: 660 },
  },
  {
    id: 'farro',
    nome: 'Farro (cotto)',
    categoria: 'cereali',
    nutrienti: { calorie: 150, proteine: 5.5, carboidrati: 29, zuccheri: 0.4, grassi: 1, grassiSaturi: 0.2, fibre: 3.4, sodio: 3 },
  },
  {
    id: 'quinoa',
    nome: 'Quinoa (cotta)',
    categoria: 'cereali',
    nutrienti: { calorie: 120, proteine: 4.4, carboidrati: 22, zuccheri: 0.9, grassi: 1.9, grassiSaturi: 0.2, fibre: 2.8, sodio: 7 },
  },
  {
    id: 'polenta',
    nome: 'Polenta (cotta)',
    categoria: 'cereali',
    nutrienti: { calorie: 70, proteine: 1.6, carboidrati: 15, zuccheri: 0.3, grassi: 0.4, grassiSaturi: 0.1, fibre: 0.9, sodio: 2 },
  },

  // ── CARNI ─────────────────────────────────────────────────────────────────
  {
    id: 'pollo-petto',
    nome: 'Petto di pollo (cotto)',
    categoria: 'carni',
    nutrienti: { calorie: 165, proteine: 31, carboidrati: 0, zuccheri: 0, grassi: 3.6, grassiSaturi: 1, fibre: 0, sodio: 74 },
  },
  {
    id: 'tacchino-petto',
    nome: 'Petto di tacchino (cotto)',
    categoria: 'carni',
    nutrienti: { calorie: 135, proteine: 28, carboidrati: 0, zuccheri: 0, grassi: 2, grassiSaturi: 0.6, fibre: 0, sodio: 68 },
  },
  {
    id: 'manzo-magro',
    nome: 'Manzo magro (cotto)',
    categoria: 'carni',
    nutrienti: { calorie: 215, proteine: 26, carboidrati: 0, zuccheri: 0, grassi: 12, grassiSaturi: 4.8, fibre: 0, sodio: 56 },
  },
  {
    id: 'prosciutto-crudo',
    nome: 'Prosciutto crudo',
    categoria: 'carni',
    nutrienti: { calorie: 270, proteine: 26, carboidrati: 0, zuccheri: 0, grassi: 18, grassiSaturi: 6.5, fibre: 0, sodio: 2500 },
  },
  {
    id: 'prosciutto-cotto',
    nome: 'Prosciutto cotto',
    categoria: 'carni',
    nutrienti: { calorie: 136, proteine: 18, carboidrati: 1, zuccheri: 0.5, grassi: 6.5, grassiSaturi: 2.4, fibre: 0, sodio: 1180 },
  },
  {
    id: 'uova',
    nome: 'Uova intere',
    categoria: 'carni',
    nutrienti: { calorie: 155, proteine: 13, carboidrati: 1.1, zuccheri: 1.1, grassi: 11, grassiSaturi: 3.3, fibre: 0, sodio: 124 },
  },
  {
    id: 'salame',
    nome: 'Salame Milano',
    categoria: 'carni',
    nutrienti: { calorie: 406, proteine: 22, carboidrati: 2, zuccheri: 0.5, grassi: 34, grassiSaturi: 13, fibre: 0, sodio: 1700 },
  },
  {
    id: 'pollo-coscia',
    nome: 'Coscia di pollo (cotta)',
    categoria: 'carni',
    nutrienti: { calorie: 216, proteine: 26, carboidrati: 0, zuccheri: 0, grassi: 12, grassiSaturi: 3.3, fibre: 0, sodio: 98 },
  },

  // ── PESCE ─────────────────────────────────────────────────────────────────
  {
    id: 'salmone',
    nome: 'Salmone (cotto)',
    categoria: 'pesce',
    nutrienti: { calorie: 208, proteine: 20, carboidrati: 0, zuccheri: 0, grassi: 14, grassiSaturi: 3.1, fibre: 0, sodio: 59 },
  },
  {
    id: 'tonno-acqua',
    nome: 'Tonno in acqua (sgocciolato)',
    categoria: 'pesce',
    nutrienti: { calorie: 116, proteine: 26, carboidrati: 0, zuccheri: 0, grassi: 1, grassiSaturi: 0.2, fibre: 0, sodio: 333 },
  },
  {
    id: 'branzino',
    nome: 'Branzino (cotto)',
    categoria: 'pesce',
    nutrienti: { calorie: 124, proteine: 24, carboidrati: 0, zuccheri: 0, grassi: 3, grassiSaturi: 0.7, fibre: 0, sodio: 88 },
  },
  {
    id: 'merluzzo',
    nome: 'Merluzzo (cotto)',
    categoria: 'pesce',
    nutrienti: { calorie: 105, proteine: 23, carboidrati: 0, zuccheri: 0, grassi: 1.2, grassiSaturi: 0.2, fibre: 0, sodio: 70 },
  },
  {
    id: 'sgombro',
    nome: 'Sgombro (cotto)',
    categoria: 'pesce',
    nutrienti: { calorie: 262, proteine: 24, carboidrati: 0, zuccheri: 0, grassi: 18, grassiSaturi: 4.2, fibre: 0, sodio: 83 },
  },
  {
    id: 'gamberetti',
    nome: 'Gamberetti (cotti)',
    categoria: 'pesce',
    nutrienti: { calorie: 99, proteine: 24, carboidrati: 0, zuccheri: 0, grassi: 1.1, grassiSaturi: 0.3, fibre: 0, sodio: 224 },
  },

  // ── LATTICINI ─────────────────────────────────────────────────────────────
  {
    id: 'latte-intero',
    nome: 'Latte intero',
    categoria: 'latticini',
    nutrienti: { calorie: 61, proteine: 3.3, carboidrati: 4.8, zuccheri: 4.8, grassi: 3.3, grassiSaturi: 2.1, fibre: 0, sodio: 43 },
  },
  {
    id: 'latte-scremato',
    nome: 'Latte scremato',
    categoria: 'latticini',
    nutrienti: { calorie: 35, proteine: 3.6, carboidrati: 5, zuccheri: 5, grassi: 0.1, grassiSaturi: 0.1, fibre: 0, sodio: 45 },
  },
  {
    id: 'yogurt-bianco',
    nome: 'Yogurt bianco intero',
    categoria: 'latticini',
    nutrienti: { calorie: 61, proteine: 4, carboidrati: 4.7, zuccheri: 4.7, grassi: 3, grassiSaturi: 2, fibre: 0, sodio: 46 },
  },
  {
    id: 'yogurt-greco',
    nome: 'Yogurt greco 0%',
    categoria: 'latticini',
    nutrienti: { calorie: 57, proteine: 10, carboidrati: 3.6, zuccheri: 3.6, grassi: 0.4, grassiSaturi: 0.3, fibre: 0, sodio: 36 },
  },
  {
    id: 'mozzarella',
    nome: 'Mozzarella',
    categoria: 'latticini',
    nutrienti: { calorie: 253, proteine: 18, carboidrati: 2, zuccheri: 0.7, grassi: 19, grassiSaturi: 12, fibre: 0, sodio: 373 },
  },
  {
    id: 'parmigiano',
    nome: 'Parmigiano Reggiano',
    categoria: 'latticini',
    nutrienti: { calorie: 392, proteine: 33, carboidrati: 0, zuccheri: 0, grassi: 28, grassiSaturi: 17, fibre: 0, sodio: 1529 },
  },
  {
    id: 'ricotta',
    nome: 'Ricotta vaccina',
    categoria: 'latticini',
    nutrienti: { calorie: 174, proteine: 11, carboidrati: 3, zuccheri: 3, grassi: 13, grassiSaturi: 8.3, fibre: 0, sodio: 85 },
  },
  {
    id: 'grana',
    nome: 'Grana Padano',
    categoria: 'latticini',
    nutrienti: { calorie: 384, proteine: 32, carboidrati: 0, zuccheri: 0, grassi: 28, grassiSaturi: 18, fibre: 0, sodio: 1030 },
  },

  // ── LEGUMI ────────────────────────────────────────────────────────────────
  {
    id: 'ceci-cotti',
    nome: 'Ceci (cotti)',
    categoria: 'legumi',
    nutrienti: { calorie: 164, proteine: 9, carboidrati: 27, zuccheri: 4.8, grassi: 3, grassiSaturi: 0.3, fibre: 8, sodio: 24 },
  },
  {
    id: 'lenticchie-cotte',
    nome: 'Lenticchie (cotte)',
    categoria: 'legumi',
    nutrienti: { calorie: 116, proteine: 9, carboidrati: 20, zuccheri: 1.8, grassi: 0.4, grassiSaturi: 0.1, fibre: 8, sodio: 2 },
  },
  {
    id: 'fagioli-cotti',
    nome: 'Fagioli borlotti (cotti)',
    categoria: 'legumi',
    nutrienti: { calorie: 127, proteine: 8.7, carboidrati: 22, zuccheri: 2.6, grassi: 0.5, grassiSaturi: 0.1, fibre: 7, sodio: 3 },
  },
  {
    id: 'piselli',
    nome: 'Piselli (cotti)',
    categoria: 'legumi',
    nutrienti: { calorie: 84, proteine: 5.4, carboidrati: 15, zuccheri: 5.5, grassi: 0.4, grassiSaturi: 0.1, fibre: 5.5, sodio: 3 },
  },
  {
    id: 'soia-edamame',
    nome: 'Edamame (cotti)',
    categoria: 'legumi',
    nutrienti: { calorie: 121, proteine: 11, carboidrati: 9, zuccheri: 2.2, grassi: 5.2, grassiSaturi: 0.6, fibre: 5.2, sodio: 6 },
  },

  // ── VERDURE ───────────────────────────────────────────────────────────────
  {
    id: 'spinaci',
    nome: 'Spinaci (crudi)',
    categoria: 'verdure',
    nutrienti: { calorie: 23, proteine: 2.9, carboidrati: 3.6, zuccheri: 0.4, grassi: 0.4, grassiSaturi: 0.1, fibre: 2.2, sodio: 79 },
  },
  {
    id: 'pomodori',
    nome: 'Pomodori',
    categoria: 'verdure',
    nutrienti: { calorie: 18, proteine: 0.9, carboidrati: 3.9, zuccheri: 2.6, grassi: 0.2, grassiSaturi: 0, fibre: 1.2, sodio: 5 },
  },
  {
    id: 'carote',
    nome: 'Carote',
    categoria: 'verdure',
    nutrienti: { calorie: 41, proteine: 0.9, carboidrati: 9.6, zuccheri: 4.7, grassi: 0.2, grassiSaturi: 0, fibre: 2.8, sodio: 69 },
  },
  {
    id: 'broccoli',
    nome: 'Broccoli (cotti)',
    categoria: 'verdure',
    nutrienti: { calorie: 35, proteine: 2.4, carboidrati: 7.2, zuccheri: 1.7, grassi: 0.4, grassiSaturi: 0.1, fibre: 3.3, sodio: 41 },
  },
  {
    id: 'zucchine',
    nome: 'Zucchine',
    categoria: 'verdure',
    nutrienti: { calorie: 17, proteine: 1.2, carboidrati: 3.1, zuccheri: 2.5, grassi: 0.3, grassiSaturi: 0.1, fibre: 1, sodio: 8 },
  },
  {
    id: 'lattuga',
    nome: 'Lattuga',
    categoria: 'verdure',
    nutrienti: { calorie: 15, proteine: 1.3, carboidrati: 2.8, zuccheri: 1.2, grassi: 0.2, grassiSaturi: 0, fibre: 1.3, sodio: 28 },
  },
  {
    id: 'peperoni',
    nome: 'Peperoni',
    categoria: 'verdure',
    nutrienti: { calorie: 31, proteine: 1, carboidrati: 6, zuccheri: 4.2, grassi: 0.3, grassiSaturi: 0.1, fibre: 2.1, sodio: 4 },
  },
  {
    id: 'cetrioli',
    nome: 'Cetrioli',
    categoria: 'verdure',
    nutrienti: { calorie: 15, proteine: 0.6, carboidrati: 3.6, zuccheri: 1.7, grassi: 0.1, grassiSaturi: 0, fibre: 0.5, sodio: 2 },
  },
  {
    id: 'cipolla',
    nome: 'Cipolla',
    categoria: 'verdure',
    nutrienti: { calorie: 40, proteine: 1.1, carboidrati: 9.3, zuccheri: 4.2, grassi: 0.1, grassiSaturi: 0, fibre: 1.7, sodio: 4 },
  },
  {
    id: 'melanzane',
    nome: 'Melanzane',
    categoria: 'verdure',
    nutrienti: { calorie: 25, proteine: 1, carboidrati: 5.7, zuccheri: 3.5, grassi: 0.2, grassiSaturi: 0, fibre: 3, sodio: 2 },
  },
  {
    id: 'asparagi',
    nome: 'Asparagi (cotti)',
    categoria: 'verdure',
    nutrienti: { calorie: 22, proteine: 2.4, carboidrati: 3.9, zuccheri: 1.9, grassi: 0.2, grassiSaturi: 0.1, fibre: 2.2, sodio: 14 },
  },
  {
    id: 'cavolo',
    nome: 'Cavolo cappuccio',
    categoria: 'verdure',
    nutrienti: { calorie: 25, proteine: 1.3, carboidrati: 5.8, zuccheri: 3.2, grassi: 0.1, grassiSaturi: 0, fibre: 2.5, sodio: 18 },
  },

  // ── FRUTTA ────────────────────────────────────────────────────────────────
  {
    id: 'mele',
    nome: 'Mele',
    categoria: 'frutta',
    nutrienti: { calorie: 52, proteine: 0.3, carboidrati: 14, zuccheri: 10, grassi: 0.2, grassiSaturi: 0, fibre: 2.4, sodio: 1 },
  },
  {
    id: 'banane',
    nome: 'Banane',
    categoria: 'frutta',
    nutrienti: { calorie: 89, proteine: 1.1, carboidrati: 23, zuccheri: 12, grassi: 0.3, grassiSaturi: 0.1, fibre: 2.6, sodio: 1 },
  },
  {
    id: 'arance',
    nome: 'Arance',
    categoria: 'frutta',
    nutrienti: { calorie: 47, proteine: 0.9, carboidrati: 12, zuccheri: 9.4, grassi: 0.1, grassiSaturi: 0, fibre: 2.4, sodio: 0 },
  },
  {
    id: 'fragole',
    nome: 'Fragole',
    categoria: 'frutta',
    nutrienti: { calorie: 32, proteine: 0.7, carboidrati: 7.7, zuccheri: 4.9, grassi: 0.3, grassiSaturi: 0, fibre: 2, sodio: 1 },
  },
  {
    id: 'kiwi',
    nome: 'Kiwi',
    categoria: 'frutta',
    nutrienti: { calorie: 61, proteine: 1.1, carboidrati: 15, zuccheri: 9, grassi: 0.5, grassiSaturi: 0, fibre: 3, sodio: 3 },
  },
  {
    id: 'uva',
    nome: 'Uva',
    categoria: 'frutta',
    nutrienti: { calorie: 69, proteine: 0.7, carboidrati: 18, zuccheri: 16, grassi: 0.2, grassiSaturi: 0, fibre: 0.9, sodio: 2 },
  },
  {
    id: 'pere',
    nome: 'Pere',
    categoria: 'frutta',
    nutrienti: { calorie: 57, proteine: 0.4, carboidrati: 15, zuccheri: 9.8, grassi: 0.1, grassiSaturi: 0, fibre: 3.1, sodio: 1 },
  },
  {
    id: 'pesche',
    nome: 'Pesche',
    categoria: 'frutta',
    nutrienti: { calorie: 39, proteine: 0.9, carboidrati: 9.5, zuccheri: 8.4, grassi: 0.3, grassiSaturi: 0, fibre: 1.5, sodio: 0 },
  },
  {
    id: 'melone',
    nome: 'Melone',
    categoria: 'frutta',
    nutrienti: { calorie: 34, proteine: 0.8, carboidrati: 8.2, zuccheri: 7.9, grassi: 0.2, grassiSaturi: 0, fibre: 0.9, sodio: 16 },
  },
  {
    id: 'ananas',
    nome: 'Ananas',
    categoria: 'frutta',
    nutrienti: { calorie: 50, proteine: 0.5, carboidrati: 13, zuccheri: 9.9, grassi: 0.1, grassiSaturi: 0, fibre: 1.4, sodio: 1 },
  },

  // ── GRASSI E CONDIMENTI ───────────────────────────────────────────────────
  {
    id: 'olio-oliva',
    nome: 'Olio extravergine di oliva',
    categoria: 'grassi',
    nutrienti: { calorie: 884, proteine: 0, carboidrati: 0, zuccheri: 0, grassi: 100, grassiSaturi: 14, fibre: 0, sodio: 2 },
  },
  {
    id: 'burro',
    nome: 'Burro',
    categoria: 'grassi',
    nutrienti: { calorie: 717, proteine: 0.9, carboidrati: 0.1, zuccheri: 0.1, grassi: 80, grassiSaturi: 51, fibre: 0, sodio: 643 },
  },
  {
    id: 'avocado',
    nome: 'Avocado',
    categoria: 'grassi',
    nutrienti: { calorie: 160, proteine: 2, carboidrati: 9, zuccheri: 0.7, grassi: 15, grassiSaturi: 2.1, fibre: 7, sodio: 7 },
  },
  {
    id: 'noci',
    nome: 'Noci',
    categoria: 'grassi',
    nutrienti: { calorie: 654, proteine: 15, carboidrati: 14, zuccheri: 2.6, grassi: 65, grassiSaturi: 6, fibre: 6.7, sodio: 2 },
  },
  {
    id: 'mandorle',
    nome: 'Mandorle',
    categoria: 'grassi',
    nutrienti: { calorie: 579, proteine: 21, carboidrati: 22, zuccheri: 4.4, grassi: 50, grassiSaturi: 3.8, fibre: 12.5, sodio: 1 },
  },
  {
    id: 'arachidi',
    nome: 'Arachidi',
    categoria: 'grassi',
    nutrienti: { calorie: 567, proteine: 26, carboidrati: 16, zuccheri: 4.7, grassi: 49, grassiSaturi: 6.8, fibre: 8.5, sodio: 18 },
  },

  // ── DOLCI ─────────────────────────────────────────────────────────────────
  {
    id: 'cioccolato-fondente',
    nome: 'Cioccolato fondente (70%)',
    categoria: 'dolci',
    nutrienti: { calorie: 598, proteine: 8, carboidrati: 46, zuccheri: 26, grassi: 43, grassiSaturi: 25, fibre: 11, sodio: 20 },
  },
  {
    id: 'biscotti-frollini',
    nome: 'Biscotti frollini',
    categoria: 'dolci',
    nutrienti: { calorie: 468, proteine: 7, carboidrati: 68, zuccheri: 22, grassi: 19, grassiSaturi: 9, fibre: 2, sodio: 200 },
  },
  {
    id: 'miele',
    nome: 'Miele',
    categoria: 'dolci',
    nutrienti: { calorie: 304, proteine: 0.3, carboidrati: 82, zuccheri: 82, grassi: 0, grassiSaturi: 0, fibre: 0.2, sodio: 4 },
  },
  {
    id: 'marmellata',
    nome: 'Marmellata di frutta',
    categoria: 'dolci',
    nutrienti: { calorie: 250, proteine: 0.4, carboidrati: 62, zuccheri: 47, grassi: 0.1, grassiSaturi: 0, fibre: 1, sodio: 20 },
  },

  // ── BEVANDE ───────────────────────────────────────────────────────────────
  {
    id: 'succo-arancia',
    nome: 'Succo d\'arancia (fresco)',
    categoria: 'bevande',
    nutrienti: { calorie: 45, proteine: 0.7, carboidrati: 10, zuccheri: 8.4, grassi: 0.2, grassiSaturi: 0, fibre: 0.2, sodio: 1 },
  },
  {
    id: 'latte-soia',
    nome: 'Latte di soia (non zuccherato)',
    categoria: 'bevande',
    nutrienti: { calorie: 44, proteine: 3.3, carboidrati: 2.8, zuccheri: 1, grassi: 2, grassiSaturi: 0.3, fibre: 0.6, sodio: 51 },
  },
  {
    id: 'caffe-espresso',
    nome: 'Caffè espresso',
    categoria: 'bevande',
    nutrienti: { calorie: 2, proteine: 0.1, carboidrati: 0.2, zuccheri: 0, grassi: 0.1, grassiSaturi: 0, fibre: 0, sodio: 2 },
  },
];

export const CATEGORIE_LABELS: Record<string, string> = {
  cereali: 'Cereali e derivati',
  carni: 'Carni e salumi',
  pesce: 'Pesce',
  latticini: 'Latticini e formaggi',
  legumi: 'Legumi',
  verdure: 'Verdure',
  frutta: 'Frutta',
  grassi: 'Grassi, noci e semi',
  dolci: 'Dolci e zuccheri',
  bevande: 'Bevande',
  altro: 'Altro',
};
