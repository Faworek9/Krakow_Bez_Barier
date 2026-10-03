import React from 'react';
import { Eye, PlusCircle, Compass, MapPin, Home, Settings, Type } from 'lucide-react';
import { NavigationTab } from '../types';

interface Props {
  highContrast: boolean;
  onToggleHighContrast: () => void;
  textSize: 'normal' | 'large' | 'xlarge';
  onCycleTextSize: () => void;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  highContrast,
  onToggleHighContrast,
  textSize,
  onCycleTextSize,
  activeTab,
  onSelectTab,
  onOpenReportModal
}) => {
  const getTextSizeLabel = () => {
    if (textSize === 'xlarge') return 'A++';
    if (textSize === 'large') return 'A+';
    return 'A';
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
      {/* Skip Link dla czytników ekranu (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-blue-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:z-50 focus:shadow-lg font-bold"
      >
        Przejdź do głównej zawartości
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo i Nazwa Platformy */}
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            aria-label="Kraków Bez Barier - Przejdź do strony głównej"
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-700/20 group-hover:scale-105 transition-transform shrink-0">
              KRK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                  Kraków Bez Barier
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AccessKraków
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Parametryczna ocena dostępności przestrzeni miejskiej
              </p>
            </div>
          </button>

          {/* Główna Nawigacja (Desktop) */}
          <nav aria-label="Główna nawigacja" className="hidden lg:flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Strona Główna
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('places')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'places'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Miejsca i Obiekty (POI)
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('routes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'routes'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              Dostępne Trasy Piesze
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              Ustawienia i Opcje
            </button>
          </nav>

          {/* Przyciski Dostępności Cyfrowej i Akcji */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Przełącznik Rozmiaru Czcionki (WCAG) */}
            <button
              type="button"
              onClick={onCycleTextSize}
              aria-label={`Zmień rozmiar tekstu (aktualny: ${textSize})`}
              title="Zmień rozmiar tekstu (WCAG)"
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              <Type className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>{getTextSizeLabel()}</span>
            </button>

            {/* Przełącznik Wysokiego Kontrastu (WCAG) */}
            <button
              type="button"
              onClick={onToggleHighContrast}
              aria-pressed={highContrast}
              aria-label="Przełącz tryb wysokiego kontrastu (WCAG)"
              title="Wysoki kontrast (WCAG AAA)"
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-black ring-2 ring-black font-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Kontrast</span>
            </button>

            {/* Skrót do Ustawień na tabletach/komputerach */}
            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              aria-label="Otwórz ustawienia i opcje dostępności"
              title="Ustawienia i opcje"
              className={`p-2 rounded-xl border transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Zgłoś barierę / korektę */}
            <button
              type="button"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Zgłoś barierę</span>
            </button>
          </div>
        </div>

        {/* Mobilny pasek zakładek (pod logiem) */}
        <div className="flex lg:hidden border-t border-slate-100 py-2 gap-1 overflow-x-auto" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'home'}
            onClick={() => onSelectTab('home')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'text-slate-600'
            }`}
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Główna</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'places'}
            onClick={() => onSelectTab('places')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'places' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'text-slate-600'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Miejsca</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'routes'}
            onClick={() => onSelectTab('routes')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'routes' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'text-slate-600'
            }`}
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Trasy</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            onClick={() => onSelectTab('settings')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'text-slate-600'
            }`}
          >
            <Settings className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ustawienia</span>
          </button>
        </div>
      </div>
    </header>
  );
};
