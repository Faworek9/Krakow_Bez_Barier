import React, { useState, useEffect } from 'react';
import { UserPreferences, RouteResponse, POI } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { RouteMapView } from './RouteMapView';
import { SEED_POIS } from '../data/seedPlaces';
import { 
  Navigation, 
  Clock, 
  Milestone, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  MapPin,
  ArrowUpDown,
  Sparkles,
  Compass,
  Footprints
} from 'lucide-react';
import { API_BASE } from '../config/api';

interface Props {
  preferences: UserPreferences;
  availablePois?: POI[];
}

export const RoutePlanner: React.FC<Props> = ({ preferences, availablePois }) => {
  const { language, t } = useLanguage();
  
  // Tryb: własna trasa z bazy POI lub gotowa trasa wzorcowa
  const [routeMode, setRouteMode] = useState<'custom' | 'demo'>('custom');
  
  // Lista dostępnych punktów w aplikacji
  const [places, setPlaces] = useState<POI[]>(() => {
    if (availablePois && availablePois.length > 0) return availablePois;
    return SEED_POIS;
  });

  // Punkty startowy i docelowy
  const [startPoiId, setStartPoiId] = useState<string>('poi-dworzec-glowny');
  const [destPoiId, setDestPoiId] = useState<string>('poi-wawel-zamek');

  // Trasa wzorcowa
  const [selectedDemoRouteId, setSelectedDemoRouteId] = useState<string>('dworzec-rynek');

  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStepNumber, setActiveStepNumber] = useState<number | null>(null);

  // Aktualizacja listy miejsc jeśli z góry przyszły nowe (np. po dodaniu firmy)
  useEffect(() => {
    if (availablePois && availablePois.length > 0) {
      setPlaces(availablePois);
    } else {
      // Pobranie z API w przypadku braku
      fetch(`${API_BASE}/poi`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setPlaces(data);
          }
        })
        .catch(() => {
          setPlaces(SEED_POIS);
        });
    }
  }, [availablePois]);

  // Ustawienie domyślnych ID jeśli obecne nie istnieją
  useEffect(() => {
    if (places.length > 0) {
      const ids = places.map(p => p.id);
      if (!ids.includes(startPoiId)) {
        setStartPoiId(places[0].id);
      }
      if (!ids.includes(destPoiId)) {
        setDestPoiId(places[1] ? places[1].id : places[0].id);
      }
    }
  }, [places]);

  // Pobieranie trasy własnej
  const fetchCustomRoute = async (sId: string, dId: string) => {
    if (!sId || !dId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/routes/custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_poi_id: sId,
          destination_poi_id: dId,
          preferences
        })
      });
      if (res.ok) {
        const data = await res.json();
        setRouteData(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.detail || (language === 'en' ? 'Failed to calculate custom route.' : 'Nie udało się wyznaczyć trasy.'));
      }
    } catch (err) {
      console.error('Błąd pobierania trasy custom:', err);
      setError(language === 'en' ? 'Connection error with route planner.' : 'Błąd połączenia z serwerem wyznaczania tras.');
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie trasy wzorcowej
  const fetchDemoRoute = async (rId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/routes/evaluate/${rId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      if (res.ok) {
        const data = await res.json();
        setRouteData(data);
      }
    } catch (err) {
      console.error('Błąd pobierania trasy demo:', err);
      setError(language === 'en' ? 'Connection error.' : 'Błąd połączenia.');
    } finally {
      setLoading(false);
    }
  };

  // Automatyczne przeliczenie przy zmianie trybu, preferencji lub punktów
  useEffect(() => {
    setActiveStepNumber(null);
    if (routeMode === 'custom') {
      if (startPoiId && destPoiId) {
        fetchCustomRoute(startPoiId, destPoiId);
      }
    } else {
      fetchDemoRoute(selectedDemoRouteId);
    }
  }, [routeMode, selectedDemoRouteId, preferences]);

  // Odwrócenie kierunku trasy (zamiana start <-> cel)
  const handleSwap = () => {
    const prevStart = startPoiId;
    const prevDest = destPoiId;
    setStartPoiId(prevDest);
    setDestPoiId(prevStart);
    fetchCustomRoute(prevDest, prevStart);
  };

  // Formatowanie ikon dla kategorii POI
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dworzec': return '🚆';
      case 'muzeum': return '🏛️';
      case 'zabytek': return '🏰';
      case 'kawiarnia': return '☕';
      case 'restauracja': return '🍽️';
      case 'park': return '🌳';
      case 'urzad': return '🏢';
      case 'ksiegarnia': return '📚';
      default: return '📍';
    }
  };

  // Posortowane miejsca alfabetycznie
  const sortedPlaces = [...places].sort((a, b) => a.name.localeCompare(b.name, 'pl'));

  return (
    <section aria-labelledby="route-planner-heading" className="space-y-4">
      {/* Panel Nawigacyjny / Wybór Trybu */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 id="route-planner-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-700" aria-hidden="true" />
              {t('routePlannerTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('routePlannerDesc')}
            </p>
          </div>

          {/* Przełącznik zakładek trybu: Własna trasa vs Trasy wzorcowe */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setRouteMode('custom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                routeMode === 'custom'
                  ? 'bg-white text-blue-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-600" aria-hidden="true" />
              {t('routeModeCustom')}
            </button>
            <button
              type="button"
              onClick={() => setRouteMode('demo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                routeMode === 'demo'
                  ? 'bg-white text-blue-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" aria-hidden="true" />
              {t('routeModeDemo')}
            </button>
          </div>
        </div>

        {/* TRYB 1: WYBIERZ DOWOLNE MIEJSCA Z BAZY APLIKACJI */}
        {routeMode === 'custom' && (
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Punkt początkowy (Skąd) */}
              <div className="md:col-span-5">
                <label htmlFor="start-poi-select" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  {t('routeStartPoint')}
                </label>
                <select
                  id="start-poi-select"
                  value={startPoiId}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setStartPoiId(newStart);
                    fetchCustomRoute(newStart, destPoiId);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortedPlaces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getCategoryIcon(p.category)} {p.name} ({p.district || 'Kraków'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Przycisk zamiany miejsc */}
              <div className="md:col-span-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  title={t('routeSwapBtn')}
                  aria-label={t('routeSwapBtn')}
                  className="p-2.5 bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 border border-slate-200 hover:border-blue-300 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="md:hidden">{t('routeSwapBtn')}</span>
                </button>
              </div>

              {/* Punkt docelowy (Dokąd) */}
              <div className="md:col-span-5">
                <label htmlFor="dest-poi-select" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  {t('routeDestPoint')}
                </label>
                <select
                  id="dest-poi-select"
                  value={destPoiId}
                  onChange={(e) => {
                    const newDest = e.target.value;
                    setDestPoiId(newDest);
                    fetchCustomRoute(startPoiId, newDest);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortedPlaces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getCategoryIcon(p.category)} {p.name} ({p.district || 'Kraków'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Szybkie propozycje tras miejskich */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-blue-100/80 text-[11px]">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-blue-600" />
                {language === 'en' ? 'Quick suggestions:' : 'Szybkie propozycje:'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setStartPoiId('poi-dworzec-glowny');
                  setDestPoiId('poi-wawel-zamek');
                  fetchCustomRoute('poi-dworzec-glowny', 'poi-wawel-zamek');
                }}
                className="bg-white hover:bg-blue-100/70 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium transition-all"
              >
                🚆 Dworzec Główny ➔ 🏰 Wawel
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartPoiId('poi-sukiennice');
                  setDestPoiId('poi-cricoteka-podgorze');
                  fetchCustomRoute('poi-sukiennice', 'poi-cricoteka-podgorze');
                }}
                className="bg-white hover:bg-blue-100/70 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium transition-all"
              >
                🏛️ Rynek Główny ➔ 🎨 Cricoteka (Podgórze)
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartPoiId('poi-kazimierz-cafe-literacka');
                  setDestPoiId('poi-kladka-bernatka');
                  fetchCustomRoute('poi-kazimierz-cafe-literacka', 'poi-kladka-bernatka');
                }}
                className="bg-white hover:bg-blue-100/70 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium transition-all"
              >
                ☕ Kazimierz ➔ 🌉 Kładka Bernatka
              </button>
            </div>
          </div>
        )}

        {/* TRYB 2: TRASY WZORCOWE */}
        {routeMode === 'demo' && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedDemoRouteId('dworzec-rynek')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                selectedDemoRouteId === 'dworzec-rynek'
                  ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/20'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              🚆 {t('route1Title')} (850 m)
            </button>
            <button
              type="button"
              onClick={() => setSelectedDemoRouteId('rynek-wawel')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                selectedDemoRouteId === 'rynek-wawel'
                  ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/20'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              🏰 {t('route2Title')} (950 m)
            </button>
          </div>
        )}
      </div>

      {/* Komunikat o błędzie */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Spinner ładowania */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-xs font-medium">
            {language === 'en' 
              ? 'Analyzing architectural road profile & surfaces...' 
              : 'Analizowanie parametrów architektonicznych i nawierzchni trasy...'}
          </p>
        </div>
      )}

      {/* Wyniki wyznaczonej trasy */}
      {routeData && !loading && (
        <div className="space-y-4">
          {/* Podsumowanie trasy */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{routeData.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Milestone className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                    {routeData.total_distance_meters} metrów
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    ok. {routeData.estimated_time_minutes} min pieszo/wózkiem
                  </span>
                  <span>•</span>
                  <span className="text-slate-600 font-medium">
                    Maks. próg: <strong>{routeData.max_curb_cm} cm</strong>
                  </span>
                </div>
              </div>

              {/* Status rekomendacji */}
              <div className="shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  routeData.accessibility_status === 'recommended'
                    ? 'bg-emerald-100 text-emerald-800'
                    : routeData.accessibility_status === 'passable_with_effort'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {routeData.accessibility_status === 'recommended' && <CheckCircle2 className="w-4 h-4" />}
                  {routeData.accessibility_status !== 'recommended' && <AlertTriangle className="w-4 h-4" />}
                  {routeData.status_label_pl} ({routeData.accessibility_score}%)
                </span>
              </div>
            </div>

            {/* Rozkład nawierzchni */}
            <div className="my-4">
              <span className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                {t('routeSurfaceBreakdown')}
              </span>
              <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
                {Object.entries(routeData.surface_summary).map(([surface, pct]) => {
                  let color = 'bg-blue-500';
                  if (surface === 'kocie_lby') color = 'bg-rose-500';
                  if (surface === 'kostka_brukowa') color = 'bg-amber-500';
                  if (surface === 'asfalt' || surface === 'plytki_wewnetrzne') color = 'bg-emerald-500';
                  return (
                    <div
                      key={surface}
                      style={{ width: `${pct}%` }}
                      className={`${color} transition-all`}
                      title={`${surface.replace('_', ' ')}: ${pct}%`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] text-slate-600 mt-2">
                {Object.entries(routeData.surface_summary).map(([surface, pct]) => (
                  <span key={surface} className="inline-flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${
                      surface === 'kocie_lby' ? 'bg-rose-500' :
                      surface === 'kostka_brukowa' ? 'bg-amber-500' :
                      surface === 'asfalt' || surface === 'plytki_wewnetrzne' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}></span>
                    <span className="capitalize">{surface.replace('_', ' ')}:</span>
                    <strong>{pct}%</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Wykryte bariery i atuty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100">
              {routeData.barriers_detected.length > 0 && (
                <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-800 block mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Wykryte utrudnienia na trasie:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-rose-900">
                    {routeData.barriers_detected.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {routeData.advantages_detected.length > 0 && (
                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-800 block mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Udogodnienia potwierdzone:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-emerald-900">
                    {routeData.advantages_detected.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Wizualizacja na mapie (Polylines) oraz Krok po kroku nawigacja dostępna (WCAG) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Kolumna Mapy z kolorowymi odcinkami nawierzchni */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  {t('routeInteractiveMap')}
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === 'en' ? 'Click step to highlight on map' : 'Kliknij odcinek lub numer, aby podświetlić'}
                </span>
              </div>
              <RouteMapView
                routeData={routeData}
                activeStepNumber={activeStepNumber}
                onSelectStep={(step) => setActiveStepNumber(step === activeStepNumber ? null : step)}
              />
            </div>

            {/* Kolumna Krok po kroku (Nawigacja tekstowa WCAG) z gradientami zanikania i ciągłą linią */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col relative overflow-hidden">
              {/* Statyczny nagłówek - nie zasłaniany przy przewijaniu */}
              <div className="p-4 sm:p-5 pb-3 bg-white border-b border-slate-100 z-20 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  {t('routeStepsWcag')}
                </h4>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {routeData.segments.length} {language === 'en' ? 'steps' : 'etapów'}
                </span>
              </div>

              {/* Kontener z przewijaniem i gradientami zanikania */}
              <div className="relative flex-1 max-h-[440px] overflow-hidden flex flex-col">
                {/* Górny gradient zanikania przy przewijaniu */}
                <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-10" />

                <div className="overflow-y-auto px-4 sm:px-5 py-3 space-y-3 h-full">
                  <div className="relative">
                    {/* Ciągła linia łącząca wszystkie etapy trasy aż do dołu */}
                    <div 
                      className="absolute left-2.5 top-2.5 bottom-6 w-0.5 bg-blue-200" 
                      aria-hidden="true" 
                    />

                    <ol className="space-y-3.5 text-xs">
                      {routeData.segments.map((seg) => {
                        const isSelected = activeStepNumber === seg.step_number;
                        return (
                          <li 
                            key={seg.step_number} 
                            className="relative pl-7 cursor-pointer group"
                            onClick={() => setActiveStepNumber(isSelected ? null : seg.step_number)}
                          >
                            {/* Punkt / Numer na linii */}
                            <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all z-10 ${
                              isSelected 
                                ? 'bg-blue-800 text-white ring-4 ring-blue-300 scale-105 shadow-sm' 
                                : 'bg-blue-600 text-white group-hover:bg-blue-700 shadow-2xs'
                            }`}>
                              {seg.step_number}
                            </div>

                            {/* Treść etapu */}
                            <div className={`p-3 rounded-xl border transition-all ${
                              isSelected 
                                ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs' 
                                : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/90'
                            }`}>
                              <p className="font-semibold text-slate-900 mb-1 leading-snug">{seg.instruction}</p>
                              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                  Długość: <strong>{seg.distance_meters} m</strong>
                                </span>
                                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 capitalize">
                                  Nawierzchnia: <strong>{seg.surface_type.replace('_', ' ')}</strong>
                                </span>
                                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                  Próg / Krawężnik: <strong>{seg.curb_height_cm} cm</strong>
                                </span>
                                {seg.has_incline && (
                                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                                    Nachylenie: {seg.incline_percent}%
                                  </span>
                                )}
                              </div>
                              {seg.warning && (
                                <div className="mt-2 text-rose-800 text-[11px] font-medium bg-rose-50 p-2 rounded-lg border border-rose-200 flex items-start gap-1.5">
                                  <span>⚠️</span>
                                  <span>{seg.warning}</span>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>

                {/* Dolny gradient zanikania przy przewijaniu */}
                <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
