import { useState } from 'react';
import { Save } from 'lucide-react';
import { useStore } from '../store/useStore';

export function SettingsPanel() {
  const { impostazioni, setImpostazioni } = useStore();
  const [salvato, setSalvato] = useState(false);

  function salva(e: React.FormEvent) {
    e.preventDefault();
    setSalvato(true);
    setTimeout(() => setSalvato(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Profilo */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4">👤 Profilo e obiettivi</h2>
        <form onSubmit={salva} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Nome</label>
            <input
              type="text"
              value={impostazioni.nome}
              onChange={e => setImpostazioni({ nome: e.target.value })}
              placeholder="Il tuo nome"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'targetCalorie', label: 'Calorie (kcal)', min: 1000, max: 5000 },
              { key: 'targetProteine', label: 'Proteine (g)', min: 20, max: 300 },
              { key: 'targetCarboidrati', label: 'Carboidrati (g)', min: 50, max: 600 },
              { key: 'targetGrassi', label: 'Grassi (g)', min: 20, max: 250 },
              { key: 'targetFibre', label: 'Fibre (g)', min: 10, max: 60 },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-gray-600 block mb-1">{f.label}</label>
                <input
                  type="number"
                  min={f.min}
                  max={f.max}
                  value={impostazioni[f.key as keyof typeof impostazioni]}
                  onChange={e => setImpostazioni({ [f.key]: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors ${
              salvato ? 'bg-emerald-500' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <Save size={15} />
            {salvato ? 'Salvato!' : 'Salva impostazioni'}
          </button>
        </form>
      </div>


      {/* Info app */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-3">ℹ️ Informazioni</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>NutriTrack</strong> v1.0.0</p>
          <p>App per il monitoraggio delle calorie e dei macronutrienti suddivisi per pasto.</p>
          <div className="text-xs text-gray-400 space-y-0.5 mt-2">
            <p>✅ Dati salvati localmente nel browser</p>
            <p>✅ Database di {'{n}'} alimenti italiani</p>
            <p>✅ Calcolo automatico di proteine, carboidrati e grassi</p>
            <p>✅ Percentuali micronutrienti per pasto</p>
            <p>✅ Export Google Sheets (giornaliero, settimanale, mensile)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
