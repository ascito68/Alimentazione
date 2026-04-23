import { useState, useMemo } from 'react';
import { Flame, Timer, User } from 'lucide-react';
import { DATABASE_ATTIVITA, CATEGORIE_ATTIVITA } from '../data/activitiesDatabase';

export function ActivityPanel() {
  const [peso, setPeso] = useState(70);
  const [attivitaId, setAttivitaId] = useState('corsa-moderata');
  const [durata, setDurata] = useState(30);

  const attivita = DATABASE_ATTIVITA.find(a => a.id === attivitaId)!;

  // kcal = MET × peso(kg) × ore
  const kcalBruciate = useMemo(
    () => Math.round(attivita.met * peso * (durata / 60)),
    [attivita, peso, durata]
  );

  // Raggruppa attività per categoria
  const perCategoria = useMemo(() => {
    const mappa: Record<string, typeof DATABASE_ATTIVITA> = {};
    for (const a of DATABASE_ATTIVITA) {
      if (!mappa[a.categoria]) mappa[a.categoria] = [];
      mappa[a.categoria].push(a);
    }
    return mappa;
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4">🏃 Calorie consumate per attività</h2>

        <div className="space-y-4">
          {/* Peso */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1 flex items-center gap-1">
              <User size={13} /> Peso corporeo (kg)
            </label>
            <input
              type="number"
              min={30}
              max={200}
              value={peso}
              onChange={e => setPeso(parseFloat(e.target.value) || 70)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Attività */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Attività
            </label>
            <select
              value={attivitaId}
              onChange={e => setAttivitaId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            >
              {Object.entries(perCategoria).map(([cat, lista]) => (
                <optgroup key={cat} label={CATEGORIE_ATTIVITA[cat]}>
                  {lista.map(a => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Durata */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1 flex items-center gap-1">
              <Timer size={13} /> Durata (minuti)
            </label>
            <input
              type="number"
              min={1}
              max={480}
              value={durata}
              onChange={e => setDurata(parseInt(e.target.value) || 30)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            {/* Slider rapido */}
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={Math.min(durata, 120)}
              onChange={e => setDurata(parseInt(e.target.value))}
              className="w-full mt-2 accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>5 min</span><span>30</span><span>60</span><span>90</span><span>120 min</span>
            </div>
          </div>
        </div>

        {/* Risultato */}
        <div className="mt-5 bg-emerald-50 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-emerald-500 rounded-xl p-3">
            <Flame size={28} className="text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-700">{kcalBruciate} <span className="text-lg font-medium">kcal</span></p>
            <p className="text-sm text-emerald-600">
              {attivita.nome} · {durata} min · {peso} kg
            </p>
          </div>
        </div>
      </div>

      {/* Tabella riepilogativa categorie */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">
          Confronto attività — {durata} min a {peso} kg
        </h3>
        <div className="space-y-2">
          {Object.entries(perCategoria).map(([cat, lista]) => (
            <div key={cat}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {CATEGORIE_ATTIVITA[cat]}
              </p>
              <div className="space-y-1">
                {lista.map(a => {
                  const kcal = Math.round(a.met * peso * (durata / 60));
                  const pct = Math.min(100, Math.round((kcal / (DATABASE_ATTIVITA.reduce((mx, x) => Math.max(mx, x.met), 0) * peso * durata / 60)) * 100));
                  return (
                    <div
                      key={a.id}
                      onClick={() => setAttivitaId(a.id)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                        a.id === attivitaId ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs text-gray-700 w-44 truncate">{a.nome}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-emerald-400 h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-14 text-right">{kcal} kcal</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Formula: MET × peso × ore. Valori indicativi (Compendium of Physical Activities).
        </p>
      </div>
    </div>
  );
}
