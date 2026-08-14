/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserPreferences, VehicleType, UserPreferenceMode } from '../types';
import { User, Car, Bike, Truck, Sliders, ShieldCheck, Globe, Check, Info } from 'lucide-react';

interface ProfileViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  preferences,
  onUpdatePreferences,
}) => {
  return (
    <div className="w-full space-y-5 pb-20 text-white">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" />
          <span>Vehicle & Driver Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Customize your vehicle specifications and parking ranking algorithm
        </p>
      </div>

      {/* Primary Vehicle Selection */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
          Primary Vehicle Type
        </h3>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onUpdatePreferences({ vehicleType: 'car' })}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              preferences.vehicleType === 'car'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Car className="w-5 h-5" />
            <span className="text-xs">Car / SUV</span>
          </button>

          <button
            onClick={() => onUpdatePreferences({ vehicleType: 'motorcycle' })}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              preferences.vehicleType === 'motorcycle'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Bike className="w-5 h-5" />
            <span className="text-xs">Motorcycle</span>
          </button>

          <button
            onClick={() => onUpdatePreferences({ vehicleType: 'van' })}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              preferences.vehicleType === 'van'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span className="text-xs font-semibold">Van / Heavy</span>
          </button>
        </div>
      </div>

      {/* Vehicle Height Clearance Requirement */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
            Vehicle Height Clearance
          </h3>
          <span className="text-xs font-bold text-emerald-400">
            {preferences.heightRequirementMeters ? `${preferences.heightRequirementMeters}m` : 'Any Height'}
          </span>
        </div>

        <input
          type="range"
          min={1.8}
          max={2.5}
          step={0.1}
          value={preferences.heightRequirementMeters || 1.9}
          onChange={(e) => onUpdatePreferences({ heightRequirementMeters: Number(e.target.value) })}
          className="w-full accent-emerald-500 cursor-pointer"
        />

        <p className="text-[11px] text-slate-400">
          Carparks with multi-storey barriers lower than your required clearance will be filtered out.
        </p>
      </div>

      {/* Recommendation Engine Weighting Parameters */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Smart Ranking Algorithm Weights</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1 font-medium">
              <span>Available Lots Weight:</span>
              <span className="font-bold text-emerald-400">{Math.round((preferences.weights?.availability || 0.35) * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.80}
              step={0.05}
              value={preferences.weights?.availability || 0.35}
              onChange={(e) =>
                onUpdatePreferences({
                  weights: { ...preferences.weights, availability: Number(e.target.value) },
                })
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1 font-medium">
              <span>Parking Cost Weight:</span>
              <span className="font-bold text-emerald-400">{Math.round((preferences.weights?.price || 0.25) * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.80}
              step={0.05}
              value={preferences.weights?.price || 0.25}
              onChange={(e) =>
                onUpdatePreferences({
                  weights: { ...preferences.weights, price: Number(e.target.value) },
                })
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1 font-medium">
              <span>Walking Distance Weight:</span>
              <span className="font-bold text-emerald-400">{Math.round((preferences.weights?.walkingDistance || 0.25) * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.80}
              step={0.05}
              value={preferences.weights?.walkingDistance || 0.25}
              onChange={(e) =>
                onUpdatePreferences({
                  weights: { ...preferences.weights, walkingDistance: Number(e.target.value) },
                })
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Target Market Architecture */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Target Region</span>
        </h3>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇸🇬</span>
            <div>
              <span className="font-bold text-xs text-white block">Singapore (LTA DataMall & HDB Sync)</span>
              <span className="text-[10px] text-slate-400">Live API Feeds & Season Rates</span>
            </div>
          </div>
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
