import { useState } from 'react';
import { LogIn, LogOut, Download, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { richiestaToken, creaFoglio, esportaTutto } from '../utils/googleSheets';
import { oggiISO } from '../utils/calculations';

type Stato = 'idle' | 'loading' | 'success' | 'error';

export function ExportPanel() {
  const { google, setGoogle, clearToken, giorni } = useStore();
  const [stato, setStato] = useState<Stato>('idle');
  const [messaggio, setMessaggio] = useState('');

  const isAutenticato = !!google.accessToken;
  const haFoglio = !!google.spreadsheetId;

  async function autenticati() {
    if (!google.clientId.trim()) {
      setStato('error');
      setMessaggio('Inserisci il Client ID di Google nelle impostazioni.');
      return;
    }
    setStato('loading');
    setMessaggio('');
    try {
      const token = await richiestaToken(google.clientId);
      setGoogle({ accessToken: token, tokenExpiry: Date.now() + 3600 * 1000 });
      setStato('success');
      setMessaggio('Autenticazione completata con successo!');
    } catch (err) {
      setStato('error');
      setMessaggio((err as Error).message);
    }
  }

  async function creaNuovoFoglio() {
    if (!google.accessToken) return;
    setStato('loading');
    setMessaggio('');
    try {
      const id = await creaFoglio(google.accessToken);
      setGoogle({ spreadsheetId: id });
      setStato('success');
      setMessaggio('Foglio Google Sheets creato con successo!');
    } catch (err) {
      setStato('error');
      setMessaggio((err as Error).message);
    }
  }

  async function esporta() {
    if (!google.accessToken || !google.spreadsheetId) return;
    setStato('loading');
    setMessaggio('Esportazione in corso...');
    try {
      await esportaTutto(google.accessToken, google.spreadsheetId, giorni, oggiISO());
      setStato('success');
      setMessaggio('Dati esportati con successo in Google Sheets!');
    } catch (err) {
      setStato('error');
      setMessaggio((err as Error).message);
    }
  }

  function apriInGoogleSheets() {
    if (google.spreadsheetId) {
      window.open(`https://docs.google.com/spreadsheets/d/${google.spreadsheetId}`, '_blank');
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">📊</span>
        <h2 className="font-bold text-gray-800">Esporta in Google Sheets</h2>
      </div>

      {/* Stato autenticazione */}
      <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${
        isAutenticato ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'
      }`}>
        <div className={`w-2 h-2 rounded-full ${isAutenticato ? 'bg-emerald-500' : 'bg-gray-300'}`} />
        {isAutenticato ? 'Connesso a Google' : 'Non connesso'}
      </div>

      {/* Azioni */}
      <div className="space-y-2">
        {!isAutenticato ? (
          <button
            onClick={autenticati}
            disabled={stato === 'loading'}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          >
            <LogIn size={16} />
            Accedi con Google
          </button>
        ) : (
          <>
            <button
              onClick={clearToken}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
            >
              <LogOut size={14} />
              Disconnetti
            </button>

            {!haFoglio ? (
              <button
                onClick={creaNuovoFoglio}
                disabled={stato === 'loading'}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
              >
                <span>📝</span>
                Crea nuovo foglio
              </button>
            ) : (
              <>
                <button
                  onClick={esporta}
                  disabled={stato === 'loading'}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                >
                  <Download size={16} />
                  {stato === 'loading' ? 'Esportazione...' : 'Esporta tutti i dati'}
                </button>
                <button
                  onClick={apriInGoogleSheets}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm font-medium transition-colors"
                >
                  <ExternalLink size={14} />
                  Apri Google Sheets
                </button>
                <button
                  onClick={() => setGoogle({ spreadsheetId: null })}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 py-1"
                >
                  Usa un foglio diverso
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Messaggio stato */}
      {messaggio && (
        <div className={`flex items-start gap-2 text-sm px-3 py-2 rounded-xl ${
          stato === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
        }`}>
          {stato === 'error'
            ? <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            : <CheckCircle size={15} className="flex-shrink-0 mt-0.5" />
          }
          <span>{messaggio}</span>
        </div>
      )}

      {/* Info struttura export */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-600 mb-2">Struttura del foglio:</p>
        <div className="space-y-1">
          {[
            { tab: 'Giornaliero', desc: 'Dettaglio pasti del giorno corrente' },
            { tab: 'Settimanale', desc: 'Riepilogo della settimana' },
            { tab: 'Mensile', desc: 'Medie e totali mensili' },
            { tab: 'Storico', desc: 'Tutti i dati registrati' },
          ].map(t => (
            <div key={t.tab} className="flex gap-2 text-xs">
              <span className="font-medium text-emerald-700 w-24 flex-shrink-0">{t.tab}</span>
              <span className="text-gray-500">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Istruzioni setup Google */}
      {!google.clientId && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-amber-800 mb-1">⚙️ Setup richiesto</p>
          <p className="text-xs text-amber-700">
            Per usare questa funzione, vai nelle <strong>Impostazioni</strong> e inserisci il tuo
            Google Client ID. Segui la guida nella sezione Impostazioni.
          </p>
        </div>
      )}
    </div>
  );
}
