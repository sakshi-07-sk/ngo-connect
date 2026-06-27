/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Heart,
  Shield,
  Award,
  TrendingUp,
  Map,
  DollarSign,
  Users,
  MessageSquare,
  UserCircle,
  Settings,
  LogOut,
  Briefcase,
  Grid,
  Sparkles,
  ChevronRight,
  Check,
  X,
  CreditCard,
  Loader2,
  Lock,
  Zap
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  userRole: "volunteer" | "ngo" | "donor" | "csr" | "admin" | null;
  onLogout: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ activeView, onNavigate, userRole, onLogout, mobileOpen, onMobileClose }: SidebarProps) {
  if (!userRole) return null;

  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem("ngo_connect_pro_status") === "true";
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"starter" | "enterprise">("starter");
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCVC, setCardCVC] = useState("123");
  const [cardName, setCardName] = useState("Alex Impact");

  const handleUpgradeComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setUpgrading(true);
    setTimeout(() => {
      setUpgrading(false);
      setUpgradeSuccess(true);
      setIsPro(true);
      localStorage.setItem("ngo_connect_pro_status", "true");
    }, 1500);
  };

  const handleCancelSubscription = () => {
    setIsPro(false);
    localStorage.removeItem("ngo_connect_pro_status");
    setUpgradeSuccess(false);
    setShowUpgradeModal(false);
  };

  // Define sidebar links based on active user role
  const getLinks = () => {
    const common = [
      { id: "opportunities", label: "Opportunity Maps", icon: Map },
      { id: "donations", label: "Fundraising Drives", icon: DollarSign },
      { id: "feed", label: "Community Feed", icon: Users },
      { id: "forum", label: "Discussion Q&A", icon: MessageSquare },
    ];

    switch (userRole) {
      case "volunteer":
        return [
          { id: "volunteer_dashboard", label: "My Dashboard", icon: Grid },
          ...common,
          { id: "certificates", label: "My Certificates", icon: Award },
          { id: "volunteer_profile", label: "Edit Profile", icon: UserCircle },
          { id: "volunteer_resume", label: "AI Resume", icon: Briefcase },
          { id: "analytics", label: "Impact Analytics", icon: TrendingUp },
          { id: "settings", label: "Settings", icon: Settings }
        ];
      case "ngo":
        return [
          { id: "ngo_dashboard", label: "NGO Workspace", icon: Shield },
          ...common,
          { id: "ngo_profile", label: "NGO Public Profile", icon: UserCircle },
          { id: "analytics", label: "Fundraiser Analytics", icon: TrendingUp },
          { id: "settings", label: "Settings", icon: Settings }
        ];
      case "donor":
        return [
          { id: "donor_dashboard", label: "Donor Portal", icon: Sparkles },
          ...common,
          { id: "analytics", label: "Financial Charts", icon: TrendingUp },
          { id: "settings", label: "Settings", icon: Settings }
        ];
      case "csr":
        return [
          { id: "csr_dashboard", label: "Corporate CSR", icon: Briefcase },
          ...common,
          { id: "analytics", label: "CSR Analytics", icon: TrendingUp },
          { id: "settings", label: "Settings", icon: Settings }
        ];
      case "admin":
        return [
          { id: "admin_dashboard", label: "Admin Board", icon: Shield },
          ...common,
          { id: "analytics", label: "Platform Metrics", icon: TrendingUp },
          { id: "settings", label: "Settings", icon: Settings }
        ];
      default:
        return common;
    }
  };

  const links = getLinks();

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case "volunteer": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "ngo": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "donor": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "csr": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "admin": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
  };

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onMobileClose} 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          id="sidebar-mobile-backdrop"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-zinc-800/80 min-h-screen flex flex-col justify-between select-none font-sans shrink-0 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`} 
        id="app-sidebar-root"
      >
        <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            {/* Logo / Brand Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleLinkClick("landing")}>
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/10">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  </div>
                </div>
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">NGO Connect</span>
              </div>

              {/* Close Button on Mobile Drawer */}
              {onMobileClose && (
                <button 
                  onClick={onMobileClose}
                  className="lg:hidden p-1.5 rounded-lg border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-900"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Current Active Persona Badge */}
            <div className={`p-3.5 rounded-2xl flex items-center justify-between border ${getRoleBadgeColor()}`}>
              <div className="space-y-0.5">
                <p className="text-[8px] uppercase tracking-widest opacity-60 font-mono font-bold">Active Role</p>
                <p className="text-xs font-bold capitalize text-white">{userRole === "csr" ? "CSR Corporate" : userRole === "ngo" ? "NGO Representative" : userRole}</p>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50 text-white" />
            </div>

            {/* Navigation lists */}
            <nav className="space-y-1" id="sidebar-navigation">
              {links.map((link) => {
                const Icon = link.icon;
                const isSelected = activeView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`w-full flex items-center gap-3 p-3 text-xs font-semibold rounded-xl transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-300 border-l-2 border-indigo-500 font-bold"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${isSelected ? "text-indigo-400" : "text-zinc-500"}`} />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Pro card integration */}
          <div className="mt-8">
            {isPro ? (
              <div className="bg-zinc-900/60 border border-indigo-500/30 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 fill-amber-400" /> Pro Member Active
                  </p>
                  <h4 className="text-xs font-semibold mb-3">AI Matching & Credentials Enabled</h4>
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-white shadow-md shadow-indigo-500/10"
                  >
                    Manage Membership
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl"></div>
              </div>
            ) : (
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider mb-1">Pro Volunteer</p>
                  <h4 className="text-xs font-semibold mb-3">Unlock AI Matching</h4>
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-white shadow-md shadow-indigo-500/10"
                  >
                    Upgrade Now
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-600/10 rounded-full blur-xl"></div>
              </div>
            )}
          </div>
        </div>

        {/* Footer logout button */}
        <div className="p-6 border-t border-zinc-800/85 space-y-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
            id="sidebar-logout-button"
          >
            <LogOut className="h-4.5 w-4.5 text-red-400" />
            <span>Sign Out Session</span>
          </button>
          <div className="text-center">
            <span className="text-[9px] text-zinc-500 font-mono">v1.3.0 • Cyberpunk Slate Dark Theme</span>
          </div>
        </div>

        {/* Stateful Pro Upgrade Modal Container */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" id="upgrade-modal-backdrop">
            <div className="bg-zinc-950/95 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-800/80 flex flex-col relative max-h-[95vh] text-zinc-100" id="upgrade-modal-content">
              {/* Header banner */}
              <div className="bg-gradient-to-br from-indigo-950 to-zinc-950 p-6 text-white relative border-b border-zinc-800/80">
                <button 
                  onClick={() => {
                    setShowUpgradeModal(false);
                    if (upgradeSuccess) {
                      setUpgradeSuccess(false);
                    }
                  }}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white rounded-full p-1.5 hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
                <div className="flex items-center gap-2 mb-1.5 text-indigo-400 font-bold uppercase tracking-widest text-[9px]">
                  <Sparkles className="h-4 w-4 fill-indigo-400" /> NGO Connect Premium
                </div>
                <h3 className="text-lg font-bold tracking-tight">Upgrade Your Impact Workspace</h3>
                <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                  Supercharge volunteer matching, resume compilations, & cert issuance.
                </p>
              </div>

              {upgradeSuccess ? (
                /* SUCCESS STATE */
                <div className="p-6 text-center flex-1 overflow-y-auto space-y-6">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    <Check className="h-7 w-7 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-white">Workspace Upgraded to Pro!</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                      Your subscription is active. AI-driven matching and custom ledger templates are now fully unlocked.
                    </p>
                  </div>
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 text-left space-y-2 max-w-xs mx-auto">
                    <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase tracking-wider">
                      <span>Invoice</span>
                      <span className="text-indigo-400 font-bold">Stripe SECURED</span>
                    </div>
                    <div className="h-[1px] bg-zinc-800"></div>
                    <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
                      <span>Selected Plan</span>
                      <span className="capitalize">{selectedTier}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
                      <span>Status</span>
                      <span className="text-emerald-400 font-bold">Active Premium</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUpgradeModal(false);
                      setUpgradeSuccess(false);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Enter Pro Workspace
                  </button>
                </div>
              ) : isPro ? (
                /* ALREADY PRO STATE */
                <div className="p-6 text-center flex-1 overflow-y-auto space-y-6">
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400 border border-indigo-500/20 shadow-md">
                    <Zap className="h-6 w-6 fill-indigo-500/10 text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-white">Your Subscription is Active</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                      You have full access to pro tools, premium resume builders, and verification desks.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-zinc-850 max-w-sm mx-auto space-y-3">
                    <div className="flex items-center justify-between text-xs bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                      <span className="font-semibold text-zinc-300">Current Plan</span>
                      <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[9px] font-bold uppercase tracking-wider">PRO LIFE</span>
                    </div>
                    <button
                      onClick={handleCancelSubscription}
                      className="w-full py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              ) : (
                /* UPGRADE FORM STATE */
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Tier Selection */}
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Select Billing Tier</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTier("starter")}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedTier === "starter" 
                            ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/10" 
                            : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-400"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-black text-white">Impact Pro</span>
                          <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedTier === "starter" ? "border-indigo-500" : "border-zinc-700"}`}>
                            {selectedTier === "starter" && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                          </div>
                        </div>
                        <p className="text-[9px] text-zinc-400 mt-0.5">Instant AI Matcher.</p>
                        <p className="text-xs font-black text-white mt-2">$4.99<span className="text-[8px] font-normal text-zinc-500">/mo</span></p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTier("enterprise")}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedTier === "enterprise" 
                            ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/10" 
                            : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-400"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-black text-white">NGO Desk</span>
                          <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedTier === "enterprise" ? "border-indigo-500" : "border-zinc-700"}`}>
                            {selectedTier === "enterprise" && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                          </div>
                        </div>
                        <p className="text-[9px] text-zinc-400 mt-0.5">Verified certificates.</p>
                        <p className="text-xs font-black text-white mt-2">$19.99<span className="text-[8px] font-normal text-zinc-500">/mo</span></p>
                      </button>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                        <span>AI Matcher Engine</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                        <span>Ledger Verified Certs</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                        <span>Bypass Capacity Caps</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                        <span>Priority Support</span>
                      </div>
                    </div>
                  </div>

                  {/* Secure Card Form */}
                  <form onSubmit={handleUpgradeComplete} className="space-y-3 pt-3 border-t border-zinc-800/60">
                    <div className="space-y-2">
                      <p className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                        <Lock className="h-3 w-3 text-zinc-500" /> SECURE CARD TRANSACT (STRIPE)
                      </p>
                      <div className="space-y-2.5 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                        <div>
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">Card Number</label>
                          <div className="relative">
                            <CreditCard className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                            <input
                              type="text"
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-[11px] font-semibold text-white outline-none focus:border-indigo-500 transition-all placeholder-zinc-600"
                              placeholder="4242 4242 4242 4242"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">Expiry</label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-[11px] font-semibold text-white outline-none focus:border-indigo-500 transition-all placeholder-zinc-600"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">CVV</label>
                            <input
                              type="password"
                              required
                              maxLength={4}
                              value={cardCVC}
                              onChange={(e) => setCardCVC(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-[11px] font-semibold text-white outline-none focus:border-indigo-500 transition-all placeholder-zinc-600"
                              placeholder="•••"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-[11px] font-semibold text-white outline-none focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={upgrading}
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-indigo-800 disabled:to-purple-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {upgrading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Authorizing...
                        </>
                      ) : (
                        <>
                          Upgrade • {selectedTier === "starter" ? "$4.99" : "$19.99"}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
