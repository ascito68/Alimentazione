import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';
import { totaleGiorno, percentualiMacro } from '../utils/calculations';
import { RDA } from '../types';

const MACRO_COLORI = {
  proteine: '#3B82F6',
  carboidrati: '#F59E0B',
  grassi: '#EF4444',
};

function BarraProgresso({
  label, valore, max, colore, unita,
}: {
  label: string; valore: number; max: number; colore: string; unita: string;
}) {
  const perc = Math.min((valore / max) * 100, 100);
  const percRDA = Math.round((valore / max) * 100);
  const eccessivo = percRDA > 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className={`text-xs font-semibold ${eccessivo ? 'text-red-500' : 'text-gray-700'}`}>
          {valore} {unita}
          <span className="text-gray-400 font-normal ml-1">/ {max}{unita} ({percRDA}%)</span>
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${perc}%`,
            backgroundColor: eccessivo ? '#EF4444' : colore,
          }}
        />
      </div>
    </div>
  );
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomLabelProps) {
  if (percent < 0.08) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

export function NutritionSummary() {
  const { giornoCorrente, impostazioni } = useStore();
  const giorno = giornoCorrente();
  const tot = totaleGiorno(giorno);
  const { percentualeProteine, percentualeCarboidrati, percentualeGrassi } = percentualiMacro(tot);

  const haCalorie = tot.calorie > 0;
  const percCalorie = Math.min(Math.round((tot.calorie / impostazioni.targetCalorie) * 100), 100);

  const datiTorta = haCalorie ? [
    { name: 'Proteine', value: Math.round(tot.proteine * 4), color: MACRO_COLORI.proteine },
    { name: 'Carboidrati', value: Math.round(tot.carboidrati * 4), color: MACRO_COLORI.carboidrati },
    { name: 'Grassi', value: Math.round(tot.grassi * 9), color: MACRO_COLORI.grassi },
  ] : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
      <h2 className="font-bold text-gray-800">Riepilogo giornaliero</h2>

      {/* Calorie totali */}
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-gray-800">{tot.calorie}</p>
            <p className="text-sm text-gray-400">kcal totali</p>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Obiettivo: {impostazioni.targetCalorie} kcal</span>
            <span className={percCalorie >= 100 ? 'text-red-500 font-semibold' : 'text-emerald-600 font-semibold'}>
              {percCalorie}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${percCalorie}%`,
                backgroundColor: percCalorie >= 100 ? '#EF4444' : '#10B981',
              }}
            />
          </div>
        </div>
      </div>

      {/* Grafico a torta macronutrienti */}
      {haCalorie && (
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Distribuzione macronutrienti</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={datiTorta}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  dataKey="value"
                  labelLine={false}
                  label={CustomLabel as React.FC<unknown>}
                >
                  {datiTorta.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number, n: string) => [`${v} kcal`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {[
                { label: 'Proteine', val: tot.proteine, perc: percentualeProteine, color: MACRO_COLORI.proteine },
                { label: 'Carboidrati', val: tot.carboidrati, perc: percentualeCarboidrati, color: MACRO_COLORI.carboidrati },
                { label: 'Grassi', val: tot.grassi, perc: percentualeGrassi, color: MACRO_COLORI.grassi },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                  <div className="flex-1 flex justify-between">
                    <span className="text-xs text-gray-600">{m.label}</span>
                    <span className="text-xs font-semibold text-gray-800">{m.val}g <span className="text-gray-400 font-normal">({m.perc}%)</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Micronutrienti con barre RDA */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-gray-600">% del fabbisogno giornaliero</p>
        <BarraProgresso label="Proteine" valore={tot.proteine} max={impostazioni.targetProteine} colore="#3B82F6" unita="g" />
        <BarraProgresso label="Carboidrati" valore={tot.carboidrati} max={impostazioni.targetCarboidrati} colore="#F59E0B" unita="g" />
        <BarraProgresso label="Grassi" valore={tot.grassi} max={impostazioni.targetGrassi} colore="#EF4444" unita="g" />
        <BarraProgresso label="Fibre" valore={tot.fibre} max={impostazioni.targetFibre} colore="#10B981" unita="g" />
        <BarraProgresso label="Zuccheri" valore={tot.zuccheri} max={RDA.zuccheri} colore="#8B5CF6" unita="g" />
        <BarraProgresso label="Sodio" valore={tot.sodio} max={RDA.sodio} colore="#6366F1" unita="mg" />
      </div>

      {!haCalorie && (
        <p className="text-center text-sm text-gray-400 py-4">
          Aggiungi alimenti ai pasti per vedere il riepilogo nutrizionale
        </p>
      )}
    </div>
  );
}
