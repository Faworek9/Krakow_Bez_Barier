import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { X, Lock, Mail, User, Building2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotification?: (msg: string) => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccessNotification
}) => {
  const { login, register, demoLogin } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Formularz logowania
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Formularz rejestracji
  const [regRole, setRegRole] = useState<UserRole>('user');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regNip, setRegNip] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoadingAction(true);
    const res = await login(loginEmail, loginPassword);
    setLoadingAction(false);
    if (res.success) {
      if (onSuccessNotification) onSuccessNotification('Pomyślnie zalogowano do platformy Kraków Bez Barier!');
      onClose();
    } else {
      setErrorMsg(res.error || 'Nieprawidłowe dane logowania');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoadingAction(true);
    const res = await register({
      email: regEmail,
      password: regPassword,
      role: regRole,
      display_name: regDisplayName,
      company_name: regRole === 'business' ? regCompanyName : undefined,
      nip: regRole === 'business' ? regNip : undefined,
      phone: regRole === 'business' ? regPhone : undefined
    });
    setLoadingAction(false);
    if (res.success) {
      if (onSuccessNotification) onSuccessNotification('Konto zostało utworzone i jesteś teraz zalogowany!');
      onClose();
    } else {
      setErrorMsg(res.error || 'Błąd rejestracji konta');
    }
  };

  const handleDemoClick = async (role: 'user' | 'business') => {
    setErrorMsg(null);
    setLoadingAction(true);
    const res = await demoLogin(role);
    setLoadingAction(false);
    if (res.success) {
      const label = role === 'business' ? 'profil Właściciela Lokalu (Firma)' : 'profil Mieszkańca (Jan Kowalski)';
      if (onSuccessNotification) onSuccessNotification(`Zalogowano jako ${label}!`);
      onClose();
    } else {
      setErrorMsg(res.error || 'Błąd logowania demo');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Nagłówek Modalu */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij okno logowania"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-blue-200" />
            <h3 id="auth-modal-title" className="text-lg font-black tracking-tight">
              {tab === 'login' ? 'Zaloguj się do platformy' : 'Dołącz do Kraków Bez Barier'}
            </h3>
          </div>
          <p className="text-xs text-blue-100">
            Dostęp dla mieszkańców, recenzentów oraz właścicieli krakowskich lokali i instytucji.
          </p>

          {/* Przełącznik Zakładek */}
          <div className="flex gap-2 mt-4 bg-blue-950/40 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setTab('login'); setErrorMsg(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'login'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Logowanie
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setErrorMsg(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'register'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Rejestracja
            </button>
          </div>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* FORMULARZ LOGOWANIA */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Adres e-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="twoj.email@example.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hasło</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingAction}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                {loadingAction ? 'Logowanie...' : 'Zaloguj się'}
              </button>
            </form>
          ) : (
            /* FORMULARZ REJESTRACJI */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              {/* Wybór Roli */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Wybierz typ konta:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('user')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      regRole === 'user'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Mieszkaniec</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      Komentuj, oceniaj i zgłaszaj bariery
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('business')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      regRole === 'business'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>Firma / Lokal</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      Dodawaj i zarządzaj swoim lokalem
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {regRole === 'business' ? 'Imię i nazwisko osoby reprezentującej' : 'Nazwa / Pseudonim recenzenta'}
                </label>
                <input
                  type="text"
                  required
                  value={regDisplayName}
                  onChange={(e) => setRegDisplayName(e.target.value)}
                  placeholder={regRole === 'business' ? 'np. Anna Nowak (Menedżer)' : 'np. Jan Kowalski'}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              {regRole === 'business' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Oficjalna nazwa lokalu / firmy</label>
                    <input
                      type="text"
                      required
                      value={regCompanyName}
                      onChange={(e) => setRegCompanyName(e.target.value)}
                      placeholder="np. Kawiarnia Relaks sp. z o.o."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIP (opcjonalny)</label>
                      <input
                        type="text"
                        value={regNip}
                        onChange={(e) => setRegNip(e.target.value)}
                        placeholder="np. 6762512345"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Telefon kontaktowy</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+48 12 345 67 89"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Adres e-mail</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="twoj.email@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hasło</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 znaków"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loadingAction}
                className={`w-full py-2.5 font-bold rounded-xl text-white transition-colors shadow-xs disabled:opacity-50 ${
                  regRole === 'business'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                {loadingAction ? 'Tworzenie konta...' : regRole === 'business' ? 'Zarejestruj profil lokalu' : 'Utwórz konto mieszkańca'}
              </button>
            </form>
          )}

          {/* SZYBKIE LOGOWANIE DLA JURY (DEMO 1-CLICK) */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Szybkie konta demonstracyjne (Dla Jury):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleDemoClick('user')}
                disabled={loadingAction}
                className="px-3 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-xl text-left transition-all group"
              >
                <div className="font-bold text-slate-800 group-hover:text-blue-700 text-xs flex items-center gap-1">
                  <span>👤</span>
                  <span>Jan Kowalski</span>
                </div>
                <div className="text-[10px] text-slate-500">Mieszkaniec / Wózek</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('business')}
                disabled={loadingAction}
                className="px-3 py-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-xl text-left transition-all group"
              >
                <div className="font-bold text-slate-800 group-hover:text-amber-800 text-xs flex items-center gap-1">
                  <span>🏢</span>
                  <span>Kawiarnia Relaks</span>
                </div>
                <div className="text-[10px] text-slate-500">Właściciel Lokalu</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
