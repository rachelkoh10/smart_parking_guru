/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, LocateFixed, Scale, DollarSign, Compass, CheckCircle2, Building2, Hash } from 'lucide-react';
import { Destination, UserPreferenceMode } from '../types';
import { POPULAR_DESTINATIONS } from '../utils/geoUtils';
import { lookupPostalCode, extractPostalCode } from '../utils/postalUtils';

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

  const cleanQuery = query.trim();
  const postalResult = cleanQuery ? lookupPostalCode(cleanQuery) : null;

  const filteredDestinations = POPULAR_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.address.toLowerCase().includes(query.toLowerCase()) ||
      d.postalCode.includes(query.trim())
  );

  const handleSelect = (dest: Destination) => {
    onSelectDestination(dest);
    setQuery('');
    setIsDropdownOpen(false);
  };

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanQuery) return;

    if (postalResult) {
      handleSelect(postalResult.destinationObj);
      return;
    }

    const customDest: Destination = {
      id: `custom-${Date.now()}`,
      name: cleanQuery,
      category: 'shopping',
      address: `${cleanQuery}, Singapore`,
      postalCode: extractPostalCode(cleanQuery) || '000000',
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
            placeholder="Search destination, building, or 6-digit SG postal code (e.g. 038983)..."
            className="w-full pl-10 pr-24 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white placeholder-slate-400 font-medium text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-lg transition-all"
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
            {/* Postal Code Direct Hit Box */}
            {postalResult && (
              <div className="p-2.5 bg-emerald-950/60 border-b border-emerald-500/30">
                <button
                  type="button"
                  onClick={() => handleSelect(postalResult.destinationObj)}
                  className="w-full p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 hover:bg-emerald-500 text-left group transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                      <Hash className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-white group-hover:text-slate-950 flex items-center gap-1.5">
                        <span>{postalResult.title}</span>
                        <span className="px-1.5 py-0.2 bg-emerald-400/30 group-hover:bg-slate-950 group-hover:text-emerald-400 text-[10px] rounded font-bold">
                          Postal Match
                        </span>
                      </span>
                      <span className="text-[11px] text-emerald-200 group-hover:text-slate-900 block line-clamp-1">
                        {postalResult.address}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-400 group-hover:text-slate-950">
                    Select ➔
                  </span>
                </button>
              </div>
            )}

            <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 bg-slate-950/40 flex items-center justify-between">
              <span>Singapore Hubs & Postal Locations</span>
              <span className="text-[10px] text-emerald-400 font-normal">Supports 6-Digit S(XXXXXX)</span>
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
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-all">
                            {dest.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 text-[10px] font-mono border border-slate-700">
                            📮 S({dest.postalCode})
                          </span>
                        </div>
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
                  type="button"
                  onClick={() =>
                    handleSelect(
                      postalResult
                        ? postalResult.destinationObj
                        : {
                            id: `custom-${Date.now()}`,
                            name: cleanQuery,
                            category: 'shopping',
                            address: `${cleanQuery}, Singapore`,
                            postalCode: extractPostalCode(cleanQuery) || '000000',
                            latitude: 1.2935,
                            longitude: 103.8572,
                            popularCarparkIds: [],
                          }
                    )
                  }
                  className="w-full px-4 py-3 text-left hover:bg-slate-800 text-xs text-emerald-400 font-semibold flex items-center justify-between"
                >
                  <span>🔍 Search location/postal "{cleanQuery}" in Singapore</span>
                  <span className="text-[10px] text-slate-400">Tap to load</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Destination & Postal Code Chips Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[11px] font-bold text-slate-400 flex-shrink-0 mr-1">
          Quick Hubs:
        </span>
        {POPULAR_DESTINATIONS.map((dest) => {
          const isCurrent = currentDestination.name === dest.name;
          return (
            <button
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1 ${
                isCurrent
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm scale-105'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-slate-500 hover:text-white'
              }`}
            >
              <span>{dest.name.split('/')[0]}</span>
              <span className={`text-[10px] font-mono ${isCurrent ? 'text-slate-950 font-bold' : 'text-slate-400'}`}>
                ({dest.postalCode})
              </span>
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
