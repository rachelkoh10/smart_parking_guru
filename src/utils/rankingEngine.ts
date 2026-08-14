/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Carpark, UserPreferenceMode, UserPreferences } from '../types';
import { calculateDistanceKm, estimateDrivingMins, estimateWalkingMins } from './geoUtils';
import { calculateEstimatedParkingCost } from './rateCalculator';

export interface ScoreWeights {
  availability: number;
  price: number;
  walkingDistance: number;
  drivingDistance: number;
}

export function getPresetWeights(mode: UserPreferenceMode): ScoreWeights {
  switch (mode) {
    case 'cheapest':
      return { availability: 0.20, price: 0.60, walkingDistance: 0.10, drivingDistance: 0.10 };
    case 'closest':
      return { availability: 0.20, price: 0.10, walkingDistance: 0.60, drivingDistance: 0.10 };
    case 'available':
      return { availability: 0.65, price: 0.10, walkingDistance: 0.15, drivingDistance: 0.10 };
    case 'overall':
    default:
      return { availability: 0.35, price: 0.25, walkingDistance: 0.25, drivingDistance: 0.15 };
  }
}

export function rankCarparks(
  carparks: Carpark[],
  destinationLat: number,
  destinationLon: number,
  originLat: number,
  originLon: number,
  userPrefs: UserPreferences
): Carpark[] {
  if (!carparks || carparks.length === 0) return [];

  const weights = userPrefs.weights || getPresetWeights(userPrefs.primaryPreference);

  // Filter vehicle type and height limits
  const filtered = carparks.filter((cp) => {
    if (cp.vehicleTypes && !cp.vehicleTypes.includes(userPrefs.vehicleType)) {
      return false;
    }
    if (
      userPrefs.heightRequirementMeters &&
      cp.heightRestriction &&
      cp.heightRestriction < userPrefs.heightRequirementMeters
    ) {
      return false;
    }
    return true;
  });

  const listToProcess = filtered.length > 0 ? filtered : carparks;

  // Process computed distances and costs first
  const processed: Carpark[] = listToProcess.map((cp) => {
    // Distance from user origin to carpark
    const drivingKm = calculateDistanceKm(originLat, originLon, cp.latitude, cp.longitude);
    const drivingMins = estimateDrivingMins(drivingKm);

    // Distance from carpark to destination
    const walkKm = calculateDistanceKm(cp.latitude, cp.longitude, destinationLat, destinationLon);
    const walkMeters = Math.round(walkKm * 1000);
    const walkMins = estimateWalkingMins(walkMeters);

    // Cost estimation
    const { totalCost } = calculateEstimatedParkingCost(
      cp.rates,
      userPrefs.durationMinutes || 120
    );

    return {
      ...cp,
      drivingDistanceKm: drivingKm,
      drivingDurationMins: drivingMins,
      walkingDistanceM: walkMeters,
      walkingDurationMins: walkMins,
      estimatedCost: totalCost,
    };
  });

  // Calculate score ranges for normalization
  const maxLots = Math.max(...processed.map((c) => c.availableLots), 1);
  const minCost = Math.min(...processed.map((c) => c.estimatedCost || 0));
  const maxCost = Math.max(...processed.map((c) => c.estimatedCost || 1), minCost + 1);
  const minWalkM = Math.min(...processed.map((c) => c.walkingDistanceM || 0));
  const maxWalkM = Math.max(...processed.map((c) => c.walkingDistanceM || 1000), minWalkM + 1);
  const minDriveKm = Math.min(...processed.map((c) => c.drivingDistanceKm || 0));
  const maxDriveKm = Math.max(...processed.map((c) => c.drivingDistanceKm || 5), minDriveKm + 0.1);

  const scored: Carpark[] = processed.map((cp) => {
    // 1. Availability Score (0 to 100)
    let availabilityScore = 0;
    if (cp.availableLots > 0) {
      const ratio = cp.availableLots / (cp.totalLots || 300);
      availabilityScore = Math.min(100, Math.round((cp.availableLots / maxLots) * 60 + ratio * 40));
    } else {
      availabilityScore = 0; // Full
    }

    // 2. Price Score (0 to 100, lower cost is better)
    const costRange = maxCost - minCost || 1;
    const priceScore = Math.max(0, Math.min(100, Math.round(100 - (((cp.estimatedCost || 0) - minCost) / costRange) * 100)));

    // 3. Walking Distance Score (0 to 100, lower distance is better)
    const walkRange = maxWalkM - minWalkM || 1;
    const walkingScore = Math.max(0, Math.min(100, Math.round(100 - (((cp.walkingDistanceM || 0) - minWalkM) / walkRange) * 100)));

    // 4. Driving Distance Score (0 to 100, lower distance is better)
    const driveRange = maxDriveKm - minDriveKm || 1;
    const drivingScore = Math.max(0, Math.min(100, Math.round(100 - (((cp.drivingDistanceKm || 0) - minDriveKm) / driveRange) * 100)));

    // Composite Score
    const finalScore = Math.round(
      availabilityScore * weights.availability +
      priceScore * weights.price +
      walkingScore * weights.walkingDistance +
      drivingScore * weights.drivingDistance
    );

    // Reasons
    const reasons: string[] = [];
    if (cp.availableLots > 50) {
      reasons.push(`🟢 ${cp.availableLots} lots available`);
    } else if (cp.availableLots > 0) {
      reasons.push(`🟡 ${cp.availableLots} lots remaining`);
    } else {
      reasons.push(`🔴 Carpark full`);
    }

    if (cp.walkingDurationMins! <= 5) {
      reasons.push(`🚶 Only ${cp.walkingDurationMins} min walk to destination`);
    } else {
      reasons.push(`🚶 ${cp.walkingDurationMins} min walk`);
    }

    reasons.push(`💰 S$${cp.estimatedCost?.toFixed(2)} estimated for ${userPrefs.durationMinutes || 120} mins`);

    if (cp.heightRestriction) {
      reasons.push(`📐 Max height ${cp.heightRestriction}m`);
    }

    return {
      ...cp,
      rankingScore: finalScore,
      recommendationReason: reasons,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));

  // Assign Badges
  if (scored.length > 0) {
    scored[0].badge = 'BEST_MATCH';
  }

  // Find cheapest
  let cheapestIndex = 0;
  for (let i = 1; i < scored.length; i++) {
    if ((scored[i].estimatedCost || 999) < (scored[cheapestIndex].estimatedCost || 999)) {
      cheapestIndex = i;
    }
  }
  if (cheapestIndex !== 0) {
    scored[cheapestIndex].badge = 'CHEAPEST';
  }

  // Find closest walking
  let closestIndex = 0;
  for (let i = 1; i < scored.length; i++) {
    if ((scored[i].walkingDistanceM || 9999) < (scored[closestIndex].walkingDistanceM || 9999)) {
      closestIndex = i;
    }
  }
  if (closestIndex !== 0 && !scored[closestIndex].badge) {
    scored[closestIndex].badge = 'CLOSEST';
  }

  // Find most available
  let availableIndex = 0;
  for (let i = 1; i < scored.length; i++) {
    if ((scored[i].availableLots || 0) > (scored[availableIndex].availableLots || 0)) {
      availableIndex = i;
    }
  }
  if (availableIndex !== 0 && !scored[availableIndex].badge) {
    scored[availableIndex].badge = 'MOST_AVAILABLE';
  }

  return scored;
}
