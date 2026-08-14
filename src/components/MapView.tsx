/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Carpark, Destination } from '../types';
import { Navigation, Compass, MapPin, ExternalLink, ArrowRight, CheckCircle2, LocateFixed } from 'lucide-react';

interface MapViewProps {
  destination: Destination;
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  onOpenDetailModal: (carpark: Carpark) => void;
  onOpenNavigateModal: (carpark: Carpark) => void;
  userLocation: { latitude: number; longitude: number } | null;
  onUseCurrentLocation?: () => void;
  isLocating?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  destination,
  carparks,
  selectedCarpark,
  onSelectCarpark,
  onOpenDetailModal,
  onOpenNavigateModal,
  userLocation,
  onUseCurrentLocation,
  isLocating,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([destination.latitude, destination.longitude], 15);

      // Clean CartoDB Positron / OpenStreetMap Tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([destination.latitude, destination.longitude], 15);
    }
  }, [destination]);

  // Update markers when carparks or destination changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Destination Marker
    const destHtml = `
      <div style="background-color: #059669; color: white; border: 3px solid white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(5,150,105,0.5); font-size: 18px;">
        📍
      </div>
    `;
    const destIcon = L.divIcon({
      html: destHtml,
      className: 'dest-marker-pin',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const destMarker = L.marker([destination.latitude, destination.longitude], { icon: destIcon })
      .addTo(map)
      .bindPopup(`<b>📍 ${destination.name}</b><br/>${destination.address}`);
    markersRef.current.push(destMarker);

    // User location marker if available
    if (userLocation) {
      const userHtml = `
        <div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.8); animate: pulse 1.5s infinite;"></div>
      `;
      const userIcon = L.divIcon({
        html: userHtml,
        className: 'user-marker-pin',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const userMarker = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Your Current Location</b>');
      markersRef.current.push(userMarker);
    }

    // Carpark Markers
    carparks.forEach((cp) => {
      let bg = '#10b981'; // emerald green
      if (cp.availableLots === 0) bg = '#ef4444'; // red
      else if (cp.availableLots < 50) bg = '#f59e0b'; // amber

      const isSelected = selectedCarpark?.id === cp.id;
      const border = isSelected ? '3px solid #000000' : '2px solid #ffffff';
      const scale = isSelected ? 'transform: scale(1.2); z-index: 999;' : '';

      const cpHtml = `
        <div style="background-color: ${bg}; color: white; border: ${border}; padding: 4px 8px; border-radius: 12px; font-weight: 800; font-size: 12px; white-space: nowrap; box-shadow: 0 3px 10px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; ${scale}">
          <span>🟢</span>
          <span>${cp.availableLots}</span>
        </div>
      `;

      const cpIcon = L.divIcon({
        html: cpHtml,
        className: 'custom-carpark-pin',
        iconSize: [60, 26],
        iconAnchor: [30, 13],
      });

      const marker = L.marker([cp.latitude, cp.longitude], { icon: cpIcon }).addTo(map);

      marker.on('click', () => {
        onSelectCarpark(cp);
      });

      markersRef.current.push(marker);
    });
  }, [destination, carparks, selectedCarpark, userLocation, onSelectCarpark]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[420px] rounded-2xl overflow-hidden shadow-inner border border-slate-800">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Legend Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 shadow-md flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Good (&gt;50)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Limited (&lt;50)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Full</span>
        </div>
      </div>

      {/* GPS Recenter Floating Action Button */}
      {onUseCurrentLocation && (
        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          title="Center map on my GPS location"
          className="absolute top-14 left-3 z-10 bg-slate-900/95 hover:bg-emerald-500 hover:text-slate-950 backdrop-blur-md px-3 py-2 rounded-xl border border-emerald-500/50 text-emerald-400 font-extrabold text-xs shadow-xl flex items-center gap-1.5 transition-all group"
        >
          <LocateFixed className={`w-4 h-4 text-emerald-400 group-hover:text-slate-950 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Center GPS'}</span>
        </button>
      )}

      {/* Selected Carpark Bottom Sheet Preview Card */}
      {selectedCarpark && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/80 shadow-2xl text-white transition-all animate-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                {selectedCarpark.badge && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold text-[10px] tracking-wide uppercase">
                    {selectedCarpark.badge.replace('_', ' ')}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-medium">
                  Updated 1 min ago
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-1 line-clamp-1">
                {selectedCarpark.name}
              </h2>
              <p className="text-xs text-slate-400 line-clamp-1">{selectedCarpark.address}</p>
            </div>

            {/* Availability Pill */}
            <div className="text-right flex-shrink-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{selectedCarpark.availableLots} lots</span>
              </div>
            </div>
          </div>

          {/* Key metrics grid */}
          <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Est. Cost</span>
              <span className="font-extrabold text-white text-sm">
                S${selectedCarpark.estimatedCost?.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Drive Time</span>
              <span className="font-bold text-slate-200">
                🚗 {selectedCarpark.drivingDurationMins || 4} min
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Walk to Dest</span>
              <span className="font-bold text-slate-200">
                🚶 {selectedCarpark.walkingDurationMins || 5} min
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onOpenDetailModal(selectedCarpark)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all text-center flex items-center justify-center gap-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenNavigateModal(selectedCarpark)}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 fill-slate-950" />
              <span>Navigate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
