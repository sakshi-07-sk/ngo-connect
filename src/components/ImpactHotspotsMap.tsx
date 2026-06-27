/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { MapPin, Sliders, Sparkles, AlertTriangle, RefreshCw } from "lucide-react";

// Get the secure Google Maps API Key from the environment
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

interface HotspotPoint {
  lat: number;
  lng: number;
  weight: number;
  name: string;
  category: string;
}

interface CityData {
  name: string;
  center: { lat: number; lng: number };
  zoom: number;
  hotspots: HotspotPoint[];
}

const CITIES: Record<string, CityData> = {
  sf: {
    name: "San Francisco",
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 12,
    hotspots: [
      { name: "Golden Gate Park Reforestation", lat: 37.7694, lng: -122.4862, weight: 32, category: "Environment" },
      { name: "Mission District Soup Kitchen", lat: 37.7599, lng: -122.4148, weight: 48, category: "Hunger Relief" },
      { name: "Presidio Tree Nursery", lat: 37.7985, lng: -122.4662, weight: 20, category: "Environment" },
      { name: "Civic Center Food Drive", lat: 37.7794, lng: -122.4169, weight: 58, category: "Hunger Relief" },
      { name: "SoMa Shelter Depot", lat: 37.7785, lng: -122.4056, weight: 38, category: "Social Services" },
      { name: "Marina Beach Cleanup", lat: 37.8077, lng: -122.4381, weight: 25, category: "Environment" }
    ]
  },
  ny: {
    name: "New York",
    center: { lat: 40.7128, lng: -74.0060 },
    zoom: 12,
    hotspots: [
      { name: "Bowery Mission Food Shelter", lat: 40.7223, lng: -73.9928, weight: 48, category: "Hunger Relief" },
      { name: "Central Park Conservation Hub", lat: 40.7850, lng: -73.9683, weight: 62, category: "Environment" },
      { name: "Brooklyn Food Pantry Center", lat: 40.6782, lng: -73.9442, weight: 35, category: "Hunger Relief" },
      { name: "Queens Library Literacy Tutoring", lat: 40.7357, lng: -73.8173, weight: 28, category: "Education" },
      { name: "Bronx Community Garden Project", lat: 40.8506, lng: -73.8654, weight: 41, category: "Environment" }
    ]
  },
  seattle: {
    name: "Seattle",
    center: { lat: 47.6062, lng: -122.3321 },
    zoom: 12,
    hotspots: [
      { name: "Red Cross Disaster Packing Depot", lat: 47.6062, lng: -122.3321, weight: 45, category: "Disaster Relief" },
      { name: "Green Lake Restoration Camp", lat: 47.6798, lng: -122.3259, weight: 22, category: "Environment" },
      { name: "Pike Place Senior Center Pantry", lat: 47.6097, lng: -122.3422, weight: 34, category: "Social Services" },
      { name: "Capitol Hill Soup Kitchen", lat: 47.6140, lng: -122.3210, weight: 29, category: "Hunger Relief" }
    ]
  },
  chicago: {
    name: "Chicago",
    center: { lat: 41.8781, lng: -87.6298 },
    zoom: 12,
    hotspots: [
      { name: "Loop Food Shelter Hub", lat: 41.8827, lng: -87.6288, weight: 42, category: "Hunger Relief" },
      { name: "Humboldt Park Garden Sanctuary", lat: 41.9015, lng: -87.7022, weight: 30, category: "Environment" },
      { name: "South Side Youth Mentorship Base", lat: 41.7801, lng: -87.6502, weight: 25, category: "Education" },
      { name: "Downtown Literacy Tutoring HQ", lat: 41.8781, lng: -87.6298, weight: 18, category: "Education" }
    ]
  }
};

// Deck.gl Overlay component for mapping heatmaps cleanly
function DeckGlOverlay({ layers }: { layers: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const overlay = new GoogleMapsOverlay({ layers });
    overlay.setMap(map);
    return () => {
      overlay.setMap(null);
    };
  }, [map, layers]);

  return null;
}

// Controller component to pan the map dynamically
function MapCameraController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  return null;
}

