import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { TipoPasto, PASTO_CONFIG, Nutrienti } from '../types';
import { useStore } from '../store/useStore';
import { totalePasto, percentualiMacro } from '../utils/calculations';
import { AddFoodModal } from './AddFoodModal';

interface MealSectionProps {
  tipo: TipoPasto;
}

function BarraMacro({ nutrienti }: { nutrienti: Nutrienti; colore?: string }) {
  const { percentualeProteine, percentualeCarboidrati, percentualeGrassi } = percentualiMacro(nutrienti);
  if (nutrienti.calorie === 0) return null;
  return (
    <div className="mt-2">
      <div className="flex rounded-full overflow-hidden h-1.5">
        <div style={{ width: `${percentualeProteine}%`, backgroundColor: '#3B82F6' }} />
        <div style={{ width: `${percentualeCarboidrati}%`, backgroundColor: '#F59E0B' }} />
        <div style={{ width: `${percentualeGrassi}%`, backgroundColor: '#EF4444' }} />
      </div>
      <div className="flex gap-3 mt-1">
        {[
          { label: 'Prot.', val: percentualeProteine, color: '#3B82F6' },
          { label: 'Carb.', val: percentualeCarboidrati, color: '#F59E0B' },
          { label: 'Grassi', val: percentualeGrassi, color: '#EF4444' },
        ].map(m => (
          <span key={m.label} className="text-xs flex items-center gap-0.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: m.color }} />
            <span className="text-gray-500">{m.label}</span>
            <span className="font-medium text-gray-700">{m.val}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

interface EditRowProps {
  voceId: string;
  tipo: TipoPasto;
  grammiAttuali: number;
  nomeAlimento: string;
  onDone: () => void;
}

function EditRow({ voceId, tipo, grammiAttuali, nomeAlimento, onDone }: EditRowProps) {
  const { aggiornaBrano } = useStore();
  const [grammi, setGrammi] = useState(String(grammiAttuali));

  function salva() {
    const g = parseFloat(grammi);
    if (g > 0) aggiornaBrano(tipo, voceId, g);
    onDone();
  }

  return (
    <div className="flex items-center gap-2 py-1">
      <span className="text-sm text-gray-700 flex-1 truncate">{nomeAlimento}</span>
      <input
        type="number"
        value={grammi}
        onChange={e => setGrammi(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') salva(); if (e.key === 'Escape') onDone(); }}
        className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        autoFocus
      />
      <span className="text-xs text-gray-500">g</span>
      <button onClick={salva} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
        <Check size={14} />
      </button>
      <button onClick={onDone} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
        <X size={14} />
      </button>
    </div>
  );
}

export function MealSection({ tipo }: MealSectionProps) {
  const [aperto, setAperto] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const { giornoCorrente, rimuoviBrano } = useStore();
  const cfg = PASTO_CONFIG[tipo];
  const giorno = giornoCorrente();
  const pasto = giorno.pasti[tipo];
  const totale = totalePasto(pasto);
  const haVoci = pasto.voci.length > 0;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header pasto */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderLeft: `4px solid ${cfg.colore}` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{cfg.icon}</span>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{cfg.label}</h3>
              <p className="text-xs text-gray-400">{cfg.orario}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {haVoci && (
              <span
                className="text-sm font-bold"
                style={{ color: cfg.colore }}
              >
                {totale.calorie} kcal
              </span>
            )}
            <button
              onClick={() => setAperto(true)}
              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl transition-colors text-white"
              style={{ backgroundColor: cfg.colore }}
            >
              <Plus size={14} />
              Aggiungi
            </button>
          </div>
        </div>

        {/* Lista alimenti */}
        {haVoci && (
          <div className="px-4 pb-3">
            <div className="space-y-0.5 mt-1">
              {pasto.voci.map(voce => (
                editing === voce.id ? (
                  <EditRow
                    key={voce.id}
                    voceId={voce.id}
                    tipo={tipo}
                    grammiAttuali={voce.grammi}
                    nomeAlimento={voce.nomeAlimento}
                    onDone={() => setEditing(null)}
                  />
                ) : (
                  <div
                    key={voce.id}
                    className="flex items-center gap-2 py-1.5 group border-b border-gray-50 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-700 truncate block">{voce.nomeAlimento}</span>
                      <span className="text-xs text-gray-400">
                        {voce.grammi}g · {voce.nutrienti.calorie} kcal
                        <span className="text-gray-300 mx-1">|</span>
                        P:{voce.nutrienti.proteine}g C:{voce.nutrienti.carboidrati}g G:{voce.nutrienti.grassi}g
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditing(voce.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => rimuoviBrano(tipo, voce.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Barra macro pasto */}
            <BarraMacro nutrienti={totale} colore={cfg.colore} />
          </div>
        )}

        {!haVoci && (
          <p className="px-4 pb-3 text-xs text-gray-300 italic">
            Nessun alimento registrato per questo pasto
          </p>
        )}
      </div>

      {aperto && <AddFoodModal tipo={tipo} onClose={() => setAperto(false)} />}
    </>
  );
}
