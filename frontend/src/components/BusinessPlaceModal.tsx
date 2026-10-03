import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BusinessPlaceInput, POI } from '../types';
import { X, Building2, CheckCircle2, AlertTriangle, ShieldCheck, MapPin, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPlaceAdded: (newPoi: POI) => void;
  onSuccessNotification: (msg: string) => void;
}

export const BusinessPlaceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onPlaceAdded,
  onSuccessNotification
}) => {
  const { user, token } = useAuth();

  const [name, setName] = useState(user?.business_info?.company_name || '');
  const [category, setCategory] = useState('kawiarnia');
  const [address, setAddress] = useState(user?.business_info?.address || 'ul. Floriańska 12, Kraków');
  const [district, setDistrict] = useState('Stare Miasto');
  const [description, setDescription] = useState('');

  // Parametry dostępności
  const [stepsAtEntrance, setStepsAtEntrance] = useState<number>(0);
  const [hasRamp, setHasRamp] = useState<boolean>(false);
  const [doorWidthCm, setDoorWidthCm] = useState<number>(90);
  const [surfaceType, setSurfaceType] = useState<string>('plyty_chodnikowe');
  const [hasAccessibleToilet, setHasAccessibleToilet] = useState<boolean>(true);
  const [hasElevator, setHasElevator] = useState<boolean>(false);
  const [tactilePaving, setTactilePaving] = useState<boolean>(false);
  const [hearingLoop, setHearingLoop] = useState<boolean>(false);
  const [guideDogAllowed, setGuideDogAllowed] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('Musisz być zalogowany jako firma, aby dodać lokal.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload: BusinessPlaceInput = {
      name,
      category,
      address,
      district,
      description,
      entrance_width_cm: doorWidthCm,
      steps_at_entrance: stepsAtEntrance,
      has_ramp: hasRamp,
      max_curb_cm: stepsAtEntrance === 0 ? 1.0 : stepsAtEntrance * 15,
      surface_type: surfaceType,
      has_elevator: hasElevator,
      has_accessible_toilet: hasAccessibleToilet,
      tactile_paving: tactilePaving,
      hearing_loop: hearingLoop,
      guide_dog_allowed: guideDogAllowed
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/poi/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Błąd dodawania lokalu');
      }

      const createdPoi: POI = await res.json();
      onPlaceAdded(createdPoi);
      onSuccessNotification(`Twój lokal "${createdPoi.name}" został pomyślnie dodany do bazy z odznaką Oficjalnego Audytu!`);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Wystąpił błąd zapisu do chmury.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="business-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border-0 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Belka Górna */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij okno dodawania lokalu"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-amber-200" />
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Dla Właścicieli i Zarządców Lokali
            </span>
          </div>
          <h3 id="business-modal-title" className="text-lg font-black tracking-tight">
            Deklaracja Dostępności i Zgłoszenie Lokalu
          </h3>
          <p className="text-xs text-amber-100 mt-1">
            Dodaj swój krakowski lokal do oficjalnej bazy dostępności. Obiekty dodane przez zweryfikowaną firmę otrzymują odznakę wiarygodności <strong>VERIFIED_OFFICIAL (95 pkt)</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Podstawowe dane lokalu */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              Podstawowe dane lokalu
            </h4>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nazwa lokalu / placówki</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="np. Kawiarnia Relaks & Kawa"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  <option value="kawiarnia">Kawiarnia</option>
                  <option value="restauracja">Restauracja</option>
                  <option value="muzeum">Muzeum / Galeria</option>
                  <option value="zabytek">Zabytek / Atrakcja</option>
                  <option value="urzad">Urząd / Instytucja</option>
                  <option value="toaleta">Toaleta publiczna</option>
                  <option value="sklep">Sklep / Usługi</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dzielnica Krakowa</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  <option value="Stare Miasto">Stare Miasto / Rynek</option>
                  <option value="Kazimierz">Kazimierz</option>
                  <option value="Podgórze">Podgórze</option>
                  <option value="Krowodrza">Krowodrza</option>
                  <option value="Grzegórzki">Grzegórzki</option>
                  <option value="Nowa Huta">Nowa Huta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dokładny adres w Krakowie</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="np. ul. Floriańska 12, Kraków"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Opis lokalu i atmosfera (opcjonalnie)</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="np. Przestronna kawiarnia z szerokimi alejkami między stolikami, cichy kącik bez głośnej muzyki."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Parametry architektoniczne (Bariery i Dostępność) */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Precyzyjne parametry dostępności architektonicznej
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">
                  Liczba stopni przed wejściem: <strong>{stepsAtEntrance}</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={stepsAtEntrance}
                  onChange={(e) => setStepsAtEntrance(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  {stepsAtEntrance === 0 ? '🟢 Wejście płaskie z poziomu chodnika' : `🔴 Wymaga pokonania ${stepsAtEntrance} stopni`}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">
                  Szerokość drzwi wejściowych: <strong>{doorWidthCm} cm</strong>
                </label>
                <input
                  type="range"
                  min="60"
                  max="150"
                  step="5"
                  value={doorWidthCm}
                  onChange={(e) => setDoorWidthCm(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  {doorWidthCm >= 90 ? '🟢 Zgodne z normą wózków (≥90 cm)' : '🟡 Wąskie skrzydło drzwi'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nawierzchnia przed wejściem</label>
                <select
                  value={surfaceType}
                  onChange={(e) => setSurfaceType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  <option value="plyty_chodnikowe">Gładkie płyty chodnikowe</option>
                  <option value="asfalt">Gładki asfalt</option>
                  <option value="kostka_brukowa">Kostka brukowa</option>
                  <option value="kocie_lby">Zabytkowe kocie łby</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={hasRamp}
                    onChange={(e) => setHasRamp(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300"
                  />
                  <span>Rampa / podjazd przy schodach</span>
                </label>
              </div>
            </div>

            {/* Checkboxy udogodnień */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={hasAccessibleToilet}
                  onChange={(e) => setHasAccessibleToilet(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="font-semibold text-slate-800">Toaleta przystosowana dla wózków</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={hasElevator}
                  onChange={(e) => setHasElevator(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="font-semibold text-slate-800">Winda w budynku</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={hearingLoop}
                  onChange={(e) => setHearingLoop(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="font-semibold text-slate-800">Pętla indukcyjna dla niesłyszących</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={guideDogAllowed}
                  onChange={(e) => setGuideDogAllowed(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="font-semibold text-slate-800">Wstęp z psem asystującym / przewodnikiem</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {loading ? 'Zapisywanie w chmurze...' : 'Zapisz i Opublikuj Lokal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
