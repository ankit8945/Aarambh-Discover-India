import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Compass,
  Search,
  Layers,
  Navigation,
  Car,
  Footprints,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Hammer,
  Landmark,
  Loader2,
} from 'lucide-react';
import { geocodeSearch, getRoute } from '../services/api';
import { RouteResult } from '../types';

interface MapsViewProps {
  onSelectPlace: (placeName: string) => void;
  initialQuery?: string;
}

interface MapPOI {
  id: string;
  name: string;
  category: 'monument' | 'craft' | 'food' | 'stepwell' | 'nature';
  lat: number;
  lon: number;
  description: string;
  state: string;
}

const INITIAL_INDIA_POIS: MapPOI[] = [
  {
    id: 'poi-1',
    name: 'Qutb Minar Complex',
    category: 'monument',
    lat: 28.5245,
    lon: 77.1855,
    description: '73m red sandstone tower with 4th-century iron pillar that does not rust.',
    state: 'Delhi',
  },
  {
    id: 'poi-2',
    name: 'Varanasi Assi to Manikarnika Ghats',
    category: 'monument',
    lat: 25.282,
    lon: 83.006,
    description: 'Continuous 84 riverfront stairways with morning Vedic chants and living rituals.',
    state: 'Uttar Pradesh',
  },
  {
    id: 'poi-3',
    name: 'Patan Double Ikat Patola Weaving Guild',
    category: 'craft',
    lat: 23.8343,
    lon: 72.1266,
    description: 'Ancient geometric silk weave where warp and weft are tie-dyed before weaving.',
    state: 'Gujarat',
  },
  {
    id: 'poi-4',
    name: 'Rani ki Vav Stepwell',
    category: 'stepwell',
    lat: 23.8589,
    lon: 72.1017,
    description: 'Subterranean 7-tiered inverted water temple with 500+ ornate stone carvings.',
    state: 'Gujarat',
  },
  {
    id: 'poi-5',
    name: 'Hampi Virupaksha & Vittala Temple',
    category: 'monument',
    lat: 15.335,
    lon: 76.46,
    description: 'Musical pillared hall and granite chariot shrine on the banks of Tungabhadra.',
    state: 'Karnataka',
  },
  {
    id: 'poi-6',
    name: 'Brihadisvara Temple (Thanjavur)',
    category: 'monument',
    lat: 10.7828,
    lon: 79.1318,
    description: '66m monolithic granite vimana built in 1010 CE without mortar.',
    state: 'Tamil Nadu',
  },
  {
    id: 'poi-7',
    name: 'Kondapalli Wooden Toy Artisans',
    category: 'craft',
    lat: 16.6192,
    lon: 80.5408,
    description: 'Generational soft-wood and tamarind-seed paste toy carving tradition.',
    state: 'Andhra Pradesh',
  },
  {
    id: 'poi-8',
    name: 'Kolkata College Street & Coffee House',
    category: 'food',
    lat: 22.5769,
    lon: 88.3639,
    description: 'Century-old literary adda tradition with traditional chops, cutlets, and mishti doi.',
    state: 'West Bengal',
  },
  {
    id: 'poi-9',
    name: 'Amber Fort & Panna Meena Stepwell',
    category: 'monument',
    lat: 26.9855,
    lon: 75.8513,
    description: 'Rajput-Mughal red sandstone fort and geometric stepwell.',
    state: 'Rajasthan',
  },
  {
    id: 'poi-10',
    name: 'Chanderi Handloom Weaving Cluster',
    category: 'craft',
    lat: 24.7176,
    lon: 78.1364,
    description: 'Fine silk-cotton tissue weave with gold zari motifs dating to the Vedic era.',
    state: 'Madhya Pradesh',
  },
];

