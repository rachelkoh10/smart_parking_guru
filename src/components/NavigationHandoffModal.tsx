/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Carpark } from '../types';
import { X, Navigation, Copy, Check, ExternalLink, MapPin } from 'lucide-react';

interface NavigationHandoffModalProps {
  carpark: Carpark | null;
  onClose: () => void;
}

export const NavigationHandoffModal: React.FC<NavigationHandoffModalProps> = ({
  carpark,
  onClose,
}) => {
  if (!carpark) return null;

  const [copied, setCopied] = useState(false);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${carpark.latitude},${carpark.longitude}&destination_place_id=${encodeURIComponent(carpark.name)}`;
  const wazeUrl = `https://waze.com/ul?ll=${carpark.latitude},${carpark.longitude}&navigate=yes`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${carpark.name}, ${carpark.address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Navigation className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Start Navigation</h3>
              <p className="text-[11px] text-slate-400">Select preferred GPS application</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Carpark Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-emerald-400">{carpark.name}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              🟢 {carpark.availableLots} lots
            </span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-1">{carpark.address}</p>
        </div>

        {/* Navigation App Options */}
        <div className="space-y-2.5">
          {/* Google Maps Option */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-lg border border-blue-500/30">
                🗺️
              </div>
              <div>
                <span className="font-bold text-sm text-white block group-hover:text-blue-300 transition-all">
                  Google Maps
                </span>
                <span className="text-[11px] text-slate-400">Live traffic & turn-by-turn</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
          </a>

          {/* Waze Option */}
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-black text-lg border border-cyan-500/30">
                🚘
              </div>
              <div>
                <span className="font-bold text-sm text-white block group-hover:text-cyan-300 transition-all">
                  Waze
                </span>
                <span className="text-[11px] text-slate-400">Community speed & hazard alerts</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
          </a>
        </div>

        {/* Copy Address Alternative */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={handleCopyAddress}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-800 transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Address Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Full Address & Postal Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
