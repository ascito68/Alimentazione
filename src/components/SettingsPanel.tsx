import { useState } from 'react';
import { Save, ExternalLink, Info } from 'lucide-react';
import { useStore } from '../store/useStore';

export function SettingsPanel() {
  const { impostazioni, setImpostazioni, google, setGoogle } = useStore();
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

      {/* Google Sheets setup */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-bold text-gray-800">🔗 Integrazione Google Sheets</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Per esportare i dati in Google Sheets devi configurare un'applicazione Google Cloud.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
          <div className="flex gap-2">
            <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700 space-y-1">
              <p className="font-semibold">Come ottenere il Client ID:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-blue-600">
                <li>Vai su <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="underline">Google Cloud Console</a></li>
                <li>Crea un nuovo progetto o seleziona uno esistente</li>
                <li>Attiva l'API Google Sheets</li>
                <li>Vai in Credenziali → Crea credenziali → ID client OAuth 2.0</li>
                <li>Tipo: Applicazione web</li>
                <li>Aggiungi questo URL come origine autorizzata: <code className="bg-blue-100 px-1 rounded">{window.location.origin}</code></li>
                <li>Copia il Client ID generato</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Google Client ID</label>
            <input
              type="text"
              value={google.clientId}
              onChange={e => setGoogle({ clientId: e.target.value })}
              placeholder="xxxxxxxxxx.apps.googleusercontent.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
            />
          </div>

          {google.spreadsheetId && (
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Foglio corrente</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={google.spreadsheetId}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono text-gray-500 bg-gray-50"
                />
                <a
                  href={`https://docs.google.com/spreadsheets/d/${google.spreadsheetId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          )}
        </div>
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
