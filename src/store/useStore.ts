import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  GiornoAlimentare,
  TipoPasto,
  Alimento,
  ImpostazioniUtente,
  ImpostazioniGoogle,
} from '../types';
import { calcolaNutrienti, creaGiornoVuoto, oggiISO } from '../utils/calculations';
import {
  caricaTuttiGiorni,
  inserisciVoce,
  eliminaVoce,
  aggiornaVoceSu,
  caricaImpostazioni,
  salvaImpostazioni,
  salvaImpostazioniGoogle,
} from '../lib/db';
import { supabaseConfigurato } from '../lib/supabase';

interface AppState {
  giorni: GiornoAlimentare[];
  dataSelezionata: string;
  impostazioni: ImpostazioniUtente;
  google: ImpostazioniGoogle;
  caricamento: boolean;

  setDataSelezionata: (data: string) => void;
  giornoCorrente: () => GiornoAlimentare;

  aggiungiBrano: (tipo: TipoPasto, alimento: Alimento, grammi: number) => void;
  rimuoviBrano: (tipo: TipoPasto, voceId: string) => void;
  aggiornaBrano: (tipo: TipoPasto, voceId: string, grammi: number) => void;

  setImpostazioni: (imp: Partial<ImpostazioniUtente>) => void;
  setGoogle: (g: Partial<ImpostazioniGoogle>) => void;
  clearToken: () => void;

  caricaDaSupabase: () => Promise<void>;
  resetDati: () => void;
}

const IMPOSTAZIONI_DEFAULT: ImpostazioniUtente = {
  nome: '',
  targetCalorie: 2000,
  targetProteine: 50,
  targetCarboidrati: 260,
  targetGrassi: 70,
  targetFibre: 25,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      giorni: [],
      dataSelezionata: oggiISO(),
      impostazioni: IMPOSTAZIONI_DEFAULT,
      google: { clientId: '', spreadsheetId: null, accessToken: null, tokenExpiry: null },
      caricamento: false,

      setDataSelezionata: (data) => {
        set((s) => {
          const esiste = s.giorni.some(g => g.data === data);
          return {
            dataSelezionata: data,
            giorni: esiste ? s.giorni : [...s.giorni, creaGiornoVuoto(data)],
          };
        });
      },

      giornoCorrente: () => {
        const { giorni, dataSelezionata } = get();
        return giorni.find(g => g.data === dataSelezionata) ?? creaGiornoVuoto(dataSelezionata);
      },

      aggiungiBrano: (tipo, alimento, grammi) => {
        const { dataSelezionata } = get();
        const nutrienti = calcolaNutrienti(alimento.nutrienti, grammi);
        const nuovaVoce = {
          id: uuidv4(),
          alimentoId: alimento.id,
          nomeAlimento: alimento.nome,
          grammi,
          nutrienti,
        };

        // Aggiornamento locale immediato (ottimistico)
        set((s) => {
          const esiste = s.giorni.some(g => g.data === dataSelezionata);
          const giorni = esiste ? s.giorni : [...s.giorni, creaGiornoVuoto(dataSelezionata)];
          return {
            giorni: giorni.map(g => {
              if (g.data !== dataSelezionata) return g;
              return {
                ...g,
                pasti: {
                  ...g.pasti,
                  [tipo]: { ...g.pasti[tipo], voci: [...g.pasti[tipo].voci, nuovaVoce] },
                },
              };
            }),
          };
        });

        // Sync Supabase in background
        if (supabaseConfigurato) {
          inserisciVoce(dataSelezionata, tipo, nuovaVoce).catch(console.error);
        }
      },

      rimuoviBrano: (tipo, voceId) => {
        const { dataSelezionata } = get();

        set((s) => ({
          giorni: s.giorni.map(g => {
            if (g.data !== dataSelezionata) return g;
            return {
              ...g,
              pasti: {
                ...g.pasti,
                [tipo]: { ...g.pasti[tipo], voci: g.pasti[tipo].voci.filter(v => v.id !== voceId) },
              },
            };
          }),
        }));

        if (supabaseConfigurato) {
          eliminaVoce(voceId).catch(console.error);
        }
      },

      aggiornaBrano: (tipo, voceId, grammi) => {
        const { dataSelezionata, giorni } = get();
        const giorno = giorni.find(g => g.data === dataSelezionata);
        if (!giorno) return;
        const voce = giorno.pasti[tipo].voci.find(v => v.id === voceId);
        if (!voce) return;

        const fattore = 100 / voce.grammi;
        const base = {
          calorie: voce.nutrienti.calorie * fattore,
          proteine: voce.nutrienti.proteine * fattore,
          carboidrati: voce.nutrienti.carboidrati * fattore,
          zuccheri: voce.nutrienti.zuccheri * fattore,
          grassi: voce.nutrienti.grassi * fattore,
          grassiSaturi: voce.nutrienti.grassiSaturi * fattore,
          fibre: voce.nutrienti.fibre * fattore,
          sodio: voce.nutrienti.sodio * fattore,
        };
        const nuoviNutrienti = calcolaNutrienti(base, grammi);

        set((s) => ({
          giorni: s.giorni.map(g => {
            if (g.data !== dataSelezionata) return g;
            return {
              ...g,
              pasti: {
                ...g.pasti,
                [tipo]: {
                  ...g.pasti[tipo],
                  voci: g.pasti[tipo].voci.map(v =>
                    v.id !== voceId ? v : { ...v, grammi, nutrienti: nuoviNutrienti }
                  ),
                },
              },
            };
          }),
        }));

        if (supabaseConfigurato) {
          aggiornaVoceSu(voceId, grammi, nuoviNutrienti).catch(console.error);
        }
      },

      setImpostazioni: (imp) => {
        set((s) => {
          const aggiornate = { ...s.impostazioni, ...imp };
          if (supabaseConfigurato) salvaImpostazioni(aggiornate).catch(console.error);
          return { impostazioni: aggiornate };
        });
      },

      setGoogle: (g) => {
        set((s) => {
          const aggiornato = { ...s.google, ...g };
          if (supabaseConfigurato) salvaImpostazioniGoogle(aggiornato).catch(console.error);
          return { google: aggiornato };
        });
      },
      clearToken: () => set((s) => ({ google: { ...s.google, accessToken: null, tokenExpiry: null } })),

      caricaDaSupabase: async () => {
        set({ caricamento: true });
        try {
          const [giorni, imp] = await Promise.all([
            caricaTuttiGiorni(),
            caricaImpostazioni(),
          ]);
          set((s) => ({
            giorni,
            impostazioni: imp.utente ? { ...s.impostazioni, ...imp.utente } : s.impostazioni,
            google: imp.google
              ? { ...s.google, clientId: imp.google.clientId ?? s.google.clientId, spreadsheetId: imp.google.spreadsheetId ?? s.google.spreadsheetId }
              : s.google,
            caricamento: false,
          }));
        } catch {
          set({ caricamento: false });
        }
      },

      resetDati: () => {
        set({
          giorni: [],
          dataSelezionata: oggiISO(),
          google: { clientId: '', spreadsheetId: null, accessToken: null, tokenExpiry: null },
        });
      },
    }),
    {
      name: 'nutritrack-storage',
      // Persiste solo le impostazioni offline; i dati vengono da Supabase
      partialize: (s) => ({ impostazioni: s.impostazioni, google: s.google }),
    }
  )
);
