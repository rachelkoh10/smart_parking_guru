/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Carpark } from '../types';
import { Navigation, Utensils, Info, Check, ShieldCheck, Heart } from 'lucide-react';

interface CarparkCardProps {
  carpark: Carpark;
  durationMinutes: number;
  onSelect: (cp: Carpark) => void;
  onOpenDetail: (cp: Carpark) => void;
  onOpenNavigate: (cp: Carpark) => void;
  onOpenDeals: (cp: Carpark) => void;
  isSaved: boolean;
  onToggleSave: (cp: Carpark) => void;
}

export const CarparkCard: React.FC<CarparkCardProps> = ({
  carpark,
  durationMinutes,
  onSelect,
  onOpenDetail,
  onOpenNavigate,
  onOpenDeals,
  isSaved,
  onToggleSave,
}) => {
  const isBestMatch = carpark.badge === 'BEST_MATCH';
  const isCheapest = carpark.badge === 'CHEAPEST';
  const isClosest = carpark.badge === 'CLOSEST';
  const isMostAvailable = carpark.badge === 'MOST_AVAILABLE';

  let badgeBg = 'bg-slate-800 text-slate-300 border-slate-700';
  let badgeLabel = '';

  if (isBestMatch) {
    badgeBg = 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm';
    badgeLabel = '⭐ RECOMMENDED (BEST MATCH)';
  } else if (isCheapest) {
    badgeBg = 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold';
    badgeLabel = '💰 CHEAPEST OPTION';
  } else if (isClosest) {
    badgeBg = 'bg-blue-500 text-white border-blue-400 font-extrabold';
    badgeLabel = '📍 CLOSEST WALKING';
  } else if (isMostAvailable) {
    badgeBg = 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold';
    badgeLabel = '🟢 MOST LOTS AVAILABLE';
  }

  return (
    <div
      onClick={() => onSelect(carpark)}
      className={`relative p-4 rounded-2xl bg-slate-900 border transition-all cursor-pointer shadow-lg hover:shadow-xl ${
        isBestMatch
          ? 'border-emerald-500/80 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 ring-1 ring-emerald-500/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Badge & Save Heart */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {badgeLabel ? (
          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] uppercase tracking-wider border ${badgeBg}`}>
            {badgeLabel}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">
            Operator: {carpark.operator}
          </span>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(carpark);
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-red-400 transition-all"
            title="Save Carpark"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
            {carpark.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1">{carpark.address}</p>
        </div>

        {/* Live Lot Count */}
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-black text-emerald-400 leading-none">
            {carpark.availableLots}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            / {carpark.totalLots || 300} lots
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-center">
        <div>
          <span className="text-[10px] text-slate-400 font-medium block">
            Est. Cost ({durationMinutes}m)
          </span>
          <span className="font-extrabold text-sm text-emerald-300">
            S${carpark.estimatedCost?.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-medium block">Drive Distance</span>
          <span className="font-bold text-xs text-slate-200">
            🚗 {carpark.drivingDurationMins || 4} min ({carpark.drivingDistanceKm || 0.8}km)
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-medium block">Walk to Dest</span>
          <span className="font-bold text-xs text-slate-200">
            🚶 {carpark.walkingDurationMins || 5} min ({carpark.walkingDistanceM || 350}m)
          </span>
        </div>
      </div>

      {/* Recommendation Reasons */}
      {carpark.recommendationReason && carpark.recommendationReason.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {carpark.recommendationReason.slice(0, 3).map((reason, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
            >
              {reason}
            </span>
          ))}
        </div>
      )}

      {/* CTAs */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDeals(carpark);
          }}
          className="flex-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
        >
          <Utensils className="w-3.5 h-3.5 text-amber-400" />
          <span>Eat Nearby</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(carpark);
          }}
          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenNavigate(carpark);
          }}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          <Navigation className="w-3.5 h-3.5 fill-slate-950" />
          <span>Navigate</span>
        </button>
      </div>
    </div>
  );
};
