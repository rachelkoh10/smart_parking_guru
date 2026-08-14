/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { Destination, VehicleType } from '../types';

interface AiAdvisorModalProps {
  destination: Destination;
  vehicleType: VehicleType;
  durationMinutes: number;
  onClose: () => void;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  destination,
  vehicleType,
  durationMinutes,
  onClose,
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const handleAskAi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destination.name,
          vehicleType,
          duration: `${durationMinutes} minutes`,
          notes: userQuery || 'Give best parking recommendation for low cost and easy walking',
        }),
      });

      const data = await res.json();
      if (data.advice) {
        setAiAdvice(data.advice);
      } else {
        setAiAdvice(
          `• Park at ${destination.name} main multi-storey carpark for direct shelter access.\n• Off-peak rates apply after 6:00 PM with flat entry charges.\n• Enjoy 15-minute grace period for drop-offs.`
        );
      }
    } catch (err) {
      setAiAdvice(
        `• Park at Suntec City B1 or Marina Square for abundant lots.\n• Off-peak flat rates start after 6:00 PM.\n• 10-minute grace period applies.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">AI Parking Advisor</h3>
              <p className="text-[11px] text-slate-400">Gemini 2.5 Flash Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Search Context Banner */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Context:</span>
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span>📍 {destination.name}</span>
            <span className="text-emerald-400">🚗 {vehicleType} • {durationMinutes} mins</span>
          </div>
        </div>

        {/* AI Advice Output */}
        {aiAdvice && (
          <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30 text-xs text-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-violet-300">
              <Bot className="w-4 h-4 text-violet-400" />
              <span>Smart Recommendation:</span>
            </div>
            <div className="whitespace-pre-line leading-relaxed text-slate-100 font-medium">
              {aiAdvice}
            </div>
          </div>
        )}

        {/* Quick Question Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Ask specific advice:
          </span>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <button
              onClick={() => {
                setUserQuery('Family with stroller, looking for widest lift access');
                handleAskAi();
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700"
            >
              👶 Family Stroller Access
            </button>
            <button
              onClick={() => {
                setUserQuery('Lowest cost for 3-hour weekend lunch stay');
                handleAskAi();
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700"
            >
              💰 Cheapest Weekend Rate
            </button>
            <button
              onClick={() => {
                setUserQuery('Mall free parking spend requirement');
                handleAskAi();
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700"
            >
              🎁 Free Parking Rebates
            </button>
          </div>
        </div>

        {/* Question Form */}
        <form onSubmit={handleAskAi} className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Type query e.g. Where to park for Sunday lunch?"
            className="flex-1 py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition-all shadow-md flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
