import { useMemo } from 'react';
import { useStore } from '../store/useStore';

const LIVELLI_ATTIVITA = [
  { id: 'sedentario', label: 'Sedentario',          desc: 'Poco o nessun esercizio',        fattore: 1.2   },
  { id: 'leggero',    label: 'Leggermente attivo',   desc: '1–3 allenamenti/settimana',      fattore: 1.375 },
  { id: 'moderato',   label: 'Moderatamente attivo', desc: '3–5 allenamenti/settimana',      fattore: 1.55  },
  { id: 'molto',      label: 'Molto attivo',         desc: '6–7 allenamenti/settimana',      fattore: 1.725 },
  { id: 'estremo',    label: 'Estremamente attivo',  desc: 'Atleta o lavoro fisico intenso', fattore: 1.9   },
];

export function BMRPanel() {
  const { impostazioni, bmr, setBmr } = useStore();

  const calcolaBmr = useMemo(() => {
    if (bmr.sesso === 'M') {
      return Math.round(88.362 + 13.397 * bmr.peso + 4.799 * bmr.altezza - 5.677 * bmr.eta);
    } else {
      return Math.round(447.593 + 9.247 * bmr.peso + 3.098 * bmr.altezza - 4.330 * bmr.eta);
    }
  }, [bmr.sesso, bmr.eta, bmr.altezza, bmr.peso]);

  const fattore = LIVELLI_ATTIVITA.find(l => l.id === bmr.livello)!.fattore;
  const tdee = Math.round(calcolaBmr * fattore);
  const diff = tdee - impostazioni.targetCalorie;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-bold text-gray-800 mb-1">🔥 Metabolismo basale (BMR)</h2>
      <p className="text-xs text-gray-400 mb-4">Formula di Harris-Benedict (rivista 1984) — dati salvati automaticamente</p>

      <div className="space-y-3">
        {/* Sesso */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Sesso</label>
          <div className="grid grid-cols-2 gap-2">
            {(['M', 'F'] as const).map(s => (
              <button
                key={s}
                onClick={() => setBmr({ sesso: s })}
                className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                  bmr.sesso === s
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s === 'M' ? '♂ Uomo' : '♀ Donna'}
              </button>
            ))}
          </div>
        </div>

        {/* Età / Altezza / Peso */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Età (anni)',    value: bmr.eta,     field: 'eta'     as const, min: 10,  max: 100 },
            { label: 'Altezza (cm)', value: bmr.altezza, field: 'altezza' as const, min: 100, max: 250 },
            { label: 'Peso (kg)',    value: bmr.peso,    field: 'peso'    as const, min: 30,  max: 250 },
          ].map(f => (
            <div key={f.field}>
              <label className="text-xs font-medium text-gray-600 block mb-1">{f.label}</label>
              <input
                type="number"
                min={f.min}
                max={f.max}
                value={f.value}
                onChange={e => setBmr({ [f.field]: parseFloat(e.target.value) || f.min })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          ))}
        </div>

        {/* Livello attività */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Livello di attività</label>
          <select
            value={bmr.livello}
            onChange={e => setBmr({ livello: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
          >
            {LIVELLI_ATTIVITA.map(l => (
              <option key={l.id} value={l.id}>{l.label} — {l.desc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Risultati */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Metabolismo basale</p>
          <p className="text-2xl font-bold text-gray-800">{calcolaBmr}</p>
          <p className="text-xs text-gray-400">kcal/giorno a riposo</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <p className="text-xs text-emerald-600 mb-1">Fabbisogno giornaliero</p>
          <p className="text-2xl font-bold text-emerald-700">{tdee}</p>
          <p className="text-xs text-emerald-500">kcal/giorno (TDEE)</p>
        </div>
      </div>

      {/* Confronto con target */}
      {impostazioni.targetCalorie > 0 && (
        <div className={`mt-3 rounded-xl px-4 py-3 text-sm ${
          Math.abs(diff) <= 150
            ? 'bg-emerald-50 text-emerald-700'
            : diff > 0
              ? 'bg-amber-50 text-amber-700'
              : 'bg-blue-50 text-blue-700'
        }`}>
          {Math.abs(diff) <= 150 ? (
            <span>✅ Il tuo target di <strong>{impostazioni.targetCalorie} kcal</strong> è allineato al fabbisogno.</span>
          ) : diff > 0 ? (
            <span>⚠️ Il tuo target (<strong>{impostazioni.targetCalorie} kcal</strong>) è <strong>{Math.abs(diff)} kcal</strong> sotto il fabbisogno — deficit calorico.</span>
          ) : (
            <span>ℹ️ Il tuo target (<strong>{impostazioni.targetCalorie} kcal</strong>) è <strong>{Math.abs(diff)} kcal</strong> sopra il fabbisogno — surplus calorico.</span>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        BMR = calorie consumate a completo riposo. TDEE = BMR × fattore attività ({fattore}).
      </p>
    </div>
  );
}
