/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VehicleType = 'car' | 'motorcycle' | 'van';

export type AvailabilityStatus = 'HIGH' | 'MEDIUM' | 'LOW' | 'FULL' | 'UNKNOWN';

export type UserPreferenceMode = 'overall' | 'cheapest' | 'closest' | 'available';

export interface RateRule {
  dayType: 'weekday' | 'weekend' | 'public_holiday' | 'all';
  startTime: string; // "07:00"
  endTime: string;   // "17:00"
  firstHourCost?: number;
  subsequent30MinCost?: number;
  hourlyCost?: number;
  flatCost?: number;
  gracePeriodMins?: number;
  maxDailyCost?: number;
  description: string;
}

export interface Carpark {
  id: string;
  name: string;
  operator: string; // "HDB" | "URA" | "LTA" | "Suntec City" | "CapitaLand" | "CDL" | "Wilson" etc.
  address: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  vehicleTypes: VehicleType[];
  totalLots: number;
  availableLots: number;
  availabilityStatus: AvailabilityStatus;
  rates: RateRule[];
  operatingHours: string;
  heightRestriction?: number; // in meters e.g. 2.1
  dataSource: 'LTA_DATAMALL' | 'DATA_GOV_SG' | 'OPERATOR_DIRECT' | 'DEMO_CACHE';
  lastUpdated: string; // ISO string or relative time
  isStale?: boolean;
  
  // Computed fields (per destination query)
  drivingDistanceKm?: number;
  drivingDurationMins?: number;
  walkingDistanceM?: number;
  walkingDurationMins?: number;
  estimatedCost?: number;
  rankingScore?: number;
  recommendationReason?: string[];
  badge?: 'BEST_MATCH' | 'CHEAPEST' | 'CLOSEST' | 'MOST_AVAILABLE';
}

export interface ParkingAvailability {
  carparkId: string;
  vehicleType: VehicleType;
  totalLots: number;
  availableLots: number;
  occupancyPercentage: number;
  status: AvailabilityStatus;
  timestamp: string;
  source: string;
}

export interface Merchant {
  id: string;
  name: string;
  category: 'restaurant' | 'cafe' | 'food_court' | 'hawker' | 'bar';
  carparkId: string; // Primary associated carpark
  carparkName: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  priceBand: '$' | '$$' | '$$$' | '$$$$';
  cuisine: string;
  image: string;
  openingHours: string;
  walkingMinsFromCarpark: number;
}

export interface Promotion {
  id: string;
  merchantId?: string;
  merchantName?: string;
  carparkId?: string;
  carparkName?: string;
  title: string;
  description: string;
  type: 'f_and_b' | 'free_parking' | 'mall_rebate';
  discountAmount?: string;
  minimumSpend?: number;
  promoCode?: string;
  startDate: string;
  endDate: string;
  validHours: string;
  terms: string[];
  isSponsored?: boolean;
  image?: string;
}

export interface Destination {
  id: string;
  name: string;
  category: 'shopping' | 'attraction' | 'office' | 'dining' | 'transport' | 'residential';
  address: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  popularCarparkIds: string[];
}

export interface UserPreferences {
  vehicleType: VehicleType;
  primaryPreference: UserPreferenceMode;
  maxWalkingMinutes: number;
  heightRequirementMeters?: number;
  durationMinutes: number;
  weights: {
    availability: number;
    price: number;
    walkingDistance: number;
    drivingDistance: number;
  };
}

export interface SavedLocation {
  id: string;
  label: 'Home' | 'Work' | 'Favorite' | 'Custom';
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  destinationName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface HistoricalTrend {
  timeSlot: string; // "10:00 AM", "12:30 PM", "03:00 PM", "06:30 PM", "09:00 PM"
  predictedOccupancy: number; // 0-100%
  status: AvailabilityStatus;
}
