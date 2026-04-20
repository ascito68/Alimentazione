import { ChevronLeft, ChevronRight, Settings, BarChart2, LogOut, User } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useStore } from '../store/useStore';
import { formatData, oggiISO } from '../utils/calculations';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  vistaAttiva: 'diario' | 'report' | 'impostazioni';
  setVista: (v: 'diario' | 'report' | 'impostazioni') => void;
  utente: SupabaseUser | null;
}

export function Header({ vistaAttiva, setVista, utente }: HeaderProps) {
  const { dataSelezionata, setDataSelezionata, resetDati } = useStore();

  function spostaGiorno(delta: number) {
    const d = new Date(dataSelezionata);
    d.setDate(d.getDate() + delta);
    setDataSelezionata(d.toISOString().split('T')[0]);
  }

  async function logout() {
    await supabase.auth.signOut();
    resetDati();
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
              {isOggi && <p className="text-xs text-emerald-600 font-medium">Oggi</p>}
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
              vistaAttiva === 'diario' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Diario
          </button>
          <button
            onClick={() => setVista('report')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              vistaAttiva === 'report' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart2 size={15} />
            <span className="hidden sm:inline">Report</span>
          </button>
          <button
            onClick={() => setVista('impostazioni')}
            className={`p-1.5 rounded-lg transition-colors ${
              vistaAttiva === 'impostazioni' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={18} />
          </button>

          {/* Utente loggato */}
          {utente && (
            <div className="flex items-center gap-1 ml-1 pl-2 border-l border-gray-200">
              <div className="flex items-center gap-1 text-xs text-gray-500 max-w-[120px]">
                <User size={13} />
                <span className="truncate hidden sm:block">{utente.email}</span>
              </div>
              <button
                onClick={logout}
                title="Esci"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
