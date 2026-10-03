import React, { useState, useEffect, useRef } from 'react';
import { POI } from '../types';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../config/api';

interface Props {
  poi: POI | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotification: (msg: string) => void;
}

export const ReportCorrectionModal: React.FC<Props> = ({
  poi,
  isOpen,
  onClose,
  onSuccessNotification
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [stepsCount, setStepsCount] = useState<string>('');
  const [hasRamp, setHasRamp] = useState<boolean>(false);
  const [doorWidth, setDoorWidth] = useState<string>('');
  const [curbHeight, setCurbHeight] = useState<string>('');
  const [toiletAccessible, setToiletAccessible] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (poi) {
      setStepsCount(poi.features.steps_at_entrance !== null ? String(poi.features.steps_at_entrance) : '');
      setHasRamp(poi.features.has_ramp || false);
      setDoorWidth(poi.features.entrance_width_cm !== null ? String(poi.features.entrance_width_cm) : '');
      setCurbHeight(poi.features.max_curb_cm !== null ? String(poi.features.max_curb_cm) : '');
      setToiletAccessible(poi.features.accessible_toilet.available || false);
    }
  }, [poi]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        poi_id: poi?.id || 'poi-nowe-zgloszenie',
        reported_steps_count: stepsCount ? parseInt(stepsCount) : null,
        reported_has_ramp: hasRamp,
        reported_door_width_cm: doorWidth ? parseInt(doorWidth) : null,
        reported_curb_height_cm: curbHeight ? parseFloat(curbHeight) : null,
        reported_toilet_accessible: toiletAccessible,
        comment: comment,
        verified_on_site: true
      };

      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onSuccessNotification('Dziękujemy! Zgłoszenie zostało przesłane do weryfikacji społecznościowej.');
        onClose();
      }
    } catch (err) {
      console.error('Błąd wysyłania zgłoszenia:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8"
      >
        <div className="bg-blue-700 text-white p-5 flex items-center justify-between">
          <div>
            <h2 id="report-modal-title" className="text-base font-bold">
              Zgłoś barierę lub popraw dane
            </h2>
            <p className="text-xs text-blue-100">
              {poi ? `Dla obiektu: ${poi.name}` : 'Nowe zgłoszenie w Krakowie'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="text-white hover:bg-blue-800 p-1.5 rounded-full"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Rzeczywista liczba stopni przy wejściu:
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={stepsCount}
              onChange={(e) => setStepsCount(e.target.value)}
              placeholder="np. 0 (płasko) lub 3"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="has-ramp"
              checked={hasRamp}
              onChange={(e) => setHasRamp(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300"
            />
            <label htmlFor="has-ramp" className="font-semibold text-slate-700">
              Przy wejściu jest rampa / podjazd dla wózków
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Szerokość drzwi (cm):
              </label>
              <input
                type="number"
                min="50"
                max="250"
                value={doorWidth}
                onChange={(e) => setDoorWidth(e.target.value)}
                placeholder="np. 90"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Wysokość progu (cm):
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={curbHeight}
                onChange={(e) => setCurbHeight(e.target.value)}
                placeholder="np. 2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="toilet-accessible"
              checked={toiletAccessible}
              onChange={(e) => setToiletAccessible(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300"
            />
            <label htmlFor="toilet-accessible" className="font-semibold text-slate-700">
              Toaleta jest przystosowana (uchwyty, wjazd płaski)
            </label>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Komentarz / Opis sytuacji:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="np. Remont wejścia zakończony, zainstalowano nową windę platformową."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
