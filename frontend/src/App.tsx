import React, { useState, useEffect } from 'react';
import { UserPreferences, EvaluatedPOI, POI, NavigationTab, AppSettings } from './types';
import { useLanguage } from './context/LanguageContext';
import { SEED_POIS, evaluateAllLocally, evaluatePoiLocally } from './data/seedPlaces';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { SettingsView } from './components/SettingsView';
import { AccessibilityFilters } from './components/AccessibilityFilters';
import { POIList } from './components/POIList';
import { MapView } from './components/MapView';
import { RoutePlanner } from './components/RoutePlanner';
import { POIDetailModal } from './components/POIDetailModal';
import { ReportCorrectionModal } from './components/ReportCorrectionModal';
import { AuthModal } from './components/AuthModal';
import { BusinessPlaceModal } from './components/BusinessPlaceModal';
import { UserReportsModal } from './components/UserReportsModal';
import { Search, Map, List, CheckCircle, ShieldAlert, Sparkles, Filter, X } from 'lucide-react';

const DEFAULT_PREFERENCES: UserPreferences = {
  preset_name: 'wheelchair',
  min_door_width_cm: 85,
  max_curb_cm: 2.0,
  avoid_stairs: true,
  avoid_rough_surfaces: false,
  require_elevator_if_multi_floor: true,
  require_accessible_toilet: true,
  require_rest_places: false,
  require_hearing_loop: false
};

const DEFAULT_SETTINGS: AppSettings = {
  highContrast: false,
  textSize: 'normal',
  dyslexicFont: false,
  reducedMotion: false,
  soundAssistance: false,
  defaultTab: 'home',
  defaultViewMode: 'both',
  mapTileLayer: 'standard'
};

