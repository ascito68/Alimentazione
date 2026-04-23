import { Nutrienti, Pasto, GiornoAlimentare, TipoPasto, RDA } from '../types';

export const NUTRIENTI_ZERO: Nutrienti = {
  calorie: 0, proteine: 0, carboidrati: 0, zuccheri: 0,
  grassi: 0, grassiSaturi: 0, fibre: 0, sodio: 0,
};

export function calcolaNutrienti(nutrientiPer100g: Nutrienti, grammi: number): Nutrienti {
  const fattore = grammi / 100;
  return {
    calorie: Math.round(nutrientiPer100g.calorie * fattore * 10) / 10,
    proteine: Math.round(nutrientiPer100g.proteine * fattore * 10) / 10,
    carboidrati: Math.round(nutrientiPer100g.carboidrati * fattore * 10) / 10,
    zuccheri: Math.round(nutrientiPer100g.zuccheri * fattore * 10) / 10,
    grassi: Math.round(nutrientiPer100g.grassi * fattore * 10) / 10,
    grassiSaturi: Math.round(nutrientiPer100g.grassiSaturi * fattore * 10) / 10,
    fibre: Math.round(nutrientiPer100g.fibre * fattore * 10) / 10,
    sodio: Math.round(nutrientiPer100g.sodio * fattore * 10) / 10,
  };
}

export function sommaNutrienti(lista: Nutrienti[]): Nutrienti {
  return lista.reduce((acc, n) => ({
    calorie: Math.round((acc.calorie + n.calorie) * 10) / 10,
    proteine: Math.round((acc.proteine + n.proteine) * 10) / 10,
    carboidrati: Math.round((acc.carboidrati + n.carboidrati) * 10) / 10,
    zuccheri: Math.round((acc.zuccheri + n.zuccheri) * 10) / 10,
    grassi: Math.round((acc.grassi + n.grassi) * 10) / 10,
    grassiSaturi: Math.round((acc.grassiSaturi + n.grassiSaturi) * 10) / 10,
    fibre: Math.round((acc.fibre + n.fibre) * 10) / 10,
    sodio: Math.round((acc.sodio + n.sodio) * 10) / 10,
  }), { ...NUTRIENTI_ZERO });
}

export function totalePasto(pasto: Pasto): Nutrienti {
  return sommaNutrienti(pasto.voci.map(v => v.nutrienti));
}

export function totaleGiorno(giorno: GiornoAlimentare): Nutrienti {
  const pasti = Object.values(giorno.pasti);
  return sommaNutrienti(pasti.map(totalePasto));
}

export function percentualiMacro(nutrienti: Nutrienti): {
  percentualeProteine: number;
  percentualeCarboidrati: number;
  percentualeGrassi: number;
} {
  const calProteine = nutrienti.proteine * 4;
  const calCarbo = nutrienti.carboidrati * 4;
  const calGrassi = nutrienti.grassi * 9;
  const totCal = calProteine + calCarbo + calGrassi;

  if (totCal === 0) return { percentualeProteine: 0, percentualeCarboidrati: 0, percentualeGrassi: 0 };

  return {
    percentualeProteine: Math.round((calProteine / totCal) * 100),
    percentualeCarboidrati: Math.round((calCarbo / totCal) * 100),
    percentualeGrassi: Math.round((calGrassi / totCal) * 100),
  };
}

export function percentualeRDA(nutrienti: Nutrienti): Partial<Record<keyof Nutrienti, number>> {
  return {
    calorie: Math.min(Math.round((nutrienti.calorie / RDA.calorie) * 100), 999),
    proteine: Math.min(Math.round((nutrienti.proteine / RDA.proteine) * 100), 999),
    carboidrati: Math.min(Math.round((nutrienti.carboidrati / RDA.carboidrati) * 100), 999),
    zuccheri: Math.min(Math.round((nutrienti.zuccheri / RDA.zuccheri) * 100), 999),
    grassi: Math.min(Math.round((nutrienti.grassi / RDA.grassi) * 100), 999),
    grassiSaturi: Math.min(Math.round((nutrienti.grassiSaturi / RDA.grassiSaturi) * 100), 999),
    fibre: Math.min(Math.round((nutrienti.fibre / RDA.fibre) * 100), 999),
    sodio: Math.min(Math.round((nutrienti.sodio / RDA.sodio) * 100), 999),
  };
}

export function totalePastoPerGiorno(
  giorno: GiornoAlimentare,
  tipo: TipoPasto
): { nutrienti: Nutrienti; percentualeGiorno: number } {
  const tot = totalePasto(giorno.pasti[tipo]);
  const totGiorno = totaleGiorno(giorno);
  const perc = totGiorno.calorie > 0
    ? Math.round((tot.calorie / totGiorno.calorie) * 100)
    : 0;
  return { nutrienti: tot, percentualeGiorno: perc };
}

export function creaGiornoVuoto(data: string): GiornoAlimentare {
  const pastoBuild = (tipo: TipoPasto): Pasto => ({ tipo, voci: [] });
  return {
    data,
    pasti: {
      colazione: pastoBuild('colazione'),
      pranzo: pastoBuild('pranzo'),
      spuntino: pastoBuild('spuntino'),
      cena: pastoBuild('cena'),
    },
  };
}

export function formatData(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function oggiISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const g = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${g}`;
}

export function settimanaRange(data: string): { inizio: string; fine: string } {
  const d = new Date(data);
  const giorno = d.getDay();
  const diff = d.getDate() - giorno + (giorno === 0 ? -6 : 1);
  const lun = new Date(d.setDate(diff));
  const dom = new Date(lun);
  dom.setDate(dom.getDate() + 6);
  return {
    inizio: lun.toISOString().split('T')[0],
    fine: dom.toISOString().split('T')[0],
  };
}

export function meseRange(data: string): { inizio: string; fine: string } {
  const [y, m] = data.split('-').map(Number);
  const inizio = `${y}-${String(m).padStart(2, '0')}-01`;
  const fine = new Date(y, m, 0).toISOString().split('T')[0];
  return { inizio, fine };
}

export function giorniInRange(inizio: string, fine: string): string[] {
  const result: string[] = [];
  const cur = new Date(inizio);
  const end = new Date(fine);
  while (cur <= end) {
    result.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}
