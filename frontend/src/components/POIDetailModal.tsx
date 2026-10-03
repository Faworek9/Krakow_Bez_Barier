import React, { useEffect, useRef } from 'react';
import { POI } from '../types';
import { DataTransparencyBadge } from './DataTransparencyBadge';
import { 
  X, 
  MapPin, 
  DoorClosed, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  AlertTriangle,
  Building,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface Props {
  poi: POI | null;
  onClose: () => void;
  onOpenReport: (poi: POI) => void;
}

export const POIDetailModal: React.FC<Props> = ({ poi, onClose, onOpenReport }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (poi) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [poi, onClose]);

  if (!poi) return null;

  const f = poi.features;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 focus:outline-hidden"
      >
        {/* Pasek nagłówkowy */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij okno szczegółów"
            className="absolute top-5 right-5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            {poi.category}
          </div>
          <h2 id="modal-title" className="text-xl font-black text-white">
            {poi.name}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
            <span>{poi.address} ({poi.district})</span>
          </div>
        </div>

        {/* Ciało modala */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Opis */}
          {poi.description && (
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {poi.description}
            </p>
          )}

          {/* Wiarygodność i źródło danych (Kluczowy wymóg konkursu) */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
              Metadane wiarygodności i pochodzenia
            </h3>
            <DataTransparencyBadge meta={poi.meta} showDetails={true} />
          </div>

          {/* Szczegółowe parametry wejścia */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <DoorClosed className="w-4 h-4 text-blue-700" aria-hidden="true" />
              Wejście i strefa wejściowa
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Szerokość drzwi:</span>
                <span className="font-bold text-slate-800 text-sm">
                  {f.entrance_width_cm ? `${f.entrance_width_cm} cm` : 'Brak danych'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Liczba stopni:</span>
                <span className="font-bold text-slate-800 text-sm">
                  {f.steps_at_entrance !== null ? `${f.steps_at_entrance}` : 'Nieokreślona'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Rampa / Podjazd:</span>
                <span className="font-bold text-slate-800 text-sm">
                  {f.has_ramp ? `Tak (${f.ramp_slope_percent || 'standard'}%)` : 'Brak rampy'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Wysokość progu:</span>
                <span className="font-bold text-slate-800 text-sm">
                  {f.max_curb_cm !== null ? `${f.max_curb_cm} cm` : 'Brak danych'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Typ drzwi:</span>
                <span className="font-bold text-slate-800 text-sm capitalize">
                  {f.door_type?.replace('_', ' ') || 'Zwykłe'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Nawierzchnia dookoła:</span>
                <span className="font-bold text-slate-800 text-sm capitalize">
                  {f.surface_type.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Winda i Toaleta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Winda */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                <span>Dostępność windy:</span>
                {f.elevator.available ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Dostępna
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Brak
                  </span>
                )}
              </h4>
              {f.elevator.available && (
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>• Wymiary kabiny: <strong>{f.elevator.cabin_dimensions || 'Standardowa'}</strong></li>
                  <li>• Szerokość drzwi windy: <strong>{f.elevator.door_width_cm || '90'} cm</strong></li>
                  <li>• Przyciski Braille'a: <strong>{f.elevator.has_braille ? 'Tak' : 'Brak'}</strong></li>
                  <li>• Komunikaty głosowe: <strong>{f.elevator.has_audio_signals ? 'Tak' : 'Brak'}</strong></li>
                </ul>
              )}
            </div>

            {/* Toaleta */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                <span>Toaleta przystosowana:</span>
                {f.accessible_toilet.available ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tak
                  </span>
                ) : (
                  <span className="text-rose-700 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Brak
                  </span>
                )}
              </h4>
              {f.accessible_toilet.available && (
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>• Poręcze i uchwyty: <strong>{f.accessible_toilet.has_grab_rails ? 'Tak' : 'Nie'}</strong></li>
                  <li>• Wjazd bezprogowy: <strong>{f.accessible_toilet.entry_flat ? 'Tak' : 'Nie'}</strong></li>
                  <li>• Przestrzeń manewrowa (&gt;150cm): <strong>{f.accessible_toilet.wheelchair_turning_space ? 'Tak' : 'Nie'}</strong></li>
                  <li>• Sznurek alarmowy SOS: <strong>{f.accessible_toilet.has_emergency_cord ? 'Tak' : 'Nie'}</strong></li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Stopka akcji */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReport(poi);
            }}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline"
          >
            Widzisz błąd? Zgłoś korektę danych
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
