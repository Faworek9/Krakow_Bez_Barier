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
import { useLanguage } from '../context/LanguageContext';

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
  const { t, language } = useLanguage();
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
            <span>{t('heroPill')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            {t('heroTitle1')} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600">
              {t('heroTitle2')}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('heroDesc')}
          </p>

          {/* Szybka Wyszukiwarka w Hero */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-md p-2 border border-slate-200/90 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
                className="w-full px-3 py-2 text-slate-900 text-sm rounded-xl bg-transparent outline-none focus:outline-none focus:ring-0 search-input-no-outline"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <span>{t('searchBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Szybkie tagi / podpowiedzi */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
              <span className="text-slate-400 font-semibold">{t('popularLabel')}</span>
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
              <span>{t('btnBrowseMap')}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('routes')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-xs transition-all hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>{t('btnBrowseRoutes')}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('settings')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-xs transition-all hover:-translate-y-0.5"
            >
              <Settings className="w-4 h-4 text-amber-600" />
              <span>{t('btnBrowseSettings')}</span>
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
              <span>{t('showcaseBadge')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
              <span className="text-emerald-700 font-bold">LIVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              {t('showcaseTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {t('showcaseDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('showcasePwaPill')}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('showcasePrivacyPill')}</span>
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
                  {t('stat1Tag')}
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                {t('stat1Title')}
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                {t('stat1Sub')}
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                {t('stat1Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('stat1Badge')}</span>
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
                  {t('stat2Tag')}
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                {t('stat2Title')}
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                {t('stat2Sub')}
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                {t('stat2Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('stat2Badge')}</span>
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
                  {t('stat3Tag')}
                </span>
              </div>
              <div className="text-xl sm:text-2xl lg:text-[1.65rem] font-black text-slate-900 tracking-tight group-hover:text-amber-800 transition-colors flex items-center gap-1.5 flex-wrap">
                <span>{language === 'en' ? 'No data' : 'Brak danych'}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 font-mono text-base font-bold">!=</span>
                <span>{language === 'en' ? 'Accessible' : 'Dostępne'}</span>
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                {t('stat3Sub')}
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                {t('stat3Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('stat3Badge')}</span>
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
                  {t('stat4Tag')}
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors">
                {t('stat4Title')}
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                {t('stat4Sub')}
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                {t('stat4Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-purple-700">
                <Eye className="w-3.5 h-3.5" />
                <span>{t('stat4Badge')}</span>
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
                <span>{t('pwaTitle')}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                  {t('pwaBadge')}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {t('pwaDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateToTab('places')}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-700/20 flex items-center gap-1.5 hover:scale-105"
            >
              <span>{t('pwaBtn')}</span>
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
              <span>{t('profilesHeaderPill')}</span>
            </div>
            <h2 id="profile-heading" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('profilesTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              {t('profilesDesc')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('settings')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200 transition-colors self-start md:self-auto"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t('profilesAdvancedBtn')}</span>
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-700 text-white">{t('activeBadge')}</span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">{t('profileWheelchairTitle')}</h3>
            <p className="text-[11px] text-slate-500 mb-2.5">{t('profileWheelchairDesc')}</p>
            <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
              <div className="flex justify-between"><span>{t('ruleMinDoor')}</span> <strong className="text-slate-800">≥ 85 cm</strong></div>
              <div className="flex justify-between"><span>{t('ruleMaxThreshold')}</span> <strong className="text-slate-800">≤ 2.0 cm</strong></div>
              <div className="flex justify-between"><span>{t('ruleElevatorToilet')}</span> <strong className="text-emerald-700">{t('ruleRequired')}</strong></div>
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">{t('activeBadge')}</span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">{t('profileLuggageTitle')}</h3>
            <p className="text-[11px] text-slate-500 mb-2.5">{t('profileLuggageDesc')}</p>
            <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
              <div className="flex justify-between"><span>{t('ruleCobblestones')}</span> <strong className="text-rose-700">{t('ruleAvoid')}</strong></div>
              <div className="flex justify-between"><span>{t('ruleStairs')}</span> <strong className="text-rose-700">{t('ruleAvoid')}</strong></div>
              <div className="flex justify-between"><span>{t('ruleRamps')}</span> <strong className="text-emerald-700">{t('ruleRecommended')}</strong></div>
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">{t('activeBadge')}</span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">{t('profileStrollerTitle')}</h3>
            <p className="text-[11px] text-slate-500 mb-2.5">{t('profileStrollerDesc')}</p>
            <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
              <div className="flex justify-between"><span>{t('ruleMinDoor')}</span> <strong className="text-slate-800">≥ 75 cm</strong></div>
              <div className="flex justify-between"><span>{t('ruleMaxThreshold')}</span> <strong className="text-slate-800">≤ 4.0 cm</strong></div>
              <div className="flex justify-between"><span>{t('ruleRestAreas')}</span> <strong className="text-emerald-700">{t('ruleRequired')}</strong></div>
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">{t('activeBadge')}</span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">{t('profileSeniorTitle')}</h3>
            <p className="text-[11px] text-slate-500 mb-2.5">{t('profileSeniorDesc')}</p>
            <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
              <div className="flex justify-between"><span>{t('ruleBenchesRest')}</span> <strong className="text-emerald-700">{t('ruleRequired')}</strong></div>
              <div className="flex justify-between"><span>{t('ruleStairsNoLift')}</span> <strong className="text-rose-700">{t('ruleAvoid')}</strong></div>
              <div className="flex justify-between"><span>{t('ruleStonePaving')}</span> <strong className="text-rose-700">{t('ruleAvoid')}</strong></div>
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
              <span>{t('featuredPoisPill')}</span>
            </div>
            <h2 id="featured-places-heading" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('featuredPoisTitle')}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('places')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            <span>{t('featuredPoisAllBtn')} ({evaluatedPois.length})</span>
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
                      {hasGaps ? t('dataGapsBadge') : `${evaluation.match_score}% ${t('matchScore')}`}
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
                      <span className="text-slate-400 block">{t('entranceLabel')}</span>
                      <strong>{poi.features.steps_at_entrance === 0 ? '0 st. (flat)' : `${poi.features.steps_at_entrance} st.`}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t('doorWidthLabel')}</span>
                      <strong>{poi.features.entrance_width_cm ? `${poi.features.entrance_width_cm} cm` : '—'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t('toiletLabel')}</span>
                      <strong>{poi.features.accessible_toilet.available ? (language === 'en' ? 'Yes' : 'Dostosowana') : '—'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t('elevatorLabel')}</span>
                      <strong>{poi.features.elevator.available ? (language === 'en' ? 'Yes' : 'Dostępna') : '—'}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectPoi(poi)}
                    className="flex-1 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors text-center"
                  >
                    {t('auditDetailsBtn')}
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
              <span>{t('routesPill')}</span>
            </div>
            <h2 id="featured-routes-heading" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('routesTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('routesDesc')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('routes')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Compass className="w-4 h-4" />
            <span>{t('routesPlannerBtn')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Karta Trasy 1 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {t('distanceLabel')} 850 {language === 'en' ? 'meters' : 'metrów'}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('routeRecommendedBadge')}
                </span>
              </div>
              <h3 className="font-black text-base text-slate-900 mb-1">
                🚆 {t('route1Title')}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {t('route1Desc')}
              </p>

              {/* Pasek nawierzchni */}
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>{t('surfaceLabel')}</span>
                  <strong>{t('route1Surface')}</strong>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-200">
                  <div style={{ width: '60%' }} className="bg-blue-500" title="60%" />
                  <div style={{ width: '30%' }} className="bg-emerald-500" title="30%" />
                  <div style={{ width: '10%' }} className="bg-amber-500" title="10%" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab('routes')}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{t('viewRouteStepsBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Karta Trasy 2 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {t('distanceLabel')} 950 {language === 'en' ? 'meters' : 'metrów'}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {t('routeAttentionBadge')}
                </span>
              </div>
              <h3 className="font-black text-base text-slate-900 mb-1">
                🏰 {t('route2Title')}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {t('route2Desc')}
              </p>

              {/* Pasek nawierzchni */}
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>{t('surfaceLabel')}</span>
                  <strong>{t('route2Surface')}</strong>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-200">
                  <div style={{ width: '50%' }} className="bg-blue-500" title="50%" />
                  <div style={{ width: '35%' }} className="bg-amber-500" title="35%" />
                  <div style={{ width: '15%' }} className="bg-rose-500" title="15%" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab('routes')}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{t('viewRouteStepsBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. FILARY PROJEKTU - DLACZEGO TO DZIAŁA (JASNA SEKCJA) */}
      <section aria-labelledby="why-heading" className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 text-slate-900 rounded-3xl p-6 sm:p-10 shadow-xs border border-blue-100">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            {t('pillarsPill')}
          </div>
          <h2 id="why-heading" className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {t('pillarsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            {t('pillarsDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black mb-3">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5">{t('pillar1Title')}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t('pillar1Desc')}
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black mb-3">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5">{t('pillar2Title')}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t('pillar2Desc')}
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black mb-3">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5">{t('pillar3Title')}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t('pillar3Desc')}
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-black mb-3">
              4
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1.5">{t('pillar4Title')}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t('pillar4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 7. ODNIESIENIA DO USTAWIEŃ I OPCJI */}
      <section aria-labelledby="settings-ref-heading" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="mb-6">
          <h2 id="settings-ref-heading" className="text-lg sm:text-xl font-bold text-slate-900">
            {t('settingsTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('settingsDesc')}
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
            <h3 className="font-bold text-xs text-slate-900 mb-0.5">{language === 'en' ? 'Contrast & Text Scaling' : 'Kontrast i Rozmiar Tekstu'}</h3>
            <p className="text-[11px] text-slate-500">{language === 'en' ? 'WCAG standard: enlarge font or toggle high contrast.' : 'Standard WCAG: powiększ czcionkę lub włącz wysoki kontrast.'}</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToTab('settings')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 mb-0.5">{language === 'en' ? 'Precise Dimensions' : 'Precyzyjne Wymiary'}</h3>
            <p className="text-[11px] text-slate-500">{language === 'en' ? 'Set door width (cm) and step threshold limits.' : 'Ustaw suwakami szerokość drzwi (cm) i tolerancję progów.'}</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToTab('settings')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 mb-0.5">{language === 'en' ? 'Map Style & Views' : 'Styl Mapy i Widoki'}</h3>
            <p className="text-[11px] text-slate-500">{language === 'en' ? 'Choose default display (map, list, or split view).' : 'Wybierz domyślny podgląd (mapa, lista lub widok dzielony).'}</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToTab('settings')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 mb-0.5">{language === 'en' ? 'Privacy & Storage' : 'Prywatność i Pamięć'}</h3>
            <p className="text-[11px] text-slate-500">{language === 'en' ? 'Manage local storage and reset saved profile cache.' : 'Zarządzaj lokalnym zapisem danych i wyczyść pamięć.'}</p>
          </button>
        </div>
      </section>
    </div>
  );
};
