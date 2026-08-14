/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, LocateFixed, Scale, DollarSign, Compass, CheckCircle2, Building2 } from 'lucide-react';
import { Destination, UserPreferenceMode } from '../types';
import { POPULAR_DESTINATIONS } from '../utils/geoUtils';

interface SearchBarProps {
  currentDestination: Destination;
  onSelectDestination: (dest: Destination) => void;
  preferenceMode: UserPreferenceMode;
  onPreferenceChange: (mode: UserPreferenceMode) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  currentDestination,
  onSelectDestination,
  preferenceMode,
  onPreferenceChange,
  onUseCurrentLocation,
  isLocating,
}) => {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredDestinations = POPULAR_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.address.toLowerCase().includes(query.toLowerCase()) ||
      d.postalCode.includes(query)
  );

  const handleSelect = (dest: Destination) => {
    onSelectDestination(dest);
    setQuery('');
    setIsDropdownOpen(false);
  };

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Search or create custom query location in Singapore
    const customDest: Destination = {
      id: `custom-${Date.now()}`,
      name: query.trim(),
      category: 'shopping',
      address: `${query.trim()}, Singapore`,
      postalCode: '000000',
      latitude: currentDestination.latitude + (Math.random() - 0.5) * 0.01,
      longitude: currentDestination.longitude + (Math.random() - 0.5) * 0.01,
      popularCarparkIds: [],
    };
    handleSelect(customDest);
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Primary Search Container */}
      <div className="relative z-30">
        <form onSubmit={handleCustomSearchSubmit} className="relative flex items-center">
          <div className="absolute left-3.5 text-emerald-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search destination, building, or Singapore postal code..."
            className="w-full pl-10 pr-24 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white placeholder-slate-400 font-medium text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-lg transition-all"
          />
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="absolute right-2 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1 transition-all"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </form>

        {/* Dropdown Auto-Complete Suggestions */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
            <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 bg-slate-950/40">
              Popular Singapore Hubs
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => handleSelect(dest)}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-slate-800/80 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-100 block group-hover:text-emerald-300 transition-all">
                          {dest.name}
                        </span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">
                          {dest.address}
                        </span>
                      </div>
                    </div>
                    <MapPin className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                  </button>
                ))
              ) : (
                <button
                  onClick={() => handleSelect({
                    id: `custom-${Date.now()}`,
                    name: query,
                    category: 'shopping',
                    address: `${query}, Singapore`,
                    postalCode: '000000',
                    latitude: 1.2935,
                    longitude: 103.8572,
                    popularCarparkIds: [],
                  })}
                  className="w-full px-4 py-3 text-left hover:bg-slate-800 text-xs text-emerald-400 font-semibold"
                >
                  🔍 Search for "{query}" in Singapore
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Destination Chips Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[11px] font-bold text-slate-400 flex-shrink-0 mr-1">
          Going to:
        </span>
        {POPULAR_DESTINATIONS.map((dest) => {
          const isCurrent = currentDestination.name === dest.name;
          return (
            <button
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isCurrent
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm scale-105'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-slate-500 hover:text-white'
              }`}
            >
              {dest.name.split('/')[0]}
            </button>
          );
        })}
      </div>

      {/* Quick Ranking Filter Actions */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => onPreferenceChange('overall')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
            preferenceMode === 'overall'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span className="text-[11px]">Best Overall</span>
        </button>

        <button
          onClick={() => onPreferenceChange('cheapest')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
            preferenceMode === 'cheapest'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span className="text-[11px]">Cheapest</span>
        </button>

        <button
          onClick={() => onPreferenceChange('closest')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
            preferenceMode === 'closest'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="text-[11px]">Closest</span>
        </button>

        <button
          onClick={() => onPreferenceChange('available')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
            preferenceMode === 'available'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-[11px]">Most Available</span>
        </button>
      </div>
    </div>
  );
};
