import React from 'react';
import { ShieldCheck, Users, Database, AlertTriangle, HelpCircle } from 'lucide-react';
import { DataProvenance } from '../types';

interface Props {
  meta: DataProvenance;
  showDetails?: boolean;
}

export const DataTransparencyBadge: React.FC<Props> = ({ meta, showDetails = false }) => {
  const getBadgeConfig = () => {
    switch (meta.credibility_level) {
      case 'VERIFIED_OFFICIAL':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-emerald-700" aria-hidden="true" />,
          label: 'Oficjalny audyt miejski / zarządcy',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
          badgeText: 'Zweryfikowane 100%'
        };
      case 'VERIFIED_COMMUNITY':
        return {
          icon: <Users className="w-4 h-4 text-blue-700" aria-hidden="true" />,
          label: 'Potwierdzone społecznościowo (3+ audyty)',
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-600',
          badgeText: 'Społeczność'
        };
      case 'OPEN_DATA_IMPORT':
        return {
          icon: <Database className="w-4 h-4 text-slate-700" aria-hidden="true" />,
          label: 'Import OpenStreetMap / Otwarte Dane',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-500',
          badgeText: 'Import danych'
        };
      case 'UNVERIFIED_REPORT':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-700" aria-hidden="true" />,
          label: 'Pojedyncze, niepotwierdzone zgłoszenie',
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          badgeText: 'Niepotwierdzone'
        };
      case 'DATA_GAP':
      default:
        return {
          icon: <HelpCircle className="w-4 h-4 text-rose-700" aria-hidden="true" />,
          label: 'Wykryto istotne luki informacyjne',
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-600',
          badgeText: 'Brakujące dane'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div className="flex flex-col gap-1.5" role="region" aria-label="Wiarygodność i pochodzenie informacji">
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}>
        {config.icon}
        <span>{config.badgeText}</span>
        <span className="text-slate-400">|</span>
        <span className="text-[11px] font-normal">{meta.last_verified_at}</span>
      </div>

      {showDetails && (
        <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">
          <div className="flex items-center gap-1 font-medium text-slate-700">
            <span>Źródło:</span>
            <span className="text-slate-900">{meta.source_name}</span>
          </div>
          {meta.verified_by && (
            <div className="text-[11px] text-slate-500 mt-0.5">
              Weryfikator: <span className="font-medium text-slate-700">{meta.verified_by}</span>
            </div>
          )}
          {meta.has_data_gaps && meta.data_gaps.length > 0 && (
            <div className="mt-2 text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-200 font-medium">
              ⚠️ Luki w danych: {meta.data_gaps.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
