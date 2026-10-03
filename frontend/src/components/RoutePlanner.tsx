import React, { useState, useEffect } from 'react';
import { UserPreferences, RouteResponse } from '../types';
import { 
  Navigation, 
  Clock, 
  Milestone, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  TrendingUp,
  MapPin
} from 'lucide-react';

interface Props {
  preferences: UserPreferences;
}

export const RoutePlanner: React.FC<Props> = ({ preferences }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('dworzec-rynek');
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/routes/evaluate/${selectedRouteId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferences)
        });
        if (res.ok) {
          const data = await res.json();
          setRouteData(data);
        }
      } catch (err) {
        console.error('Błąd pobierania trasy:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [selectedRouteId, preferences]);

  return (
    <section aria-labelledby="route-planner-heading" className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 id="route-planner-heading" className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-blue-700" aria-hidden="true" />
          Planer Dostępnych Tras Pieszych w Krakowie
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Wybierz trasę, aby sprawdzić analizę nawierzchni, krawężników, schodów oraz profilu nachylenia terenu.
        </p>

        {/* Selektor Tras Demonstracyjnych */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedRouteId('dworzec-rynek')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              selectedRouteId === 'dworzec-rynek'
                ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/20'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            🚆 Dworzec Główny PKP → Rynek Główny (850 m)
          </button>
          <button
            type="button"
            onClick={() => setSelectedRouteId('rynek-wawel')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              selectedRouteId === 'rynek-wawel'
                ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/20'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            🏰 Rynek Główny → Zamek Królewski Wawel (950 m)
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-xs font-medium">Analizowanie parametrów architektonicznych trasy...</p>
        </div>
      )}

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
                Struktura nawierzchni na trasie:
              </span>
              <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
                {Object.entries(routeData.surface_summary).map(([surface, pct]) => {
                  let color = 'bg-blue-500';
                  if (surface === 'kocie_lby') color = 'bg-rose-500';
                  if (surface === 'kostka_brukowa') color = 'bg-amber-500';
                  if (surface === 'asfalt') color = 'bg-emerald-500';
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
                      surface === 'asfalt' ? 'bg-emerald-500' : 'bg-blue-500'
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

          {/* Krok po kroku nawigacja dostępna */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" aria-hidden="true" />
              Etapy trasy krok po kroku (Nawigacja tekstowa WCAG):
            </h4>
            <ol className="relative border-l-2 border-blue-200 ml-3 space-y-4 text-xs">
              {routeData.segments.map((seg) => (
                <li key={seg.step_number} className="ml-4">
                  <div className="absolute -left-2 mt-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {seg.step_number}
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="font-semibold text-slate-900 mb-1">{seg.instruction}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        Długość: <strong>{seg.distance_meters} m</strong>
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200 capitalize">
                        Nawierzchnia: <strong>{seg.surface_type.replace('_', ' ')}</strong>
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        Próg / Krawężnik: <strong>{seg.curb_height_cm} cm</strong>
                      </span>
                      {seg.has_incline && (
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                          Nachylenie: {seg.incline_percent}%
                        </span>
                      )}
                    </div>
                    {seg.warning && (
                      <div className="mt-2 text-amber-800 text-[11px] font-medium bg-amber-50 p-1.5 rounded border border-amber-200">
                        ℹ️ {seg.warning}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
};
