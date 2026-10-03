import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserReportItem } from '../types';
import { X, MessageSquare, CheckCircle2, Clock, AlertCircle, MapPin, PlusCircle } from 'lucide-react';
import { API_BASE } from '../config/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewReport?: () => void;
}

export const UserReportsModal: React.FC<Props> = ({ isOpen, onClose, onOpenNewReport }) => {
  const { user, token } = useAuth();
  const [reports, setReports] = useState<UserReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !token) return;

    const fetchMyReports = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/feedback/my-reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (err) {
        console.error('Błąd pobierania raportów:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reports-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij okno moich zgłoszeń"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-blue-200" />
            <h3 id="reports-modal-title" className="text-lg font-black tracking-tight">
              Twoje Zgłoszenia i Korekty Barier
            </h3>
          </div>
          <p className="text-xs text-blue-100 mb-4">
            Dziękujemy za współtworzenie dostępnego Krakowa! Poniżej znajdziesz historię przesłanych przez Ciebie uwag.
          </p>

          {/* Przeniesiony przycisk zgłaszania bariery w oknie "Moje zgłoszenia" */}
          {onOpenNewReport && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNewReport();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-blue-800 hover:bg-blue-50 transition-all shadow-md hover:scale-[1.02] active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-blue-700" />
              <span>Zgłoś barierę / Dodaj korektę</span>
            </button>
          )}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto text-xs">
          {loading ? (
            <div className="py-8 text-center text-slate-500">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Wczytywanie Twoich uwag z chmury...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-8 text-center text-slate-500 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">Nie masz jeszcze żadnych zapisanych zgłoszeń.</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Gdy zauważysz zepsutą windę, stromy krawężnik lub schody bez rampy, kliknij przycisk poniżej!
              </p>
              {onOpenNewReport && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenNewReport();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Zgłoś nową barierę</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-slate-900 block text-sm flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {r.poi_name || r.poi_id}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        ID: {r.id} • {r.created_at ? new Date(r.created_at).toLocaleDateString('pl-PL') : 'Dzisiaj'}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 shrink-0">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Weryfikacja społeczna
                    </span>
                  </div>

                  {r.comment && (
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-slate-700 italic">
                      "{r.comment}"
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1">
                      {r.verified_on_site && (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Potwierdzone na miejscu
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-blue-700">+10 pkt reputacji</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
