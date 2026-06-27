/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DollarSign, Landmark, Download, FileText, CheckCircle2, Award, ArrowUpRight, Calendar, Sparkles } from "lucide-react";
import { Campaign, Donation } from "../types";

interface DashboardDonorProps {
  donations: Donation[];
  campaigns: Campaign[];
  onNavigate: (view: string) => void;
}

export default function DashboardDonor({ donations, campaigns, onNavigate }: DashboardDonorProps) {
  const [activeReceipt, setActiveReceipt] = useState<Donation | null>(null);

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const activeSubs = donations.filter(d => d.isRecurring).length;

  return (
    <div className="space-y-8 font-sans text-zinc-100" id="donor-dashboard-root">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white tracking-tight">Fiduciary Donor Dashboard</h1>
          <p className="text-zinc-400 text-xs">Review historical tax-deductible Stripe transactions, generate 501(c)(3) statements, and manage active giving targets.</p>
        </div>

        <button
          onClick={() => onNavigate("donations")}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer transition-all"
        >
          <Landmark className="h-4.5 w-4.5" /> Support Active Drives
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">${totalDonated > 0 ? totalDonated.toLocaleString() : "450"}</h4>
            <p className="text-xs text-zinc-400 font-medium">My Cumulative Giving Ledger</p>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">{activeSubs} Active</h4>
            <p className="text-xs text-zinc-400 font-medium">Monthly Stripe Recurrencies</p>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white">100% Tax Exempt</h4>
            <p className="text-xs text-zinc-400 font-medium">Accredited Philanthropy Tier</p>
          </div>
        </div>
      </div>

      {/* Donation History table */}
      <div className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">Historical Stripe Transactions & Receipts</h3>
        
        {donations.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs italic space-y-2">
            <p>You have not made any donations yet during this sandbox session.</p>
            <p className="text-[10px] text-zinc-600">Click "Support Active Drives" above to perform a mock Stripe checkout transaction!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800/80 text-zinc-400 font-bold uppercase tracking-wider font-mono">
                  <th className="py-3 px-2">Campaign Target</th>
                  <th className="py-3 px-2">Association</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2 text-right">Fiduciary Receipt</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((don) => (
                  <tr key={don.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 transition-colors">
                    <td className="py-4.5 px-2 font-bold text-white">{don.campaignTitle}</td>
                    <td className="py-4.5 px-2 text-zinc-300 font-medium">{don.ngoName}</td>
                    <td className="py-4.5 px-2 font-black text-emerald-400">${don.amount.toLocaleString()}</td>
                    <td className="py-4.5 px-2 text-zinc-400 font-mono font-medium">{don.date}</td>
                    <td className="py-4.5 px-2 text-right">
                      <button
                        onClick={() => setActiveReceipt(don)}
                        className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 font-semibold text-[10px] rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <FileText className="h-3.5 w-3.5 text-zinc-400" /> View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 501(c)(3) Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-sans">
          <div className="bg-zinc-950/95 rounded-3xl max-w-md w-full p-6 border border-zinc-800/80 shadow-2xl space-y-6 relative text-zinc-100">
            {/* Header Stamp */}
            <div className="flex justify-between items-start border-b border-zinc-800/80 pb-4">
              <div className="space-y-1">
                <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold tracking-widest uppercase font-mono">501(C)(3) ACCREDITED RECEIPT</span>
                <h3 className="text-sm font-black text-white uppercase">NGO Connect Ledger</h3>
              </div>
              <CheckCircle2 className="h-6 w-6 text-emerald-400 fill-emerald-500/10" />
            </div>

            {/* Receipt Parameters */}
            <div className="space-y-4">
              <div className="space-y-1 text-center bg-zinc-900/60 py-4 rounded-2xl border border-zinc-800/60">
                <p className="text-[10px] text-zinc-400 uppercase font-mono font-bold tracking-wider">Amount Paid with Stripe</p>
                <h2 className="text-3xl font-black text-white">${activeReceipt.amount.toLocaleString()} USD</h2>
              </div>

              <div className="space-y-2 text-xs border-y border-zinc-800/60 py-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Recipient NGO:</span>
                  <span className="text-white font-bold">{activeReceipt.ngoName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Campaign Purpose:</span>
                  <span className="text-white font-bold max-w-xs truncate text-right">{activeReceipt.campaignTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Billing Date:</span>
                  <span className="text-white font-bold font-mono">{activeReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Fiduciary ID:</span>
                  <span className="text-white font-mono font-bold text-[10px] uppercase">{activeReceipt.id}</span>
                </div>
              </div>

              <p className="text-[9px] text-zinc-500 leading-relaxed italic text-center">
                This transaction serves as formal receipt. No goods or services were provided in exchange for this contribution, rendering it 100% tax-exempt.
              </p>
            </div>

            {/* Footer triggers */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => alert("Digital receipt print compiled. File download initiated.")}
                className="py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-500/10"
              >
                <Download className="h-3.5 w-3.5" /> PDF Download
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
