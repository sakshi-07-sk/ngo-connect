/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Sparkles, Plus, Check, X, Loader2, ArrowUpRight, DollarSign, Users, Award, TrendingUp, Landmark, FileText, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NGOProfile, Opportunity, Campaign, Donation } from "../types";

interface DashboardNGOProps {
  ngo: NGOProfile;
  opportunities: Opportunity[];
  campaigns: Campaign[];
  donations: Donation[];
  onAddOpportunity: (oppData: any) => Promise<void>;
  onAddCampaign: (campData: any) => Promise<void>;
}

export default function DashboardNGO({ ngo, opportunities, campaigns, donations, onAddOpportunity, onAddCampaign }: DashboardNGOProps) {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [showAddOpp, setShowAddOpp] = useState(false);
  const [showAddCamp, setShowAddCamp] = useState(false);

  // Form states
  const [oppForm, setOppForm] = useState({ title: "", description: "", skillsRequired: "", location: "", date: "", duration: "", hoursGained: "3", capacity: "20" });
  const [campForm, setCampForm] = useState({ title: "", description: "", goalAmount: "10000", deadline: "", category: "Environment" });

  const myOpps = opportunities.filter(o => o.ngoId === ngo.id || o.ngoId === "ngo_green_earth");
  const myCamps = campaigns.filter(c => c.ngoId === ngo.id || c.ngoId === "ngo_green_earth");

  const generateReport = async () => {
    setLoadingReport(true);
    try {
      const res = await fetch("/api/gemini/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: "ngo", entityId: ngo.id })
      });
      const data = await res.json();
      if (data.success) {
        setAiReport(data.insights);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleOppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddOpportunity({
      ...oppForm,
      skillsRequired: oppForm.skillsRequired.split(",").map(s => s.trim()),
      ngoId: ngo.id
    });
    setOppForm({ title: "", description: "", skillsRequired: "", location: "", date: "", duration: "", hoursGained: "3", capacity: "20" });
    setShowAddOpp(false);
  };

  const handleCampSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddCampaign({
      ...campForm,
      ngoId: ngo.id
    });
    setCampForm({ title: "", description: "", goalAmount: "10000", deadline: "", category: "Environment" });
    setShowAddCamp(false);
  };

  // Mock applicant reviews
  const mockApplicants = [
    { id: "app_1", name: "Daniel Craig", email: "daniel@mi6.org", skill: "Crisis Response, Physical fitness", oppName: "EMERGENCY: Disaster Relief Supplies Packing" },
    { id: "app_2", name: "Sarah Connor", email: "sconnor@skynet.net", skill: "Teaching, Mentorship", oppName: "Online Math & Reading Tutoring" }
  ];
  const [activeApplicants, setActiveApplicants] = useState(mockApplicants);

  const handleApplicant = (id: string, action: "accept" | "reject") => {
    setActiveApplicants(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100" id="ngo-dashboard-root">
      
      {/* Welcome & NGO Profile Summary */}
      <div className="glass-panel border-zinc-800/80 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img src={ngo.avatar} alt={ngo.name} className="h-16 w-16 rounded-2xl object-cover border border-zinc-800 shadow-lg" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-white tracking-tight">{ngo.name}</h1>
              {ngo.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Shield className="h-3 w-3 fill-blue-500 text-blue-400" /> Verified NGO
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 max-w-xl">{ngo.bio}</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddOpp(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Schedule New Event
        </button>
      </div>

      {/* Metrics board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel border border-zinc-800/60 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Volunteers</span>
            <Users className="h-4 w-4" />
          </div>
          <h3 className="text-2xl font-black text-white">{ngo.impactMetrics.activeVolunteers} Active</h3>
        </div>

        <div className="glass-panel border border-zinc-800/60 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Stripe Revenue</span>
            <Landmark className="h-4 w-4" />
          </div>
          <h3 className="text-2xl font-black text-white">${ngo.impactMetrics.donationsRaised.toLocaleString()}</h3>
        </div>

        <div className="glass-panel border border-zinc-800/60 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Completion</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="text-2xl font-black text-white">{ngo.impactMetrics.campaignSuccessRate}% Success</h3>
        </div>

        <div className="glass-panel border border-zinc-800/60 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono font-bold">Trees Planted</span>
            <Award className="h-4 w-4" />
          </div>
          <h3 className="text-2xl font-black text-white">{ngo.impactMetrics.treesPlanted.toLocaleString()} Trees</h3>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Manage Opportunities & Campaigns */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Active Campaigns & Drives */}
          <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white tracking-tight">Fundraising Campaign Progress</h3>
              <button
                onClick={() => setShowAddCamp(true)}
                className="text-indigo-400 font-bold text-xs hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                Launch Campaign <Plus className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-4">
              {myCamps.map((camp) => {
                const pct = Math.min(100, Math.floor((camp.currentAmount / camp.goalAmount) * 100));
                return (
                  <div key={camp.id} className="p-4 border border-zinc-900 rounded-2xl bg-zinc-950/40 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white">{camp.title}</h4>
                        <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wide">{camp.category}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">{pct}% Funded</span>
                    </div>

                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                      <span>RAISED: ${camp.currentAmount.toLocaleString()}</span>
                      <span>GOAL: ${camp.goalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Volunteer Applicants */}
          <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">Pending Shift Applicants</h3>
            
            {activeApplicants.length === 0 ? (
              <p className="text-zinc-500 text-xs italic">All applicant profiles are currently reviewed!</p>
            ) : (
              <div className="space-y-3">
                {activeApplicants.map((app) => (
                  <div key={app.id} className="p-4 border border-zinc-900 bg-zinc-950/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">{app.name} ({app.email})</h4>
                      <p className="text-[10px] text-zinc-400">Event: <span className="text-zinc-200 font-semibold">{app.oppName}</span></p>
                      <p className="text-[9px] font-mono text-zinc-500">Match Skills: {app.skill}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplicant(app.id, "accept")}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-lg shadow-emerald-500/5"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleApplicant(app.id, "reject")}
                        className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: AI Impact Analytics Feed */}
        <div className="lg:col-span-5">
          <div className="glass-panel border border-zinc-800/80 glow-blue text-white rounded-3xl p-6 shadow-2xl flex flex-col h-full justify-between space-y-5 bg-gradient-to-br from-zinc-950 to-blue-950/30">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse" /> AI Executive Intelligence
              </div>
              <h3 className="text-lg font-black tracking-tight">Financial & Impact Insights</h3>
              <p className="text-zinc-300 text-xs leading-relaxed">
                Call Gemini to perform high-fidelity analytical modeling on volunteer placement, campaign revenue trajectory, and societal change metrics.
              </p>
            </div>

            {aiReport ? (
              <div className="bg-black/40 border border-zinc-800/80 rounded-2xl p-4 max-h-56 overflow-y-auto space-y-3 relative font-sans text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {aiReport}
              </div>
            ) : null}

            <button
              onClick={generateReport}
              disabled={loadingReport}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shadow-blue-500/10"
            >
              {loadingReport ? (
                <>Formulating Narrative Matrix...</>
              ) : (
                <>Generate Social Impact Report <FileText className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add Opportunity Modal */}
      <AnimatePresence>
        {showAddOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans text-zinc-100">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 rounded-3xl max-w-lg w-full p-6 border border-zinc-800 shadow-2xl relative space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-white">Schedule Active Volunteer Shift</h3>
                <button onClick={() => setShowAddOpp(false)} className="rounded-full p-1.5 hover:bg-zinc-900 cursor-pointer text-zinc-400 hover:text-white"><X className="h-4.5 w-4.5" /></button>
              </div>

              <form onSubmit={handleOppSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-400">Shifting Event Title</label>
                  <input required placeholder="e.g. Coastal Cleanup & Waste Sorter" value={oppForm.title} onChange={e => setOppForm({...oppForm, title: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-400">Detailed Description</label>
                  <textarea required placeholder="Outline tasks, physical demands, and gear..." value={oppForm.description} onChange={e => setOppForm({...oppForm, description: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors h-20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-400">Skills Required (Comma separated)</label>
                    <input placeholder="Basic Cooking, Teaching" value={oppForm.skillsRequired} onChange={e => setOppForm({...oppForm, skillsRequired: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-400">Location Address</label>
                    <input required placeholder="Bowery Mission, NY" value={oppForm.location} onChange={e => setOppForm({...oppForm, location: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-zinc-400">Shift Date</label>
                    <input type="date" required value={oppForm.date} onChange={e => setOppForm({...oppForm, date: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-400">Shift XP Hours</label>
                    <input type="number" value={oppForm.hoursGained} onChange={e => setOppForm({...oppForm, hoursGained: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-400">Volunteers Limit</label>
                    <input type="number" value={oppForm.capacity} onChange={e => setOppForm({...oppForm, capacity: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold uppercase rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10">
                  Publish Active Shift Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Campaign Modal */}
      <AnimatePresence>
        {showAddCamp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans text-zinc-100">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 rounded-3xl max-w-md w-full p-6 border border-zinc-800 shadow-2xl relative space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-white">Launch New Fundraising Drive</h3>
                <button onClick={() => setShowAddCamp(false)} className="rounded-full p-1.5 hover:bg-zinc-900 cursor-pointer text-zinc-400 hover:text-white"><X className="h-4.5 w-4.5" /></button>
              </div>

              <form onSubmit={handleCampSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-400">Campaign Title</label>
                  <input required placeholder="e.g. Save Coastal Mangroves Drive" value={campForm.title} onChange={e => setCampForm({...campForm, title: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-400">Fiduciary Description</label>
                  <textarea required placeholder="Detail funding goals, transparency allocations..." value={campForm.description} onChange={e => setCampForm({...campForm, description: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors h-20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-400">Goal Amount ($)</label>
                    <input type="number" required placeholder="50000" value={campForm.goalAmount} onChange={e => setCampForm({...campForm, goalAmount: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-400">Campaign Category</label>
                    <select value={campForm.category} onChange={e => setCampForm({...campForm, category: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors">
                      <option value="Environment" className="bg-zinc-950 text-white">Environment</option>
                      <option value="Hunger" className="bg-zinc-950 text-white">Hunger</option>
                      <option value="Education" className="bg-zinc-950 text-white">Education</option>
                      <option value="Health" className="bg-zinc-950 text-white">Health</option>
                      <option value="Disaster Relief" className="bg-zinc-950 text-white">Disaster Relief</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-400">Deadline Date</label>
                  <input type="date" required value={campForm.deadline} onChange={e => setCampForm({...campForm, deadline: e.target.value})} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors" />
                </div>

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold uppercase rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10">
                  Activate Fundraising Campaign
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
