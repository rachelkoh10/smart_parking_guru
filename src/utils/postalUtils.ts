/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination, Carpark } from '../types';
import { POPULAR_DESTINATIONS } from './geoUtils';
import { INITIAL_SINGAPORE_CARPARKS } from '../data/singaporeCarparks';

export interface PostalSearchResult {
  postalCode: string;
  matchedType: 'exact_destination' | 'exact_carpark' | 'sector_lookup';
  title: string;
  address: string;
  districtName: string;
  latitude: number;
  longitude: number;
  destinationObj: Destination;
}

// Map of Singapore 2-digit postal sectors to District & approximate center coordinates
export const SINGAPORE_POSTAL_SECTORS: Record<string, { district: string; name: string; lat: number; lng: number }> = {
  '01': { district: 'D01', name: 'Raffles Place, Cecil, Marina', lat: 1.2842, lng: 103.8522 },
  '02': { district: 'D01', name: 'Marina Boulevard, Tanjong Pagar', lat: 1.2785, lng: 103.8530 },
  '03': { district: 'D01', name: 'Anson Road, Tanjong Pagar', lat: 1.2745, lng: 103.8472 },
  '04': { district: 'D01', name: 'Telok Ayer, Chinatown', lat: 1.2820, lng: 103.8480 },
  '05': { district: 'D01', name: 'Marina South', lat: 1.2720, lng: 103.8630 },
  '06': { district: 'D01', name: 'High Street, Beach Road', lat: 1.2915, lng: 103.8510 },
  '07': { district: 'D02', name: 'Anson, Tanjong Pagar', lat: 1.2760, lng: 103.8440 },
  '08': { district: 'D02', name: 'Chinatown, Duxton', lat: 1.2790, lng: 103.8420 },
  '09': { district: 'D04', name: 'HarbourFront, Telok Blangah', lat: 1.2642, lng: 103.8223 },
  '10': { district: 'D04', name: 'Keppel Bay, Mount Faber', lat: 1.2690, lng: 103.8170 },
  '11': { district: 'D05', name: 'Pasir Panjang, Kent Ridge', lat: 1.2880, lng: 103.7820 },
  '12': { district: 'D05', name: 'Clementi New Town', lat: 1.3120, lng: 103.7650 },
  '13': { district: 'D05', name: 'West Coast, Buona Vista', lat: 1.2980, lng: 103.7720 },
  '14': { district: 'D03', name: 'Queenstown, Dawson', lat: 1.2940, lng: 103.8060 },
  '15': { district: 'D03', name: 'Alexandra, Bukit Merah', lat: 1.2830, lng: 103.8180 },
  '16': { district: 'D03', name: 'Tiong Bahru', lat: 1.2860, lng: 103.8270 },
  '17': { district: 'D06', name: 'City Hall, North Bridge Road', lat: 1.2925, lng: 103.8520 },
  '18': { district: 'D07', name: 'Bugis, Middle Road', lat: 1.2995, lng: 103.8550 },
  '19': { district: 'D07', name: 'Bencoolen, Rochor', lat: 1.3020, lng: 103.8510 },
  '20': { district: 'D08', name: 'Little India, Serangoon Rd', lat: 1.3090, lng: 103.8530 },
  '21': { district: 'D08', name: 'Farrer Park, Race Course', lat: 1.3130, lng: 103.8560 },
  '22': { district: 'D09', name: 'Orchard, Cairnhill', lat: 1.3038, lng: 103.8350 },
  '23': { district: 'D09', name: 'Orchard, Somerset, River Valley', lat: 1.3015, lng: 103.8380 },
  '24': { district: 'D10', name: 'Tanglin, Nassim Road', lat: 1.3060, lng: 103.8230 },
  '25': { district: 'D10', name: 'Grange Road, Orchard West', lat: 1.3020, lng: 103.8280 },
  '26': { district: 'D10', name: 'Upper Bukit Timah, Farrer Rd', lat: 1.3180, lng: 103.8080 },
  '27': { district: 'D10', name: 'Holland Village, Tanglin Halt', lat: 1.3110, lng: 103.7960 },
  '28': { district: 'D11', name: 'Watten, Dunearn Road', lat: 1.3260, lng: 103.8120 },
  '29': { district: 'D11', name: 'Novena, Thomson', lat: 1.3190, lng: 103.8430 },
  '30': { district: 'D11', name: 'Newton, Moulmein', lat: 1.3140, lng: 103.8380 },
  '31': { district: 'D12', name: 'Toa Payoh Central', lat: 1.3320, lng: 103.8500 },
  '32': { district: 'D12', name: 'Balestier, Whampoa', lat: 1.3240, lng: 103.8560 },
  '33': { district: 'D12', name: 'Serangoon Road, Bendemeer', lat: 1.3180, lng: 103.8620 },
  '34': { district: 'D13', name: 'MacPherson, Braddell', lat: 1.3360, lng: 103.8680 },
  '35': { district: 'D13', name: 'Potong Pasir, Sennett', lat: 1.3320, lng: 103.8690 },
  '36': { district: 'D13', name: 'MacPherson, Circuit Rd', lat: 1.3260, lng: 103.8860 },
  '37': { district: 'D13', name: 'Paya Lebar, Ubi', lat: 1.3320, lng: 103.8920 },
  '38': { district: 'D14', name: 'Geylang, Lorong 1-22', lat: 1.3120, lng: 103.8810 },
  '39': { district: 'D14', name: 'Geylang, Lorong 23-44', lat: 1.3150, lng: 103.8900 },
  '40': { district: 'D14', name: 'Eunos, Paya Lebar', lat: 1.3190, lng: 103.8980 },
  '41': { district: 'D14', name: 'Kembangan, Changi Road', lat: 1.3210, lng: 103.9120 },
  '42': { district: 'D15', name: 'Joo Chiat, Katong', lat: 1.3080, lng: 103.9030 },
  '43': { district: 'D15', name: 'Marine Parade, East Coast', lat: 1.3020, lng: 103.9050 },
  '44': { district: 'D15', name: 'Telok Kurau, Siglap', lat: 1.3120, lng: 103.9180 },
  '45': { district: 'D15', name: 'Frankel Estate, Siglap', lat: 1.3160, lng: 103.9240 },
  '46': { district: 'D16', name: 'Bedok Central, Chai Chee', lat: 1.3240, lng: 103.9300 },
  '47': { district: 'D16', name: 'Bedok Reservoir, Tanah Merah', lat: 1.3310, lng: 103.9400 },
  '48': { district: 'D16', name: 'Upper East Coast, Kew Drive', lat: 1.3180, lng: 103.9480 },
  '49': { district: 'D17', name: 'Loyang, Changi Village', lat: 1.3850, lng: 103.9880 },
  '50': { district: 'D17', name: 'Changi Airport, Flora Road', lat: 1.3580, lng: 103.9880 },
  '51': { district: 'D18', name: 'Pasir Ris Central', lat: 1.3720, lng: 103.9490 },
  '52': { district: 'D18', name: 'Tampines Central & Regional', lat: 1.3528, lng: 103.9447 },
  '53': { district: 'D19', name: 'Serangoon Central, Kovan', lat: 1.3500, lng: 103.8720 },
  '54': { district: 'D19', name: 'Hougang Central, Buangkok', lat: 1.3720, lng: 103.8880 },
  '55': { district: 'D19', name: 'Punggol, Compassvale', lat: 1.3980, lng: 103.9050 },
  '56': { district: 'D20', name: 'Bishan, Marymount', lat: 1.3510, lng: 103.8480 },
  '57': { district: 'D20', name: 'Ang Mo Kio Central', lat: 1.3690, lng: 103.8480 },
  '58': { district: 'D21', name: 'Upper Bukit Timah, Beauty World', lat: 1.3410, lng: 103.7760 },
  '59': { district: 'D21', name: 'Clementi Park, Hillview', lat: 1.3520, lng: 103.7680 },
  '60': { district: 'D22', name: 'Jurong East Central', lat: 1.3331, lng: 103.7431 },
  '61': { district: 'D22', name: 'Jurong West, Lakeside', lat: 1.3420, lng: 103.7220 },
  '62': { district: 'D22', name: 'Boon Lay, Jurong Industrial', lat: 1.3280, lng: 103.7080 },
  '63': { district: 'D22', name: 'Pioneer, Tuas', lat: 1.3150, lng: 103.6800 },
  '64': { district: 'D22', name: 'Tuas South', lat: 1.2850, lng: 103.6350 },
  '65': { district: 'D23', name: 'Hillview, Dairy Farm', lat: 1.3620, lng: 103.7660 },
  '66': { district: 'D23', name: 'Bukit Batok Central', lat: 1.3480, lng: 103.7500 },
  '67': { district: 'D23', name: 'Bukit Panjang Central', lat: 1.3780, lng: 103.7620 },
  '68': { district: 'D23', name: 'Choa Chu Kang Central', lat: 1.3850, lng: 103.7440 },
  '69': { district: 'D24', name: 'Tengah, Lim Chu Kang', lat: 1.3850, lng: 103.7200 },
  '70': { district: 'D24', name: 'Sungei Kadut', lat: 1.4150, lng: 103.7480 },
  '71': { district: 'D24', name: 'Kranji West', lat: 1.4250, lng: 103.7250 },
  '72': { district: 'D25', name: 'Kranji, Turf Club', lat: 1.4250, lng: 103.7620 },
  '73': { district: 'D25', name: 'Woodlands Central', lat: 1.4350, lng: 103.7860 },
  '75': { district: 'D27', name: 'Yishun Central, Canberra', lat: 1.4280, lng: 103.8350 },
  '76': { district: 'D27', name: 'Sembawang Central', lat: 1.4480, lng: 103.8200 },
  '77': { district: 'D26', name: 'Upper Thomson, Springleaf', lat: 1.3900, lng: 103.8200 },
  '78': { district: 'D26', name: 'Mandai, Lower Seletar', lat: 1.4050, lng: 103.8120 },
  '79': { district: 'D28', name: 'Seletar, Jalan Kayu', lat: 1.4100, lng: 103.8700 },
  '80': { district: 'D28', name: 'Sengkang West, Anchorvale', lat: 1.3920, lng: 103.8820 },
};

