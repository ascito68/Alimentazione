import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
} from 'recharts';
import { useStore } from '../store/useStore';
import { totaleGiorno, percentualiMacro } from '../utils/calculations';
import { RDA } from '../types';
import { DATABASE_ATTIVITA } from '../data/activitiesDatabase';

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
  const { giornoCorrente, impostazioni, vociAttivita, pesoAttivita } = useStore();
  const giorno = giornoCorrente();
  const tot = totaleGiorno(giorno);
  const { percentualeProteine, percentualeCarboidrati, percentualeGrassi } = percentualiMacro(tot);

  const haCalorie = tot.calorie > 0;

  // Calorie bruciate dalle attività
  const kcalAttivita = useMemo(() =>
    vociAttivita.reduce((sum, v) => {
      const att = DATABASE_ATTIVITA.find(a => a.id === v.attivitaId);
      return sum + (att ? Math.round(att.met * pesoAttivita * (v.durata / 60)) : 0);
    }, 0),
    [vociAttivita, pesoAttivita]
  );

  const kcalNette = Math.max(0, tot.calorie - kcalAttivita);
  const bilancio = kcalNette - impostazioni.targetCalorie;

  const datiGrafico = [
    { nome: 'Target',   kcal: impostazioni.targetCalorie, fill: '#94A3B8' },
    { nome: 'Assunte',  kcal: tot.calorie,                fill: tot.calorie > impostazioni.targetCalorie ? '#EF4444' : '#10B981' },
    { nome: 'Bruciate', kcal: kcalAttivita,               fill: '#F97316' },
    { nome: 'Nette',    kcal: kcalNette,                  fill: kcalNette > impostazioni.targetCalorie ? '#EF4444' : '#3B82F6' },
  ];

  const datiTorta = haCalorie ? [
    { name: 'Proteine', value: Math.round(tot.proteine * 4), color: MACRO_COLORI.proteine },
    { name: 'Carboidrati', value: Math.round(tot.carboidrati * 4), color: MACRO_COLORI.carboidrati },
    { name: 'Grassi', value: Math.round(tot.grassi * 9), color: MACRO_COLORI.grassi },
  ] : [];

  const statoColori = Math.abs(bilancio) <= 100
    ? { bg: 'bg-emerald-50', text: 'text-emerald-700' }
    : bilancio > 0
      ? { bg: 'bg-red-50', text: 'text-red-700' }
      : { bg: 'bg-blue-50', text: 'text-blue-700' };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
      <h2 className="font-bold text-gray-800">Riepilogo giornaliero</h2>

      {/* ── Bilancio energetico ── */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-3">Bilancio energetico</p>

        {/* 4 stat card */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">Target</p>
            <p className="text-xl font-bold text-gray-700">{impostazioni.targetCalorie}</p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${tot.calorie > impostazioni.targetCalorie ? 'bg-red-50' : 'bg-emerald-50'}`}>
            <p className="text-xs text-gray-500 mb-0.5">Assunte</p>
            <p className={`text-xl font-bold ${tot.calorie > impostazioni.targetCalorie ? 'text-red-600' : 'text-emerald-600'}`}>
              {tot.calorie}
            </p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">Bruciate</p>
            <p className="text-xl font-bold text-orange-600">{kcalAttivita}</p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${kcalNette > impostazioni.targetCalorie ? 'bg-red-50' : 'bg-blue-50'}`}>
            <p className="text-xs text-gray-500 mb-0.5">Nette</p>
            <p className={`text-xl font-bold ${kcalNette > impostazioni.targetCalorie ? 'text-red-600' : 'text-blue-600'}`}>
              {kcalNette}
            </p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
        </div>

        {/* Grafico a barre */}
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={datiGrafico} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="nome" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={45} />
            <Tooltip
              cursor={{ fill: '#F9FAFB' }}
              formatter={(v: number) => [`${v} kcal`]}
              contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
            />
            <ReferenceLine
              y={impostazioni.targetCalorie}
              stroke="#94A3B8"
              strokeDasharray="5 3"
              label={{ value: 'target', position: 'right', fontSize: 10, fill: '#94A3B8' }}
            />
            <Bar dataKey="kcal" radius={[5, 5, 0, 0]} maxBarSize={52}>
              {datiGrafico.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Stato bilancio */}
        <div className={`mt-2 rounded-xl px-4 py-2.5 text-sm text-center font-medium ${statoColori.bg} ${statoColori.text}`}>
          {Math.abs(bilancio) <= 100
            ? <span>⚖️ Bilancio equilibrato rispetto al target</span>
            : bilancio > 0
              ? <span>⬆️ Surplus di <strong>{bilancio} kcal</strong> rispetto al target</span>
              : <span>⬇️ Deficit di <strong>{Math.abs(bilancio)} kcal</strong> rispetto al target</span>
          }
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          Nette = assunte − bruciate con le attività
        </p>
      </div>

      {/* ── Calorie assunte vs target (barra) ── */}
      <div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Calorie assunte / target</span>
            <span className={`font-semibold ${tot.calorie >= impostazioni.targetCalorie ? 'text-red-500' : 'text-emerald-600'}`}>
              {Math.round((tot.calorie / impostazioni.targetCalorie) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min((tot.calorie / impostazioni.targetCalorie) * 100, 100)}%`,
                backgroundColor: tot.calorie >= impostazioni.targetCalorie ? '#EF4444' : '#10B981',
              }}
            />
          </div>
          <p className="text-xs text-right text-gray-400">
            {tot.calorie} / {impostazioni.targetCalorie} kcal
          </p>
        </div>
      </div>

      {/* ── Grafico a torta macronutrienti ── */}
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

      {/* ── Micronutrienti con barre target ── */}
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