export default function ImpactHotspotsMap() {
  const [selectedCityKey, setSelectedCityKey] = useState<string>("sf");
  const [radiusPixels, setRadiusPixels] = useState<number>(35);
  const [intensity, setIntensity] = useState<number>(1.5);

  const cityData = CITIES[selectedCityKey] || CITIES.sf;

  // Format dataset for deck.gl Layer
  const dataPoints = cityData.hotspots.map((h) => [h.lng, h.lat, h.weight]);

  const layers = [
    new HeatmapLayer({
      id: "impact-heatmap-layer",
      data: dataPoints,
      pickable: false,
      getPosition: (d: any) => [d[0], d[1]],
      getWeight: (d: any) => d[2],
      radiusPixels,
      intensity,
      threshold: 0.01,
      colorRange: [
        [99, 102, 241, 25],   // Indigo light
        [99, 102, 241, 80],
        [79, 70, 229, 150],  // Indigo medium
        [67, 56, 202, 200],  // Indigo deep
        [244, 63, 94, 230],  // Rose hot
        [225, 29, 72, 255]   // Rose extreme
      ]
    })
  ];

  return (
    <div className="glass-panel border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col md:flex-row h-[520px] shadow-2xl" id="impact-hotspots-container">
      {/* Sidebar Control Panel */}
      <div className="w-full md:w-80 p-6 border-b md:border-b-0 md:border-r border-zinc-800/60 flex flex-col justify-between bg-zinc-950/40 backdrop-blur-md">
        <div className="space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" /> Live Metrics
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight">Impact Hotspots</h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Real-time heat density visualizing concentrated volunteer activity and booked shifts across cities.
            </p>
          </div>

          {/* City Selector */}
          <div className="space-y-2">
            <label className="text-[9px] uppercase font-bold tracking-wider text-zinc-500">Select Community</label>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(CITIES).map(([key, data]) => (
                <button
                   key={key}
                  onClick={() => setSelectedCityKey(key)}
                  className={`py-2 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-left border ${
                    selectedCityKey === key
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                      : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactivity Sliders */}
          <div className="space-y-3.5 pt-4 border-t border-zinc-800/60">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Sliders className="h-4 w-4 text-zinc-500" />
              <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400">Map Customizer</span>
            </div>

            {/* Radius Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-zinc-400">Kernel Radius</span>
                <span className="text-indigo-400 font-mono">{radiusPixels}px</span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                step="1"
                value={radiusPixels}
                onChange={(e) => setRadiusPixels(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Intensity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-zinc-400">Concentration Intensity</span>
                <span className="text-indigo-400 font-mono">{intensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.1"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Hotspot List summary */}
        <div className="pt-4 border-t border-zinc-800/60 hidden md:block">
          <p className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 mb-2">Primary Hotspots</p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {cityData.hotspots.slice(0, 3).map((h, i) => (
              <div key={i} className="flex justify-between items-center text-[10px] bg-zinc-900/30 p-2 rounded-lg border border-zinc-800/60 text-zinc-300">
                <span className="font-semibold text-zinc-300 truncate max-w-[140px]">{h.name}</span>
                <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[9px] shrink-0">
                  {h.weight} Shifts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Display Side */}
      <div className="flex-1 relative bg-zinc-900 h-full">
        {hasValidKey ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <div className="w-full h-full">
              <Map
                defaultCenter={cityData.center}
                defaultZoom={cityData.zoom}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                style={{ width: "100%", height: "100%" }}
                disableDefaultUI={true}
                zoomControl={true}
              >
                <DeckGlOverlay layers={layers} />
                <MapCameraController center={cityData.center} zoom={cityData.zoom} />
              </Map>
            </div>
          </APIProvider>
        ) : (
          /* Missing API Key Fallback with Elegant Simulated Heatmap Visual & Explicit Key instructions */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-950 text-white">
            {/* Background Simulated Grid and Pulsing Glowing Hotspots */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Simulated Hotspot Blurs */}
            <div className="absolute top-[25%] left-[40%] w-32 h-32 bg-indigo-600 rounded-full blur-[45px] animate-pulse"></div>
            <div className="absolute bottom-[30%] right-[30%] w-24 h-24 bg-rose-500 rounded-full blur-[40px] animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute top-[55%] left-[25%] w-28 h-28 bg-violet-500 rounded-full blur-[35px] animate-pulse" style={{ animationDelay: "2s" }}></div>

            <div className="relative z-10 max-w-md text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="h-6 w-6" />
              </div>
              
              <div className="space-y-1.5">
                <h4 className="text-sm font-black uppercase tracking-wider text-indigo-400">Google Maps Key Integration Required</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The application is fully prepped to overlay live spatial concentration points onto Google Maps. Please configure your key:
                </p>
              </div>

              {/* Instructions steps conforming exactly to rule A/B/C */}
              <div className="bg-slate-900/95 border border-indigo-500/20 rounded-2xl p-4 text-left space-y-2.5 text-[11px] text-slate-300 font-medium">
                <p className="font-bold text-white border-b border-slate-800 pb-1 flex items-center justify-between">
                  <span>⚙️ API KEY INITIALIZATION STEPS</span>
                  <span className="text-indigo-400 font-mono text-[9px]">Stripe / Maps Cloud</span>
                </p>
                <div className="space-y-1.5">
                  <p>1. <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-bold underline hover:text-indigo-300">Get a free Google Maps API Key</a></p>
                  <p>2. Open **Settings** (⚙️ gear icon, top-right corner) → **Secrets**</p>
                  <p>3. Enter secret name: <code className="bg-slate-800 text-indigo-300 px-1 py-0.5 rounded font-mono font-bold">GOOGLE_MAPS_PLATFORM_KEY</code></p>
                  <p>4. Paste your key & hit **Enter**. The workspace compiles the live overlay instantly.</p>
                </div>
              </div>

              {/* Live Preview Switch simulator */}
              <div className="text-[10px] text-slate-400 font-semibold italic">
                Currently displaying simulated volunteer hotspots overlay for {cityData.name} ({cityData.hotspots.length} hubs).
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
