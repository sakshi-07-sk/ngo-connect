/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Award, TreePine, Clock, Sparkles, Copy, Check, Briefcase, QrCode, FileText, Bookmark, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VolunteerProfile, Opportunity, Certificate } from "../types";
import ImpactHotspotsMap from "./ImpactHotspotsMap";

interface DashboardVolunteerProps {
  volunteer: VolunteerProfile;
  opportunities: Opportunity[];
  certificates: Certificate[];
  onNavigate: (view: string) => void;
}

export default function DashboardVolunteer({ volunteer, opportunities, certificates, onNavigate }: DashboardVolunteerProps) {
  const [aiResume, setAiResume] = useState<string | null>(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Opportunity | null>(null);

  const upcomingEvents = opportunities.slice(0, 2);

  const generateResume = async () => {
    setLoadingResume(true);
    try {
      const res = await fetch("/api/gemini/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer })
      });
      const data = await res.json();
      if (data.success) {
        setAiResume(data.markdown);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResume(false);
    }
  };

  const copyToClipboard = () => {
    if (!aiResume) return;
    navigator.clipboard.writeText(aiResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100" id="volunteer-dashboard-root">
      
      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel border-zinc-800/80 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <img src={volunteer.avatar} alt={volunteer.name} className="h-14 w-14 rounded-2xl object-cover border border-zinc-800 shadow-lg" />
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">Welcome back, {volunteer.name}!</h1>
            <p className="text-zinc-400 text-xs max-w-xl">{volunteer.bio}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold rounded-full uppercase tracking-wider border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            Gold Contributor
          </span>
        </div>
      </div>

      {/* Top Stats Grid (from Geometric Balance HTML) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel border-zinc-800/60 p-5 rounded-2xl shadow-xl hover:border-zinc-700 transition-all duration-300">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">Impact Score</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-white tracking-tighter">{volunteer.points}</span>
            <span className="text-indigo-400 text-xs font-bold mb-1">+12%</span>
          </div>
        </div>

        <div className="glass-panel border-zinc-800/60 p-5 rounded-2xl shadow-xl hover:border-zinc-700 transition-all duration-300">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">Hours Contributed</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-white tracking-tighter">{volunteer.totalHours}</span>
            <span className="text-blue-400 text-xs font-bold mb-1 underline decoration-indigo-500">Top 5%</span>
          </div>
        </div>

        <div className="glass-panel border-zinc-800/60 p-5 rounded-2xl shadow-xl hover:border-zinc-700 transition-all duration-300">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">Lives Touched</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-white tracking-tighter">124</span>
            <span className="text-orange-400 text-xs font-bold mb-1">Verified</span>
          </div>
        </div>

        <div className="glass-panel border-zinc-800/60 p-5 rounded-2xl shadow-xl hover:border-zinc-700 border-l-4 border-l-indigo-500 transition-all duration-300">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">Current Level</p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white tracking-tight">Nature Hero</span>
            <div className="flex-1 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-[70%] h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Impact Hotspots Heatmap */}
      <ImpactHotspotsMap />

      {/* Main Grid: Events & AI Resume */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Events & Badges */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Upcoming Registered Events */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-white tracking-tight uppercase">Your Scheduled Shifts</h3>
              <button onClick={() => onNavigate("opportunities")} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                View All Recommendations
              </button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((opp) => (
                <div 
                  key={opp.id} 
                  className="glass-panel border-zinc-800/80 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xl hover:border-indigo-500/50 hover:shadow-indigo-500/5 transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold rounded uppercase tracking-wider">
                        High Match 98%
                      </span>
                      <span className="text-zinc-500 text-[11px] font-medium">NGO • {opp.ngoName}</span>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {opp.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{opp.description}</p>
                  </div>
                  <div className="text-left sm:text-right shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                    <div>
                      <span className="block text-xs font-bold text-white">{opp.date}</span>
                      <span className="text-[10px] text-zinc-500 font-semibold">{opp.location} • 15 Karma Points</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTicket(opp); }}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-lg shadow-indigo-500/10 text-center"
                    >
                      Check-in Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          {/* Unlocked Badges */}
          <div className="glass-panel border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Gamified Achievement Case</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {volunteer.badges.map((bdg, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-zinc-900 text-center flex flex-col items-center justify-center space-y-2 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                    <Award className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{bdg.name}</h4>
                    <p className="text-[9px] text-zinc-400 mt-0.5 line-clamp-1">{bdg.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Resume Generator */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel border-zinc-800/80 glow-purple text-white rounded-3xl p-6 shadow-2xl flex flex-col h-full justify-between space-y-5 relative overflow-hidden bg-gradient-to-br from-zinc-950 to-indigo-950/40">
            <div className="space-y-3 relative z-10">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">AI Integration</p>
              <h3 className="text-lg font-bold tracking-tight">Accredited Resume</h3>
              <p className="text-zinc-300 text-xs leading-relaxed">
                Automatically aggregate your verified volunteer service hours, badges, and credentials into a structured Markdown portfolio.
              </p>
            </div>

            {aiResume ? (
              <div className="bg-black/40 border border-zinc-800/80 rounded-2xl p-4 max-h-56 overflow-y-auto space-y-3 relative font-mono text-[9px] text-zinc-300 leading-relaxed z-10">
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-800 cursor-pointer"
                    title="Copy Markdown"
                  >
                    {copied ? <Check className="h-3 w-3 text-indigo-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="whitespace-pre-wrap">{aiResume}</div>
              </div>
            ) : null}

            <button
              onClick={generateResume}
              disabled={loadingResume}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer z-10 shadow-indigo-500/10"
            >
              {loadingResume ? (
                <>Compiling Ledger...</>
              ) : (
                <>Compile Resume <Briefcase className="h-4 w-4" /></>
              )}
            </button>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600 opacity-10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* RSVP Ticket Check-in Modal */}
      <AnimatePresence>
        {activeTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 rounded-3xl max-w-sm w-full p-6 border border-zinc-800 shadow-2xl relative space-y-6"
            >
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-white">Accreditation Attendance Pass</h3>
                <p className="text-zinc-400 text-xs">Present this QR Code to the NGO organizer on-site.</p>
              </div>

              {/* QR Mockup */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4">
                <div className="bg-white border-4 border-indigo-500 p-4 rounded-2xl shadow-inner">
                  {/* High Quality Simulated QR Icon */}
                  <QrCode className="h-36 w-36 text-slate-950 stroke-[1.2]" />
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full">
                  PASS-{activeTicket.id.toUpperCase()}
                </span>
              </div>

              {/* Event Metadata */}
              <div className="space-y-2 border-t border-zinc-800 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Campaign:</span>
                  <span className="text-white font-bold">{activeTicket.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Benefactor:</span>
                  <span className="text-white font-bold">{activeTicket.ngoName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Shift date:</span>
                  <span className="text-white font-bold font-mono">{activeTicket.date}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTicket(null)}
                className="w-full py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl text-xs font-bold hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
              >
                Close Ticket
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
