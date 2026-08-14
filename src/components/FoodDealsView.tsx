/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Carpark, Merchant, Promotion } from '../types';
import { SINGAPORE_MERCHANTS, SINGAPORE_PROMOTIONS } from '../data/singaporeMerchants';
import { Utensils, Star, Gift, Copy, Check, Clock, ExternalLink, Tag, Sparkles, Navigation } from 'lucide-react';

interface FoodDealsViewProps {
  selectedCarpark: Carpark | null;
  onSelectCarparkForDeals?: (carparkId: string) => void;
}

export const FoodDealsView: React.FC<FoodDealsViewProps> = ({ selectedCarpark }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'f_and_b' | 'free_parking' | 'sponsored'>('all');
  const [copiedPromoCode, setCopiedPromoCode] = useState<string | null>(null);

  // Filter promotions
  const filteredPromos = SINGAPORE_PROMOTIONS.filter((p) => {
    if (selectedCarpark && p.carparkId && p.carparkId !== selectedCarpark.id) {
      // If a specific carpark is selected, prioritize matching carpark promotions
      return true; // show all or rank matched higher
    }
    if (activeFilter === 'f_and_b') return p.type === 'f_and_b';
    if (activeFilter === 'free_parking') return p.type === 'free_parking' || p.type === 'mall_rebate';
    if (activeFilter === 'sponsored') return p.isSponsored;
    return true;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPromoCode(code);
    setTimeout(() => setCopiedPromoCode(null), 2000);
  };

  return (
    <div className="w-full space-y-4 pb-20">
      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-xl flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Eat Near Your Carpark</span>
          </div>
          <h2 className="text-xl font-black tracking-tight mt-0.5">
            🍜 F&B Specials & Free Parking
          </h2>
          <p className="text-xs text-amber-100/90 mt-1">
            {selectedCarpark
              ? `Showing dining offers near ${selectedCarpark.name}`
              : 'Show your parking receipt to claim exclusive F&B lunch deals'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border ${
            activeFilter === 'all'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          All Offers
        </button>

        <button
          onClick={() => setActiveFilter('f_and_b')}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border ${
            activeFilter === 'f_and_b'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          🍜 Lunch & Dinner Deals
        </button>

        <button
          onClick={() => setActiveFilter('free_parking')}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border ${
            activeFilter === 'free_parking'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          🎁 Free Parking Rebates
        </button>

        <button
          onClick={() => setActiveFilter('sponsored')}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border ${
            activeFilter === 'sponsored'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          ⭐ Sponsored
        </button>
      </div>

      {/* Promotions & Deals Cards List */}
      <div className="space-y-3">
        {filteredPromos.map((promo) => {
          const matchingMerchant = SINGAPORE_MERCHANTS.find((m) => m.id === promo.merchantId);
          return (
            <div
              key={promo.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {promo.isSponsored && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase">
                        Sponsored
                      </span>
                    )}
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      📍 {promo.carparkName || 'Near Selected Carpark'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-white leading-snug">
                    {promo.title}
                  </h3>

                  {matchingMerchant && (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="font-bold text-amber-400">{matchingMerchant.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-300">
                        <Star className="w-3 h-3 fill-amber-300" /> {matchingMerchant.rating}
                      </span>
                      <span>•</span>
                      <span>🚶 {matchingMerchant.walkingMinsFromCarpark} min walk</span>
                    </div>
                  )}
                </div>

                {promo.discountAmount && (
                  <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase flex-shrink-0">
                    {promo.discountAmount}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {promo.description}
              </p>

              {/* Promo Code & Claim CTA */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{promo.validHours}</span>
                </div>

                {promo.promoCode ? (
                  <button
                    onClick={() => handleCopyCode(promo.promoCode!)}
                    className="py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    {copiedPromoCode === promo.promoCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <Tag className="w-3.5 h-3.5" />
                        <span>Code: {promo.promoCode}</span>
                        <Copy className="w-3 h-3 ml-1" />
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400">
                    Show Parking Receipt
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured F&B Merchant Showcase Grid */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
          <Utensils className="w-4 h-4 text-amber-400" />
          <span>Popular Dining Near Carparks</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SINGAPORE_MERCHANTS.map((merchant) => (
            <div
              key={merchant.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex gap-3 items-center shadow-md hover:border-slate-700 transition-all"
            >
              <img
                src={merchant.image}
                alt={merchant.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-800 flex-shrink-0"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-white line-clamp-1">{merchant.name}</h4>
                <p className="text-[11px] text-slate-400">{merchant.cuisine} • {merchant.priceBand}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                  <span className="text-amber-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" /> {merchant.rating}
                  </span>
                  <span>🚶 {merchant.walkingMinsFromCarpark} min walk</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
