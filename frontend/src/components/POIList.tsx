import React from 'react';
import { EvaluatedPOI, POI } from '../types';
import { DataTransparencyBadge } from './DataTransparencyBadge';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  MapPin, 
  ArrowRight, 
  DoorClosed, 
  Footprints,
  Info
} from 'lucide-react';

interface Props {
  items: EvaluatedPOI[];
  selectedPoiId: string | null;
  onSelectPoi: (poi: POI) => void;
  onOpenReport: (poi: POI) => void;
}

export const POIList: React.FC<Props> = ({
  items,
  selectedPoiId,
  onSelectPoi,
  onOpenReport
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <Info className="w-10 h-10 mx-auto text-slate-400 mb-2" aria-hidden="true" />
        <p className="font-semibold text-slate-700">Nie znaleziono obiektów spełniających kryteria</p>
        <p className="text-xs text-slate-500 mt-1">
          Spróbuj zmniejszyć wymagania filtrów lub wyszukać inną frazę.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string, label: string, score: number) => {
    switch (status) {
      case 'ideal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            {label} ({score}%)
          </span>
        );
      case 'good':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            {label} ({score}%)
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            {label} ({score}%)
          </span>
        );
      case 'insufficient_data':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 animate-pulse">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            {label}
          </span>
        );
      case 'inaccessible':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            {label} ({score}%)
          </span>
        );
    }
  };

  return (
    <div 
      className="space-y-3" 
      role="feed" 
      aria-label="Lista miejsc i ocena ich dostępności według Twojego profilu"
    >
      {items.map(({ poi, evaluation }) => {
        const isSelected = selectedPoiId === poi.id;

        return (
          <article
            key={poi.id}
            tabIndex={0}
            aria-labelledby={`poi-title-${poi.id}`}
            className={`bg-white rounded-xl border p-4 transition-all shadow-xs hover:shadow-md focus:ring-2 focus:ring-blue-600 focus:outline-hidden ${
              isSelected 
                ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Nagłówek karty */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 id={`poi-title-${poi.id}`} className="font-bold text-base text-slate-900">
                    {poi.name}
                  </h3>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {poi.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                  <span>{poi.address}</span>
                  <span className="text-slate-300">•</span>
                  <span>{poi.district}</span>
                </div>
              </div>

              {/* Status dopasowania */}
              <div className="shrink-0">
                {getStatusBadge(evaluation.status, evaluation.status_label_pl, evaluation.match_score)}
              </div>
            </div>

            {/* Kluczowe parametry techniczne */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-600 block text-[11px]">Wejście / Stopnie:</span>
                <span className="font-semibold text-slate-800">
                  {poi.features.steps_at_entrance !== null 
                    ? (poi.features.steps_at_entrance === 0 ? '0 stopni (płasko)' : `${poi.features.steps_at_entrance} st. ${poi.features.has_ramp ? '(rampa)' : '(brak rampy)'}`)
                    : 'Brak danych'}
                </span>
              </div>
              <div>
                <span className="text-slate-600 block text-[11px]">Szerokość drzwi:</span>
                <span className="font-semibold text-slate-800">
                  {poi.features.entrance_width_cm ? `${poi.features.entrance_width_cm} cm` : 'Brak danych'}
                </span>
              </div>
              <div>
                <span className="text-slate-600 block text-[11px]">Nawierzchnia:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {poi.features.surface_type.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-600 block text-[11px]">Toaleta przystosowana:</span>
                <span className="font-semibold text-slate-800">
                  {poi.features.accessible_toilet.available ? 'Tak (uchwyty)' : 'Nie / Brak'}
                </span>
              </div>
            </div>

            {/* Wykaz barier i ostrzeżeń */}
            {evaluation.barriers.length > 0 && (
              <div className="mb-2 text-xs">
                <span className="font-bold text-rose-800 block mb-1">Zidentyfikowane przeszkody:</span>
                <ul className="list-disc list-inside space-y-0.5 text-rose-900 bg-rose-50/70 p-2 rounded-lg border border-rose-200">
                  {evaluation.barriers.map((barrier, idx) => (
                    <li key={idx}>{barrier}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ostrzeżenie o brakach danych (Wymóg regulaminu!) */}
            {evaluation.data_gap_warnings.length > 0 && (
              <div className="mb-2 text-xs bg-amber-50 p-2 rounded-lg border border-amber-200 text-amber-900">
                <span className="font-bold flex items-center gap-1 mb-0.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                  Uwaga: Niepotwierdzone parametry architektoniczne
                </span>
                <p className="text-[11px] text-amber-800">
                  {evaluation.data_gap_warnings.join(' • ')}
                </p>
              </div>
            )}

            {/* Udogodnienia */}
            {evaluation.advantages.length > 0 && (
              <div className="mb-3 text-xs text-slate-600">
                <span className="font-semibold text-emerald-800">Udogodnienia: </span>
                <span>{evaluation.advantages.slice(0, 3).join(', ')}</span>
              </div>
            )}

            {/* Metadane źródła i przyciski akcji */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <DataTransparencyBadge meta={poi.meta} />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenReport(poi)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                >
                  Zgłoś poprawkę
                </button>
                <button
                  type="button"
                  onClick={() => onSelectPoi(poi)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Szczegóły audytu</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
