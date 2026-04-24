import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onSuccess: () => void;
}

type Modalita = 'login' | 'registrazione' | 'recupero';

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}


export function AuthModal({ onSuccess }: AuthModalProps) {
  const [modalita, setModalita] = useState<Modalita>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostraPassword, setMostraPassword] = useState(false);
  const [caricamento, setCaricamento] = useState(false);
  const [caricamentoOAuth, setCaricamentoOAuth] = useState<'google' | null>(null);
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
        setMessaggio("Registrazione completata! Controlla la tua email per confermare l'account, poi accedi.");
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
      else if (msg.includes('Email not confirmed')) setErrore("Devi confermare l'email prima di accedere.");
      else if (msg.includes('already registered')) setErrore('Questa email è già registrata. Prova ad accedere.');
      else setErrore(msg);
    } finally {
      setCaricamento(false);
    }
  }

  async function accediConProvider(provider: 'google') {
    setErrore('');
    setCaricamentoOAuth(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
      // Il browser viene reindirizzato al provider — nessuna azione aggiuntiva
    } catch (err) {
      const msg = (err as { message?: string }).message ?? 'Errore sconosciuto';
      setErrore(msg);
      setCaricamentoOAuth(null);
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
            <p className="text-sm text-gray-500 mt-1">
              Inserisci la tua email, ti invieremo un link per reimpostare la password.
            </p>
          </div>
        )}

        {/* ── Pulsanti OAuth ── */}
        {modalita !== 'recupero' && (
          <div className="space-y-2 mb-5">
            <button
              type="button"
              onClick={() => accediConProvider('google')}
              disabled={!!caricamentoOAuth}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              {caricamentoOAuth === 'google'
                ? <Loader2 size={18} className="animate-spin text-gray-400" />
                : <IconGoogle />}
              Continua con Google
            </button>

          </div>
        )}

        {/* Separatore */}
        {modalita !== 'recupero' && (
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">oppure con email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
        )}

        {/* Form email/password */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {errore && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-700">
              {errore}
            </div>
          )}

          {messaggio && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-sm text-emerald-700">
              {messaggio}
            </div>
          )}

          <button
            type="submit"
            disabled={caricamento}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {caricamento && <Loader2 size={16} className="animate-spin" />}
            {modalita === 'login' && 'Accedi con email'}
            {modalita === 'registrazione' && 'Crea account'}
            {modalita === 'recupero' && 'Invia email di recupero'}
          </button>
        </form>

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

        <p className="text-xs text-gray-400 text-center mt-6">
          I tuoi dati sono sincronizzati in cloud e accessibili da qualsiasi dispositivo.
        </p>
      </div>
    </div>
  );
}
