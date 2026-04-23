import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';

const LIVELLI_ATTIVITA = [
  { id: 'sedentario',    label: 'Sedentario',              desc: 'Poco o nessun esercizio',         fattore: 1.2   },
  { id: 'leggero',       label: 'Leggermente attivo',       desc: '1–3 allenamenti/settimana',       fattore: 1.375 },
  { id: 'moderato',      label: 'Moderatamente attivo',     desc: '3–5 allenamenti/settimana',       fattore: 1.55  },
  { id: 'molto',         label: 'Molto attivo',             desc: '6–7 allenamenti/settimana',       fattore: 1.725 },
  { id: 'estremo',       label: 'Estremamente attivo',      desc: 'Atleta o lavoro fisico intenso',  fattore: 1.9   },
];

export function BMRPanel() {
  const { impostazioni } = useStore();

  const [sesso, setSesso] = useState<'M' | 'F'>('M');
  const [eta, setEta] = useState(30);
  const [altezza, setAltezza] = useState(170);
  const [peso, setPeso] = useState(70);
  const [livello, setLivello] = useState('moderato');

  // Harris-Benedict (versione rivista Roza & Shizgal 1984)
  const bmr = useMemo(() => {
    if (sesso === 'M') {
      return Math.round(88.362 + 13.397 * peso + 4.799 * altezza - 5.677 * eta);
    } else {
      return Math.round(447.593 + 9.247 * peso + 3.098 * altezza - 4.330 * eta);
    }
  }, [sesso, eta, altezza, peso]);

  const fattore = LIVELLI_ATTIVITA.find(l => l.id === livello)!.fattore;
  const tdee = Math.round(bmr * fattore);
  const diff = tdee - impostazioni.targetCalorie;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-bold text-gray-800 mb-1">🔥 Metabolismo basale (BMR)</h2>
      <p className="text-xs text-gray-400 mb-4">Formula di Harris-Benedict (rivista 1984)</p>

      <div className="space-y-3">
        {/* Sesso */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Sesso</label>
          <div className="grid grid-cols-2 gap-2">
            {(['M', 'F'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSesso(s)}
                className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                  sesso === s
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
            { label: 'Età (anni)', value: eta,     set: setEta,     min: 10, max: 100 },
            { label: 'Altezza (cm)', value: altezza, set: setAltezza, min: 100, max: 250 },
            { label: 'Peso (kg)',  value: peso,    set: setPeso,    min: 30,  max: 250 },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-medium text-gray-600 block mb-1">{f.label}</label>
              <input
                type="number"
                min={f.min}
                max={f.max}
                value={f.value}
                onChange={e => f.set(parseFloat(e.target.value) || f.min)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          ))}
        </div>

        {/* Livello attività */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Livello di attività</label>
          <select
            value={livello}
            onChange={e => setLivello(e.target.value)}
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
          <p className="text-2xl font-bold text-gray-800">{bmr}</p>
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
