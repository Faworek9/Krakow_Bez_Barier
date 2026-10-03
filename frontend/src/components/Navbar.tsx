import React from 'react';
import { Eye, Sun, PlusCircle, Compass, MapPin } from 'lucide-react';

interface Props {
  highContrast: boolean;
  onToggleHighContrast: () => void;
  activeTab: 'places' | 'routes';
  onSelectTab: (tab: 'places' | 'routes') => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  highContrast,
  onToggleHighContrast,
  activeTab,
  onSelectTab,
  onOpenReportModal
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Skip Link dla czytników ekranu (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:z-50 focus:shadow-lg font-medium"
      >
        Przejdź do głównej zawartości
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo i Nazwa */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
              KRK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Kraków Bez Barier</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full uppercase">
                  Wersja Prototypowa
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Wiarygodna ocena dostępności miejsc i tras dla każdego
              </p>
            </div>
          </div>

          {/* Przełącznik Zakładek Głównych */}
          <nav aria-label="Główna nawigacja" className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onSelectTab('places')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'routes'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              Dostępne Trasy Piesze
            </button>
          </nav>

          {/* Dostępność Cyfrowa i Akcje */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleHighContrast}
              aria-pressed={highContrast}
              aria-label="Włącz tryb wysokiego kontrastu (WCAG)"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-black ring-2 ring-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Kontrast</span>
            </button>

            <button
              type="button"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Zgłoś barierę / korektę</span>
            </button>
          </div>
        </div>

        {/* Mobilna nawigacja zakładek */}
        <div className="flex md:hidden border-t border-slate-100 py-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectTab('places')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'places' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            Miejsca
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('routes')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'routes' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            Trasy piesze
          </button>
        </div>
      </div>
    </header>
  );
};
