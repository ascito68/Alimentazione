import { useMemo } from 'react';
import { Flame, Plus, Trash2, User } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { DATABASE_ATTIVITA, CATEGORIE_ATTIVITA } from '../data/activitiesDatabase';
import { useStore } from '../store/useStore';

export function ActivityPanel() {
  const { pesoAttivita, setPesoAttivita, vociAttivita, setVociAttivita } = useStore();

  function aggiungi() {
    setVociAttivita([...vociAttivita, { id: uuidv4(), attivitaId: 'camminata-normale', durata: 30 }]);
  }

  function rimuovi(id: string) {
    setVociAttivita(vociAttivita.filter(v => v.id !== id));
  }

  function aggiorna(id: string, campo: 'attivitaId' | 'durata', valore: string | number) {
    setVociAttivita(vociAttivita.map(v => v.id === id ? { ...v, [campo]: valore } : v));
  }

  const perCategoria = useMemo(() => {
    const mappa: Record<string, typeof DATABASE_ATTIVITA> = {};
    for (const a of DATABASE_ATTIVITA) {
      if (!mappa[a.categoria]) mappa[a.categoria] = [];
      mappa[a.categoria].push(a);
    }
    return mappa;
  }, []);

  const kcalPerVoce = useMemo(() =>
    vociAttivita.map(v => {
      const att = DATABASE_ATTIVITA.find(a => a.id === v.attivitaId);
      if (!att) return 0;
      return Math.round(att.met * pesoAttivita * (v.durata / 60));
    }),
    [vociAttivita, pesoAttivita]
  );

  const totale = kcalPerVoce.reduce((s, k) => s + k, 0);
  const durataTotale = vociAttivita.reduce((s, v) => s + v.durata, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4">🏃 Calorie consumate per attività</h2>

        {/* Peso */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-1">
            <User size={13} /> Peso corporeo (kg)
          </label>
          <input
            type="number"
            min={30}
            max={200}
            value={pesoAttivita}
            onChange={e => setPesoAttivita(parseFloat(e.target.value) || 70)}
            className="w-32 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Lista attività */}
        <div className="space-y-2">
          {vociAttivita.map((voce, i) => (
            <div key={voce.id} className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <span className="text-xs font-bold text-gray-400 w-5 text-center">{i + 1}</span>

              <select
                value={voce.attivitaId}
                onChange={e => aggiorna(voce.id, 'attivitaId', e.target.value)}
                className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              >
                {Object.entries(perCategoria).map(([cat, lista]) => (
                  <optgroup key={cat} label={CATEGORIE_ATTIVITA[cat]}>
                    {lista.map(a => (
                      <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={480}
                  value={voce.durata}
                  onChange={e => aggiorna(voce.id, 'durata', parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <span className="text-xs text-gray-400">min</span>
              </div>

              <span className="text-sm font-semibold text-emerald-600 w-16 text-right">
                {kcalPerVoce[i]} kcal
              </span>

              <button
                onClick={() => rimuovi(voce.id)}
                disabled={vociAttivita.length === 1}
                className="p-1.5 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-20"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Aggiungi riga */}
        <button
          onClick={aggiungi}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-emerald-300 hover:text-emerald-500 transition-colors"
        >
          <Plus size={15} /> Aggiungi attività
        </button>

        {/* Totale */}
        <div className="mt-4 bg-emerald-50 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-emerald-500 rounded-xl p-3">
            <Flame size={28} className="text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-700">
              {totale} <span className="text-lg font-medium">kcal</span>
            </p>
            <p className="text-sm text-emerald-600">
              {vociAttivita.length} {vociAttivita.length === 1 ? 'attività' : 'attività'} · {durataTotale} min totali · {pesoAttivita} kg
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Formula: kcal = MET × peso(kg) × ore. Valori indicativi (Compendium of Physical Activities).
          I dati vengono salvati automaticamente.
        </p>
      </div>
    </div>
  );
}
