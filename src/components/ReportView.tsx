import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import { useStore } from '../store/useStore';
import {
  totaleGiorno, percentualiMacro, formatData,
  settimanaRange, meseRange, giorniInRange, creaGiornoVuoto,
} from '../utils/calculations';
import { PASTO_CONFIG, TipoPasto, GiornoAlimentare } from '../types';
import { ExportPanel } from './ExportPanel';

type TipoReport = 'giornaliero' | 'settimanale' | 'mensile';

function PastoRiga({ giorno, tipo }: { giorno: GiornoAlimentare; tipo: TipoPasto }) {
  const cfg = PASTO_CONFIG[tipo];
  const pasto = giorno.pasti[tipo];
  const haVoci = pasto.voci.length > 0;
  if (!haVoci) return null;

  const calorie = pasto.voci.reduce((acc, v) => acc + v.nutrienti.calorie, 0);
  const { percentualeProteine, percentualeCarboidrati, percentualeGrassi } = percentualiMacro(
    pasto.voci.reduce(
      (acc, v) => ({
        calorie: acc.calorie + v.nutrienti.calorie,
        proteine: acc.proteine + v.nutrienti.proteine,
        carboidrati: acc.carboidrati + v.nutrienti.carboidrati,
        zuccheri: acc.zuccheri + v.nutrienti.zuccheri,
        grassi: acc.grassi + v.nutrienti.grassi,
        grassiSaturi: acc.grassiSaturi + v.nutrienti.grassiSaturi,
        fibre: acc.fibre + v.nutrienti.fibre,
        sodio: acc.sodio + v.nutrienti.sodio,
      }),
      { calorie: 0, proteine: 0, carboidrati: 0, zuccheri: 0, grassi: 0, grassiSaturi: 0, fibre: 0, sodio: 0 }
    )
  );

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-base">{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700">{cfg.label}</p>
        <p className="text-xs text-gray-400">
          {pasto.voci.length} alimento{pasto.voci.length > 1 ? 'i' : ''}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold" style={{ color: cfg.colore }}>{calorie} kcal</p>
        <p className="text-xs text-gray-400">
          P:{percentualeProteine}% C:{percentualeCarboidrati}% G:{percentualeGrassi}%
        </p>
      </div>
    </div>
  );
}

