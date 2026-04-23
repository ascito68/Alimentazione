import { useMemo, useState } from 'react';
import { Wand2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const LIVELLI_ATTIVITA = [
  { id: 'sedentario', label: 'Sedentario',          desc: 'Poco o nessun esercizio',        fattore: 1.2   },
  { id: 'leggero',    label: 'Leggermente attivo',   desc: '1–3 allenamenti/settimana',      fattore: 1.375 },
  { id: 'moderato',   label: 'Moderatamente attivo', desc: '3–5 allenamenti/settimana',      fattore: 1.55  },
  { id: 'molto',      label: 'Molto attivo',         desc: '6–7 allenamenti/settimana',      fattore: 1.725 },
  { id: 'estremo',    label: 'Estremamente attivo',  desc: 'Atleta o lavoro fisico intenso', fattore: 1.9   },
];

const OBIETTIVI = [
  { id: 'dimagrimento',  label: '⬇️ Dimagrimento',    desc: 'Deficit -20%',   kcalFattore: 0.80, protGperKg: 1.6, grassiPerc: 0.28 },
  { id: 'mantenimento',  label: '⚖️ Mantenimento',    desc: 'Peso stabile',   kcalFattore: 1.00, protGperKg: 1.1, grassiPerc: 0.30 },
  { id: 'massa',         label: '⬆️ Aumento massa',   desc: 'Surplus +10%',   kcalFattore: 1.10, protGperKg: 1.8, grassiPerc: 0.25 },
];

/**
 * Calcola i macro consigliati in base a LARN 2014, EFSA e WHO:
 * - Proteine: g/kg peso (varia per obiettivo e livello attività)
 * - Grassi:   ~28-30% delle kcal target
 * - Carboidrati: quota residua (45-55% circa)
 * - Fibre: 25g (adulti, LARN/EFSA) → 30g per chi fa sport
 */
function calcolaMacro(tdee: number, peso: number, obiettivo: typeof OBIETTIVI[0], livello: string) {
  const kcalTarget = Math.round(tdee * obiettivo.kcalFattore);

  // Proteine: aumenta g/kg se molto attivo o atleta
  const bonusAttivita = (livello === 'molto' || livello === 'estremo') ? 0.2 : 0;
  const protGperKg = obiettivo.protGperKg + bonusAttivita;
  const proteine = Math.round(protGperKg * peso);

  // Grassi: % delle kcal target
  const grassi = Math.round((kcalTarget * obiettivo.grassiPerc) / 9);

  // Carboidrati: kcal rimanenti
  const kcalProt = proteine * 4;
  const kcalGrassi = grassi * 9;
  const carboidrati = Math.max(130, Math.round((kcalTarget - kcalProt - kcalGrassi) / 4));

  // Fibre: 25g base, 30g per atleti
  const fibre = (livello === 'molto' || livello === 'estremo') ? 30 : 25;

  return { kcalTarget, proteine, carboidrati, grassi, fibre, protGperKg: Math.round(protGperKg * 10) / 10 };
}

export function BMRPanel() {
  const { impostazioni, setImpostazioni, bmr, setBmr } = useStore();
  const [obiettivo, setObiettivo] = useState('mantenimento');
  const [applicato, setApplicato] = useState(false);

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

  const obj = OBIETTIVI.find(o => o.id === obiettivo)!;
  const macro = useMemo(
    () => calcolaMacro(tdee, bmr.peso, obj, bmr.livello),
    [tdee, bmr.peso, obj, bmr.livello]
  );

  function applicaObiettivi() {
    setImpostazioni({
      targetCalorie:     macro.kcalTarget,
      targetProteine:    macro.proteine,
      targetCarboidrati: macro.carboidrati,
      targetGrassi:      macro.grassi,
      targetFibre:       macro.fibre,
    });
    setApplicato(true);
    setTimeout(() => setApplicato(false), 2500);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-bold text-gray-800 mb-1">🔥 Metabolismo basale (BMR)</h2>
      <p className="text-xs text-gray-400 mb-4">
        Formula di Harris-Benedict (rivista 1984) — dati salvati automaticamente
      </p>

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

      {/* BMR / TDEE */}
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

      {/* Confronto con target attuale */}
      {impostazioni.targetCalorie > 0 && (
        <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm ${
          Math.abs(diff) <= 150 ? 'bg-emerald-50 text-emerald-700'
            : diff > 0 ? 'bg-amber-50 text-amber-700'
            : 'bg-blue-50 text-blue-700'
        }`}>
          {Math.abs(diff) <= 150
            ? <span>✅ Target attuale <strong>{impostazioni.targetCalorie} kcal</strong> — allineato al fabbisogno.</span>
            : diff > 0
              ? <span>⚠️ Target attuale <strong>{impostazioni.targetCalorie} kcal</strong> — deficit di <strong>{Math.abs(diff)} kcal</strong>.</span>
              : <span>ℹ️ Target attuale <strong>{impostazioni.targetCalorie} kcal</strong> — surplus di <strong>{Math.abs(diff)} kcal</strong>.</span>
          }
        </div>
      )}

      {/* ── Sezione obiettivi e macro scientifici ── */}
      <div className="mt-5 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          🎯 Calcolo macro personalizzato
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Basato su LARN 2014 (SINU), EFSA e WHO — proteine in g/kg peso corporeo.
        </p>

        {/* Obiettivo */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {OBIETTIVI.map(o => (
            <button
              key={o.id}
              onClick={() => setObiettivo(o.id)}
              className={`py-2.5 px-2 rounded-xl border text-center transition-colors ${
                obiettivo === o.id
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-sm font-medium leading-tight">{o.label}</div>
              <div className={`text-xs mt-0.5 ${obiettivo === o.id ? 'text-emerald-100' : 'text-gray-400'}`}>
                {o.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Preview macro consigliati */}
        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            Macro consigliati per {macro.kcalTarget} kcal/giorno
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {[
              { label: 'Calorie target', val: `${macro.kcalTarget} kcal`, note: '' },
              { label: 'Proteine',       val: `${macro.proteine} g`,      note: `${macro.protGperKg} g/kg` },
              { label: 'Carboidrati',    val: `${macro.carboidrati} g`,   note: `${Math.round(macro.carboidrati * 4 / macro.kcalTarget * 100)}% kcal` },
              { label: 'Grassi',         val: `${macro.grassi} g`,        note: `${Math.round(macro.grassi * 9 / macro.kcalTarget * 100)}% kcal` },
              { label: 'Fibre',          val: `${macro.fibre} g`,         note: 'LARN/EFSA' },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-baseline">
                <span className="text-xs text-gray-600">{r.label}</span>
                <span className="text-xs font-semibold text-gray-800">
                  {r.val}
                  {r.note && <span className="font-normal text-gray-400 ml-1">({r.note})</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={applicaObiettivi}
          className={`w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors ${
            applicato ? 'bg-emerald-500' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          <Wand2 size={15} />
          {applicato ? 'Obiettivi applicati!' : 'Applica agli obiettivi giornalieri'}
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">
          Sovrascrive i target nelle Impostazioni profilo.
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        BMR = calorie a riposo. TDEE = BMR × {fattore} (fattore attività).
      </p>
    </div>
  );
}
