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

interface AppState {
  giorni: GiornoAlimentare[];
  dataSelezionata: string;
  impostazioni: ImpostazioniUtente;
  google: ImpostazioniGoogle;

  // navigazione
  setDataSelezionata: (data: string) => void;
  giornoCorrente: () => GiornoAlimentare;

  // gestione pasti
  aggiungiBrano: (tipo: TipoPasto, alimento: Alimento, grammi: number) => void;
  rimuoviBrano: (tipo: TipoPasto, voceId: string) => void;
  aggiornaBrano: (tipo: TipoPasto, voceId: string, grammi: number) => void;

  // impostazioni utente
  setImpostazioni: (imp: Partial<ImpostazioniUtente>) => void;

  // google
  setGoogle: (g: Partial<ImpostazioniGoogle>) => void;
  clearToken: () => void;
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
      google: {
        clientId: '',
        spreadsheetId: null,
        accessToken: null,
        tokenExpiry: null,
      },

      setDataSelezionata: (data) => {
        set((s) => {
          const esiste = s.giorni.some(g => g.data === data);
          if (!esiste) {
            return {
              dataSelezionata: data,
              giorni: [...s.giorni, creaGiornoVuoto(data)],
            };
          }
          return { dataSelezionata: data };
        });
      },

      giornoCorrente: () => {
        const { giorni, dataSelezionata } = get();
        let giorno = giorni.find(g => g.data === dataSelezionata);
        if (!giorno) {
          giorno = creaGiornoVuoto(dataSelezionata);
        }
        return giorno;
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

        set((s) => {
          const esisteGiorno = s.giorni.some(g => g.data === dataSelezionata);
          const giorni = esisteGiorno
            ? s.giorni
            : [...s.giorni, creaGiornoVuoto(dataSelezionata)];

          return {
            giorni: giorni.map(g => {
              if (g.data !== dataSelezionata) return g;
              return {
                ...g,
                pasti: {
                  ...g.pasti,
                  [tipo]: {
                    ...g.pasti[tipo],
                    voci: [...g.pasti[tipo].voci, nuovaVoce],
                  },
                },
              };
            }),
          };
        });
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
                [tipo]: {
                  ...g.pasti[tipo],
                  voci: g.pasti[tipo].voci.filter(v => v.id !== voceId),
                },
              },
            };
          }),
        }));
      },

      aggiornaBrano: (tipo, voceId, grammi) => {
        const { dataSelezionata, giorni } = get();
        const giorno = giorni.find(g => g.data === dataSelezionata);
        if (!giorno) return;
        const voce = giorno.pasti[tipo].voci.find(v => v.id === voceId);
        if (!voce) return;

        const fattoreOriginale = 100 / voce.grammi;
        const nutrientiBase = {
          calorie: voce.nutrienti.calorie * fattoreOriginale,
          proteine: voce.nutrienti.proteine * fattoreOriginale,
          carboidrati: voce.nutrienti.carboidrati * fattoreOriginale,
          zuccheri: voce.nutrienti.zuccheri * fattoreOriginale,
          grassi: voce.nutrienti.grassi * fattoreOriginale,
          grassiSaturi: voce.nutrienti.grassiSaturi * fattoreOriginale,
          fibre: voce.nutrienti.fibre * fattoreOriginale,
          sodio: voce.nutrienti.sodio * fattoreOriginale,
        };

        set((s) => ({
          giorni: s.giorni.map(g => {
            if (g.data !== dataSelezionata) return g;
            return {
              ...g,
              pasti: {
                ...g.pasti,
                [tipo]: {
                  ...g.pasti[tipo],
                  voci: g.pasti[tipo].voci.map(v => {
                    if (v.id !== voceId) return v;
                    return {
                      ...v,
                      grammi,
                      nutrienti: calcolaNutrienti(nutrientiBase, grammi),
                    };
                  }),
                },
              },
            };
          }),
        }));
      },

      setImpostazioni: (imp) =>
        set((s) => ({ impostazioni: { ...s.impostazioni, ...imp } })),

      setGoogle: (g) =>
        set((s) => ({ google: { ...s.google, ...g } })),

      clearToken: () =>
        set((s) => ({ google: { ...s.google, accessToken: null, tokenExpiry: null } })),
    }),
    { name: 'nutritrack-storage' }
  )
);
