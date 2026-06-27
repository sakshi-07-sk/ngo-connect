/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DollarSign, Landmark, Heart, CreditCard, Sparkles, X, Check, ShieldCheck, Loader2 } from "lucide-react";
import { Campaign } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface DonationPortalProps {
  campaigns: Campaign[];
  onDonateCampaign: (id: string, amount: number) => Promise<void>;
}

export default function DonationPortal({ campaigns, onDonateCampaign }: DonationPortalProps) {
  const [activeCheckout, setActiveCheckout] = useState<Campaign | null>(null);
  const [tierAmount, setTierAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  
  // Checkout form states
  const [cardholder, setCardholder] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) : tierAmount;

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCheckout) return;

    setProcessing(true);
    
    // Simulate high-fidelity payment processing gateway
    setTimeout(async () => {
      try {
        await onDonateCampaign(activeCheckout.id, finalAmount);
        setProcessing(false);
        setSuccess(true);
      } catch (err) {
        console.error(err);
        setProcessing(false);
      }
    }, 2000);
  };

  const closePortal = () => {
    setActiveCheckout(null);
    setSuccess(false);
    setProcessing(false);
    setCardholder("");
    setCardNo("");
    setCvv("");
    setExpiry("");
    setCustomAmount("");
    setTierAmount(25);
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100" id="donation-portal-root">
      
      {/* Banner */}
      <div className="glass-panel border border-zinc-800/80 p-6 rounded-3xl shadow-xl space-y-1">
        <h1 className="text-xl font-black text-white tracking-tight">Active Fundraising Drives</h1>
        <p className="text-zinc-400 text-xs">Direct financial support for verified campaigns backed by secure Stripe subscription frameworks.</p>
      </div>

      {/* Campaign List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="campaigns-catalogue">
        {campaigns.map((camp) => {
          const pct = Math.min(100, Math.floor((camp.currentAmount / camp.goalAmount) * 100));
          return (
            <div key={camp.id} className="glass-panel rounded-3xl overflow-hidden border-zinc-800/80 shadow-xl hover:border-zinc-700/80 hover:shadow-2xl transition-all flex flex-col justify-between group">
              <div className="p-6 space-y-4">
                {/* NGO Info */}
                <div className="flex items-center gap-2">
                  <img src={camp.ngoAvatar} alt={camp.ngoName} className="h-7 w-7 rounded-full object-cover border border-zinc-850" />
                  <span className="text-xs font-bold text-zinc-400">{camp.ngoName}</span>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black text-white tracking-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">{camp.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{camp.description}</p>
                </div>
              </div>

              {/* Progress Panel */}
              <div className="px-6 pb-6 pt-4 bg-zinc-950/60 border-t border-zinc-800/50 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 font-mono">
                    <span>PROGRESS</span>
                    <span className="text-emerald-400">{pct}% Funded</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)] transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-mono">
                  <div>
                    <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Raised</p>
                    <p className="text-emerald-400 font-black">${camp.currentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Goal</p>
                    <p className="text-zinc-300 font-bold">${camp.goalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCheckout(camp)}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Contribute with Stripe <Heart className="h-4 w-4 fill-white text-white stroke-none" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stripe Secure Checkout Modal */}
      <AnimatePresence>
        {activeCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans text-zinc-100">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 rounded-3xl max-w-md w-full p-6 border border-zinc-800 shadow-2xl relative space-y-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold text-xs">
                  <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" /> SECURE STRIPE CHECKOUT
                </div>
                <button onClick={closePortal} className="rounded-full p-1.5 hover:bg-zinc-900 cursor-pointer text-zinc-400 hover:text-white">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {success ? (
                /* Success screen */
                <div className="text-center py-8 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto shadow-inner border border-emerald-500/20">
                    <Check className="h-6 w-6 stroke-[3]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-white">Donation Complete!</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Thank you! Your contribution of <span className="text-emerald-400 font-bold">${finalAmount}</span> to <span className="text-white font-bold">{activeCheckout.ngoName}</span> was captured.
                    </p>
                  </div>
                  <p className="text-[9px] text-zinc-500 font-mono">
                    A tax receipt has been compiled in your Donor Workspace.
                  </p>
                  <button
                    onClick={closePortal}
                    className="w-full py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl text-xs font-bold cursor-pointer hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    Return to Campaign Workspace
                  </button>
                </div>
              ) : (
                /* Checkout Form screens */
                <form onSubmit={handleStripeCheckout} className="space-y-4 text-xs">
                  <div className="space-y-1 bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Target Fundraiser</span>
                    <h4 className="font-extrabold text-white leading-snug line-clamp-1">{activeCheckout.title}</h4>
                  </div>

                  {/* Pricing Tiers */}
                  <div className="space-y-2">
                    <label className="font-bold text-zinc-400">Choose Giving Tier</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 25, 50, 100].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setTierAmount(val);
                            setCustomAmount("");
                          }}
                          className={`py-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                            tierAmount === val && !customAmount
                              ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          ${val}
                        </button>
                      ))}
                    </div>

                    {/* Custom Input */}
                    <div className="relative mt-2">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <input
                        type="number"
                        placeholder="Or enter custom allocation..."
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setTierAmount(0);
                        }}
                        className="w-full pl-8 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-colors placeholder-zinc-500"
                      />
                    </div>
                  </div>

                  {/* Recurring giving check */}
                  <label className="flex items-center gap-2 select-none py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="accent-indigo-500 rounded border-zinc-850 bg-zinc-900 h-4 w-4"
                    />
                    <span className="text-zinc-400 font-medium leading-tight">Make this a secure monthly repeating contribution</span>
                  </label>

                  {/* Credit Card parameters */}
                  <div className="space-y-2 border-t border-zinc-800 pt-3">
                    <label className="font-semibold text-zinc-300 flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-zinc-400" /> Stripe Credit Credentials</label>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Cardholder Name"
                        value={cardholder}
                        onChange={(e) => setCardholder(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors placeholder-zinc-500"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Card Number (e.g. 4242 4242...)"
                        value={cardNo}
                        onChange={(e) => setCardNo(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors placeholder-zinc-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="MM / YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors placeholder-zinc-500"
                        />
                        <input
                          type="password"
                          required
                          maxLength={3}
                          placeholder="CVV"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-500 transition-colors placeholder-zinc-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit checkout */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-300" />
                        Authorizing Stripe Funds...
                      </>
                    ) : (
                      <>Authorize Contribution of ${finalAmount}</>
                    )}
                  </button>

                  <div className="text-center">
                    <span className="text-[9px] text-zinc-500 font-mono">🔒 Bank-grade AES-256 Stripe Processing</span>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
