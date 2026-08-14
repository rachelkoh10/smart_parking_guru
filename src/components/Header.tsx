/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Car, Bike, Truck, Sparkles, Navigation, Clock } from 'lucide-react';
import { VehicleType } from '../types';

interface HeaderProps {
  vehicleType: VehicleType;
  onVehicleChange: (type: VehicleType) => void;
  durationMinutes: number;
  onDurationChange: (mins: number) => void;
  onOpenAiAdvisor: () => void;
  lastUpdatedText: string;
  isLiveFeed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  vehicleType,
  onVehicleChange,
  durationMinutes,
  onDurationChange,
  onOpenAiAdvisor,
  lastUpdatedText,
  isLiveFeed,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Market */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-white">ParkPoint</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600/90 text-white tracking-wider">
                SG 🇸🇬
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isLiveFeed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {lastUpdatedText}
            </p>
          </div>
        </div>

        {/* Controls: Vehicle, Duration, AI Advisor */}
        <div className="flex items-center gap-2">
          {/* Duration selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 rounded-lg p-1 border border-slate-700/60 text-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            <select
              value={durationMinutes}
              onChange={(e) => onDurationChange(Number(e.target.value))}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value={30} className="bg-slate-900">30 mins</option>
              <option value={60} className="bg-slate-900">1 hour</option>
              <option value={120} className="bg-slate-900">2 hours</option>
              <option value={180} className="bg-slate-900">3 hours</option>
              <option value={240} className="bg-slate-900">4 hours</option>
            </select>
          </div>

          {/* Vehicle selector */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/60 text-xs">
            <button
              onClick={() => onVehicleChange('car')}
              title="Car"
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 font-medium ${
                vehicleType === 'car' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Car</span>
            </button>
            <button
              onClick={() => onVehicleChange('motorcycle')}
              title="Motorcycle"
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 font-medium ${
                vehicleType === 'motorcycle' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Bike</span>
            </button>
            <button
              onClick={() => onVehicleChange('van')}
              title="Van/Truck"
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 font-medium ${
                vehicleType === 'van' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Van</span>
            </button>
          </div>

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAiAdvisor}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-xs hover:from-violet-500 hover:to-indigo-500 transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">AI Advice</span>
          </button>
        </div>
      </div>
    </header>
  );
};