function ReportGiornaliero() {
  const { giornoCorrente, impostazioni } = useStore();
  const giorno = giornoCorrente();
  const tot = totaleGiorno(giorno);
  const { percentualeProteine, percentualeCarboidrati, percentualeGrassi } = percentualiMacro(tot);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">
          Riepilogo {formatData(giorno.data)}
        </h3>

        {/* Card calorie */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Calorie', val: `${tot.calorie}`, sub: `/ ${impostazioni.targetCalorie} kcal`, color: '#10B981' },
            { label: 'Proteine', val: `${tot.proteine}g`, sub: `${percentualeProteine}% cal.`, color: '#3B82F6' },
            { label: 'Carboidrati', val: `${tot.carboidrati}g`, sub: `${percentualeCarboidrati}% cal.`, color: '#F59E0B' },
            { label: 'Grassi', val: `${tot.grassi}g`, sub: `${percentualeGrassi}% cal.`, color: '#EF4444' },
          ].map(c => (
            <div key={c.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: c.color + '15' }}>
              <p className="text-xs text-gray-500 mb-0.5">{c.label}</p>
              <p className="text-lg font-bold" style={{ color: c.color }}>{c.val}</p>
              <p className="text-xs text-gray-400">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Breakdown per pasto */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Distribuzione per pasto</p>
          {(['colazione', 'pranzo', 'spuntino', 'cena'] as TipoPasto[]).map(tipo => (
            <PastoRiga key={tipo} giorno={giorno} tipo={tipo} />
          ))}
          {tot.calorie === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Nessun dato registrato per oggi</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportSettimanale() {
  const { giorni, dataSelezionata, impostazioni } = useStore();
  const { inizio, fine } = settimanaRange(dataSelezionata);
  const giorniRange = giorniInRange(inizio, fine);

  const datiSettimana = giorniRange.map(data => {
    const giorno = giorni.find(g => g.data === data) ?? creaGiornoVuoto(data);
    const tot = totaleGiorno(giorno);
    const p = percentualiMacro(tot);
    const nomi = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const nomeGiorno = nomi[new Date(data).getDay()];
    return {
      giorno: nomeGiorno,
      data,
      calorie: tot.calorie,
      proteine: tot.proteine,
      carboidrati: tot.carboidrati,
      grassi: tot.grassi,
      fibre: tot.fibre,
      percProteine: p.percentualeProteine,
      percCarbo: p.percentualeCarboidrati,
      percGrassi: p.percentualeGrassi,
    };
  });

  const mediaCalorie = Math.round(
    datiSettimana.reduce((s, d) => s + d.calorie, 0) / datiSettimana.filter(d => d.calorie > 0).length || 1
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Settimana corrente</h3>
          <span className="text-xs text-gray-400">{formatData(inizio)} – {formatData(fine)}</span>
        </div>

        {/* Grafico calorie settimanali */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={datiSettimana} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="giorno" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v: number) => [`${v} kcal`, 'Calorie']}
              labelFormatter={(l: string) => `Giorno: ${l}`}
            />
            <Bar dataKey="calorie" fill="#10B981" radius={[4, 4, 0, 0]} />
            {impostazioni.targetCalorie && (
              <Line
                type="monotone"
                dataKey={() => impostazioni.targetCalorie}
                stroke="#EF4444"
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 text-center mt-1">
          Media: {mediaCalorie} kcal/giorno
        </p>
      </div>

      {/* Grafico macronutrienti settimanali */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">Andamento macronutrienti (g/giorno)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={datiSettimana} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="giorno" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number, n: string) => [`${v}g`, n]} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="proteine" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Proteine" />
            <Line type="monotone" dataKey="carboidrati" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} name="Carboidrati" />
            <Line type="monotone" dataKey="grassi" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} name="Grassi" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ReportMensile() {
  const { giorni, dataSelezionata } = useStore();
  const { inizio, fine } = meseRange(dataSelezionata);
  const giorniRange = giorniInRange(inizio, fine);
  const [annoStr, meseStr] = dataSelezionata.split('-');
  const nomeMesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const nomeMese = nomeMesi[parseInt(meseStr, 10) - 1];

  const datiMese = giorniRange.map(data => {
    const giorno = giorni.find(g => g.data === data) ?? creaGiornoVuoto(data);
    const tot = totaleGiorno(giorno);
    return { data: data.split('-')[2], calorie: tot.calorie, proteine: tot.proteine, carboidrati: tot.carboidrati, grassi: tot.grassi };
  });

  const giorniConDati = datiMese.filter(d => d.calorie > 0);
  const totMese = giorniConDati.reduce((acc, d) => ({
    calorie: acc.calorie + d.calorie,
    proteine: acc.proteine + d.proteine,
    carboidrati: acc.carboidrati + d.carboidrati,
    grassi: acc.grassi + d.grassi,
  }), { calorie: 0, proteine: 0, carboidrati: 0, grassi: 0 });

  const n = giorniConDati.length || 1;
  const media = {
    calorie: Math.round(totMese.calorie / n),
    proteine: Math.round(totMese.proteine / n * 10) / 10,
    carboidrati: Math.round(totMese.carboidrati / n * 10) / 10,
    grassi: Math.round(totMese.grassi / n * 10) / 10,
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{nomeMese} {annoStr}</h3>
          <span className="text-xs text-gray-400">{giorniConDati.length} giorni registrati</span>
        </div>

        {/* Card riepilogo mensile */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Media calorie/giorno', val: `${media.calorie} kcal`, color: '#10B981' },
            { label: 'Media proteine/giorno', val: `${media.proteine}g`, color: '#3B82F6' },
            { label: 'Media carboidrati/giorno', val: `${media.carboidrati}g`, color: '#F59E0B' },
            { label: 'Media grassi/giorno', val: `${media.grassi}g`, color: '#EF4444' },
          ].map(c => (
            <div key={c.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: c.color + '15' }}>
              <p className="text-xs text-gray-500 mb-0.5">{c.label}</p>
              <p className="text-lg font-bold" style={{ color: c.color }}>{c.val}</p>
            </div>
          ))}
        </div>

        {/* Grafico andamento mensile */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={datiMese} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="data" tick={{ fontSize: 10 }} interval={4} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [`${v} kcal`, 'Calorie']} labelFormatter={(l: string) => `Giorno ${l}`} />
            <Bar dataKey="calorie" fill="#10B981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ReportView() {
  const [tipoReport, setTipoReport] = useState<TipoReport>('giornaliero');

  return (
    <div className="space-y-4">
      {/* Tab selezione report */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex gap-1">
        {(['giornaliero', 'settimanale', 'mensile'] as TipoReport[]).map(tipo => (
          <button
            key={tipo}
            onClick={() => setTipoReport(tipo)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium capitalize transition-colors ${
              tipoReport === tipo
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}
      </div>

      {tipoReport === 'giornaliero' && <ReportGiornaliero />}
      {tipoReport === 'settimanale' && <ReportSettimanale />}
      {tipoReport === 'mensile' && <ReportMensile />}

      {/* Export sempre visibile */}
      <ExportPanel />
    </div>
  );
}
