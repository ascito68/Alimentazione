import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onSuccess: () => void;
}

type Modalita = 'login' | 'registrazione' | 'recupero';

export function AuthModal({ onSuccess }: AuthModalProps) {
  const [modalita, setModalita] = useState<Modalita>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostraPassword, setMostraPassword] = useState(false);
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState('');
  const [messaggio, setMessaggio] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrore('');
    setMessaggio('');
    setCaricamento(true);

    try {
      if (modalita === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      } else if (modalita === 'registrazione') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessaggio('Registrazione completata! Controlla la tua email per confermare l\'account, poi accedi.');
        setModalita('login');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessaggio('Email di recupero inviata! Controlla la tua casella di posta.');
        setModalita('login');
      }
    } catch (err) {
      const msg = (err as { message?: string }).message ?? 'Errore sconosciuto';
      if (msg.includes('Invalid login credentials')) setErrore('Email o password non corretti.');
      else if (msg.includes('Email not confirmed')) setErrore('Devi confermare l\'email prima di accedere.');
      else if (msg.includes('already registered')) setErrore('Questa email è già registrata. Prova ad accedere.');
      else setErrore(msg);
    } finally {
      setCaricamento(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl">🥗</span>
          <h1 className="text-2xl font-extrabold text-gray-800 mt-3">NutriTrack</h1>
          <p className="text-sm text-gray-500 mt-1">Gestione calorie e macronutrienti</p>
        </div>

        {/* Tab modalità */}
        {modalita !== 'recupero' && (
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setModalita('login'); setErrore(''); setMessaggio(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                modalita === 'login' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Accedi
            </button>
            <button
              type="button"
              onClick={() => { setModalita('registrazione'); setErrore(''); setMessaggio(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                modalita === 'registrazione' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Registrati
            </button>
          </div>
        )}

        {modalita === 'recupero' && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recupera password</h2>
            <p className="text-sm text-gray-500 mt-1">Inserisci la tua email, ti invieremo un link per reimpostare la password.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tua@email.com"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Password */}
          {modalita !== 'recupero' && (
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={mostraPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimo 6 caratteri"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setMostraPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostraPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Errore */}
          {errore && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-700">
              {errore}
            </div>
          )}

          {/* Messaggio successo */}
          {messaggio && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-sm text-emerald-700">
              {messaggio}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={caricamento}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {caricamento && <Loader2 size={16} className="animate-spin" />}
            {modalita === 'login' && 'Accedi'}
            {modalita === 'registrazione' && 'Crea account'}
            {modalita === 'recupero' && 'Invia email di recupero'}
          </button>
        </form>

        {/* Link recupero password */}
        {modalita === 'login' && (
          <button
            type="button"
            onClick={() => { setModalita('recupero'); setErrore(''); setMessaggio(''); }}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-4"
          >
            Password dimenticata?
          </button>
        )}

        {modalita === 'recupero' && (
          <button
            type="button"
            onClick={() => { setModalita('login'); setErrore(''); setMessaggio(''); }}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-4"
          >
            ← Torna al login
          </button>
        )}

        {/* Info dati */}
        <p className="text-xs text-gray-400 text-center mt-6">
          I tuoi dati sono sincronizzati in cloud e accessibili da qualsiasi dispositivo.
        </p>
      </div>
    </div>
  );
}
