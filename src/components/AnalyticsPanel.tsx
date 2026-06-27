/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Landmark, Calendar, Sparkles } from "lucide-react";

export default function AnalyticsPanel() {
  // Monthly donations raised (cumulative)
  const donationTrend = [
    { month: "Jan", raised: 12000 },
    { month: "Feb", raised: 19000 },
    { month: "Mar", raised: 32000 },
    { month: "Apr", raised: 45000 },
    { month: "May", raised: 61000 },
    { month: "Jun", raised: 82000 },
  ];

  // Category breakdown of social impact hours
  const causeBreakdown = [
    { name: "Environment", value: 450 },
    { name: "Hunger Relief", value: 300 },
    { name: "Education", value: 220 },
    { name: "Disaster Relief", value: 180 },
  ];

  // Corporate CSR contributor rankings
  const corporateSponsors = [
    { name: "Apex Corp", hours: 420, budget: 150000 },
    { name: "Solis Ltd", hours: 280, budget: 90000 },
    { name: "Innova", hours: 210, budget: 60000 },
    { name: "Quantum", hours: 160, budget: 45000 },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

  const customTooltipStyle = {
    backgroundColor: "#18181b",
    borderColor: "#27272a",
    borderRadius: "12px",
    color: "#f4f4f5",
    fontSize: "11px",
    fontFamily: "Inter, sans-serif"
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100" id="analytics-panel-root">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-xl space-y-1">
        <h1 className="text-xl font-black text-white tracking-tight">Active Platform Analytics</h1>
        <p className="text-zinc-400 text-xs font-medium">Real-time charts plotting fundraising curves, employee engagement metrics, and ecological footprints.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">$82,000</h4>
            <p className="text-xs text-zinc-400 font-medium">Stripe Fundraising This Month</p>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">1,150 Hours</h4>
            <p className="text-xs text-zinc-400 font-medium">Active Volunteer Hours logged</p>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">98.4%</h4>
            <p className="text-xs text-zinc-400 font-medium">Fiduciary Resource Transparency</p>
          </div>
        </div>
      </div>

      {/* Recharts Plots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Area: Timeline Fundraising */}
        <div className="lg:col-span-8 glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-extrabold text-white tracking-tight">Active Fundraising Revenue Timeline</h3>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFunds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={10} fontStyle="bold" />
                <YAxis stroke="#71717a" fontSize={10} fontStyle="bold" />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area type="monotone" dataKey="raised" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFunds)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Area: Category Pie chart */}
        <div className="lg:col-span-4 glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-extrabold text-white tracking-tight font-sans">Social Hours Distribution</h3>
          
          <div className="h-72 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={causeBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {causeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={8} wrapperStyle={{ fontSize: "10px", color: "#a1a1aa" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Corporate Leaderboard */}
      <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white tracking-tight">CSR Corporate Sponsor Rankings</h3>
          <p className="text-zinc-400 text-xs">Total volunteer shift hours contributed by employee partners.</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={corporateSponsors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={10} fontStyle="bold" />
              <YAxis stroke="#71717a" fontSize={10} fontStyle="bold" />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="hours" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                {corporateSponsors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
