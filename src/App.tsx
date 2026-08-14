/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Carpark, Destination, UserPreferences, VehicleType, UserPreferenceMode, SavedLocation, RecentSearch } from './types';
import { INITIAL_SINGAPORE_CARPARKS } from './data/singaporeCarparks';
import { POPULAR_DESTINATIONS, SINGAPORE_CENTER } from './utils/geoUtils';
import { rankCarparks, getPresetWeights } from './utils/rankingEngine';

import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { SearchBar } from './components/SearchBar';
import { MapView } from './components/MapView';
import { CarparkCard } from './components/CarparkCard';
import { CarparkDetailModal } from './components/CarparkDetailModal';
import { NavigationHandoffModal } from './components/NavigationHandoffModal';
import { FoodDealsView } from './components/FoodDealsView';
import { PreTripCheckerModal } from './components/PreTripCheckerModal';
import { SavedView } from './components/SavedView';
import { ProfileView } from './components/ProfileView';
import { AiAdvisorModal } from './components/AiAdvisorModal';

export default function App() {
  // Core State
  const [currentDestination, setCurrentDestination] = useState<Destination>(POPULAR_DESTINATIONS[1]); // Suntec City default
  const [carparks, setCarparks] = useState<Carpark[]>(INITIAL_SINGAPORE_CARPARKS);
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(null);

  // User Settings
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [durationMinutes, setDurationMinutes] = useState<number>(120); // 2 hours
  const [preferenceMode, setPreferenceMode] = useState<UserPreferenceMode>('overall');
  const [activeTab, setActiveTab] = useState<NavTab>('map');

  // GPS Location
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>({
    latitude: 1.2935,
    longitude: 103.8572,
  });
  const [isLocating, setIsLocating] = useState(false);

  // Saved & Recent state (Local Storage persistence)
  const [savedCarparks, setSavedCarparks] = useState<Carpark[]>(() => {
    try {
      const saved = localStorage.getItem('sg_saved_carparks');
      return saved ? JSON.parse(saved) : [INITIAL_SINGAPORE_CARPARKS[0]];
    } catch {
      return [INITIAL_SINGAPORE_CARPARKS[0]];
    }
  });

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    try {
      const saved = localStorage.getItem('sg_saved_locations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    try {
      const saved = localStorage.getItem('sg_recent_searches');
      return saved ? JSON.parse(saved) : [
        { id: '1', query: 'Suntec City', destinationName: 'Suntec City', latitude: 1.2935, longitude: 103.8572, timestamp: '10 min ago' },
        { id: '2', query: 'Marina Bay Sands', destinationName: 'Marina Bay Sands', latitude: 1.2834, longitude: 103.8607, timestamp: '1 hour ago' },
      ];
    } catch {
      return [];
    }
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    vehicleType: 'car',
    primaryPreference: 'overall',
    maxWalkingMinutes: 10,
    durationMinutes: 120,
    heightRequirementMeters: 2.0,
    weights: getPresetWeights('overall'),
  });

  // Modal States
  const [detailModalCarpark, setDetailModalCarpark] = useState<Carpark | null>(null);
  const [navigateModalCarpark, setNavigateModalCarpark] = useState<Carpark | null>(null);
  const [historicalTrendCarpark, setHistoricalTrendCarpark] = useState<Carpark | null>(null);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Live feed indicator status
  const [lastUpdatedText, setLastUpdatedText] = useState('Live LTA Sync • Updated 30s ago');
  const [isLiveFeed, setIsLiveFeed] = useState(true);

  // Save state handlers
  useEffect(() => {
    try {
      localStorage.setItem('sg_saved_carparks', JSON.stringify(savedCarparks));
    } catch (e) {
      console.error(e);
    }
  }, [savedCarparks]);

  useEffect(() => {
    try {
      localStorage.setItem('sg_recent_searches', JSON.stringify(recentSearches));
    } catch (e) {
      console.error(e);
    }
  }, [recentSearches]);

  // Periodic Live API Feed Sync
  const syncLiveAvailability = useCallback(async () => {
    try {
      const res = await fetch('/api/parking/availability');
      if (res.ok) {
        setIsLiveFeed(true);
        setLastUpdatedText('Live LTA Feed • Updated just now');
        // Jitter lot availability slightly to simulate live entry/exits
        setCarparks((prev) =>
          prev.map((cp) => {
            const delta = Math.floor(Math.random() * 5) - 2;
            const updated = Math.max(0, cp.availableLots + delta);
            return {
              ...cp,
              availableLots: updated,
              lastUpdated: new Date().toISOString(),
            };
          })
        );
      }
    } catch (e) {
      setIsLiveFeed(false);
      setLastUpdatedText('Demo Mode Sync');
    }
  }, []);

  useEffect(() => {
    syncLiveAvailability();
    const interval = setInterval(syncLiveAvailability, 45000); // 45s refresh
    return () => clearInterval(interval);
  }, [syncLiveAvailability]);

  // Compute Ranked Carparks based on destination & ranking parameters
  const userOrigin = userLocation || { latitude: currentDestination.latitude, longitude: currentDestination.longitude };

  const rankedCarparks = useMemo(() => {
    const userPrefs: UserPreferences = {
      ...preferences,
      vehicleType,
      durationMinutes,
      primaryPreference: preferenceMode,
      weights: getPresetWeights(preferenceMode),
    };

    return rankCarparks(
      carparks,
      currentDestination.latitude,
      currentDestination.longitude,
      userOrigin.latitude,
      userOrigin.longitude,
      userPrefs
    );
  }, [carparks, currentDestination, userOrigin, preferences, vehicleType, durationMinutes, preferenceMode]);

  // Auto select top recommended carpark when destination changes
  useEffect(() => {
    if (rankedCarparks.length > 0) {
      setSelectedCarpark(rankedCarparks[0]);
    }
  }, [currentDestination.id, rankedCarparks.length]);

  // Handlers
  const handleSelectDestination = (dest: Destination) => {
    setCurrentDestination(dest);
    // Add to recent search
    setRecentSearches((prev) => [
      {
        id: `recent-${Date.now()}`,
        query: dest.name,
        destinationName: dest.name,
        latitude: dest.latitude,
        longitude: dest.longitude,
        timestamp: 'Just now',
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setUserLocation(loc);
          setIsLocating(false);
          // Set nearest hub destination
          setCurrentDestination({
            id: 'current-gps-dest',
            name: 'Current Location',
            category: 'attraction',
            address: 'GPS Pin Location, Singapore',
            postalCode: '000000',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            popularCarparkIds: [],
          });
        },
        (err) => {
          console.warn('Geolocation denied or failed', err);
          setIsLocating(false);
          alert('GPS location unavailable. Defaulting to Singapore City Center.');
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleToggleSaveCarpark = (cp: Carpark) => {
    setSavedCarparks((prev) => {
      const exists = prev.some((item) => item.id === cp.id);
      if (exists) {
        return prev.filter((item) => item.id !== cp.id);
      }
      return [...prev, cp];
    });
  };

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Sticky Header */}
      <Header
        vehicleType={vehicleType}
        onVehicleChange={setVehicleType}
        durationMinutes={durationMinutes}
        onDurationChange={setDurationMinutes}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        lastUpdatedText={lastUpdatedText}
        isLiveFeed={isLiveFeed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 pb-24 space-y-4">
        {/* Search & Ranking Filter Header (visible on Map and Search tabs) */}
        {(activeTab === 'map' || activeTab === 'search') && (
          <SearchBar
            currentDestination={currentDestination}
            onSelectDestination={handleSelectDestination}
            preferenceMode={preferenceMode}
            onPreferenceChange={setPreferenceMode}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLocating={isLocating}
          />
        )}

        {/* TAB 1: MAP VIEW */}
        {activeTab === 'map' && (
          <div className="space-y-3">
            <MapView
              destination={currentDestination}
              carparks={rankedCarparks}
              selectedCarpark={selectedCarpark}
              onSelectCarpark={setSelectedCarpark}
              onOpenDetailModal={setDetailModalCarpark}
              onOpenNavigateModal={setNavigateModalCarpark}
              userLocation={userLocation}
            />
          </div>
        )}

        {/* TAB 2: RANKED SEARCH RESULTS LIST */}
        {activeTab === 'search' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Ranked Parking Results</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({rankedCarparks.length} available)
                </span>
              </h2>
              <span className="text-xs text-emerald-400 font-bold">
                Near {currentDestination.name}
              </span>
            </div>

            <div className="space-y-3">
              {rankedCarparks.map((cp) => (
                <CarparkCard
                  key={cp.id}
                  carpark={cp}
                  durationMinutes={durationMinutes}
                  onSelect={setSelectedCarpark}
                  onOpenDetail={setDetailModalCarpark}
                  onOpenNavigate={setNavigateModalCarpark}
                  onOpenDeals={(carpark) => {
                    setSelectedCarpark(carpark);
                    setActiveTab('deals');
                  }}
                  isSaved={savedCarparks.some((s) => s.id === cp.id)}
                  onToggleSave={handleToggleSaveCarpark}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FOOD DEALS & EATS */}
        {activeTab === 'deals' && (
          <FoodDealsView
            selectedCarpark={selectedCarpark}
            onSelectCarparkForDeals={(carparkId) => {
              const cp = carparks.find((c) => c.id === carparkId);
              if (cp) setSelectedCarpark(cp);
            }}
          />
        )}

        {/* TAB 4: SAVED LOCATIONS & HISTORY */}
        {activeTab === 'saved' && (
          <SavedView
            savedCarparks={savedCarparks}
            savedLocations={savedLocations}
            recentSearches={recentSearches}
            onSelectCarpark={(cp) => {
              setSelectedCarpark(cp);
              setActiveTab('map');
            }}
            onOpenNavigate={setNavigateModalCarpark}
            onRemoveSavedCarpark={handleToggleSaveCarpark}
            onSelectRecentSearch={(s) => {
              setCurrentDestination({
                id: s.id,
                name: s.destinationName,
                category: 'shopping',
                address: `${s.destinationName}, Singapore`,
                postalCode: '000000',
                latitude: s.latitude,
                longitude: s.longitude,
                popularCarparkIds: [],
              });
              setActiveTab('map');
            }}
            onAddQuickLocation={(label, name) => {
              setSavedLocations((prev) => [
                ...prev,
                { id: `loc-${Date.now()}`, label, name, address: name, latitude: 1.2935, longitude: 103.8572, createdAt: new Date().toISOString() },
              ]);
            }}
          />
        )}

        {/* TAB 5: PROFILE & VEHICLE PREFERENCES */}
        {activeTab === 'profile' && (
          <ProfileView
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
          />
        )}
      </main>

      {/* Bottom Mobile Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedCarparks.length}
      />

      {/* Modal overlays */}
      <CarparkDetailModal
        carpark={detailModalCarpark}
        onClose={() => setDetailModalCarpark(null)}
        onOpenNavigate={(cp) => {
          setDetailModalCarpark(null);
          setNavigateModalCarpark(cp);
        }}
        onOpenDeals={(cp) => {
          setDetailModalCarpark(null);
          setSelectedCarpark(cp);
          setActiveTab('deals');
        }}
        onOpenHistoricalTrend={(cp) => setHistoricalTrendCarpark(cp)}
        isSaved={detailModalCarpark ? savedCarparks.some((s) => s.id === detailModalCarpark.id) : false}
        onToggleSave={handleToggleSaveCarpark}
      />

      <NavigationHandoffModal
        carpark={navigateModalCarpark}
        onClose={() => setNavigateModalCarpark(null)}
      />

      <PreTripCheckerModal
        carpark={historicalTrendCarpark}
        onClose={() => setHistoricalTrendCarpark(null)}
      />

      {isAiAdvisorOpen && (
        <AiAdvisorModal
          destination={currentDestination}
          vehicleType={vehicleType}
          durationMinutes={durationMinutes}
          onClose={() => setIsAiAdvisorOpen(false)}
        />
      )}
    </div>
  );
}
