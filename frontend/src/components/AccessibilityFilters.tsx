import React from 'react';
import { UserPreferences } from '../types';
import { Accessibility, Luggage, Baby, UserCheck, Sliders, CheckSquare, Square } from 'lucide-react';

interface Props {
  preferences: UserPreferences;
  onChange: (newPrefs: UserPreferences) => void;
  onOpenSettings?: () => void;
}

export const AccessibilityFilters: React.FC<Props> = ({ preferences, onChange, onOpenSettings }) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);


  const applyPreset = (presetKey: string) => {
    switch (presetKey) {
      case 'wheelchair':
        onChange({
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
        break;
      case 'luggage':
        onChange({
          preset_name: 'luggage',
          min_door_width_cm: 80,
          max_curb_cm: 3.0,
          avoid_stairs: true,
          avoid_rough_surfaces: true, // Kocie łby to koszmar dla walizek
          require_elevator_if_multi_floor: true,
          require_accessible_toilet: false,
          require_rest_places: false,
          require_hearing_loop: false
        });
        break;
      case 'stroller':
        onChange({
          preset_name: 'stroller',
          min_door_width_cm: 75,
          max_curb_cm: 4.0,
          avoid_stairs: true,
          avoid_rough_surfaces: false,
          require_elevator_if_multi_floor: true,
          require_accessible_toilet: false,
          require_rest_places: true,
          require_hearing_loop: false
        });
        break;
      case 'senior':
        onChange({
          preset_name: 'senior',
          min_door_width_cm: 75,
          max_curb_cm: 3.0,
          avoid_stairs: true,
          avoid_rough_surfaces: true,
          require_elevator_if_multi_floor: true,
          require_accessible_toilet: false,
          require_rest_places: true,
          require_hearing_loop: false
        });
        break;
      default:
        break;
    }
  };

  return (
    <section 
      aria-label="Filtry profilu mobilności"
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Dopasuj do swoich możliwości ruchowych
          </h2>
          <p className="text-xs text-slate-500">
            Prywatność przede wszystkim: nie pytamy o diagnozy, lecz o konkretne wymiary i nawierzchnie.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <span>⚙️ Wszystkie opcje</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
            aria-expanded={showAdvanced}
          >
            <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
            {showAdvanced ? 'Zwiń szczegóły' : 'Dostosuj wymiary'}
          </button>
        </div>
      </div>

      {/* Szybkie presety */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3" role="radiogroup" aria-label="Wybierz profil podróży">
        <button
          type="button"
          role="radio"
          aria-checked={preferences.preset_name === 'wheelchair'}
          onClick={() => applyPreset('wheelchair')}
          className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
            preferences.preset_name === 'wheelchair'
              ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Accessibility className="w-5 h-5 text-blue-600 shrink-0" aria-hidden="true" />
          <div>
            <div className="font-semibold">Osoba na wózku</div>
            <div className="text-[11px] text-slate-500">Szerokość &gt;85cm, winda, WC</div>
          </div>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={preferences.preset_name === 'luggage'}
          onClick={() => applyPreset('luggage')}
          className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
            preferences.preset_name === 'luggage'
              ? 'bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-500/20 shadow-sm'
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Luggage className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
          <div>
            <div className="font-semibold">Turysta z walizką</div>
            <div className="text-[11px] text-slate-500">Bez kocich łbów, pochylnie</div>
          </div>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={preferences.preset_name === 'stroller'}
          onClick={() => applyPreset('stroller')}
          className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
            preferences.preset_name === 'stroller'
              ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-500/20 shadow-sm'
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Baby className="w-5 h-5 text-purple-600 shrink-0" aria-hidden="true" />
          <div>
            <div className="font-semibold">Wózek dziecięcy</div>
            <div className="text-[11px] text-slate-500">Płaskie wjazdy, ławeczki</div>
          </div>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={preferences.preset_name === 'senior'}
          onClick={() => applyPreset('senior')}
          className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
            preferences.preset_name === 'senior'
              ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm'
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
          <div>
            <div className="font-semibold">Senior / Asysta</div>
            <div className="text-[11px] text-slate-500">Miejsca odpoczynku, poręcze</div>
          </div>
        </button>
      </div>

      {/* Zaawansowane suwaki i przełączniki */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label htmlFor="door-width" className="block font-medium text-slate-700 mb-1">
              Minimalna szerokość wejścia: <span className="font-bold text-blue-700">{preferences.min_door_width_cm} cm</span>
            </label>
            <input
              id="door-width"
              type="range"
              min="70"
              max="130"
              step="5"
              value={preferences.min_door_width_cm}
              onChange={(e) => onChange({ ...preferences, preset_name: 'custom', min_door_width_cm: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>70 cm (wąskie)</span>
              <span>90 cm (standard)</span>
              <span>130 cm (szerokie)</span>
            </div>
          </div>

          <div>
            <label htmlFor="max-curb" className="block font-medium text-slate-700 mb-1">
              Dopuszczalny próg / krawężnik: <span className="font-bold text-blue-700">{preferences.max_curb_cm} cm</span>
            </label>
            <input
              id="max-curb"
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={preferences.max_curb_cm}
              onChange={(e) => onChange({ ...preferences, preset_name: 'custom', max_curb_cm: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>0 cm (płasko)</span>
              <span>2 cm (norma wózkowa)</span>
              <span>15 cm (wysoki stopień)</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center">
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={preferences.avoid_stairs}
                onChange={(e) => onChange({ ...preferences, preset_name: 'custom', avoid_stairs: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Unikaj schodów bez rampy / windy</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={preferences.avoid_rough_surfaces}
                onChange={(e) => onChange({ ...preferences, preset_name: 'custom', avoid_rough_surfaces: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Unikaj nawierzchni z kocich łbów / bruku</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={preferences.require_accessible_toilet}
                onChange={(e) => onChange({ ...preferences, preset_name: 'custom', require_accessible_toilet: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Wymagana przystosowana toaleta z uchwytami</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={preferences.require_rest_places}
                onChange={(e) => onChange({ ...preferences, preset_name: 'custom', require_rest_places: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Wymagane miejsca odpoczynku (ławki)</span>
            </label>
          </div>
        </div>
      )}
    </section>
  );
};
