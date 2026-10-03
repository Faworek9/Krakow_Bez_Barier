import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RouteResponse, RouteSegment, SurfaceType } from '../types';

interface Props {
  routeData: RouteResponse;
  activeStepNumber?: number | null;
  onSelectStep?: (stepNumber: number) => void;
}

export const RouteMapView: React.FC<Props> = ({
  routeData,
  activeStepNumber,
  onSelectStep
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Funkcja dobierająca kolor i nazwę dla nawierzchni
  const getSurfaceColor = (surface: SurfaceType) => {
    switch (surface) {
      case 'asfalt':
      case 'plytki_wewnetrzne':
        return {
          color: '#10B981', // Zielony - gładki asfalt (np. Planty)
          label: 'Gładki asfalt / równe płytki',
          bgClass: 'bg-emerald-500'
        };
      case 'plyty_chodnikowe':
        return {
          color: '#3B82F6', // Niebieski - płyty chodnikowe
          label: 'Płyty chodnikowe (płaskie)',
          bgClass: 'bg-blue-500'
        };
      case 'kostka_brukowa':
        return {
          color: '#F59E0B', // Bursztynowy - kostka
          label: 'Kostka brukowa',
          bgClass: 'bg-amber-500'
        };
      case 'kocie_lby':
      case 'szuter':
      default:
        return {
          color: '#EF4444', // Czerwony - kocie łby (np. ul. Kanonicza)
          label: 'Zabytkowe kocie łby / trudna nawierzchnia',
          bgClass: 'bg-rose-500'
        };
    }
  };

  // Inicjalizacja mapy
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([50.0614, 19.9365], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      polylinesLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Rysowanie segmentów trasy (Polylines) i markerów
  useEffect(() => {
    const map = mapInstanceRef.current;
    const polyGroup = polylinesLayerRef.current;
    const markerGroup = markersLayerRef.current;
    if (!map || !polyGroup || !markerGroup) return;

    polyGroup.clearLayers();
    markerGroup.clearLayers();

    const allPoints: L.LatLngExpression[] = [];

    routeData.segments.forEach((seg: RouteSegment) => {
      const { color, label } = getSurfaceColor(seg.surface_type);
      const isSelected = activeStepNumber === seg.step_number;

      // Wyznaczenie punktów łamanej dla danego segmentu
      const segmentCoords: [number, number][] = seg.path && seg.path.length > 0
        ? seg.path
        : [[seg.lat, seg.lng]];

      segmentCoords.forEach(c => allPoints.push(c));

      // 1. Zewnętrzna otoczka / cień linii (dla lepszej widoczności)
      L.polyline(segmentCoords, {
        color: '#FFFFFF',
        weight: isSelected ? 12 : 9,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(polyGroup);

      // 2. Właściwa kolorowa linia nawierzchni
      const line = L.polyline(segmentCoords, {
        color: color,
        weight: isSelected ? 8 : 6,
        opacity: 1.0,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Interaktywny popup i tooltip
      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; max-width: 240px; padding: 4px;">
          <div style="font-weight: bold; color: #0f172a; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span style="background: ${color}; width: 10px; height: 10px; border-radius: 50%; display: inline-block;"></span>
            Krok ${seg.step_number}: ${label}
          </div>
          <div style="color: #334155; margin-bottom: 6px; line-height: 1.3;">${seg.instruction}</div>
          <div style="background: #f1f5f9; padding: 6px; border-radius: 6px; font-size: 11px;">
            <div>• Długość: <strong>${seg.distance_meters} m</strong></div>
            <div>• Maks. próg/krawężnik: <strong>${seg.curb_height_cm} cm</strong></div>
            ${seg.has_incline ? `<div>• Nachylenie: <strong style="color: #d97706;">${seg.incline_percent}%</strong></div>` : ''}
            ${seg.warning ? `<div style="color: #b91c1c; margin-top: 4px;">⚠️ ${seg.warning}</div>` : ''}
          </div>
        </div>
      `;

      line.bindPopup(popupHtml);
      line.on('click', () => {
        if (onSelectStep) onSelectStep(seg.step_number);
      });

      line.addTo(polyGroup);

      // Marker numeru kroku
      const stepIcon = L.divIcon({
        className: 'route-step-icon',
        html: `
          <div style="
            background-color: ${isSelected ? '#0052A5' : color};
            color: white;
            font-weight: bold;
            font-size: 11px;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
            transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
            transition: transform 0.2s ease;
          ">
            ${seg.step_number}
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const stepMarker = L.marker([seg.lat, seg.lng], { icon: stepIcon });
      stepMarker.bindPopup(popupHtml);
      stepMarker.on('click', () => {
        if (onSelectStep) onSelectStep(seg.step_number);
      });
      stepMarker.addTo(markerGroup);
    });

    // Dodanie wyraźnego markera START (Dworzec / Sukiennice)
    if (routeData.segments.length > 0) {
      const firstSeg = routeData.segments[0];
      const startCoord = firstSeg.path && firstSeg.path.length > 0 ? firstSeg.path[0] : [firstSeg.lat, firstSeg.lng];
      
      const startIcon = L.divIcon({
        className: 'route-start-pin',
        html: `
          <div style="
            background: #10B981;
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 800;
            font-size: 11px;
            border: 2px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            white-space: nowrap;
          ">
            🚩 START
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 28]
      });
      L.marker(startCoord as L.LatLngExpression, { icon: startIcon }).addTo(markerGroup);

      // Dodanie wyraźnego markera CEL
      const lastSeg = routeData.segments[routeData.segments.length - 1];
      const endCoord = lastSeg.path && lastSeg.path.length > 0 ? lastSeg.path[lastSeg.path.length - 1] : [lastSeg.lat, lastSeg.lng];
      
      const endIcon = L.divIcon({
        className: 'route-end-pin',
        html: `
          <div style="
            background: #0052A5;
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 800;
            font-size: 11px;
            border: 2px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            white-space: nowrap;
          ">
            🏁 CEL
          </div>
        `,
        iconSize: [50, 24],
        iconAnchor: [25, 28]
      });
      L.marker(endCoord as L.LatLngExpression, { icon: endIcon }).addTo(markerGroup);
    }

    // Dopasowanie widoku do całej trasy
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
    }
  }, [routeData, activeStepNumber, onSelectStep]);

  return (
    <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-slate-200 shadow-xs">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full" 
        tabIndex={0} 
        aria-label={`Mapa trasy: ${routeData.title}`} 
      />

      {/* Pływająca legenda nawierzchni na mapie */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs p-3 rounded-lg shadow-md border border-slate-200 z-20 text-[11px] flex flex-col gap-1.5 max-w-xs pointer-events-auto">
        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
          Nawierzchnia na mapie (Polylines)
        </span>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="text-slate-700">Gładki asfalt (np. Planty)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
          <span className="text-slate-700">Płyty chodnikowe (płaskie)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
          <span className="text-slate-700">Kostka brukowa</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
          <span className="text-slate-700 font-semibold text-rose-800">Kocie łby (np. ul. Kanonicza)</span>
        </div>
      </div>
    </div>
  );
};
