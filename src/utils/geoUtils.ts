/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Haversine formula to compute distance in kilometers between two lat/lng coordinates
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

// Estimate driving duration in minutes based on distance in km (avg city speed ~ 28 km/h in SG)
export function estimateDrivingMins(distanceKm: number): number {
  const speedKmH = 28;
  const mins = Math.ceil((distanceKm / speedKmH) * 60) + 1; // +1 min for parking turn-in
  return Math.max(1, mins);
}

// Estimate walking duration in minutes based on straight-line or road walking distance in meters (avg walk speed ~ 4.8 km/h)
export function estimateWalkingMins(distanceMeters: number): number {
  // Road pedestrian route is roughly 1.25x straight line
  const effectiveWalkDist = distanceMeters * 1.2;
  const mins = Math.ceil(effectiveWalkDist / 80); // ~80 meters per minute
  return Math.max(1, mins);
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}

// Default Singapore Center coordinates
export const SINGAPORE_CENTER = {
  latitude: 1.3521,
  longitude: 103.8198,
  zoom: 12,
};

// Popular Singapore Hub Destinations for 1-tap quick jump
export const POPULAR_DESTINATIONS = [
  {
    id: 'dest-mbs',
    name: 'Marina Bay Sands',
    category: 'attraction' as const,
    address: '10 Bayfront Ave, Singapore 018956',
    postalCode: '018956',
    latitude: 1.2834,
    longitude: 103.8607,
    popularCarparkIds: ['cp-mbs', 'cp-marina-square', 'cp-millenia-walk'],
  },
  {
    id: 'dest-suntec',
    name: 'Suntec City',
    category: 'shopping' as const,
    address: '3 Temasek Blvd, Singapore 038983',
    postalCode: '038983',
    latitude: 1.2935,
    longitude: 103.8572,
    popularCarparkIds: ['cp-suntec', 'cp-marina-square', 'cp-millenia-walk', 'cp-esplanade'],
  },
  {
    id: 'dest-orchard',
    name: 'ION Orchard / Orchard Rd',
    category: 'shopping' as const,
    address: '2 Orchard Turn, Singapore 238801',
    postalCode: '238801',
    latitude: 1.3040,
    longitude: 103.8320,
    popularCarparkIds: ['cp-ion-orchard', 'cp-takashimaya', 'cp-wheelock', 'cp-wisma-atria'],
  },
  {
    id: 'dest-bugis',
    name: 'Bugis Junction',
    category: 'shopping' as const,
    address: '200 Victoria St, Singapore 188021',
    postalCode: '188021',
    latitude: 1.2991,
    longitude: 103.8554,
    popularCarparkIds: ['cp-bugis-junction', 'cp-bugis-plus', 'cp-intercontinental'],
  },
  {
    id: 'dest-tampines',
    name: 'Tampines Mall & Hub',
    category: 'shopping' as const,
    address: '4 Tampines Central 5, Singapore 529510',
    postalCode: '529510',
    latitude: 1.3528,
    longitude: 103.9447,
    popularCarparkIds: ['cp-tampines-mall', 'cp-tampines-1', 'cp-our-tampines-hub'],
  },
  {
    id: 'dest-vivocity',
    name: 'VivoCity / HarbourFront',
    category: 'shopping' as const,
    address: '1 HarbourFront Walk, Singapore 098585',
    postalCode: '098585',
    latitude: 1.2642,
    longitude: 103.8223,
    popularCarparkIds: ['cp-vivocity', 'cp-harbourfront-centre', 'cp-marina-at-keppel'],
  },
  {
    id: 'dest-tanjong-pagar',
    name: 'Tanjong Pagar Centre / Guoco Tower',
    category: 'dining' as const,
    address: '1 Wallich St, Singapore 078881',
    postalCode: '078881',
    latitude: 1.2770,
    longitude: 103.8458,
    popularCarparkIds: ['cp-guoco-tower', 'cp-100am', 'cp-craig-place', 'cp-peck-seah'],
  },
  {
    id: 'dest-jurong-east',
    name: 'JEM / Westgate (Jurong East)',
    category: 'shopping' as const,
    address: '50 Jurong Gateway Rd, Singapore 608549',
    postalCode: '608549',
    latitude: 1.3331,
    longitude: 103.7431,
    popularCarparkIds: ['cp-jem', 'cp-westgate', 'cp-imm'],
  },
];
