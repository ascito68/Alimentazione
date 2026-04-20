import { GiornoAlimentare, TipoPasto, PASTO_CONFIG } from '../types';
import {
  totaleGiorno,
  totalePasto,
  percentualiMacro,
  formatData,
  settimanaRange,
  meseRange,
  NUTRIENTI_ZERO,
  sommaNutrienti,
} from './calculations';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

export async function richiestaToken(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services non caricato. Ricarica la pagina.'));
      return;
    }
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error ?? 'Autenticazione fallita'));
        } else {
          resolve(resp.access_token);
        }
      },
    });
    client.requestAccessToken();
  });
}

async function sheetsRequest<T>(
  method: string,
  url: string,
  token: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } })?.error?.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function creaFoglio(token: string): Promise<string> {
  const body = {
    properties: { title: `NutriTrack – ${new Date().toLocaleDateString('it-IT')}` },
    sheets: [
      { properties: { title: 'Giornaliero', sheetId: 0 } },
      { properties: { title: 'Settimanale', sheetId: 1 } },
      { properties: { title: 'Mensile', sheetId: 2 } },
      { properties: { title: 'Storico', sheetId: 3 } },
    ],
  };
  const res = await sheetsRequest<{ spreadsheetId: string }>('POST', SHEETS_API, token, body);
  return res.spreadsheetId;
}

function intestazione(): string[][] {
  return [[
    'Data', 'Pasto', 'Alimento', 'Grammi',
    'Calorie (kcal)', 'Proteine (g)', 'Carb. (g)', 'Zuccheri (g)',
    'Grassi (g)', 'Grassi Saturi (g)', 'Fibre (g)', 'Sodio (mg)',
    '% Proteine', '% Carb.', '% Grassi',
  ]];
}

function righeGiorno(giorno: GiornoAlimentare): string[][] {
  const righe: string[][] = [];
  const tipiPasto: TipoPasto[] = ['colazione', 'pranzo', 'spuntino', 'cena'];

  for (const tipo of tipiPasto) {
    const pasto = giorno.pasti[tipo];
    for (const voce of pasto.voci) {
      const p = percentualiMacro(voce.nutrienti);
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
        `${p.percentualeProteine}%`,
        `${p.percentualeCarboidrati}%`,
        `${p.percentualeGrassi}%`,
      ]);
    }

    if (pasto.voci.length > 0) {
      const tot = totalePasto(pasto);
      const p = percentualiMacro(tot);
      righe.push([
        '', `TOTALE ${PASTO_CONFIG[tipo].label.toUpperCase()}`, '', '',
        String(tot.calorie), String(tot.proteine), String(tot.carboidrati),
        String(tot.zuccheri), String(tot.grassi), String(tot.grassiSaturi),
        String(tot.fibre), String(tot.sodio),
        `${p.percentualeProteine}%`, `${p.percentualeCarboidrati}%`, `${p.percentualeGrassi}%`,
      ]);
    }
  }

  const totG = totaleGiorno(giorno);
  const pG = percentualiMacro(totG);
  righe.push([
    formatData(giorno.data), 'TOTALE GIORNO', '', '',
    String(totG.calorie), String(totG.proteine), String(totG.carboidrati),
    String(totG.zuccheri), String(totG.grassi), String(totG.grassiSaturi),
    String(totG.fibre), String(totG.sodio),
    `${pG.percentualeProteine}%`, `${pG.percentualeCarboidrati}%`, `${pG.percentualeGrassi}%`,
  ]);

  return righe;
}

