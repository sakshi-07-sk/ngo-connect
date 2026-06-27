/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Sparkles, LogIn, Mail, Lock, User, Plus, Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface AuthPageProps {
  onLoginSuccess: (role: "volunteer" | "ngo" | "donor" | "csr" | "admin") => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [role, setRole] = useState<"volunteer" | "ngo" | "donor" | "csr" | "admin">("volunteer");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  const roleDetails = [
    { id: "volunteer", title: "Volunteer", desc: "Discover events, earn points, and draft AI resumes", icon: User, color: "border-indigo-500/30 bg-indigo-500/5 text-indigo-400" },
    { id: "ngo", title: "NGO Rep", desc: "Manage opportunities, verify attendance, and check analytics", icon: Shield, color: "border-blue-500/30 bg-blue-500/5 text-blue-400" },
    { id: "donor", title: "Donor", desc: "Contribute to campaigns and view historical tax receipts", icon: Sparkles, color: "border-amber-500/30 bg-amber-500/5 text-amber-400" },
    { id: "csr", title: "Corporate Partner", desc: "Track CSR budgets and coordinate employee hours", icon: Plus, color: "border-purple-500/30 bg-purple-500/5 text-purple-400" },
    { id: "admin", title: "Platform Admin", desc: "Review registrations, verify NGOs, and moderate posts", icon: LogIn, color: "border-rose-500/30 bg-rose-500/5 text-rose-400" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (isSignUp && !showOtp) {
        // Trigger simulated OTP
        setShowOtp(true);
      } else {
        // Log in immediately
        onLoginSuccess(role);
      }
    }, 1200);
  };

  const handleQuickLogin = (selectedRole: "volunteer" | "ngo" | "donor" | "csr" | "admin") => {
    onLoginSuccess(selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center py-12 px-4 sm:px-6 font-sans text-zinc-100" id="auth-page-root">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-zinc-950/60 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800/80 backdrop-blur-xl" id="auth-box-wrapper">
        
        {/* Left Side: Brand & Quick Demo Access */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/80 to-zinc-950 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800/80" id="auth-brand-pane">
          <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative space-y-3.5 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 rounded-full border border-zinc-800 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> NGO Connect Platform
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Access NGO Connect</h2>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Sign in to manage campaigns, match volunteer skills, track corporate social responsibility hours, or moderate public activity instantly.
            </p>
          </div>

          {/* Quick Sandbox Login buttons */}
          <div className="relative space-y-3.5 z-10 pt-8" id="quick-sandbox-signins">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Sandbox Quick Sign-In</p>
            
            <div className="grid grid-cols-1 gap-2">
              {roleDetails.map((rl) => {
                const Icon = rl.icon;
                return (
                  <button
                    key={rl.id}
                    onClick={() => handleQuickLogin(rl.id as any)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 text-left text-xs font-semibold tracking-wide text-zinc-200 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-indigo-400" />
                      <span>Demo {rl.title}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:translate-x-1 transition-transform group-hover:text-white" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative text-[10px] text-zinc-500 font-mono mt-8 z-10">
            Secure Full-Stack Node Environment
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-6 bg-zinc-950/20" id="auth-form-pane">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isSignUp ? "Create Impact Account" : "Welcome Back"}
            </h1>
            <p className="text-zinc-400 text-xs">
              {isSignUp ? "Join the premium community of active helpers." : "Log in to proceed to your role dashboard."}
            </p>
          </div>

          {/* Role selector */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">Select Your Persona Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" id="role-selector-container">
              {roleDetails.map((rl) => (
                <button
                  key={rl.id}
                  onClick={() => setRole(rl.id as any)}
                  type="button"
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    role === rl.id 
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5" 
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <rl.icon className={`h-4.5 w-4.5 mb-1 ${role === rl.id ? "text-emerald-400" : "text-zinc-500"}`} />
                  <span className="text-[10px] font-bold truncate max-w-full">{rl.title}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 italic">
              * Demands, analytics, permissions and viewports auto-configure based on selected role.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="credentials-form">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Full Name / NGO Registered Title</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe / Clean Oceans Initiative"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 focus:border-emerald-500 focus:bg-zinc-900 text-xs text-white outline-none transition-all placeholder-zinc-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 focus:border-emerald-500 focus:bg-zinc-900 text-xs text-white outline-none transition-all placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 focus:border-emerald-500 focus:bg-zinc-900 text-xs text-white outline-none transition-all placeholder-zinc-500"
                />
              </div>
            </div>

            {/* OTP Simulation Block */}
            {showOtp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5 bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl"
              >
                <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 animate-spin text-amber-500" /> OTP Verification Key Sent
                </label>
                <p className="text-[10px] text-zinc-400">
                  Please verify your identity. Enter the simulated code **123456** to complete high-fidelity enrollment.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3 py-2 text-center text-sm font-bold tracking-widest rounded-lg border border-zinc-800 bg-zinc-900 focus:border-emerald-500 focus:outline-none text-white"
                />
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
            >
              {loading ? (
                "Processing Identity..."
              ) : showOtp ? (
                "Verify OTP & Authenticate"
              ) : isSignUp ? (
                "Register & Send Verification Token"
              ) : (
                "Secure Sign In"
              )}
            </button>
          </form>

          {/* Toggle Login vs Sign-up */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setShowOtp(false);
              }}
              className="text-xs text-zinc-400 hover:text-white font-bold cursor-pointer transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need a social impact workspace? Register as NGO/Volunteer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
