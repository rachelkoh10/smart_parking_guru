/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RateRule } from '../types';

export function calculateEstimatedParkingCost(
  rates: RateRule[],
  durationMinutes: number,
  entryTime: Date = new Date()
): { totalCost: number; rateDescription: string; breakdown: string } {
  if (!rates || rates.length === 0) {
    return {
      totalCost: 0,
      rateDescription: 'Rate details unavailable',
      breakdown: 'Standard parking charges apply.',
    };
  }

  const dayOfWeek = entryTime.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Find matching rate rule
  let matchedRule = rates.find(
    (r) =>
      r.dayType === (isWeekend ? 'weekend' : 'weekday') ||
      r.dayType === 'all'
  );

  if (!matchedRule) {
    matchedRule = rates[0];
  }

  const gracePeriod = matchedRule.gracePeriodMins || 10;
  if (durationMinutes <= gracePeriod) {
    return {
      totalCost: 0,
      rateDescription: `${gracePeriod} mins Free Grace Period`,
      breakdown: `Exited within ${gracePeriod} minutes grace period ($0.00).`,
    };
  }

  // Flat cost rule check
  if (matchedRule.flatCost && matchedRule.flatCost > 0 && durationMinutes <= 720) {
    return {
      totalCost: matchedRule.flatCost,
      rateDescription: `Flat rate $${matchedRule.flatCost.toFixed(2)}`,
      breakdown: `Flat per-entry charge of $${matchedRule.flatCost.toFixed(2)}.`,
    };
  }

  let totalCost = 0;
  let breakdown = '';

  const firstHour = matchedRule.firstHourCost ?? (matchedRule.hourlyCost || 2.40);
  const sub30Mins = matchedRule.subsequent30MinCost ?? (firstHour / 2);

  if (durationMinutes <= 60) {
    totalCost = firstHour;
    breakdown = `First hour: $${firstHour.toFixed(2)}`;
  } else {
    const extraMinutes = durationMinutes - 60;
    const extraHalfHours = Math.ceil(extraMinutes / 30);
    const extraCost = extraHalfHours * sub30Mins;
    totalCost = firstHour + extraCost;
    breakdown = `1st hr: $${firstHour.toFixed(2)} + ${extraHalfHours} × $${sub30Mins.toFixed(2)}/30m ($${extraCost.toFixed(2)})`;
  }

  if (matchedRule.maxDailyCost && totalCost > matchedRule.maxDailyCost) {
    totalCost = matchedRule.maxDailyCost;
    breakdown += ` (Capped at daily max $${totalCost.toFixed(2)})`;
  }

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    rateDescription: matchedRule.description || `$${firstHour.toFixed(2)} 1st hr / $${sub30Mins.toFixed(2)} per 30m`,
    breakdown,
  };
}
