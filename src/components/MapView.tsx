import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { getRoute } from '../services/api';
import { RouteResult, NearbyHeritageItem, MemoryTrailStop } from '../types';
import { Navigation, Car, Footprints, AlertTriangle, RefreshCw, Compass, MapPin } from 'lucide-react';

interface MapViewProps {
  destination: {
    placeName: string;
    lat: number;
    lon: number;
  };
  nearbyHeritage?: NearbyHeritageItem[];
  trailStops?: MemoryTrailStop[];
  onSelectPlace?: (name: string, lat: number, lon: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  destination,
  nearbyHeritage = [],
  trailStops = [],
  onSelectPlace,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [routeMode, setRouteMode] = useState<'driving' | 'walking'>('driving');
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [destination.lat, destination.lon],
        zoom: 14,
        zoomControl: true,
      });

      // Warm, cartographic OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Aarambh',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([destination.lat, destination.lon], 14);
    }

    return () => {
      // Clean up map instance on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destination.lat, destination.lon]);

  // Update Markers when destination, nearby, or userLocation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Custom Icons using Leaflet HTML divIcon
    const destIcon = L.divIcon({
      className: 'custom-dest-marker',
      html: `<div style="background-color: #d97706; color: white; border: 2px solid white; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 16px;">🏛️</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const destMarker = L.marker([destination.lat, destination.lon], { icon: destIcon }).addTo(
      markersGroup
    );
    destMarker.bindPopup(
      `<div style="font-family: sans-serif; padding: 4px;">
        <strong style="color: #b45309; font-size: 14px;">${destination.placeName}</strong>
        <p style="margin: 4px 0 0; font-size: 12px; color: #555;">Primary Cultural Site</p>
      </div>`
    );

    // Nearby Heritage Markers
    nearbyHeritage.forEach((site) => {
      const siteIcon = L.divIcon({
        className: 'custom-nearby-marker',
        html: `<div style="background-color: #4b5563; color: white; border: 2px solid white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.25); font-size: 12px; cursor: pointer;">📍</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([site.lat, site.lon], { icon: siteIcon }).addTo(markersGroup);
      marker.bindPopup(
        `<div style="font-family: sans-serif; padding: 4px;">
          <strong style="font-size: 13px;">${site.name}</strong>
          <p style="margin: 2px 0; font-size: 11px; color: #666;">${site.note}</p>
          <span style="font-size: 10px; color: #d97706; font-weight: bold;">~${site.distanceKm} km away</span>
        </div>`
      );
    });

    // Trail stops
    trailStops.forEach((stop) => {
      const stopIcon = L.divIcon({
        className: 'custom-trail-marker',
        html: `<div style="background-color: #ea580c; color: white; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.2); font-size: 10px; font-weight: bold;">${stop.order}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([stop.lat, stop.lon], { icon: stopIcon }).addTo(markersGroup);
      marker.bindPopup(
        `<div style="font-family: sans-serif; padding: 4px;">
          <span style="font-size: 10px; color: #ea580c; font-weight: bold;">STOP ${stop.order}</span>
          <h4 style="margin: 2px 0; font-size: 12px; font-weight: bold;">${stop.name}</h4>
          <p style="margin: 2px 0; font-size: 11px; color: #666;">${stop.highlight}</p>
        </div>`
      );
    });

    // User Location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div style="background-color: #2563eb; color: white; border: 3px solid white; border-radius: 50%; width: 22px; height: 22px; box-shadow: 0 0 0 4px rgba(37,99,235,0.3);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      const userMarker = L.marker([userLocation.lat, userLocation.lon], { icon: userIcon }).addTo(
        markersGroup
      );
      userMarker.bindPopup('<b>Your Current Location</b>');
    }
  }, [destination, nearbyHeritage, trailStops, userLocation]);

  // Handle Fetching Real Route
  const calculateLiveRoute = async (userLat: number, userLon: number, mode: 'driving' | 'walking') => {
    setRouteLoading(true);
    setRouteError(null);

    try {
      const res = await getRoute(userLat, userLon, destination.lat, destination.lon, mode);
      setRouteResult(res);

      const map = mapInstanceRef.current;
      if (!map) return;

      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }

      if (res.available && res.coordinates.length > 0) {
        const polyline = L.polyline(res.coordinates, {
          color: mode === 'walking' ? '#ea580c' : '#2563eb',
          weight: 5,
          opacity: 0.85,
          dashArray: mode === 'walking' ? '6, 8' : undefined,
        }).addTo(map);

        routeLayerRef.current = polyline;
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      } else {
        setRouteError(res.message || 'Direct routing unavailable between these points.');
      }
    } catch (err: any) {
      setRouteError('Live route calculation service unreachable.');
    } finally {
      setRouteLoading(false);
    }
  };

  const handleLocateMeAndRoute = () => {
    if (!navigator.geolocation) {
      setRouteError('Geolocation not supported by browser.');
      return;
    }

    setLocatingUser(true);
    setRouteError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserLocation({ lat, lon });
        setLocatingUser(false);
        calculateLiveRoute(lat, lon, routeMode);
      },
      (err) => {
        setLocatingUser(false);
        setRouteError(`Location permission required for live route: ${err.message}`);
      },
      { timeout: 8000 }
    );
  };

  const handleToggleMode = (mode: 'driving' | 'walking') => {
    setRouteMode(mode);
    if (userLocation) {
      calculateLiveRoute(userLocation.lat, userLocation.lon, mode);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm">
      {/* Map Header Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-stone-200/80 pointer-events-auto text-xs">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-semibold text-stone-800">{destination.placeName}</span>
          <span className="text-stone-400 font-mono text-[10px] hidden sm:inline">
            ({destination.lat.toFixed(3)}°, {destination.lon.toFixed(3)}°)
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Mode Switchers */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-stone-200 flex items-center gap-1 text-xs">
            <button
              onClick={() => handleToggleMode('driving')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                routeMode === 'driving'
                  ? 'bg-amber-600 text-white font-medium shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Drive Route"
            >
              <Car className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Drive</span>
            </button>
            <button
              onClick={() => handleToggleMode('walking')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                routeMode === 'walking'
                  ? 'bg-amber-600 text-white font-medium shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Walk Route"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Walk</span>
            </button>
          </div>

          {/* Real Route Calculation button */}
          <button
            onClick={handleLocateMeAndRoute}
            disabled={locatingUser || routeLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-semibold shadow-md border border-stone-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {locatingUser || routeLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{userLocation ? 'Recalculate Route' : 'Route from My Location'}</span>
          </button>
        </div>
      </div>

      {/* Real Route Info Overlay Banner */}
      {routeResult && routeResult.available && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-stone-200 text-xs text-stone-800">
          <div className="flex items-center justify-between font-semibold mb-1">
            <span className="flex items-center gap-1 text-amber-700">
              {routeResult.mode === 'walking' ? (
                <Footprints className="w-4 h-4" />
              ) : (
                <Car className="w-4 h-4" />
              )}
              Verified Live Route ({routeResult.mode})
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
              {routeResult.source}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm font-bold text-stone-900">
            <div>
              <span className="text-xl text-amber-800">{routeResult.distanceKm}</span>{' '}
              <span className="text-xs font-normal text-stone-500">km</span>
            </div>
            <div className="w-px h-6 bg-stone-200" />
            <div>
              <span className="text-xl text-amber-800">{routeResult.durationMinutes}</span>{' '}
              <span className="text-xs font-normal text-stone-500">mins estimated</span>
            </div>
          </div>

          {routeResult.steps && routeResult.steps.length > 0 && (
            <div className="mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-600 truncate">
              <strong>Initial maneuver:</strong> {routeResult.steps[0].instruction}
            </div>
          )}
        </div>
      )}

      {routeError && (
        <div className="absolute bottom-3 left-3 right-3 sm:max-w-md z-[1000] bg-amber-50/95 border border-amber-200 p-2.5 rounded-xl shadow-lg text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{routeError}</span>
          </div>
          <button
            onClick={() => setRouteError(null)}
            className="text-stone-500 hover:text-stone-800 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Leaflet DOM container */}
      <div ref={mapContainerRef} className="w-full h-80 sm:h-96 z-0" />
    </div>
  );
};
