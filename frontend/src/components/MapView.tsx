import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { EvaluatedPOI, POI } from '../types';

interface Props {
  items: EvaluatedPOI[];
  selectedPoi: POI | null;
  onSelectPoi: (poi: POI) => void;
}

export const MapView: React.FC<Props> = ({ items, selectedPoi, onSelectPoi }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Domyślne centrum: Kraków Rynek Główny
      const map = L.map(mapContainerRef.current).setView([50.0614, 19.9365], 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Sprzątanie przy odmontowaniu
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Aktualizacja markerów
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Usunięcie starych markerów
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    items.forEach(({ poi, evaluation }) => {
      let pinColor = '#10B981'; // Zielony - wysokie dopasowanie
      let badgeLabel = `${evaluation.match_score}%`;

      if (evaluation.status === 'insufficient_data') {
        pinColor = '#F43F5E'; // Różowo-czerwony z pytajnikiem dla braków danych
        badgeLabel = '?';
      } else if (evaluation.match_score < 50) {
        pinColor = '#EF4444'; // Czerwony - bariery
      } else if (evaluation.match_score < 80) {
        pinColor = '#F59E0B'; // Żółto-pomarańczowy
      }

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            color: white;
            font-weight: bold;
            font-size: 11px;
            padding: 4px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            cursor: pointer;
          ">
            <span>${badgeLabel}</span>
          </div>
        `,
        iconSize: [40, 24],
        iconAnchor: [20, 12]
      });

      const marker = L.marker([poi.location.lat, poi.location.lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1';
      popupContent.innerHTML = `
        <div style="font-weight: bold; font-size: 13px; color: #0f172a;">${poi.name}</div>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${poi.address}</div>
        <div style="font-size: 11px; margin-bottom: 6px;">
          <strong>Dopasowanie:</strong> ${evaluation.status_label_pl}
        </div>
        ${
          evaluation.barriers.length > 0 
            ? `<div style="font-size: 10px; color: #991b1b; background: #fee2e2; padding: 4px; border-radius: 4px; margin-bottom: 6px;">
                ⚠️ ${evaluation.barriers[0]}
               </div>`
            : ''
        }
        <button id="popup-btn-${poi.id}" style="
          width: 100%;
          background: #0052A5;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        ">
          Zobacz pełny audyt
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${poi.id}`);
        if (btn) {
          btn.onclick = () => onSelectPoi(poi);
        }
      });

      marker.addTo(map);
      markersRef.current[poi.id] = marker;
    });
  }, [items, onSelectPoi]);

  // Centrowanie mapy na wybranym obiekcie
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPoi) return;

    map.flyTo([selectedPoi.location.lat, selectedPoi.location.lng], 16, {
      duration: 1.2
    });

    const marker = markersRef.current[selectedPoi.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedPoi]);

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 shadow-xs">
      <div ref={mapContainerRef} className="w-full h-full" tabIndex={0} aria-label="Interaktywna mapa Krakowa z punktami dostępności" />
      
      {/* Legenda mapy */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs p-3 rounded-lg shadow-md border border-slate-200 z-20 text-[11px] flex flex-col gap-1.5 max-w-xs">
        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Legenda dopasowania</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="text-slate-700">Wysoka dostępność (&gt;80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
          <span className="text-slate-700">Wymaga uwagi / asysty (50-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
          <span className="text-slate-700">Istotne bariery lub luki danych</span>
        </div>
      </div>
    </div>
  );
};
