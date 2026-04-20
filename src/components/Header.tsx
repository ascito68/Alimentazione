import { ChevronLeft, ChevronRight, Settings, BarChart2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatData, oggiISO } from '../utils/calculations';

interface HeaderProps {
  vistaAttiva: 'diario' | 'report' | 'impostazioni';
  setVista: (v: 'diario' | 'report' | 'impostazioni') => void;
}

export function Header({ vistaAttiva, setVista }: HeaderProps) {
  const { dataSelezionata, setDataSelezionata } = useStore();

  function spostaGiorno(delta: number) {
    const d = new Date(dataSelezionata);
    d.setDate(d.getDate() + delta);
    setDataSelezionata(d.toISOString().split('T')[0]);
  }

  const isOggi = dataSelezionata === oggiISO();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥗</span>
          <span className="font-bold text-lg text-gray-800 hidden sm:block">NutriTrack</span>
        </div>

        {/* Navigazione data */}
        {vistaAttiva === 'diario' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => spostaGiorno(-1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {formatData(dataSelezionata)}
              </p>
              {isOggi && (
                <p className="text-xs text-emerald-600 font-medium">Oggi</p>
              )}
            </div>
            <button
              onClick={() => spostaGiorno(1)}
              disabled={isOggi}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </button>
            {!isOggi && (
              <button
                onClick={() => setDataSelezionata(oggiISO())}
                className="ml-1 text-xs text-emerald-600 font-medium border border-emerald-200 rounded-full px-2 py-0.5 hover:bg-emerald-50 transition-colors"
              >
                Oggi
              </button>
            )}
          </div>
        )}

        {/* Azioni */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setVista('diario')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              vistaAttiva === 'diario'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Diario
          </button>
          <button
            onClick={() => setVista('report')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              vistaAttiva === 'report'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart2 size={15} />
            <span className="hidden sm:inline">Report</span>
          </button>
          <button
            onClick={() => setVista('impostazioni')}
            className={`p-1.5 rounded-lg transition-colors ${
              vistaAttiva === 'impostazioni'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