export const App: React.FC = () => {
  const { language, t } = useLanguage();
  // Wczytywanie preferencji użytkownika z localStorage
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('krakow_user_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Wczytywanie ustawień wyglądu i WCAG z localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('krakow_app_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Aktywna zakładka (domyślnie Strona Główna)
  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    try {
      const saved = localStorage.getItem('krakow_app_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.defaultTab) return parsed.defaultTab;
      }
    } catch {}
    return 'home';
  });

  const [viewMode, setViewMode] = useState<'both' | 'list' | 'map'>('both');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  // Stan ewaluacji obiektów (z natychmiastowym lokalnym fallbackiem bez opóźnień)
  const [evaluatedPois, setEvaluatedPois] = useState<EvaluatedPOI[]>(() => 
    evaluateAllLocally(SEED_POIS, preferences)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [detailModalPoi, setDetailModalPoi] = useState<POI | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportTargetPoi, setReportTargetPoi] = useState<POI | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stany nowych modali autoryzacji i firm
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [businessModalOpen, setBusinessModalOpen] = useState<boolean>(false);
  const [userReportsModalOpen, setUserReportsModalOpen] = useState<boolean>(false);

  const handlePlaceAdded = (newPoi: POI) => {
    const newEval = evaluatePoiLocally(newPoi, preferences);
    setEvaluatedPois((prev) => [{ poi: newPoi, evaluation: newEval }, ...prev]);
    handleNavigateToTab('places', newPoi.name);
  };

  // Synchronizacja preferencji z localStorage
  useEffect(() => {
    try {
      localStorage.setItem('krakow_user_preferences', JSON.stringify(preferences));
    } catch (e) {
      console.warn('Nie udało się zapisać preferencji w localStorage', e);
    }
  }, [preferences]);

  // Synchronizacja ustawień aplikacji z localStorage
  useEffect(() => {
    try {
      localStorage.setItem('krakow_app_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Nie udało się zapisać ustawień w localStorage', e);
    }
  }, [settings]);

  // Synchronizacja klas dostępności z elementem html (root) dla poprawnego skalowania REM i standardu WCAG
  useEffect(() => {
    const root = document.documentElement;

    // Rozmiar czcionki (skalowanie jednostek rem w całym dokumencie)
    root.classList.remove('text-scale-large', 'text-scale-xlarge');
    if (settings.textSize === 'large') {
      root.classList.add('text-scale-large');
    } else if (settings.textSize === 'xlarge') {
      root.classList.add('text-scale-xlarge');
    }

    // Tryb wysokiego kontrastu
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Czcionka dla osób z dysleksją
    if (settings.dyslexicFont) {
      root.classList.add('dyslexic-mode');
    } else {
      root.classList.remove('dyslexic-mode');
    }

    // Redukcja animacji
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [settings]);

  // Pobieranie i ocena obiektów z backendu FastAPI z bezpiecznym fallbackiem
  useEffect(() => {
    let isCancelled = false;

    const fetchAndEvaluate = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/poi/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferences)
        });
        if (res.ok && !isCancelled) {
          const data: EvaluatedPOI[] = await res.json();
          setEvaluatedPois(data);
          return;
        }
      } catch (err) {
        // W razie braku połączenia z backendem, wykorzystaj lokalny silnik ewaluacji
        console.info('Backend niedostępny – używam wbudowanego silnika ewaluacji:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }

      // Fallback lokalny
      if (!isCancelled) {
        setEvaluatedPois(evaluateAllLocally(SEED_POIS, preferences));
      }
    };

    fetchAndEvaluate();

    return () => {
      isCancelled = true;
    };
  }, [preferences]);

  // Filtrowanie po stronie klienta (wyszukiwarka, kategoria, dzielnica)
  const filteredItems = evaluatedPois.filter(({ poi }) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = poi.name.toLowerCase().includes(q) ||
                    poi.address.toLowerCase().includes(q) ||
                    (poi.description && poi.description.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedCategory && poi.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedDistrict && poi.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    return true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleCycleTextSize = () => {
    setSettings((prev) => {
      const nextSize = prev.textSize === 'normal' ? 'large' : prev.textSize === 'large' ? 'xlarge' : 'normal';
      showToast(`Zmieniono rozmiar tekstu na: ${nextSize === 'normal' ? 'Standardowy' : nextSize === 'large' ? 'Powiększony (+15%)' : 'Bardzo duży (+30%)'}`);
      return { ...prev, textSize: nextSize };
    });
  };

  const handleToggleHighContrast = () => {
    setSettings((prev) => {
      const nextVal = !prev.highContrast;
      showToast(nextVal ? 'Włączono tryb wysokiego kontrastu (WCAG AAA)' : 'Wyłączono tryb wysokiego kontrastu');
      return { ...prev, highContrast: nextVal };
    });
  };

  const handleResetDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setSettings(DEFAULT_SETTINGS);
    showToast('Przywrócono domyślne ustawienia profilu i wyglądu.');
  };

  const handleClearStorage = () => {
    try {
      localStorage.removeItem('krakow_user_preferences');
      localStorage.removeItem('krakow_app_settings');
      setPreferences(DEFAULT_PREFERENCES);
      setSettings(DEFAULT_SETTINGS);
      showToast('Pamięć lokalna została wyczyszczona.');
    } catch {
      showToast('Wystąpił problem przy czyszczeniu pamięci.');
    }
  };

  const handleNavigateToTab = (tab: NavigationTab, searchFilter?: string) => {
    setActiveTab(tab);
    if (searchFilter !== undefined) {
      setSearchQuery(searchFilter);
    }
    window.scrollTo({ top: 0, behavior: settings.reducedMotion ? 'auto' : 'smooth' });
  };

  // Klasy dostępności dla korzenia dokumentu
  const accessibilityClasses = [
    settings.highContrast ? 'high-contrast' : '',
    settings.textSize === 'large' ? 'text-scale-large' : settings.textSize === 'xlarge' ? 'text-scale-xlarge' : '',
    settings.dyslexicFont ? 'dyslexic-mode' : '',
    settings.reducedMotion ? 'reduced-motion' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 ${accessibilityClasses}`}>
      {/* Toast Notification (Jasny motyw) */}
      {toastMessage && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-slate-200 animate-fade-in"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            type="button" 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-slate-700"
            aria-label="Zamknij powiadomienie"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Górny Pasek Nawigacyjny */}
      <Navbar
        highContrast={settings.highContrast}
        onToggleHighContrast={handleToggleHighContrast}
        textSize={settings.textSize}
        onCycleTextSize={handleCycleTextSize}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={() => {
          setReportTargetPoi(null);
          setReportModalOpen(true);
        }}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenBusinessModal={() => setBusinessModalOpen(true)}
        onOpenUserReportsModal={() => setUserReportsModalOpen(true)}
      />

      {/* Główna Zawartość Strony */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ZAKŁADKA: STRONA GŁÓWNA */}
        {activeTab === 'home' && (
          <HomePage
            preferences={preferences}
            onSelectPreferences={setPreferences}
            evaluatedPois={evaluatedPois}
            onSelectPoi={(poi) => {
              setSelectedPoi(poi);
              setDetailModalPoi(poi);
            }}
            onNavigateToTab={handleNavigateToTab}
            onOpenReportModal={() => {
              setReportTargetPoi(null);
              setReportModalOpen(true);
            }}
          />
        )}

        {/* ZAKŁADKA: MIEJSCA I OBIEKTY (POI) */}
        {activeTab === 'places' && (
          <div className="space-y-4">
            {/* Nagłówek sekcji z powrotem do home i przejściem do opcji */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-700" />
                  {t('catalogTitle')}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('catalogDesc')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                >
                  {t('filterParamOptionsBtn')}
                </button>
              </div>
            </div>

            {/* Szybkie filtry preferencji dostępności */}
            <AccessibilityFilters
              preferences={preferences}
              onChange={setPreferences}
              onOpenSettings={() => setActiveTab('settings')}
            />

            {/* Pasek Wyszukiwania i Wyboru Widoku */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('catalogSearchPlaceholder')}
                  aria-label={language === 'en' ? 'Search place or address in Krakow' : 'Wyszukaj obiekt lub adres w Krakowie'}
                  className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:outline-none focus:ring-0 search-input-no-outline"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label={language === 'en' ? 'Clear search' : 'Wyczyść wyszukiwanie'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filtry Kategorii i Dzielnicy */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label={language === 'en' ? 'Filter by category' : 'Filtruj według kategorii'}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-medium"
                >
                  <option value="">{t('allCategories')}</option>
                  <option value="muzeum">{t('catMuseum')}</option>
                  <option value="zabytek">{t('catMonument')}</option>
                  <option value="urzad">{t('catOffice')}</option>
                  <option value="dworzec">{t('catStation')}</option>
                  <option value="kawiarnia">{t('catCafe')}</option>
                  <option value="restauracja">{t('catRestaurant')}</option>
                  <option value="park">{t('catPark')}</option>
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  aria-label={language === 'en' ? 'Filter by district' : 'Filtruj według dzielnicy'}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-medium"
                >
                  <option value="">{t('distAll')}</option>
                  <option value="Stare Miasto">{t('distOldTown')}</option>
                  <option value="Kazimierz">{t('distKazimierz')}</option>
                  <option value="Podgórze">{t('distPodgorze')}</option>
                </select>

                {/* Przełącznik Widoku (WCAG: Alternatywa tekstowa mapy) */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('both')}
                    aria-label={language === 'en' ? 'Show map and list side by side' : 'Pokaż mapę i listę obok siebie'}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      viewMode === 'both' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    {t('viewModeBoth')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    aria-label={language === 'en' ? 'Show accessible text list only' : 'Pokaż tylko dostępną listę tekstową'}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      viewMode === 'list' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    {t('viewModeList')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    aria-label={language === 'en' ? 'Show map only' : 'Pokaż tylko mapę'}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      viewMode === 'map' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    {t('viewModeMap')}
                  </button>
                </div>
              </div>
            </div>

            {/* Informacja o liczbie wyników dla czytników ekranu */}
            <div className="sr-only" role="status" aria-live="polite">
              {language === 'en'
                ? `Found ${filteredItems.length} places matching selected mobility criteria.`
                : `Znaleziono ${filteredItems.length} obiektów spełniających wybrane kryteria mobilności.`}
            </div>

            {/* Siatka: Lista + Mapa */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kolumna Listy */}
              {(viewMode === 'both' || viewMode === 'list') && (
                <div className={`${viewMode === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
                  {loading ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-xs font-bold">{t('loadingCalculating')}</p>
                    </div>
                  ) : (
                    <POIList
                      items={filteredItems}
                      selectedPoiId={selectedPoi?.id || null}
                      onSelectPoi={(poi) => {
                        setSelectedPoi(poi);
                        setDetailModalPoi(poi);
                      }}
                      onOpenReport={(poi) => {
                        setReportTargetPoi(poi);
                        setReportModalOpen(true);
                      }}
                    />
                  )}
                </div>
              )}

              {/* Kolumna Mapy */}
              {(viewMode === 'both' || viewMode === 'map') && (
                <div className={`${viewMode === 'both' ? 'lg:col-span-6 sticky top-24' : 'lg:col-span-12'}`}>
                  <MapView
                    items={filteredItems}
                    selectedPoi={selectedPoi}
                    onSelectPoi={(poi) => {
                      setSelectedPoi(poi);
                      setDetailModalPoi(poi);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ZAKŁADKA: TRASY PIESZE */}
        {activeTab === 'routes' && (
          <RoutePlanner 
            preferences={preferences} 
            availablePois={evaluatedPois.map(e => e.poi)} 
          />
        )}

        {/* ZAKŁADKA: USTAWIENIA I OPCJE */}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            preferences={preferences}
            onUpdatePreferences={setPreferences}
            onResetDefaults={handleResetDefaults}
            onClearStorage={handleClearStorage}
            onShowToast={showToast}
            onNavigateToTab={handleNavigateToTab}
          />
        )}
      </main>

      {/* Modal Szczegółów Audytu Obiektu */}
      <POIDetailModal
        poi={detailModalPoi}
        onClose={() => setDetailModalPoi(null)}
        onOpenReport={(poi) => {
          setReportTargetPoi(poi);
          setReportModalOpen(true);
        }}
      />

      {/* Modal Zgłaszania Korekty / Nowej Bariery */}
      <ReportCorrectionModal
        poi={reportTargetPoi}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSuccessNotification={showToast}
      />

      {/* Modal Logowania i Rejestracji (Użytkownicy i Firmy) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccessNotification={showToast}
      />

      {/* Modal Deklaracji i Dodawania Nowego Lokalu przez Firmy */}
      <BusinessPlaceModal
        isOpen={businessModalOpen}
        onClose={() => setBusinessModalOpen(false)}
        onPlaceAdded={handlePlaceAdded}
        onSuccessNotification={showToast}
      />

      {/* Modal Zgłoszeń i Recenzji Mieszkańca */}
      <UserReportsModal
        isOpen={userReportsModalOpen}
        onClose={() => setUserReportsModalOpen(false)}
        onOpenNewReport={() => {
          setUserReportsModalOpen(false);
          setReportTargetPoi(null);
          setReportModalOpen(true);
        }}
      />

      {/* Profesjonalna Stopka Miejska */}
      <footer className="bg-white border-t border-slate-200/90 py-8 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-slate-900 text-sm">Kraków Bez Barier (AccessKraków)</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  Projekt Konkursowy 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-xl">
                Otwarta platforma wspierająca niezależne poruszanie się po Krakowie. Realizacja zasad Privacy-by-Design i standardu WCAG 2.2 AA.
              </p>
            </div>

            {/* Szybkie linki w stopce */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
              <button type="button" onClick={() => handleNavigateToTab('home')} className="hover:text-blue-700">
                Strona Główna
              </button>
              <button type="button" onClick={() => handleNavigateToTab('places')} className="hover:text-blue-700">
                Miejsca i Obiekty
              </button>
              <button type="button" onClick={() => handleNavigateToTab('routes')} className="hover:text-blue-700">
                Trasy Piesze
              </button>
              <button type="button" onClick={() => handleNavigateToTab('settings')} className="hover:text-blue-700">
                Ustawienia i Opcje
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              &copy; 2026 Kraków Bez Barier. Źródła danych: OpenStreetMap (ODbL), Portal Otwarte Dane Miasta Krakowa, ZDMK, MSIP.
            </div>
            <div className="flex items-center gap-3 font-medium text-slate-500">
              <span className="text-emerald-700 font-bold">Standard WCAG 2.2 AA</span>
              <span>•</span>
              <span>Privacy by Design (RODO)</span>
              <span>•</span>
              <span>Google Cloud Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
