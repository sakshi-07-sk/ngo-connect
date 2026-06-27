/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Briefcase, DollarSign, Users, Clock, Award, Building, Sparkles, ArrowUpRight, TrendingUp, CheckCircle } from "lucide-react";
import { CorporateCSR } from "../types";

interface DashboardCSRProps {
  csr: CorporateCSR;
  onNavigate: (view: string) => void;
}

export default function DashboardCSR({ csr, onNavigate }: DashboardCSRProps) {
  const budgetPct = Math.min(100, Math.floor((csr.budgetSpent / csr.budgetAllocated) * 100));

  return (
    <div className="space-y-8 font-sans text-zinc-100" id="csr-dashboard-root">
      
      {/* Welcome & Bio Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg border border-zinc-800">
            APEX
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">{csr.companyName} Workspace</h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{csr.bio}</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("opportunities")}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer transition-all shrink-0"
        >
          <Building className="h-4.5 w-4.5" /> Book Corporate Team Shift
        </button>
      </div>

      {/* Metrics board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">{csr.employeesEnrolled} Employees</h4>
            <p className="text-xs text-zinc-400 font-medium">Active Enrolled Employees</p>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">{csr.volunteerHoursContributed} Hours</h4>
            <p className="text-xs text-zinc-400 font-medium">Cumulative Shift Hours</p>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">${csr.budgetSpent.toLocaleString()}</h4>
            <p className="text-xs text-zinc-400 font-medium">Disbursed CSR Grants</p>
          </div>
        </div>
      </div>

      {/* Corporate Budget allocation & Partner details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Budget Progress bar */}
        <div className="lg:col-span-6 glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-sans">CSR Fiduciary Budget Allocations</h3>
            <p className="text-zinc-400 text-xs">Fiduciary 2% Corporate Profit grants distribution progress.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-zinc-300">
                <span>Annual CSR Budget Used</span>
                <span className="text-purple-400 font-black">{budgetPct}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${budgetPct}%` }} />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-2">
              <div>
                <p className="text-zinc-500 font-mono text-[10px]">TOTAL ALLOCATED</p>
                <p className="text-white font-black text-base">${csr.budgetAllocated.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-zinc-500 font-mono text-[10px]">TOTAL DISBURSED</p>
                <p className="text-purple-400 font-black text-base">${csr.budgetSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Partners and CSR report listings */}
        <div className="lg:col-span-6 glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Supported Non-Profits</h3>
            <p className="text-zinc-400 text-xs">NGO campaigns and associations verified and sponsored by Apex.</p>
          </div>

          <div className="space-y-3 pt-1">
            {csr.supportedNGOs.map((ngoName, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-850 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
                    {ngoName[0]}
                  </div>
                  <span className="text-xs font-bold text-white">{ngoName}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3" /> Partner Alliance
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
