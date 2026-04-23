import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Header } from './components/Header';
import { MealSection } from './components/MealSection';
import { NutritionSummary } from './components/NutritionSummary';
import { ReportView } from './components/ReportView';
import { SettingsPanel } from './components/SettingsPanel';
import { ActivityPanel } from './components/ActivityPanel';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { TipoPasto } from './types';
import { useStore } from './store/useStore';
import { supabase, supabaseConfigurato } from './lib/supabase';

type Vista = 'diario' | 'report' | 'attivita' | 'impostazioni';

const TIPI_PASTO: TipoPasto[] = ['colazione', 'pranzo', 'spuntino', 'cena'];

export default function App() {
  const [vista, setVista] = useState<Vista>('diario');
  const [utente, setUtente] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(supabaseConfigurato);
  const { caricaDaSupabase, caricamento } = useStore();

  useEffect(() => {
    if (!supabaseConfigurato) return;

    // Sessione corrente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUtente(session?.user ?? null);
      if (session?.user) caricaDaSupabase();
      setAuthLoading(false);
    });

    // Listener cambi auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nuovoUtente = session?.user ?? null;
      setUtente(nuovoUtente);
      if (nuovoUtente) caricaDaSupabase();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Supabase non configurato → app funziona in modalità locale
  if (!supabaseConfigurato) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header vistaAttiva={vista} setVista={setVista} utente={null} />
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800">
            <strong>Modalità locale:</strong> configura <code>VITE_SUPABASE_URL</code> e{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> nel file <code>.env.local</code> per abilitare
            la sincronizzazione cloud.
          </div>
        </div>
        <AppContent vista={vista} setVista={setVista} utente={null} />
        <Footer />
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl">🥗</span>
          <p className="mt-3 text-gray-500 text-sm">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!utente) {
    return <AuthModal onSuccess={() => {}} />;
  }

  if (caricamento) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl">🥗</span>
          <p className="mt-3 text-gray-500 text-sm">Sincronizzazione dati...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header vistaAttiva={vista} setVista={setVista} utente={utente} />
      <AppContent vista={vista} setVista={setVista} utente={utente} />
      <Footer />
    </div>
  );
}

function AppContent({ vista }: { vista: Vista; setVista: (v: Vista) => void; utente: User | null }) {
  const { impostazioni } = useStore();

  return (
    <main className="max-w-5xl mx-auto px-4 py-5">
      {vista === 'diario' && (
        <div>
          {impostazioni.nome && (
            <p className="text-gray-500 text-sm mb-4">
              Ciao, <span className="font-semibold text-gray-700">{impostazioni.nome}</span> 👋
            </p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {TIPI_PASTO.map(tipo => <MealSection key={tipo} tipo={tipo} />)}
            </div>
            <div className="lg:col-span-1">
              <NutritionSummary />
            </div>
          </div>
        </div>
      )}
      {vista === 'report' && <ReportView />}
      {vista === 'attivita' && <ActivityPanel />}
      {vista === 'impostazioni' && <SettingsPanel />}
    </main>
  );
}
