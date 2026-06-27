/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MapPin, Calendar, Clock, Sparkles, Filter, Search, ArrowRight, ShieldAlert, Navigation, Compass, CheckCircle2, X } from "lucide-react";
import { Opportunity } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface OpportunityListProps {
  opportunities: Opportunity[];
  onApplyOpportunity: (id: string) => Promise<void>;
}

export default function OpportunityList({ opportunities, onApplyOpportunity }: OpportunityListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [radius, setRadius] = useState(25);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [showNavigation, setShowNavigation] = useState<string | null>(null);

  // Filter coordinates based on selections
  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || opp.interests.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleApply = async (id: string) => {
    setApplyingId(id);
    try {
      await onApplyOpportunity(id);
      // Close detail modal or update selection
      if (selectedOpportunity?.id === id) {
        setSelectedOpportunity(prev => prev ? { ...prev, applicantsCount: prev.applicantsCount + 1 } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApplyingId(null);
    }
  };

  const categories = ["All", "Environment", "Hunger Relief", "Education", "Disaster Relief"];

  return (
    <div className="space-y-8 font-sans text-zinc-100" id="opportunity-list-root">
      
      {/* Header & Filter Row */}
      <div className="glass-panel border border-zinc-800/80 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-white tracking-tight">Discover Volunteer Shifts</h1>
            <p className="text-zinc-400 text-xs">Search physical or remote opportunities based on skills, causes, and distance radius.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search keyword, location, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-500 text-xs text-white outline-none transition-all placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Filter Badges & Radius */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800/60 pt-4" id="filtration-badges">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                    : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Radius selector */}
          <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/80 px-3.5 py-1.5 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-wider">Radius Limit:</span>
            <input
              type="range"
              min="5"
              max="100"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-indigo-400 font-mono">{radius} miles</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Map Pointers & Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Public Listings */}
        <div className="lg:col-span-7 space-y-4" id="listings-grid">
          {filteredOpps.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl border border-zinc-800/80 space-y-3 shadow-xl">
              <Compass className="h-10 w-10 text-zinc-600 mx-auto animate-spin" />
              <h3 className="text-sm font-bold text-white">No active shifts found</h3>
              <p className="text-zinc-500 text-xs">Try adjusting your filters, category, or keyword search criteria.</p>
            </div>
          ) : (
            filteredOpps.map((opp) => (
              <div
                key={opp.id}
                onClick={() => setSelectedOpportunity(opp)}
                className={`glass-panel rounded-3xl p-5 border cursor-pointer transition-all hover:border-emerald-500/50 hover:shadow-emerald-500/5 ${
                  selectedOpportunity?.id === opp.id ? "border-emerald-500/50 shadow-lg bg-emerald-950/10" : "border-zinc-800/80"
                }`}
              >
                <div className="space-y-4">
                  {/* Top Line */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {opp.isEmergency && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono uppercase animate-pulse">
                            <ShieldAlert className="h-3 w-3" /> CRITICAL
                          </span>
                        )}
                        <span className="inline-flex px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                          {opp.interests[0]}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-white leading-snug group-hover:text-emerald-400">{opp.title}</h3>
                      <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" /> {opp.location}
                      </p>
                    </div>

                    <img src={opp.ngoAvatar} alt={opp.ngoName} className="h-8 w-8 rounded-full object-cover border border-zinc-800 shrink-0 shadow-md" />
                  </div>

                  {/* Summary */}
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{opp.description}</p>

                  {/* Info Row */}
                  <div className="flex justify-between items-center text-[10px] border-t border-zinc-800/60 pt-3 text-zinc-500 font-mono font-medium">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-zinc-400"><Calendar className="h-3.5 w-3.5 text-zinc-500" /> {opp.date}</span>
                      <span className="flex items-center gap-1 text-zinc-400"><Clock className="h-3.5 w-3.5 text-zinc-500" /> {opp.duration}</span>
                    </div>

                    <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">+{opp.hoursGained} Hours XP</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Simulated Google Maps Viewport */}
        <div className="lg:col-span-5 h-[480px] bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 relative shadow-2xl" id="map-simulation-viewport">
          {/* Custom Stylized Grid SVG Map */}
          <svg className="absolute inset-0 w-full h-full bg-zinc-950" viewBox="0 0 400 400" id="google-maps-svg-canvas">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(39, 39, 42, 0.4)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Draw water / park bodies */}
            <path d="M 0 300 Q 150 250 250 400 L 0 400 Z" fill="rgba(30, 58, 138, 0.25)" /> {/* Deep Blue Water */}
            <circle cx="300" cy="100" r="60" fill="rgba(20, 83, 45, 0.2)" /> {/* Dark Green Park */}

            {/* Simulated Road Lines */}
            <path d="M 0 120 L 400 120 M 150 0 L 150 400" stroke="#18181B" strokeWidth="10" strokeLinecap="round" />
            <path d="M 0 120 L 400 120 M 150 0 L 150 400" stroke="#27272A" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />

            {/* Custom interactive Map pins representing listings */}
            {filteredOpps.map((opp, idx) => {
              // Convert lat/long to static coordinates within our grid
              const x = 150 + (opp.longitude + 122.4) * 800;
              const y = 120 - (opp.latitude - 37.7) * 800;
              
              const isSelected = selectedOpportunity?.id === opp.id;
              
              return (
                <g
                  key={opp.id}
                  onClick={() => setSelectedOpportunity(opp)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 10 : 6}
                    className={`transition-all duration-300 ${isSelected ? "fill-rose-500 animate-ping opacity-45" : "fill-indigo-400/80 group-hover:scale-125"}`}
                  />
                  <path
                    d={`M ${x} ${y} L ${x - 6} ${y - 14} A 6 6 0 0 1 ${x + 6} ${y - 14} Z`}
                    className={`transition-all duration-300 ${isSelected ? "fill-rose-500 stroke-rose-950 stroke-[1.5]" : "fill-indigo-500 group-hover:fill-indigo-400"}`}
                  />
                  <circle cx={x} cy={y - 14} r="2.5" fill="white" />
                </g>
              );
            })}
          </svg>

          {/* Compass Float overlay */}
          <div className="absolute top-4 right-4 bg-zinc-950/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-zinc-800 flex items-center gap-1.5 font-mono text-[9px] text-zinc-400 font-bold select-none">
            <Compass className="h-4 w-4 animate-spin text-indigo-400" />
            <span>GPS GROUNDING</span>
          </div>

          {/* Dynamic Map card overlay if an opportunity is selected */}
          <AnimatePresence>
            {selectedOpportunity && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="absolute bottom-4 inset-x-4 bg-zinc-950/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-zinc-800 space-y-3.5 font-sans text-zinc-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{selectedOpportunity.title}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{selectedOpportunity.location}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOpportunity(null)}
                    className="rounded-full p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Apply/Navigation triggers */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApply(selectedOpportunity.id)}
                    disabled={applyingId === selectedOpportunity.id || selectedOpportunity.applicantsCount >= selectedOpportunity.capacity}
                    className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md shadow-indigo-500/10"
                  >
                    {applyingId === selectedOpportunity.id ? (
                      "Registering..."
                    ) : selectedOpportunity.applicantsCount >= selectedOpportunity.capacity ? (
                      "Event Full"
                    ) : (
                      <>Apply Now <CheckCircle2 className="h-3.5 w-3.5" /></>
                    )}
                  </button>
                  <button
                    onClick={() => setShowNavigation(showNavigation === selectedOpportunity.id ? null : selectedOpportunity.id)}
                    className="px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Navigate
                  </button>
                </div>

                {/* Animated Navigation Route simulation */}
                {showNavigation === selectedOpportunity.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-black/40 border border-zinc-900 p-2.5 rounded-xl font-mono text-[9px] text-zinc-400 space-y-1"
                  >
                    <p className="font-bold text-indigo-400">🗺️ GOOGLE MAPS NAVIGATION MOCK</p>
                    <p>1. Turn right onto Golden Gate Ave (0.4 mi)</p>
                    <p>2. Keep left onto Fulton St towards central depots (1.2 mi)</p>
                    <p className="font-bold text-zinc-300">Destination reached on your right.</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
