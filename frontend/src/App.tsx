import React, { useState, useEffect } from 'react';
import { UserPreferences, EvaluatedPOI, POI } from './types';
import { Navbar } from './components/Navbar';
import { AccessibilityFilters } from './components/AccessibilityFilters';
import { POIList } from './components/POIList';
import { MapView } from './components/MapView';
import { RoutePlanner } from './components/RoutePlanner';
import { POIDetailModal } from './components/POIDetailModal';
import { ReportCorrectionModal } from './components/ReportCorrectionModal';
import { Search, Map, List, CheckCircle, ShieldAlert } from 'lucide-react';

export const App: React.FC = () => {
  // Stan preferencji mobilności (domyślnie profil osoby na wózku)
  const [preferences, setPreferences] = useState<UserPreferences>({
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

  const [activeTab, setActiveTab] = useState<'places' | 'routes'>('places');
  const [viewMode, setViewMode] = useState<'both' | 'list' | 'map'>('both');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const [evaluatedPois, setEvaluatedPois] = useState<EvaluatedPOI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [detailModalPoi, setDetailModalPoi] = useState<POI | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportTargetPoi, setReportTargetPoi] = useState<POI | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pobieranie i ocena obiektów z backendu FastAPI
  useEffect(() => {
    const fetchAndEvaluate = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/poi/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferences)
        });
        if (res.ok) {
          const data: EvaluatedPOI[] = await res.json();
          setEvaluatedPois(data);
        }
      } catch (err) {
        console.error('Błąd pobierania obiektów:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndEvaluate();
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
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className={`min-h-screen flex flex-col ${highContrast ? 'high-contrast' : ''}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce"
        >
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Górny Pasek Nawigacyjny */}
      <Navbar
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={() => {
          setReportTargetPoi(null);
          setReportModalOpen(true);
        }}
      />

      {/* Główna Przestrzeń Robocza */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtry Preferencji Dostępności */}
        <AccessibilityFilters
          preferences={preferences}
          onChange={(newPrefs) => setPreferences(newPrefs)}
        />

        {activeTab === 'places' ? (
          <div>
            {/* Pasek Wyszukiwania i Wyboru Widoku */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 mb-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Szukaj obiektu w Krakowie (np. Wawel, Dworzec, Sukiennice, Floriańska)..."
                  aria-label="Wyszukaj obiekt lub adres w Krakowie"
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Filtry Kategorii i Dzielnicy */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filtruj według kategorii"
                  className="px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
                >
                  <option value="">Wszystkie kategorie</option>
                  <option value="muzeum">Muzea</option>
                  <option value="zabytek">Zabytki</option>
                  <option value="urzad">Urzędy</option>
                  <option value="dworzec">Dworce</option>
                  <option value="kawiarnia">Kawiarnie</option>
                  <option value="restauracja">Restauracje</option>
                  <option value="park">Parki</option>
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  aria-label="Filtruj według dzielnicy"
                  className="px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
                >
                  <option value="">Cały Kraków</option>
                  <option value="Stare Miasto">Stare Miasto</option>
                  <option value="Kazimierz">Kazimierz</option>
                  <option value="Podgórze">Podgórze</option>
                </select>

                {/* Przełącznik Widoku (WCAG: Alternatywa tekstowa mapy) */}
                <div className="flex items-center bg-slate-100 p-1 rounded-lg shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('both')}
                    aria-label="Pokaż mapę i listę obok siebie"
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      viewMode === 'both' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    Oba
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    aria-label="Pokaż tylko dostępną listę tekstową"
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      viewMode === 'list' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    Lista
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    aria-label="Pokaż tylko mapę"
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      viewMode === 'map' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    Mapa
                  </button>
                </div>
              </div>
            </div>

            {/* Informacja o liczbie wyników dla czytników ekranu */}
            <div className="sr-only" role="status" aria-live="polite">
              Znaleziono {filteredItems.length} obiektów spełniających wybrane kryteria mobilności.
            </div>

            {/* Siatka: Lista + Mapa */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kolumna Listy */}
              {(viewMode === 'both' || viewMode === 'list') && (
                <div className={`${viewMode === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
                  {loading ? (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-xs">Ładowanie i przeliczanie barier architektonicznych...</p>
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
        ) : (
          /* Zakładka Nawigacji i Tras */
          <RoutePlanner preferences={preferences} />
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

      {/* Stopka z informacją o licencjach i projekcie */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-700">Kraków Bez Barier (AccessKraków)</span> &copy; 2026.
            <span className="ml-2">Otwarte dane: OpenStreetMap ODbL, Otwarte Dane Miasta Krakowa, ZDMK, UMK.</span>
          </div>
          <div className="flex items-center gap-4 text-blue-700">
            <span className="text-slate-400">Standard WCAG 2.2 AA</span>
            <span className="text-slate-400">•</span>
            <span>Google Cloud Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
