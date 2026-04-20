export interface Nutrienti {
  calorie: number;
  proteine: number;
  carboidrati: number;
  zuccheri: number;
  grassi: number;
  grassiSaturi: number;
  fibre: number;
  sodio: number;
}

export type CategoriaAlimento =
  | 'cereali'
  | 'carni'
  | 'pesce'
  | 'latticini'
  | 'legumi'
  | 'verdure'
  | 'frutta'
  | 'grassi'
  | 'dolci'
  | 'bevande'
  | 'altro';

export interface Alimento {
  id: string;
  nome: string;
  categoria: CategoriaAlimento;
  nutrienti: Nutrienti;
}

export interface VoceAlimento {
  id: string;
  alimentoId: string;
  nomeAlimento: string;
  grammi: number;
  nutrienti: Nutrienti;
}

export type TipoPasto = 'colazione' | 'pranzo' | 'spuntino' | 'cena';

export interface Pasto {
  tipo: TipoPasto;
  voci: VoceAlimento[];
}

export interface GiornoAlimentare {
  data: string;
  pasti: {
    colazione: Pasto;
    pranzo: Pasto;
    spuntino: Pasto;
    cena: Pasto;
  };
}

export interface PercentualiMacro {
  percentualeProteine: number;
  percentualeCarboidrati: number;
  percentualeGrassi: number;
}

export interface NutrientiConPercentuali extends Nutrienti, PercentualiMacro {}

export interface ImpostazioniUtente {
  nome: string;
  targetCalorie: number;
  targetProteine: number;
  targetCarboidrati: number;
  targetGrassi: number;
  targetFibre: number;
}

export interface ImpostazioniGoogle {
  clientId: string;
  spreadsheetId: string | null;
  accessToken: string | null;
  tokenExpiry: number | null;
}

export const PASTO_CONFIG: Record<TipoPasto, { label: string; icon: string; colore: string; orario: string }> = {
  colazione: { label: 'Colazione', icon: '☀️', colore: '#F59E0B', orario: '07:00 – 10:00' },
  pranzo: { label: 'Pranzo', icon: '🌿', colore: '#10B981', orario: '12:00 – 14:00' },
  spuntino: { label: 'Spuntino', icon: '🍎', colore: '#F97316', orario: '10:00 – 16:00' },
  cena: { label: 'Cena', icon: '🌙', colore: '#6366F1', orario: '19:00 – 21:00' },
};

export const RDA: Nutrienti = {
  calorie: 2000,
  proteine: 50,
  carboidrati: 260,
  zuccheri: 90,
  grassi: 70,
  grassiSaturi: 20,
  fibre: 25,
  sodio: 2000,
};