export const MapsView: React.FC<MapsViewProps> = ({
  onSelectPlace,
  initialQuery = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searching, setSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);

  // Routing state
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [routeMode, setRouteMode] = useState<'driving' | 'walking'>('driving');
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.5, 79.5], // Center of India
        zoom: 5,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Aarambh SIH 2026',
        maxZoom: 19,
      }).addTo(map);

      const mg = L.layerGroup().addTo(map);
      markersGroupRef.current = mg;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers based on Category filter
  useEffect(() => {
    const map = mapInstanceRef.current;
    const mg = markersGroupRef.current;
    if (!map || !mg) return;

    mg.clearLayers();

    const filtered = INITIAL_INDIA_POIS.filter(
      (p) => activeCategory === 'all' || p.category === activeCategory
    );

    filtered.forEach((poi) => {
      const color =
        poi.category === 'monument'
          ? '#b45309'
          : poi.category === 'craft'
          ? '#c2410c'
          : poi.category === 'food'
          ? '#15803d'
          : '#0284c7';

      const icon = L.divIcon({
        className: 'custom-poi-marker',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: ${color};
            border: 2px solid white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
          ">
            ${poi.category === 'monument' ? '🏛️' : poi.category === 'craft' ? '🧵' : poi.category === 'food' ? '🍛' : '💧'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([poi.lat, poi.lon], { icon }).addTo(mg);
      marker.on('click', () => {
        setSelectedPOI(poi);
        map.setView([poi.lat, poi.lon], 12, { animate: true });
      });
    });
  }, [activeCategory]);

  // Handle Search any Indian location
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const results = await geocodeSearch(searchQuery);
      if (results && results.length > 0 && mapInstanceRef.current) {
        const geo = results[0];
        mapInstanceRef.current.setView([geo.lat, geo.lon], 13, { animate: true });

        // Add a temporary marker
        const newPOI: MapPOI = {
          id: `custom-${Date.now()}`,
          name: geo.placeName,
          category: 'monument',
          lat: geo.lat,
          lon: geo.lon,
          description: geo.formattedAddress,
          state: geo.state || 'India',
        };
        setSelectedPOI(newPOI);

        if (markersGroupRef.current) {
          const searchIcon = L.divIcon({
            className: 'searched-marker',
            html: `
              <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: #ea580c;
                border: 3px solid white;
                box-shadow: 0 6px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
                cursor: pointer;
              ">📍</div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });
          L.marker([geo.lat, geo.lon], { icon: searchIcon }).addTo(markersGroupRef.current);
        }
      }
    } catch (err) {
      console.error('Maps view search error', err);
    } finally {
      setSearching(false);
    }
  };

  // Get Route from user to selected POI
  const calculateRoute = async () => {
    if (!selectedPOI) return;

    if (!userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const origin = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            setUserLocation(origin);
            fetchRoute(origin, { lat: selectedPOI.lat, lon: selectedPOI.lon });
          },
          () => {
            // Default to Delhi if permission denied
            const origin = { lat: 28.6139, lon: 77.209 };
            setUserLocation(origin);
            fetchRoute(origin, { lat: selectedPOI.lat, lon: selectedPOI.lon });
          }
        );
      }
    } else {
      fetchRoute(userLocation, { lat: selectedPOI.lat, lon: selectedPOI.lon });
    }
  };

  const fetchRoute = async (
    origin: { lat: number; lon: number },
    destination: { lat: number; lon: number }
  ) => {
    setRouteLoading(true);
    setRouteResult(null);

    try {
      const res = await getRoute(origin.lat, origin.lon, destination.lat, destination.lon, routeMode);
      setRouteResult(res);

      if (res.available && res.coordinates && res.coordinates.length > 0 && mapInstanceRef.current) {
        if (routeLayerRef.current) {
          routeLayerRef.current.remove();
        }

        const poly = L.polyline(res.coordinates, {
          color: routeMode === 'walking' ? '#16a34a' : '#b45309',
          weight: 4,
          opacity: 0.85,
          dashArray: routeMode === 'walking' ? '6, 8' : undefined,
        }).addTo(mapInstanceRef.current);

        routeLayerRef.current = poly;
        mapInstanceRef.current.fitBounds(poly.getBounds(), { padding: [40, 40] });
      }
    } catch (e) {
      console.error('Route error', e);
    } finally {
      setRouteLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Search & Filter Bar */}
      <section className="bg-stone-900 text-stone-100 py-6 px-4 sm:px-6 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heritage text-xl font-bold text-amber-100">
                DYNAMIC CULTURAL ATLAS OF INDIA
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                Live Geocoded & Routed
              </span>
            </div>
            <p className="text-xs text-stone-400 font-light">
              Interactive geospatial knowledge graph: Monuments, artisan clusters, water stepwells, and real travel routes.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="w-full md:w-96">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any town, village, temple, or fort in India..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700 text-xs text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="submit"
                disabled={searching}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {searching ? 'Locating...' : 'Locate'}
              </button>
            </div>
          </form>
        </div>

        {/* Filter Pills */}
        <div className="max-w-7xl mx-auto pt-4 flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'all', label: 'All Layers', icon: Layers },
            { id: 'monument', label: '🏛️ Monuments & Forts', icon: Landmark },
            { id: 'craft', label: '🧵 Living Craft Guilds', icon: Hammer },
            { id: 'food', label: '🍛 Heirloom Cuisine Bazaars', icon: Utensils },
            { id: 'stepwell', label: '💧 Stepwells & Water Lore', icon: Compass },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Map Canvas Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl border border-stone-300 shadow-lg overflow-hidden bg-stone-100 min-h-[620px] flex flex-col md:flex-row">
          {/* Left / Bottom Floating Details Panel if a POI is selected */}
          {selectedPOI && (
            <div className="w-full md:w-80 p-5 bg-white/95 backdrop-blur-md border-r border-stone-200 z-10 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                    {selectedPOI.category.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-stone-500">{selectedPOI.state}</span>
                </div>

                <h3 className="text-lg font-bold font-heritage text-stone-900 leading-snug">
                  {selectedPOI.name}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {selectedPOI.description}
                </p>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 font-mono">
                  Coordinates: {selectedPOI.lat.toFixed(4)}°N, {selectedPOI.lon.toFixed(4)}°E
                </div>

                {/* Route Result preview if calculated */}
                {routeResult && (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1 text-xs">
                    <div className="font-bold text-amber-900 flex items-center justify-between">
                      <span>Real Route Calculated:</span>
                      <span className="font-mono">{routeResult.distanceKm} km</span>
                    </div>
                    <div className="text-[11px] text-amber-800">
                      Estimated Duration: <strong>{Math.round(routeResult.durationMinutes)} mins</strong> ({routeMode})
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Routing engine: {routeResult.source}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRouteMode('driving');
                      calculateRoute();
                    }}
                    disabled={routeLoading}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      routeMode === 'driving' && routeResult
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Drive</span>
                  </button>

                  <button
                    onClick={() => {
                      setRouteMode('walking');
                      calculateRoute();
                    }}
                    disabled={routeLoading}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      routeMode === 'walking' && routeResult
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span>Walk</span>
                  </button>
                </div>

                <button
                  onClick={() => onSelectPlace(selectedPOI.name.split('(')[0].trim())}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Explore Living Memory Layer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Leaflet Map Canvas */}
          <div ref={mapContainerRef} className="flex-1 w-full h-[620px] z-0" />
        </div>
      </section>
    </div>
  );
};
