/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Carpark } from '../types';
import { HISTORICAL_TRENDS } from '../data/singaporeMerchants';
import { X, TrendingUp, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface PreTripCheckerModalProps {
  carpark: Carpark | null;
  onClose: () => void;
}

export const PreTripCheckerModal: React.FC<PreTripCheckerModalProps> = ({
  carpark,
  onClose,
}) => {
  if (!carpark) return null;

  const trends = HISTORICAL_TRENDS[carpark.id] || [
    { timeSlot: '08:00 AM', predictedOccupancy: 30, status: 'HIGH' },
    { timeSlot: '10:00 AM', predictedOccupancy: 55, status: 'MEDIUM' },
    { timeSlot: '12:30 PM', predictedOccupancy: 85, status: 'LOW' },
    { timeSlot: '03:00 PM', predictedOccupancy: 70, status: 'MEDIUM' },
    { timeSlot: '06:30 PM', predictedOccupancy: 80, status: 'LOW' },
    { timeSlot: '09:00 PM', predictedOccupancy: 45, status: 'HIGH' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Pre-Trip Availability Forecast</h3>
              <p className="text-[11px] text-slate-400">Historical occupancy patterns</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Carpark Info */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-white">{carpark.name}</h4>
            <span className="text-[11px] text-slate-400">Current status: 🟢 {carpark.availableLots} lots available</span>
          </div>
          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
            Live SG Feed
          </span>
        </div>

        {/* Historical Graph Bars */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Typical Occupancy by Time of Day</span>
          </h4>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            {trends.map((t, idx) => {
              let barColor = 'bg-emerald-500';
              if (t.predictedOccupancy > 80) barColor = 'bg-red-500';
              else if (t.predictedOccupancy > 60) barColor = 'bg-amber-500';

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>{t.timeSlot}</span>
                    <span className="font-bold">{t.predictedOccupancy}% Filled</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all`}
                      style={{ width: `${t.predictedOccupancy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendation tip */}
        <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Pro Driver Tip:</strong> Peak parking demand around this location occurs between <strong>12:00 PM - 2:00 PM</strong>. Arrive before 11:30 AM or after 2:30 PM for effortless parking.
          </p>
        </div>
      </div>
    </div>
  );
};
