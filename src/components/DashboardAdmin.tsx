/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Sparkles, Check, X, Users, Landmark, AlertTriangle, ShieldCheck, Mail, Building } from "lucide-react";
import { NGOProfile } from "../types";

interface DashboardAdminProps {
  ngos: NGOProfile[];
  onVerifyNGO: (id: string, status: "approve" | "reject") => Promise<void>;
}

export default function DashboardAdmin({ ngos, onVerifyNGO }: DashboardAdminProps) {
  const pendingNGOs = ngos.filter(n => !n.verified);
  const activeNGOs = ngos.filter(n => n.verified);

  const [notifying, setNotifying] = useState<string | null>(null);

  const handleVerify = async (id: string, status: "approve" | "reject") => {
    setNotifying(id);
    setTimeout(async () => {
      await onVerifyNGO(id, status);
      setNotifying(null);
    }, 1000);
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100" id="admin-dashboard-root">
      
      {/* Welcome & Admin Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white tracking-tight">Platform Admin Console</h1>
          <p className="text-zinc-400 text-xs">Review government registration papers, verify non-profit profiles, moderate global posts, and audit platform KPIs.</p>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-rose-400">
          <Shield className="h-4.5 w-4.5" />
          <span className="text-xs font-bold font-mono uppercase tracking-wide">Root Administrator</span>
        </div>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">{ngos.length} total</h4>
            <p className="text-xs text-zinc-400 font-medium">Registered NGO Agencies</p>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">{pendingNGOs.length} pending</h4>
            <p className="text-xs text-zinc-400 font-medium">Unverified Non-Profits</p>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">{activeNGOs.length} verified</h4>
            <p className="text-xs text-zinc-400 font-medium">Active Approved Partners</p>
          </div>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: NGO Verification Workflows */}
        <div className="lg:col-span-7 glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Pending NGO Government Accreditation</h3>
            <p className="text-zinc-400 text-xs">Review registration license numbers and approve platform onboarding.</p>
          </div>

          <div className="space-y-4 pt-2">
            {pendingNGOs.length === 0 ? (
              <p className="text-zinc-500 text-xs italic py-4 text-center">All registered non-profits have been verified and approved.</p>
            ) : (
              pendingNGOs.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">{n.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-medium">Gov License: <span className="text-indigo-400 font-semibold">{n.registrationNo}</span></p>
                    <p className="text-[10px] text-zinc-500 line-clamp-2">{n.bio}</p>
                  </div>

                  <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleVerify(n.id, "approve")}
                      disabled={notifying === n.id}
                      className="flex-1 sm:flex-initial px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md shadow-emerald-500/10"
                    >
                      {notifying === n.id ? "Syncing..." : <><Check className="h-3.5 w-3.5" /> Approve</>}
                    </button>
                    <button
                      onClick={() => handleVerify(n.id, "reject")}
                      disabled={notifying === n.id}
                      className="flex-1 sm:flex-initial px-3.5 py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <X className="h-3.5 w-3.5" /> Deny
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Platform Moderation Logs */}
        <div className="lg:col-span-5 glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Security & Moderation Logs</h3>
            <p className="text-zinc-400 text-xs">Real-time trace of system events and content safety filters.</p>
          </div>

          <div className="space-y-3.5 pt-2 font-mono text-[9px] text-zinc-400 leading-relaxed">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-850 space-y-1">
              <span className="text-emerald-400 font-bold">[INFO 10:05]</span>
              <p className="text-zinc-300">Stripe Webhook processed successfully. Donation ID don_19482 verified.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-850 space-y-1">
              <span className="text-indigo-400 font-bold">[INFO 10:02]</span>
              <p className="text-zinc-300">Gemini model recommended optimal reforestation placement for Jane Doe.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-850 space-y-1">
              <span className="text-amber-400 font-bold">[WARN 09:44]</span>
              <p className="text-zinc-300">Content safety filters passed: Public post post_sarah_connor approved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
