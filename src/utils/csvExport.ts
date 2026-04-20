import { GiornoAlimentare, TipoPasto, PASTO_CONFIG } from '../types';
import { formatData, totaleGiorno, settimanaRange, meseRange } from './calculations';

function righeCSV(giorni: GiornoAlimentare[]): string[][] {
  const intestazione = [
    'Data', 'Pasto', 'Alimento', 'Grammi',
    'Calorie (kcal)', 'Proteine (g)', 'Carboidrati (g)',
    'Zuccheri (g)', 'Grassi (g)', 'Grassi Saturi (g)', 'Fibre (g)', 'Sodio (mg)',
  ];

  const righe: string[][] = [intestazione];
  const tipi: TipoPasto[] = ['colazione', 'pranzo', 'spuntino', 'cena'];

  for (const giorno of giorni) {
    for (const tipo of tipi) {
      for (const voce of giorno.pasti[tipo].voci) {
        righe.push([
          formatData(giorno.data),
          PASTO_CONFIG[tipo].label,
          voce.nomeAlimento,
          String(voce.grammi),
          String(voce.nutrienti.calorie),
          String(voce.nutrienti.proteine),
          String(voce.nutrienti.carboidrati),
          String(voce.nutrienti.zuccheri),
          String(voce.nutrienti.grassi),
          String(voce.nutrienti.grassiSaturi),
          String(voce.nutrienti.fibre),
          String(voce.nutrienti.sodio),
        ]);
      }
    }

    const tot = totaleGiorno(giorno);
    righe.push([
      formatData(giorno.data), 'TOTALE GIORNO', '', '',
      String(tot.calorie), String(tot.proteine), String(tot.carboidrati),
      String(tot.zuccheri), String(tot.grassi), String(tot.grassiSaturi),
      String(tot.fibre), String(tot.sodio),
    ]);
    righe.push([]);
  }

  return righe;
}

function scarica(righe: string[][], nomeFile: string): void {
  const csv = righe.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeFile;
  a.click();
  URL.revokeObjectURL(url);
}

export function scaricaCSVGiornaliero(giorno: GiornoAlimentare): void {
  scarica(righeCSV([giorno]), `NutriTrack_${giorno.data}.csv`);
}

export function scaricaCSVSettimanale(giorni: GiornoAlimentare[], dataRif: string): void {
  const { inizio, fine } = settimanaRange(dataRif);
  const filtrati = giorni.filter(g => g.data >= inizio && g.data <= fine)
    .sort((a, b) => a.data.localeCompare(b.data));
  scarica(righeCSV(filtrati), `NutriTrack_settimana_${inizio}.csv`);
}

export function scaricaCSVMensile(giorni: GiornoAlimentare[], dataRif: string): void {
  const { inizio, fine } = meseRange(dataRif);
  const filtrati = giorni.filter(g => g.data >= inizio && g.data <= fine)
    .sort((a, b) => a.data.localeCompare(b.data));
  const [y, m] = dataRif.split('-');
  scarica(righeCSV(filtrati), `NutriTrack_${y}-${m}.csv`);
}