/**
 * Clean user search input to check if it contains a 6-digit postal code format.
 */
export function extractPostalCode(input: string): string | null {
  const digitsOnly = input.replace(/\D/g, '');
  if (digitsOnly.length === 6) {
    return digitsOnly;
  }
  const match = input.match(/\b\d{6}\b/);
  return match ? match[0] : null;
}

/**
 * Searches and constructs a rich PostalSearchResult for any postal code input.
 */
export function lookupPostalCode(rawInput: string): PostalSearchResult | null {
  const postalCode = extractPostalCode(rawInput);
  if (!postalCode) return null;

  // 1. Check direct match in POPULAR_DESTINATIONS
  const matchedDest = POPULAR_DESTINATIONS.find((d) => d.postalCode === postalCode);
  if (matchedDest) {
    return {
      postalCode,
      matchedType: 'exact_destination',
      title: `${matchedDest.name} (Postal: S${postalCode})`,
      address: matchedDest.address,
      districtName: matchedDest.name,
      latitude: matchedDest.latitude,
      longitude: matchedDest.longitude,
      destinationObj: matchedDest,
    };
  }

  // 2. Check direct match in INITIAL_SINGAPORE_CARPARKS
  const matchedCarpark = INITIAL_SINGAPORE_CARPARKS.find((c) => c.postalCode === postalCode);
  if (matchedCarpark) {
    return {
      postalCode,
      matchedType: 'exact_carpark',
      title: `${matchedCarpark.name} (Postal: S${postalCode})`,
      address: matchedCarpark.address,
      districtName: matchedCarpark.name,
      latitude: matchedCarpark.latitude,
      longitude: matchedCarpark.longitude,
      destinationObj: {
        id: `dest-postal-${postalCode}`,
        name: `${matchedCarpark.name} (S${postalCode})`,
        category: 'shopping',
        address: matchedCarpark.address,
        postalCode: postalCode,
        latitude: matchedCarpark.latitude,
        longitude: matchedCarpark.longitude,
        popularCarparkIds: [matchedCarpark.id],
      },
    };
  }

  // 3. Fallback to Singapore Postal Sector lookup (First 2 Digits)
  const prefix = postalCode.substring(0, 2);
  const sector = SINGAPORE_POSTAL_SECTORS[prefix] || {
    district: 'D01',
    name: 'Singapore Central Region',
    lat: 1.2935,
    lng: 103.8572,
  };

  return {
    postalCode,
    matchedType: 'sector_lookup',
    title: `Postal S${postalCode} (${sector.district} - ${sector.name})`,
    address: `Postal Code ${postalCode}, ${sector.name}, Singapore`,
    districtName: sector.name,
    latitude: sector.lat,
    longitude: sector.lng,
    destinationObj: {
      id: `dest-postal-${postalCode}`,
      name: `Postal S${postalCode} (${sector.district})`,
      category: 'attraction',
      address: `Postal Code ${postalCode}, ${sector.name}, Singapore`,
      postalCode: postalCode,
      latitude: sector.lat,
      longitude: sector.lng,
      popularCarparkIds: [],
    },
  };
}
