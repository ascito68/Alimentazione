import { useState } from 'react';
import { LogIn, LogOut, Download, ExternalLink, AlertCircle, CheckCircle, FileDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { richiestaToken, creaFoglio, esportaTutto, googleConfigurato } from '../utils/googleSheets';
import { scaricaCSVGiornaliero, scaricaCSVSettimanale, scaricaCSVMensile } from '../utils/csvExport';
import { oggiISO } from '../utils/calculations';

type Stato = 'idle' | 'loading' | 'success' | 'error';

export function ExportPanel() {
  const { google, setGoogle, clearToken, giorni, dataSelezionata, giornoCorrente } = useStore();
  const [stato, setStato] = useState<Stato>('idle');
  const [messaggio, setMessaggio] = useState('');

  const isAutenticato = !!google.accessToken;
  const haFoglio = !!google.spreadsheetId;

  async function autenticati() {
    setStato('loading');
    setMessaggio('');
    try {
      const token = await richiestaToken();
      setGoogle({ accessToken: token, tokenExpiry: Date.now() + 3600 * 1000 });
      setStato('success');
      setMessaggio('Connesso a Google con successo!');
    } catch (err) {
      setStato('error');
      setMessaggio((err as Error).message);
    }
  }

  async function creaNuovoFoglio() {
    if (!google.accessToken) return;
    setStato('loading');
    try {
      const id = await creaFoglio(google.accessToken);
      setGoogle({ spreadsheetId: id });
      setStato('success');
      setMessaggio('Foglio Google Sheets creato!');
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
      setMessaggio('Dati esportati in Google Sheets!');
    } catch (err) {
      setStato('error');
      setMessaggio((err as Error).message);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">📊</span>
        <h2 className="font-bold text-gray-800">Esporta dati</h2>
      </div>

      {/* ── CSV (sempre disponibile) ── */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-2">
          Scarica CSV <span className="text-gray-400 font-normal">— apribile in Excel o Google Sheets</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Oggi', fn: () => scaricaCSVGiornaliero(giornoCorrente()) },
            { label: 'Settimana', fn: () => scaricaCSVSettimanale(giorni, dataSelezionata) },
            { label: 'Mese', fn: () => scaricaCSVMensile(giorni, dataSelezionata) },
          ].map(b => (
            <button
              key={b.label}
              onClick={b.fn}
              className="flex flex-col items-center gap-1 py-3 px-2 border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-300 transition-colors text-sm font-medium text-gray-700"
            >
              <FileDown size={18} className="text-emerald-500" />
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Google Sheets (solo se configurato) ── */}
      {googleConfigurato ? (
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <p className="text-xs font-semibold text-gray-600">
            Esporta direttamente in Google Sheets
          </p>

          <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${
            isAutenticato ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isAutenticato ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            {isAutenticato ? 'Connesso a Google' : 'Non connesso'}
          </div>

          {!isAutenticato ? (
            <button
              onClick={autenticati}
              disabled={stato === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
            >
              <LogIn size={16} />
              Connetti con Google
            </button>
          ) : (
            <>
              <button onClick={clearToken} className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm transition-colors">
                <LogOut size={14} /> Disconnetti
              </button>
              {!haFoglio ? (
                <button onClick={creaNuovoFoglio} disabled={stato === 'loading'} className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
                  📝 Crea nuovo foglio
                </button>
              ) : (
                <>
                  <button onClick={esporta} disabled={stato === 'loading'} className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
                    <Download size={16} />
                    {stato === 'loading' ? 'Esportazione...' : 'Esporta in Google Sheets'}
                  </button>
                  <button onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${google.spreadsheetId}`, '_blank')} className="w-full flex items-center justify-center gap-2 py-2 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm transition-colors">
                    <ExternalLink size={14} /> Apri foglio
                  </button>
                  <button onClick={() => setGoogle({ spreadsheetId: null })} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1">
                    Usa un foglio diverso
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 text-center">
            L'export diretto in Google Sheets non è attivo.<br />
            Usa il download CSV e importalo in Google Sheets.
          </p>
        </div>
      )}

      {/* Messaggio stato */}
      {messaggio && (
        <div className={`flex items-start gap-2 text-sm px-3 py-2 rounded-xl ${
          stato === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
        }`}>
          {stato === 'error' ? <AlertCircle size={15} className="flex-shrink-0 mt-0.5" /> : <CheckCircle size={15} className="flex-shrink-0 mt-0.5" />}
          <span>{messaggio}</span>
        </div>
      )}
    </div>
  );
}
