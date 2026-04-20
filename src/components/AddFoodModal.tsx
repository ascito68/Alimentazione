import { useState, useMemo } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { Alimento, TipoPasto, PASTO_CONFIG } from '../types';
import { DATABASE_ALIMENTI, CATEGORIE_LABELS } from '../data/foodDatabase';
import { calcolaNutrienti } from '../utils/calculations';
import { useStore } from '../store/useStore';

interface AddFoodModalProps {
  tipo: TipoPasto;
  onClose: () => void;
}

export function AddFoodModal({ tipo, onClose }: AddFoodModalProps) {
  const { aggiungiBrano } = useStore();
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState<string>('');
  const [selezionato, setSelezionato] = useState<Alimento | null>(null);
  const [grammi, setGrammi] = useState<string>('100');

  const cfg = PASTO_CONFIG[tipo];

  const filtrati = useMemo(() => {
    return DATABASE_ALIMENTI.filter(a => {
      const matchQuery = a.nome.toLowerCase().includes(query.toLowerCase());
      const matchCat = !categoria || a.categoria === categoria;
      return matchQuery && matchCat;
    });
  }, [query, categoria]);

  const categorie = useMemo(() => {
    const set = new Set(DATABASE_ALIMENTI.map(a => a.categoria));
    return Array.from(set).sort();
  }, []);

  const grammiNum = parseFloat(grammi) || 0;
  const preview = selezionato && grammiNum > 0
    ? calcolaNutrienti(selezionato.nutrienti, grammiNum)
    : null;

  function handleAggiungi() {
    if (!selezionato || grammiNum <= 0) return;
    aggiungiBrano(tipo, selezionato, grammiNum);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header modale */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: cfg.colore + '40' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{cfg.icon}</span>
            <h2 className="font-bold text-gray-800">
              Aggiungi a {cfg.label}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Pannello ricerca */}
          <div className="flex flex-col flex-1 min-h-0 border-r border-gray-100">
            {/* Filtri */}
            <div className="px-4 py-3 space-y-2 border-b border-gray-100">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Cerca alimento..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setCategoria('')}
                  className={`flex-shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${
                    categoria === '' ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tutti
                </button>
                {categorie.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoria(cat)}
                    className={`flex-shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${
                      categoria === cat ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {CATEGORIE_LABELS[cat] ?? cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista alimenti */}
            <div className="overflow-y-auto flex-1">
              {filtrati.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">Nessun alimento trovato</p>
              ) : (
                filtrati.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setSelezionato(a)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-emerald-50 transition-colors ${
                      selezionato?.id === a.id ? 'bg-emerald-50 border-l-4' : ''
                    }`}
                    style={selezionato?.id === a.id ? { borderLeftColor: cfg.colore } : {}}
                  >
                    <p className="text-sm font-medium text-gray-800">{a.nome}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {a.nutrienti.calorie} kcal · {a.nutrienti.proteine}g prot · {a.nutrienti.carboidrati}g carb · {a.nutrienti.grassi}g grassi
                      <span className="text-gray-400"> (per 100g)</span>
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Pannello dettaglio */}
          <div className="w-full md:w-64 p-4 flex flex-col gap-4">
            {selezionato ? (
              <>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{selezionato.nome}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{CATEGORIE_LABELS[selezionato.categoria]}</p>
                </div>

                {/* Grammi */}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Quantità (grammi)</label>
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    value={grammi}
                    onChange={e => setGrammi(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <div className="flex gap-1 mt-1">
                    {[25, 50, 100, 150, 200].map(g => (
                      <button
                        key={g}
                        onClick={() => setGrammi(String(g))}
                        className="flex-1 text-xs py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {g}g
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview nutrienti */}
                {preview && (
                  <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Valori per {grammi}g
                    </p>
                    {[
                      { label: 'Calorie', val: `${preview.calorie} kcal`, bold: true },
                      { label: 'Proteine', val: `${preview.proteine}g` },
                      { label: 'Carboidrati', val: `${preview.carboidrati}g` },
                      { label: 'di cui zuccheri', val: `${preview.zuccheri}g` },
                      { label: 'Grassi', val: `${preview.grassi}g` },
                      { label: 'di cui saturi', val: `${preview.grassiSaturi}g` },
                      { label: 'Fibre', val: `${preview.fibre}g` },
                      { label: 'Sodio', val: `${preview.sodio}mg` },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between text-xs">
                        <span className={`text-gray-600 ${r.bold ? 'font-semibold' : ''}`}>{r.label}</span>
                        <span className={`${r.bold ? 'font-bold text-gray-800' : 'text-gray-700'}`}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleAggiungi}
                  disabled={grammiNum <= 0}
                  className="mt-auto w-full py-2.5 rounded-xl font-medium text-sm text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: cfg.colore }}
                >
                  <Plus size={16} />
                  Aggiungi a {cfg.label}
                </button>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <p className="text-sm text-gray-400">
                  Seleziona un alimento dalla lista per vedere i dettagli
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
