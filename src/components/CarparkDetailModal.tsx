/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Carpark, VehicleType } from '../types';
import {
  X,
  Navigation,
  Utensils,
  Clock,
  Car,
  Bike,
  Truck,
  ShieldCheck,
  TrendingUp,
  Heart,
  Calendar,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { calculateEstimatedParkingCost } from '../utils/rateCalculator';

interface CarparkDetailModalProps {
  carpark: Carpark | null;
  onClose: () => void;
  onOpenNavigate: (cp: Carpark) => void;
  onOpenDeals: (cp: Carpark) => void;
  onOpenHistoricalTrend: (cp: Carpark) => void;
  isSaved: boolean;
  onToggleSave: (cp: Carpark) => void;
}

export const CarparkDetailModal: React.FC<CarparkDetailModalProps> = ({
  carpark,
  onClose,
  onOpenNavigate,
  onOpenDeals,
  onOpenHistoricalTrend,
  isSaved,
  onToggleSave,
}) => {
  if (!carpark) return null;

  const [customDurationMins, setCustomDurationMins] = useState(120);

  const costResult = calculateEstimatedParkingCost(
    carpark.rates,
    customDurationMins
  );

  const occupancyPercent = carpark.totalLots
    ? Math.round(((carpark.totalLots - carpark.availableLots) / carpark.totalLots) * 100)
    : 75;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white">
        {/* Header bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {carpark.operator}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Live Data Feed
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-1 leading-snug">
              {carpark.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Live Lots & Occupancy Progress */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400">Available Lots</span>
                <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
                  <span>{carpark.availableLots}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    / {carpark.totalLots || 300} total
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400">Occupancy</span>
                <div className="text-base font-extrabold text-slate-200">
                  {occupancyPercent}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-full transition-all"
                style={{ width: `${100 - occupancyPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Status: <strong className="text-emerald-400">🟢 Good Availability</strong></span>
              <span>Updated 45s ago</span>
            </div>
          </div>

          {/* Interactive Cost Calculator */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Estimated Parking Cost</span>
              </h3>
              <span className="text-xl font-black text-emerald-300">
                S${costResult.totalCost.toFixed(2)}
              </span>
            </div>

            {/* Duration Presets */}
            <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
              {[30, 60, 120, 180, 240].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setCustomDurationMins(mins)}
                  className={`py-1.5 rounded-xl border transition-all ${
                    customDurationMins === mins
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-sm'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Selected Stay: {customDurationMins >= 60 ? `${(customDurationMins / 60).toFixed(1)} hours` : `${customDurationMins} mins`}</span>
                <span>Max 12 hours</span>
              </div>
              <input
                type="range"
                min={15}
                max={720}
                step={15}
                value={customDurationMins}
                onChange={(e) => setCustomDurationMins(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              💡 <strong>Breakdown:</strong> {costResult.breakdown}
            </p>
          </div>

          {/* Rates Schedule */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Full Rates & Pricing Schedule</span>
            </h3>

            <div className="space-y-2 text-xs">
              {carpark.rates.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-emerald-400 uppercase text-[10px]">
                      {rule.dayType} ({rule.startTime} - {rule.endTime})
                    </span>
                    <p className="text-slate-200 mt-0.5">{rule.description}</p>
                  </div>
                  {rule.gracePeriodMins && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold whitespace-nowrap">
                      {rule.gracePeriodMins}m Grace
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Specs & Restrictions */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Height Limit</span>
              <span className="font-bold text-slate-200">
                📐 {carpark.heightRestriction ? `${carpark.heightRestriction}m Clearance` : 'No Height Limit'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Operating Hours</span>
              <span className="font-bold text-slate-200">
                🕒 {carpark.operatingHours || '24 Hours'}
              </span>
            </div>
          </div>

          {/* Vehicle Support Pills */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-[11px] font-bold text-slate-400">Supported:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-slate-700 flex items-center gap-1 font-bold">
                <Car className="w-3.5 h-3.5" /> Cars
              </span>
              <span className="px-2 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-slate-700 flex items-center gap-1 font-bold">
                <Bike className="w-3.5 h-3.5" /> Motorcycles
              </span>
            </div>
          </div>

          {/* Historical Trend Button */}
          <button
            onClick={() => onOpenHistoricalTrend(carpark)}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Check Pre-Trip Historical Availability Trend</span>
            </div>
            <span className="text-emerald-400 font-bold">View Graph →</span>
          </button>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <button
            onClick={() => onToggleSave(carpark)}
            className={`p-3 rounded-2xl border transition-all ${
              isSaved
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500' : ''}`} />
          </button>

          <button
            onClick={() => onOpenDeals(carpark)}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Utensils className="w-4 h-4 text-amber-400" />
            <span>Eat Nearby</span>
          </button>

          <button
            onClick={() => onOpenNavigate(carpark)}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 fill-slate-950" />
            <span>Navigate Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
