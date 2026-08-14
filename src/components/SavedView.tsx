/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Carpark, Destination, RecentSearch, SavedLocation } from '../types';
import { Bookmark, Home, Briefcase, Heart, Clock, Navigation, MapPin, Trash2 } from 'lucide-react';

interface SavedViewProps {
  savedCarparks: Carpark[];
  savedLocations: SavedLocation[];
  recentSearches: RecentSearch[];
  onSelectCarpark: (cp: Carpark) => void;
  onOpenNavigate: (cp: Carpark) => void;
  onRemoveSavedCarpark: (cp: Carpark) => void;
  onSelectRecentSearch: (search: RecentSearch) => void;
  onAddQuickLocation: (label: 'Home' | 'Work', address: string) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedCarparks,
  savedLocations,
  recentSearches,
  onSelectCarpark,
  onOpenNavigate,
  onRemoveSavedCarpark,
  onSelectRecentSearch,
}) => {
  const homeLoc = savedLocations.find((l) => l.label === 'Home');
  const workLoc = savedLocations.find((l) => l.label === 'Work');

  return (
    <div className="w-full space-y-5 pb-20">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
          <span>Saved & Quick Access</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Fast 1-tap parking access for your frequent Singapore routes
        </p>
      </div>

      {/* Quick Destinations Cards */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Quick Shortcuts
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Home */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-all">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold truncate">
              {homeLoc ? homeLoc.name : 'Tampines Ave 4 (Saved)'}
            </p>
            <span className="text-[10px] text-slate-400 block">Tap to check nearby parking</span>
          </div>

          {/* Work */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-all">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <Briefcase className="w-4 h-4" />
              <span>Work</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold truncate">
              {workLoc ? workLoc.name : 'Raffles Place / CBD (Saved)'}
            </p>
            <span className="text-[10px] text-slate-400 block">Tap to check nearby parking</span>
          </div>
        </div>
      </div>

      {/* Saved Carparks List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400/20" />
            <span>Saved Carparks ({savedCarparks.length})</span>
          </h3>
        </div>

        {savedCarparks.length > 0 ? (
          <div className="space-y-2.5">
            {savedCarparks.map((cp) => (
              <div
                key={cp.id}
                onClick={() => onSelectCarpark(cp)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 cursor-pointer"
              >
                <div>
                  <h4 className="font-bold text-sm text-white">{cp.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{cp.address}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="font-bold text-emerald-400">🟢 {cp.availableLots} lots available</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">S${cp.estimatedCost?.toFixed(2) || '2.40'} / 2h</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenNavigate(cp);
                    }}
                    className="p-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs transition-all"
                    title="Navigate"
                  >
                    <Navigation className="w-4 h-4 fill-slate-950" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSavedCarpark(cp);
                    }}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 transition-all"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center text-slate-400 space-y-1">
            <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">No saved carparks yet</p>
            <p className="text-[11px] text-slate-500">Tap the heart icon on any carpark card to save it here for fast 1-tap navigation.</p>
          </div>
        )}
      </div>

      {/* Recent Searches */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Recent Destinations</span>
        </h3>

        <div className="space-y-2">
          {recentSearches.length > 0 ? (
            recentSearches.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectRecentSearch(s)}
                className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center group-hover:text-emerald-400 transition-all">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-xs text-slate-200 group-hover:text-white transition-all">
                    {s.destinationName}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{s.timestamp}</span>
              </button>
            ))
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/40 text-center text-xs text-slate-500">
              Your recent destination searches will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