function righeRiepilogo(
  giorni: GiornoAlimentare[],
  titoloColonna: string
): string[][] {
  const intestazRiep: string[][] = [[
    titoloColonna, 'Cal. Totali', 'Proteine (g)', 'Carb. (g)',
    'Grassi (g)', 'Fibre (g)', 'Sodio (mg)', '% Proteine', '% Carb.', '% Grassi',
  ]];

  for (const g of giorni) {
    const tot = totaleGiorno(g);
    const p = percentualiMacro(tot);
    intestazRiep.push([
      formatData(g.data),
      String(tot.calorie), String(tot.proteine), String(tot.carboidrati),
      String(tot.grassi), String(tot.fibre), String(tot.sodio),
      `${p.percentualeProteine}%`, `${p.percentualeCarboidrati}%`, `${p.percentualeGrassi}%`,
    ]);
  }

  if (giorni.length > 1) {
    const medie = sommaNutrienti(giorni.map(totaleGiorno));
    const n = giorni.length;
    const media = {
      ...NUTRIENTI_ZERO,
      calorie: Math.round(medie.calorie / n),
      proteine: Math.round(medie.proteine / n * 10) / 10,
      carboidrati: Math.round(medie.carboidrati / n * 10) / 10,
      grassi: Math.round(medie.grassi / n * 10) / 10,
      fibre: Math.round(medie.fibre / n * 10) / 10,
      sodio: Math.round(medie.sodio / n),
    };
    const pm = percentualiMacro(media);
    intestazRiep.push([
      'MEDIA',
      String(media.calorie), String(media.proteine), String(media.carboidrati),
      String(media.grassi), String(media.fibre), String(media.sodio),
      `${pm.percentualeProteine}%`, `${pm.percentualeCarboidrati}%`, `${pm.percentualeGrassi}%`,
    ]);
  }

  return intestazRiep;
}

async function scriviValori(
  token: string,
  spreadsheetId: string,
  range: string,
  values: string[][]
): Promise<void> {
  await sheetsRequest(
    'PUT',
    `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    token,
    { values }
  );
}

export async function esportaGiornaliero(
  token: string,
  spreadsheetId: string,
  giorno: GiornoAlimentare
): Promise<void> {
  const dati = [...intestazione(), ...righeGiorno(giorno)];
  await scriviValori(token, spreadsheetId, 'Giornaliero!A1', dati);
}

export async function esportaSettimanale(
  token: string,
  spreadsheetId: string,
  tuttiGiorni: GiornoAlimentare[],
  dataRiferimento: string
): Promise<void> {
  const { inizio, fine } = settimanaRange(dataRiferimento);
  const giorni = tuttiGiorni
    .filter(g => g.data >= inizio && g.data <= fine)
    .sort((a, b) => a.data.localeCompare(b.data));

  const dettaglio = giorni.flatMap(g => [intestazione()[0], ...righeGiorno(g), []]);

  await scriviValori(token, spreadsheetId, 'Settimanale!A1', dettaglio);
  await scriviValori(token, spreadsheetId, 'Settimanale!P1', righeRiepilogo(giorni, 'Data'));
}

export async function esportaMensile(
  token: string,
  spreadsheetId: string,
  tuttiGiorni: GiornoAlimentare[],
  dataRiferimento: string
): Promise<void> {
  const { inizio, fine } = meseRange(dataRiferimento);
  const giorni = tuttiGiorni
    .filter(g => g.data >= inizio && g.data <= fine)
    .sort((a, b) => a.data.localeCompare(b.data));

  const riepilogo = righeRiepilogo(giorni, 'Data');
  await scriviValori(token, spreadsheetId, 'Mensile!A1', riepilogo);

  const storico = [...intestazione(), ...giorni.flatMap(g => righeGiorno(g))];
  await scriviValori(token, spreadsheetId, 'Storico!A1', storico);
}

export async function esportaTutto(
  token: string,
  spreadsheetId: string,
  tuttiGiorni: GiornoAlimentare[],
  dataOggi: string
): Promise<void> {
  const oggi = tuttiGiorni.find(g => g.data === dataOggi);
  if (oggi) await esportaGiornaliero(token, spreadsheetId, oggi);
  await esportaSettimanale(token, spreadsheetId, tuttiGiorni, dataOggi);
  await esportaMensile(token, spreadsheetId, tuttiGiorni, dataOggi);
}
