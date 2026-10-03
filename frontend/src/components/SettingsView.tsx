import React, { useState } from 'react';
import { AppSettings, UserPreferences, NavigationTab } from '../types';
import { 
  Eye, 
  Sliders, 
  Volume2, 
  ShieldCheck, 
  Layers, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  FileText, 
  Trash2,
  Accessibility,
  Luggage,
  Baby,
  UserCheck,
  ArrowLeft
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: UserPreferences) => void;
  onResetDefaults: () => void;
  onClearStorage: () => void;
  onShowToast: (msg: string) => void;
  onNavigateToTab: (tab: NavigationTab) => void;
}

export const SettingsView: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  preferences,
  onUpdatePreferences,
  onResetDefaults,
  onClearStorage,
  onShowToast,
  onNavigateToTab
}) => {
  const [activeCategory, setActiveCategory] = useState<'wcag' | 'mobility' | 'map' | 'privacy'>('wcag');

  const testSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Kraków Bez Barier. Test syntezatora mowy. Wybrany profil: ' +
        (preferences.preset_name === 'wheelchair' ? 'Osoba na wózku' :
         preferences.preset_name === 'luggage' ? 'Turysta z walizką' :
         preferences.preset_name === 'stroller' ? 'Wózek dziecięcy' : 'Senior') +
        '. Dopuszczalny próg: ' + preferences.max_curb_cm + ' centymetra. Minimalna szerokość drzwi: ' +
        preferences.min_door_width_cm + ' centymetrów.'
      );
      utterance.lang = 'pl-PL';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      onShowToast('Odtwarzanie testowej podpowiedzi głosowej w języku polskim.');
    } else {
      onShowToast('Twoja przeglądarka nie obsługuje wbudowanego syntezatora mowy.');
    }
  };

  const handleSaveAll = () => {
    onShowToast('Wszystkie preferencje i opcje zostały zapisane w pamięci przeglądarki (localStorage).');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Nagłówek panelu */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigateToTab('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Powrót do strony głównej</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-blue-700" />
            Ustawienia i Opcje Dostępności
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Skonfiguruj ułatwienia cyfrowe (WCAG 2.2 AA), fizyczne wymiary barier architektonicznych oraz sposób wyświetlania mapy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Zapisz ustawienia</span>
          </button>
        </div>
      </div>

      {/* Zakładki kategorii opcji */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Kategorie ustawień">
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'wcag'}
          onClick={() => setActiveCategory('wcag')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeCategory === 'wcag'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Dostępność Cyfrowa (WCAG 2.2)</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'mobility'}
          onClick={() => setActiveCategory('mobility')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeCategory === 'mobility'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Accessibility className="w-4 h-4" />
          <span>Parametry Mobilności i Wymiary</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'map'}
          onClick={() => setActiveCategory('map')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeCategory === 'map'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Widok Mapy i Preferencje</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'privacy'}
          onClick={() => setActiveCategory('privacy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeCategory === 'privacy'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Prywatność i Pamięć (RODO)</span>
        </button>
      </div>

      {/* ZAWARTOŚĆ: 1. DOSTĘPNOŚĆ CYFROWA (WCAG 2.2) */}
      {activeCategory === 'wcag' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Dostępność Cyfrowa & Wygląd Interfejsu (WCAG 2.2 AA)
            </h2>
            <p className="text-xs text-slate-500">
              Dostosuj kontrast, rozmiar tekstu oraz asystenta dźwiękowego do swoich indywidualnych potrzeb percepcyjnych.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tryb wysokiego kontrastu */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-xs text-slate-900 block mb-0.5">Tryb wysokiego kontrastu</span>
                <p className="text-[11px] text-slate-500">
                  Zwiększa kontrast krawędzi i elementów do współczynnika &gt;7:1 (żółto-czarne akcenty).
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => onUpdateSettings({ ...settings, highContrast: !settings.highContrast })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  settings.highContrast ? 'bg-blue-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Rozmiar tekstu */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div>
                <span className="font-bold text-xs text-slate-900 block mb-0.5">Wielkość czcionki (Skalowanie)</span>
                <p className="text-[11px] text-slate-500">
                  Ułatwia czytanie bez utraty struktury i czytelności strony.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, textSize: 'normal' })}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                    settings.textSize === 'normal'
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Standardowa (100%)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, textSize: 'large' })}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                    settings.textSize === 'large'
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Powiększona (115%)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, textSize: 'xlarge' })}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                    settings.textSize === 'xlarge'
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Duża (130%)
                </button>
              </div>
            </div>

            {/* Krój ułatwiający czytanie (Dysleksja) */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-xs text-slate-900 block mb-0.5">Krój pisma przyjazny dysleksji</span>
                <p className="text-[11px] text-slate-500">
                  Zwiększa odstępy między literami i słowami oraz stosuje czytelniejszy kształt glifów.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.dyslexicFont}
                onClick={() => onUpdateSettings({ ...settings, dyslexicFont: !settings.dyslexicFont })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  settings.dyslexicFont ? 'bg-blue-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    settings.dyslexicFont ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Redukcja animacji */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-xs text-slate-900 block mb-0.5">Ograniczenie animacji (Reduced Motion)</span>
                <p className="text-[11px] text-slate-500">
                  Wyłącza płynne przejścia i animacje na korzyść natychmiastowych zmian (dla osób wrażliwych).
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.reducedMotion}
                onClick={() => onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  settings.reducedMotion ? 'bg-blue-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Asystent głosowy / lektor */}
          <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-blue-950">Wbudowany lektor mowy (Web Speech API)</h3>
                <p className="text-[11px] text-blue-800">
                  Czytanie na głos kluczowych parametrów architektonicznych i ostrzeżeń o barierach w języku polskim.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={testSpeech}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <Volume2 className="w-4 h-4" />
              <span>Przetestuj lektora</span>
            </button>
          </div>

          {/* Podgląd czcionki i kontrastu */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
              Podgląd na żywo
            </span>
            <p className="text-slate-800">
              „Dostępność nie jest przywilejem, lecz prawem każdego mieszkańca i gościa Krakowa do samodzielnego poruszania się.”
            </p>
          </div>
        </div>
      )}

      {/* ZAWARTOŚĆ: 2. PARAMETRY MOBILNOŚCI I WYMIARY */}
      {activeCategory === 'mobility' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Fizyczne Wymiary i Filtry Architektoniczne
            </h2>
            <p className="text-xs text-slate-500">
              Dostosuj dokładne parametry wejść, progów i nawierzchni, według których aplikacja klasyfikuje obiekty w Krakowie.
            </p>
          </div>

          {/* Suwaki wymiarów */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="settings-door-width" className="text-xs font-bold text-slate-800">
                  Minimalna szerokość wejścia / drzwi:
                </label>
                <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  {preferences.min_door_width_cm} cm
                </span>
              </div>
              <input
                id="settings-door-width"
                type="range"
                min="70"
                max="130"
                step="5"
                value={preferences.min_door_width_cm}
                onChange={(e) => onUpdatePreferences({
                  ...preferences,
                  preset_name: 'custom',
                  min_door_width_cm: Number(e.target.value)
                })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>70 cm (wąskie przejście)</span>
                <span>85 cm (wózek manualny)</span>
                <span>130 cm (szerokie drzwi dwuskrzydłowe)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="settings-max-curb" className="text-xs font-bold text-slate-800">
                  Dopuszczalna wysokość krawężnika / progu:
                </label>
                <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  {preferences.max_curb_cm} cm
                </span>
              </div>
              <input
                id="settings-max-curb"
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={preferences.max_curb_cm}
                onChange={(e) => onUpdatePreferences({
                  ...preferences,
                  preset_name: 'custom',
                  max_curb_cm: Number(e.target.value)
                })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 cm (płasko)</span>
                <span>2.0 cm (standard dostępności)</span>
                <span>15 cm (wysoki stopień kamienicy)</span>
              </div>
            </div>
          </div>

          {/* Przełączniki barier fizycznych */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <label className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer flex items-center gap-3 transition-colors">
              <input
                type="checkbox"
                checked={preferences.avoid_stairs}
                onChange={(e) => onUpdatePreferences({
                  ...preferences,
                  preset_name: 'custom',
                  avoid_stairs: e.target.checked
                })}
                className="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Unikaj schodów bez rampy lub windy</span>
                <span className="text-[11px] text-slate-500">Ostrzegaj przed stopniami wejściowymi</span>
              </div>
            </label>

            <label className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer flex items-center gap-3 transition-colors">
              <input
                type="checkbox"
                checked={preferences.avoid_rough_surfaces}
                onChange={(e) => onUpdatePreferences({
                  ...preferences,
                  preset_name: 'custom',
                  avoid_rough_surfaces: e.target.checked
                })}
                className="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Unikaj kocich łbów i nierównego bruku</span>
                <span className="text-[11px] text-slate-500">Zalecane dla małych kółek i walizek</span>
              </div>
            </label>

            <label className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer flex items-center gap-3 transition-colors">
              <input
                type="checkbox"
                checked={preferences.require_accessible_toilet}
                onChange={(e) => onUpdatePreferences({
                  ...preferences,
                  preset_name: 'custom',
                  require_accessible_toilet: e.target.checked
                })}
                className="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Wymagana toaleta przystosowana</span>
                <span className="text-[11px] text-slate-500">Obecność uchwytów i przestrzeni manewrowej</span>
              </div>
            </label>

            <label className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer flex items-center gap-3 transition-colors">
              <input
                type="checkbox"
                checked={preferences.require_rest_places}
                onChange={(e) => onUpdatePreferences({
                  ...preferences,
                  preset_name: 'custom',
                  require_rest_places: e.target.checked
                })}
                className="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Wymagane miejsca odpoczynku (ławki)</span>
                <span className="text-[11px] text-slate-500">Ławki z oparciami na trasie spacerowej</span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* ZAWARTOŚĆ: 3. WIDOK MAPY I PREFERENCJE */}
      {activeCategory === 'map' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Preferencje Mapy i Widoków Aplikacji
            </h2>
            <p className="text-xs text-slate-500">
              Wybierz, która zakładka ma otwierać się domyślnie oraz w jakim układzie wolisz przeglądać obiekty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Domyślna zakładka startowa */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-900 block">Domyślna strona przy uruchomieniu:</span>
              <div className="space-y-1.5">
                {[
                  { id: 'home', title: 'Strona Główna (Pulpit i Wyszukiwarka)' },
                  { id: 'places', title: 'Miejsca i Obiekty (Interaktywna Mapa)' },
                  { id: 'routes', title: 'Dostępne Trasy Piesze (Planer)' }
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="defaultTab"
                      value={item.id}
                      checked={settings.defaultTab === item.id}
                      onChange={() => onUpdateSettings({ ...settings, defaultTab: item.id as NavigationTab })}
                      className="text-blue-700 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-800">{item.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Domyślny tryb prezentacji POI */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-900 block">Domyślny układ obiektów (w zakładce Miejsca):</span>
              <div className="space-y-1.5">
                {[
                  { id: 'both', title: 'Oba (Mapa i Lista obok siebie - polecane)' },
                  { id: 'list', title: 'Tylko Lista tekstowa (zoptymalizowana pod czytniki)' },
                  { id: 'map', title: 'Tylko Mapa interaktywna' }
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="defaultViewMode"
                      value={item.id}
                      checked={settings.defaultViewMode === item.id}
                      onChange={() => onUpdateSettings({ ...settings, defaultViewMode: item.id as any })}
                      className="text-blue-700 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-800">{item.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZAWARTOŚĆ: 4. PRYWATNOŚĆ I PAMIĘĆ (RODO) */}
      {activeCategory === 'privacy' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Prywatność i Bezpieczeństwo Danych (Privacy by Design)
            </h2>
            <p className="text-xs text-slate-500">
              Twoje preferencje mobilności to dane wrażliwe. Dbamy o to, by nigdy nie opuszczały Twojego urządzenia.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3 text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-emerald-900 mb-1">Zasady poufności w projekcie:</h3>
              <ul className="list-disc list-inside space-y-1 text-emerald-800">
                <li>Brak pytań o orzeczenia o niepełnosprawności, stan zdrowia czy diagnozy.</li>
                <li>Wszystkie ustawienia filtrów zapisywane są wyłącznie w pamięci lokalnej przeglądarki (localStorage).</li>
                <li>Zero komercyjnych ciasteczek śledzących i profili marketingowych.</li>
                <li>Zgłoszenia korekt są w pełni anonimowe i weryfikowane społecznościowo.</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onResetDefaults}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Przywróć wartości domyślne</span>
            </button>

            <button
              type="button"
              onClick={onClearStorage}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Wyczyść pamięć lokalną i historię</span>
            </button>
          </div>
        </div>
      )}

      {/* Dolny pasek akcji */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-slate-500">
          Ustawienia są aktywne natychmiast i synchronizowane w czasie rzeczywistym.
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateToTab('places')}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Przejdź do Mapy Miejsc</span>
          </button>
        </div>
      </div>
    </div>
  );
};
