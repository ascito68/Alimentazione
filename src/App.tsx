import { useState } from 'react';
import { Header } from './components/Header';
import { MealSection } from './components/MealSection';
import { NutritionSummary } from './components/NutritionSummary';
import { ReportView } from './components/ReportView';
import { SettingsPanel } from './components/SettingsPanel';
import { TipoPasto } from './types';
import { useStore } from './store/useStore';

type Vista = 'diario' | 'report' | 'impostazioni';

const TIPI_PASTO: TipoPasto[] = ['colazione', 'pranzo', 'spuntino', 'cena'];

export default function App() {
  const [vista, setVista] = useState<Vista>('diario');
  const { impostazioni } = useStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header vistaAttiva={vista} setVista={setVista} />

      <main className="max-w-5xl mx-auto px-4 py-5">
        {vista === 'diario' && (
          <div>
            {impostazioni.nome && (
              <p className="text-gray-500 text-sm mb-4">
                Ciao, <span className="font-semibold text-gray-700">{impostazioni.nome}</span> 👋
              </p>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Pasti – colonna principale */}
              <div className="lg:col-span-2 space-y-4">
                {TIPI_PASTO.map(tipo => (
                  <MealSection key={tipo} tipo={tipo} />
                ))}
              </div>
              {/* Riepilogo nutrizionale – colonna laterale */}
              <div className="lg:col-span-1">
                <NutritionSummary />
              </div>
            </div>
          </div>
        )}

        {vista === 'report' && <ReportView />}

        {vista === 'impostazioni' && <SettingsPanel />}
      </main>
    </div>
  );
}
