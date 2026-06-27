/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  MapPin, 
  Mail, 
  User, 
  Shield, 
  Settings, 
  Award, 
  TrendingUp, 
  Compass, 
  CheckCircle2, 
  Bell, 
  Lock, 
  FileText, 
  LogIn, 
  Eye, 
  Loader2, 
  Printer,
  Menu,
  Moon,
  Sun,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import Custom Modular Components
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import Chatbot from "./components/Chatbot";
import DashboardVolunteer from "./components/DashboardVolunteer";
import DashboardNGO from "./components/DashboardNGO";
import DashboardDonor from "./components/DashboardDonor";
import DashboardCSR from "./components/DashboardCSR";
import DashboardAdmin from "./components/DashboardAdmin";
import OpportunityList from "./components/OpportunityList";
import DonationPortal from "./components/DonationPortal";
import CommunityFeed from "./components/CommunityFeed";
import DiscussionForum from "./components/DiscussionForum";
import AnalyticsPanel from "./components/AnalyticsPanel";

import { 
  NGOProfile, 
  Opportunity, 
  Campaign, 
  CommunityPost, 
  DiscussionThread, 
  VolunteerProfile, 
  CorporateCSR, 
  Donation, 
  Certificate 
} from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<string>("landing");
  const [userRole, setUserRole] = useState<"volunteer" | "ngo" | "donor" | "csr" | "admin" | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Global In-Memory Data State
  const [ngos, setNgos] = useState<NGOProfile[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [volunteer, setVolunteer] = useState<VolunteerProfile | null>(null);
  const [csr, setCsr] = useState<CorporateCSR | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Certificate printing simulator state
  const [printCert, setPrintCert] = useState<Certificate | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);

  // Dynamic light/dark theme state
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("ngo_connect_theme") as "light" | "dark") || "dark"
  );

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light-theme");
      document.documentElement.classList.remove("dark-theme");
    } else {
      document.documentElement.classList.add("dark-theme");
      document.documentElement.classList.remove("light-theme");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("ngo_connect_theme", newTheme);
  };

  const handleScrollTo = (id: string) => {
    if (activeView !== "landing") {
      setActiveView("landing");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Fetch full state on mount
  const fetchState = async () => {
    try {
      const res = await fetch("/api/state");
      const data = await res.json();
      setNgos(data.ngos);
      setOpportunities(data.opportunities);
      setCampaigns(data.campaigns);
      setPosts(data.posts);
      setThreads(data.threads);
      setVolunteer(data.volunteer);
      setCsr(data.csr);
      setDonations(data.donations);
      setCertificates(data.certificates);
    } catch (err) {
      console.error("Failed to fetch initial state", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Operation Handlers
  const handleLoginSuccess = (role: "volunteer" | "ngo" | "donor" | "csr" | "admin") => {
    setUserRole(role);
    switch(role) {
      case "volunteer":
        setActiveView("volunteer_dashboard");
        break;
      case "ngo":
        setActiveView("ngo_dashboard");
        break;
      case "donor":
        setActiveView("donor_dashboard");
        break;
      case "csr":
        setActiveView("csr_dashboard");
        break;
      case "admin":
        setActiveView("admin_dashboard");
        break;
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveView("landing");
  };

  const handleApplyOpportunity = async (oppId: string) => {
    try {
      const res = await fetch(`/api/opportunities/${oppId}/apply`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("Success! You have applied for the shift. 50 points earned and digital certificate issued!");
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOpportunity = async (oppData: any) => {
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(oppData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Event scheduled and published successfully!");
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCampaign = async (campData: any) => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Fundraising campaign drive launched and published!");
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDonateCampaign = async (campId: string, amount: number) => {
    try {
      const res = await fetch(`/api/campaigns/${campId}/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, donorName: volunteer?.name, donorEmail: volunteer?.email })
      });
      const data = await res.json();
      if (data.success) {
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPost = async (content: string) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, authorRole: userRole })
      });
      const data = await res.json();
      if (data.success) {
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      await fetchState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentPost = async (postId: string, content: string) => {
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      await fetchState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddThread = async (title: string, content: string, tags: string[]) => {
    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags })
      });
      const data = await res.json();
      if (data.success) {
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvoteThread = async (threadId: string) => {
    // Simple local-friendly incremental upvote
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t));
  };

  const handleReplyThread = async (threadId: string, content: string) => {
    try {
      const res = await fetch(`/api/threads/${threadId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.success) {
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyNGO = async (ngoId: string, status: "approve" | "reject") => {
    try {
      const res = await fetch(`/api/ngos/${ngoId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // State update for profile edits
  const handleUpdateProfile = (field: string, value: any) => {
    if (!volunteer) return;
    const updated = { ...volunteer, [field]: value };
    setVolunteer(updated);
    alert("Profile changes stored temporarily in session state!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center font-sans space-y-4" id="app-loading-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <h3 className="text-sm font-bold text-zinc-300 tracking-wide animate-pulse">Booting Premium NGO Connect Workspace...</h3>
      </div>
    );
  }

  return (
    <div className="flex bg-[#0A0A0A] min-h-screen text-zinc-100 font-sans" id="app-container-root">
      
      {/* Dynamic Left Sidebar if logged in */}
      {userRole && (
        <Sidebar 
          activeView={activeView} 
          onNavigate={setActiveView} 
          userRole={userRole} 
          onLogout={handleLogout} 
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content viewport */}
      <main className="flex-1 overflow-y-auto flex flex-col" id="main-applet-viewport">
        
        {/* Global Public Navbar when not logged in */}
        {!userRole && (
          <header className="sticky top-0 bg-[#0A0A0A]/90 border-b border-zinc-800/80 backdrop-blur-md px-4 sm:px-8 py-4.5 z-40 flex justify-between items-center max-w-7xl w-full mx-auto rounded-b-3xl shadow-2xl shadow-emerald-950/5" id="public-header">
            {/* Left Brand Area */}
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => handleScrollTo("landing-page-root")}>
              <div className="flex items-center gap-2 text-emerald-400">
                <svg className="h-8 w-8 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 78 C35 68 22 52 22 36 C22 23 32 16 42 24 C47 28 49 34 50 36 C51 34 53 28 58 24 C68 16 78 23 78 36 C78 52 65 68 50 78 Z" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="37" cy="38" r="6.5" fill="currentColor" />
                  <circle cx="63" cy="38" r="6.5" fill="currentColor" />
                  <path d="M38 52 C42 47 48 47 50 50 C52 47 58 47 62 52" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">NGO Connect</span>
              </div>
            </div>

            {/* Middle Links (Exactly like photo) */}
            <nav className="hidden md:flex items-center gap-6 text-[11px] font-extrabold uppercase tracking-widest">
              <button 
                onClick={() => handleScrollTo("landing-page-root")} 
                className="relative text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex flex-col items-center group py-1"
              >
                <span>Home</span>
                <span className="absolute bottom-[-6px] w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </button>
              
              <button 
                onClick={() => handleScrollTo("benefits-section")} 
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer py-1 font-sans"
              >
                About Us
              </button>
              
              <button 
                onClick={() => setActiveView("opportunities")} 
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer py-1 font-sans"
              >
                Opportunities
              </button>
              
              <button 
                onClick={() => handleScrollTo("campaigns-landing-panel")} 
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer py-1 font-sans"
              >
                NGOs
              </button>
              
              <button 
                onClick={() => handleScrollTo("stats-ticker-board")} 
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer py-1 font-sans"
              >
                Impact
              </button>
              
              <button 
                onClick={() => setShowPricingModal(true)} 
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer py-1 font-sans"
              >
                Pricing
              </button>
              
              <button 
                onClick={() => handleScrollTo("cta-landing")} 
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer py-1 font-sans"
              >
                Contact
              </button>
            </nav>

            {/* Right Buttons Area */}
            <div className="flex items-center gap-4">
              {/* Theme light/dark selector */}
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 cursor-pointer transition-all hover:scale-105 duration-200 flex items-center justify-center"
                title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              >
                {theme === "dark" ? (
                  <Moon className="h-4.5 w-4.5 text-emerald-400 drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
                ) : (
                  <Sun className="h-4.5 w-4.5 text-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]" />
                )}
              </button>

              <button 
                onClick={() => setActiveView("auth")} 
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white rounded-full font-extrabold flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 active:translate-y-0 text-xs uppercase tracking-wider font-mono"
              >
                Get Started <LogIn className="h-4 w-4" />
              </button>
            </div>
          </header>
        )}

        {/* Top Header when Logged In */}
        {userRole && (
          <header className="h-20 bg-zinc-950/60 border-b border-zinc-800/60 px-4 sm:px-8 flex items-center justify-between shrink-0 backdrop-blur-lg gap-4" id="logged-in-topbar">
            <div className="flex items-center gap-3">
              {/* Responsive sidebar trigger button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700 cursor-pointer transition-colors"
                id="sidebar-mobile-toggle"
              >
                <Menu className="h-4.5 w-4.5" />
              </button>
              
              <div className="hidden sm:flex items-center gap-3 bg-zinc-900/40 px-4 py-2 rounded-full w-48 md:w-80 border border-zinc-800/40">
                <Compass className="h-4 w-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search for NGOs, skills, or causes..." 
                  className="bg-transparent border-none outline-none text-xs w-full text-zinc-100 placeholder-zinc-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Theme toggle for logged-in users */}
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 cursor-pointer transition-all hover:scale-105 duration-200 flex items-center justify-center"
                title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              >
                {theme === "dark" ? (
                  <Moon className="h-4.5 w-4.5 text-emerald-400 drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
                ) : (
                  <Sun className="h-4.5 w-4.5 text-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]" />
                )}
              </button>

              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-zinc-100">
                  {userRole === "volunteer" ? (volunteer?.name || "Active Volunteer") : 
                   userRole === "ngo" ? (ngos[0]?.name || "NGO Director") : 
                   userRole === "csr" ? (csr?.company || "CSR Leader") : 
                   "Platform Administrator"}
                </span>
                <span className="text-[9px] sm:text-[10px] text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  {userRole === "volunteer" ? "Gold Contributor" : "Verified Account"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-indigo-400 text-xs uppercase font-mono shadow-inner shadow-black/40 shrink-0">
                {userRole === "volunteer" ? (volunteer?.name?.[0] || "V") : 
                 userRole === "ngo" ? (ngos[0]?.name?.[0] || "N") : 
                 userRole === "csr" ? (csr?.company?.[0] || "C") : "A"}
              </div>
            </div>
          </header>
        )}

        <div className="p-4 sm:p-8 space-y-8 flex-1" id="dynamic-view-panel">
          
          <AnimatePresence mode="wait">
            
            {/* Landing Page Route */}
            {activeView === "landing" && (
              <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LandingPage 
                  campaigns={campaigns} 
                  ngos={ngos} 
                  opportunities={opportunities} 
                  onNavigate={setActiveView}
                  onJoinAsVolunteer={() => setActiveView("auth")}
                />
              </motion.div>
            )}

            {/* Auth / Login Route */}
            {activeView === "auth" && (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AuthPage onLoginSuccess={handleLoginSuccess} />
              </motion.div>
            )}

            {/* Volunteer Dashboard */}
            {activeView === "volunteer_dashboard" && volunteer && (
              <motion.div key="volunteer_db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DashboardVolunteer 
                  volunteer={volunteer} 
                  opportunities={opportunities} 
                  certificates={certificates} 
                  onNavigate={setActiveView} 
                />
              </motion.div>
            )}

            {/* NGO workspace */}
            {activeView === "ngo_dashboard" && ngos[0] && (
              <motion.div key="ngo_db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DashboardNGO 
                  ngo={ngos[0]} 
                  opportunities={opportunities} 
                  campaigns={campaigns} 
                  donations={donations}
                  onAddOpportunity={handleAddOpportunity}
                  onAddCampaign={handleAddCampaign}
                />
              </motion.div>
            )}

            {/* Donor Portal */}
            {activeView === "donor_dashboard" && (
              <motion.div key="donor_db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DashboardDonor 
                  donations={donations} 
                  campaigns={campaigns} 
                  onNavigate={setActiveView} 
                />
              </motion.div>
            )}

            {/* Corporate CSR */}
            {activeView === "csr_dashboard" && csr && (
              <motion.div key="csr_db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DashboardCSR csr={csr} onNavigate={setActiveView} />
              </motion.div>
            )}

            {/* Platform Admin dashboard */}
            {activeView === "admin_dashboard" && (
              <motion.div key="admin_db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DashboardAdmin ngos={ngos} onVerifyNGO={handleVerifyNGO} />
              </motion.div>
            )}

            {/* Opportunity Map Directory */}
            {activeView === "opportunities" && (
              <motion.div key="opps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <OpportunityList opportunities={opportunities} onApplyOpportunity={handleApplyOpportunity} />
              </motion.div>
            )}

            {/* Donations Drives */}
            {activeView === "donations" && (
              <motion.div key="donations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DonationPortal campaigns={campaigns} onDonateCampaign={handleDonateCampaign} />
              </motion.div>
            )}

            {/* Community Feed */}
            {activeView === "feed" && (
              <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CommunityFeed 
                  posts={posts} 
                  onAddPost={handleAddPost} 
                  onLikePost={handleLikePost} 
                  onCommentPost={handleCommentPost} 
                />
              </motion.div>
            )}

            {/* Discussion Q&A Forum */}
            {activeView === "forum" && (
              <motion.div key="forum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DiscussionForum 
                  threads={threads} 
                  onAddThread={handleAddThread} 
                  onUpvoteThread={handleUpvoteThread} 
                  onReplyThread={handleReplyThread} 
                />
              </motion.div>
            )}

            {/* Impact Recharts Analytics */}
            {activeView === "analytics" && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnalyticsPanel />
              </motion.div>
            )}

            {/* Certificates Page */}
            {activeView === "certificates" && (
              <motion.div key="certs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl shadow-2xl space-y-1">
                  <h1 className="text-xl font-black text-white tracking-tight">Accredited Impact Certificates</h1>
                  <p className="text-zinc-400 text-xs font-medium">Download or review verifiably signed accomplishments certified by our non-profit partners.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="glass-panel border-zinc-800/80 p-6 rounded-3xl shadow-lg space-y-4 hover:border-zinc-700 hover:shadow-xl transition-all flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="inline-flex px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold tracking-widest uppercase font-mono">ACCREDITED CERTIFICATE</span>
                          <span className="text-[9px] text-zinc-400 font-mono font-bold bg-zinc-900 px-2 py-0.5 rounded-md">XP: {cert.hours} HOURS</span>
                        </div>
                        <h3 className="text-sm font-extrabold text-white leading-snug">{cert.title}</h3>
                        <p className="text-[10px] text-zinc-400">Issued by: <span className="text-indigo-400 font-bold">{cert.ngoName}</span> on {cert.date}</p>
                      </div>

                      <button
                        onClick={() => setPrintCert(cert)}
                        className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 font-semibold text-[10px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-zinc-200 transition-all"
                      >
                        <Eye className="h-3.5 w-3.5 text-zinc-500" /> View Frame
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Edit Volunteer Profile Page */}
            {activeView === "volunteer_profile" && volunteer && (
              <motion.div key="v_profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl shadow-2xl space-y-1">
                  <h1 className="text-xl font-black text-white tracking-tight">Modify Identity Credentials</h1>
                  <p className="text-zinc-400 text-xs">Manage biographical data, languages spoken, and matchable skill keywords.</p>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-zinc-800/80 shadow-lg max-w-2xl space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Display Bio</label>
                    <textarea 
                      value={volunteer.bio} 
                      onChange={(e) => handleUpdateProfile("bio", e.target.value)}
                      className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950/80 outline-none text-xs text-zinc-100 h-24 resize-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-zinc-300">Skills Keywords (comma separated)</label>
                      <input 
                        type="text" 
                        value={volunteer.skills.join(", ")} 
                        onChange={(e) => handleUpdateProfile("skills", e.target.value.split(",").map(s => s.trim()))}
                        className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950/80 outline-none text-zinc-100 focus:border-indigo-500/80"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-zinc-300">Interests Areas (comma separated)</label>
                      <input 
                        type="text" 
                        value={volunteer.interests.join(", ")} 
                        onChange={(e) => handleUpdateProfile("interests", e.target.value.split(",").map(i => i.trim()))}
                        className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950/80 outline-none text-zinc-100 focus:border-indigo-500/80"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Public NGO Profiles Directory view */}
            {activeView === "ngo_profile" && (
              <motion.div key="ngo_profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl shadow-2xl space-y-1">
                  <h1 className="text-xl font-black text-white tracking-tight">Registered Non-Profits</h1>
                  <p className="text-zinc-400 text-xs">Direct review of verified social associations and non-profit credentials.</p>
                </div>

                <div className="space-y-6">
                  {ngos.map((ngo) => (
                    <div key={ngo.id} className="glass-panel border-zinc-800/80 p-6 rounded-3xl shadow-lg flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:border-zinc-700 transition-all">
                      <div className="flex gap-4 items-start">
                        <img src={ngo.avatar} alt={ngo.name} className="h-14 w-14 rounded-2xl object-cover border border-zinc-800 bg-zinc-900" />
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-black text-white leading-snug">{ngo.name}</h3>
                          <p className="text-xs text-zinc-400 max-w-xl">{ngo.bio}</p>
                          <p className="text-[10px] text-zinc-500 font-mono font-medium">Gov ID: {ngo.registrationNo} • {ngo.location}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          <Shield className="h-3.5 w-3.5 fill-blue-500/20 text-blue-400" /> Government Accredited
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Resume view shortcut */}
            {activeView === "volunteer_resume" && volunteer && (
              <motion.div key="v_resume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DashboardVolunteer 
                  volunteer={volunteer} 
                  opportunities={opportunities} 
                  certificates={certificates} 
                  onNavigate={setActiveView} 
                />
              </motion.div>
            )}

            {/* Settings Page Route */}
            {activeView === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl shadow-2xl space-y-1">
                  <h1 className="text-xl font-black text-white tracking-tight">Workspace Preferences</h1>
                  <p className="text-zinc-400 text-xs">Manage system notification preferences, simulated keys, and security settings.</p>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-zinc-800/80 shadow-lg max-w-2xl space-y-6">
                  {/* Preferences block */}
                  <div className="space-y-3.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">Notification toggles</h3>
                    
                    <div className="space-y-2.5 text-xs text-zinc-300">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-indigo-500 h-4 w-4 rounded border-zinc-800" />
                        <span className="font-medium">Simulate email dispatch on approved shift RSVPs</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-indigo-500 h-4 w-4 rounded border-zinc-800" />
                        <span className="font-medium">Accept corporate CSR sponsorship matching alerts</span>
                      </label>
                    </div>
                  </div>

                  {/* GDPR Policy Mock */}
                  <div className="space-y-3.5 border-t border-zinc-800/80 pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono flex items-center gap-1">
                      <Lock className="h-4 w-4 text-zinc-500" /> Privacy & Encryption
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      All identity parameters, government licenses, and credential assets are encrypted in compliance with GDPR standards.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Floating Chatbot Assistant */}
      <Chatbot userProfile={volunteer} />

      {/* High-Fidelity Certificate View overlay */}
      {printCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-serif">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-2xl w-full p-8 md:p-12 border-8 border-amber-800 shadow-2xl relative space-y-8 text-amber-950 text-center">
            
            {/* Header Stamp */}
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold tracking-widest text-amber-800 uppercase">OFFICIAL ACCREDITATION CERTIFICATE</span>
              <h2 className="text-3xl font-extrabold tracking-wide uppercase">NGO CONNECT ALLIANCE</h2>
            </div>

            {/* Statement */}
            <div className="space-y-4">
              <p className="text-sm italic">This is to verifiably certify and recognize that</p>
              <h1 className="text-4xl font-black tracking-tight text-amber-900 capitalize border-b border-dashed border-amber-800/40 pb-2 inline-block max-w-full truncate px-4">{printCert.recipientName}</h1>
              
              <p className="text-xs leading-relaxed max-w-md mx-auto italic">
                has completed <strong className="text-amber-900 font-bold">{printCert.hours} hours</strong> of certified social service, demonstrating extraordinary leadership and community support.
              </p>
            </div>

            {/* Issued By */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-900 font-sans">{printCert.title}</p>
              <p className="text-[10px] text-amber-800">Authorized Issuer: <strong>{printCert.ngoName}</strong></p>
              <p className="text-[10px] text-amber-700 font-mono">Issued: {printCert.date}</p>
            </div>

            {/* Seal & Credential Code */}
            <div className="flex flex-col items-center gap-2 border-t border-amber-800/10 pt-6">
              <span className="text-[8px] font-sans font-mono tracking-widest bg-amber-800/10 text-amber-800 px-3 py-1 rounded-full uppercase">
                VERIFIABLE ID: {printCert.credentialCode}
              </span>
            </div>

            {/* Print trigger */}
            <div className="flex justify-center gap-3 font-sans pt-2">
              <button
                onClick={() => {
                  alert("Accredited frame printed successfully. Retained in ledger.");
                }}
                className="px-4.5 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-950/20"
              >
                <Printer className="h-4 w-4" /> Print Certificate
              </button>
              <button
                onClick={() => setPrintCert(null)}
                className="px-4.5 py-2 border border-amber-800/30 text-amber-800 hover:bg-amber-800/5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Frame
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0e0e11] border border-zinc-850 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 text-zinc-100 font-sans overflow-y-auto max-h-[90vh]">
            {/* Close button */}
            <button 
              onClick={() => setShowPricingModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono uppercase shadow-md shadow-emerald-500/5">
                <Sparkles className="h-3 w-3" /> PRICING PLANS
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Flexible Plans for Every Changemaker</h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">Support sustainable growth, access predictive AI tools, and verify high-trust corporate sponsorships.</p>
            </div>

            {/* Three Tiers Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              {/* Card 1: Volunteer */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-all space-y-5">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">Volunteer Core</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white font-mono">$0</span>
                    <span className="text-zinc-500 text-xs">/ forever</span>
                  </div>
                  <p className="text-zinc-400 text-xs">Essential tracking tools for individual volunteers looking to make a local impact.</p>
                  
                  <div className="h-px bg-zinc-800/80 my-4" />
                  
                  <ul className="space-y-2 text-xs text-zinc-350">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Explore local campaigns & opportunities</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Log certified volunteer hours</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Basic community discussion forum</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => { setActiveView("auth"); setShowPricingModal(false); }}
                  className="w-full py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Get Started Free
                </button>
              </div>

              {/* Card 2: NGO Alliance (Highlighted) */}
              <div className="bg-zinc-900/60 border-2 border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 transition-all relative space-y-5 shadow-xl shadow-emerald-950/20">
                <div className="absolute top-0 right-5 transform -translate-y-1/2">
                  <span className="bg-emerald-500 text-zinc-950 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-lg shadow-emerald-500/20 font-mono">POPULAR</span>
                </div>
                <div className="space-y-3">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">NGO Growth</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white font-mono">$49</span>
                    <span className="text-zinc-500 text-xs">/ month</span>
                  </div>
                  <p className="text-zinc-400 text-xs">Advanced features for licensed non-profit organizations to scale and verify trust.</p>
                  
                  <div className="h-px bg-zinc-800/80 my-4" />
                  
                  <ul className="space-y-2 text-xs text-zinc-350">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Unlimited campaign scheduling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Fiduciary Stripe payment gateway</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Accredited 501(c)(3) certificate issuing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Featured listing in Search Directory</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => { setActiveView("auth"); setShowPricingModal(false); }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/10 cursor-pointer transition-all"
                >
                  Join NGO Alliance
                </button>
              </div>

              {/* Card 3: Enterprise CSR */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-all space-y-5">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">Corporate CSR</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white font-mono">$199</span>
                    <span className="text-zinc-500 text-xs">/ month</span>
                  </div>
                  <p className="text-zinc-400 text-xs">The ultimate hub for medium-to-large enterprises looking to streamline corporate social responsibility.</p>
                  
                  <div className="h-px bg-zinc-800/80 my-4" />
                  
                  <ul className="space-y-2 text-xs text-zinc-350">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Corporate tax exemption auditing reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Team volunteer hour ledgers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Custom budget & impact telemetry dashboards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Priority support desk 24/7</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => { setActiveView("auth"); setShowPricingModal(false); }}
                  className="w-full py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Contact CSR Relations
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
