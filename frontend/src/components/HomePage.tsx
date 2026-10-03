import React, { useState } from 'react';
import { UserPreferences, EvaluatedPOI, POI, NavigationTab } from '../types';
import { 
  Compass, 
  MapPin, 
  Sliders, 
  Accessibility, 
  Luggage, 
  Baby, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Navigation, 
  Layers, 
  PlusCircle, 
  HelpCircle,
  Eye,
  Settings,
  Sparkles,
  Info,
  Smartphone,
  Zap,
  Ruler,
  ShieldAlert
} from 'lucide-react';

interface Props {
  preferences: UserPreferences;
  onSelectPreferences: (prefs: UserPreferences) => void;
  evaluatedPois: EvaluatedPOI[];
  onSelectPoi: (poi: POI) => void;
  onNavigateToTab: (tab: NavigationTab, searchFilter?: string) => void;
  onOpenReportModal: () => void;
}

export const HomePage: React.FC<Props> = ({
  preferences,
  onSelectPreferences,
  evaluatedPois,
  onSelectPoi,
  onNavigateToTab,
  onOpenReportModal
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigateToTab('places', searchInput.trim());
    } else {
      onNavigateToTab('places');
    }
  };

  const handleQuickTagClick = (tag: string) => {
    onNavigateToTab('places', tag);
  };

  const applyPreset = (presetKey: string) => {
    switch (presetKey) {
      case 'wheelchair':
        onSelectPreferences({
          preset_name: 'wheelchair',
          min_door_width_cm: 85,
          max_curb_cm: 2.0,
          avoid_stairs: true,
          avoid_rough_surfaces: false,
          require_elevator_if_multi_floor: true,
          require_accessible_toilet: true,
          require_rest_places: false,
          require_hearing_loop: false
        });
        break;
      case 'luggage':
        onSelectPreferences({
          preset_name: 'luggage',
          min_door_width_cm: 80,
          max_curb_cm: 3.0,
          avoid_stairs: true,
          avoid_rough_surfaces: true,
          require_elevator_if_multi_floor: true,
          require_accessible_toilet: false,
          require_rest_places: false,
          require_hearing_loop: false
        });
        break;
      case 'stroller':
        onSelectPreferences({
          preset_name: 'stroller',
          min_door_width_cm: 75,
          max_curb_cm: 4.0,
          avoid_stairs: true,
          avoid_rough_surfaces: false,
          require_elevator_if_multi_floor: true,
          require_accessible_toilet: false,
          require_rest_places: true,
          require_hearing_loop: false
        });
        break;
      case 'senior':
        onSelectPreferences({
          preset_name: 'senior',
          min_door_width_cm: 75,
          max_curb_cm: 3.0,
          avoid_stairs: true,
          avoid_rough_surfaces: true,
          require_elevator_if_multi_floor: true,
          require_accessible_toilet: false,
          require_rest_places: true,
          require_hearing_loop: false
        });
        break;
      default:
        break;
    }
  };

  // Wybór wyróżnionych obiektów (najwyżej oceniane lub kluczowe zabytki)
  const featuredPois = evaluatedPois.slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* 1. HERO SECTION (JASNY PANEL POWITALNY) */}
      <section 
        aria-label="Główny panel powitalny" 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/90 via-white to-sky-50/70 text-slate-900 p-6 sm:p-10 lg:p-14 shadow-sm border border-blue-100/90"
      >
        {/* Dekoracyjne elementy tła */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Herb/Badge miejski */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/70 text-xs font-bold text-blue-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Kraków Bez Barier • Oficjalna Platforma Dostępności Miejskiej</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Odkrywaj Kraków <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600">
              bez barier architektonicznych
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pierwsza platforma parametrycznej oceny dostępności zabytków, urzędów, muzeów i tras spacerowych. 
            Dokładne wymiary w centymetrach, stopnie, windy, toalety i rodzaj nawierzchni – dopasowane precyzyjnie do Twoich potrzeb.
          </p>

          {/* Szybka Wyszukiwarka w Hero */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-md p-2 border border-slate-200/90 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Czego szukasz? np. Wawel, Sukiennice, Dworzec, Cricoteka..."
                aria-label="Wyszukaj obiekt lub miejsce w Krakowie"
                className="w-full px-3 py-2 text-slate-900 text-sm focus:outline-hidden rounded-xl bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <span>Szukaj</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Szybkie tagi / podpowiedzi */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
              <span className="text-slate-400 font-semibold">Popularne:</span>
              {['Sukiennice', 'Wawel', 'Kraków Główny', 'Planty', 'Kazimierz', 'Cricoteka'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Główne Przyciski Akcji */}
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => onNavigateToTab('places')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-700/20 transition-all hover:-translate-y-0.5"
            >
              <MapPin className="w-4 h-4" />
              <span>Przeglądaj Mapę i Miejsca</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('routes')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-xs transition-all hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Dostępne Trasy Piesze</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('settings')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-xs transition-all hover:-translate-y-0.5"
            >
              <Settings className="w-4 h-4 text-amber-600" />
              <span>Ustawienia i Opcje</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. PREZENTACJA / REKLAMA MOŻLIWOŚCI APLIKACJI (4 FILARY DOSTĘPNOŚCI) - JASNY MOTYW */}
      <section 
        aria-label="Prezentacja kluczowych możliwości aplikacji Kraków Bez Barier" 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/60 text-slate-900 p-6 sm:p-8 lg:p-10 shadow-md border border-blue-200/80"
      >
        {/* Rozmyte światła ambientowe w stylu reklamy aplikacji */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-300/10 rounded-full blur-3xl pointer-events-none" />

        {/* Nagłówek w stylu reklamy aplikacji */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide mb-3 shadow-2xs">
              <Smartphone className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>APLIKACJA MIEJSKA NOWEJ GENERACJI • WEB & PWA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
              <span className="text-emerald-700 font-bold">LIVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Aplikacja, która nie zgaduje Twojej drogi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Standardowe mapy kończą się na ogólnym znaczku „dostępne”. Kraków Bez Barier dostarcza twarde fakty, wymiary w centymetrach i pełną transparentność danych.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Błyskawiczna (PWA)</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Śledzenia RODO</span>
            </div>
          </div>
        </div>

        {/* 4 Kluczowe Karty Reklamowe (Dokładne elementy użytkownika w jasnym stylu) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Karta 1: 10+ Obiektów */}
          <div className="bg-white hover:bg-blue-50/40 rounded-2xl p-5 border border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Baza Wiedzy
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                10+ Obiektów
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                Zweryfikowanych kluczowych punktów w Krakowie
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                Wawel, Sukiennice, Dworzec Główny i zabytki. Wszystkie sprawdzone w terenie pod kątem realnych barier architektonicznych.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Audyt terenowy</span>
              </span>
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors">UMK / OSM</span>
            </div>
          </div>

          {/* Karta 2: 100% Parametrów */}
          <div className="bg-white hover:bg-emerald-50/40 rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  <Ruler className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Twarde Liczby
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                100% Parametrów
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                Centymetry i stopnie zamiast ogólnego „dostępne”
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                Precyzyjne wymiary drzwi, progów, nachylenia ramp i kabin toalet. Ty sam decydujesz, co jest dla Ciebie bezpieczne.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dokładność do cm</span>
              </span>
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors">Zero ogólników</span>
            </div>
          </div>

          {/* Karta 3: Brak danych != Dostępne */}
          <div className="bg-white hover:bg-amber-50/40 rounded-2xl p-5 border border-slate-200 hover:border-amber-300 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Uczciwość Danych
                </span>
              </div>
              <div className="text-xl sm:text-2xl lg:text-[1.65rem] font-black text-slate-900 tracking-tight group-hover:text-amber-800 transition-colors flex items-center gap-1.5 flex-wrap">
                <span>Brak danych</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 font-mono text-base font-bold">!=</span>
                <span>Dostępne</span>
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                Luki informacyjne są oznaczane jako ostrzeżenia
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                Nigdy nie ryzykujemy Twojego bezpieczeństwa domysłami. Gdy brak audytu wejścia, system wyraźnie informuje o luce.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Czerwona flaga</span>
              </span>
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors">Zero domysłów</span>
            </div>
          </div>

          {/* Karta 4: WCAG 2.2 AA */}
          <div className="bg-white hover:bg-purple-50/40 rounded-2xl p-5 border border-slate-200 hover:border-purple-300 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Standard Cyfrowy
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors">
                WCAG 2.2 AA
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                Kontrast, powiększenie tekstu i obsługa czytników
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                Aplikacja dostępna cyfrowo: tryb wysokiego kontrastu, czcionka ułatwiająca czytanie przy dysleksji i nawigacja klawiaturą.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-purple-700">
                <Eye className="w-3.5 h-3.5" />
                <span>Pełna dostępność</span>
              </span>
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors">EAA Standard</span>
            </div>
          </div>
        </div>

        {/* Dolny baner reklamowy - Instalacja PWA i mobilność (Jasny motyw) */}
        <div className="relative z-10 mt-6 pt-5 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-xs -mx-6 sm:-mx-8 lg:-mx-10 -mb-6 sm:-mb-8 lg:-mb-10 p-5 sm:p-6 rounded-b-3xl border-b border-x border-blue-200/60">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 hidden sm:flex">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span>Zainstaluj na smartfonie bezpośrednio z przeglądarki (PWA)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                  Bez pobierania ze sklepu
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Brak opłat, 100% zgodności z RODO, błyskawiczne działanie w terenie i oszczędność baterii podczas spaceru po Krakowie.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateToTab('places')}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-700/20 flex items-center gap-1.5 hover:scale-105"
            >
              <span>Przeglądaj obiekty</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SZYBKI WYBÓR PROFILU MOBILNOŚCI */}
      <section aria-labelledby="profile-heading" className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Personalizacja parametrów</span>
            </div>
            <h2 id="profile-heading" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Wybierz swój profil mobilności
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Kliknij profil, aby natychmiast przeliczyć ocenę dostępności obiektów w Krakowie. Żadnych pytań o orzeczenia medyczne.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('settings')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200 transition-colors self-start md:self-auto"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Zaawansowane parametry w Ustawieniach →</span>
          </button>
        </div>

        {/* Siatka profili */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Profil: Wózek */}
          <button
            type="button"
            onClick={() => applyPreset('wheelchair')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              preferences.preset_name === 'wheelchair'
                ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Accessibility className="w-5 h-5" />
              </div>
              {preferences.preset_name === 'wheelchair' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-700 text-white">Aktywny</span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Osoba na wózku</h3>
            <p className="text-[11px] text-slate-500 mb-2.5">Manualnym lub elektrycznym</p>
            <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
              <div className="flex justify-between"><span>Drzwi min.:</span> <strong className="text-slate-800">≥ 85 cm</strong></div>
              <div className="flex justify-between"><span>Próg max.:</span> <strong className="text-slate-800">≤ 2.0 cm</strong></div>
              <div className="flex justify-between"><span>Winda i toaleta:</span> <strong className="text-emerald-700">Wymagane</strong></div>
            </div>
          </button>

          {/* Profil: Walizka */}
          <button
            type="button"
            onClick={() => applyPreset('luggage')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              preferences.preset_name === 'luggage'
                ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Luggage className="w-5 h-5" />
              </div>
              {preferences.preset_name === 'luggage' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">Aktywny</span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Turysta z walizką</h3>
            <p className="text-[11px] text-slate-500 mb-2.5">Podróż bez wibracji i dźwigania</p>
            <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
              <div className="flex justify-between"><span>Kocie łby:</span> <strong className="text-rose-700">Unikaj</strong></div>
              <div className="flex justify-between"><span>Schody:</span> <strong className="text-rose-700">Unikaj</strong></div>
              <div className="flex justify-between"><span>Pochylnie:</span> <strong className="text-emerald-700">Wskazane</strong></div>
            </div>
          </button>

          {/* Profil: Wózek dziecięcy */}
          <button
            type="button"
            onClick={() => applyPreset('stroller')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              preferences.preset_name === 'stroller'
                ? 'bg-purple-50/80 border-purple-600 ring-2 ring-purple-500/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Baby className="w-5 h-5" />
              </div>
              {preferences.preset_name === 'stroller' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">Aktywny</span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Rodzina z dzieckiem</h3>
            <p className="text-[11px] text-slate-500 mb-2.5">Wózek gondola lub spacerówka</p>
            <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
              <div className="flex justify-between"><span>Drzwi min.:</span> <strong className="text-slate-800">≥ 75 cm</strong></div>
              <div className="flex justify-between"><span>Próg max.:</span> <strong className="text-slate-800">≤ 4.0 cm</strong></div>
              <div className="flex justify-between"><span>Strefy odpoczynku:</span> <strong className="text-emerald-700">Wymagane</strong></div>
            </div>
          </button>

          {/* Profil: Senior */}
          <button
            type="button"
            onClick={() => applyPreset('senior')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              preferences.preset_name === 'senior'
                ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              {preferences.preset_name === 'senior' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">Aktywny</span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Senior / Asysta</h3>
            <p className="text-[11px] text-slate-500 mb-2.5">Miejsca odpoczynku i poręcze</p>
            <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
              <div className="flex justify-between"><span>Ławki i odpoczynek:</span> <strong className="text-emerald-700">Wymagane</strong></div>
              <div className="flex justify-between"><span>Schody bez windy:</span> <strong className="text-rose-700">Unikaj</strong></div>
              <div className="flex justify-between"><span>Bruk kamienny:</span> <strong className="text-rose-700">Unikaj</strong></div>
            </div>
          </button>
        </div>
      </section>

      {/* 4. WYRÓŻNIONE DOSTĘPNE MIEJSCA */}
      <section aria-labelledby="featured-places-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dopasowane do Twojego profilu</span>
            </div>
            <h2 id="featured-places-heading" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Wyróżnione miejsca w Krakowie
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('places')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            <span>Zobacz wszystkie obiekty ({evaluatedPois.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPois.map(({ poi, evaluation }) => {
            const isHighMatch = evaluation.match_score >= 80;
            const hasGaps = evaluation.status === 'insufficient_data';

            return (
              <div 
                key={poi.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {poi.category}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      hasGaps 
                        ? 'bg-rose-100 text-rose-800'
                        : isHighMatch 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {hasGaps ? 'Luki danych' : `${evaluation.match_score}% dopasowania`}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                    {poi.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{poi.address}</span>
                  </p>

                  <div className="my-3 py-2 border-y border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Wejście:</span>
                      <strong>{poi.features.steps_at_entrance === 0 ? '0 stopni (płasko)' : `${poi.features.steps_at_entrance} st.`}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Szerokość drzwi:</span>
                      <strong>{poi.features.entrance_width_cm ? `${poi.features.entrance_width_cm} cm` : 'Brak danych'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Toaleta:</span>
                      <strong>{poi.features.accessible_toilet.available ? 'Dostosowana' : 'Brak / Nie'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Winda:</span>
                      <strong>{poi.features.elevator.available ? 'Dostępna' : 'Brak / Nie'}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectPoi(poi)}
                    className="flex-1 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors text-center"
                  >
                    Szczegóły audytu
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('places', poi.name)}
                    aria-label={`Pokaż ${poi.name} na mapie`}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. POLECANE TRASY SPACEROWE */}
      <section aria-labelledby="featured-routes-heading" className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Navigation className="w-3.5 h-3.5" />
              <span>Nawigacja bez barier</span>
            </div>
            <h2 id="featured-routes-heading" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rekomendowane trasy piesze
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Analiza nawierzchni krok po kroku z podziałem na asfalt, płyty chodnikowe i kocie łby.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('routes')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Compass className="w-4 h-4" />
            <span>Otwórz Planer Tras</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Karta Trasy 1 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  Dystans: 850 metrów
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Rekomendowana (92%)
                </span>
              </div>
              <h3 className="font-black text-base text-slate-900 mb-1">
                🚆 Dworzec Główny PKP → Rynek Główny
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Trasa przez Planty i ul. Szpitalną. Płaskie wjazdy z peronów, gładkie płyty chodnikowe i asfalt w parku.
              </p>

              {/* Pasek nawierzchni */}
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Nawierzchnia:</span>
                  <strong>60% płyty, 30% asfalt, 10% bruk</strong>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-200">
                  <div style={{ width: '60%' }} className="bg-blue-500" title="Płyty chodnikowe 60%" />
                  <div style={{ width: '30%' }} className="bg-emerald-500" title="Asfalt 30%" />
                  <div style={{ width: '10%' }} className="bg-amber-500" title="Bruk 10%" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab('routes')}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Zobacz etapy trasy krok po kroku</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Karta Trasy 2 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  Dystans: 950 metrów
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Wymaga uwagi (75%)
                </span>
              </div>
              <h3 className="font-black text-base text-slate-900 mb-1">
                🏰 Rynek Główny → Zamek Królewski Wawel
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Trasa przez ul. Grodzką. Historyczna kostka brukowa na podejściu wawelskim wymaga uwagi przy wózkach i walizkach.
              </p>

              {/* Pasek nawierzchni */}
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Nawierzchnia:</span>
                  <strong>50% płyty, 35% bruk, 15% kocie łby</strong>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-200">
                  <div style={{ width: '50%' }} className="bg-blue-500" title="Płyty 50%" />
                  <div style={{ width: '35%' }} className="bg-amber-500" title="Bruk 35%" />
                  <div style={{ width: '15%' }} className="bg-rose-500" title="Kocie łby 15%" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab('routes')}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Zobacz etapy trasy krok po kroku</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. FILARY PROJEKTU - DLACZEGO TO DZIAŁA (JASNA SEKCJA) */}
      <section aria-labelledby="why-heading" className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 text-slate-900 rounded-3xl p-6 sm:p-10 shadow-xs border border-blue-100">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            Innowacja i Rzetelność
          </div>
          <h2 id="why-heading" className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Dlaczego standardowe mapy zawodzą, a Kraków Bez Barier daje pewność?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Koniec z jednym znaczkiem „dostępne dla niepełnosprawnych”. Rzeczywiste potrzeby wymagają konkretnych danych.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black mb-3">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5">Parametry zamiast etykiet</h3>
            <p className="text-slate-600 leading-relaxed">
              Podajemy dokładną liczbę stopni, szerokość drzwi w centymetrach, kąt nachylenia rampy i rodzaj nawierzchni. Ty decydujesz, co jest dla Ciebie bezpieczne.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black mb-3">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5">Piramida wiarygodności</h3>
            <p className="text-slate-600 leading-relaxed">
              Każde miejsce ma określone źródło (audyt miejski UMK, OpenStreetMap lub zgłoszenie mieszkańców) i datę ostatniej weryfikacji w terenie.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black mb-3">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5">Brak danych != Dostępne</h3>
            <p className="text-slate-600 leading-relaxed">
              Gdy nie ma pomiaru wejścia lub toalety, system ostrzega czerwoną plakietką „Luki w danych”. Nigdy nie ryzykujemy Twojego bezpieczeństwa domysłami.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-black mb-3">
              4
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5">Prywatność (RODO)</h3>
            <p className="text-slate-600 leading-relaxed">
              Zero pytań o stan zdrowia czy niepełnosprawność. Twoje ustawienia fizyczne pozostają wyłącznie w Twojej przeglądarce i nie są profilowane.
            </p>
          </div>
        </div>
      </section>

      {/* 7. WSPÓŁTWORZENIE I ZGŁASZANIE BARIER */}
      <section aria-label="Zgłaszanie barier architektonicznych" className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-blue-950">
            Zauważyłeś nową barierę lub błąd w danych w Krakowie?
          </h2>
          <p className="text-xs text-blue-800 max-w-xl">
            Społeczność jest sercem tego projektu. Zgłoś brakujący podjazd, remont wejścia lub nieczynną windę w prostym formularzu.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenReportModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Zgłoś barierę / Dodaj korektę</span>
        </button>
      </section>

      {/* 8. ODNIESIENIA DO USTAWIEŃ I OPCJI */}
      <section aria-labelledby="settings-ref-heading" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="mb-6">
          <h2 id="settings-ref-heading" className="text-lg sm:text-xl font-bold text-slate-900">
            Centrum ustawień i opcji dostępności
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dostosuj aplikację pod kątem wzroku, obsługi klawiatury, parametrów architektonicznych i prywatności.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            type="button"
            onClick={() => onNavigateToTab('settings')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 mb-0.5">Kontrast i Rozmiar Tekstu</h3>
            <p className="text-[11px] text-slate-500">Standard WCAG: powiększ czcionkę lub włącz wysoki kontrast.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToTab('settings')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 mb-0.5">Precyzyjne Wymiary</h3>
            <p className="text-[11px] text-slate-500">Ustaw suwakami szerokość drzwi (cm) i tolerancję progów.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToTab('settings')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 mb-0.5">Styl Mapy i Widoki</h3>
            <p className="text-[11px] text-slate-500">Wybierz domyślny podgląd (mapa, lista lub widok dzielony).</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToTab('settings')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 mb-0.5">Prywatność i Pamięć</h3>
            <p className="text-[11px] text-slate-500">Zarządzaj lokalnym zapisem danych i wyczyść pamięć.</p>
          </button>
        </div>
      </section>
    </div>
  );
};
